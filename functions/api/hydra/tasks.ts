const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		tasks: [
			{
				id: "mexicani-bundle-opt-2026-03-26",
				status: "completed",
				steps: 10,
				checkpoints: 12,
				display_name: "mexicani-bundle-opt-2026-03-26",
			},
			{
				id: "sportchat-riverpod3-migration",
				status: "verified",
				steps: 8,
				checkpoints: 9,
				display_name: "sportchat-riverpod3-migration",
			},
			{
				id: "ci-standards-deploy-all-repos",
				status: "completed",
				steps: 11,
				checkpoints: 14,
				display_name: "ci-standards-deploy-all-repos",
			},
			{
				id: "hydra-v2-full-build",
				status: "verified",
				steps: 9,
				checkpoints: 10,
				display_name: "hydra-v2-full-build",
			},
			{
				id: "security-audit-all-rls",
				status: "completed",
				steps: 7,
				checkpoints: 8,
				display_name: "security-audit-all-rls",
			},
		],
		handoffs: {
			pending: 2,
			"in-progress": 1,
			completed: 47,
			failed: 3,
			verified: 38,
		},
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
