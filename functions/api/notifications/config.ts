const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		config: {
			token_set: true,
			chat_id_set: true,
			rules: {
				task_failed: true,
				health_critical: true,
				ram_high: true,
				lenovo_unreachable: true,
				daily_digest: true,
				ci_failure: true,
				deploy_success: true,
			},
		},
		devbot: {
			handle: "@NadavAGIbot",
			status: "active",
			commands: [
				"/status",
				"/tasks",
				"/dispatch",
				"/cancel",
				"/health",
				"/scores",
				"/logs",
				"/deploy",
				"/ci",
				"/memory",
				"/skills",
				"/help",
			],
			commands_count: 12,
		},
		ntfy: {
			topic: "apex-system",
			status: "active",
			description: "ntfy.sh push notifications",
		},
		daily_digest: {
			enabled: true,
			schedule: "0 8 * * *",
			includes: [
				"health_summary",
				"tasks_completed",
				"ci_status",
				"bayesian_scores",
			],
		},
		github_webhooks: {
			count: 12,
			target: "https://webhooks.nadavc.ai/github",
			events: ["push", "pull_request", "workflow_run", "issues"],
		},
		log: [
			{
				ts: "2026-03-26T09:00:00Z",
				event: "test",
				message: "בדיקת התראות עבדה! המערכת מחוברת.",
				sent: true,
			},
			{
				ts: "2026-03-25T22:30:00Z",
				event: "task_failed",
				message: "⚠️ משימה נכשלה: kimi-wave-12 (ספק: kimi)",
				sent: true,
			},
			{
				ts: "2026-03-25T18:00:00Z",
				event: "ram_high",
				message: "⚠️ RAM גבוה: 91%",
				sent: true,
			},
			{
				ts: "2026-03-24T10:00:00Z",
				event: "health_critical",
				message: "🔴 בדיקת בריאות קריטית: sqlite_db",
				sent: false,
			},
		],
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
