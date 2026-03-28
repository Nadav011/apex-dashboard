const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		servers: [
			{
				name: "context7",
				source: "~/.mcp.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "github",
				source: "~/.mcp.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "playwright",
				source: "~/.mcp.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "supabase",
				source: "~/.mcp.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "claude-mem",
				source: "~/.mcp.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "browserstack",
				source: "~/.mcp.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "minimax",
				source: "~/.mcp.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "telegram",
				source: "settings.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "firebase",
				source: "settings.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "serena",
				source: "settings.json",
				enabled: true,
				transport: "stdio",
			},
			{
				name: "chroma",
				source: "settings.json",
				enabled: false,
				transport: "stdio",
			},
			{
				name: "sentry",
				source: "settings.json",
				enabled: true,
				transport: "stdio",
				description: "Sentry error tracking MCP",
			},
		],
		mcpize_servers: [
			{
				name: "hydra-router",
				status: "live",
				description: "MCPize: Hydra task routing as MCP tool",
			},
			{
				name: "auap-builder",
				status: "live",
				description: "MCPize: AUAP briefing builder as MCP tool",
			},
			{
				name: "rtl-fixer",
				status: "live",
				description: "MCPize: RTL auto-fix as MCP tool",
			},
		],
		total: 12,
		enabled: 11,
		disabled: 1,
		mcpize_count: 3,
		plugins_count: 19,
		profile: "unified",
		profiles: ["unified", "lean", "ui", "flutter", "convex", "minimal"],
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
