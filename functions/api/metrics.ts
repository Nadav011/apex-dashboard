const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://hydra-dashboard.pages.dev",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		total_dispatches: 312,
		top_agents: [
			{ name: "code-reviewer", count: 48 },
			{ name: "test-generator", count: 42 },
			{ name: "gsd-executor", count: 38 },
			{ name: "architect", count: 27 },
			{ name: "security-auditor", count: 24 },
			{ name: "bundle-analyzer", count: 19 },
			{ name: "rtl-fixer", count: 17 },
			{ name: "migration", count: 14 },
			{ name: "devops", count: 12 },
			{ name: "autonomous-optimization", count: 11 },
		],
		top_projects: [
			{ name: "mexicani", count: 82 },
			{ name: "sportchat", count: 41 },
			{ name: "shifts", count: 38 },
			{ name: "Z", count: 31 },
			{ name: "mediflow", count: 28 },
			{ name: "hatumdigital", count: 22 },
			{ name: "brain", count: 18 },
			{ name: "nadavai", count: 12 },
		],
		provider_events: [
			{ provider: "codex", event: "success", count: 54 },
			{ provider: "codex", event: "error", count: 6 },
			{ provider: "gemini", event: "success", count: 48 },
			{ provider: "gemini", event: "error", count: 9 },
			{ provider: "kimi", event: "success", count: 36 },
			{ provider: "kimi", event: "error", count: 12 },
			{ provider: "minimax", event: "success", count: 28 },
			{ provider: "minimax", event: "error", count: 8 },
		],
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
