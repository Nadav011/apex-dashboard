const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		providers: {
			codex: {
				score: 0.857,
				successes: 5,
				failures: 1,
				total: 6,
				last_updated: "2026-03-26T10:00:00Z",
			},
			gemini: {
				score: 0.8,
				successes: 4,
				failures: 1,
				total: 5,
				last_updated: "2026-03-26T09:30:00Z",
			},
			kimi: {
				score: 0.75,
				successes: 3,
				failures: 1,
				total: 4,
				last_updated: "2026-03-25T22:00:00Z",
			},
			minimax: {
				score: 0.667,
				successes: 2,
				failures: 1,
				total: 3,
				last_updated: "2026-03-25T18:00:00Z",
			},
		},
		version: "1.2.0",
		created_at: "2026-03-20T00:00:00Z",
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
