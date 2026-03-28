import {
	AlertTriangle,
	Bot,
	CheckCircle2,
	ChevronDown,
	ChevronsUpDown,
	ChevronUp,
	Code2,
	ExternalLink,
	FileCode2,
	FileText,
	Flame,
	GitBranch,
	Globe,
	Package,
	RefreshCw,
	Search,
	Server,
	Shield,
	Terminal,
	XCircle,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useCiDeep, useCiTemplates } from "@/hooks/use-api";
import type { CiDeepResponse, CiTemplate } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Types ──────────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc" | null;
type SortKey =
	| "name"
	| "ci"
	| "bundle_check"
	| "lighthouse"
	| "trivy_auto"
	| "renovate"
	| "deploy";

type TemplateCategory =
	| "ci"
	| "security"
	| "deploy"
	| "bundle"
	| "lighthouse"
	| "flutter"
	| "quality"
	| "other";

// ── Category helpers ───────────────────────────────────────────────────────────

function categorizeTemplate(file: string, name: string): TemplateCategory {
	const f = file.toLowerCase();
	const n = name.toLowerCase();
	if (
		f.includes("ci-vite") ||
		f.includes("ci-nextjs") ||
		f.includes("ci-flutter") ||
		f.includes("ci-python") ||
		f.includes("ci-expo") ||
		f.includes("ci-supabase")
	)
		return "ci";
	if (
		f.includes("security") ||
		f.includes("trivy") ||
		f.includes("scorecard") ||
		f.includes("gitleaks") ||
		f.includes("license")
	)
		return "security";
	if (
		f.includes("deploy") ||
		f.includes("semantic-release") ||
		f.includes("changelog")
	)
		return "deploy";
	if (
		f.includes("bundle") ||
		f.includes("circular") ||
		f.includes("dependency")
	)
		return "bundle";
	if (f.includes("lighthouse")) return "lighthouse";
	if (f.includes("flutter") || n.includes("flutter")) return "flutter";
	if (
		f.includes("mutation") ||
		f.includes("coverage") ||
		f.includes("accessibility")
	)
		return "quality";
	return "other";
}

const CATEGORY_META: Record<
	TemplateCategory,
	{
		label: string;
		color: string;
		icon: React.ComponentType<{ size?: number; className?: string }>;
	}
> = {
	ci: {
		label: "CI ראשי",
		color: "text-[var(--color-accent-blue)] bg-[oklch(0.65_0.18_250_/_0.12)]",
		icon: GitBranch,
	},
	security: {
		label: "אבטחה",
		color: "text-[var(--color-accent-red)] bg-[oklch(0.62_0.22_25_/_0.12)]",
		icon: Shield,
	},
	deploy: {
		label: "פריסה",
		color: "text-[var(--color-accent-green)] bg-[oklch(0.72_0.19_155_/_0.12)]",
		icon: Globe,
	},
	bundle: {
		label: "חבילה",
		color: "text-[var(--color-accent-amber)] bg-[oklch(0.78_0.16_75_/_0.12)]",
		icon: Package,
	},
	lighthouse: {
		label: "Lighthouse",
		color: "text-[var(--color-accent-cyan)] bg-[oklch(0.75_0.14_200_/_0.12)]",
		icon: Flame,
	},
	flutter: {
		label: "Flutter",
		color: "text-[var(--color-accent-purple)] bg-[oklch(0.62_0.2_290_/_0.12)]",
		icon: Zap,
	},
	quality: {
		label: "איכות",
		color: "text-[var(--color-accent-purple)] bg-[oklch(0.62_0.2_290_/_0.12)]",
		icon: CheckCircle2,
	},
	other: {
		label: "אחר",
		color: "text-[var(--color-text-muted)] bg-[oklch(0.55_0.02_260_/_0.12)]",
		icon: FileCode2,
	},
};

// ── Shared primitives ──────────────────────────────────────────────────────────

function SectionCard({
	id,
	title,
	icon,
	children,
	defaultOpen = false,
	badge,
}: {
	id: string;
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	badge?: string;
}) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className="glass-card overflow-hidden" id={id}>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				className={cn(
					"w-full flex items-center gap-3 px-5 py-4 min-h-11",
					"text-start transition-colors duration-150",
					"hover:bg-[var(--color-bg-tertiary)]",
				)}
				aria-expanded={open}
			>
				<span className="text-[var(--color-accent-blue)] shrink-0">{icon}</span>
				<span className="text-sm font-semibold text-[var(--color-text-primary)] flex-1">
					{title}
				</span>
				{badge && (
					<span
						className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] px-2 py-0.5 rounded-full border border-[var(--color-border)] shrink-0"
						dir="ltr"
					>
						{badge}
					</span>
				)}
				<ChevronDown
					size={16}
					className={cn(
						"text-[var(--color-text-muted)] transition-transform duration-200 shrink-0",
						open && "rotate-180",
					)}
					aria-hidden="true"
				/>
			</button>
			{open && (
				<div className="px-5 pb-5 border-t border-[var(--color-border)]">
					{children}
				</div>
			)}
		</div>
	);
}

function StatusBadge({ ok, label }: { ok: boolean; label?: string }) {
	return ok ? (
		<span
			className="inline-flex items-center gap-1 text-[var(--color-accent-green)]"
			title="כן"
		>
			<CheckCircle2 size={13} aria-hidden="true" />
			{label && <span className="text-xs">{label}</span>}
		</span>
	) : (
		<span
			className="inline-flex items-center gap-1 text-[var(--color-text-muted)] opacity-40"
			title="לא"
		>
			<XCircle size={13} aria-hidden="true" />
			{label && <span className="text-xs">{label}</span>}
		</span>
	);
}

function SeverityBadge({ severity }: { severity: string }) {
	const map: Record<string, string> = {
		critical: "bg-[oklch(0.62_0.22_25_/_0.15)] text-[var(--color-accent-red)]",
		warn: "bg-[oklch(0.78_0.16_75_/_0.15)] text-[var(--color-accent-amber)]",
		info: "bg-[oklch(0.65_0.18_250_/_0.12)] text-[var(--color-accent-blue)]",
	};
	const labels: Record<string, string> = {
		critical: "קריטי",
		warn: "אזהרה",
		info: "מידע",
	};
	return (
		<span
			className={cn(
				"text-xs font-semibold px-2 py-0.5 rounded-full",
				map[severity] ?? map.info,
			)}
		>
			{labels[severity] ?? severity}
		</span>
	);
}

// ── Section 0: Summary Strip ───────────────────────────────────────────────────

function SummaryStrip({
	deep,
	templatesCount,
}: {
	deep: CiDeepResponse | undefined;
	templatesCount: number;
}) {
	const stats = [
		{
			label: "תבניות CI",
			value: templatesCount,
			color: "text-[var(--color-accent-blue)]",
		},
		{
			label: "כלים מותקנים",
			value: deep?.stats?.total_tools ?? 14,
			color: "text-[var(--color-accent-cyan)]",
		},
		{
			label: "Workflows לשימוש חוזר",
			value: deep?.stats?.total_reusable_workflows ?? 3,
			color: "text-[var(--color-accent-green)]",
		},
		{
			label: "GitHub Apps",
			value: deep?.stats?.github_apps ?? 3,
			color: "text-[var(--color-accent-purple)]",
		},
		{
			label: "Runners",
			value: deep?.stats?.total_runners ?? 22,
			color: "text-[var(--color-accent-amber)]",
		},
		{
			label: "פרויקטים עם CI",
			value: `${deep?.stats?.projects_with_ci ?? 13}/${deep?.stats?.projects_total ?? 18}`,
			color: "text-[var(--color-accent-red)]",
		},
	];
	return (
		<div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
			{stats.map(({ label, value, color }) => (
				<div key={label} className="glass-card p-3 text-center">
					<p className={cn("text-xl font-bold tabular-nums", color)} dir="ltr">
						{value}
					</p>
					<p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-tight">
						{label}
					</p>
				</div>
			))}
		</div>
	);
}

