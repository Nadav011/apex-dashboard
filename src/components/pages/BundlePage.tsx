// type-ok
// rtl-ok — see inline rtl-ok comments on ECharts canvas coordinate lines
import ReactECharts from "echarts-for-react";
import {
	AlertTriangle,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Code2,
	FileCode2,
	GitBranch,
	Globe,
	Package,
	Search,
	Shield,
	Terminal,
	TrendingDown,
	XCircle,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

// ── Types ─────────────────────────────────────────────────────────────────────

type BundleStatus = "ok" | "warn" | "over";
type Platform = "CF Pages" | "Netlify";

interface ProjectBundle {
	name: string;
	bundleKb: number;
	limitKb: number;
	platform: Platform;
}

interface OptimizationTech {
	id: string;
	title: string;
	description: string;
	saving: string;
	appliedTo: string[];
	icon: React.ReactNode;
	accentColor: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PROJECTS: ProjectBundle[] = [
	{ name: "Mexicani", bundleKb: 420, limitKb: 450, platform: "CF Pages" },
	{ name: "Cash/Z", bundleKb: 380, limitKb: 400, platform: "CF Pages" },
	{ name: "Shifts", bundleKb: 350, limitKb: 380, platform: "CF Pages" },
	{ name: "Brain", bundleKb: 320, limitKb: 350, platform: "CF Pages" },
	{ name: "Hatumdigital", bundleKb: 400, limitKb: 430, platform: "CF Pages" },
	{ name: "MediFlow", bundleKb: 500, limitKb: 550, platform: "Netlify" },
	{ name: "nadavai", bundleKb: 300, limitKb: 350, platform: "CF Pages" },
	{ name: "Signature Pro", bundleKb: 280, limitKb: 320, platform: "CF Pages" },
	{ name: "vibechat", bundleKb: 450, limitKb: 500, platform: "Netlify" },
];

const OPTIMIZATION_TECHNIQUES: OptimizationTech[] = [
	{
		id: "sentry-stub",
		title: "Sentry Stub",
		description:
			"החלפת @sentry/react עם stub בגודל 2KB שמדווח שגיאות דרך fetch. חיסכון של 200-270KB לפרויקט.",
		saving: "200–270 KB",
		appliedTo: ["Cash/Z", "Hatumdigital", "MediFlow"],
		icon: <Shield size={18} />,
		accentColor: "var(--color-accent-purple)",
	},
	{
		id: "recharts-named",
		title: "Recharts Named Imports",
		description:
			"החלפת `import * as Recharts from 'recharts'` עם named imports מדויקים. מאפשר tree-shaking מלא.",
		saving: "312 KB",
		appliedTo: ["Shifts"],
		icon: <TrendingDown size={18} />,
		accentColor: "var(--color-accent-cyan)",
	},
	{
		id: "turbopack-floor",
		title: "Turbopack Polyfill Floor",
		description:
			"109KB polyfill chunk הוא hardcoded ב-Next.js + Turbopack. לא ניתן להסיר. יש לחשב זאת בתקציב הבאנדל.",
		saving: "—",
		appliedTo: ["MediFlow", "nadavai"],
		icon: <AlertTriangle size={18} />,
		accentColor: "var(--color-accent-amber)",
	},
	{
		id: "tree-shaking",
		title: "Tree Shaking",
		description:
			"שימוש ב-Biome + named imports בלבד. מוודאים שאין import * ושאין קוד מת שנגרר לבאנדל הסופי.",
		saving: "משתנה",
		appliedTo: ["כל הפרויקטים"],
		icon: <Zap size={18} />,
		accentColor: "var(--color-accent-green)",
	},
	{
		id: "code-splitting",
		title: "Code Splitting",
		description:
			"שימוש ב-dynamic import() לקומפוננטים כבדים. טעינה עצלה להפחתת initial load.",
		saving: "משתנה",
		appliedTo: ["כל הפרויקטים"],
		icon: <Code2 size={18} />,
		accentColor: "var(--color-accent-blue)",
	},
	{
		id: "bundle-ci-guard",
		title: "Bundle CI Guard",
		description:
			"bundle-check.yml בכל פרויקט — בונה, מודד, ונכשל אם עוברים את הסף. מניע רגרסיות לבאנדל.",
		saving: "מניעה",
		appliedTo: ["כל הפרויקטים"],
		icon: <GitBranch size={18} />,
		accentColor: "var(--color-accent-red)",
	},
];

const TOOLS = [
	{
		command: "pnpm build && find dist/assets -name '*.js' -exec du -sh {} +",
		description: "בדיקה מקומית — גודל כל chunk בנפרד",
		icon: <Terminal size={16} />,
	},
	{
		command: "npx vite-bundle-visualizer",
		description: "ויזואליזציה אינטראקטיבית של הבאנדל — רואים מה לוקח מקום",
		icon: <Search size={16} />,
	},
	{
		command: "pnpm exec knip",
		description: "זיהוי קוד מת — מודולים, exports ו-imports שאינם בשימוש",
		icon: <Code2 size={16} />,
	},
	{
		command: "bash ~/.claude/scripts/autoresearch/bundle-loop.sh",
		description: "AutoResearch bundle-loop — אופטימיזציה אוטומטית לילית",
		icon: <Zap size={16} />,
	},
];

// ── YAML snippets (string literals, not CSS) ──────────────────────────────────

const YAML_VITE = `# .github/workflows/bundle-check.yml (Vite / React)
name: Bundle Size Check

on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: bundle-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  bundle-check:
    runs-on: [self-hosted, linux, x64, Lenovo]
    steps:
      - uses: actions/checkout@v4
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with: { version: "10" }
      - name: Install deps
        run: pnpm install --frozen-lockfile
      - name: Build
        run: pnpm run build
      - name: Check bundle size
        run: |
          # Vite output: dist/assets/ (NOT dist/js/ — that path is always empty!)
          TOTAL_KB=$(find dist/assets -name "*.js" \\
            | xargs du -k 2>/dev/null \\
            | awk '{sum += $1} END {print sum}')
          LIMIT_KB=450
          echo "Bundle: \${TOTAL_KB}KB / \${LIMIT_KB}KB"
          if [ "$TOTAL_KB" -gt "$LIMIT_KB" ]; then
            echo "Bundle exceeds limit: \${TOTAL_KB}KB > \${LIMIT_KB}KB"
            exit 1
          fi
          echo "Bundle OK: \${TOTAL_KB}KB"`;

const YAML_NEXTJS = `      - name: Check bundle size (Next.js)
        run: |
          # Next.js output: .next/static/chunks/ (NOT dist/)
          # Turbopack: 109KB polyfill is hardcoded — account for it in LIMIT_KB
          TOTAL_KB=$(find .next/static/chunks -name "*.js" \\
            | xargs du -k 2>/dev/null \\
            | awk '{sum += $1} END {print sum}')
          LIMIT_KB=550
          echo "Bundle: \${TOTAL_KB}KB / \${LIMIT_KB}KB"
          if [ "$TOTAL_KB" -gt "$LIMIT_KB" ]; then
            exit 1
          fi`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function getBundleStatus(project: ProjectBundle): BundleStatus {
	const ratio = project.bundleKb / project.limitKb;
	if (ratio > 1) return "over";
	if (ratio >= 0.9) return "warn";
	return "ok";
}

function getBundlePercent(project: ProjectBundle): number {
	return Math.round((project.bundleKb / project.limitKb) * 100);
}

// ── Sub-Components ────────────────────────────────────────────────────────────

function StatCard({
	label,
	value,
	sub,
	accentColor,
	icon,
}: {
	label: string;
	value: string;
	sub?: string;
	accentColor: string;
	icon: React.ReactNode;
}) {
	return (
		<div className="glass-card p-4 flex items-start gap-3">
			<div
				className="flex size-10 shrink-0 items-center justify-center rounded-xl mt-0.5"
				style={{
					background: `oklch(from ${accentColor} l c h / 0.15)`,
					color: accentColor,
				}}
				aria-hidden="true"
			>
				{icon}
			</div>
			<div className="min-w-0">
				<div className="text-xs text-text-muted mb-0.5">{label}</div>
				<div className="text-xl font-bold text-text-primary leading-tight">
					{value}
				</div>
				{sub && <div className="text-xs text-text-secondary mt-0.5">{sub}</div>}
			</div>
		</div>
	);
}

function StatusBadge({ status }: { status: BundleStatus }) {
	const config = {
		ok: {
			icon: <CheckCircle2 size={14} />,
			label: "תקין",
			color: "var(--color-accent-green)",
			bg: "oklch(0.72 0.19 155 / 0.12)",
		},
		warn: {
			icon: <AlertTriangle size={14} />,
			label: "קרוב לסף",
			color: "var(--color-accent-amber)",
			bg: "oklch(0.78 0.16 75 / 0.12)",
		},
		over: {
			icon: <XCircle size={14} />,
			label: "חריגה",
			color: "var(--color-accent-red)",
			bg: "oklch(0.62 0.22 25 / 0.12)",
		},
	}[status];

	return (
		<span
			className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
			style={{ background: config.bg, color: config.color }}
		>
			{config.icon}
			{config.label}
		</span>
	);
}

function PlatformBadge({ platform }: { platform: Platform }) {
	const isCf = platform === "CF Pages";
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
				isCf
					? "bg-orange-500/10 text-orange-400"
					: "bg-teal-500/10 text-teal-400",
			)}
		>
			<Globe size={11} />
			{platform}
		</span>
	);
}

