/** Lightweight bigram fuzzy search — no dependencies */
export function fuzzyScore(query: string, text: string): number {
	if (!query) return 0;
	const q = query.toLowerCase();
	const t = text.toLowerCase();

	// Exact substring match = highest score
	if (t.includes(q)) return 100 + q.length;

	// Bigram overlap
	const qBigrams = bigrams(q);
	const tBigrams = bigrams(t);
	if (qBigrams.size === 0) return 0;

	let overlap = 0;
	for (const b of qBigrams) {
		if (tBigrams.has(b)) overlap++;
	}

	return (overlap / qBigrams.size) * 80;
}

function bigrams(s: string): Set<string> {
	const set = new Set<string>();
	for (let i = 0; i < s.length - 1; i++) {
		set.add(s.slice(i, i + 2));
	}
	return set;
}

export interface SearchResult<T> {
	item: T;
	score: number;
}

export function fuzzySearch<T>(
	items: T[],
	query: string,
	getText: (item: T) => string[],
	minScore = 20,
): SearchResult<T>[] {
	if (!query.trim()) return items.map((item) => ({ item, score: 0 }));

	return items
		.map((item) => {
			const texts = getText(item);
			const score = Math.max(...texts.map((t) => fuzzyScore(query, t)));
			return { item, score };
		})
		.filter((r) => r.score >= minScore)
		.sort((a, b) => b.score - a.score);
}
