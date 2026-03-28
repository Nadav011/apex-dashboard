const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		sites: [
			{
				name: "mexicani",
				url: "https://mexicani.pages.dev",
				platform: "cloudflare",
				status: "up",
				http_status: 200,
				response_ms: 142,
				checked_at: "2026-03-26T10:00:00Z",
				error: null,
			},
			{
				name: "chance-pro",
				url: "https://chance-pro.pages.dev",
				platform: "cloudflare",
				status: "up",
				http_status: 200,
				response_ms: 138,
				checked_at: "2026-03-26T10:00:00Z",
				error: null,
			},
			{
				name: "nadavai",
				url: "https://nadavai.pages.dev",
				platform: "cloudflare",
				status: "up",
				http_status: 200,
				response_ms: 155,
				checked_at: "2026-03-26T10:00:00Z",
				error: null,
			},
			{
				name: "shifts",
				url: "https://mexicani-shifts.pages.dev",
				platform: "cloudflare",
				status: "up",
				http_status: 200,
				response_ms: 148,
				checked_at: "2026-03-26T10:00:00Z",
				error: null,
			},
			{
				name: "hatumdigital",
				url: "https://hatumdigital.pages.dev",
				platform: "cloudflare",
				status: "up",
				http_status: 200,
				response_ms: 161,
				checked_at: "2026-03-26T10:00:00Z",
				error: null,
			},
			{
				name: "brain",
				url: "https://brain.pages.dev",
				platform: "cloudflare",
				status: "up",
				http_status: 200,
				response_ms: 133,
				checked_at: "2026-03-26T10:00:00Z",
				error: null,
			},
			{
				name: "cash",
				url: "https://z-cash.pages.dev",
				platform: "cloudflare",
				status: "up",
				http_status: 200,
				response_ms: 145,
				checked_at: "2026-03-26T10:00:00Z",
				error: null,
			},
			{
				name: "signature-pro",
				url: "https://signature-pro.pages.dev",
				platform: "cloudflare",
				status: "up",
				http_status: 200,
				response_ms: 139,
				checked_at: "2026-03-26T10:00:00Z",
				error: null,
			},
			{
				name: "mediflow",
				url: "https://mediflow.netlify.app",
				platform: "netlify",
				status: "down",
				http_status: 404,
				response_ms: 210,
				checked_at: "2026-03-26T10:00:00Z",
				error: "HTTP 404",
			},
		],
		total: 9,
		up_count: 8,
		down_count: 1,
		checked_at: "2026-03-26T10:00:00Z",
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