function BundleBar({ project }: { project: ProjectBundle }) {
	const status = getBundleStatus(project);
	const pct = Math.min(getBundlePercent(project), 110);

	const barColor = {
		ok: "var(--color-accent-green)",
		warn: "var(--color-accent-amber)",
		over: "var(--color-accent-red)",
	}[status];

	return (
		<div className="w-full">
			<div className="flex justify-between text-xs text-text-muted mb-1">
				<span dir="ltr">
					{project.bundleKb} KB / {project.limitKb} KB
				</span>
				<span dir="ltr">{getBundlePercent(project)}%</span>
			</div>
			<div className="w-full h-2 rounded-full bg-bg-tertiary overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-500"
					style={{
						width: `${pct}%`,
						background: barColor,
						boxShadow: `0 0 6px oklch(from ${barColor} l c h / 0.4)`,
					}}
				/>
			</div>
		</div>
	);
}

// ── ECharts Horizontal Bar ────────────────────────────────────────────────────

function BundleBarChart() {
	const sorted = [...PROJECTS].sort((a, b) => b.bundleKb - a.bundleKb);

	const getBarColor = (p: ProjectBundle): string => {
		const status = getBundleStatus(p);
		return {
			ok: "oklch(0.72 0.19 155)",
			warn: "oklch(0.78 0.16 75)",
			over: "oklch(0.62 0.22 25)",
		}[status];
	};

	const option = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis" as const,
			axisPointer: { type: "shadow" as const },
			backgroundColor: "oklch(0.16 0.01 260)",
			borderColor: "oklch(0.28 0.02 260)",
			textStyle: {
				color: "oklch(0.95 0.01 260)",
				fontFamily: "Heebo, Inter, system-ui",
			},
			formatter: (params: { name: string; value: number }[]) => {
				const p = PROJECTS.find((pr) => pr.name === params[0].name);
				if (!p) return "";
				return [
					`<div style="font-family:Heebo,Inter,system-ui;padding:4px">`,
					`<strong>${p.name}</strong><br/>`,
					`גודל: ${p.bundleKb} KB<br/>`,
					`סף: ${p.limitKb} KB<br/>`,
					`שימוש: ${getBundlePercent(p)}%`,
					`</div>`,
				].join("");
			},
		},
		// rtl-ok — ECharts grid px coordinates, not CSS directional properties
		grid: { top: 10, bottom: 10, left: 90, right: 80, containLabel: false }, // rtl-ok
		xAxis: {
			type: "value" as const,
			max: 600,
			axisLine: { show: false },
			axisTick: { show: false },
			splitLine: {
				lineStyle: {
					color: "oklch(0.28 0.02 260)",
					type: "dashed" as const,
				},
			},
			axisLabel: {
				color: "oklch(0.55 0.02 260)",
				formatter: (v: number) => `${v}KB`,
				fontFamily: "Heebo, Inter, system-ui",
				fontSize: 11,
			},
		},
		yAxis: {
			type: "category" as const,
			data: sorted.map((p) => p.name),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: {
				color: "oklch(0.72 0.02 260)",
				fontFamily: "Heebo, Inter, system-ui",
				fontSize: 12,
			},
		},
		series: [
			{
				type: "bar" as const,
				name: "גודל באנדל",
				data: sorted.map((p) => ({
					value: p.bundleKb,
					itemStyle: {
						color: getBarColor(p),
						borderRadius: [0, 4, 4, 0],
					},
				})),
				barMaxWidth: 24,
				label: {
					show: true,
					position: "right" as const,
					color: "oklch(0.72 0.02 260)",
					fontFamily: "Heebo, Inter, system-ui",
					fontSize: 11,
					formatter: (params: { value: number }) => `${params.value}KB`,
				},
			},
			{
				type: "bar" as const,
				name: "סף",
				data: sorted.map((p) => ({
					value: p.limitKb - p.bundleKb,
					itemStyle: {
						color: "oklch(0.28 0.02 260 / 0.4)",
						borderRadius: [0, 4, 4, 0],
					},
				})),
				barMaxWidth: 24,
				stack: "total",
				label: { show: false },
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: `${sorted.length * 44}px`, width: "100%" }}
			opts={{ renderer: "svg" }}
		/>
	);
}

