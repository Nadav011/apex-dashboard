import {
	AlertTriangle,
	BookOpen,
	Bot,
	Check,
	ChevronDown,
	ChevronUp,
	Copy,
	Layers,
	Send,
	Shuffle,
	Table2,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

// ── Provider color tokens (consistent with HydraPage) ────────────────────────

const PROVIDER_COLORS = {
	codex: {
		hue: 250,
		color: "oklch(0.65 0.18 250)",
		bg: "bg-[oklch(0.65_0.18_250_/_0.12)]",
		border: "border-[oklch(0.65_0.18_250_/_0.35)]",
		text: "text-[oklch(0.7_0.15_250)]",
		glow: "shadow-[0_0_20px_oklch(0.65_0.18_250_/_0.2)]",
	},
	kimi: {
		hue: 200,
		color: "oklch(0.75 0.14 200)",
		bg: "bg-[oklch(0.75_0.14_200_/_0.12)]",
		border: "border-[oklch(0.75_0.14_200_/_0.35)]",
		text: "text-[oklch(0.78_0.12_200)]",
		glow: "shadow-[0_0_20px_oklch(0.75_0.14_200_/_0.2)]",
	},
	gemini: {
		hue: 155,
		color: "oklch(0.72 0.19 155)",
		bg: "bg-[oklch(0.72_0.19_155_/_0.12)]",
		border: "border-[oklch(0.72_0.19_155_/_0.35)]",
		text: "text-[oklch(0.75_0.16_155)]",
		glow: "shadow-[0_0_20px_oklch(0.72_0.19_155_/_0.2)]",
	},
	minimax: {
		hue: 290,
		color: "oklch(0.62 0.2 290)",
		bg: "bg-[oklch(0.62_0.2_290_/_0.12)]",
		border: "border-[oklch(0.62_0.2_290_/_0.35)]",
		text: "text-[oklch(0.68_0.17_290)]",
		glow: "shadow-[0_0_20px_oklch(0.62_0.2_290_/_0.2)]",
	},
} as const;

// ── Copy button ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		} catch {
			// ignore
		}
	}, [text]);

	return (
		<button
			type="button"
			onClick={handleCopy}
			title="העתק פקודה"
			aria-label="העתק פקודה"
			className={cn(
				"flex items-center justify-center min-h-11 min-w-11 w-7 h-7 rounded-md",
				"transition-all duration-150 cursor-pointer shrink-0",
				copied
					? "bg-[oklch(0.72_0.19_155_/_0.2)] text-[var(--color-accent-green)]"
					: "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]",
			)}
		>
			{copied ? <Check size={13} /> : <Copy size={13} />}
		</button>
	);
}

// ── Code block ─────────────────────────────────────────────────────────────────

function CodeBlock({ code, label }: { code: string; label?: string }) {
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
					{label}
				</span>
			)}
			<div
				className={cn(
					"flex items-start gap-2 rounded-lg p-3",
					"bg-[var(--color-bg-primary)] border border-[var(--color-border)]",
				)}
			>
				<code
					className="flex-1 text-xs font-mono text-[var(--color-text-secondary)] whitespace-pre-wrap break-all leading-relaxed"
					dir="ltr"
				>
					{code}
				</code>
				<CopyButton text={code} />
			</div>
		</div>
	);
}

// ── Warning pill ───────────────────────────────────────────────────────────────

function Warning({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-start gap-2 rounded-lg px-3 py-2 bg-[oklch(0.78_0.16_75_/_0.1)] border border-[oklch(0.78_0.16_75_/_0.3)]">
			<AlertTriangle
				size={13}
				className="mt-0.5 shrink-0 text-[var(--color-accent-amber)]"
				aria-hidden="true"
			/>
			<span className="text-xs text-[oklch(0.85_0.12_75)] leading-relaxed">
				{children}
			</span>
		</div>
	);
}

// ── Info pill ─────────────────────────────────────────────────────────────────

