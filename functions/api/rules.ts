const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://hydra-dashboard.pages.dev",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		rules: [
			{
				name: "auto-learned-rules.md",
				path: "rules/quality/auto-learned-rules.md",
				category: "quality",
				size_kb: 44.2,
				last_modified: "2026-03-26T10:00:00Z",
			},
			{
				name: "auto-learned-rules-archive.md",
				path: "rules/quality/auto-learned-rules-archive.md",
				category: "quality",
				size_kb: 22.8,
				last_modified: "2026-03-25T20:00:00Z",
			},
			{
				name: "code-quality.md",
				path: "rules/quality/code-quality.md",
				category: "quality",
				size_kb: 4.1,
				last_modified: "2026-03-20T00:00:00Z",
			},
			{
				name: "past-mistakes.md",
				path: "rules/quality/past-mistakes.md",
				category: "quality",
				size_kb: 38.6,
				last_modified: "2026-03-26T08:00:00Z",
			},
			{
				name: "rtl-i18n.md",
				path: "rules/quality/rtl-i18n.md",
				category: "quality",
				size_kb: 2.9,
				last_modified: "2026-03-20T00:00:00Z",
			},
			{
				name: "verification.md",
				path: "rules/quality/verification.md",
				category: "quality",
				size_kb: 5.8,
				last_modified: "2026-03-20T00:00:00Z",
			},
			{
				name: "security.md",
				path: "rules/security/security.md",
				category: "security",
				size_kb: 9.4,
				last_modified: "2026-03-25T00:00:00Z",
			},
			{
				name: "ai-security.md",
				path: "rules/security/ai-security.md",
				category: "security",
				size_kb: 7.2,
				last_modified: "2026-03-25T00:00:00Z",
			},
			{
				name: "audit-gates.md",
				path: "rules/verification/audit-gates.md",
				category: "verification",
				size_kb: 3.5,
				last_modified: "2026-03-20T00:00:00Z",
			},
			{
				name: "hydra-v2-rules.md",
				path: "rules/infra/hydra-v2-rules.md",
				category: "infra",
				size_kb: 18.4,
				last_modified: "2026-03-26T10:00:00Z",
			},
			{
				name: "ops-rules.md",
				path: "rules/infra/ops-rules.md",
				category: "infra",
				size_kb: 24.7,
				last_modified: "2026-03-26T08:00:00Z",
			},
			{
				name: "stack-rules.md",
				path: "rules/infra/stack-rules.md",
				category: "infra",
				size_kb: 12.3,
				last_modified: "2026-03-25T00:00:00Z",
			},
		],
		total: 12,
		categories: { quality: 6, security: 2, verification: 1, infra: 3 },
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
