const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		ram: { total_gb: 64.0, used_gb: 22.4, free_gb: 41.6, pct: 35.0 },
		swap: { total_gb: 200.0, used_gb: 1.2, pct: 0.6 },
		disk: { total_gb: 512, used_gb: 210, free_gb: 302, pct: 41.0 },
		uptime: "12d 4h 33m",
		uptime_sec: 1056780,
		orphan_count: 0,
		earlyoom: "active",
		zram: { enabled: true, size_gb: 200, algorithm: "lz4", swappiness: 180 },
		hostname: "nadavcohen-system76",
		machine: "pop-os",
		tailscale_ip: "100.82.33.122",
		handoffs: {
			pending: 2,
			"in-progress": 1,
			completed: 26,
			failed: 35,
			verified: 35,
		},
		agents_config: { max_agents: 16, subagent_model: "claude-sonnet-4-6" },
		services: {
			total: 6,
			list: [
				{
					name: "hydra-dispatch",
					status: "active",
					pid_file: "fastapi_wrapper.py",
					port: 8742,
					description: "Hydra v2 FastAPI dispatcher",
				},
				{
					name: "hydra-watcher",
					status: "active",
					pid_file: "hydra_watcher.py",
					description: "Plan queue watcher (3 concurrent)",
				},
				{
					name: "hydra-ambient",
					status: "active",
					description: "Ambient receiver (Linear + webhooks)",
				},
				{
					name: "devbot",
					status: "active",
					description: "@NadavAGIbot Telegram bot (12 commands)",
				},
				{
					name: "cloudflared",
					status: "active",
					description: "CF Tunnel → apex-webhooks.nadavc.ai",
				},
				{
					name: "apex-dashboard",
					status: "active",
					description: "APEX Command Center (CF Pages)",
					url: "https://dashboard.nadavc.ai",
				},
			],
		},
		circuit_breaker: {
			status: "closed",
			tripped_count: 0,
			last_trip: null,
			tiers: 3,
			threshold_warn: 3,
			threshold_open: 5,
			threshold_critical: 10,
		},
		cf_tunnel: {
			status: "active",
			domain: "apex-webhooks.nadavc.ai",
			provider: "Cloudflare Tunnel",
			url: "https://apex-webhooks.nadavc.ai",
		},
		custom_domains: [
			{
				domain: "dashboard.nadavc.ai",
				type: "CF Pages custom domain",
				status: "active",
			},
			{
				domain: "api.nadavc.ai",
				type: "API endpoint",
				status: "active",
			},
			{
				domain: "webhooks.nadavc.ai",
				type: "CF Tunnel (webhook receiver)",
				status: "active",
			},
		],
		devbot: {
			status: "active",
			handle: "@NadavAGIbot",
			channel: "telegram",
			commands: 12,
			notifications_sent_today: 4,
			last_notification: "2026-03-28T08:12:00Z",
		},
		github_webhooks: {
			count: 12,
			target: "https://webhooks.nadavc.ai/github",
			events: ["push", "pull_request", "workflow_run", "issues"],
		},
		cron_jobs: [
			{
				name: "weekly-changelog",
				schedule: "0 9 * * MON",
				description: "git-cliff changelog generation",
			},
			{
				name: "daily-digest",
				schedule: "0 8 * * *",
				description: "Daily system digest via DevBot",
			},
			{
				name: "zombie-timer",
				schedule: "*/5 * * * *",
				description: "Zombie process cleanup every 5 min",
			},
		],
		apex_counts: {
			skills: 86,
			hooks_registered: 80,
			hooks_files: 82,
			agents: 52,
			rules_files: 11,
			plugins: 19,
			conductor_skills: 6,
			mcpize_servers: 3,
			github_repos: 4,
			cli_commands: 13,
			cross_tool_synced: 30,
		},
		apex_cli: {
			commands: 13,
			binary: "apex",
			repo: "Nadav011/apex-cli",
		},
		fsrs: {
			integrated: true,
			backend: "cognitive_memory.py",
			algorithm: "FSRS v5",
		},
		lancedb: {
			hybrid_search: true,
			algorithms: ["cosine", "BM25"],
			path: "~/.claude/knowledge/lancedb_memory",
		},
		langfuse: {
			integrated: true,
			status: "ready",
			note: "needs API keys to activate",
		},
		safety_policies: {
			engine: "Python",
			replaces: "OPA",
			policies: ["blast-radius", "scope-limit", "provider-guard"],
		},
		config_sync: {
			targets: 6,
			list: ["gemini", "codex", "kimi", "minimax", "MSI", "pop-os"],
		},
		kiro_junie: {
			kiro_hooks: 15,
			junie_skills: 15,
			synced: true,
		},
		hook_observability: {
			wired_hooks: 3,
			timing_tracked: true,
		},
		knowledge_capture: {
			loop_active: true,
			backend: "beads.jsonl + LanceDB",
		},
		scripts: {
			total: 14,
			fallbacks: 3,
			ci_templates: 7,
		},
		research_reports: {
			count: 8,
			range: "30-37",
			path: "~/.claude/projects/-home-nadavcohen/memory/research-apex-next/",
		},
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