function InfoRow({
	label,
	value,
	dir = "ltr",
}: {
	label: string;
	value: string;
	dir?: "ltr" | "rtl";
}) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-xs text-[var(--color-text-muted)] shrink-0">
				{label}:
			</span>
			<span
				className="text-xs font-mono font-medium text-[var(--color-text-secondary)]"
				dir={dir}
			>
				{value}
			</span>
		</div>
	);
}

// ── Accordion section ──────────────────────────────────────────────────────────

interface AccordionProps {
	title: string;
	icon: React.ReactNode;
	accentColor: string;
	defaultOpen?: boolean;
	children: React.ReactNode;
}

function AccordionSection({
	title,
	icon,
	accentColor,
	defaultOpen = false,
	children,
}: AccordionProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div
			className={cn(
				"glass-card overflow-hidden transition-all duration-200",
				open && "shadow-[0_0_24px_oklch(0.65_0.18_250_/_0.1)]",
			)}
		>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				aria-expanded={open}
				className={cn(
					"w-full flex items-center gap-3 px-5 py-4 text-start",
					"cursor-pointer transition-colors duration-150",
					"hover:bg-[var(--color-bg-elevated)]",
					open && "border-b border-[var(--color-border)]",
				)}
			>
				<span
					style={{ color: accentColor }}
					aria-hidden="true"
					className="shrink-0"
				>
					{icon}
				</span>
				<span className="flex-1 text-sm font-bold text-[var(--color-text-primary)]">
					{title}
				</span>
				<span className="text-[var(--color-text-muted)] shrink-0">
					{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</span>
			</button>

			{open && <div className="px-5 py-5 flex flex-col gap-5">{children}</div>}
		</div>
	);
}

// ── Provider card ──────────────────────────────────────────────────────────────

interface ProviderCardData {
	id: keyof typeof PROVIDER_COLORS;
	name: string;
	model: string;
	context: string;
	bestFor: string[];
	command: string;
	settingsPath: string;
	warnings?: string[];
	extras?: { label: string; value: string }[];
}

const PROVIDERS_DATA: ProviderCardData[] = [
	{
		id: "codex",
		name: "Codex",
		model: "gpt-5.4",
		context: "1M tokens",
		bestFor: ["ביקורת אבטחה", "ניתוח עמוק", "xhigh reasoning"],
		command:
			'codex exec --dangerously-bypass-approvals-and-sandbox --ephemeral -C "$dir" -',
		settingsPath: "~/.codex/config.toml",
		extras: [{ label: "Reasoning", value: "xhigh (max)" }],
	},
	{
		id: "kimi",
		name: "Kimi",
		model: "Kimi k2",
		context: "200K tokens",
		bestFor: ["תיקוני TypeScript בבאץ'", "פיצול קבצים", "refactor"],
		command: 'kimi --quiet --yolo -p "$prompt" -w "$dir"',
		settingsPath: "~/.kimi/config.toml",
		warnings: ["NEVER stdin pipe — השתמש ב-p flag בלבד"],
	},
	{
		id: "gemini",
		name: "Gemini",
		model: "gemini-3.1-pro-preview",
		context: "2M tokens (הגדול ביותר!)",
		bestFor: ["ניתוח 2M context", "כתיבת קבצים אינטראקטיבית", "מחקר גדול"],
		command: 'gemini --yolo -m gemini-3.1-pro-preview -p "$prompt"',
		settingsPath: "~/.gemini/settings.json",
		warnings: [
			"מקסימום 3–5 מקביל, stagger של 30 שניות",
			'נדרש TTY: השתמש ב-script -qec "gemini ..." /dev/null',
		],
		extras: [{ label: "thinkingBudget", value: "1024" }],
	},
	{
		id: "minimax",
		name: "MiniMax",
		model: "MiniMax-M2.7-highspeed",
		context: "204K tokens",
		bestFor: ["batch text gen", "50 מקביל", "תיעוד בכמויות"],
		command: 'minimax --batch "$prompt"',
		settingsPath: "~/.minimax/user-settings.json",
		warnings: ["50 concurrent + 50ms stagger = 100% success (v7)"],
		extras: [{ label: "API", value: "api.minimax.io/v1 (Direct)" }],
	},
];

