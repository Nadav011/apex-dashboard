const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://hydra-dashboard.pages.dev",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		total: 128,
		by_event: {
			PreToolUse: 24,
			PostToolUse: 18,
			Stop: 12,
			UserPromptSubmit: 8,
			SessionStart: 6,
			PostCompact: 4,
		},
		recent: [
			{
				hook: "anti-premature-completion.sh",
				duration_ms: 12,
				ts: "2026-03-26T10:04:55Z",
			},
			{
				hook: "post-edit-format.sh",
				duration_ms: 45,
				ts: "2026-03-26T10:04:30Z",
			},
			{
				hook: "post-edit-typecheck.sh",
				duration_ms: 820,
				ts: "2026-03-26T10:04:10Z",
			},
			{
				hook: "prerequisite-check.sh",
				duration_ms: 8,
				ts: "2026-03-26T10:03:50Z",
			},
			{
				hook: "knowledge-capture.sh",
				duration_ms: 22,
				ts: "2026-03-26T10:03:20Z",
			},
		],
		files: [
			"anti-premature-completion.sh",
			"post-compact-reinject.sh",
			"prerequisite-check.sh",
			"post-edit-format.sh",
			"post-edit-typecheck.sh",
			"auto-tmux-dev.sh",
			"check-console-log.sh",
			"tool-guard-hybrid.py",
			"knowledge-capture.sh",
			"correction-detector.sh",
			"dispatch-auto-log.sh",
			"context-compact-guard.py",
			"dispatch-command-guard.sh",
			"session-create-task-file.sh",
			"capture-user-request.sh",
		],
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
