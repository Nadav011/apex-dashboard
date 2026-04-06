/**
 * CF Pages catch-all proxy function.
 * Forwards /api/* requests to the real dashboard API via CF Tunnel.
 * Runs server-side on Cloudflare's edge — bypasses CF Access restrictions.
 */

interface Env {
	API_ORIGIN: string;
}

const DEFAULT_ORIGIN = "https://api.nadavc.ai";

export const onRequest: PagesFunction<Env> = async (context) => {
	const url = new URL(context.request.url);
	const apiPath = url.pathname; // e.g., /api/system
	const origin = context.env.API_ORIGIN || DEFAULT_ORIGIN;
	const target = `${origin}${apiPath}${url.search}`;

	try {
		const resp = await fetch(target, {
			method: context.request.method,
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "APEX-Dashboard-Proxy/1.0",
			},
			body: context.request.method !== "GET" ? context.request.body : undefined,
		});

		const body = await resp.text();
		return new Response(body, {
			status: resp.status,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-cache",
				"Access-Control-Allow-Origin": url.origin,
				"Access-Control-Allow-Credentials": "true",
			},
		});
	} catch (err) {
		return new Response(
			JSON.stringify({
				error: "API proxy failed",
				detail: String(err),
			}),
			{
				status: 502,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
};