// ── Section 1: Pipeline Architecture ──────────────────────────────────────────

function PipelineStep({
	label,
	sub,
	color,
	isParallel,
}: {
	label: string;
	sub?: string;
	color: string;
	isParallel?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center px-3 py-2 rounded-lg text-center",
				"border text-xs font-medium min-w-[88px]",
				isParallel
					? "border-dashed bg-[var(--color-bg-primary)]"
					: "bg-[var(--color-bg-secondary)]",
				color,
			)}
		>
			<span>{label}</span>
			{sub && (
				<span className="text-[10px] opacity-60 mt-0.5 font-normal">{sub}</span>
			)}
		</div>
	);
}

function Arrow() {
	return (
		<div
			className="flex items-center text-[var(--color-text-muted)] shrink-0"
			aria-hidden="true"
		>
			<div className="w-4 h-px bg-current opacity-40" />
			<div className="w-0 h-0 border-y-[4px] border-y-transparent border-s-[6px] border-s-current opacity-40" />
		</div>
	);
}

function PipelineArchitectureSection() {
	return (
		<SectionCard
			id="pipeline"
			title="ארכיטקטורת Pipeline"
			icon={<GitBranch size={18} />}
			defaultOpen={true}
			badge="6 שלבים"
		>
			<div className="mt-4 space-y-5">
				<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
					ה-pipeline מורכב מ-6 שלבים סדרתיים ומקבילים. שלב ה-quality רץ עם 6
					כלים במקביל — typecheck, lint, semgrep, trivy, gitleaks ו-socket-ci.
					שלב הבדיקות: 4 shards מקביליים.{" "}
					<span className="text-[var(--color-accent-amber)]">
						ci-gate חייב לעבור לפני כל deploy.
					</span>
				</p>

				{/* Visual pipeline */}
				<div className="overflow-x-auto pb-3">
					<div className="flex items-center gap-1 min-w-max">
						<PipelineStep
							label="install"
							sub="pnpm ci"
							color="border-[var(--color-accent-cyan)]/40 text-[var(--color-accent-cyan)]"
						/>
						<Arrow />
						{/* Quality parallel block */}
						<div
							className={cn(
								"flex flex-col gap-2 p-3 rounded-xl",
								"border border-dashed border-[var(--color-accent-blue)]/30",
								"bg-[oklch(0.65_0.18_250_/_0.04)]",
							)}
						>
							<span className="text-[10px] text-[var(--color-accent-blue)] text-center font-semibold uppercase tracking-wide">
								במקביל — quality
							</span>
							<div className="flex flex-wrap gap-2 justify-center">
								<PipelineStep
									label="typecheck"
									color="border-[var(--color-accent-blue)]/40 text-[var(--color-accent-blue)]"
									isParallel
								/>
								<PipelineStep
									label="lint"
									sub="Biome 2.4.4"
									color="border-[var(--color-accent-blue)]/40 text-[var(--color-accent-blue)]"
									isParallel
								/>
								<PipelineStep
									label="semgrep"
									sub="OWASP"
									color="border-[var(--color-accent-red)]/40 text-[var(--color-accent-red)]"
									isParallel
								/>
								<PipelineStep
									label="trivy"
									sub="CVE scan"
									color="border-[var(--color-accent-red)]/40 text-[var(--color-accent-red)]"
									isParallel
								/>
								<PipelineStep
									label="gitleaks"
									sub="secrets"
									color="border-[var(--color-accent-red)]/40 text-[var(--color-accent-red)]"
									isParallel
								/>
								<PipelineStep
									label="socket-ci"
									sub="supply chain"
									color="border-[var(--color-accent-amber)]/40 text-[var(--color-accent-amber)]"
									isParallel
								/>
							</div>
						</div>
						<Arrow />
						{/* Test shards */}
						<div
							className={cn(
								"flex flex-col gap-2 p-3 rounded-xl",
								"border border-dashed border-[var(--color-accent-green)]/30",
								"bg-[oklch(0.72_0.19_155_/_0.04)]",
							)}
						>
							<span className="text-[10px] text-[var(--color-accent-green)] text-center font-semibold uppercase tracking-wide">
								במקביל — tests
							</span>
							<div className="flex flex-wrap gap-2 justify-center">
								{[1, 2, 3, 4].map((n) => (
									<PipelineStep
										key={n}
										label={`shard ${n}/4`}
										color="border-[var(--color-accent-green)]/40 text-[var(--color-accent-green)]"
										isParallel
									/>
								))}
							</div>
						</div>
						<Arrow />
						<PipelineStep
							label="lhci"
							sub="Lighthouse"
							color="border-[var(--color-accent-cyan)]/40 text-[var(--color-accent-cyan)]"
						/>
						<Arrow />
						<PipelineStep
							label="build"
							color="border-[var(--color-accent-amber)]/40 text-[var(--color-accent-amber)]"
						/>
						<Arrow />
						<PipelineStep
							label="ci-gate"
							sub="all must pass"
							color="border-[var(--color-accent-blue)]/60 text-[var(--color-accent-blue)] bg-[oklch(0.65_0.18_250_/_0.08)]"
						/>
						<Arrow />
						<PipelineStep
							label="deploy"
							sub="main only"
							color="border-[var(--color-accent-green)]/60 text-[var(--color-accent-green)] bg-[oklch(0.72_0.19_155_/_0.08)]"
						/>
					</div>
				</div>

				{/* Stage descriptions */}
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{[
						{
							name: "install",
							desc: "התקנת תלויות עם lockfile מוקפא — pnpm install --frozen-lockfile",
							color: "border-[var(--color-accent-cyan)]/30",
							icon: <Terminal size={13} />,
						},
						{
							name: "quality (×6)",
							desc: "6 כלים במקביל: typecheck, lint, semgrep, trivy, gitleaks, socket-ci",
							color: "border-[var(--color-accent-blue)]/30",
							icon: <Shield size={13} />,
						},
						{
							name: "test (×4 shards)",
							desc: "vitest --maxWorkers=2 --shard=N/4 — 4 שלבים מקביליים",
							color: "border-[var(--color-accent-green)]/30",
							icon: <CheckCircle2 size={13} />,
						},
						{
							name: "lighthouse",
							desc: "lhci autorun — ביקורת ביצועים, נגישות, SEO. רק על main.",
							color: "border-[var(--color-accent-cyan)]/30",
							icon: <Flame size={13} />,
						},
						{
							name: "build",
							desc: "pnpm build — בנייה לפרודקשן עם Vite/Next.js",
							color: "border-[var(--color-accent-amber)]/30",
							icon: <Package size={13} />,
						},
						{
							name: "deploy",
							desc: "CF Pages / Netlify — רק אחרי ci-gate. cancel-in-progress: false!",
							color: "border-[var(--color-accent-green)]/30",
							icon: <Globe size={13} />,
						},
					].map(({ name, desc, color, icon }) => (
						<div key={name} className={cn("glass-card p-3 border", color)}>
							<div className="flex items-center gap-2 mb-1">
								<span className="text-[var(--color-accent-blue)]">{icon}</span>
								<span
									className="text-xs font-mono font-semibold text-[var(--color-text-primary)]"
									dir="ltr"
								>
									{name}
								</span>
							</div>
							<p className="text-xs text-[var(--color-text-secondary)]">
								{desc}
							</p>
						</div>
					))}
				</div>

				{/* Key rules */}
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{[
						{
							icon: <Shield size={13} />,
							color: "text-[var(--color-accent-red)]",
							text: "semgrep, trivy, gitleaks — security gates, לא אופציונלי. || true = חסר ערך",
						},
						{
							icon: <CheckCircle2 size={13} />,
							color: "text-[var(--color-accent-green)]",
							text: "ci-gate חייב לעבור לפני כל deploy — needs: [ci-gate] ב-deploy.yml",
						},
						{
							icon: <Zap size={13} />,
							color: "text-[var(--color-accent-blue)]",
							text: "tests: 4 shards במקביל — maxWorkers: top-level (לא poolOptions) — Vitest 4",
						},
						{
							icon: <AlertTriangle size={13} />,
							color: "text-[var(--color-accent-amber)]",
							text: "deploy: cancel-in-progress: false — פריסה חלקית מותירה תשתית במצב לא ידוע",
						},
					].map(({ icon, color, text }) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static list
						<div key={text} className="flex items-start gap-2">
							<span className={cn("shrink-0 mt-0.5", color)}>{icon}</span>
							<span className="text-xs text-[var(--color-text-secondary)]">
								{text}
							</span>
						</div>
					))}
				</div>
			</div>
		</SectionCard>
	);
}

