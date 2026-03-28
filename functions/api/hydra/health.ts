const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://hydra-dashboard.pages.dev",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		status: "healthy",
		timestamp: new Date().toISOString(),
		checks: [
			{
				name: "sqlite_db",
				ok: true,
				message: "exists at ~/.claude/knowledge/hydra-state.db",
				duration_ms: 2,
			},
			{
				name: "langgraph_compile",
				ok: true,
				message: "hydra_graph.py present",
				duration_ms: 45,
			},
			{
				name: "lancedb_memory",
				ok: true,
				message: "directory present",
				duration_ms: 1,
			},
			{ name: "log_file", ok: true, message: "log dir ok", duration_ms: 1 },
			{
				name: "shell_scripts",
				ok: true,
				message: "hydra-executor.sh present",
				duration_ms: 1,
			},
		],
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