// ── Section: Summary ──────────────────────────────────────────────────────────

function SummarySection() {
	const avg = Math.round(
		PROJECTS.reduce((s, p) => s + p.bundleKb, 0) / PROJECTS.length,
	);
	const smallest = PROJECTS.reduce((a, b) => (a.bundleKb < b.bundleKb ? a : b));
	const largest = PROJECTS.reduce((a, b) => (a.bundleKb > b.bundleKb ? a : b));
	const overCount = PROJECTS.filter(
		(p) => getBundleStatus(p) === "over",
	).length;
	const warnCount = PROJECTS.filter(
		(p) => getBundleStatus(p) === "warn",
	).length;
	const okCount = PROJECTS.filter((p) => getBundleStatus(p) === "ok").length;

	return (
		<section aria-labelledby="summary-heading">
			<h2
				id="summary-heading"
				className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"
			>
				<span
					className="flex size-7 items-center justify-center rounded-lg"
					style={{
						background: "oklch(0.65 0.18 250 / 0.15)",
						color: "var(--color-accent-blue)",
					}}
					aria-hidden="true"
				>
					<Package size={15} />
				</span>
				סיכום
			</h2>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<StatCard
					label="פרויקטים נוטרים"
					value={String(PROJECTS.length)}
					sub="web projects"
					accentColor="var(--color-accent-blue)"
					icon={<FileCode2 size={18} />}
				/>
				<StatCard
					label="ממוצע באנדל"
					value={`${avg} KB`}
					sub="across all projects"
					accentColor="var(--color-accent-cyan)"
					icon={<Package size={18} />}
				/>
				<StatCard
					label="הקטן ביותר"
					value={`${smallest.bundleKb} KB`}
					sub={smallest.name}
					accentColor="var(--color-accent-green)"
					icon={<TrendingDown size={18} />}
				/>
				<StatCard
					label="הגדול ביותר"
					value={`${largest.bundleKb} KB`}
					sub={largest.name}
					accentColor="var(--color-accent-amber)"
					icon={<AlertTriangle size={18} />}
				/>
			</div>

			{/* Status overview pills */}
			<div className="mt-3 flex flex-wrap gap-2">
				<div className="flex items-center gap-2 glass-card px-3 py-2">
					<CheckCircle2 size={14} className="text-accent-green shrink-0" />
					<span className="text-sm text-text-secondary">
						<span className="font-bold text-accent-green">{okCount}</span>{" "}
						פרויקטים תקינים
					</span>
				</div>
				{warnCount > 0 && (
					<div className="flex items-center gap-2 glass-card px-3 py-2">
						<AlertTriangle size={14} className="text-accent-amber shrink-0" />
						<span className="text-sm text-text-secondary">
							<span className="font-bold text-accent-amber">{warnCount}</span>{" "}
							קרובים לסף (90%+)
						</span>
					</div>
				)}
				{overCount > 0 && (
					<div className="flex items-center gap-2 glass-card px-3 py-2">
						<XCircle size={14} className="text-accent-red shrink-0" />
						<span className="text-sm text-text-secondary">
							<span className="font-bold text-accent-red">{overCount}</span>{" "}
							חריגות מהסף
						</span>
					</div>
				)}
			</div>
		</section>
	);
}

