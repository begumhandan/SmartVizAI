import { ChartCard } from './ChartCard';
import type { ChartSuggestion } from '../lib/analyzer';

export function ChartGrid({ suggestions }: { suggestions: ChartSuggestion[] }) {
    if (suggestions.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500">No suitable charts found for this dataset.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {suggestions.map(s => (
                <ChartCard key={s.id} suggestion={s} />
            ))}
        </div>
    );
}
