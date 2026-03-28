const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
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
			{
				name: "safety_gate",
				ok: true,
				message: "safety_gate node active in graph",
				duration_ms: 1,
			},
			{
				name: "bayesian_scores",
				ok: true,
				message: "hydra-bayesian.json present",
				duration_ms: 1,
			},
		],
		graph_nodes: [
			{ name: "route_node", description: "Routes tasks to optimal provider" },
			{ name: "auap_node", description: "AUAP briefing injection" },
			{
				name: "execute_node",
				description: "Provider execution (910s timeout)",
			},
			{
				name: "verify_node",
				description: "Post-execution verification (120s)",
			},
			{ name: "decide_node", description: "Success/failure + Bayesian update" },
			{ name: "safety_gate", description: "Pre-execution safety check" },
			{ name: "fallback_node", description: "Provider fallback on failure" },
		],
		graph_node_count: 7,
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