// ── Section 2: Tools ───────────────────────────────────────────────────────────

interface DeepTool {
	name: string;
	version: string;
	purpose_he: string;
	command: string;
	config: string;
	category: string;
	note_he?: string;
	replaces?: string;
	critical?: boolean;
}

const TOOL_CAT_COLORS: Record<string, string> = {
	security: "text-[var(--color-accent-red)] bg-[oklch(0.62_0.22_25_/_0.12)]",
	quality: "text-[var(--color-accent-blue)] bg-[oklch(0.65_0.18_250_/_0.12)]",
	testing: "text-[var(--color-accent-purple)] bg-[oklch(0.62_0.2_290_/_0.12)]",
	perf: "text-[var(--color-accent-cyan)] bg-[oklch(0.75_0.14_200_/_0.12)]",
	dev: "text-[var(--color-accent-green)] bg-[oklch(0.72_0.19_155_/_0.12)]",
};
const TOOL_CAT_LABELS: Record<string, string> = {
	security: "אבטחה",
	quality: "איכות",
	testing: "בדיקות",
	perf: "ביצועים",
	dev: "פיתוח",
};

function ToolCard({ tool }: { tool: DeepTool }) {
	const [expanded, setExpanded] = useState(false);
	const catColor =
		TOOL_CAT_COLORS[tool.category] ??
		"text-[var(--color-text-muted)] bg-[oklch(0.55_0.02_260_/_0.12)]";
	return (
		<div
			className={cn(
				"glass-card p-4 flex flex-col gap-3 transition-all duration-150",
				tool.critical && "border border-[var(--color-accent-red)]/20",
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					{tool.critical && (
						<AlertTriangle
							size={13}
							className="text-[var(--color-accent-red)] shrink-0"
							aria-label="חשוב"
						/>
					)}
					<span className="text-sm font-semibold text-[var(--color-text-primary)] font-mono">
						{tool.name}
					</span>
					<span
						className="text-xs text-[var(--color-text-muted)] font-mono shrink-0"
						dir="ltr"
					>
						v{tool.version}
					</span>
				</div>
				<span
					className={cn(
						"text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
						catColor,
					)}
				>
					{TOOL_CAT_LABELS[tool.category] ?? tool.category}
				</span>
			</div>

			<p className="text-xs text-[var(--color-text-secondary)]">
				{tool.purpose_he}
			</p>

			<code
				className="block text-xs font-mono text-[var(--color-accent-cyan)] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 overflow-x-auto"
				dir="ltr"
			>
				{tool.command}
			</code>

			{(tool.note_he ?? tool.config ?? tool.replaces) && (
				<button
					type="button"
					onClick={() => setExpanded((p) => !p)}
					className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-150 self-start"
				>
					{expanded ? (
						<ChevronUp size={12} aria-hidden="true" />
					) : (
						<ChevronDown size={12} aria-hidden="true" />
					)}
					{expanded ? "פחות" : "פרטים"}
				</button>
			)}

			{expanded && (
				<div className="space-y-2 pt-1 border-t border-[var(--color-border)]">
					{tool.config && (
						<p className="text-xs text-[var(--color-text-muted)]">
							<span className="text-[var(--color-text-secondary)] font-medium">
								קובץ הגדרה:{" "}
							</span>
							<code className="font-mono" dir="ltr">
								{tool.config}
							</code>
						</p>
					)}
					{tool.replaces && (
						<p className="text-xs text-[var(--color-text-muted)]">
							<span className="text-[var(--color-text-secondary)] font-medium">
								מחליף:{" "}
							</span>
							{tool.replaces}
						</p>
					)}
					{tool.note_he && (
						<p
							className={cn(
								"text-xs leading-relaxed",
								tool.critical
									? "text-[var(--color-accent-amber)]"
									: "text-[var(--color-text-muted)]",
							)}
						>
							{tool.note_he}
						</p>
					)}
				</div>
			)}
		</div>
	);
}

const FALLBACK_TOOLS: DeepTool[] = [
	{
		name: "Biome",
		version: "2.4.4",
		purpose_he: "בדיקת קוד ועיצוב — מחליף ESLint + Prettier",
		command: "biome check . --apply",
		config: "biome.json",
		category: "quality",
		replaces: "ESLint + Prettier",
		note_he: "מהיר פי 100 מ-ESLint",
	},
	{
		name: "Vitest",
		version: "4.0.18",
		purpose_he: "בדיקות יחידה ואינטגרציה",
		command: "vitest --maxWorkers=2",
		config: "vitest.config.ts",
		category: "testing",
		note_he: "maxWorkers top-level (לא poolOptions) — Vitest 4 breaking change",
	},
	{
		name: "Playwright",
		version: "1.58.2",
		purpose_he: "בדיקות E2E בדפדפן",
		command: "playwright test",
		config: "playwright.config.ts",
		category: "testing",
	},
	{
		name: "trivy",
		version: "0.69.3",
		purpose_he: "סריקת CVE בתלויות, סודות, IaC",
		command: "trivy fs . --severity HIGH,CRITICAL",
		config: "trivy.yaml",
		category: "security",
		critical: true,
		note_he: "⚠️ SHA-PINNED — תגי trivy-action נפגעו מרץ 2026 (75/76 תגים)",
	},
	{
		name: "semgrep",
		version: "1.155.0",
		purpose_he: "SAST — OWASP Top 10, XSS, SQL injection",
		command: "semgrep scan . --config=auto",
		config: ".semgrepignore",
		category: "security",
	},
	{
		name: "gitleaks",
		version: "latest",
		purpose_he: "זיהוי סודות שנשמרו ב-git",
		command: ".github/workflows (auto)",
		config: ".gitleaks.toml",
		category: "security",
	},
	{
		name: "socket",
		version: "1.1.73",
		purpose_he: "הגנה על שרשרת האספקה",
		command: "socket npm install <pkg>",
		config: "socket.json",
		category: "security",
	},
	{
		name: "Lighthouse CI",
		version: "0.15.1",
		purpose_he: "ביקורת ביצועים, נגישות, SEO",
		command: "lhci autorun",
		config: ".lighthouserc.js",
		category: "perf",
	},
	{
		name: "k6",
		version: "1.6.1",
		purpose_he: "בדיקות עומס",
		command: "k6 run tests/load/test.js",
		config: "tests/load/",
		category: "perf",
	},
	{
		name: "git-cliff",
		version: "2.12.0",
		purpose_he: "יצירת CHANGELOG אוטומטי",
		command: "git-cliff -o CHANGELOG.md",
		config: "cliff.toml",
		category: "dev",
	},
	{
		name: "type-coverage",
		version: "2.29.7",
		purpose_he: "זיהוי שימוש ב-any ב-TypeScript",
		command: "type-coverage --at-least 90 --detail",
		config: "tsconfig.json",
		category: "quality",
	},
	{
		name: "knip",
		version: "5.86.0",
		purpose_he: "זיהוי קוד מת שבועי",
		command: "knip",
		config: "knip.json",
		category: "quality",
	},
	{
		name: "act",
		version: "0.2.84",
		purpose_he: "ריצת CI מקומית בדוקר לדיבוג",
		command: "act push",
		config: ".actrc",
		category: "dev",
	},
	{
		name: "hurl",
		version: "7.1.0",
		purpose_he: "בדיקות API מבוססות קבצי .hurl",
		command: "hurl tests/api/",
		config: "tests/api/",
		category: "testing",
	},
];

function ToolsSection({ tools }: { tools: DeepTool[] }) {
	const [filter, setFilter] = useState<string>("all");
	const cats = useMemo(() => {
		const acc: Record<string, number> = { all: tools.length };
		for (const t of tools) acc[t.category] = (acc[t.category] ?? 0) + 1;
		return acc;
	}, [tools]);

	const visible = useMemo(
		() =>
			filter === "all" ? tools : tools.filter((t) => t.category === filter),
		[tools, filter],
	);

	return (
		<SectionCard
			id="tools"
			title="כלים מותקנים"
			icon={<Terminal size={18} />}
			defaultOpen={true}
			badge={`${tools.length} כלים`}
		>
			<div className="mt-4 space-y-4">
				{/* Filter pills */}
				<div className="flex flex-wrap gap-2">
					{(
						["all", "security", "quality", "testing", "perf", "dev"] as const
					).map((cat) => {
						const count = cats[cat];
						if (!count) return null;
						return (
							<button
								key={cat}
								type="button"
								onClick={() => setFilter(cat)}
								className={cn(
									"inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-150 min-h-7",
									filter === cat
										? cat === "all"
											? "bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)] ring-1 ring-[var(--color-accent-blue)]/40"
											: cn(TOOL_CAT_COLORS[cat], "ring-1 ring-current/40")
										: "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]",
								)}
							>
								{cat === "all" ? "הכל" : (TOOL_CAT_LABELS[cat] ?? cat)}
								<span className="text-xs tabular-nums opacity-60" dir="ltr">
									{count}
								</span>
							</button>
						);
					})}
				</div>

				{/* Tools grid */}
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{visible.map((tool) => (
						<ToolCard key={tool.name} tool={tool} />
					))}
				</div>

				{/* Install paths note */}
				<div className="p-3 rounded-lg bg-[oklch(0.65_0.18_250_/_0.06)] border border-[var(--color-accent-blue)]/20">
					<p className="text-xs text-[var(--color-text-secondary)]">
						<span className="font-semibold text-[var(--color-accent-blue)]">
							מיקומי התקנה:{" "}
						</span>
						trivy/semgrep/act/git-cliff/hurl/k6 →{" "}
						<code
							className="font-mono text-[var(--color-accent-cyan)]"
							dir="ltr"
						>
							~/.local/bin/
						</code>
						{" | "}
						knip/type-coverage/lhci/socket →{" "}
						<code
							className="font-mono text-[var(--color-accent-cyan)]"
							dir="ltr"
						>
							~/.local/share/pnpm/
						</code>
					</p>
				</div>
			</div>
		</SectionCard>
	);
}

// ── Section 3: Reusable Workflows ──────────────────────────────────────────────

interface ReusableWorkflow {
	name: string;
	description_he?: string;
	description?: string;
	stages?: string[];
	jobs?: string[];
	used_by?: string[];
	stack?: string;
}

function WorkflowCard({ wf }: { wf: ReusableWorkflow }) {
	return (
		<div className="glass-card p-4 space-y-3">
			<div className="flex items-start justify-between gap-2">
				<span
					className="text-sm font-semibold text-[var(--color-text-primary)] font-mono"
					dir="ltr"
				>
					{wf.name}
				</span>
				<span
					className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-tertiary)] px-2 py-0.5 rounded-full shrink-0"
					dir="ltr"
				>
					{wf.stack}
				</span>
			</div>
			<p className="text-xs text-[var(--color-text-secondary)]">
				{wf.description_he}
			</p>

			{/* Stages */}
			<div>
				<p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
					שלבים:
				</p>
				<div className="flex flex-wrap gap-1.5">
					{(wf.stages ?? wf.jobs ?? []).map((stage: string) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: ordered list
						<span
							key={stage}
							className="text-xs font-mono text-[var(--color-accent-blue)] bg-[oklch(0.65_0.18_250_/_0.1)] px-2 py-0.5 rounded-full border border-[var(--color-accent-blue)]/20"
						>
							{stage}
						</span>
					))}
				</div>
			</div>

			{/* Used by */}
			<div>
				<p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
					משמש ב-{(wf.used_by ?? []).length} פרויקטים:
				</p>
				<div className="flex flex-wrap gap-1.5">
					{(wf.used_by ?? []).map((proj) => (
						<span
							key={proj}
							className="text-xs text-[var(--color-accent-green)] bg-[oklch(0.72_0.19_155_/_0.1)] px-2 py-0.5 rounded-full border border-[var(--color-accent-green)]/20"
						>
							{proj}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

const FALLBACK_WORKFLOWS: ReusableWorkflow[] = [
	{
		name: "ci-vite-react.yml",
		description_he: "CI מלא לפרויקטי Vite + React",
		stages: [
			"typecheck",
			"lint (Biome)",
			"semgrep",
			"trivy",
			"gitleaks",
			"test (4 shards)",
			"build",
		],
		used_by: [
			"mexicani",
			"cash",
			"Z",
			"shifts",
			"brain",
			"hatumdigital",
			"signature-pro",
		],
		stack: "Vite + React 19",
	},
	{
		name: "ci-nextjs.yml",
		description_he: "CI מלא לפרויקטי Next.js",
		stages: [
			"typecheck",
			"lint (Biome)",
			"semgrep",
			"trivy",
			"gitleaks",
			"test",
			"build",
		],
		used_by: ["mediflow", "nadavai", "vibechat"],
		stack: "Next.js 16",
	},
	{
		name: "ci-flutter.yml",
		description_he: "CI לפרויקטי Flutter/Dart",
		stages: [
			"flutter analyze",
			"very_good test --coverage --fail-fast",
			"build APK/AAB",
		],
		used_by: ["SportChat"],
		stack: "Flutter 3.41",
	},
];

function ReusableWorkflowsSection({
	data,
}: {
	data: CiDeepResponse | undefined;
}) {
	const workflows =
		(data?.reusable_workflows?.workflows as ReusableWorkflow[] | undefined) ??
		FALLBACK_WORKFLOWS;
	const repo = data?.reusable_workflows?.repo ?? "Nadav011/ci-standards";

	return (
		<SectionCard
			id="workflows"
			title="תבניות לשימוש חוזר"
			icon={<GitBranch size={18} />}
			defaultOpen={true}
			badge={`${workflows.length} workflows`}
		>
			<div className="mt-4 space-y-4">
				{/* Repo header */}
				<div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
					<GitBranch
						size={14}
						className="text-[var(--color-accent-blue)] shrink-0"
						aria-hidden="true"
					/>
					<span className="text-xs text-[var(--color-text-secondary)]">
						ריפו:{" "}
					</span>
					<code
						className="text-xs font-mono text-[var(--color-accent-cyan)]"
						dir="ltr"
					>
						{repo}
					</code>
					<span className="text-xs text-[var(--color-text-muted)]">
						— שינוי בתבנית אחת מתפשט לכל הפרויקטים
					</span>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					{workflows.map((wf) => (
						<WorkflowCard key={wf.name} wf={wf} />
					))}
				</div>
			</div>
		</SectionCard>
	);
}

// ── Section 4: GitHub Apps ─────────────────────────────────────────────────────

interface GhApp {
	name: string;
	purpose_he: string;
	schedule: string;
	trigger: string;
	repos: number;
	note_he?: string;
	config?: string;
}

const FALLBACK_APPS: GhApp[] = [
	{
		name: "Renovate",
		purpose_he: "עדכון תלויות אוטומטי",
		schedule: "שבועי",
		trigger: "weekly",
		repos: 13,
		note_he:
			"רץ כל יום ראשון — PR אוטומטי לעדכוני תלויות. מגדיר minimumReleaseAge: 3d.",
		config: "renovate.json",
	},
	{
		name: "Socket.dev",
		purpose_he: "בדיקת שרשרת אספקה",
		schedule: "on PR",
		trigger: "pull_request",
		repos: 13,
		note_he:
			"חוסם חבילות npm זדוניות לפני מיזוג. מזהה typosquatting, postinstall ריצות חשודות.",
		config: ".socket.json",
	},
	{
		name: "CodeRabbit",
		purpose_he: "Code review AI אוטומטי",
		schedule: "on PR",
		trigger: "pull_request",
		repos: 13,
		note_he:
			"AI reviewer — מגיב על כל PR עם הערות קוד. לא מחליף את code-reviewer skill (Opus L10+).",
		config: ".coderabbit.yaml",
	},
];

const APP_ICONS: Record<string, React.ReactNode> = {
	Renovate: <RefreshCw size={16} />,
	"Socket.dev": <Shield size={16} />,
	CodeRabbit: <Bot size={16} />,
};
const APP_COLORS: Record<string, { icon: string; bg: string }> = {
	Renovate: {
		icon: "text-[var(--color-accent-blue)]",
		bg: "bg-[oklch(0.65_0.18_250_/_0.12)]",
	},
	"Socket.dev": {
		icon: "text-[var(--color-accent-red)]",
		bg: "bg-[oklch(0.62_0.22_25_/_0.12)]",
	},
	CodeRabbit: {
		icon: "text-[var(--color-accent-purple)]",
		bg: "bg-[oklch(0.62_0.2_290_/_0.12)]",
	},
};

function GithubAppsSection({ data }: { data: CiDeepResponse | undefined }) {
	const apps = (data?.github_apps as GhApp[] | undefined) ?? FALLBACK_APPS;

	return (
		<SectionCard
			id="github-apps"
			title="GitHub Apps"
			icon={<Bot size={18} />}
			badge={`${apps.length} apps`}
		>
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{apps.map((app) => {
					const colors = APP_COLORS[app.name] ?? {
						icon: "text-[var(--color-accent-blue)]",
						bg: "bg-[oklch(0.65_0.18_250_/_0.12)]",
					};
					return (
						<div key={app.name} className="glass-card p-4 space-y-3">
							<div className="flex items-center gap-2">
								<span
									className={cn(
										"flex items-center justify-center size-8 rounded-lg",
										colors.bg,
										colors.icon,
									)}
									aria-hidden="true"
								>
									{APP_ICONS[app.name] ?? <Bot size={16} />}
								</span>
								<div>
									<p className="text-sm font-semibold text-[var(--color-text-primary)]">
										{app.name}
									</p>
									<p className="text-xs text-[var(--color-text-muted)]">
										{app.repos} ריפוs
									</p>
								</div>
							</div>
							<p className="text-xs text-[var(--color-text-secondary)]">
								{app.purpose_he}
							</p>
							<div className="flex items-center gap-2">
								<span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-tertiary)] px-2 py-0.5 rounded-full">
									{app.schedule}
								</span>
								{app.config && (
									<code
										className="text-xs font-mono text-[var(--color-text-muted)]"
										dir="ltr"
									>
										{app.config}
									</code>
								)}
							</div>
							{app.note_he && (
								<p className="text-xs text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)] pt-2">
									{app.note_he}
								</p>
							)}
						</div>
					);
				})}
			</div>
		</SectionCard>
	);
}

// ── Section 5: Security Gates ──────────────────────────────────────────────────

interface SecurityGate {
	name: string;
	version: string;
	note_he: string;
	severity: string;
	pin_required: boolean;
	correct: string;
	wrong: string;
}

const FALLBACK_GATES: SecurityGate[] = [
	{
		name: "harden-runner",
		version: "v2.16.0",
		note_he:
			"⚠️ CVE-2026-25598 + GHSA-g699-3x6g-wm3g — DNS bypass תוקן. גרסאות ישנות מאפשרות דליפת רשת",
		severity: "critical",
		pin_required: true,
		correct: "step-security/harden-runner@v2.16.0",
		wrong: "step-security/harden-runner@v2",
	},
	{
		name: "trivy-action",
		version: "SHA-pinned",
		note_he:
			"🚨 75/76 תגים נפגעו בהתקפת שרשרת אספקה (מרץ 2026). לעולם לא @v0.x.x — תמיד SHA מלא 40 תווים",
		severity: "critical",
		pin_required: true,
		correct: "aquasecurity/trivy-action@<FULL_SHA>",
		wrong: "aquasecurity/trivy-action@v0.35.0",
	},
	{
		name: "attest-build-provenance",
		version: "v4",
		note_he: "SLSA v4 הוכחת מקור — מאמת שה-artifact נבנה מקוד המקור הנכון",
		severity: "info",
		pin_required: false,
		correct: "actions/attest-build-provenance@v4",
		wrong: "actions/attest-build-provenance@v2",
	},
	{
		name: "cancel-in-progress",
		version: "N/A",
		note_he:
			"CI: true — עצירת ריצות ישנות. Deploy: false — פריסה חלקית גרועה מאי-פריסה",
		severity: "warn",
		pin_required: false,
		correct: "cancel-in-progress: true (CI) / false (deploy)",
		wrong: "cancel-in-progress: true בכל מקום",
	},
	{
		name: "runs-on",
		version: "N/A",
		note_he:
			"🚫 לעולם לא ubuntu-latest! גורם ל-cache miss, binaries שונים, שגיאות שקטות",
		severity: "critical",
		pin_required: true,
		correct: "runs-on: [self-hosted, linux, x64, Lenovo]",
		wrong: "runs-on: ubuntu-latest",
	},
	{
		name: "needs: ci-gate",
		version: "N/A",
		note_he: "deploy.yml חייב needs: ci-gate — קוד שבור לא מגיע לפרודקשן",
		severity: "critical",
		pin_required: false,
		correct: "deploy job: needs: [ci-gate]",
		wrong: "deploy מופעל ישיר ב-push ללא תלות ב-CI",
	},
];

function SecurityGatesSection({ data }: { data: CiDeepResponse | undefined }) {
	const gates =
		(data?.security_gates as SecurityGate[] | undefined) ?? FALLBACK_GATES;
	const critical = gates.filter((g) => g.severity === "critical").length;

	return (
		<SectionCard
			id="security-gates"
			title="שערי אבטחה"
			icon={<Shield size={18} />}
			badge={`${critical} קריטיים`}
		>
			<div className="mt-4 space-y-3">
				{gates.map((gate) => (
					<div
						key={gate.name}
						className={cn(
							"glass-card p-4 border",
							gate.severity === "critical" &&
								"border-[var(--color-accent-red)]/20",
							gate.severity === "warn" &&
								"border-[var(--color-accent-amber)]/20",
							gate.severity === "info" &&
								"border-[var(--color-accent-blue)]/20",
						)}
					>
						<div className="flex items-start gap-3 mb-3">
							<SeverityBadge severity={gate.severity} />
							<div className="flex-1">
								<div className="flex items-center gap-2 flex-wrap">
									<span className="text-sm font-semibold text-[var(--color-text-primary)] font-mono">
										{gate.name}
									</span>
									{gate.version !== "N/A" && (
										<span
											className="text-xs text-[var(--color-text-muted)]"
											dir="ltr"
										>
											{gate.version}
										</span>
									)}
									{gate.pin_required && (
										<span className="text-xs text-[var(--color-accent-amber)] bg-[oklch(0.78_0.16_75_/_0.1)] px-1.5 py-0.5 rounded-full border border-[var(--color-accent-amber)]/20">
											PIN נדרש
										</span>
									)}
								</div>
								<p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
									{gate.note_he}
								</p>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
							<div>
								<p className="text-xs text-[var(--color-accent-green)] mb-1 font-medium">
									נכון:
								</p>
								<pre
									className="text-xs font-mono text-[var(--color-accent-cyan)] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap"
									dir="ltr"
								>
									{gate.correct}
								</pre>
							</div>
							<div>
								<p className="text-xs text-[var(--color-accent-red)] mb-1 font-medium">
									שגוי:
								</p>
								<pre
									className="text-xs font-mono text-[var(--color-accent-red)]/80 bg-[oklch(0.62_0.22_25_/_0.04)] border border-[var(--color-accent-red)]/20 rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap"
									dir="ltr"
								>
									{gate.wrong}
								</pre>
							</div>
						</div>
					</div>
				))}
			</div>
		</SectionCard>
	);
}

// ── Section 6: Runners ─────────────────────────────────────────────────────────

interface RunnersData {
	label: string;
	never_use: string;
	note_he: string;
	lenovo_count: number;
	msi_count: number;
	total: number;
	lenovo_ip: string;
	msi_ip: string;
	note_msi: string;
}

const FALLBACK_RUNNERS: RunnersData = {
	label: "[self-hosted, linux, x64, Lenovo]",
	never_use: "ubuntu-latest",
	note_he:
		"לעולם לא ubuntu-latest! גורם ל-node_modules cache miss, binaries שונים ושגיאות שקטות",
	lenovo_count: 17,
	msi_count: 5,
	total: 22,
	lenovo_ip: "100.82.33.122",
	msi_ip: "100.87.247.87",
	note_msi: "MSI runners: ROLLUP_NATIVE_THREADS=0 לכל build Vite/Rollup",
};

function RunnersSection({ data }: { data: CiDeepResponse | undefined }) {
	const runners =
		(data?.runners as RunnersData | undefined) ?? FALLBACK_RUNNERS;

	return (
		<SectionCard
			id="runners"
			title="Runners"
			icon={<Server size={18} />}
			badge={`${runners.total} runners`}
		>
			<div className="mt-4 space-y-4">
				{/* NEVER ubuntu-latest warning */}
				<div className="flex items-start gap-3 p-3 rounded-lg bg-[oklch(0.62_0.22_25_/_0.08)] border border-[var(--color-accent-red)]/30">
					<AlertTriangle
						size={16}
						className="text-[var(--color-accent-red)] shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<div>
						<p className="text-sm font-semibold text-[var(--color-accent-red)] mb-1">
							🚫 לעולם לא ubuntu-latest
						</p>
						<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
							{runners.note_he}
						</p>
					</div>
				</div>

				{/* Correct label */}
				<div className="p-3 rounded-lg bg-[oklch(0.72_0.19_155_/_0.06)] border border-[var(--color-accent-green)]/20">
					<p className="text-xs text-[var(--color-text-muted)] mb-1">תמיד:</p>
					<code
						className="text-sm font-mono text-[var(--color-accent-green)]"
						dir="ltr"
					>
						{runners.label}
					</code>
				</div>

				{/* Machine breakdown */}
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div className="glass-card p-4 space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm font-semibold text-[var(--color-text-primary)]">
								Lenovo (Pop!_OS)
							</span>
							<span
								className="text-lg font-bold text-[var(--color-accent-blue)]"
								dir="ltr"
							>
								{runners.lenovo_count}
							</span>
						</div>
						<code
							className="text-xs font-mono text-[var(--color-text-muted)]"
							dir="ltr"
						>
							{runners.lenovo_ip}
						</code>
						<p className="text-xs text-[var(--color-text-muted)]">
							מכונה ראשית — 24-core / 64GB RAM
						</p>
					</div>
					<div className="glass-card p-4 space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm font-semibold text-[var(--color-text-primary)]">
								MSI (Secondary)
							</span>
							<span
								className="text-lg font-bold text-[var(--color-accent-purple)]"
								dir="ltr"
							>
								{runners.msi_count}
							</span>
						</div>
						<code
							className="text-xs font-mono text-[var(--color-text-muted)]"
							dir="ltr"
						>
							{runners.msi_ip}
						</code>
						<p className="text-xs text-[var(--color-accent-amber)]">
							{runners.note_msi}
						</p>
					</div>
				</div>
			</div>
		</SectionCard>
	);
}

// ── Section 7: Per-Project Matrix ──────────────────────────────────────────────

interface ProjectRow {
	name: string;
	stack: string;
	ci: boolean;
	bundle_check: boolean;
	lighthouse: boolean;
	trivy_auto: boolean;
	renovate: boolean;
	deploy: string;
	branch: string;
}

const FALLBACK_PROJECTS: ProjectRow[] = [
	{
		name: "Mexicani",
		stack: "Vite+React",
		ci: true,
		bundle_check: true,
		lighthouse: true,
		trivy_auto: true,
		renovate: true,
		deploy: "CF Pages",
		branch: "main",
	},
	{
		name: "Chance Pro",
		stack: "Python",
		ci: true,
		bundle_check: false,
		lighthouse: false,
		trivy_auto: true,
		renovate: true,
		deploy: "CF Pages",
		branch: "main",
	},
	{
		name: "MediFlow",
		stack: "Next.js",
		ci: true,
		bundle_check: true,
		lighthouse: true,
		trivy_auto: true,
		renovate: true,
		deploy: "Netlify (broken)",
		branch: "main",
	},
	{
		name: "NadavAI",
		stack: "Next.js",
		ci: true,
		bundle_check: true,
		lighthouse: true,
		trivy_auto: true,
		renovate: true,
		deploy: "CF Pages",
		branch: "main",
	},
	{
		name: "Z (Cash)",
		stack: "Vite+React+npm",
		ci: true,
		bundle_check: true,
		lighthouse: true,
		trivy_auto: true,
		renovate: true,
		deploy: "CF Pages",
		branch: "main",
	},
	{
		name: "Cash",
		stack: "Vite+React",
		ci: true,
		bundle_check: true,
		lighthouse: true,
		trivy_auto: true,
		renovate: true,
		deploy: "CF Pages",
		branch: "main",
	},
	{
		name: "Shifts",
		stack: "Vite+React",
		ci: true,
		bundle_check: true,
		lighthouse: true,
		trivy_auto: true,
		renovate: true,
		deploy: "CF Pages",
		branch: "main",
	},
	{
		name: "HatumDigital",
		stack: "Vite+Capacitor",
		ci: true,
		bundle_check: true,
		lighthouse: true,
		trivy_auto: true,
		renovate: true,
		deploy: "CF Pages",
		branch: "main",
	},
	{
		name: "Brain",
		stack: "Vite+React",
		ci: true,
		bundle_check: true,
		lighthouse: true,
		trivy_auto: true,
		renovate: true,
		deploy: "CF Pages",
		branch: "master",
	},
	{
		name: "SportChat",
		stack: "Flutter",
		ci: true,
		bundle_check: false,
		lighthouse: false,
		trivy_auto: false,
		renovate: true,
		deploy: "Firebase",
		branch: "main",
	},
	{
		name: "VibChat",
		stack: "Next.js+Convex",
		ci: true,
		bundle_check: true,
		lighthouse: true,
		trivy_auto: true,
		renovate: true,
		deploy: "Netlify",
		branch: "main",
	},
	{
		name: "Design System",
		stack: "Node ESM",
		ci: true,
		bundle_check: false,
		lighthouse: false,
		trivy_auto: true,
		renovate: true,
		deploy: "npm publish",
		branch: "main",
	},
	{
		name: "My Video",
		stack: "Remotion",
		ci: false,
		bundle_check: false,
		lighthouse: false,
		trivy_auto: false,
		renovate: true,
		deploy: "none",
		branch: "master",
	},
	{
		name: "Signature Pro",
		stack: "Vite+React",
		ci: true,
		bundle_check: true,
		lighthouse: false,
		trivy_auto: true,
		renovate: true,
		deploy: "CF Pages",
		branch: "main",
	},
];

type SortState = { key: SortKey | null; dir: SortDir };

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
	if (!active)
		return (
			<ChevronsUpDown size={12} className="opacity-40" aria-hidden="true" />
		);
	return dir === "asc" ? (
		<ChevronUp
			size={12}
			className="text-[var(--color-accent-blue)]"
			aria-hidden="true"
		/>
	) : (
		<ChevronDown
			size={12}
			className="text-[var(--color-accent-blue)]"
			aria-hidden="true"
		/>
	);
}

function ProjectMatrixSection({ data }: { data: CiDeepResponse | undefined }) {
	const projects =
		(data?.per_project as ProjectRow[] | undefined) ?? FALLBACK_PROJECTS;
	const [sort, setSort] = useState<SortState>({ key: null, dir: null });

	function toggleSort(key: SortKey) {
		setSort((prev) =>
			prev.key !== key
				? { key, dir: "asc" }
				: prev.dir === "asc"
					? { key, dir: "desc" }
					: { key: null, dir: null },
		);
	}

	const sorted = useMemo(() => {
		if (!sort.key) return projects;
		return [...projects].sort((a, b) => {
			const av = a[sort.key!];
			const bv = b[sort.key!];
			let cmp = 0;
			if (typeof av === "boolean")
				cmp = (bv as boolean) === av ? 0 : av ? -1 : 1;
			else cmp = String(av).localeCompare(String(bv));
			return sort.dir === "asc" ? cmp : -cmp;
		});
	}, [projects, sort]);

	const ciWithAll = projects.filter(
		(p) => p.ci && p.bundle_check && p.lighthouse && p.trivy_auto && p.renovate,
	).length;

	const cols: { key: SortKey; label: string; color: string }[] = [
		{ key: "ci", label: "CI", color: "text-[var(--color-accent-blue)]" },
		{
			key: "bundle_check",
			label: "bundle-check",
			color: "text-[var(--color-accent-amber)]",
		},
		{
			key: "lighthouse",
			label: "lighthouse CI",
			color: "text-[var(--color-accent-cyan)]",
		},
		{
			key: "trivy_auto",
			label: "trivy weekly",
			color: "text-[var(--color-accent-red)]",
		},
		{
			key: "renovate",
			label: "Renovate",
			color: "text-[var(--color-accent-green)]",
		},
	];

	return (
		<SectionCard
			id="matrix"
			title="מטריצת פרויקטים"
			icon={<FileText size={18} />}
			badge={`${ciWithAll} פרויקטים מלאים`}
		>
			<div className="mt-4 space-y-3">
				<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
					{ciWithAll} פרויקטים מופעלים עם כל 5 הכלים. לחץ על כותרת עמודה למיון.
				</p>
				<div className="overflow-x-auto">
					<table className="w-full text-xs" aria-label="מטריצת CI לפי פרויקט">
						<thead>
							<tr className="border-b border-[var(--color-border)]">
								<th className="text-start pb-2 pe-4 text-[var(--color-text-muted)] font-medium whitespace-nowrap">
									<button
										type="button"
										onClick={() => toggleSort("name")}
										className="flex items-center gap-1 hover:text-[var(--color-text-secondary)] transition-colors"
									>
										פרויקט{" "}
										<SortIcon
											active={sort.key === "name"}
											dir={sort.key === "name" ? sort.dir : null}
										/>
									</button>
								</th>
								<th className="text-start pb-2 pe-4 text-[var(--color-text-muted)] font-medium whitespace-nowrap">
									Stack
								</th>
								{cols.map(({ key, label, color }) => (
									<th
										key={key}
										className="text-center pb-2 pe-3 whitespace-nowrap"
									>
										<button
											type="button"
											onClick={() => toggleSort(key)}
											className={cn(
												"flex items-center gap-1 mx-auto hover:opacity-80 transition-opacity font-medium",
												color,
											)}
										>
											{label}{" "}
											<SortIcon
												active={sort.key === key}
												dir={sort.key === key ? sort.dir : null}
											/>
										</button>
									</th>
								))}
								<th className="text-start pb-2 pe-3 text-[var(--color-text-muted)] font-medium whitespace-nowrap">
									<button
										type="button"
										onClick={() => toggleSort("deploy")}
										className="flex items-center gap-1 hover:text-[var(--color-text-secondary)] transition-colors"
									>
										Deploy{" "}
										<SortIcon
											active={sort.key === "deploy"}
											dir={sort.key === "deploy" ? sort.dir : null}
										/>
									</button>
								</th>
								<th className="text-start pb-2 text-[var(--color-text-muted)] font-medium whitespace-nowrap">
									Branch
								</th>
							</tr>
						</thead>
						<tbody>
							{sorted.map((proj) => (
								<tr
									key={proj.name}
									className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors duration-100"
								>
									<td className="py-2 pe-4 font-semibold text-[var(--color-text-primary)] whitespace-nowrap">
										{proj.name}
									</td>
									<td
										className="py-2 pe-4 font-mono text-[var(--color-text-muted)] whitespace-nowrap"
										dir="ltr"
									>
										{proj.stack}
									</td>
									{cols.map(({ key }) => (
										<td key={key} className="py-2 pe-3 text-center">
											<StatusBadge ok={proj[key] as boolean} />
										</td>
									))}
									<td className="py-2 pe-3 text-[var(--color-text-secondary)] whitespace-nowrap">
										<span
											className={cn(
												"text-xs px-1.5 py-0.5 rounded-full",
												(proj.deploy ?? "").includes("CF Pages") &&
													"text-[var(--color-accent-orange)] bg-[oklch(0.75_0.18_50_/_0.1)]",
												(proj.deploy ?? "").includes("Netlify") &&
													"text-[var(--color-accent-cyan)] bg-[oklch(0.75_0.14_200_/_0.1)]",
												(proj.deploy ?? "").includes("Firebase") &&
													"text-[var(--color-accent-amber)] bg-[oklch(0.78_0.16_75_/_0.1)]",
												(proj.deploy ?? "") === "none" &&
													"text-[var(--color-text-muted)] opacity-50",
												(proj.deploy ?? "").includes("npm") &&
													"text-[var(--color-accent-red)] bg-[oklch(0.62_0.22_25_/_0.1)]",
											)}
										>
											{proj.deploy}
										</span>
									</td>
									<td
										className="py-2 font-mono text-[var(--color-text-muted)] text-xs"
										dir="ltr"
									>
										{proj.branch}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{/* Legend */}
				<div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)] pt-1">
					<span className="flex items-center gap-1">
						<CheckCircle2
							size={12}
							className="text-[var(--color-accent-green)]"
							aria-hidden="true"
						/>{" "}
						מופעל
					</span>
					<span className="flex items-center gap-1">
						<XCircle size={12} className="opacity-40" aria-hidden="true" /> לא
						מופעל
					</span>
					<span className="flex items-center gap-1">
						<span className="text-[var(--color-accent-amber)]">
							Netlify (broken)
						</span>{" "}
						— build בנייה שבורה, pending fix
					</span>
				</div>
			</div>
		</SectionCard>
	);
}

// ── Section 8: Template Gallery ────────────────────────────────────────────────

function TemplateCard({
	template,
}: {
	template: CiTemplate & { category: TemplateCategory };
}) {
	const meta = CATEGORY_META[template.category];
	const Icon = meta.icon;
	return (
		<div
			className={cn(
				"glass-card p-3 flex flex-col gap-2 transition-all duration-150",
				"hover:border-[var(--color-border-hover)]",
			)}
		>
			<div className="flex items-start gap-2">
				<span
					className={cn(
						"flex items-center justify-center size-7 rounded-md shrink-0",
						meta.color,
					)}
					aria-hidden="true"
				>
					<Icon size={14} />
				</span>
				<div className="min-w-0 flex-1">
					<p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
						{template.name}
					</p>
					<p
						className="text-xs text-[var(--color-text-muted)] truncate font-mono"
						dir="ltr"
					>
						{template.file}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-2 flex-wrap">
				<span
					className={cn(
						"inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full",
						meta.color,
					)}
				>
					{meta.label}
				</span>
				<span className="text-xs text-[var(--color-text-muted)]" dir="ltr">
					{template.lines} שורות · {template.size_kb}KB
				</span>
			</div>
		</div>
	);
}

function TemplateGallery({ templates }: { templates: CiTemplate[] }) {
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<
		TemplateCategory | "all"
	>("all");

	const annotated = useMemo(
		() =>
			templates.map((t) => ({
				...t,
				category: categorizeTemplate(t.file, t.name),
			})),
		[templates],
	);

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return annotated.filter((t) => {
			const matchSearch =
				!q ||
				t.name.toLowerCase().includes(q) ||
				t.file.toLowerCase().includes(q);
			const matchCat =
				activeCategory === "all" || t.category === activeCategory;
			return matchSearch && matchCat;
		});
	}, [annotated, search, activeCategory]);

	const categories = useMemo(() => {
		const counts: Partial<Record<TemplateCategory | "all", number>> = {
			all: annotated.length,
		};
		for (const t of annotated)
			counts[t.category] = (counts[t.category] ?? 0) + 1;
		return counts;
	}, [annotated]);

	return (
		<SectionCard
			id="gallery"
			title="גלריית תבניות"
			icon={<FileCode2 size={18} />}
			badge={`${templates.length} קבצים`}
		>
			<div className="mt-4 space-y-4">
				{/* Search */}
				<div className="relative">
					<Search
						size={14}
						className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
						aria-hidden="true"
					/>
					<input
						type="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="חיפוש תבנית..."
						className={cn(
							"w-full rounded-lg ps-8 pe-4 py-2 text-sm",
							"bg-[var(--color-bg-primary)] border border-[var(--color-border)]",
							"text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
							"focus:outline-none focus:border-[var(--color-accent-blue)]/60",
							"transition-colors duration-150",
						)}
						aria-label="חיפוש תבניות CI/CD"
					/>
				</div>

				{/* Category pills */}
				<div className="flex flex-wrap gap-2">
					{(
						[
							"all",
							"ci",
							"security",
							"deploy",
							"quality",
							"bundle",
							"lighthouse",
							"flutter",
							"other",
						] as const
					).map((cat) => {
						const count = categories[cat];
						if (count === undefined) return null;
						const meta = cat === "all" ? null : CATEGORY_META[cat];
						return (
							<button
								key={cat}
								type="button"
								onClick={() => setActiveCategory(cat)}
								className={cn(
									"inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
									"transition-all duration-150 min-h-7",
									activeCategory === cat
										? cat === "all"
											? "bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)] ring-1 ring-[var(--color-accent-blue)]/40"
											: cn(meta?.color, "ring-1 ring-current/40")
										: "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]",
								)}
							>
								{cat === "all" ? "הכל" : meta?.label}
								<span
									dir="ltr"
									className={cn(
										"text-xs tabular-nums",
										activeCategory === cat ? "opacity-80" : "opacity-50",
									)}
								>
									{count}
								</span>
							</button>
						);
					})}
				</div>

				{/* Grid */}
				{filtered.length === 0 ? (
					<p className="text-sm text-[var(--color-text-muted)] text-center py-6">
						לא נמצאו תבניות
					</p>
				) : (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{filtered.map((t) => (
							<TemplateCard key={t.file} template={t} />
						))}
					</div>
				)}

				{templates.length === 0 && (
					<div className="text-center py-8">
						<FileCode2
							size={32}
							className="mx-auto mb-2 text-[var(--color-text-muted)] opacity-40"
							aria-hidden="true"
						/>
						<p className="text-sm text-[var(--color-text-muted)]">
							לא נמצאו תבניות ב-~/ci-standards/
						</p>
						<p
							className="text-xs text-[var(--color-text-muted)] mt-1"
							dir="ltr"
						>
							git clone https://github.com/Nadav011/ci-standards ~/ci-standards
						</p>
					</div>
				)}
			</div>
		</SectionCard>
	);
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export function CiTemplatesPage() {
	const { data: templatesData, isLoading: templatesLoading } = useCiTemplates();
	const { data: deepData, isLoading: deepLoading } = useCiDeep();

	const templates = templatesData?.templates ?? [];
	const tools = (deepData?.tools as DeepTool[] | undefined) ?? FALLBACK_TOOLS;

	if (templatesLoading || deepLoading || !deepData) {
		return (
			<div className="p-6 text-center">
				<RefreshCw
					size={20}
					className="mx-auto mb-2 text-[var(--color-text-muted)] animate-spin"
					aria-hidden="true"
				/>
				<p className="text-sm text-[var(--color-text-muted)]">
					טוען נתוני CI/CD…
				</p>
			</div>
		);
	}

	return (
		<div className="p-4 space-y-4 max-w-7xl mx-auto" dir="rtl">
			{/* Header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
						<Code2
							size={22}
							className="text-[var(--color-accent-blue)]"
							aria-hidden="true"
						/>
						CI/CD — תשתית מלאה
					</h1>
					<p className="text-sm text-[var(--color-text-muted)] mt-0.5">
						כל פרויקטי APEX — pipeline, כלים, אבטחה, runners, מטריצת פרויקטים
					</p>
				</div>
				<div className="flex items-center gap-2">
					<a
						href="https://github.com/Nadav011/ci-standards"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] transition-colors duration-150 min-h-8"
					>
						<GitBranch size={13} aria-hidden="true" />
						ci-standards
						<ExternalLink size={12} className="opacity-60" aria-hidden="true" />
					</a>
				</div>
			</div>

			{/* Summary strip */}
			<SummaryStrip deep={deepData} templatesCount={templates.length} />

			{/* Navigation quick-links */}
			<div className="flex flex-wrap gap-2">
				{[
					{
						href: "#pipeline",
						label: "Pipeline",
						icon: <GitBranch size={12} />,
					},
					{ href: "#tools", label: "כלים", icon: <Terminal size={12} /> },
					{
						href: "#workflows",
						label: "Workflows",
						icon: <FileText size={12} />,
					},
					{
						href: "#github-apps",
						label: "GitHub Apps",
						icon: <Bot size={12} />,
					},
					{
						href: "#security-gates",
						label: "שערי אבטחה",
						icon: <Shield size={12} />,
					},
					{ href: "#runners", label: "Runners", icon: <Server size={12} /> },
					{
						href: "#matrix",
						label: "מטריצה",
						icon: <CheckCircle2 size={12} />,
					},
					{ href: "#gallery", label: "גלריה", icon: <FileCode2 size={12} /> },
				].map(({ href, label, icon }) => (
					<a
						key={href}
						href={href}
						className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] transition-colors duration-150 min-h-7"
					>
						<span aria-hidden="true">{icon}</span>
						{label}
					</a>
				))}
			</div>

			{/* All sections */}
			<PipelineArchitectureSection />
			<ToolsSection tools={tools} />
			<ReusableWorkflowsSection data={deepData} />
			<GithubAppsSection data={deepData} />
			<SecurityGatesSection data={deepData} />
			<RunnersSection data={deepData} />
			<ProjectMatrixSection data={deepData} />
			<TemplateGallery templates={templates} />
		</div>
	);
}