function ProviderCard({ data }: { data: ProviderCardData }) {
	const c = PROVIDER_COLORS[data.id];

	return (
		<div
			className={cn(
				"rounded-xl border p-4 flex flex-col gap-4",
				c.bg,
				c.border,
			)}
		>
			{/* Header */}
			<div className="flex items-center gap-3">
				<div
					className={cn(
						"flex items-center justify-center w-10 h-10 rounded-lg border shrink-0 font-bold text-sm",
						c.bg,
						c.border,
						c.text,
					)}
					aria-hidden="true"
				>
					{data.name[0]}
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span className={cn("text-sm font-bold", c.text)}>{data.name}</span>
						<span
							className="text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] px-2 py-0.5 rounded-full border border-[var(--color-border)]"
							dir="ltr"
						>
							{data.model}
						</span>
					</div>
					<span className="text-xs text-[var(--color-text-muted)]" dir="ltr">
						{data.context}
					</span>
				</div>
			</div>

			{/* Best for */}
			<div className="flex flex-col gap-1.5">
				<span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
					מתאים ל
				</span>
				<div className="flex flex-wrap gap-1.5">
					{data.bestFor.map((item) => (
						<span
							key={item}
							className={cn(
								"text-xs px-2 py-0.5 rounded-full border",
								c.bg,
								c.border,
								c.text,
							)}
						>
							{item}
						</span>
					))}
				</div>
			</div>

			{/* Command */}
			<CodeBlock code={data.command} label="פקודת dispatch" />

			{/* Extras */}
			{data.extras && (
				<div className="flex flex-col gap-1">
					{data.extras.map((e) => (
						<InfoRow key={e.label} label={e.label} value={e.value} />
					))}
				</div>
			)}

			<InfoRow label="הגדרות" value={data.settingsPath} />

			{/* Warnings */}
			{data.warnings?.map((w) => (
				<Warning key={w}>{w}</Warning>
			))}
		</div>
	);
}

// ── Routing table ──────────────────────────────────────────────────────────────

const ROUTING_ROWS: {
	task: string;
	provider: string;
	providerColor: string;
	why: string;
}[] = [
	{
		task: "יצירת בדיקות בבאץ'",
		provider: "MiniMax",
		providerColor: PROVIDER_COLORS.minimax.color,
		why: "50 concurrent + 50ms stagger",
	},
	{
		task: "ביקורת אבטחה",
		provider: "Codex",
		providerColor: PROVIDER_COLORS.codex.color,
		why: "xhigh reasoning, deep analysis",
	},
	{
		task: "סקירת קוד (Review)",
		provider: "Claude Opus",
		providerColor: "oklch(0.62 0.2 25)",
		why: "16 dimensions, L10+ quality",
	},
	{
		task: "תיקוני UI/CSS",
		provider: "Kimi",
		providerColor: PROVIDER_COLORS.kimi.color,
		why: "refactors מצוינים",
	},
	{
		task: "ניתוח codebase גדול",
		provider: "Gemini",
		providerColor: PROVIDER_COLORS.gemini.color,
		why: "2M context — הגדול ביותר",
	},
	{
		task: "יצירת תיעוד בכמויות",
		provider: "MiniMax",
		providerColor: PROVIDER_COLORS.minimax.color,
		why: "batch volume, 50 concurrent",
	},
];

