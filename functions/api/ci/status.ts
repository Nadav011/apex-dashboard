const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		repos: [
			{
				name: "Mexicani",
				full_name: "Nadav011/Mexicani",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-26T09:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/Mexicani/actions/runs/1",
					},
				],
			},
			{
				name: "mexicani-shifts",
				full_name: "Nadav011/mexicani-shifts",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-26T08:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/mexicani-shifts/actions/runs/2",
					},
				],
			},
			{
				name: "Z",
				full_name: "Nadav011/Z",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-25T22:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/Z/actions/runs/3",
					},
				],
			},
			{
				name: "hatumdigital",
				full_name: "Nadav011/hatumdigital",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-25T20:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/hatumdigital/actions/runs/4",
					},
				],
			},
			{
				name: "brain",
				full_name: "Nadav011/brain",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-25T18:00:00Z",
						headBranch: "master",
						url: "https://github.com/Nadav011/brain/actions/runs/5",
					},
				],
			},
			{
				name: "vibechat",
				full_name: "Nadav011/vibechat",
				runs: [
					{
						status: "completed",
						conclusion: "failure",
						name: "CI",
						createdAt: "2026-03-25T16:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/vibechat/actions/runs/6",
					},
				],
			},
			{
				name: "sportchat-ultimate",
				full_name: "Nadav011/sportchat-ultimate",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-25T14:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/sportchat-ultimate/actions/runs/7",
					},
				],
			},
			{
				name: "nadavai",
				full_name: "Nadav011/nadavai",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-25T12:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/nadavai/actions/runs/8",
					},
				],
			},
			{
				name: "signature-pro",
				full_name: "Nadav011/signature-pro",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-25T10:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/signature-pro/actions/runs/9",
					},
				],
			},
			{
				name: "chance-pro",
				full_name: "Nadav011/chance-pro",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-25T08:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/chance-pro/actions/runs/10",
					},
				],
			},
			{
				name: "design-system",
				full_name: "Nadav011/design-system",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-24T22:00:00Z",
						headBranch: "main",
						url: "https://github.com/Nadav011/design-system/actions/runs/11",
					},
				],
			},
			{ name: "my-video", full_name: "Nadav011/my-video", runs: [] },
			{
				name: "israeli-finance-app",
				full_name: "Nadav011/israeli-finance-app",
				runs: [
					{
						status: "completed",
						conclusion: "success",
						name: "CI",
						createdAt: "2026-03-24T18:00:00Z",
						headBranch: "master",
						url: "https://github.com/Nadav011/israeli-finance-app/actions/runs/12",
					},
				],
			},
		],
		summary: {
			total: 13,
			passing: 11,
			failing: 1,
			unknown: 1,
			last_check: "2026-03-26T10:00:00Z",
		},
		updated_at: "2026-03-26T10:00:00Z",
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
