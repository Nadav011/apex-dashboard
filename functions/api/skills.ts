const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		total: 79,
		categories: {
			code: 12,
			ui: 10,
			test: 9,
			security: 8,
			devops: 7,
			review: 6,
			flutter: 5,
			frontend: 5,
			backend: 5,
			ai: 4,
			mobile: 5,
			docs: 3,
		},
		plugins_count: 19,
		skills_list: [
			"code-reviewer",
			"adversarial-review",
			"reality-checker",
			"edge-case-hunter",
			"brainstorming",
			"implement-playground",
			"ui-shadcn",
			"security-rules",
			"flutter-rules",
			"testing-rules",
			"frontend-rules",
			"backend-rules",
			"ai-rules",
			"devops-rules",
			"mobile-mastery",
			"mobile-upgrade-2026",
			"a11y",
			"distillator",
			"shard-doc",
			"nuclear",
			"pdf",
			"commit",
			"review-pr",
			"harness-audit",
			"advanced-elicitation",
			"pwa-expert",
			"ui-colors",
			"ui-reactbits",
			"ui-icons",
			"flutter-audit",
		],
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