function RoutingTable() {
	return (
		<div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
			<table className="w-full text-sm" style={{ direction: "rtl" }}>
				<thead>
					<tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
						<th className="text-start ps-4 pe-3 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
							סוג משימה
						</th>
						<th className="text-start ps-3 pe-3 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
							ספק
						</th>
						<th className="text-start ps-3 pe-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
							למה
						</th>
					</tr>
				</thead>
				<tbody>
					{ROUTING_ROWS.map((row, i) => (
						<tr
							key={row.task}
							className={cn(
								"border-b border-[var(--color-border)] last:border-0 transition-colors duration-100",
								i % 2 === 0
									? "bg-transparent"
									: "bg-[var(--color-bg-elevated)]",
								"hover:bg-[var(--color-bg-tertiary)]",
							)}
						>
							<td className="ps-4 pe-3 py-3 text-sm text-[var(--color-text-primary)]">
								{row.task}
							</td>
							<td className="ps-3 pe-3 py-3">
								<span
									className="text-xs font-semibold px-2 py-0.5 rounded-full"
									style={{
										background: `${row.providerColor}22`,
										color: row.providerColor,
										border: `1px solid ${row.providerColor}44`,
									}}
								>
									{row.provider}
								</span>
							</td>
							<td
								className="ps-3 pe-4 py-3 text-xs text-[var(--color-text-muted)]"
								dir="ltr"
							>
								{row.why}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

// ── AUAP section ───────────────────────────────────────────────────────────────

const AUAP_ROLES = [
	"planner",
	"implementer",
	"verifier",
	"reviewer",
	"security-auditor",
];
const AUAP_STAGES = [
	"plan",
	"research",
	"implement",
	"verify",
	"review",
	"deploy",
];

function AuapSection() {
	return (
		<div className="flex flex-col gap-5">
			<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
				AUAP הוא פרוטוקול briefing מובנה שנשלח לכל dispatch חיצוני — מבטיח
				שהסוכן יודע בדיוק מה לעשות, בוא context מלא, stage נכון ו-role מוגדר.
			</p>

			<CodeBlock
				label="בניית AUAP briefing"
				code='bash ~/.claude/config/auap/auap-builder.sh \
  --role ROLE \
  --stage STAGE \
  --project PROJECT \
  --provider PROVIDER \
  --task "TASK DESCRIPTION"'
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Roles */}
				<div className="flex flex-col gap-2">
					<span className="text-xs font-semibold text-[var(--color-text-secondary)]">
						תפקידים (role)
					</span>
					<div className="flex flex-col gap-1.5">
						{AUAP_ROLES.map((role) => (
							<div
								key={role}
								className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"
							>
								<span
									className="w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--color-accent-blue)]"
									aria-hidden="true"
								/>
								<code
									className="text-xs font-mono text-[var(--color-text-secondary)]"
									dir="ltr"
								>
									{role}
								</code>
							</div>
						))}
					</div>
				</div>

				{/* Stages */}
				<div className="flex flex-col gap-2">
					<span className="text-xs font-semibold text-[var(--color-text-secondary)]">
						שלבים (stage)
					</span>
					<div className="flex flex-col gap-1.5">
						{AUAP_STAGES.map((stage, i) => (
							<div
								key={stage}
								className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"
							>
								<span
									className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 bg-[oklch(0.65_0.18_250_/_0.2)] text-[var(--color-accent-blue)]"
									dir="ltr"
									aria-hidden="true"
								>
									{i + 1}
								</span>
								<code
									className="text-xs font-mono text-[var(--color-text-secondary)]"
									dir="ltr"
								>
									{stage}
								</code>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Bayesian section ───────────────────────────────────────────────────────────

function BayesianSection() {
	// Illustrative score bars
	const scores: {
		id: keyof typeof PROVIDER_COLORS;
		name: string;
		score: number;
		successes: number;
		failures: number;
	}[] = [
		{ id: "codex", name: "Codex", score: 0.83, successes: 5, failures: 1 },
		{ id: "gemini", name: "Gemini", score: 0.71, successes: 5, failures: 2 },
		{ id: "kimi", name: "Kimi", score: 0.67, successes: 4, failures: 2 },
		{ id: "minimax", name: "MiniMax", score: 0.5, successes: 0, failures: 0 },
	];

	return (
		<div className="flex flex-col gap-5">
			<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
				Hydra v2 בוחר ספקים אוטומטית על בסיס Beta distribution — ספק שהצליח יותר
				מקבל ציון גבוה יותר ונבחר בעדיפות.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
				<div className="text-center">
					<div
						className="text-lg font-bold text-[var(--color-text-primary)]"
						dir="ltr"
					>
						0.5
					</div>
					<div className="text-xs text-[var(--color-text-muted)]">
						ציון התחלתי
					</div>
					<div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
						0 observations (Laplace smoothing)
					</div>
				</div>
				<div className="text-center">
					<div
						className="text-lg font-bold text-[var(--color-accent-green)]"
						dir="ltr"
					>
						~0.86
					</div>
					<div className="text-xs text-[var(--color-text-muted)]">
						לאחר 5 הצלחות
					</div>
					<div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
						Beta(6,1) ≈ 0.857
					</div>
				</div>
				<div className="text-center">
					<div
						className="text-lg font-bold text-[var(--color-accent-red)]"
						dir="ltr"
					>
						~0.14
					</div>
					<div className="text-xs text-[var(--color-text-muted)]">
						לאחר 5 כישלונות
					</div>
					<div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
						Beta(1,6) ≈ 0.143
					</div>
				</div>
			</div>

			{/* Score bars */}
			<div className="flex flex-col gap-3">
				<span className="text-xs font-semibold text-[var(--color-text-secondary)]">
					ציונים נוכחיים (דוגמה אילוסטרטיבית)
				</span>
				{scores.map(({ id, name, score, successes, failures }) => {
					const c = PROVIDER_COLORS[id];
					return (
						<div key={id} className="flex flex-col gap-1.5">
							<div className="flex items-center gap-2">
								<span
									className={cn("text-xs font-semibold w-20 shrink-0", c.text)}
								>
									{name}
								</span>
								<div className="flex-1 h-2 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
									<div
										className="h-full rounded-full transition-all duration-500"
										style={{
											width: `${score * 100}%`,
											background: c.color,
										}}
										role="progressbar"
										aria-valuenow={Math.round(score * 100)}
										aria-valuemin={0}
										aria-valuemax={100}
										aria-label={`ציון ${name}: ${score}`}
									/>
								</div>
								<span
									className="text-xs font-mono text-[var(--color-text-muted)] w-10 text-end shrink-0"
									dir="ltr"
								>
									{score.toFixed(2)}
								</span>
								<span
									className="text-[10px] text-[var(--color-text-muted)] w-20 shrink-0"
									dir="ltr"
								>
									{successes}✓ / {failures}✗
								</span>
							</div>
						</div>
					);
				})}
			</div>

			<div className="flex flex-col gap-2">
				<InfoRow
					label="קובץ ציונים"
					value="~/.claude/knowledge/handoffs/hydra-bayesian.json"
				/>
				<InfoRow
					label="נשמר ב"
					value="terminal states בלבד (verified / failed)"
				/>
			</div>

			<Warning>
				לעולם אל תמחק את hydra-bayesian.json — כל היסטוריית הציונים תיאבד.
			</Warning>
		</div>
	);
}

// ── Parallel patterns section ─────────────────────────────────────────────────

interface PatternData {
	num: number;
	title: string;
	color: string;
	when: string;
	maxAgents: string;
	example: string;
}

const PATTERNS: PatternData[] = [
	{
		num: 1,
		title: "Agent Tool (פנימי — מועדף)",
		color: "oklch(0.65 0.18 250)",
		when: "2–16 משימות עצמאיות ברמת קובץ (בדיקות, refactors, ניתוח)",
		maxAgents: "16 agents (CLAUDE_MAX_AGENTS)",
		example: `Agent(prompt="כתוב בדיקות ל-auth.ts", run_in_background=true)
Agent(prompt="כתוב בדיקות ל-dashboard.ts", run_in_background=true)
Agent(prompt="כתוב בדיקות ל-api.ts", run_in_background=true)
# wait for all → review results`,
	},
	{
		num: 2,
		title: "Team (מתואם — shared task list)",
		color: "oklch(0.72 0.19 155)",
		when: "פיצ'רים מורכבים עם תלויות בין subtasks",
		maxAgents: "16 agents בצוות",
		example: `TeamCreate(team_name="feature-x")
→ TaskCreate(...)
→ Agent(team_name="feature-x") × N`,
	},
	{
		num: 3,
		title: "External Provider (AUAP dispatch)",
		color: "oklch(0.78 0.16 75)",
		when: "צורך בחוזק ספציפי: 2M context → Gemini, batch 120 → MiniMax, security → Codex",
		maxAgents: "1 ספק חיצוני בו-זמנית",
		example: `AUAP=$(bash ~/.claude/config/auap/auap-builder.sh \\
  --provider PROVIDER --project PROJECT --task "TASK")
# dispatch ONE provider with AUAP briefing`,
	},
];

function PatternCard({ data }: { data: PatternData }) {
	return (
		<div
			className="rounded-xl border p-4 flex flex-col gap-3"
			style={{
				background: `${data.color}0e`,
				borderColor: `${data.color}44`,
			}}
		>
			<div className="flex items-center gap-3">
				<div
					className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0"
					style={{
						background: `${data.color}22`,
						color: data.color,
						border: `1px solid ${data.color}44`,
					}}
					aria-hidden="true"
				>
					{data.num}
				</div>
				<span className="text-sm font-bold text-[var(--color-text-primary)]">
					{data.title}
				</span>
			</div>

			<div className="flex flex-col gap-1">
				<InfoRow label="מתי" value="" dir="rtl" />
				<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
					{data.when}
				</p>
			</div>

			<InfoRow label="מקסימום" value={data.maxAgents} dir="rtl" />

			<CodeBlock code={data.example} label="דוגמה" />
		</div>
	);
}

function PatternsDecisionTable() {
	const rows: { task: string; pattern: string; why: string }[] = [
		{
			task: "כתיבת בדיקות ל-5 קבצים",
			pattern: "Agent ×5 (פנימי)",
			why: "עצמאי, ברמת קובץ",
		},
		{
			task: "ניתוח codebase מלא",
			pattern: "Agent ×1 (Opus)",
			why: "צורך בהקשר עמוק",
		},
		{
			task: "100+ קבצי בדיקה בבאץ'",
			pattern: "MiniMax ×1 עם AUAP",
			why: "נפח batch גדול",
		},
		{
			task: "ביקורת אבטחה",
			pattern: "Codex ×1 עם AUAP",
			why: "xhigh reasoning",
		},
		{ task: "פיצ'ר עם 3 חלקים תלויים", pattern: "Team", why: "צורך בתיאום" },
		{
			task: "תיקון קובץ יחיד מהיר",
			pattern: "ישיר (ללא agents)",
			why: "קטן מדי לagents",
		},
	];

	return (
		<div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
			<table className="w-full text-sm" style={{ direction: "rtl" }}>
				<thead>
					<tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
						<th className="text-start ps-4 pe-3 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
							משימה
						</th>
						<th className="text-start ps-3 pe-3 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
							Pattern
						</th>
						<th className="text-start ps-3 pe-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
							למה
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr
							key={row.task}
							className={cn(
								"border-b border-[var(--color-border)] last:border-0 transition-colors duration-100",
								i % 2 === 0
									? "bg-transparent"
									: "bg-[var(--color-bg-elevated)]",
								"hover:bg-[var(--color-bg-tertiary)]",
							)}
						>
							<td className="ps-4 pe-3 py-3 text-sm text-[var(--color-text-primary)]">
								{row.task}
							</td>
							<td className="ps-3 pe-3 py-3">
								<code
									className="text-xs font-mono text-[var(--color-accent-blue)]"
									dir="ltr"
								>
									{row.pattern}
								</code>
							</td>
							<td className="ps-3 pe-4 py-3 text-xs text-[var(--color-text-muted)]">
								{row.why}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

// ── Quick commands section ────────────────────────────────────────────────────

const QUICK_COMMANDS: { label: string; cmd: string }[] = [
	{
		label: "Codex — dispatch",
		cmd: 'codex exec --dangerously-bypass-approvals-and-sandbox --ephemeral -C "$dir" - <<< "$AUAP"',
	},
	{
		label: "Kimi — dispatch",
		cmd: 'kimi --quiet --yolo -p "$AUAP" -w "$dir"',
	},
	{
		label: "Gemini — dispatch (TTY)",
		cmd: "script -qec \"gemini --yolo -m gemini-3.1-pro-preview -p '$AUAP'\" /dev/null",
	},
	{
		label: "MiniMax — dispatch",
		cmd: 'minimax --batch "$AUAP"',
	},
	{
		label: "AUAP — בניית briefing",
		cmd: 'bash ~/.claude/config/auap/auap-builder.sh --role implementer --stage implement --project mexicani --provider codex --task "תיאור המשימה"',
	},
	{
		label: "MiniMax — batch 50 concurrent",
		cmd: 'for i in $(seq 1 50); do\n  minimax --batch "$PROMPT" &\n  sleep 0.05\ndone\nwait',
	},
	{
		label: "Gemini — 3 parallel עם stagger",
		cmd: "script -qec \"gemini --yolo -p '$P1'\" /dev/null &\nsleep 30\nscript -qec \"gemini --yolo -p '$P2'\" /dev/null &\nsleep 30\nscript -qec \"gemini --yolo -p '$P3'\" /dev/null &\nwait",
	},
	{
		label: "ציוני Bayesian — בדיקה",
		cmd: "python3 ~/.claude/scripts/hydra-v2/score_persistence.py",
	},
];

// ── Page ──────────────────────────────────────────────────────────────────────

export function DispatchGuidePage() {
	return (
		<div className="flex flex-col gap-6">
			{/* ── Header ── */}
			<div className="flex items-center gap-3">
				<Send
					size={20}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						מדריך Dispatch
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						איך עובד Multi-Model Dispatch — Codex, Kimi, Gemini, MiniMax
					</p>
				</div>
			</div>

			{/* ── Stats strip ── */}
			<div className="flex items-center gap-2 flex-wrap">
				{Object.entries(PROVIDER_COLORS).map(([id, c]) => (
					<div
						key={id}
						className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs"
						style={{
							background: `${c.color}12`,
							borderColor: `${c.color}40`,
						}}
					>
						<span
							style={{ color: c.color }}
							className="font-semibold capitalize"
						>
							{id}
						</span>
						<span className="text-[var(--color-text-muted)]">
							{id === "codex" && "1M ctx"}
							{id === "kimi" && "200K ctx"}
							{id === "gemini" && "2M ctx"}
							{id === "minimax" && "204K ctx"}
						</span>
					</div>
				))}
				<div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-xs">
					<Bot
						size={13}
						className="text-[var(--color-text-muted)]"
						aria-hidden="true"
					/>
					<span className="text-[var(--color-text-muted)]">4 ספקים</span>
				</div>
			</div>

			{/* ── Accordion sections ── */}
			<div className="flex flex-col gap-3">
				{/* 1. Providers */}
				<AccordionSection
					title="ספקים — Providers"
					icon={<Bot size={18} />}
					accentColor="oklch(0.65 0.18 250)"
					defaultOpen
				>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{PROVIDERS_DATA.map((p) => (
							<ProviderCard key={p.id} data={p} />
						))}
					</div>
				</AccordionSection>

				{/* 2. AUAP */}
				<AccordionSection
					title="AUAP — Agent Unified Action Protocol"
					icon={<Layers size={18} />}
					accentColor="oklch(0.78 0.16 75)"
				>
					<AuapSection />
				</AccordionSection>

				{/* 3. Routing */}
				<AccordionSection
					title="Routing — בחירה אוטומטית"
					icon={<Table2 size={18} />}
					accentColor="oklch(0.72 0.19 155)"
				>
					<div className="flex flex-col gap-4">
						<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
							כלל ברזל: dispatch-command-guard.sh חוסם פקודות עם flags שגויים
							אוטומטית. בחר ספק לפי הטבלה הזו:
						</p>
						<RoutingTable />
					</div>
				</AccordionSection>

				{/* 4. Bayesian */}
				<AccordionSection
					title="Bayesian Routing — ניקוד ספקים"
					icon={<TrendingUp size={18} />}
					accentColor="oklch(0.62 0.2 290)"
				>
					<BayesianSection />
				</AccordionSection>

				{/* 5. 3 Patterns */}
				<AccordionSection
					title="3 דפוסי עבודה מקבילית"
					icon={<Shuffle size={18} />}
					accentColor="oklch(0.75 0.14 200)"
				>
					<div className="flex flex-col gap-5">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
							{PATTERNS.map((p) => (
								<PatternCard key={p.num} data={p} />
							))}
						</div>

						<div className="flex flex-col gap-3">
							<span className="text-sm font-semibold text-[var(--color-text-secondary)]">
								טבלת החלטה — מה להשתמש מתי
							</span>
							<PatternsDecisionTable />
						</div>

						<Warning>
							"מקסימום" / "שיא" = עומק מקסימלי, לא רוחב מקסימלי. שליחה ל-10
							ספקים חיצוניים במקביל = כאוס — לא מקסימום.
						</Warning>
					</div>
				</AccordionSection>

				{/* 6. Quick Commands */}
				<AccordionSection
					title="פקודות מהירות — Quick Reference"
					icon={<Zap size={18} />}
					accentColor="oklch(0.78 0.16 75)"
				>
					<div className="flex flex-col gap-4">
						<p className="text-sm text-[var(--color-text-muted)]">
							כל פקודות ה-dispatch מוכנות להעתקה:
						</p>
						<div className="grid grid-cols-1 gap-3">
							{QUICK_COMMANDS.map((c) => (
								<div key={c.label} className="flex flex-col gap-1.5">
									<div className="flex items-center gap-2">
										<span
											className="w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--color-accent-blue)]"
											aria-hidden="true"
										/>
										<span className="text-xs font-semibold text-[var(--color-text-secondary)]">
											{c.label}
										</span>
									</div>
									<CodeBlock code={c.cmd} />
								</div>
							))}
						</div>
					</div>
				</AccordionSection>
			</div>

			{/* ── Footer note ── */}
			<div className="flex items-start gap-2 rounded-xl p-4 bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
				<BookOpen
					size={14}
					className="mt-0.5 shrink-0 text-[var(--color-text-muted)]"
					aria-hidden="true"
				/>
				<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
					קבצי הגדרות מלאים:{" "}
					<code
						className="font-mono text-[var(--color-text-secondary)]"
						dir="ltr"
					>
						~/.claude/config/auap/
					</code>{" "}
					|{" "}
					<code
						className="font-mono text-[var(--color-text-secondary)]"
						dir="ltr"
					>
						~/.claude/scripts/hydra-v2/
					</code>{" "}
					| Bayesian routing reference:{" "}
					<code
						className="font-mono text-[var(--color-text-secondary)]"
						dir="ltr"
					>
						hydra-v2-rules.md
					</code>
				</p>
			</div>
		</div>
	);
}
