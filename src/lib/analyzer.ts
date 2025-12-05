import type { TopLevelSpec } from 'vega-lite';

export interface ColumnAnalysis {
    name: string;
    type: 'numeric' | 'categorical' | 'datetime' | 'boolean';
    uniqueCount: number;
}

export interface ChartSuggestion {
    id: string;
    title: string;
    best_chart_type: string;
    why: string;
    columns_used: string[];
    alternative_chart_types: string[];
    vega_lite_code: TopLevelSpec;
    sound_cue?: string;
    caveats?: string;
}

const isNumeric = (val: any) => !isNaN(parseFloat(val)) && isFinite(val);
const isDate = (val: any) => !isNaN(Date.parse(val));

export function analyzeColumns(data: any[]): Record<string, ColumnAnalysis> {
    if (!data || data.length === 0) return {};
    const columns = Object.keys(data[0]);
    const analysis: Record<string, ColumnAnalysis> = {};

    columns.forEach(col => {
        const values = data.map(d => d[col]);
        const definedValues = values.filter(v => v !== null && v !== undefined && v !== '');
        const unique = new Set(definedValues).size;

        let type: 'numeric' | 'categorical' | 'datetime' | 'boolean' = 'categorical';

        const numericCount = definedValues.filter(isNumeric).length;
        const dateCount = definedValues.filter(isDate).length;
        const total = definedValues.length;

        if (total > 0) {
            if (numericCount / total > 0.8) type = 'numeric';
            else if (dateCount / total > 0.8 && dateCount > numericCount) type = 'datetime';
        }

        analysis[col] = { name: col, type, uniqueCount: unique };
    });

    return analysis;
}