// ── Section: Per-Project ──────────────────────────────────────────────────────

function ProjectBundleSection() {
	const [view, setView] = useState<"chart" | "table">("chart");

	return (
		<section aria-labelledby="projects-heading">
			<div className="flex items-center justify-between mb-4 flex-wrap gap-2">
				<h2
					id="projects-heading"
					className="text-lg font-semibold text-text-primary flex items-center gap-2"
				>
					<span
						className="flex size-7 items-center justify-center rounded-lg"
						style={{
							background: "oklch(0.72 0.19 155 / 0.15)",
							color: "var(--color-accent-green)",
						}}
						aria-hidden="true"
					>
						<GitBranch size={15} />
					</span>
					סטטוס באנדל לפרויקט
				</h2>
				<div className="flex items-center gap-1 glass-card p-1 rounded-lg">
					<button
						type="button"
						onClick={() => setView("chart")}
						className={cn(
							"px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 min-h-[36px]",
							view === "chart"
								? "bg-accent-blue/20 text-accent-blue"
								: "text-text-muted hover:text-text-secondary",
						)}
					>
						גרף
					</button>
					<button
						type="button"
						onClick={() => setView("table")}
						className={cn(
							"px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 min-h-[36px]",
							view === "table"
								? "bg-accent-blue/20 text-accent-blue"
								: "text-text-muted hover:text-text-secondary",
						)}
					>
						טבלה
					</button>
				</div>
			</div>

			{view === "chart" ? (
				<div className="glass-card p-4">
					<div className="mb-3 flex items-center gap-4 text-xs text-text-muted flex-wrap">
						<span className="flex items-center gap-1.5">
							<span
								className="w-3 h-3 rounded-sm inline-block"
								style={{ background: "oklch(0.72 0.19 155)" }}
							/>
							תקין
						</span>
						<span className="flex items-center gap-1.5">
							<span
								className="w-3 h-3 rounded-sm inline-block"
								style={{ background: "oklch(0.78 0.16 75)" }}
							/>
							קרוב לסף (90%+)
						</span>
						<span className="flex items-center gap-1.5">
							<span
								className="w-3 h-3 rounded-sm inline-block"
								style={{ background: "oklch(0.62 0.22 25)" }}
							/>
							חריגה
						</span>
					</div>
					<BundleBarChart />
				</div>
			) : (
				<div className="glass-card overflow-hidden">
					{/* Desktop table */}
					<div className="hidden sm:block overflow-x-auto">
						<table
							className="w-full text-sm"
							aria-label="טבלת גודל באנדל לפרויקטים"
						>
							<thead>
								<tr className="border-b border-border">
									<th className="text-start px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
										פרויקט
									</th>
									<th className="text-start px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
										גודל
									</th>
									<th className="text-start px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
										סף
									</th>
									<th className="text-start px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
										שימוש
									</th>
									<th className="text-start px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
										סטטוס
									</th>
									<th className="text-start px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">
										פלטפורמה
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{PROJECTS.map((project) => {
									const status = getBundleStatus(project);
									return (
										<tr
											key={project.name}
											className="hover:bg-bg-tertiary/50 transition-colors duration-100"
										>
											<td className="px-4 py-3 font-medium text-text-primary">
												{project.name}
											</td>
											<td
												className="px-4 py-3 text-text-secondary font-mono"
												dir="ltr"
											>
												{project.bundleKb} KB
											</td>
											<td
												className="px-4 py-3 text-text-muted font-mono"
												dir="ltr"
											>
												{project.limitKb} KB
											</td>
											<td className="px-4 py-3 w-40">
												<BundleBar project={project} />
											</td>
											<td className="px-4 py-3">
												<StatusBadge status={status} />
											</td>
											<td className="px-4 py-3">
												<PlatformBadge platform={project.platform} />
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Mobile cards */}
					<div className="sm:hidden divide-y divide-border">
						{PROJECTS.map((project) => {
							const status = getBundleStatus(project);
							return (
								<div key={project.name} className="px-4 py-4 space-y-3">
									<div className="flex items-start justify-between gap-2">
										<span className="font-medium text-text-primary">
											{project.name}
										</span>
										<div className="flex flex-col items-end gap-1">
											<StatusBadge status={status} />
											<PlatformBadge platform={project.platform} />
										</div>
									</div>
									<BundleBar project={project} />
									<div className="flex gap-4 text-xs text-text-muted" dir="ltr">
										<span>{project.bundleKb} KB actual</span>
										<span>{project.limitKb} KB limit</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</section>
	);
}

// ── Optimization Card ─────────────────────────────────────────────────────────

function OptimizationCard({ tech }: { tech: OptimizationTech }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div
			className={cn(
				"glass-card overflow-hidden transition-colors duration-200",
				expanded && "border-[var(--color-border-hover)]",
			)}
		>
			<button
				type="button"
				onClick={() => setExpanded((p) => !p)}
				aria-expanded={expanded}
				className="w-full flex items-center gap-3 px-4 py-4 min-h-[64px] text-start cursor-pointer hover:bg-bg-tertiary transition-colors duration-150"
			>
				<span
					className="flex size-9 shrink-0 items-center justify-center rounded-xl"
					style={{
						background: `oklch(from ${tech.accentColor} l c h / 0.15)`,
						color: tech.accentColor,
					}}
					aria-hidden="true"
				>
					{tech.icon}
				</span>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="font-semibold text-text-primary text-sm">
							{tech.title}
						</span>
						{tech.saving !== "—" && tech.saving !== "משתנה" && (
							<span
								className="text-xs px-2 py-0.5 rounded-full font-medium"
								style={{
									background: `oklch(from ${tech.accentColor} l c h / 0.12)`,
									color: tech.accentColor,
								}}
							>
								{tech.saving}
							</span>
						)}
					</div>
					<div className="text-xs text-text-muted mt-0.5 line-clamp-1">
						{tech.description}
					</div>
				</div>
				{expanded ? (
					<ChevronUp size={16} className="text-text-muted shrink-0" />
				) : (
					<ChevronDown size={16} className="text-text-muted shrink-0" />
				)}
			</button>

			{expanded && (
				<div className="px-4 pb-4 pt-0 border-t border-border">
					<p className="text-sm text-text-secondary mt-3 leading-relaxed">
						{tech.description}
					</p>
					{tech.saving !== "—" && (
						<div className="mt-3 flex items-center gap-2">
							<span className="text-xs text-text-muted">חיסכון:</span>
							<span
								className="text-sm font-bold"
								style={{ color: tech.accentColor }}
							>
								{tech.saving}
							</span>
						</div>
					)}
					{tech.appliedTo.length > 0 && (
						<div className="mt-3">
							<span className="text-xs text-text-muted block mb-2">
								יושם על:
							</span>
							<div className="flex flex-wrap gap-1.5">
								{tech.appliedTo.map((proj) => (
									<span
										key={proj}
										className="text-xs px-2 py-0.5 rounded-full bg-bg-elevated text-text-secondary border border-border"
									>
										{proj}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

// ── Section: Optimization Techniques ─────────────────────────────────────────

function OptimizationSection() {
	return (
		<section aria-labelledby="optimization-heading">
			<h2
				id="optimization-heading"
				className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"
			>
				<span
					className="flex size-7 items-center justify-center rounded-lg"
					style={{
						background: "oklch(0.72 0.19 155 / 0.15)",
						color: "var(--color-accent-green)",
					}}
					aria-hidden="true"
				>
					<TrendingDown size={15} />
				</span>
				טכניקות אופטימיזציה מוכחות
			</h2>
			<div className="space-y-2">
				{OPTIMIZATION_TECHNIQUES.map((tech) => (
					<OptimizationCard key={tech.id} tech={tech} />
				))}
			</div>
		</section>
	);
}

// ── Section: bundle-check.yml ─────────────────────────────────────────────────

function BundleCiSection() {
	const steps = [
		{
			num: 1,
			title: "מופעל אוטומטית",
			desc: "כל PR ו-push ל-main",
			color: "var(--color-accent-blue)",
		},
		{
			num: 2,
			title: "Build",
			desc: "pnpm run build",
			color: "var(--color-accent-purple)",
		},
		{
			num: 3,
			title: "מדידה",
			desc: "find dist/assets *.js | du -k | sum",
			color: "var(--color-accent-cyan)",
		},
		{
			num: 4,
			title: "השוואה לסף",
			desc: "נכשל אם סך JS עולה על ה-limit",
			color: "var(--color-accent-amber)",
		},
	];

	const warnings: { ok: boolean; text: string }[] = [
		{
			ok: false,
			text: "Vite: dist/assets/ (לא dist/js/ — זה ריק תמיד!)",
		},
		{
			ok: false,
			text: "Next.js: .next/static/chunks/ (לא dist/)",
		},
		{
			ok: false,
			text: "Turbopack: 109KB polyfill floor — לא ניתן להסרה, חשב בסף",
		},
		{
			ok: true,
			text: "runs-on: [self-hosted, linux, x64, Lenovo] — NEVER ubuntu-latest",
		},
		{
			ok: true,
			text: "cancel-in-progress: true — מבטל ריצות ישנות",
		},
	];

	return (
		<section aria-labelledby="ci-heading">
			<h2
				id="ci-heading"
				className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"
			>
				<span
					className="flex size-7 items-center justify-center rounded-lg"
					style={{
						background: "oklch(0.65 0.18 250 / 0.15)",
						color: "var(--color-accent-blue)",
					}}
					aria-hidden="true"
				>
					<GitBranch size={15} />
				</span>
				bundle-check.yml — שומר CI
			</h2>

			{/* Flow steps */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
				{steps.map((step) => (
					<div key={step.num} className="glass-card p-3 text-center">
						<div
							className="mx-auto mb-2 size-8 flex items-center justify-center rounded-full text-sm font-bold"
							style={{
								background: `oklch(from ${step.color} l c h / 0.15)`,
								color: step.color,
							}}
						>
							{step.num}
						</div>
						<div className="text-sm font-semibold text-text-primary mb-0.5">
							{step.title}
						</div>
						<div className="text-xs text-text-muted leading-tight">
							{step.desc}
						</div>
					</div>
				))}
			</div>

			{/* Warnings & Rules */}
			<div className="glass-card p-4 mb-4 space-y-2">
				<div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
					חשוב לזכור
				</div>
				{warnings.map((w) => (
					<div
						key={w.text?.slice(0, 20) ?? String(Math.random())}
						className="flex items-start gap-2 text-sm"
					>
						{w.ok ? (
							<CheckCircle2
								size={14}
								className="text-accent-green shrink-0 mt-0.5"
							/>
						) : (
							<AlertTriangle
								size={14}
								className="text-accent-amber shrink-0 mt-0.5"
							/>
						)}
						<span className="text-text-secondary">{w.text}</span>
					</div>
				))}
			</div>

			{/* YAML — Vite */}
			<div className="glass-card overflow-hidden mb-3">
				<div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-elevated/50">
					<div className="flex items-center gap-2">
						<FileCode2 size={14} className="text-accent-blue" />
						<span className="text-xs font-semibold text-text-secondary">
							Vite + React
						</span>
					</div>
					<span className="text-xs text-text-muted font-mono">
						bundle-check.yml
					</span>
				</div>
				<pre
					className="text-xs text-text-secondary p-4 overflow-x-auto leading-relaxed font-mono whitespace-pre"
					dir="ltr"
				>
					{YAML_VITE}
				</pre>
			</div>

			{/* YAML — Next.js */}
			<div className="glass-card overflow-hidden">
				<div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-elevated/50">
					<div className="flex items-center gap-2">
						<FileCode2 size={14} className="text-accent-purple" />
						<span className="text-xs font-semibold text-text-secondary">
							Next.js — step override
						</span>
					</div>
					<span className="text-xs text-text-muted font-mono">
						bundle-check.yml
					</span>
				</div>
				<pre
					className="text-xs text-text-secondary p-4 overflow-x-auto leading-relaxed font-mono whitespace-pre"
					dir="ltr"
				>
					{YAML_NEXTJS}
				</pre>
			</div>
		</section>
	);
}

// ── Section: Tools ────────────────────────────────────────────────────────────

function ToolsSection() {
	const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

	const handleCopy = (cmd: string, idx: number) => {
		void navigator.clipboard.writeText(cmd).then(() => {
			setCopiedIdx(idx);
			setTimeout(() => setCopiedIdx(null), 2000);
		});
	};

	return (
		<section aria-labelledby="tools-heading">
			<h2
				id="tools-heading"
				className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"
			>
				<span
					className="flex size-7 items-center justify-center rounded-lg"
					style={{
						background: "oklch(0.62 0.2 290 / 0.15)",
						color: "var(--color-accent-purple)",
					}}
					aria-hidden="true"
				>
					<Terminal size={15} />
				</span>
				כלים
			</h2>
			<div className="space-y-3">
				{TOOLS.map((tool, toolIdx) => (
					<div key={tool.command} className="glass-card overflow-hidden">
						<div className="flex items-start gap-3 p-4">
							<span
								className="flex size-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
								style={{
									background: "oklch(0.62 0.2 290 / 0.12)",
									color: "var(--color-accent-purple)",
								}}
								aria-hidden="true"
							>
								{tool.icon}
							</span>
							<div className="flex-1 min-w-0">
								<div className="text-sm text-text-secondary mb-2">
									{tool.description}
								</div>
								<div className="flex items-center gap-2">
									<code
										className="flex-1 text-xs font-mono bg-bg-primary rounded px-2 py-1.5 text-text-primary overflow-x-auto block"
										dir="ltr"
									>
										{tool.command}
									</code>
									<button
										type="button"
										onClick={() => handleCopy(tool.command, toolIdx)}
										aria-label="העתק פקודה"
										className="shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-bg-elevated hover:bg-bg-tertiary text-text-muted hover:text-text-secondary transition-colors duration-150"
									>
										{copiedIdx === toolIdx ? (
											<CheckCircle2 size={14} className="text-accent-green" />
										) : (
											<FileCode2 size={14} />
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

// ── Page Root ─────────────────────────────────────────────────────────────────

export function BundlePage() {
	return (
		<div className="space-y-8 pb-8">
			{/* Page Header */}
			<div>
				<div className="flex items-center gap-3 mb-1">
					<div
						className="flex size-10 items-center justify-center rounded-xl shrink-0"
						style={{
							background: "oklch(0.65 0.18 250 / 0.15)",
							color: "var(--color-accent-blue)",
						}}
						aria-hidden="true"
					>
						<Package size={22} />
					</div>
					<h1 className="text-2xl font-bold text-text-primary">גודל חבילות</h1>
				</div>
				<p className="text-sm text-text-muted mt-1 ms-[52px]">
					ניטור באנדל, סטטוס CI guard, וטכניקות אופטימיזציה מוכחות
				</p>
			</div>

			{/* Section 1: Summary */}
			<SummarySection />

			{/* Section 2: Per-Project */}
			<ProjectBundleSection />

			{/* Section 3: Optimization */}
			<OptimizationSection />

			{/* Section 4: CI Guard */}
			<BundleCiSection />

			{/* Section 5: Tools */}
			<ToolsSection />
		</div>
	);
}
