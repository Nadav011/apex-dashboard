import {
	AlertTriangle,
	Bot,
	ChevronDown,
	ChevronUp,
	Code2,
	Database,
	Film,
	Globe,
	HardDrive,
	Info,
	Layers,
	MessageSquare,
	Monitor,
	Package,
	Play,
	Server,
	Shield,
	Smartphone,
	Sparkles,
	Terminal,
	Wifi,
	Wrench,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

// ── Shared primitives ─────────────────────────────────────────────────────────

function CodeBlock({
	children,
	inline = false,
}: {
	children: string;
	inline?: boolean;
}) {
	if (inline) {
		return (
			<code
				className="rounded px-1.5 py-0.5 text-xs font-mono text-[var(--color-accent-cyan)] bg-[var(--color-bg-primary)] border border-[var(--color-border)]"
				dir="ltr"
			>
				{children}
			</code>
		);
	}
	return (
		<pre
			className={cn(
				"rounded-lg px-4 py-3 text-xs font-mono overflow-x-auto",
				"bg-[var(--color-bg-primary)] text-[var(--color-accent-cyan)]",
				"border border-[var(--color-border)]",
			)}
			dir="ltr"
		>
			{children}
		</pre>
	);
}

function Badge({
	label,
	color = "var(--color-accent-blue)",
}: {
	label: string;
	color?: string;
}) {
	return (
		<span
			className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
			style={{
				background: `oklch(from ${color} l c h / 0.12)`,
				color,
				border: `1px solid oklch(from ${color} l c h / 0.3)`,
			}}
		>
			{label}
		</span>
	);
}

function SectionHeader({
	icon,
	title,
	subtitle,
	accentColor = "var(--color-accent-blue)",
}: {
	icon: React.ReactNode;
	title: string;
	subtitle?: string;
	accentColor?: string;
}) {
	return (
		<div className="flex items-center gap-3 mb-5">
			<span
				className="flex size-10 shrink-0 items-center justify-center rounded-xl"
				style={{
					background: `oklch(from ${accentColor} l c h / 0.15)`,
					color: accentColor,
					border: `1px solid oklch(from ${accentColor} l c h / 0.25)`,
				}}
				aria-hidden="true"
			>
				{icon}
			</span>
			<div>
				<h2 className="text-base font-bold text-[var(--color-text-primary)]">
					{title}
				</h2>
				{subtitle && (
					<p className="text-xs text-[var(--color-text-muted)] mt-0.5">
						{subtitle}
					</p>
				)}
			</div>
		</div>
	);
}

function InfoPill({
	label,
	value,
	color = "var(--color-text-muted)",
}: {
	label: string;
	value: React.ReactNode;
	color?: string;
}) {
	return (
		<div className="flex items-center justify-between py-1.5 border-b border-[var(--color-border)] last:border-0">
			<span className="text-xs text-[var(--color-text-secondary)]">
				{label}
			</span>
			<span className="text-xs font-mono font-semibold" style={{ color }}>
				{value}
			</span>
		</div>
	);
}

// ── Accordion ─────────────────────────────────────────────────────────────────

interface AccordionSectionProps {
	id: string;
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	accentColor?: string;
}

function AccordionSection({
	id,
	title,
	subtitle,
	icon,
	children,
	defaultOpen = false,
	accentColor = "var(--color-accent-blue)",
}: AccordionSectionProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div
			id={id}
			className={cn(
				"glass-card overflow-hidden transition-colors duration-200",
				open && "border-[var(--color-border-hover)]",
			)}
		>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				aria-expanded={open}
				className={cn(
					"w-full flex items-center gap-3 px-4 py-4",
					"transition-colors duration-150 cursor-pointer min-h-[60px] text-start",
					"hover:bg-[var(--color-bg-tertiary)]",
				)}
			>
				<span
					className="flex size-9 shrink-0 items-center justify-center rounded-lg"
					style={{
						background: `oklch(from ${accentColor} l c h / 0.15)`,
						color: accentColor,
					}}
					aria-hidden="true"
				>
					{icon}
				</span>
				<div className="flex-1 min-w-0">
					<div className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
						{title}
					</div>
					<div className="text-xs text-[var(--color-text-muted)] truncate">
						{subtitle}
					</div>
				</div>
				<span className="shrink-0 text-[var(--color-text-muted)]">
					{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</span>
			</button>

			{open && (
				<div className="border-t border-[var(--color-border)] px-4 py-5">
					{children}
				</div>
			)}
		</div>
	);
}

// ── Section 1 — מה זה MCP? ────────────────────────────────────────────────────

function WhatIsMcpSection() {
	return (
		<AccordionSection
			id="what-is-mcp"
			title="מה זה MCP?"
			subtitle="Model Context Protocol — הפרוטוקול שמחבר Claude לכלים חיצוניים"
			icon={<Info size={18} />}
			defaultOpen={true}
			accentColor="var(--color-accent-blue)"
		>
			<div className="space-y-5">
				{/* Intro paragraph */}
				<div className="rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-accent-blue)]/20 px-4 py-4">
					<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
						<span className="font-semibold text-[var(--color-accent-blue)]">
							Model Context Protocol (MCP)
						</span>{" "}
						הוא פרוטוקול פתוח שפיתחה Anthropic לחיבור בין מודלים שפתיים כמו
						Claude לבין כלים וסביבות חיצוניות. כל שרת MCP מספק{" "}
						<em>כלים (tools)</em> שקלוד יכול לקרוא להם — בדיוק כמו שאפשר לקרוא
						לפונקציה.
					</p>
				</div>

				{/* 3 core concepts */}
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{[
						{
							icon: <Server size={16} />,
							title: "שרת",
							desc: "תהליך נפרד שמספק כלים. רץ כ-child process (stdio) או כשרת HTTP.",
							color: "var(--color-accent-blue)",
						},
						{
							icon: <Zap size={16} />,
							title: "כלי (Tool)",
							desc: "פונקציה שקלוד יכול לקרוא לה: קריאת קבצים, שאילתות DB, ניווט דפדפן.",
							color: "var(--color-accent-green)",
						},
						{
							icon: <Layers size={16} />,
							title: "Transport",
							desc: "stdio — פקודת שורה שמתחברת ל-stdin/stdout. HTTP — סשן ארוך על פורט מקומי.",
							color: "var(--color-accent-amber)",
						},
					].map(({ icon, title, desc, color }) => (
						<div
							key={title}
							className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-3"
						>
							<div
								className="flex size-7 items-center justify-center rounded-md mb-2"
								style={{
									background: `oklch(from ${color} l c h / 0.15)`,
									color,
								}}
								aria-hidden="true"
							>
								{icon}
							</div>
							<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
								{title}
							</div>
							<div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
								{desc}
							</div>
						</div>
					))}
				</div>

				{/* Transport explanation */}
				<div className="space-y-2">
					<h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
						איך שרת MCP נפתח — דוגמה
					</h4>
					<CodeBlock>
						{`# stdio transport — Claude Code מפעיל את השרת כ-child process
/path/to/node /home/nadavcohen/.local/lib/mcp/context7/dist/index.js

# Claude שולח קריאות JSON-RPC דרך stdin וקורא תשובות מ-stdout
# {"method": "tools/call", "params": {"name": "query-docs", "arguments": {...}}}`}
					</CodeBlock>
				</div>

				{/* How tools work */}
				<div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 space-y-3">
					<h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
						מחזור חיים של קריאה לכלי
					</h4>
					<div className="flex flex-wrap gap-2 items-center" dir="ltr">
						{[
							"Claude מחליט לקרוא לכלי",
							"→",
							"Claude Code שולח JSON-RPC",
							"→",
							"שרת MCP מבצע",
							"→",
							"תוצאה מוחזרת",
							"→",
							"Claude ממשיך",
						].map((step) => (
							<span
								key={step}
								className={
									step === "→"
										? "text-[var(--color-text-muted)] text-sm"
										: "rounded-md px-2.5 py-1 text-xs font-medium bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
								}
							>
								{step}
							</span>
						))}
					</div>
					<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
						כל שרת MCP רץ בתהליך נפרד ומבודד. אם שרת קורס, Claude Code יודע
						לנסות מחדש. הכלים זמינים אוטומטית לקלוד בתחילת כל שיחה.
					</p>
				</div>
			</div>
		</AccordionSection>
	);
}

// ── Section 2 — MCP Profiles ──────────────────────────────────────────────────

const PROFILES = [
	{
		name: "unified",
		label: "unified (ברירת מחדל)",
		desc: "האיזון הנכון לרוב העבודה היומיומית.",
		servers: [
			"context7",
			"github",
			"playwright",
			"supabase",
			"claude-mem",
			"browserstack",
		],
		ramEst: "~600 MB",
		color: "var(--color-accent-blue)",
		isDefault: true,
	},
	{
		name: "lean",
		label: "lean",
		desc: "עבודה קלה, ניהול קבצים, שאלות מהירות. פחות RAM.",
		servers: ["context7", "claude-mem"],
		ramEst: "~120 MB",
		color: "var(--color-accent-green)",
		isDefault: false,
	},
	{
		name: "ui",
		label: "ui",
		desc: "ניפוי שגיאות CSS/JS בדפדפן. chrome-devtools מוסיף ~150 MB.",
		servers: ["context7", "github", "playwright", "chrome-devtools"],
		ramEst: "~450 MB",
		color: "var(--color-accent-amber)",
		isDefault: false,
	},
	{
		name: "flutter",
		label: "flutter",
		desc: "פיתוח Flutter/Dart. כולל כלים ל-Dart analysis.",
		servers: ["context7", "claude-mem", "flutter-tools"],
		ramEst: "~200 MB",
		color: "var(--color-accent-cyan)",
		isDefault: false,
	},
	{
		name: "ephemera",
		label: "ephemera",
		desc: "שרתים כבדי RAM — Playwright + BrowserStack.",
		servers: ["playwright", "browserstack"],
		ramEst: "~1.4 GB",
		color: "var(--color-accent-purple)",
		isDefault: false,
	},
	{
		name: "minimal",
		label: "minimal",
		desc: "מינימום מוחלט — context7 בלבד לדוקומנטציה.",
		servers: ["context7"],
		ramEst: "~80 MB",
		color: "var(--color-text-muted)",
		isDefault: false,
	},
];

function ProfilesSection() {
	const [active, setActive] = useState("unified");
	const selected = PROFILES.find((p) => p.name === active) ?? PROFILES[0];

	return (
		<AccordionSection
			id="mcp-profiles"
			title="פרופילי MCP"
			subtitle="mcp-toggle — מתג מהיר לסט שרתים שונה לפי המשימה"
			icon={<Layers size={18} />}
			defaultOpen={true}
			accentColor="var(--color-accent-purple)"
		>
			<div className="space-y-5">
				{/* Toggle command */}
				<div className="space-y-1.5">
					<p className="text-xs text-[var(--color-text-muted)] mb-2">
						פקודת המתג — הריצו בטרמינל
					</p>
					<CodeBlock>
						{`mcp-toggle unified|lean|ephemera|full|ui|flutter|convex|minimal|status`}
					</CodeBlock>
				</div>

				{/* Profile tabs */}
				<div>
					<div
						className="flex flex-wrap gap-2 mb-4"
						role="tablist"
						aria-label="פרופילי MCP"
					>
						{PROFILES.map((profile) => (
							<button
								key={profile.name}
								type="button"
								role="tab"
								aria-selected={active === profile.name}
								onClick={() => setActive(profile.name)}
								className={cn(
									"rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 min-h-8 cursor-pointer",
									active === profile.name
										? "text-[var(--color-text-primary)]"
										: "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]",
								)}
								style={
									active === profile.name
										? {
												background: `oklch(from ${profile.color} l c h / 0.18)`,
												color: profile.color,
												border: `1px solid oklch(from ${profile.color} l c h / 0.4)`,
											}
										: undefined
								}
							>
								{profile.name}
								{profile.isDefault && (
									<span className="ms-1 text-[10px] opacity-70">★</span>
								)}
							</button>
						))}
					</div>

					{/* Selected profile detail */}
					<div
						className="rounded-xl border p-4 space-y-4 transition-colors duration-200"
						style={{
							background: `oklch(from ${selected.color} l c h / 0.06)`,
							borderColor: `oklch(from ${selected.color} l c h / 0.25)`,
						}}
					>
						<div className="flex items-start justify-between gap-3">
							<div>
								<div
									className="text-sm font-bold mb-1"
									style={{ color: selected.color }}
								>
									{selected.label}
								</div>
								<div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
									{selected.desc}
								</div>
							</div>
							<div className="text-end shrink-0">
								<div
									className="text-xs font-mono font-semibold"
									style={{ color: selected.color }}
								>
									{selected.ramEst}
								</div>
								<div className="text-[10px] text-[var(--color-text-muted)]">
									RAM משוער
								</div>
							</div>
						</div>

						<div>
							<div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
								שרתים פעילים
							</div>
							<div className="flex flex-wrap gap-1.5">
								{selected.servers.map((srv) => (
									<Badge key={srv} label={srv} color={selected.color} />
								))}
							</div>
						</div>

						<div className="pt-1 border-t border-[var(--color-border)]">
							<CodeBlock>{`mcp-toggle ${selected.name}`}</CodeBlock>
						</div>
					</div>
				</div>

				{/* Note about status */}
				<div className="rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] px-4 py-3 flex gap-3">
					<Info
						size={15}
						className="text-[var(--color-accent-blue)] shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
						הריצו <CodeBlock inline>{"mcp-toggle status"}</CodeBlock> לראות אילו
						שרתים פעילים כרגע. שרתים מסוימים מושבתים בכוונה (
						<CodeBlock inline>{"chroma-mcp"}</CodeBlock> — bun env stripping).
						אל תתקנו אותם.
					</div>
				</div>
			</div>
		</AccordionSection>
	);
}

// ── Section 3 — שרתים פעילים ─────────────────────────────────────────────────

interface McpServerDef {
	id: string;
	name: string;
	pkg?: string;
	desc: string;
	icon: React.ReactNode;
	iconColor: string;
	tools: string[];
	ramFootprint: string;
	configPath: string;
	notes: string[];
	warning?: string;
}

const MCP_SERVERS: McpServerDef[] = [
	{
		id: "context7",
		name: "Context7",
		pkg: "@upstash/context7-mcp",
		desc: "חיפוש דוקומנטציה לכל ספרייה — React, Vite, Supabase, Flutter ועוד. מחזיר קוד עדכני עם הקשר מדויק.",
		icon: <Database size={18} />,
		iconColor: "var(--color-accent-blue)",
		tools: ["resolve-library-id", "get-library-docs", "query-docs"],
		ramFootprint: "~80 MB",
		configPath: "~/.local/lib/mcp/context7/dist/index.js",
		notes: [
			"השרת הנפוץ ביותר — זמין בכל הפרופילים",
			"מצריך חיבור אינטרנט לשליפת docs",
			"מחזיר snippets עם מספרי שורות ומקורות",
		],
	},
	{
		id: "github",
		name: "GitHub",
		pkg: "github-mcp-server@1.8.7",
		desc: "ניהול repos, PRs, issues, branches, releases. כולל חיפוש קוד ב-GitHub.",
		icon: <Code2 size={18} />,
		iconColor: "var(--color-accent-purple)",
		tools: [
			"search_repositories",
			"create_pull_request",
			"list_issues",
			"create_issue",
			"get_file_contents",
			"push_files",
		],
		ramFootprint: "~90 MB",
		configPath: "~/.local/lib/mcp/github/",
		notes: [
			"גרסה 1.8.7 — לא @modelcontextprotocol/server-github (deprecated!)",
			"מחייב GITHUB_PERSONAL_ACCESS_TOKEN ב-~/.bashrc לפני ה-interactive guard",
			"Disabled tools: create_or_update_file, delete_file, push_files (Codex config)",
		],
		warning:
			"NEVER use @modelcontextprotocol/server-github — deprecated. Use github-mcp-server@1.8.7",
	},
	{
		id: "playwright",
		name: "Playwright",
		pkg: "@playwright/mcp",
		desc: "אוטומציה מלאה של דפדפן — ניווט, לחיצות, screenshots, הזרקת JS, בדיקות. כבד ב-RAM.",
		icon: <Play size={18} />,
		iconColor: "var(--color-accent-green)",
		tools: [
			"browser_navigate",
			"browser_click",
			"browser_snapshot",
			"browser_take_screenshot",
			"browser_evaluate",
			"browser_fill_form",
			"browser_wait_for",
		],
		ramFootprint: "~1.3 GB",
		configPath: "~/.local/lib/mcp/playwright/cli.js",
		notes: [
			"CLI entry: cli.js (לא index.js!)",
			"~1.3 GB RAM — השתמשו בחסכנות",
			"מתאים לפרופיל ui או ephemera בלבד",
			"מחליף a11y-mcp — כולל נגישות דרך accessibility tree",
		],
		warning:
			"~1.3 GB RAM — enable only in 'ui' or 'ephemera' profile. Never leave enabled for regular work.",
	},
	{
		id: "supabase",
		name: "Supabase",
		pkg: "@supabase/mcp-server-supabase@0.7.0",
		desc: "ניהול מסד נתונים, RLS policies, storage, Auth. שאילתות SQL, migrations, ניטור.",
		icon: <Database size={18} />,
		iconColor: "var(--color-accent-cyan)",
		tools: [
			"execute_sql",
			"list_tables",
			"apply_migration",
			"list_projects",
			"get_project",
		],
		ramFootprint: "~95 MB",
		configPath: "@supabase/mcp-server-supabase/dist/transports/stdio.js",
		notes: [
			"Entry point: dist/transports/stdio.js — לא dist/index.js!",
			"dist/index.js = ספריית ESM בלבד, לא שרת stdio",
			"Disabled tool: execute_sql (מניעת שינויים ישירים בפרודקשן)",
			"מחייב SUPABASE_ACCESS_TOKEN לפני ה-interactive guard",
		],
		warning:
			"CRITICAL: Use dist/transports/stdio.js — NOT dist/index.js. Wrong entry = server never starts.",
	},
	{
		id: "claude-mem",
		name: "claude-mem",
		pkg: "claude-mem MCP",
		desc: "זיכרון פרסיסטנטי cross-session. שמירה ושליפת ידע, observations, חיפוש סמנטי, timeline.",
		icon: <HardDrive size={18} />,
		iconColor: "var(--color-accent-amber)",
		tools: [
			"search",
			"timeline",
			"get_observations",
			"smart_search",
			"smart_outline",
			"smart_unfold",
		],
		ramFootprint: "~120 MB",
		configPath: "~/.local/lib/mcp/memory/dist/index.js",
		notes: [
			"ישיר — direct node wrapper (לא npx)",
			"מחייב fnm node path מלא",
			"זמין בפרופילים unified, lean, flutter",
			"chroma-mem DISABLED — bun env stripping. לא לתקן.",
		],
	},
	{
		id: "browserstack",
		name: "BrowserStack",
		pkg: "@browserstack/mcp-server@1.2.12",
		desc: "בדיקות cross-device ב-30,000+ מכשירים אמיתיים. screenshots, automation, נגישות.",
		icon: <Smartphone size={18} />,
		iconColor: "var(--color-accent-purple)",
		tools: [
			"runBrowserLiveSession",
			"runAppLiveSession",
			"fetchAutomationScreenshots",
			"startAccessibilityScan",
			"fetchAccessibilityIssues",
			"takeAppScreenshot",
		],
		ramFootprint: "~110 MB",
		configPath: "~/.mcp.json (browserstack: ENABLED)",
		notes: [
			"Username: judithgal_h5PrUt",
			"Access key ב-~/.zshrc ו-~/.mcp.json",
			"ENABLED ב-~/.mcp.json — בניגוד ל-minimax-mcp ו-GWS",
			"מופעל בפרופיל unified ו-ephemera",
		],
	},
	{
		id: "firebase",
		name: "Firebase",
		pkg: "firebase MCP",
		desc: "ניהול פרויקטי Firebase — projects, apps, Firestore, security rules, authentication, deployment.",
		icon: <Zap size={18} />,
		iconColor: "var(--color-accent-amber)",
		tools: [
			"firebase_list_projects",
			"firebase_get_project",
			"firebase_create_app",
			"firebase_get_security_rules",
			"firebase_init",
			"firebase_read_resources",
		],
		ramFootprint: "~85 MB",
		configPath: "~/.claude/config/mcp/firebase/",
		notes: [
			"כולל developer knowledge search",
			"מתאים לפרויקטי Flutter עם Firebase (SportChat)",
			"מחייב firebase login לפני שימוש",
		],
	},
	{
		id: "telegram",
		name: "Telegram",
		pkg: "telegram MCP",
		desc: "אינטגרציה עם Telegram Bot API — שליחת הודעות, תגובות, עריכה. משמש להתראות ו-Claude-to-user messaging.",
		icon: <MessageSquare size={18} />,
		iconColor: "var(--color-accent-cyan)",
		tools: ["reply", "react", "edit_message", "download_attachment"],
		ramFootprint: "~70 MB",
		configPath: "~/.claude/config/mcp/telegram/",
		notes: [
			"Bot API — לא user API",
			"reply מעביר הודעות לטלגרם של המשתמש",
			"edit_message עדכון שקט (ללא push notification)",
			"לשליחת עדכון חדש — reply, לא edit",
		],
	},
	{
		id: "minimax",
		name: "MiniMax",
		pkg: "minimax-mcp@0.0.18",
		desc: "יצירת תוכן AI: טקסט-לדיבור, יצירת וידאו, תמונות, מוזיקה. 9 כלים. ב-~/.mcp.json: ENABLED.",
		icon: <Film size={18} />,
		iconColor: "var(--color-accent-purple)",
		tools: [
			"text_to_audio",
			"generate_video",
			"query_video_generation",
			"text_to_image",
			"music_generation",
			"list_voices",
			"voice_clone",
			"voice_design",
			"play_audio",
		],
		ramFootprint: "~100 MB",
		configPath: "~/.mcp.json (minimax-mcp: ENABLED)",
		notes: [
			"Model: MiniMax-M2.7, Direct API: api.minimax.io/v1",
			"204K context, 131K output, T=1.0",
			"Auth: MINIMAX_API_KEY ב-~/.secrets",
			"ENABLED ב-~/.mcp.json",
		],
	},
	{
		id: "serena",
		name: "Serena",
		pkg: "serena MCP",
		desc: "כלים סמנטיים לקוד — חיפוש סמבולים, עריכה ברמת AST, ניתוח תלויות. מהיר יותר מ-grep לקוד.",
		icon: <Sparkles size={18} />,
		iconColor: "var(--color-accent-green)",
		tools: [
			"find_symbol",
			"replace_symbol_body",
			"find_referencing_symbols",
			"get_symbols_overview",
			"insert_after_symbol",
			"insert_before_symbol",
			"execute_shell_command",
			"search_for_pattern",
		],
		ramFootprint: "~130 MB",
		configPath: "~/.claude/config/mcp/serena/",
		notes: [
			"עובד על בסיס LSP — Language Server Protocol",
			"find_symbol מצא by name_path — למשל Foo/__init__",
			"replace_symbol_body מחליף פונקציה שלמה בצורה מדויקת",
			"יעיל יותר מקריאת קבצים שלמים",
		],
	},
];

interface McpServerCardProps {
	server: McpServerDef;
}

function McpServerCard({ server }: McpServerCardProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div
			className={cn(
				"glass-card overflow-hidden transition-colors duration-200",
				expanded && "border-[var(--color-border-hover)]",
			)}
		>
			{/* Card header */}
			<button
				type="button"
				onClick={() => setExpanded((p) => !p)}
				aria-expanded={expanded}
				className={cn(
					"w-full flex items-start gap-3 px-4 py-3.5 text-start",
					"transition-colors duration-150 cursor-pointer min-h-[64px]",
					"hover:bg-[var(--color-bg-tertiary)]",
				)}
			>
				<span
					className="flex size-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
					style={{
						background: `oklch(from ${server.iconColor} l c h / 0.15)`,
						color: server.iconColor,
					}}
					aria-hidden="true"
				>
					{server.icon}
				</span>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="text-sm font-bold text-[var(--color-text-primary)]">
							{server.name}
						</span>
						{server.pkg && (
							<span
								className="text-[10px] font-mono px-1.5 py-0.5 rounded"
								style={{
									background: `oklch(from ${server.iconColor} l c h / 0.1)`,
									color: server.iconColor,
									border: `1px solid oklch(from ${server.iconColor} l c h / 0.2)`,
								}}
							>
								{server.pkg}
							</span>
						)}
					</div>
					<div className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-2 leading-relaxed">
						{server.desc}
					</div>
				</div>
				<div className="shrink-0 flex flex-col items-end gap-1">
					<span
						className="text-xs font-mono font-semibold"
						style={{ color: server.iconColor }}
					>
						{server.ramFootprint}
					</span>
					<span className="text-[var(--color-text-muted)]">
						{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
					</span>
				</div>
			</button>

			{/* Warning banner */}
			{server.warning && (
				<div className="px-4 py-2.5 bg-[var(--color-accent-red)]/8 border-t border-[var(--color-accent-red)]/20 flex gap-2">
					<AlertTriangle
						size={13}
						className="text-[var(--color-accent-red)] shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<p
						className="text-xs text-[var(--color-accent-red)] leading-relaxed font-medium"
						dir="ltr"
					>
						{server.warning}
					</p>
				</div>
			)}

			{/* Expanded detail */}
			{expanded && (
				<div className="border-t border-[var(--color-border)] px-4 py-4 space-y-4">
					{/* Tools list */}
					<div>
						<div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
							כלים זמינים
						</div>
						<div className="flex flex-wrap gap-1.5">
							{server.tools.map((tool) => (
								<span
									key={tool}
									className="rounded px-2 py-0.5 text-[11px] font-mono border"
									style={{
										color: server.iconColor,
										background: `oklch(from ${server.iconColor} l c h / 0.08)`,
										borderColor: `oklch(from ${server.iconColor} l c h / 0.2)`,
									}}
								>
									{tool}
								</span>
							))}
						</div>
					</div>

					{/* Meta info */}
					<div className="rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
						<InfoPill
							label="RAM footprint"
							value={server.ramFootprint}
							color={server.iconColor}
						/>
						<InfoPill
							label="Config / Entry"
							value={server.configPath}
							color="var(--color-accent-cyan)"
						/>
					</div>

					{/* Notes */}
					<div>
						<div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
							הערות
						</div>
						<ul className="space-y-1.5">
							{server.notes.map((note) => (
								<li
									key={note}
									className="flex gap-2 text-xs text-[var(--color-text-secondary)] leading-relaxed"
								>
									<span
										className="mt-1.5 size-1.5 rounded-full shrink-0"
										style={{ background: server.iconColor }}
										aria-hidden="true"
									/>
									{note}
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}

function ActiveServersSection() {
	return (
		<AccordionSection
			id="active-servers"
			title="שרתים פעילים"
			subtitle="10 שרתי MCP — לחצו על כל שרת לפרטים, כלים וקונפיגורציה"
			icon={<Server size={18} />}
			defaultOpen={true}
			accentColor="var(--color-accent-green)"
		>
			<div className="space-y-2.5">
				{MCP_SERVERS.map((server) => (
					<McpServerCard key={server.id} server={server} />
				))}
			</div>
		</AccordionSection>
	);
}

// ── Section 4 — כללי אבטחה ────────────────────────────────────────────────────

const SECURITY_RULES = [
	{
		id: "mcp-sdk-version",
		severity: "critical",
		title: "MCP SDK >= 1.27.1",
		desc: "CVE-2026-0621 (ReDoS בvalidation) ו-CVE-2026-25536 (data leak דרך message routing). גרסאות ישנות יותר חשופות.",
		fix: "npm install @modelcontextprotocol/sdk@>=1.27.1",
		color: "var(--color-accent-red)",
	},
	{
		id: "no-npx-antigravity",
		severity: "critical",
		title: "NEVER npx ב-Gemini antigravity config",
		desc: "~/.gemini/antigravity/mcp_config.json חייב להשתמש ב-fnm node path ישיר. npx = 30-60 שניות download בכל session start, duplicate servers, blocked startup.",
		fix: 'command: "/home/nadavcohen/.local/share/fnm/node-versions/v24.14.0/installation/bin/node"',
		color: "var(--color-accent-red)",
	},
	{
		id: "fnm-node-path",
		severity: "warning",
		title: "כל ה-MCPs משתמשים ב-fnm node path",
		desc: "לעולם לא /usr/bin/node — תמיד fnm path מלא. SSH non-interactive sessions לא מקבלים .bashrc.",
		fix: "/home/nadavcohen/.local/share/fnm/node-versions/v24.14.0/installation/bin/node",
		color: "var(--color-accent-amber)",
	},
	{
		id: "supabase-entry",
		severity: "critical",
		title: "Supabase MCP: dist/transports/stdio.js",
		desc: "dist/index.js = ספריית ESM בלבד, לא שרת stdio. שרת שנפתח עם entry שגוי יחזיר 'disconnected' לתמיד.",
		fix: "@supabase/mcp-server-supabase/dist/transports/stdio.js",
		color: "var(--color-accent-red)",
	},
	{
		id: "github-not-deprecated",
		severity: "warning",
		title: "GitHub: github-mcp-server@1.8.7 בלבד",
		desc: "@modelcontextprotocol/server-github מדופרקט. משתמשי Codex: עברו ל-github/github-mcp-server. שרת חדש כולל GraphQL ו-Code Search.",
		fix: "github-mcp-server@1.8.7",
		color: "var(--color-accent-amber)",
	},
	{
		id: "allowlist-servers",
		severity: "info",
		title: "Allowlist בלבד — לא להוסיף שרתים לא מוכרים",
		desc: "MCP Inspector <= 1.4.2: RCE via arbitrary server install. עדכנו ל-1.4.3+. OWASP MCP09: brand squatting (shadcn.io HTTP MCP — לא official).",
		fix: "mcp-scan + verify source before adding any new server",
		color: "var(--color-accent-blue)",
	},
	{
		id: "pin-versions",
		severity: "info",
		title: "Pin גרסאות — אף פעם @latest",
		desc: "SANDWORM_MODE (Feb 2026): 19 typosquatting packages. NEVER @latest לכלי AI CLI. Pin exact versions, use socket לבדיקה לפני install.",
		fix: "socket npm install <pkg> && pin exact version",
		color: "var(--color-accent-blue)",
	},
];

const SEVERITY_LABELS: Record<string, { label: string; color: string }> = {
	critical: { label: "קריטי", color: "var(--color-accent-red)" },
	warning: { label: "אזהרה", color: "var(--color-accent-amber)" },
	info: { label: "מידע", color: "var(--color-accent-blue)" },
};

function SecuritySection() {
	return (
		<AccordionSection
			id="security-rules"
			title="כללי אבטחה"
			subtitle="CVEs ידועים, אנטי-פטרנים וכללי הגדרה בטוחה"
			icon={<Shield size={18} />}
			defaultOpen={false}
			accentColor="var(--color-accent-red)"
		>
			<div className="space-y-3">
				{SECURITY_RULES.map((rule) => {
					const sev = SEVERITY_LABELS[rule.severity];
					return (
						<div
							key={rule.id}
							className="rounded-xl border p-4 space-y-2.5"
							style={{
								background: `oklch(from ${rule.color} l c h / 0.05)`,
								borderColor: `oklch(from ${rule.color} l c h / 0.2)`,
							}}
						>
							<div className="flex items-start gap-2.5">
								<Shield
									size={14}
									className="shrink-0 mt-0.5"
									style={{ color: rule.color }}
									aria-hidden="true"
								/>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 flex-wrap mb-1">
										<span className="text-sm font-semibold text-[var(--color-text-primary)]">
											{rule.title}
										</span>
										<Badge label={sev.label} color={sev.color} />
									</div>
									<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
										{rule.desc}
									</p>
								</div>
							</div>
							<div className="ps-6">
								<div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wide mb-1">
									פתרון / ערך נכון
								</div>
								<CodeBlock>{rule.fix}</CodeBlock>
							</div>
						</div>
					);
				})}
			</div>
		</AccordionSection>
	);
}

// ── Section 5 — פתרון בעיות ───────────────────────────────────────────────────

const TROUBLESHOOT_ITEMS = [
	{
		id: "not-connecting",
		icon: <Wifi size={16} />,
		title: "שרת MCP לא מתחבר",
		color: "var(--color-accent-amber)",
		symptoms: [
			"הכלי מחזיר 'disconnected' או לא מופיע",
			"שגיאת 'spawn ENOENT' ב-log",
		],
		steps: [
			"בדקו שהתהליך רץ: ps aux | grep mcp",
			"בדקו שה-node path נכון: fnm node, לא /usr/bin/node",
			"בדקו שהtokens נמצאים לפני ה-interactive guard ב-~/.bashrc",
			"Supabase: ודאו שהentry הוא dist/transports/stdio.js",
			"GitHub: ודאו שאתם משתמשים ב-github-mcp-server@1.8.7",
		],
		command:
			"ssh 100.82.33.122 'printenv GITHUB_PERSONAL_ACCESS_TOKEN' # בדיקה שהtoken זמין",
	},
	{
		id: "orphaned-processes",
		icon: <Terminal size={16} />,
		title: "תהליכי MCP עזובים (orphaned) — בזבוז RAM",
		color: "var(--color-accent-red)",
		symptoms: [
			"RAM גבוה אחרי סיום שיחה",
			"ps aux | grep node מראה 20-60+ תהליכים",
			"4-5 GB RAM אבוד",
		],
		steps: [
			"הריצו clean-memory לניקוי מהיר",
			"kill ידני לכל שרתי MCP",
			"בדקו RAM לאחר ניקוי: free -h",
			"אחרי גלי Kimi — תמיד נקו orphans לפני גל הבא",
		],
		command:
			'pkill -f "node.*mcp" || true\npkill -f "node.*apex" || true\npkill -f "node.*context7" || true\npkill -f "node.*github" || true',
	},
	{
		id: "gemini-path-workspace",
		icon: <Globe size={16} />,
		title: 'Gemini: "Path not in workspace"',
		color: "var(--color-accent-amber)",
		symptoms: ["Gemini CLI מחזיר שגיאת workspace", "קבצים ב-/tmp/ לא נקראים"],
		steps: [
			"Gemini CLI יכול לקרוא קבצים מ-$HOME/ בלבד",
			"העתיקו קבצי הקשר מ-/tmp/ ל-~/ לפני dispatch",
			"בדקו: gemini -p 'Read ~/my-file.md'",
		],
		command:
			"cp /tmp/my-context.md ~/\ngemini -p 'Read ~/my-context.md and analyze it'",
	},
	{
		id: "chrome-devtools-ram",
		icon: <Monitor size={16} />,
		title: "chrome-devtools אוכל ~150 MB RAM",
		color: "var(--color-accent-blue)",
		symptoms: ["RAM גבוה ללא סיבה", "פרופיל ui פעיל כשלא צריך"],
		steps: [
			"הפעילו chrome-devtools רק לפרופיל ui",
			"לאחר שימוש — החזירו לפרופיל unified",
			"Playwright (1.3 GB) — שמרו לפרופיל ephemera בלבד",
		],
		command: "mcp-toggle unified  # חזרה לפרופיל ברירת המחדל",
	},
	{
		id: "playwright-heavy",
		icon: <Play size={16} />,
		title: "Playwright ~1.3 GB RAM",
		color: "var(--color-accent-purple)",
		symptoms: ["זיכרון RAM מתקרב לגבול", "שיחה איטית"],
		steps: [
			"השתמשו ב-Playwright רק כש-UI automation נדרש",
			"לאחר סיום — mcp-toggle unified",
			"Bash/Read/Grep = 0 RAM — העדיפו אותם",
			"סדר עדיפויות: Bash/Read/Grep (0) → chrome-devtools (~150MB) → Playwright (~1.3GB)",
		],
		command:
			"mcp-toggle status  # ראו אילו שרתים פעילים\nmcp-toggle unified  # חזרה לפרופיל קל",
	},
	{
		id: "duplicate-servers",
		icon: <Layers size={16} />,
		title: "שרתים כפולים ב-Gemini (10 במקום 5)",
		color: "var(--color-accent-amber)",
		symptoms: ["Gemini רץ לאט בתחילת session", "10 MCP servers במקום הצפוי"],
		steps: [
			"Gemini טוען גם settings.json וגם antigravity/mcp_config.json",
			"ודאו שאין שרתים כפולים בין שני הקבצים",
			"ודאו ש-antigravity משתמש ב-fnm node ולא npx",
			"הריצו: grep -c npx ~/.gemini/antigravity/mcp_config.json → חייב להחזיר 0",
		],
		command: "grep -c npx ~/.gemini/antigravity/mcp_config.json\n# Expected: 0",
	},
];

function TroubleshootSection() {
	const [open, setOpen] = useState<string | null>(null);

	return (
		<AccordionSection
			id="troubleshooting"
			title="פתרון בעיות"
			subtitle="שגיאות נפוצות, orphaned processes, Gemini workspace, RAM"
			icon={<Wrench size={18} />}
			defaultOpen={false}
			accentColor="var(--color-accent-amber)"
		>
			<div className="space-y-2.5">
				{TROUBLESHOOT_ITEMS.map((item) => {
					const isOpen = open === item.id;
					return (
						<div
							key={item.id}
							className={cn(
								"rounded-xl border transition-colors duration-200 overflow-hidden",
								isOpen
									? "border-[var(--color-border-hover)]"
									: "border-[var(--color-border)]",
							)}
						>
							<button
								type="button"
								onClick={() => setOpen(isOpen ? null : item.id)}
								aria-expanded={isOpen}
								className={cn(
									"w-full flex items-center gap-3 px-4 py-3 text-start",
									"transition-colors duration-150 cursor-pointer min-h-[52px]",
									"hover:bg-[var(--color-bg-tertiary)]",
								)}
							>
								<span
									className="flex size-7 shrink-0 items-center justify-center rounded-md"
									style={{
										background: `oklch(from ${item.color} l c h / 0.15)`,
										color: item.color,
									}}
									aria-hidden="true"
								>
									{item.icon}
								</span>
								<span className="flex-1 text-sm font-semibold text-[var(--color-text-primary)]">
									{item.title}
								</span>
								<span className="shrink-0 text-[var(--color-text-muted)]">
									{isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
								</span>
							</button>

							{isOpen && (
								<div className="border-t border-[var(--color-border)] px-4 py-4 space-y-4">
									{/* Symptoms */}
									<div>
										<div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
											תסמינים
										</div>
										<ul className="space-y-1">
											{item.symptoms.map((sym) => (
												<li
													key={sym}
													className="flex gap-2 text-xs text-[var(--color-text-secondary)]"
												>
													<span
														className="mt-1.5 size-1.5 rounded-full shrink-0"
														style={{ background: item.color }}
														aria-hidden="true"
													/>
													{sym}
												</li>
											))}
										</ul>
									</div>

									{/* Steps */}
									<div>
										<div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
											צעדים לפתרון
										</div>
										<ol className="space-y-1.5">
											{item.steps.map((step, stepIdx) => (
												<li
													key={step}
													className="flex gap-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed"
												>
													<span
														className="flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5"
														style={{
															background: `oklch(from ${item.color} l c h / 0.2)`,
															color: item.color,
														}}
														aria-hidden="true"
													>
														{stepIdx + 1}
													</span>
													{step}
												</li>
											))}
										</ol>
									</div>

									{/* Command */}
									<div>
										<div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">
											פקודה לדוגמה
										</div>
										<CodeBlock>{item.command}</CodeBlock>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</AccordionSection>
	);
}

// ── RAM Summary card ──────────────────────────────────────────────────────────

const RAM_TABLE_ROWS: Array<{
	approachHe: string;
	ram: string;
	ramNum: number;
	color: string;
}> = [
	{
		approachHe: "Bash / Read / Grep — כלים מובנים",
		ram: "0 MB",
		ramNum: 0,
		color: "var(--color-accent-green)",
	},
	{
		approachHe: "context7 בלבד (פרופיל minimal)",
		ram: "~80 MB",
		ramNum: 80,
		color: "var(--color-accent-green)",
	},
	{
		approachHe: "unified — ברירת מחדל (6 שרתים)",
		ram: "~600 MB",
		ramNum: 600,
		color: "var(--color-accent-blue)",
	},
	{
		approachHe: "unified + chrome-devtools (פרופיל ui)",
		ram: "~750 MB",
		ramNum: 750,
		color: "var(--color-accent-amber)",
	},
	{
		approachHe: "unified + Playwright (פרופיל ephemera)",
		ram: "~1.9 GB",
		ramNum: 1900,
		color: "var(--color-accent-red)",
	},
];

function RamSummaryCard() {
	return (
		<div className="glass-card p-4 space-y-3">
			<SectionHeader
				icon={<HardDrive size={18} />}
				title="טביעת RAM לפי פרופיל"
				subtitle="השוואת עלות זיכרון — בחרו את הפרופיל הקל ביותר למשימה"
				accentColor="var(--color-accent-cyan)"
			/>

			<div className="space-y-2">
				{RAM_TABLE_ROWS.map((row) => {
					const pct = Math.round((row.ramNum / 2000) * 100);
					return (
						<div key={row.approachHe} className="space-y-1">
							<div className="flex items-center justify-between gap-2">
								<span className="text-xs text-[var(--color-text-secondary)] flex-1 min-w-0 truncate">
									{row.approachHe}
								</span>
								<span
									className="text-xs font-mono font-semibold shrink-0"
									style={{ color: row.color }}
								>
									{row.ram}
								</span>
							</div>
							<div className="h-1.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
								<div
									className="h-full rounded-full transition-all duration-500"
									style={{
										width: `${Math.max(pct, 1)}%`,
										background: row.color,
										opacity: 0.7,
									}}
									role="progressbar"
									aria-valuenow={pct}
									aria-valuemin={0}
									aria-valuemax={100}
									aria-label={`${row.approachHe}: ${row.ram}`}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<p className="text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3">
				המחשב הראשי: 64 GB RAM. אם הזיכרון הפנוי יורד מתחת ל-5 GB, earlyoom
				יתחיל להרוג תהליכים פחות חשובים.
			</p>
		</div>
	);
}

// ── Quick Reference card ──────────────────────────────────────────────────────

function QuickRefCard() {
	const quickCmds = [
		{
			cmd: "mcp-toggle status",
			desc: "מה פעיל עכשיו",
			color: "var(--color-accent-blue)",
		},
		{
			cmd: "mcp-toggle unified",
			desc: "חזרה לברירת מחדל",
			color: "var(--color-accent-green)",
		},
		{
			cmd: 'pkill -f "node.*mcp"',
			desc: "נקה orphaned MCPs",
			color: "var(--color-accent-amber)",
		},
		{
			cmd: "clean-memory",
			desc: "נקה הכל + פנה RAM",
			color: "var(--color-accent-red)",
		},
		{
			cmd: "mcp-toggle ui",
			desc: "הפעל chrome-devtools",
			color: "var(--color-accent-cyan)",
		},
		{
			cmd: "mcp-toggle minimal",
			desc: "מינימום RAM",
			color: "var(--color-accent-purple)",
		},
	];

	return (
		<div className="glass-card p-4 space-y-3">
			<SectionHeader
				icon={<Terminal size={18} />}
				title="פקודות מהירות"
				subtitle="הפקודות הנפוצות ביותר לניהול MCP"
				accentColor="var(--color-accent-blue)"
			/>

			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{quickCmds.map(({ cmd, desc, color }) => (
					<div
						key={cmd}
						className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3 space-y-1"
					>
						<code
							className="text-xs font-mono block"
							style={{ color }}
							dir="ltr"
						>
							{cmd}
						</code>
						<p className="text-[11px] text-[var(--color-text-muted)]">{desc}</p>
					</div>
				))}
			</div>
		</div>
	);
}

// ── MCP Architecture diagram ──────────────────────────────────────────────────

function ArchDiagramCard() {
	return (
		<div className="glass-card p-4 space-y-3">
			<SectionHeader
				icon={<Bot size={18} />}
				title="ארכיטקטורת MCP"
				subtitle="איך Claude Code מתחבר לשרתי MCP"
				accentColor="var(--color-accent-purple)"
			/>

			<div className="rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] p-4 overflow-x-auto">
				<div
					className="flex flex-col gap-3 w-full"
					role="img"
					aria-label="דיאגרמת ארכיטקטורת MCP"
				>
					{/* Claude Code */}
					<div className="rounded-xl bg-[var(--color-accent-blue)]/15 border border-[var(--color-accent-blue)]/30 px-4 py-3 text-center">
						<div className="text-sm font-bold text-[var(--color-accent-blue)]">
							Claude Code (Main Process)
						</div>
						<div className="text-xs text-[var(--color-text-muted)] mt-0.5">
							JSON-RPC 2.0 client
						</div>
					</div>

					{/* Arrow */}
					<div className="flex justify-center">
						<div className="flex flex-col items-center gap-0.5">
							<div className="w-px h-3 bg-[var(--color-border)]" />
							<div className="text-xs text-[var(--color-text-muted)]" dir="ltr">
								stdio / HTTP transport
							</div>
							<div className="w-px h-3 bg-[var(--color-border)]" />
						</div>
					</div>

					{/* MCP Server grid */}
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
						{["context7", "github", "playwright", "supabase", "claude-mem"].map(
							(srv) => (
								<div
									key={srv}
									className="rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-2 py-2 text-center"
								>
									<div className="text-[11px] font-semibold text-[var(--color-text-primary)]">
										{srv}
									</div>
									<div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
										child process
									</div>
								</div>
							),
						)}
					</div>

					{/* Arrow */}
					<div className="flex justify-center">
						<div className="flex flex-col items-center gap-0.5">
							<div className="w-px h-3 bg-[var(--color-border)]" />
							<div className="text-xs text-[var(--color-text-muted)]">
								כלים חיצוניים
							</div>
							<div className="w-px h-3 bg-[var(--color-border)]" />
						</div>
					</div>

					{/* External tools */}
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
						{[
							{ name: "npm docs", icon: "📦" },
							{ name: "GitHub API", icon: "🐙" },
							{ name: "Browser", icon: "🌐" },
							{ name: "Supabase DB", icon: "🗄️" },
							{ name: "Memory", icon: "🧠" },
						].map(({ name, icon }) => (
							<div
								key={name}
								className="rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] px-2 py-2 text-center"
							>
								<div className="text-base" aria-hidden="true">
									{icon}
								</div>
								<div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
									{name}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
				כל שרת MCP רץ כ-child process נפרד (stdio) ומבודד. Claude Code שולח
				JSON-RPC לכל שרת, מקבל תשובה, ומשלב אותה בהקשר. אם שרת קורס — Claude
				Code מנסה מחדש אוטומטית.
			</p>
		</div>
	);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function McpGuidePage() {
	return (
		<div className="space-y-6 pb-8">
			{/* Page header */}
			<div className="flex items-start gap-4">
				<div
					className="flex size-12 shrink-0 items-center justify-center rounded-xl"
					style={{
						background: "oklch(0.65 0.18 250 / 0.15)",
						border: "1px solid oklch(0.65 0.18 250 / 0.3)",
					}}
					aria-hidden="true"
				>
					<Server size={22} className="text-[var(--color-accent-blue)]" />
				</div>
				<div>
					<h1 className="text-xl font-bold text-[var(--color-text-primary)]">
						שרתי MCP — מדריך מלא
					</h1>
					<p className="text-sm text-[var(--color-text-muted)] mt-0.5">
						Model Context Protocol · 10 שרתים פעילים · פרופילים · אבטחה · פתרון
						בעיות
					</p>
				</div>
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{[
					{
						label: "שרתים פעילים",
						value: "10",
						color: "var(--color-accent-green)",
						icon: <Server size={15} />,
					},
					{
						label: "פרופילים",
						value: "6",
						color: "var(--color-accent-blue)",
						icon: <Layers size={15} />,
					},
					{
						label: "כלים זמינים",
						value: "50+",
						color: "var(--color-accent-purple)",
						icon: <Wrench size={15} />,
					},
					{
						label: "RAM unified",
						value: "~600MB",
						color: "var(--color-accent-amber)",
						icon: <HardDrive size={15} />,
					},
				].map(({ label, value, color, icon }) => (
					<div
						key={label}
						className="glass-card px-4 py-3 flex items-center gap-3"
					>
						<span
							className="flex size-8 shrink-0 items-center justify-center rounded-lg"
							style={{
								background: `oklch(from ${color} l c h / 0.15)`,
								color,
							}}
							aria-hidden="true"
						>
							{icon}
						</span>
						<div>
							<div
								className="text-base font-bold font-mono leading-tight"
								style={{ color }}
							>
								{value}
							</div>
							<div className="text-[11px] text-[var(--color-text-muted)] leading-tight">
								{label}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Top row cards */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<ArchDiagramCard />
				<div className="space-y-4">
					<QuickRefCard />
					<RamSummaryCard />
				</div>
			</div>

			{/* Accordion sections */}
			<div className="space-y-3">
				<WhatIsMcpSection />
				<ProfilesSection />
				<ActiveServersSection />
				<SecuritySection />
				<TroubleshootSection />
			</div>

			{/* Footer note */}
			<div className="glass-card px-4 py-3 flex gap-3">
				<Package
					size={15}
					className="text-[var(--color-text-muted)] shrink-0 mt-0.5"
					aria-hidden="true"
				/>
				<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
					מסמך זה מתעדכן אוטומטית. לשינויים קונפיגורציה ב-MCP — ריצו{" "}
					<code className="text-[var(--color-accent-cyan)] font-mono" dir="ltr">
						claude-sync push
					</code>{" "}
					לסנכרן בין Lenovo ל-Lenovo. כל MCP settings נשמרים ב-~/.mcp.json
					(unified profile) ובקבצים הספציפיים של כל agent (Gemini: settings.json
					+ antigravity, Codex: config.toml, Kimi: config.toml).
				</p>
			</div>
		</div>
	);
}
