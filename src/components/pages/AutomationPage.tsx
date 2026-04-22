import {
	AlertTriangle,
	ArrowLeft,
	ArrowLeftRight,
	Bot,
	CheckCircle2,
	Circle,
	Clock,
	Code2,
	Database,
	FileCode2,
	GitBranch,
	GitMerge,
	Layers,
	ListChecks,
	Network,
	PackageCheck,
	Play,
	RefreshCw,
	Server,
	Settings,
	Shield,
	Sparkles,
	Terminal,
	Workflow,
	Zap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/cn";

// ── Design tokens (OKLCH) ─────────────────────────────────────────────────────

const C = {
	blue: "var(--color-accent-blue)",
	green: "var(--color-accent-green)",
	amber: "var(--color-accent-amber)",
	red: "var(--color-accent-red)",
	purple: "var(--color-accent-purple)",
	cyan: "var(--color-accent-cyan)",
} as const;

// ── Sub-components ────────────────────────────────────────────────────────────

interface SectionHeadingProps {
	icon: React.ReactNode;
	title: string;
	subtitle?: string;
	accentColor?: string;
}

function SectionHeading({
	icon,
	title,
	subtitle,
	accentColor = C.blue,
}: SectionHeadingProps) {
	return (
		<div className="flex items-center gap-3 mb-4">
			<span
				className="flex size-9 shrink-0 items-center justify-center rounded-lg"
				style={{ background: `${accentColor}20`, color: accentColor }}
				aria-hidden="true"
			>
				{icon}
			</span>
			<div>
				<h2 className="text-base font-bold text-text-primary leading-tight">
					{title}
				</h2>
				{subtitle && (
					<p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
				)}
			</div>
		</div>
	);
}

// ── Schedule card ─────────────────────────────────────────────────────────────

type ScheduleFreq = "nightly" | "daily" | "weekly" | "always" | "monday";

const FREQ_LABELS: Record<ScheduleFreq, string> = {
	nightly: "לילי",
	daily: "יומי",
	weekly: "שבועי",
	always: "תמיד",
	monday: "שני",
};

const FREQ_COLORS: Record<ScheduleFreq, string> = {
	nightly: C.purple,
	daily: C.cyan,
	weekly: C.amber,
	always: C.green,
	monday: C.blue,
};

interface ScheduleCardProps {
	time: string;
	label: string;
	description: string;
	freq: ScheduleFreq;
	tasks: string[];
	icon: React.ReactNode;
}

function ScheduleCard({
	time,
	label,
	description,
	freq,
	tasks,
	icon,
}: ScheduleCardProps) {
	const freqColor = FREQ_COLORS[freq];
	const freqLabel = FREQ_LABELS[freq];

	return (
		<div
			className={cn(
				"glass-card card-spotlight p-4 flex flex-col gap-3",
				"hover:border-border-hover transition-colors duration-200",
			)}
		>
			{/* Header row */}
			<div className="flex items-start gap-3">
				<span
					className="flex size-9 shrink-0 items-center justify-center rounded-lg mt-0.5"
					style={{ background: `${freqColor}18`, color: freqColor }}
					aria-hidden="true"
				>
					{icon}
				</span>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2 flex-wrap">
						<span
							className="text-xs font-mono font-bold"
							style={{ color: freqColor }}
							dir="ltr"
						>
							{time}
						</span>
						<span
							className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
							style={{ background: `${freqColor}18`, color: freqColor }}
						>
							{freqLabel}
						</span>
					</div>
					<p className="text-sm font-semibold text-text-primary mt-0.5 leading-tight">
						{label}
					</p>
					<p className="text-xs text-text-muted mt-0.5 leading-snug">
						{description}
					</p>
				</div>
			</div>

			{/* Tasks list */}
			<ul className="space-y-1.5 ps-1">
				{tasks.map((task) => (
					<li key={task} className="flex items-center gap-2">
						<CheckCircle2
							size={11}
							className="shrink-0 text-accent-green"
							aria-hidden="true"
						/>
						<span className="text-xs text-text-secondary">{task}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

// ── AutoResearch tool card ────────────────────────────────────────────────────

interface ResearchToolProps {
	name: string;
	description: string;
	script: string;
	icon: React.ReactNode;
	accentColor?: string;
}

function ResearchTool({
	name,
	description,
	script,
	icon,
	accentColor = C.cyan,
}: ResearchToolProps) {
	return (
		<div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
			<span
				className="flex size-8 shrink-0 items-center justify-center rounded-md mt-0.5"
				style={{ background: `${accentColor}18`, color: accentColor }}
				aria-hidden="true"
			>
				{icon}
			</span>
			<div className="min-w-0 flex-1">
				<p className="text-sm font-semibold text-text-primary leading-tight">
					{name}
				</p>
				<p className="text-xs text-text-muted mt-0.5 leading-snug">
					{description}
				</p>
				<code
					className="inline-block mt-1.5 rounded px-1.5 py-0.5 text-[10px] font-mono"
					style={{
						background: `${accentColor}12`,
						color: accentColor,
					}}
					dir="ltr"
				>
					{script}
				</code>
			</div>
		</div>
	);
}

// ── AutoResearch best-results table ──────────────────────────────────────────

interface ProjectResult {
	project: string;
	before: string;
	after: string;
	improvement: string;
	category: string;
}

const BEST_RESULTS: ProjectResult[] = [
	{
		project: "mexicani",
		before: "1,240 KB",
		after: "142 KB",
		improvement: "-89%",
		category: "bundle",
	},
	{
		project: "shifts",
		before: "890 KB",
		after: "318 KB",
		improvement: "-64%",
		category: "bundle",
	},
	{
		project: "cash (Z)",
		before: "720 KB",
		after: "460 KB",
		improvement: "-36%",
		category: "bundle",
	},
	{
		project: "nadavai",
		before: "980 KB",
		after: "555 KB",
		improvement: "-43%",
		category: "bundle",
	},
	{
		project: "hatumdigital",
		before: "1,100 KB",
		after: "590 KB",
		improvement: "-46%",
		category: "bundle",
	},
	{
		project: "signature-pro",
		before: "540 KB",
		after: "310 KB",
		improvement: "-43%",
		category: "bundle",
	},
	{
		project: "mediflow",
		before: "820 KB",
		after: "631 KB",
		improvement: "-23%",
		category: "bundle",
	},
	{
		project: "vibechat",
		before: "1,050 KB",
		after: "480 KB",
		improvement: "-54%",
		category: "bundle",
	},
	{
		project: "brain",
		before: "670 KB",
		after: "390 KB",
		improvement: "-42%",
		category: "bundle",
	},
	{
		project: "design-system",
		before: "220 KB",
		after: "95 KB",
		improvement: "-57%",
		category: "bundle",
	},
	{
		project: "SportChat",
		before: "42 MB APK",
		after: "18 MB APK",
		improvement: "-57%",
		category: "flutter",
	},
];

function ImprovementBadge({ value }: { value: string }) {
	const pct = Number.parseInt(value.replace(/[^0-9-]/g, ""), 10);
	let color: string = C.green;
	if (pct <= -50) color = "oklch(0.72 0.22 155)";
	else if (pct <= -35) color = C.cyan;
	else color = C.amber;

	return (
		<span
			className="rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
			style={{ background: `${color}18`, color }}
			dir="ltr"
		>
			{value}
		</span>
	);
}

// ── Hydra queue visualizer ────────────────────────────────────────────────────

type QueueStage = "pending" | "in-progress" | "completed" | "failed";

interface QueueStep {
	stage: QueueStage;
	label: string;
	desc: string;
	color: string;
}

const QUEUE_STEPS: QueueStep[] = [
	{
		stage: "pending",
		label: "pending/",
		desc: "ממתין להפעלה",
		color: C.amber,
	},
	{
		stage: "in-progress",
		label: "in-progress/",
		desc: "מתבצע עכשיו",
		color: C.blue,
	},
	{
		stage: "completed",
		label: "completed/",
		desc: "הושלם בהצלחה",
		color: C.green,
	},
	{
		stage: "failed",
		label: "failed/",
		desc: "נכשל, מחכה לבדיקה",
		color: C.red,
	},
];

// ── Priority badge ────────────────────────────────────────────────────────────

type Priority = "urgent" | "high" | "normal" | "low";

const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
	urgent: { label: "דחוף", color: C.red },
	high: { label: "גבוה", color: C.amber },
	normal: { label: "רגיל", color: C.blue },
	low: { label: "נמוך", color: "var(--color-text-muted)" },
};

function PriorityBadge({ priority }: { priority: Priority }) {
	const meta = PRIORITY_META[priority];
	return (
		<span
			className="rounded-full px-2.5 py-1 text-xs font-bold"
			style={{ background: `${meta.color}20`, color: meta.color }}
		>
			{meta.label}
		</span>
	);
}

// ── Learning pipeline step ────────────────────────────────────────────────────

interface PipelineStepProps {
	from: string;
	to: string;
	description: string;
	isLast?: boolean;
}

function PipelineStep({ from, to, description, isLast }: PipelineStepProps) {
	return (
		<div className="flex items-start gap-3">
			{/* connector line */}
			<div className="flex flex-col items-center shrink-0">
				<div
					className="flex size-8 items-center justify-center rounded-full"
					style={{
						background: "oklch(0.65 0.18 250 / 0.15)",
						border: "1px solid oklch(0.65 0.18 250 / 0.4)",
					}}
					aria-hidden="true"
				>
					<Circle
						size={8}
						fill="var(--color-accent-blue)"
						className="text-accent-blue"
					/>
				</div>
				{!isLast && <div className="w-px flex-1 min-h-6 bg-border mt-1" />}
			</div>

			{/* content */}
			<div className="pb-4 min-w-0 flex-1">
				<div className="flex items-center gap-2 flex-wrap">
					<code
						className="rounded px-1.5 py-0.5 text-xs font-mono bg-bg-elevated text-accent-cyan"
						dir="ltr"
					>
						{from}
					</code>
					<ArrowLeft
						size={12}
						className="shrink-0 text-text-muted rtl:rotate-180"
						aria-hidden="true"
					/>
					<code
						className="rounded px-1.5 py-0.5 text-xs font-mono bg-bg-elevated text-accent-purple"
						dir="ltr"
					>
						{to}
					</code>
				</div>
				<p className="text-xs text-text-muted mt-1 leading-snug">
					{description}
				</p>
			</div>
		</div>
	);
}

// ── CI runner card ────────────────────────────────────────────────────────────

interface RunnerGroupProps {
	machine: string;
	count: number;
	online: number;
	color: string;
}

function RunnerGroup({ machine, count, online, color }: RunnerGroupProps) {
	const pct = Math.round((online / count) * 100);
	return (
		<div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
			<span
				className="flex size-8 shrink-0 items-center justify-center rounded-md"
				style={{ background: `${color}18`, color }}
				aria-hidden="true"
			>
				<Server size={15} />
			</span>
			<div className="min-w-0 flex-1">
				<div className="flex items-center justify-between mb-1">
					<span className="text-sm font-semibold text-text-primary">
						{machine}
					</span>
					<span className="text-xs text-text-muted" dir="ltr">
						{online}/{count} online
					</span>
				</div>
				<div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
					<div
						className="h-full rounded-full transition-all duration-500"
						style={{ width: `${pct}%`, background: color }}
					/>
				</div>
			</div>
		</div>
	);
}

// ── GitHub Apps card ──────────────────────────────────────────────────────────

interface GhAppProps {
	name: string;
	description: string;
	scope: string;
	icon: React.ReactNode;
	color: string;
}

function GhApp({ name, description, scope, icon, color }: GhAppProps) {
	return (
		<div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
			<span
				className="flex size-8 shrink-0 items-center justify-center rounded-md mt-0.5"
				style={{ background: `${color}18`, color }}
				aria-hidden="true"
			>
				{icon}
			</span>
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-sm font-semibold text-text-primary">
						{name}
					</span>
					<span
						className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase"
						style={{ background: `${color}18`, color }}
					>
						{scope}
					</span>
				</div>
				<p className="text-xs text-text-muted mt-0.5 leading-snug">
					{description}
				</p>
			</div>
			<span className="shrink-0 flex items-center gap-1 text-xs text-accent-green">
				<CheckCircle2 size={12} aria-hidden="true" />
				פעיל
			</span>
		</div>
	);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function AutomationPage() {
	return (
		<div className="space-y-8 p-6 max-w-[1400px] mx-auto">
			<PageHeader
				icon={Bot}
				title="אוטומציה"
				description="תהליכים אוטומטיים — Cron jobs, Self-healing, Ambient agents"
			/>

			{/* ── Page Header ──────────────────────────────────────────────── */}
			<header className="flex items-center gap-4">
				<div
					className="flex size-12 items-center justify-center rounded-xl shadow-lg"
					style={{
						background: "oklch(0.65 0.18 250 / 0.15)",
						border: "1px solid oklch(0.65 0.18 250 / 0.3)",
						boxShadow: "0 0 24px oklch(0.65 0.18 250 / 0.15)",
					}}
					aria-hidden="true"
				>
					<Bot size={24} className="text-accent-blue" />
				</div>

				{/* live indicator */}
				<div className="ms-auto flex items-center gap-2 rounded-full px-3 py-1.5 bg-bg-elevated">
					<span
						className="size-2 rounded-full animate-pulse"
						style={{ background: C.green }}
						aria-hidden="true"
					/>
					<span className="text-xs font-medium text-accent-green">פעיל</span>
				</div>
			</header>

			{/* ── Stat strip ────────────────────────────────────────────────── */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 stagger-grid">
				{[
					{ label: "תהליכים מתוזמנים", value: "7", icon: Clock, color: C.blue },
					{
						label: "GitHub Apps",
						value: "3",
						icon: GitMerge,
						color: C.purple,
					},
					{ label: "runners פעילים", value: "22", icon: Server, color: C.cyan },
					{
						label: "שיפור bundle ממוצע",
						value: "-49%",
						icon: Zap,
						color: C.green,
					},
				].map(({ label, value, icon: Icon, color }) => (
					<div
						key={label}
						className="glass-card card-spotlight p-4 flex items-center gap-3"
					>
						<span
							className="flex size-9 shrink-0 items-center justify-center rounded-lg"
							style={{ background: `${color}18`, color }}
							aria-hidden="true"
						>
							<Icon size={18} />
						</span>
						<div>
							<p
								className="text-xl font-bold leading-none"
								style={{ color }}
								dir="ltr"
							>
								{value}
							</p>
							<p className="text-xs text-text-muted mt-0.5">{label}</p>
						</div>
					</div>
				))}
			</div>

			<Tabs
				tabs={[
					{ id: "cron", label: "Cron Jobs" },
					{ id: "ci", label: "CI אוטומציה" },
					{ id: "ambient", label: "Ambient Agents" },
					{ id: "routines", label: "לוח זמנים" },
				]}
			>
				{(activeTab) => (
					<div className="space-y-8">
						{/* ══ Section 1: תהליכים מתוזמנים ══════════════════════════════════ */}
						{activeTab === "cron" && (
							<section aria-labelledby="s1-heading">
								<SectionHeading
									icon={<Clock size={18} />}
									title="תהליכים מתוזמנים"
									subtitle="שגרות אוטומטיות לפי לוח זמנים קבוע"
									accentColor={C.blue}
								/>
								<div id="s1-heading" className="sr-only">
									תהליכים מתוזמנים
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
									<ScheduleCard
										time="02:08"
										label="Nightly Optimization"
										description="ניתוח bundle לילי, סריקת קוד מת, אופטימיזציה אוטומטית"
										freq="nightly"
										icon={<Sparkles size={17} />}
										tasks={[
											"bundle analysis — כל הפרויקטים",
											"dead code scan — knip",
											"autoresearch loop — LangGraph",
											"lighthouse overnight run",
										]}
									/>

									<ScheduleCard
										time="07:00"
										label="Daily Scans"
										description="סריקות אבטחה ואיכות יומיות עם דיווח מסכם"
										freq="daily"
										icon={<Shield size={17} />}
										tasks={[
											"trivy CVE — HIGH/CRITICAL",
											"type-coverage ≥ 90%",
											"lighthouse CI audit",
											"semgrep quick scan",
										]}
									/>

									<ScheduleCard
										time="09:00 Mon"
										label="Monday Security"
										description="ביקורת אבטחה שבועית מקיפה עם semgrep ו-dependency audit"
										freq="monday"
										icon={<AlertTriangle size={17} />}
										tasks={[
											"semgrep scan --config=auto",
											"dependency audit — socket.dev",
											"gitleaks history scan",
											"SBOM generation",
										]}
									/>

									<ScheduleCard
										time="pre-commit"
										label="Pre-commit Hooks"
										description="בדיקות אוטומטיות לפני כל commit — חסימה על הפרות"
										freq="always"
										icon={<GitBranch size={17} />}
										tasks={[
											"RTL auto-fix — ms-/me- enforcement",
											"secrets scan — gitleaks",
											"lint-staged — Biome",
											"Conventional Commits validation",
										]}
									/>

									<ScheduleCard
										time="Mon CI"
										label="Monday Knip"
										description="גילוי קוד מת שבועי ב-CI — ייצוא מדדים"
										freq="monday"
										icon={<Code2 size={17} />}
										tasks={[
											"knip — dead exports detection",
											"unused dependencies check",
											"orphan files report",
											"PR comment with findings",
										]}
									/>

									<ScheduleCard
										time="Sun 03:00"
										label="Weekly CVE Auto-Fix"
										description="trivy-autofix.yml — תיקון CVE אוטומטי עם PR לכל פרויקט"
										freq="weekly"
										icon={<PackageCheck size={17} />}
										tasks={[
											"trivy fs . --severity HIGH,CRITICAL",
											"pnpm.overrides patch generation",
											"auto PR per repo — 13 repos",
											"Slack/email notification",
										]}
									/>

									<ScheduleCard
										time="Weekly"
										label="Renovate"
										description="עדכוני תלות שבועיים אוטומטיים עם PR — 13 repositories"
										freq="weekly"
										icon={<RefreshCw size={17} />}
										tasks={[
											"dependency updates — grouped PRs",
											"minimumReleaseAge: 3d guard",
											"security advisories priority",
											"13 repos — all stacks",
										]}
									/>
								</div>
							</section>
						)}

						{/* ══ Section 2: AutoResearch System ════════════════════════════════ */}
						{activeTab === "ambient" && (
							<section aria-labelledby="s2-heading">
								<SectionHeading
									icon={<Network size={18} />}
									title="AutoResearch System"
									subtitle="~/.claude/autoresearch/ — לולאות LangGraph אוטומטיות לאופטימיזציה"
									accentColor={C.cyan}
								/>
								<h2 id="s2-heading" className="sr-only">
									AutoResearch System
								</h2>

								<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 stagger-grid">
									{/* Tools list */}
									<div className="glass-card card-spotlight flex flex-col">
										<div className="flex items-center gap-2 border-b border-border px-4 py-3">
											<Workflow
												size={15}
												className="text-accent-cyan"
												aria-hidden="true"
											/>
											<span className="text-sm font-semibold text-text-primary">
												כלי AutoResearch
											</span>
											<code
												className="ms-auto text-[10px] font-mono text-text-muted bg-bg-elevated rounded px-1.5 py-0.5"
												dir="ltr"
											>
												~/.claude/autoresearch/
											</code>
										</div>
										<div className="p-4">
											<ResearchTool
												name="Bundle Optimizer"
												description="לולאת LangGraph לניתוח bundle — מגלה מרכיבים כבדים ומציע אופטימיזציות"
												script="autoresearch/bundle-loop.py"
												icon={<Zap size={15} />}
												accentColor={C.cyan}
											/>
											<ResearchTool
												name="trivy-auto-pr"
												description="מגלה CVEs, מייצר pnpm.overrides patch ופותח PR אוטומטי לכל repository"
												script="autoresearch/trivy-auto-pr.sh"
												icon={<Shield size={15} />}
												accentColor={C.red}
											/>
											<ResearchTool
												name="RTL Fixer"
												description="תיקון אוטומטי של הפרות RTL — ml-/mr- → ms-/me-, web + Flutter"
												script="autoresearch/rtl-fixer.py"
												icon={<ArrowLeftRight size={15} />}
												accentColor={C.purple}
											/>
											<ResearchTool
												name="Lighthouse Loop"
												description="הרצת Lighthouse CI על כל הפרויקטים עם מעקב trended over time"
												script="autoresearch/lighthouse-loop.sh"
												icon={<Sparkles size={15} />}
												accentColor={C.amber}
											/>
											<ResearchTool
												name="Auto-Onboard"
												description="אוטומציה של onboarding לפרויקט חדש — CI, hooks, rules, renovate"
												script="autoresearch/auto-onboard.sh"
												icon={<Play size={15} />}
												accentColor={C.green}
											/>
										</div>
									</div>

									{/* Best results table */}
									<div className="glass-card card-spotlight flex flex-col">
										<div className="flex items-center gap-2 border-b border-border px-4 py-3">
											<ListChecks
												size={15}
												className="text-accent-green"
												aria-hidden="true"
											/>
											<span className="text-sm font-semibold text-text-primary">
												תוצאות הטובות ביותר
											</span>
											<span className="ms-auto text-xs text-text-muted">
												11 פרויקטים
											</span>
										</div>

										<div className="flex-1 overflow-x-auto">
											<table className="w-full text-xs">
												<thead>
													<tr className="border-b border-border">
														<th
															scope="col"
															className="px-4 py-2.5 text-start font-semibold text-text-muted uppercase tracking-wide text-[10px]"
														>
															פרויקט
														</th>
														<th
															scope="col"
															className="px-3 py-2.5 text-start font-semibold text-text-muted uppercase tracking-wide text-[10px]"
														>
															לפני
														</th>
														<th
															scope="col"
															className="px-3 py-2.5 text-start font-semibold text-text-muted uppercase tracking-wide text-[10px]"
														>
															אחרי
														</th>
														<th
															scope="col"
															className="px-3 py-2.5 text-start font-semibold text-text-muted uppercase tracking-wide text-[10px]"
														>
															שיפור
														</th>
													</tr>
												</thead>
												<tbody>
													{BEST_RESULTS.map((row) => (
														<tr
															key={row.project}
															className="border-b border-border last:border-0 hover:bg-bg-elevated transition-colors duration-150"
														>
															<td className="px-4 py-2.5">
																<span className="font-semibold text-text-primary">
																	{row.project}
																</span>
															</td>
															<td
																className="px-3 py-2.5 font-mono text-text-muted"
																dir="ltr"
															>
																{row.before}
															</td>
															<td
																className="px-3 py-2.5 font-mono text-accent-green"
																dir="ltr"
															>
																{row.after}
															</td>
															<td className="px-3 py-2.5">
																<ImprovementBadge value={row.improvement} />
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>

										{/* summary row */}
										<div className="border-t border-border px-4 py-3 flex items-center gap-3 bg-bg-elevated rounded-b-xl">
											<Zap
												size={14}
												className="text-accent-green shrink-0"
												aria-hidden="true"
											/>
											<span className="text-xs text-text-secondary">
												טווח שיפור:{" "}
												<strong className="text-accent-green">
													-23% עד -89%
												</strong>{" "}
												— ממוצע{" "}
												<strong className="text-accent-green">-49%</strong>
											</span>
										</div>
									</div>
								</div>
							</section>
						)}

						{/* ══ Section 3: Hydra Watcher ══════════════════════════════════════ */}
						{activeTab === "ambient" && (
							<section aria-labelledby="s3-heading">
								<SectionHeading
									icon={<Zap size={18} />}
									title="Hydra Watcher"
									subtitle="systemctl --user hydra-dispatch.service — תהליך רצף משימות"
									accentColor={C.purple}
								/>
								<h2 id="s3-heading" className="sr-only">
									Hydra Watcher
								</h2>

								<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 stagger-grid">
									{/* Queue flow */}
									<div className="glass-card card-spotlight lg:col-span-2 p-4">
										<div className="flex items-center gap-2 mb-4">
											<Workflow
												size={14}
												className="text-accent-purple"
												aria-hidden="true"
											/>
											<span className="text-sm font-semibold text-text-primary">
												תור המשימות
											</span>
											<code
												className="ms-auto text-[10px] font-mono text-text-muted bg-bg-elevated rounded px-1.5 py-0.5"
												dir="ltr"
											>
												~/.claude/knowledge/handoffs/
											</code>
										</div>

										{/* Visual queue flow */}
										<div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
											{QUEUE_STEPS.map((step, idx) => (
												<div
													key={step.stage}
													className="flex items-center gap-1 shrink-0"
												>
													<div
														className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg"
														style={{
															background: `${step.color}12`,
															border: `1px solid ${step.color}30`,
														}}
													>
														<code
															className="text-[11px] font-mono font-bold"
															style={{ color: step.color }}
															dir="ltr"
														>
															{step.label}
														</code>
														<span className="text-[10px] text-text-muted">
															{step.desc}
														</span>
													</div>
													{idx < QUEUE_STEPS.length - 1 && (
														<ArrowLeft
															size={14}
															className="shrink-0 text-text-muted rtl:rotate-180"
															aria-hidden="true"
														/>
													)}
												</div>
											))}
										</div>

										{/* Priority queue */}
										<div className="mb-4">
											<p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
												סדר עדיפויות
											</p>
											<div className="flex items-center gap-2 flex-wrap">
												{(
													["urgent", "high", "normal", "low"] as Priority[]
												).map((p, idx) => (
													<div key={p} className="flex items-center gap-1.5">
														<PriorityBadge priority={p} />
														{idx < 3 && (
															<ArrowLeft
																size={12}
																className="text-text-muted rtl:rotate-180"
																aria-hidden="true"
															/>
														)}
													</div>
												))}
											</div>
										</div>

										{/* Log path */}
										<div className="rounded-lg bg-bg-elevated px-3 py-2 flex items-center gap-2">
											<Terminal
												size={13}
												className="shrink-0 text-text-muted"
												aria-hidden="true"
											/>
											<code
												className="text-[11px] font-mono text-text-secondary"
												dir="ltr"
											>
												~/.config/agents/logs/hydra-watcher.jsonl
											</code>
										</div>
									</div>

									{/* Concurrency config */}
									<div className="glass-card card-spotlight p-4 flex flex-col gap-4">
										<div className="flex items-center gap-2">
											<Settings
												size={14}
												className="text-accent-purple"
												aria-hidden="true"
											/>
											<span className="text-sm font-semibold text-text-primary">
												הגדרות Watcher
											</span>
										</div>

										{/* Concurrency meters */}
										{[
											{
												label: "ברירת מחדל",
												value: 3,
												max: 8,
												color: C.blue,
												sublabel: "מומלץ לעבודה שוטפת",
											},
											{
												label: "מקסימום",
												value: 8,
												max: 8,
												color: C.amber,
												sublabel: "_MAX_CONCURRENT_CAP=8",
											},
										].map(({ label, value, max, color, sublabel }) => (
											<div key={label}>
												<div className="flex items-center justify-between mb-1">
													<span className="text-xs font-medium text-text-secondary">
														{label}
													</span>
													<span
														className="text-xs font-bold"
														style={{ color }}
														dir="ltr"
													>
														{value}/{max}
													</span>
												</div>
												<div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
													<div
														className="h-full rounded-full"
														style={{
															width: `${(value / max) * 100}%`,
															background: color,
														}}
													/>
												</div>
												<p className="text-[10px] text-text-muted mt-0.5">
													{sublabel}
												</p>
											</div>
										))}

										<div className="border-t border-border pt-3 space-y-2">
											{[
												{
													label: "Timeout",
													value: "910s + 120s verify",
													dir: "ltr",
												},
												{
													label: "SQLite",
													value: "hydra-state.db",
													dir: "ltr",
												},
												{
													label: "LanceDB",
													value: "lancedb_memory/",
													dir: "ltr",
												},
												{ label: "Port FastAPI", value: "8742", dir: "ltr" },
											].map(({ label, value, dir }) => (
												<div
													key={label}
													className="flex items-center justify-between"
												>
													<span className="text-xs text-text-muted">
														{label}
													</span>
													<code
														className="text-[11px] font-mono text-accent-cyan bg-bg-elevated rounded px-1.5 py-0.5"
														dir={dir as "ltr" | "rtl"}
													>
														{value}
													</code>
												</div>
											))}
										</div>

										{/* Service status */}
										<div
											className="rounded-lg px-3 py-2 flex items-center gap-2"
											style={{ background: "oklch(0.72 0.19 155 / 0.08)" }}
										>
											<span
												className="size-2 rounded-full shrink-0 animate-pulse"
												style={{ background: C.green }}
												aria-hidden="true"
											/>
											<code
												className="text-[11px] font-mono text-accent-green"
												dir="ltr"
											>
												systemctl --user status hydra-dispatch
											</code>
										</div>
									</div>
								</div>
							</section>
						)}

						{/* ══ Section 4: Learning Pipeline ══════════════════════════════════ */}
						{activeTab === "cron" && (
							<section aria-labelledby="s4-heading">
								<SectionHeading
									icon={<Database size={18} />}
									title="Learning Pipeline"
									subtitle="צינור הלמידה האוטומטי — כל תיקון הופך לחוק"
									accentColor={C.amber}
								/>
								<h2 id="s4-heading" className="sr-only">
									Learning Pipeline
								</h2>

								<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 stagger-grid">
									{/* Pipeline steps */}
									<div className="glass-card card-spotlight p-4">
										<div className="flex items-center gap-2 mb-4">
											<Workflow
												size={14}
												className="text-accent-amber"
												aria-hidden="true"
											/>
											<span className="text-sm font-semibold text-text-primary">
												שלבי הצינור
											</span>
										</div>

										<div>
											<PipelineStep
												from="correction-detector.sh"
												to="corrections.jsonl"
												description="מגלה תיקוני משתמש בזמן אמת, שומר ב-JSONL לניתוח"
											/>
											<PipelineStep
												from="dispatch-auto-log.sh"
												to="audit-patterns.jsonl"
												description="מתעד כל dispatch לסוכן — provider, duration, outcome"
											/>
											<PipelineStep
												from="claude-md-auto-update.sh"
												to="auto-learned-rules.md"
												description="מייצר חוקים חדשים מהתיקונים ומוסיף ל-CLAUDE.md אוטומטית"
											/>
											<PipelineStep
												from="knowledge-capture.sh"
												to="beads.jsonl"
												description="שומר כל ידע חשוב מהסשן כ-bead עם timestamp ו-confidence"
											/>
											<PipelineStep
												from="memory-bridge.sh"
												to="Memory MCP"
												description="מעביר beads לזיכרון ארוך-טווח דרך Knowledge Graph MCP"
												isLast
											/>
										</div>
									</div>

									{/* Learning stats */}
									<div className="flex flex-col gap-4">
										<div className="glass-card card-spotlight p-4 flex-1">
											<div className="flex items-center gap-2 mb-3">
												<Layers
													size={14}
													className="text-accent-amber"
													aria-hidden="true"
												/>
												<span className="text-sm font-semibold text-text-primary">
													מאגרי ידע
												</span>
											</div>
											<div className="space-y-3">
												{[
													{
														file: "corrections.jsonl",
														desc: "תיקוני משתמש",
														count: "∞",
														color: C.amber,
													},
													{
														file: "audit-patterns.jsonl",
														desc: "מדדי dispatch",
														count: "∞",
														color: C.cyan,
													},
													{
														file: "auto-learned-rules.md",
														desc: "חוקים שנלמדו",
														count: "80+",
														color: C.blue,
													},
													{
														file: "beads.jsonl",
														desc: "ידע מפוסל",
														count: "∞",
														color: C.purple,
													},
													{
														file: "hydra-bayesian.json",
														desc: "ציוני Bayesian",
														count: "4",
														color: C.green,
													},
												].map(({ file, desc, count, color }) => (
													<div key={file} className="flex items-center gap-3">
														<span
															className="flex size-7 shrink-0 items-center justify-center rounded"
															style={{ background: `${color}15`, color }}
															aria-hidden="true"
														>
															<FileCode2 size={12} />
														</span>
														<div className="min-w-0 flex-1">
															<code
																className="text-[11px] font-mono text-text-secondary"
																dir="ltr"
															>
																{file}
															</code>
															<p className="text-[10px] text-text-muted">
																{desc}
															</p>
														</div>
														<span
															className="text-xs font-bold shrink-0"
															style={{ color }}
															dir="ltr"
														>
															{count}
														</span>
													</div>
												))}
											</div>
										</div>

										{/* Hook counts */}
										<div className="glass-card p-4">
											<div className="flex items-center gap-2 mb-3">
												<Code2
													size={14}
													className="text-accent-purple"
													aria-hidden="true"
												/>
												<span className="text-sm font-semibold text-text-primary">
													Hooks רשומים
												</span>
											</div>
											<div className="flex items-center gap-4 flex-wrap">
												{[
													{ label: "קבצי hooks", value: "78", color: C.blue },
													{ label: "רשומים", value: "75", color: C.purple },
													{ label: "מכונות", value: "2", color: C.cyan },
												].map(({ label, value, color }) => (
													<div key={label} className="text-center">
														<p
															className="text-xl font-bold"
															style={{ color }}
															dir="ltr"
														>
															{value}
														</p>
														<p className="text-[10px] text-text-muted">
															{label}
														</p>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</section>
						)}

						{/* ══ Section 5: CI/CD Automation ══════════════════════════════════ */}
						{activeTab === "ci" && (
							<section aria-labelledby="s5-heading">
								<SectionHeading
									icon={<GitBranch size={18} />}
									title="CI/CD Automation"
									subtitle="Self-hosted runners, GitHub Apps, deploy gates"
									accentColor={C.green}
								/>
								<h2 id="s5-heading" className="sr-only">
									CI/CD Automation
								</h2>

								<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
									{/* Self-hosted runners */}
									<div className="glass-card flex flex-col">
										<div className="flex items-center gap-2 border-b border-border px-4 py-3">
											<Server
												size={14}
												className="text-accent-green"
												aria-hidden="true"
											/>
											<span className="text-sm font-semibold text-text-primary">
												Self-Hosted Runners
											</span>
											<span
												className="ms-auto text-xs font-bold text-accent-green"
												dir="ltr"
											>
												22 total
											</span>
										</div>
										<div className="p-4">
											<RunnerGroup
												machine="Lenovo"
												count={17}
												online={17}
												color={C.blue}
											/>
											<RunnerGroup
												machine="MSI"
												count={5}
												online={5}
												color={C.purple}
											/>

											<div className="mt-3 rounded-lg bg-bg-elevated p-3 space-y-2">
												<p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
													תצורת runner
												</p>
												<div className="space-y-1.5">
													{[
														{
															label: "runs-on",
															value: "[self-hosted, linux, x64, Lenovo]",
														},
														{ label: "NEVER", value: "ubuntu-latest" },
														{ label: "Node.js", value: "v24.14.0 (fnm)" },
													].map(({ label, value }) => (
														<div key={label} className="flex items-start gap-2">
															<span className="text-[10px] text-text-muted shrink-0 w-16">
																{label}
															</span>
															<code
																className={cn(
																	"text-[10px] font-mono rounded px-1 py-0.5 leading-tight",
																	label === "NEVER"
																		? "text-accent-red bg-[oklch(0.62_0.22_25_/_0.1)]"
																		: "text-text-secondary bg-bg-primary",
																)}
																dir="ltr"
															>
																{value}
															</code>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>

									{/* CI pipeline rules */}
									<div className="glass-card flex flex-col">
										<div className="flex items-center gap-2 border-b border-border px-4 py-3">
											<GitMerge
												size={14}
												className="text-accent-cyan"
												aria-hidden="true"
											/>
											<span className="text-sm font-semibold text-text-primary">
												כללי Pipeline
											</span>
										</div>
										<div className="p-4 space-y-3">
											{[
												{
													rule: "cancel-in-progress: true",
													context: "CI workflows",
													status: "safe",
													color: C.green,
													note: "מבטל runs מיותרים",
												},
												{
													rule: "cancel-in-progress: false",
													context: "Deploy workflows",
													status: "safe",
													color: C.amber,
													note: "deploy חייב להסתיים",
												},
												{
													rule: "needs: ci-gate",
													context: "כל deploy job",
													status: "enforced",
													color: C.blue,
													note: "CI חייב לעבור לפני deploy",
												},
												{
													rule: "trivy SHA-pin",
													context: "security scanning",
													status: "critical",
													color: C.red,
													note: "tags נפרצו — SHA בלבד",
												},
												{
													rule: "harden-runner@v2.16.0",
													context: "all jobs",
													status: "pinned",
													color: C.purple,
													note: "patches CVE-2026-25598",
												},
											].map(
												({ rule, context, status: _status, color, note }) => (
													<div key={rule} className="flex items-start gap-2.5">
														<span
															className="flex size-1.5 rounded-full shrink-0 mt-1.5"
															style={{ background: color }}
															aria-hidden="true"
														/>
														<div className="min-w-0">
															<code
																className="text-[11px] font-mono text-text-primary leading-tight"
																dir="ltr"
															>
																{rule}
															</code>
															<p className="text-[10px] text-text-muted mt-0.5">
																{context} — {note}
															</p>
														</div>
													</div>
												),
											)}

											{/* Pipeline order */}
											<div className="mt-2 rounded-lg bg-bg-elevated p-3">
												<p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-2">
													CI Pipeline
												</p>
												<div className="flex items-center gap-1 flex-wrap text-[10px]">
													{[
														"install",
														"typecheck",
														"lint",
														"semgrep",
														"trivy",
														"gitleaks",
														"test (4 shards)",
														"lhci",
														"build",
														"deploy",
													].map((step, idx, arr) => (
														<span
															key={step}
															className="flex items-center gap-1"
														>
															<code
																className="bg-bg-primary rounded px-1.5 py-0.5 text-text-secondary"
																dir="ltr"
															>
																{step}
															</code>
															{idx < arr.length - 1 && (
																<ArrowLeft
																	size={9}
																	className="text-text-muted shrink-0 rtl:rotate-180"
																	aria-hidden="true"
																/>
															)}
														</span>
													))}
												</div>
											</div>
										</div>
									</div>

									{/* GitHub Apps */}
									<div className="glass-card flex flex-col">
										<div className="flex items-center gap-2 border-b border-border px-4 py-3">
											<PackageCheck
												size={14}
												className="text-accent-purple"
												aria-hidden="true"
											/>
											<span className="text-sm font-semibold text-text-primary">
												GitHub Apps
											</span>
											<span className="ms-auto text-xs text-text-muted">
												13 repos
											</span>
										</div>
										<div className="p-4">
											<GhApp
												name="Renovate"
												description="עדכוני תלות שבועיים אוטומטיים. minimumReleaseAge: 3d. grouped PRs לפי קטגוריה."
												scope="weekly"
												icon={<RefreshCw size={14} />}
												color={C.blue}
											/>
											<GhApp
												name="Socket.dev"
												description="הגנה על supply chain — מגלה packages זדוניים לפני merge. חוסם typosquatting."
												scope="per-PR"
												icon={<Shield size={14} />}
												color={C.amber}
											/>
											<GhApp
												name="CodeRabbit"
												description="AI code review על כל PR — מוצא bugs, רגרסיות ובעיות ארכיטקטורה."
												scope="per-PR"
												icon={<Sparkles size={14} />}
												color={C.purple}
											/>

											{/* Reusable workflows */}
											<div className="mt-3 pt-3 border-t border-border">
												<p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-2">
													Reusable Workflows
												</p>
												{[
													{ name: "ci-vite-react.yml", color: C.cyan },
													{ name: "ci-nextjs.yml", color: C.blue },
													{ name: "ci-flutter.yml", color: C.green },
												].map(({ name, color }) => (
													<div
														key={name}
														className="flex items-center gap-2 mb-1.5"
													>
														<FileCode2
															size={11}
															style={{ color }}
															aria-hidden="true"
														/>
														<code
															className="text-[11px] font-mono text-text-secondary"
															dir="ltr"
														>
															Nadav011/ci-standards/{name}
														</code>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</section>
						)}

						{/* ══ Section: לוח זמנים / Routines ══════════════════════════════ */}
						{activeTab === "routines" && (
							<section className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Heartbeat Reporter */}
									<div className="glass-card p-5 space-y-3">
										<div className="flex items-center gap-2 mb-2">
											<RefreshCw size={16} className="text-accent-blue" />
											<h3 className="text-sm font-semibold text-text-primary">
												Heartbeat Reporter
											</h3>
										</div>
										<div className="space-y-2 text-xs">
											<div className="flex justify-between">
												<span className="text-text-muted">סקריפט</span>
												<code
													className="text-text-secondary font-mono"
													dir="ltr"
												>
													heartbeat-reporter.sh
												</code>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">תדירות</span>
												<span className="text-text-primary">כל 60 שניות</span>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">סטטוס</span>
												<span className="text-accent-green font-medium">
													פעיל
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">מדיניות</span>
												<span className="text-text-primary">
													coalesce_if_active
												</span>
											</div>
										</div>
									</div>

									{/* Cost Tracker */}
									<div className="glass-card p-5 space-y-3">
										<div className="flex items-center gap-2 mb-2">
											<Clock size={16} className="text-accent-amber" />
											<h3 className="text-sm font-semibold text-text-primary">
												Cost Tracker
											</h3>
										</div>
										<div className="space-y-2 text-xs">
											<div className="flex justify-between">
												<span className="text-text-muted">סקריפט</span>
												<code
													className="text-text-secondary font-mono"
													dir="ltr"
												>
													cost-tracker.sh
												</code>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">אירוע</span>
												<span className="text-text-primary">PostToolUse</span>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">סטטוס</span>
												<span className="text-accent-green font-medium">
													פעיל
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">פלט</span>
												<code
													className="text-text-secondary font-mono"
													dir="ltr"
												>
													metrics/costs.jsonl
												</code>
											</div>
										</div>
									</div>

									{/* Plan Dispatcher */}
									<div className="glass-card p-5 space-y-3">
										<div className="flex items-center gap-2 mb-2">
											<Workflow size={16} className="text-accent-purple" />
											<h3 className="text-sm font-semibold text-text-primary">
												Plan Dispatcher
											</h3>
										</div>
										<div className="space-y-2 text-xs">
											<div className="flex justify-between">
												<span className="text-text-muted">סקריפט</span>
												<code
													className="text-text-secondary font-mono"
													dir="ltr"
												>
													plan-dispatcher.sh
												</code>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">סוג</span>
												<span className="text-text-primary">
													systemd path unit
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">סטטוס</span>
												<span className="text-accent-amber font-medium">
													ממתין
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">ניטור</span>
												<code
													className="text-text-secondary font-mono"
													dir="ltr"
												>
													handoffs/pending/
												</code>
											</div>
										</div>
									</div>

									{/* APEX Observer */}
									<div className="glass-card p-5 space-y-3">
										<div className="flex items-center gap-2 mb-2">
											<Sparkles size={16} className="text-accent-cyan" />
											<h3 className="text-sm font-semibold text-text-primary">
												APEX Observer Daemon
											</h3>
										</div>
										<div className="space-y-2 text-xs">
											<div className="flex justify-between">
												<span className="text-text-muted">סקריפט</span>
												<code
													className="text-text-secondary font-mono"
													dir="ltr"
												>
													apex-observer-daemon.py
												</code>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">סוג</span>
												<span className="text-text-primary">
													systemd service
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">סטטוס</span>
												<span className="text-accent-green font-medium">
													פעיל
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-text-muted">פלט</span>
												<code
													className="text-text-secondary font-mono"
													dir="ltr"
												>
													learning.db
												</code>
											</div>
										</div>
									</div>
								</div>

								{/* Concurrency Policies */}
								<div className="glass-card p-4">
									<h4 className="text-xs font-semibold text-text-primary mb-2">
										מדיניות מקביליות
									</h4>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
										<div className="flex items-start gap-2">
											<div className="size-2 rounded-full bg-accent-green mt-1 shrink-0" />
											<div>
												<span className="font-medium text-text-primary">
													coalesce_if_active
												</span>
												<p className="text-text-muted">
													ממזג ריצות אם כבר פעיל
												</p>
											</div>
										</div>
										<div className="flex items-start gap-2">
											<div className="size-2 rounded-full bg-accent-amber mt-1 shrink-0" />
											<div>
												<span className="font-medium text-text-primary">
													skip_if_active
												</span>
												<p className="text-text-muted">מדלג אם כבר רץ</p>
											</div>
										</div>
										<div className="flex items-start gap-2">
											<div className="size-2 rounded-full bg-accent-blue mt-1 shrink-0" />
											<div>
												<span className="font-medium text-text-primary">
													always_enqueue
												</span>
												<p className="text-text-muted">תמיד מוסיף לתור</p>
											</div>
										</div>
									</div>
								</div>
							</section>
						)}
					</div>
				)}
			</Tabs>
		</div>
	);
}
