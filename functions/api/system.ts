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
			completed: 47,
			failed: 3,
			verified: 38,
		},
		agents_config: { max_agents: 16, subagent_model: "claude-sonnet-4-6" },
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
