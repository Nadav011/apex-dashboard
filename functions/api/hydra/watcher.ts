const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://hydra-dashboard.pages.dev",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		events: [
			{
				ts: "2026-03-26T10:05:00Z",
				event: "task_completed",
				task_id: "mexicani-bundle-opt-2026-03-26",
				provider: "codex",
				rc: 0,
			},
			{
				ts: "2026-03-26T10:04:55Z",
				event: "hook_fire",
				message: "anti-premature-completion.sh",
			},
			{
				ts: "2026-03-26T09:55:00Z",
				event: "execute_start",
				task_id: "mexicani-bundle-opt-2026-03-26",
				provider: "codex",
			},
			{
				ts: "2026-03-26T09:45:00Z",
				event: "dispatch",
				task_id: "hydra-v2-full-build",
				provider: "gemini",
			},
			{
				ts: "2026-03-26T09:30:00Z",
				event: "task_completed",
				task_id: "hydra-v2-full-build",
				provider: "gemini",
				rc: 0,
			},
			{
				ts: "2026-03-26T09:20:00Z",
				event: "mcp_call",
				message: "context7: resolve-library-id",
			},
			{
				ts: "2026-03-26T08:00:00Z",
				event: "watcher_start",
				message: "hydra_watcher.py started with --sqlite",
			},
		],
		watcher_active: true,
		max_concurrent: 3,
		sqlite_mode: true,
		log_path: "/home/nadavcohen/.config/agents/logs/hydra-watcher.jsonl",
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
