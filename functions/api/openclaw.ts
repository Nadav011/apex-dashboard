const CORS_HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	Vary: "Origin",
};

export const onRequestGet: PagesFunction = async () => {
	const data = {
		skills: 86,
		version: "v2026.3.28",
		path: "/home/nadavcohen/.openclaw",
		skills_list: [
			{
				name: "code-reviewer",
				slug: "code-reviewer",
				description: "L10+ 16-dimension code review",
				version: "3.2.0",
				tags: ["quality", "review"],
				size_kb: 18.4,
			},
			{
				name: "adversarial-review",
				slug: "adversarial-review",
				description: "Adversarial security review",
				version: "2.1.0",
				tags: ["security", "review"],
				size_kb: 12.2,
			},
			{
				name: "reality-checker",
				slug: "reality-checker",
				description: "Reality check — verify claims",
				version: "1.8.0",
				tags: ["quality"],
				size_kb: 8.6,
			},
			{
				name: "edge-case-hunter",
				slug: "edge-case-hunter",
				description: "Hunt edge cases in code",
				version: "1.5.0",
				tags: ["quality", "testing"],
				size_kb: 9.1,
			},
			{
				name: "brainstorming",
				slug: "brainstorming",
				description: "Structured brainstorming session",
				version: "2.0.0",
				tags: ["ideation"],
				size_kb: 11.3,
			},
			{
				name: "implement-playground",
				slug: "implement-playground",
				description: "1:1 playground implementation",
				version: "1.4.0",
				tags: ["ui", "frontend"],
				size_kb: 14.8,
			},
			{
				name: "ui-shadcn",
				slug: "ui-shadcn",
				description: "shadcn/ui component generation",
				version: "1.2.0",
				tags: ["ui"],
				size_kb: 7.2,
			},
			{
				name: "security-rules",
				slug: "security-rules",
				description: "Security rules on-demand",
				version: "2.3.0",
				tags: ["security"],
				size_kb: 6.5,
			},
			{
				name: "flutter-rules",
				slug: "flutter-rules",
				description: "Flutter 2026 rules on-demand",
				version: "1.9.0",
				tags: ["flutter", "mobile"],
				size_kb: 5.8,
			},
			{
				name: "testing-rules",
				slug: "testing-rules",
				description: "Testing rules on-demand",
				version: "1.6.0",
				tags: ["testing"],
				size_kb: 5.3,
			},
		],
		conductor_skills: [
			"conductor-setup",
			"conductor-implement",
			"conductor-review",
			"conductor-revert",
			"conductor-newTrack",
			"conductor-status",
		],
		new_skills_mar28: [
			"rtl-fix",
			"conductor-setup",
			"conductor-implement",
			"conductor-review",
			"conductor-revert",
			"conductor-newTrack",
			"conductor-status",
			"deep-project",
			"deep-plan",
			"deep-implement",
			"superpowers",
			"claude-mem",
		],
		subagents: [
			{
				name: "gsd-executor",
				path: "/home/nadavcohen/.openclaw/subagents/gsd-executor",
			},
			{
				name: "gsd-verifier",
				path: "/home/nadavcohen/.openclaw/subagents/gsd-verifier",
			},
			{
				name: "code-reviewer",
				path: "/home/nadavcohen/.openclaw/subagents/code-reviewer",
			},
			{
				name: "rtl-fixer",
				path: "/home/nadavcohen/.openclaw/subagents/rtl-fixer",
			},
		],
		subagents_count: 4,
	};

	return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction = async () =>
	new Response(null, { status: 204, headers: CORS_HEADERS });
