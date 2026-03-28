const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "https://hydra-dashboard.pages.dev",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		templates: [
			{
				file: "ci-vite-react.yml",
				name: "CI — Vite + React",
				size_kb: 8.4,
				lines: 210,
			},
			{ file: "ci-nextjs.yml", name: "CI — Next.js", size_kb: 7.9, lines: 195 },
			{
				file: "ci-flutter.yml",
				name: "CI — Flutter",
				size_kb: 6.2,
				lines: 158,
			},
			{
				file: "deploy-cf-pages.yml",
				name: "Deploy — CF Pages",
				size_kb: 3.1,
				lines: 78,
			},
			{
				file: "deploy-netlify.yml",
				name: "Deploy — Netlify",
				size_kb: 2.8,
				lines: 72,
			},
			{
				file: "bundle-check.yml",
				name: "Bundle Check",
				size_kb: 2.2,
				lines: 55,
			},
			{
				file: "lighthouse-ci.yml",
				name: "Lighthouse CI",
				size_kb: 2.5,
				lines: 62,
			},
			{
				file: "trivy-autofix.yml",
				name: "Trivy CVE Auto-fix",
				size_kb: 3.4,
				lines: 85,
			},
		],
		count: 8,
		path: "/home/nadavcohen/ci-standards",
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