export function generateSuggestions(data: any[]): ChartSuggestion[] {
    const colAnalysis = analyzeColumns(data);
    const cols = Object.values(colAnalysis);
    const numericCols = cols.filter(c => c.type === 'numeric');
    const categoricalCols = cols.filter(c => c.type === 'categorical');
    const dateCols = cols.filter(c => c.type === 'datetime');

    const suggestions: ChartSuggestion[] = [];
    let count = 0;

    // Track used types to ensure diversity
    const usedTypes = new Set<string>();
    const add = (s: Omit<ChartSuggestion, 'id'>) => {
        // Basic deduplication logic: if we already have this chart type, 
        // we only add another if it uses completely different columns or we have very few suggestions.
        if (usedTypes.has(s.best_chart_type) && suggestions.length > 5) {
            // Allow max 2 of same type if total suggestion count is low, otherwise skip strict dupes
            // actually, let's just allow it but prioritize others first.
            // real logic: just push, we sort/filter later? 
            // user wants DIVERSITY. one of each best.
            return;
        }

        count++;
        suggestions.push({ id: `chart-${count}`, ...s });
        usedTypes.add(s.best_chart_type);
    };

    // STRATEGY: Prioritize Complex/Multivariate charts first to "use all data"

    // 1. Bubble Chart (3+ vars: 2 num, 1 cat/num size)
    if (numericCols.length >= 2 && categoricalCols.length > 0) {
        add({
            title: `Multivariate Analysis: ${numericCols[0].name} vs ${numericCols[1].name}`,
            best_chart_type: 'Bubble Chart',
            why: `high-dimensional view relating ${numericCols[0].name}, ${numericCols[1].name}, and ${categoricalCols[0].name}.`,
            columns_used: [numericCols[0].name, numericCols[1].name, numericCols[2]?.name || numericCols[0].name, categoricalCols[0].name],
            alternative_chart_types: ['Scatter Plot'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: 'circle',
                encoding: {
                    x: { field: numericCols[0].name, type: 'quantitative' },
                    y: { field: numericCols[1].name, type: 'quantitative' },
                    size: { field: numericCols[2]?.name || numericCols[0].name, type: 'quantitative' },
                    color: { field: categoricalCols[0].name, type: 'nominal' }
                }
            }
        });
    }

    // 2. Heatmap (3 vars: 2 cat, 1 num)
    if (categoricalCols.length >= 2 && numericCols.length > 0) {
        add({
            title: `Heatmap Distribution`,
            best_chart_type: 'Heatmap',
            why: `Intensity of ${numericCols[0].name} across ${categoricalCols[0].name} and ${categoricalCols[1].name}.`,
            columns_used: [categoricalCols[0].name, categoricalCols[1].name, numericCols[0].name],
            alternative_chart_types: ['Grouped Bar Chart'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: 'rect',
                encoding: {
                    x: { field: categoricalCols[0].name, type: 'nominal' },
                    y: { field: categoricalCols[1].name, type: 'nominal' },
                    color: { field: numericCols[0].name, aggregate: 'mean', type: 'quantitative' }
                }
            }
        });
    }

    // 3. Stacked Bar (Composition)
    if (categoricalCols.length >= 2 && numericCols.length > 0) {
        add({
            title: `Composition by ${categoricalCols[0].name}`,
            best_chart_type: 'Stacked Bar Chart',
            why: `Breakdown of ${numericCols[0].name} by ${categoricalCols[0].name} subdivisions.`,
            columns_used: [categoricalCols[0].name, categoricalCols[1].name, numericCols[0].name],
            alternative_chart_types: ['Grouped Bar Chart'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: { type: 'bar', tooltip: true },
                encoding: {
                    x: { field: categoricalCols[0].name, type: 'nominal' },
                    y: { field: numericCols[0].name, type: 'quantitative', aggregate: 'sum' },
                    color: { field: categoricalCols[1].name, type: 'nominal' }
                }
            }
        });
    }

    // 4. Line Chart (Time Series)
    if (dateCols.length > 0 && numericCols.length > 0) {
        const cat = categoricalCols[0];
        add({
            title: `Trend over Time`,
            best_chart_type: 'Line Chart',
            why: `Temporal evolution of ${numericCols[0].name}.`,
            columns_used: [dateCols[0].name, numericCols[0].name, ...(cat ? [cat.name] : [])],
            alternative_chart_types: ['Area Chart'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: { type: 'line', point: true },
                encoding: {
                    x: { field: dateCols[0].name, type: 'temporal' },
                    y: { field: numericCols[0].name, type: 'quantitative' },
                    color: cat ? { field: cat.name, type: 'nominal' } : undefined
                }
            }
        });
    }

    // 5. Grouped Bar (Comparison)
    if (categoricalCols.length >= 2 && numericCols.length > 0) {
        add({
            title: `Side-by-Side Comparison`,
            best_chart_type: 'Grouped Bar Chart',
            why: `Direct comparison of ${numericCols[0].name} across groups.`,
            columns_used: [categoricalCols[0].name, categoricalCols[1].name, numericCols[0].name],
            alternative_chart_types: ['Stacked Bar Chart'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: { type: 'bar', tooltip: true },
                encoding: {
                    x: { field: categoricalCols[0].name, type: 'nominal' },
                    y: { field: numericCols[0].name, type: 'quantitative', aggregate: 'sum' },
                    xOffset: { field: categoricalCols[1].name },
                    color: { field: categoricalCols[1].name }
                }
            }
        });
    }

    // 6. Scatter Plot (2 vars) - Only if Bubble didn't use same top vars, or if we have different numeric cols
    if (numericCols.length >= 2) {
        // Try to pick different columns if possible, else reuse top 2
        const n1 = numericCols[0];
        const n2 = numericCols[1];
        add({
            title: `${n1.name} vs ${n2.name}`,
            best_chart_type: 'Scatter Plot',
            why: `Correlation between ${n1.name} and ${n2.name}.`,
            columns_used: [n1.name, n2.name],
            alternative_chart_types: ['Bubble Chart'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: 'circle',
                encoding: {
                    x: { field: n1.name, type: 'quantitative', scale: { zero: false } },
                    y: { field: n2.name, type: 'quantitative', scale: { zero: false } },
                    color: categoricalCols.length > 0 ? { field: categoricalCols[0].name } : undefined
                }
            }
        });
    }

    // 7. Boxplot (Distribution & Outliers)
    if (numericCols.length > 0) {
        add({
            title: `Statistical Distribution of ${numericCols[0].name}`,
            best_chart_type: 'Boxplot',
            why: `Quartiles and median of ${numericCols[0].name}.`,
            columns_used: [numericCols[0].name, ...(categoricalCols.length > 0 ? [categoricalCols[0].name] : [])],
            alternative_chart_types: ['Violin Plot'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: { type: 'boxplot', extent: 'min-max' },
                encoding: {
                    x: categoricalCols.length > 0 ? { field: categoricalCols[0].name, type: 'nominal' } : undefined,
                    y: { field: numericCols[0].name, type: 'quantitative' },
                    color: categoricalCols.length > 0 ? { field: categoricalCols[0].name } : { value: '#10b981' }
                }
            }
        });
    }

    // 8. Donut Chart (Proportion)
    if (categoricalCols.length > 0 && numericCols.length > 0) {
        // Find a categorical col with few uniques for best donut
        const bestCat = categoricalCols.find(c => c.uniqueCount < 8) || categoricalCols[0];
        if (bestCat) {
            add({
                title: `${bestCat.name} Share`,
                best_chart_type: 'Donut Chart',
                why: `Market share/proportion of ${bestCat.name}.`,
                columns_used: [bestCat.name, numericCols[0].name],
                alternative_chart_types: ['Bar Chart'],
                vega_lite_code: {
                    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                    data: { values: data },
                    mark: { type: 'arc', innerRadius: 50 },
                    encoding: {
                        theta: { field: numericCols[0].name, aggregate: 'sum' },
                        color: { field: bestCat.name, type: 'nominal' }
                    }
                }
            });
        }
    }

    // 9. Histogram
    if (numericCols.length > 0) {
        // Use the numeric column that hasn't been main focus if possible
        const targetNum = numericCols[1] || numericCols[0];
        add({
            title: `Frequency of ${targetNum.name}`,
            best_chart_type: 'Histogram',
            why: `Distribution spread of ${targetNum.name}.`,
            columns_used: [targetNum.name],
            alternative_chart_types: ['Density Plot'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: 'bar',
                encoding: {
                    x: { field: targetNum.name, bin: true },
                    y: { aggregate: 'count' },
                    color: { value: '#8b5cf6' }
                }
            }
        });
    }

    // 10. Stacked Area (Trend Composition)
    if (dateCols.length > 0 && numericCols.length > 0 && categoricalCols.length > 0) {
        add({
            title: `Volume Trends by Category`,
            best_chart_type: 'Stacked Area Chart',
            why: `Evolution of ${numericCols[0].name} breakdown over time.`,
            columns_used: [dateCols[0].name, numericCols[0].name, categoricalCols[0].name],
            alternative_chart_types: ['Streamgraph'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: 'area',
                encoding: {
                    x: { field: dateCols[0].name, type: 'temporal' },
                    y: { field: numericCols[0].name, type: 'quantitative', stack: 'normalize' },
                    color: { field: categoricalCols[0].name }
                }
            }
        });
    }

    // 11. Bar Chart (Simple) - if we still need more or haven't done basic bar
    if (categoricalCols.length > 0 && numericCols.length > 0) {
        add({
            title: `${numericCols[0].name} by ${categoricalCols[0].name}`,
            best_chart_type: 'Bar Chart',
            why: `Simple comparison of ${numericCols[0].name}.`,
            columns_used: [categoricalCols[0].name, numericCols[0].name],
            alternative_chart_types: ['Lollipop Chart'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                mark: { type: 'bar', cornerRadiusEnd: 4 },
                encoding: {
                    x: { field: categoricalCols[0].name, type: 'nominal', sort: '-y' },
                    y: { field: numericCols[0].name, type: 'quantitative' },
                    color: { field: categoricalCols[0].name, legend: null }
                }
            }
        });
    }

    // 12. Density Plot
    if (numericCols.length > 0) {
        add({
            title: `${numericCols[0].name} Density Curve`,
            best_chart_type: 'Density Plot',
            why: `Smoothed probability distribution.`,
            columns_used: [numericCols[0].name],
            alternative_chart_types: ['Histogram'],
            vega_lite_code: {
                $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                data: { values: data },
                transform: [{ density: numericCols[0].name }],
                mark: 'area',
                encoding: {
                    x: { field: 'value', type: 'quantitative' },
                    y: { field: 'density', type: 'quantitative' },
                    color: { value: '#ec4899' }
                }
            }
        });
    }

    return suggestions;
}
