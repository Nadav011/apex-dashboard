const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://hydra-dashboard.pages.dev",
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
		],
		total: 11,
		enabled: 10,
		disabled: 1,
		plugins_count: 19,
		profile: "unified",
		profiles: ["unified", "lean", "ui", "flutter", "convex", "minimal"],
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
