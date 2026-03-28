const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		sync: {
			synced: true,
			last_sync: "2026-03-26T08:00:00Z",
			drift: [],
		},
		syncStatus: {
			status: "in_sync",
			last_push: "2026-03-26T08:00:00Z",
			last_pull: "2026-03-26T07:55:00Z",
		},
		lenovoStatus: {
			reachable: true,
			hostname: "lenovo",
			load_avg: [1.2, 1.5, 1.8],
		},
		config_sync_targets: {
			count: 6,
			list: ["gemini", "codex", "kimi", "minimax", "MSI", "pop-os"],
			last_sync: "2026-03-28T08:00:00Z",
			status: "in_sync",
		},
		kiro_junie_sync: {
			kiro_hooks: 15,
			junie_skills: 15,
			last_sync: "2026-03-28T08:00:00Z",
			status: "synced",
		},
		crossSync: {
			pop_os: {
				gemini: {
					rules_synced: true,
					file_count: 8,
					rules_dir: "/home/nadavcohen/.gemini/rules",
				},
				codex: {
					rules_synced: true,
					file_count: 8,
					rules_dir: "/home/nadavcohen/.codex/rules",
				},
				kimi: {
					rules_synced: true,
					file_count: 6,
					rules_dir: "/home/nadavcohen/.kimi/rules",
				},
				minimax: {
					rules_synced: true,
					file_count: 5,
					rules_dir: "/home/nadavcohen/.minimax/rules",
				},
			},
			lenovo: {
				gemini: {
					rules_synced: true,
					file_count: 8,
					rules_dir: "/home/nadavcohen/.gemini/rules",
				},
				codex: {
					rules_synced: true,
					file_count: 8,
					rules_dir: "/home/nadavcohen/.codex/rules",
				},
				kimi: {
					rules_synced: false,
					file_count: 0,
					rules_dir: "/home/nadavcohen/.kimi/rules",
				},
				minimax: {
					rules_synced: false,
					file_count: 0,
					rules_dir: "/home/nadavcohen/.minimax/rules",
				},
			},
			diff: [
				"Lenovo: kimi rules not synced",
				"Lenovo: minimax rules not synced",
			],
		},
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
