const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		exists: true,
		line_count: 120,
		last_modified: "2026-03-26T10:00:00Z",
		sections: [
			"User Preferences",
			"System Counts",
			"Custom Learning Pipeline",
			"Key Technical Learnings",
			"Multi-Model Dispatch",
			"GSD Configuration",
			"Infrastructure State",
			"MCP Profiles",
			"MiniMax Direct API",
			"BrowserStack",
		],
		knowledge_files: 62,
		rules_files: 11,
		rules_count: 11,
		lancedb: {
			path: "~/.claude/knowledge/lancedb_memory",
			exists: true,
		},
		beads_jsonl: {
			path: "~/.claude/knowledge/beads.jsonl",
			exists: true,
		},
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
