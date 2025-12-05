import { useState, useRef, useEffect } from 'react';
import embed from 'vega-embed';
import type { TopLevelSpec } from 'vega-lite';
import type { ChartSuggestion } from '../lib/analyzer';
import { BarChart, ChevronDown, ChevronUp, Play, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChartCardProps {
    suggestion: ChartSuggestion;
}

export function ChartCard({ suggestion }: ChartCardProps) {
    const [isRendered, setIsRendered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDraw = () => {
        setIsRendered(true);
    };

    useEffect(() => {
        if (isRendered && containerRef.current && suggestion.vega_lite_code) {
            const spec: TopLevelSpec = {
                ...suggestion.vega_lite_code,
                width: "container",
                height: 300,
                background: "transparent",
                config: {
                    axis: {
                        domainColor: "#475569",
                        tickColor: "#475569",
                        titleColor: "#94a3b8",
                        labelColor: "#cbd5e1",
                        gridColor: "#334155"
                    },
                    legend: {
                        labelColor: "#cbd5e1",
                        titleColor: "#94a3b8"
                    },
                    title: { color: "#f8fafc" },
                    view: { stroke: "transparent" }
                }
            };
            embed(containerRef.current, spec, { actions: false, renderer: 'svg' }).catch(console.error);
        }
    }, [isRendered, suggestion]);

    return (
        <div className="group relative flex flex-col rounded-2xl bg-slate-900 border border-slate-800 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 overflow-hidden">
            {/* Header / Info Section */}
            <div className="p-5 border-b border-slate-800/50">
                <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                        {suggestion.best_chart_type}
                    </span>
                    <button className="text-slate-500 hover:text-white transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>

                <h3 className="text-lg font-semibold text-slate-100 leading-tight mb-2">
                    {suggestion.title}
                </h3>

                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {suggestion.why}
                </p>

                <div className="flex gap-2 mt-4 text-xs text-slate-500 font-mono">
                    {suggestion.columns_used.map(col => (
                        <span key={col} className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                            {col}
                        </span>
                    ))}
                </div>
            </div>

            {/* Chart / Action Section */}
            <div className="relative w-full min-h-[320px] bg-slate-950/30 p-4 flex items-center justify-center">
                {!isRendered ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-[2px] z-10">
                        <button
                            onClick={handleDraw}
                            className="group/btn relative flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                        >
                            <Play className="w-4 h-4 fill-white" />
                            <span>Draw Chart</span>
                        </button>
                    </div>
                ) : null}

                <div ref={containerRef} className={cn("w-full h-full", !isRendered && "opacity-20 blur-sm")} />
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div>Visualizing {suggestion.columns_used.length} dimensions</div>
                <div className="flex gap-4">
                    <span className="hover:text-blue-400 cursor-pointer transition-colors">Alternative Types</span>
                    <span className="hover:text-blue-400 cursor-pointer transition-colors">Export Code</span>
                </div>
            </div>
        </div>
    );
}
