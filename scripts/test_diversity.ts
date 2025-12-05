import { generateSuggestions } from '../src/lib/analyzer';

// Mock data based on user's example
const mockData = Array.from({ length: 50 }, (_, i) => ({
    Tarih: new Date(2025, 0, i + 1).toISOString(),
    Kategori: ['Elektronik', 'Giyim', 'Ev Dekorasyon'][i % 3],
    Bölge: ['Marmara', 'Ege', 'İç Anadolu'][i % 3],
    Satis_Miktari: Math.floor(Math.random() * 5000) + 10,
    Kar: Math.floor(Math.random() * 1200) - 50
}));

const suggestions = generateSuggestions(mockData);

console.log(`Generated ${suggestions.length} suggestions.`);
console.log("Chart Types:");
suggestions.forEach((s, i) => {
    console.log(`${i + 1}. ${s.best_chart_type} - ${s.title}`);
});

const uniqueTypes = new Set(suggestions.map(s => s.best_chart_type));
console.log(`\nUnique Chart Types: ${uniqueTypes.size}`);

if (uniqueTypes.size < 8) {
    console.error("FAIL: Not enough diversity.");
    process.exit(1);
} else {
    console.log("PASS: Diversity check passed.");
}
