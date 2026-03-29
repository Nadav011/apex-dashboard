// type-ok
// rtl-ok — ECharts grid.left/right are canvas px coordinates, not CSS directional properties
import ReactECharts from "echarts-for-react";
import {
	AlertTriangle,
	Bot,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Code2,
	Cpu,
	FlaskConical,
	Globe,
	Layers,
	Monitor,
	Package,
	Play,
	Shield,
	Shuffle,
	Terminal,
	TestTube2,
	Wrench,
	XCircle,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/cn";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AccordionSectionProps {
	id: string;
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	accentColor?: string;
}

// ── Accordion ─────────────────────────────────────────────────────────────────

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
				open && "border-border-hover",
			)}
		>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				aria-expanded={open}
				className={cn(
					"w-full flex items-center gap-3 px-5 py-4 min-h-[64px]",
					"text-start cursor-pointer hover:bg-bg-tertiary",
					"transition-colors duration-150",
				)}
			>
				<span
					className="flex size-10 shrink-0 items-center justify-center rounded-xl"
					style={{
						background: `oklch(from ${accentColor} l c h / 0.15)`,
						color: accentColor,
					}}
					aria-hidden="true"
				>
					{icon}
				</span>
				<div className="flex-1 min-w-0">
					<div className="text-sm font-semibold text-text-primary leading-tight">
						{title}
					</div>
					<div className="text-xs text-text-muted mt-0.5 leading-tight">
						{subtitle}
					</div>
				</div>
				{open ? (
					<ChevronUp
						size={16}
						className="text-text-muted shrink-0"
						aria-hidden="true"
					/>
				) : (
					<ChevronDown
						size={16}
						className="text-text-muted shrink-0"
						aria-hidden="true"
					/>
				)}
			</button>
			{open && (
				<div className="px-5 pb-5 border-t border-border">{children}</div>
			)}
		</div>
	);
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
	label: string;
	value: string;
	sub?: string;
	color: string;
	icon: React.ReactNode;
}

function StatCard({ label, value, sub, color, icon }: StatCardProps) {
	return (
		<div
			className="glass-card card-spotlight p-4 flex flex-col gap-2 hover:border-border-hover transition-colors duration-200"
			style={{ borderColor: `oklch(from ${color} l c h / 0.3)` }}
		>
			<div className="flex items-center justify-between">
				<span className="text-xs text-text-muted font-medium">{label}</span>
				<span
					className="flex size-8 items-center justify-center rounded-lg"
					style={{ background: `oklch(from ${color} l c h / 0.12)`, color }}
					aria-hidden="true"
				>
					{icon}
				</span>
			</div>
			<div
				className="text-2xl font-bold tabular-nums"
				style={{ color }}
				dir="ltr"
			>
				{value}
			</div>
			{sub && <div className="text-xs text-text-muted">{sub}</div>}
		</div>
	);
}

// ── Tool Card ─────────────────────────────────────────────────────────────────

interface ToolCardProps {
	name: string;
	version?: string;
	description: string;
	details: string[];
	color: string;
	icon: React.ReactNode;
	badge?: string;
}

function ToolCard({
	name,
	version,
	description,
	details,
	color,
	icon,
	badge,
}: ToolCardProps) {
	return (
		<div
			className={cn(
				"glass-card card-spotlight p-4 flex flex-col gap-3",
				"hover:border-border-hover transition-colors duration-200",
			)}
		>
			<div className="flex items-start gap-3">
				<span
					className="flex size-10 shrink-0 items-center justify-center rounded-xl mt-0.5"
					style={{ background: `oklch(from ${color} l c h / 0.12)`, color }}
					aria-hidden="true"
				>
					{icon}
				</span>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="text-sm font-bold text-text-primary">{name}</span>
						{version && (
							<code
								className="text-[10px] px-1.5 py-0.5 rounded font-mono"
								style={{
									background: `oklch(from ${color} l c h / 0.12)`,
									color,
								}}
								dir="ltr"
							>
								{version}
							</code>
						)}
						{badge && (
							<span
								className="text-[10px] px-1.5 py-0.5 rounded font-medium"
								style={{
									background: "oklch(0.72 0.19 155 / 0.12)",
									color: "var(--color-accent-green)",
								}}
							>
								{badge}
							</span>
						)}
					</div>
					<p className="text-xs text-text-muted mt-0.5 leading-relaxed">
						{description}
					</p>
				</div>
			</div>
			<ul className="flex flex-col gap-1.5">
				{details.map((d) => (
					<li key={d} className="flex items-start gap-2 text-xs">
						<CheckCircle2
							size={12}
							className="shrink-0 mt-0.5"
							style={{ color }}
							aria-hidden="true"
						/>
						<span className="text-text-secondary">{d}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

// ── 3-Tier Diagram ────────────────────────────────────────────────────────────

interface TierRowProps {
	tier: string;
	label: string;
	when: string;
	gates: string[];
	color: string;
	width: string;
}

function TierRow({ tier, label, when, gates, color, width }: TierRowProps) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-3">
				<span
					className="text-xs font-bold px-2 py-1 rounded shrink-0"
					style={{ background: `oklch(from ${color} l c h / 0.15)`, color }}
				>
					{tier}
				</span>
				<span className="text-sm font-semibold text-text-primary">{label}</span>
				<span className="text-xs text-text-muted truncate">— {when}</span>
			</div>
			<div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-700"
					style={{ width, background: color }}
				/>
			</div>
			<div className="flex flex-wrap gap-1.5">
				{gates.map((g) => (
					<span
						key={g}
						className="text-[10px] font-mono px-2 py-0.5 rounded border"
						style={{
							borderColor: `oklch(from ${color} l c h / 0.3)`,
							color,
							background: `oklch(from ${color} l c h / 0.08)`,
						}}
					>
						{g}
					</span>
				))}
			</div>
		</div>
	);
}

// ── Project Table Data ────────────────────────────────────────────────────────

interface ProjectRow {
	name: string;
	framework: string;
	tests: string;
	passCount: number;
	failCount: number;
	coverage: number;
	machine: string;
}

const PROJECT_DATA: ProjectRow[] = [
	{
		name: "Mexicani",
		framework: "Vitest 4",
		tests: "2,100+",
		passCount: 2100,
		failCount: 0,
		coverage: 80,
		machine: "Lenovo",
	},
	{
		name: "Cash / Z",
		framework: "Vitest 4",
		tests: "1,500+",
		passCount: 1500,
		failCount: 0,
		coverage: 75,
		machine: "MSI",
	},
	{
		name: "Shifts",
		framework: "Vitest 4",
		tests: "800+",
		passCount: 800,
		failCount: 0,
		coverage: 70,
		machine: "MSI",
	},
	{
		name: "SportChat",
		framework: "very_good",
		tests: "500+",
		passCount: 500,
		failCount: 0,
		coverage: 60,
		machine: "MSI",
	},
	{
		name: "Brain",
		framework: "Vitest 4",
		tests: "450+",
		passCount: 450,
		failCount: 0,
		coverage: 65,
		machine: "MSI",
	},
	{
		name: "Nadavai",
		framework: "Vitest 4",
		tests: "380+",
		passCount: 380,
		failCount: 0,
		coverage: 62,
		machine: "Lenovo",
	},
	{
		name: "Mediflow",
		framework: "Vitest 4",
		tests: "320+",
		passCount: 302,
		failCount: 18,
		coverage: 55,
		machine: "Lenovo",
	},
	{
		name: "Hatumdigital",
		framework: "Vitest 4",
		tests: "280+",
		passCount: 280,
		failCount: 0,
		coverage: 58,
		machine: "MSI",
	},
	{
		name: "Signature Pro",
		framework: "Vitest 4",
		tests: "210+",
		passCount: 210,
		failCount: 0,
		coverage: 72,
		machine: "Lenovo",
	},
	{
		name: "Vibechat",
		framework: "Vitest 4",
		tests: "195+",
		passCount: 195,
		failCount: 0,
		coverage: 60,
		machine: "MSI",
	},
	{
		name: "Chance Pro",
		framework: "pytest",
		tests: "165+",
		passCount: 165,
		failCount: 0,
		coverage: 68,
		machine: "Lenovo",
	},
];

// ── ECharts Coverage Bar Chart ────────────────────────────────────────────────

function CoverageChart() {
	const option = {
		backgroundColor: "transparent",
		grid: {
			top: 8,
			bottom: 70,
			containLabel: true,
		},
		tooltip: {
			trigger: "axis",
			backgroundColor: "oklch(0.19 0.015 260)",
			borderColor: "var(--color-border)",
			textStyle: { color: "var(--color-text-primary)", fontSize: 12 },
			formatter: (params: unknown[]) => {
				const p = (params as { name: string; value: number }[])[0];
				return `${p.name}: ${p.value}%`;
			},
		},
		xAxis: {
			type: "category",
			data: PROJECT_DATA.map((p) => p.name),
			axisLabel: {
				color: "var(--color-text-muted)",
				fontSize: 10,
				rotate: 35,
				interval: 0,
			},
			axisLine: { lineStyle: { color: "var(--color-border)" } },
			axisTick: { show: false },
		},
		yAxis: {
			type: "value",
			min: 0,
			max: 100,
			axisLabel: {
				color: "var(--color-text-muted)",
				fontSize: 10,
				formatter: "{value}%",
			},
			splitLine: {
				lineStyle: { color: "var(--color-bg-elevated)", type: "dashed" },
			},
		},
		series: [
			{
				type: "bar",
				data: PROJECT_DATA.map((p) => ({
					value: p.coverage,
					itemStyle: {
						color:
							p.coverage >= 75
								? "var(--color-accent-green)"
								: p.coverage >= 60
									? "var(--color-accent-amber)"
									: "var(--color-accent-red)",
						borderRadius: [4, 4, 0, 0],
					},
				})),
				barMaxWidth: 36,
				emphasis: {
					itemStyle: {
						shadowBlur: 8,
						shadowColor: "oklch(0.62 0.18 290 / 0.4)",
					},
				},
				markLine: {
					silent: true,
					data: [{ yAxis: 70 }],
					lineStyle: {
						color: "oklch(0.65 0.18 250 / 0.6)",
						type: "dashed",
						width: 1,
					},
					label: {
						formatter: "70% target",
						color: "var(--color-accent-blue)",
						fontSize: 10,
					},
				},
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: 220 }}
			opts={{ renderer: "canvas" }}
		/>
	);
}

// ── Pass/Fail Donut ───────────────────────────────────────────────────────────

function PassFailDonut() {
	const option = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			backgroundColor: "oklch(0.19 0.015 260)",
			borderColor: "var(--color-border)",
			textStyle: { color: "var(--color-text-primary)", fontSize: 12 },
		},
		series: [
			{
				type: "pie",
				radius: ["50%", "80%"],
				data: [
					{
						value: 8253,
						name: "עוברות",
						itemStyle: { color: "var(--color-accent-green)" },
					},
					{
						value: 18,
						name: "נכשלות",
						itemStyle: { color: "var(--color-accent-red)" },
					},
				],
				label: { show: false },
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "oklch(0.72 0.19 155 / 0.3)",
					},
				},
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: 160 }}
			opts={{ renderer: "canvas" }}
		/>
	);
}

// ── BUG-R Card ────────────────────────────────────────────────────────────────

interface BugRCardProps {
	id: string;
	title: string;
	description: string;
	example: string;
	color: string;
}

function BugRCard({ id, title, description, example, color }: BugRCardProps) {
	return (
		<div
			className="glass-card card-spotlight p-4 flex flex-col gap-3 hover:border-border-hover transition-colors duration-200"
			style={{ borderColor: `oklch(from ${color} l c h / 0.25)` }}
		>
			<div className="flex items-center gap-2">
				<span
					className="text-xs font-bold font-mono px-2 py-1 rounded"
					style={{ background: `oklch(from ${color} l c h / 0.15)`, color }}
				>
					{id}
				</span>
				<span className="text-sm font-semibold text-text-primary">{title}</span>
			</div>
			<p className="text-xs text-text-secondary leading-relaxed">
				{description}
			</p>
			<pre
				className="text-[10px] font-mono rounded-lg p-3 overflow-x-auto leading-relaxed"
				style={{
					background: "oklch(0.12 0.01 260)",
					color: "oklch(0.82 0.08 155)",
					border: "1px solid oklch(0.28 0.02 260)",
				}}
				dir="ltr"
			>
				{example}
			</pre>
		</div>
	);
}

// ── Command Block ─────────────────────────────────────────────────────────────

interface CmdBlockProps {
	label: string;
	commands: { desc: string; cmd: string }[];
	color: string;
}

function CmdBlock({ label, commands, color }: CmdBlockProps) {
	return (
		<div className="flex flex-col gap-2">
			<div
				className="text-xs font-bold px-2 py-0.5 rounded-full self-start"
				style={{ background: `oklch(from ${color} l c h / 0.12)`, color }}
			>
				{label}
			</div>
			<div className="flex flex-col gap-1.5">
				{commands.map(({ desc, cmd }) => (
					<div
						key={cmd}
						className="flex flex-col gap-0.5 rounded-lg p-3"
						style={{
							background: "oklch(0.14 0.01 260)",
							border: "1px solid oklch(0.26 0.02 260)",
						}}
					>
						<span className="text-[10px] text-text-muted">{desc}</span>
						<code className="text-xs font-mono text-accent-green" dir="ltr">
							{cmd}
						</code>
					</div>
				))}
			</div>
		</div>
	);
}

// ── Vitest Pattern Card ───────────────────────────────────────────────────────

interface VitestPatternProps {
	title: string;
	description: string;
	good: string;
	bad?: string;
	color: string;
}

function VitestPattern({
	title,
	description,
	good,
	bad,
	color,
}: VitestPatternProps) {
	return (
		<div className="glass-card p-4 flex flex-col gap-3 hover:border-border-hover transition-colors duration-200">
			<div className="flex items-center gap-2">
				<Code2 size={14} style={{ color }} aria-hidden="true" />
				<span className="text-sm font-semibold text-text-primary">{title}</span>
			</div>
			<p className="text-xs text-text-secondary leading-relaxed">
				{description}
			</p>
			{bad && (
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5 text-[10px] text-accent-red font-medium">
						<XCircle size={10} aria-hidden="true" />
						שגוי
					</div>
					<pre
						className="text-[10px] font-mono rounded-lg p-3 overflow-x-auto"
						style={{
							background: "oklch(0.62 0.22 25 / 0.08)",
							color: "var(--color-accent-red)",
							border: "1px solid oklch(0.62 0.22 25 / 0.2)",
						}}
						dir="ltr"
					>
						{bad}
					</pre>
				</div>
			)}
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-1.5 text-[10px] text-accent-green font-medium">
					<CheckCircle2 size={10} aria-hidden="true" />
					נכון
				</div>
				<pre
					className="text-[10px] font-mono rounded-lg p-3 overflow-x-auto"
					style={{
						background: "oklch(0.72 0.19 155 / 0.08)",
						color: "var(--color-accent-green)",
						border: "1px solid oklch(0.72 0.19 155 / 0.2)",
					}}
					dir="ltr"
				>
					{good}
				</pre>
			</div>
		</div>
	);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function TestingPage() {
	return (
		<div className="flex flex-col gap-6 pb-8">
			<PageHeader
				icon={TestTube2}
				title="בדיקות"
				description="אסטרטגיית בדיקות — Unit, E2E, Coverage, Mutation"
			/>
			{/* ── Header ─────────────────────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<span
					className="flex size-11 items-center justify-center rounded-2xl shrink-0"
					style={{
						background: "oklch(0.62 0.18 290 / 0.15)",
						color: "var(--color-cat-testing)",
					}}
					aria-hidden="true"
				>
					<TestTube2 size={22} />
				</span>
			</div>

			<Tabs
				tabs={[
					{ id: "stats", label: "סטטיסטיקות" },
					{ id: "projects", label: "פרויקטים" },
					{ id: "frameworks", label: "כלים" },
					{ id: "coverage", label: "כיסוי" },
				]}
			>
				{(activeTab) => (
					<div className="flex flex-col gap-6">
						{/* ── Section 1: סיכום כללי ──────────────────────────────────────── */}
						{activeTab === "stats" && (
							<AccordionSection
								id="summary"
								title="סיכום כללי"
								subtitle="מצב בדיקות ב-11 פרויקטים"
								icon={<Layers size={20} />}
								defaultOpen
								accentColor="var(--color-cat-testing)"
							>
								<div className="pt-4 flex flex-col gap-5">
									<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 stagger-grid">
										<StatCard
											label="בדיקות עוברות"
											value="8,253"
											sub="מתוך 8,271 סה״כ"
											color="var(--color-accent-green)"
											icon={<CheckCircle2 size={16} />}
										/>
										<StatCard
											label="בדיקות נכשלות"
											value="18"
											sub="Mediflow בלבד"
											color="var(--color-accent-red)"
											icon={<XCircle size={16} />}
										/>
										<StatCard
											label="פרויקטים"
											value="11"
											sub="Lenovo + MSI"
											color="var(--color-accent-blue)"
											icon={<Package size={16} />}
										/>
										<StatCard
											label="מסגרות בדיקה"
											value="4"
											sub="Vitest, very_good, pytest, Playwright"
											color="var(--color-accent-purple)"
											icon={<Wrench size={16} />}
										/>
									</div>

									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 stagger-grid">
										<div className="glass-card p-4">
											<div className="text-xs font-semibold text-text-muted mb-1">
												עובר / נכשל
											</div>
											<PassFailDonut />
											<div className="flex items-center justify-center gap-4 mt-2 text-xs">
												<div className="flex items-center gap-1.5">
													<span className="size-2 rounded-full bg-accent-green" />
													<span className="text-text-secondary">
														8,253 עוברות
													</span>
												</div>
												<div className="flex items-center gap-1.5">
													<span className="size-2 rounded-full bg-accent-red" />
													<span className="text-text-secondary">18 נכשלות</span>
												</div>
											</div>
										</div>

										<div className="glass-card p-4">
											<div className="text-xs font-semibold text-text-muted mb-2">
												מסגרות בשימוש
											</div>
											<div className="flex flex-col gap-2.5">
												{[
													{
														name: "Vitest 4",
														count: 9,
														color: "var(--color-accent-amber)",
													},
													{
														name: "very_good (Flutter)",
														count: 1,
														color: "oklch(0.62 0.18 290)",
													},
													{
														name: "pytest",
														count: 1,
														color: "var(--color-accent-blue)",
													},
													{
														name: "Playwright E2E",
														count: 5,
														color: "var(--color-accent-green)",
													},
												].map(({ name, count, color }) => (
													<div key={name} className="flex items-center gap-3">
														<span
															className="text-xs font-medium w-36 shrink-0"
															style={{ color }}
														>
															{name}
														</span>
														<div className="flex-1 h-2 rounded-full bg-bg-tertiary overflow-hidden">
															<div
																className="h-full rounded-full"
																style={{
																	width: `${(count / 11) * 100}%`,
																	background: color,
																}}
															/>
														</div>
														<span
															className="text-xs text-text-muted w-6 text-start"
															dir="ltr"
														>
															{count}
														</span>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</AccordionSection>
						)}

						{/* ── Section 2: כלי בדיקה ──────────────────────────────────────── */}
						{activeTab === "frameworks" && (
							<AccordionSection
								id="tools"
								title="כלי בדיקה"
								subtitle="6 כלים — unit, E2E, mutation, property, mocking, visual"
								icon={<Wrench size={20} />}
								defaultOpen
								accentColor="var(--color-accent-amber)"
							>
								<div className="pt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
									<ToolCard
										name="Vitest"
										version="4.0.18"
										description="Unit + integration tests. Pool: forks (NOT threads). CI: --maxWorkers=2."
										details={[
											"pool: 'forks' — שינוי בוטל-עתידיות ב-Vitest 4",
											"maxWorkers: N ברמה עליונה (לא ב-poolOptions)",
											"vi.mock + vi.hoisted() לניהול mock variables",
											"3-trap Proxy ל-lucide-react",
											"coverage: v8 — @vitest/coverage-v8",
										]}
										color="var(--color-accent-amber)"
										icon={<Zap size={18} />}
										badge="עיקרי"
									/>
									<ToolCard
										name="Playwright"
										version="1.58.2"
										description="E2E browser tests. Cross-browser. 5 פרויקטים. getByRole/getByTestId בלבד."
										details={[
											"getByRole / getByTestId — לא _react/_vue selectors (הוסרו)",
											"Chromium + Firefox + WebKit + Mobile Chrome",
											'--project="${{ matrix.browser }}" עם quotes (spaces)',
											"BrowserStack integration לבדיקות על 30,000+ מכשירים",
											"Percy לבדיקות visual regression",
										]}
										color="var(--color-accent-green)"
										icon={<Globe size={18} />}
									/>
									<ToolCard
										name="Stryker"
										description="Mutation testing ל-TypeScript. מוודא שהבדיקות אכן בודקות את הקוד."
										details={[
											"מחליף פעולות בקוד ומוודא שבדיקות נכשלות",
											"Mutation Score Index — יעד: >70%",
											"prerequisite-check.sh — מחייב 3+ קבצי בדיקה",
											"מריץ רק על FEATURE tier (לא SMALL/MEDIUM)",
											"fast-check משלים — property-based testing",
										]}
										color="var(--color-accent-red)"
										icon={<Shuffle size={18} />}
									/>
									<ToolCard
										name="fast-check"
										description="Property-based testing. מייצר inputs אקראיים אוטומטית לאיתור edge cases."
										details={[
											"מגדיר properties (invariants) — לא ערכים ספציפיים",
											"shrinking אוטומטי למינימום failing case",
											"משולב עם Vitest: fc.test() / fc.property()",
											"יעיל במיוחד לפונקציות מתמטיות ו-parsers",
											"Chance Pro: Monte Carlo + property checks",
										]}
										color="var(--color-accent-cyan)"
										icon={<FlaskConical size={18} />}
									/>
									<ToolCard
										name="MSW"
										version="2.12.10"
										description="API mocking. מיירט fetch/XHR בבדיקות בלי לשנות את קוד המוצר."
										details={[
											"setupServer() ל-Node.js / setupWorker() ל-browser",
											"http.get/post handlers — type-safe עם Zod",
											"onUnhandledRequest: 'error' — מונע שכחת mocks",
											"מחליף axios-mock-adapter / nock / jest.mock(fetch)",
											"מתממשק עם TanStack Query tests",
										]}
										color="oklch(0.62 0.18 290)"
										icon={<Bot size={18} />}
									/>
									<ToolCard
										name="BrowserStack"
										description="30,000+ מכשירים אמיתיים. Percy visual regression. בדיקות על iOS Safari, Android, etc."
										details={[
											"Percy: screenshot + diff אוטומטי על כל PR",
											"AccessibilityExpert: WCAG 2.2 AA scanning",
											"Automate: Playwright + Selenium על real devices",
											"App Live: בדיקות Flutter APK/IPA ידנית",
											"MCP: mcp__browserstack__ tools ישירות מ-Claude",
										]}
										color="var(--color-accent-blue)"
										icon={<Monitor size={18} />}
									/>
								</div>
							</AccordionSection>
						)}

						{/* ── Section 3: 3-Tier Verification ────────────────────────────── */}
						{activeTab === "coverage" && (
							<AccordionSection
								id="tiers"
								title="3-Tier Verification"
								subtitle="SMALL → MEDIUM → FEATURE — התאמת מאמץ לסקופ"
								icon={<Layers size={20} />}
								defaultOpen
								accentColor="var(--color-accent-blue)"
							>
								<div className="pt-4 flex flex-col gap-6">
									<div className="grid grid-cols-1 gap-4">
										<TierRow
											tier="SMALL"
											label="קובץ בודד"
											when="typo, config, תיקון חד-שורתי"
											gates={["typecheck"]}
											color="var(--color-accent-green)"
											width="20%"
										/>
										<TierRow
											tier="MEDIUM"
											label="קומפוננטה / hook / endpoint"
											when="refactor, תיקון קטן"
											gates={["typecheck", "lint"]}
											color="var(--color-accent-amber)"
											width="45%"
										/>
										<TierRow
											tier="FEATURE"
											label="פיצ'ר שלם / PR"
											when="multi-file, production-ready"
											gates={[
												"typecheck",
												"lint",
												"test",
												"trivy",
												"type-coverage ≥90%",
												"code-reviewer",
												"adversarial-review",
												"reality-checker",
											]}
											color="var(--color-cat-testing)"
											width="100%"
										/>
										<TierRow
											tier="SECURITY"
											label="Auth / RLS / Payments"
											when="security-sensitive code"
											gates={[
												"typecheck",
												"lint",
												"test",
												"trivy",
												"semgrep",
												"manual RLS audit",
												"code-reviewer",
											]}
											color="var(--color-accent-red)"
											width="100%"
										/>
									</div>

									{/* Feature auto-chain */}
									<div
										className="rounded-xl p-4 border"
										style={{
											background: "oklch(0.62 0.18 290 / 0.06)",
											borderColor: "oklch(0.62 0.18 290 / 0.25)",
										}}
									>
										<div className="text-xs font-bold text-cat-testing mb-3 flex items-center gap-2">
											<Zap size={12} aria-hidden="true" />
											FEATURE tier auto-chain
										</div>
										<div className="flex items-center gap-2 flex-wrap text-xs">
											{[
												"code-reviewer (Opus L10+)",
												"→",
												"/adversarial-review",
												"→",
												"reality-checker",
												"→",
												"/edge-case-hunter",
											].map((step, i) => (
												<span
													// biome-ignore lint/suspicious/noArrayIndexKey: separator arrows are not uniquely identifiable
													key={i}
													className={cn(
														step === "→"
															? "text-text-muted"
															: "font-mono px-2 py-0.5 rounded text-cat-testing",
													)}
													style={
														step !== "→"
															? { background: "oklch(0.62 0.18 290 / 0.12)" }
															: undefined
													}
												>
													{step}
												</span>
											))}
										</div>
									</div>

									{/* Never claim done */}
									<div
										className="rounded-xl p-4 border"
										style={{
											background: "oklch(0.62 0.22 25 / 0.06)",
											borderColor: "oklch(0.62 0.22 25 / 0.25)",
										}}
									>
										<div className="text-xs font-bold text-accent-red mb-3 flex items-center gap-2">
											<AlertTriangle size={12} aria-hidden="true" />
											NEVER claim "done" on FEATURE without:
										</div>
										<div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
											{[
												"code-reviewer approved",
												"typecheck + lint passed (show output)",
												"trivy zero HIGH/CRITICAL",
												"type-coverage ≥90%",
												"re-read original request",
												"no TODOs/בדיקת לוגים/`any`",
											].map((item) => (
												<div
													key={item}
													className="flex items-center gap-2 text-xs"
												>
													<XCircle
														size={11}
														className="text-accent-red shrink-0"
														aria-hidden="true"
													/>
													<span className="text-text-secondary">{item}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</AccordionSection>
						)}

						{/* ── Section 4: Per-Project Test Status ────────────────────────── */}
						{activeTab === "projects" && (
							<AccordionSection
								id="projects"
								title="סטטוס בדיקות לפי פרויקט"
								subtitle="11 פרויקטים — עובר/נכשל, כיסוי, מסגרת"
								icon={<Package size={20} />}
								defaultOpen
								accentColor="var(--color-accent-purple)"
							>
								<div className="pt-4 flex flex-col gap-5">
									{/* Coverage chart */}
									<div className="glass-card card-spotlight p-3">
										<div className="text-xs font-semibold text-text-muted mb-1 px-1">
											כיסוי קוד לפי פרויקט
										</div>
										<CoverageChart />
										<div className="flex items-center gap-3 justify-center mt-1 text-[10px] text-text-muted">
											<span className="flex items-center gap-1">
												<span className="size-2 rounded-sm bg-accent-green" />
												≥75%
											</span>
											<span className="flex items-center gap-1">
												<span className="size-2 rounded-sm bg-accent-amber" />
												60–74%
											</span>
											<span className="flex items-center gap-1">
												<span className="size-2 rounded-sm bg-accent-red" />
												{"<60%"}
											</span>
											<span className="flex items-center gap-1">
												<span
													className="size-2 rounded-sm"
													style={{ background: "oklch(0.65 0.18 250 / 0.5)" }}
												/>
												target 70%
											</span>
										</div>
									</div>

									{/* Table */}
									<div className="overflow-x-auto rounded-xl border border-border">
										<table className="w-full text-xs" dir="rtl">
											<thead>
												<tr
													className="text-text-muted"
													style={{ background: "var(--color-bg-tertiary)" }}
												>
													<th className="text-start px-4 py-2.5 font-semibold">
														פרויקט
													</th>
													<th className="text-start px-4 py-2.5 font-semibold">
														מסגרת
													</th>
													<th className="text-start px-4 py-2.5 font-semibold">
														סה״כ בדיקות
													</th>
													<th className="text-center px-4 py-2.5 font-semibold">
														עובר
													</th>
													<th className="text-center px-4 py-2.5 font-semibold">
														נכשל
													</th>
													<th className="text-start px-4 py-2.5 font-semibold">
														כיסוי
													</th>
													<th className="text-start px-4 py-2.5 font-semibold">
														מכונה
													</th>
												</tr>
											</thead>
											<tbody>
												{PROJECT_DATA.map((row, idx) => (
													<tr
														key={row.name}
														className={cn(
															"border-t border-border hover:bg-bg-tertiary transition-colors",
															idx % 2 === 0 &&
																"bg-[oklch(0.155_0.01_260_/_0.5)]",
														)}
													>
														<td className="px-4 py-2.5 font-medium text-text-primary">
															{row.name}
														</td>
														<td className="px-4 py-2.5">
															<code
																className="text-[10px] px-1.5 py-0.5 rounded"
																style={{
																	background: "oklch(0.78 0.16 75 / 0.1)",
																	color: "var(--color-accent-amber)",
																}}
																dir="ltr"
															>
																{row.framework}
															</code>
														</td>
														<td
															className="px-4 py-2.5 text-text-secondary"
															dir="ltr"
														>
															{row.tests}
														</td>
														<td className="px-4 py-2.5 text-center">
															<CheckCircle2
																size={14}
																className="mx-auto text-accent-green"
																aria-label={`${row.passCount} עוברות`}
															/>
														</td>
														<td className="px-4 py-2.5 text-center">
															{row.failCount > 0 ? (
																<span
																	className="inline-flex items-center gap-1 text-accent-red font-bold"
																	dir="ltr"
																>
																	<XCircle size={12} aria-hidden="true" />
																	{row.failCount}
																</span>
															) : (
																<span className="text-text-muted">—</span>
															)}
														</td>
														<td className="px-4 py-2.5">
															<div className="flex items-center gap-2">
																<div className="w-16 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
																	<div
																		className="h-full rounded-full"
																		style={{
																			width: `${row.coverage}%`,
																			background:
																				row.coverage >= 75
																					? "var(--color-accent-green)"
																					: row.coverage >= 60
																						? "var(--color-accent-amber)"
																						: "var(--color-accent-red)",
																		}}
																	/>
																</div>
																<span
																	className="font-mono text-[10px]"
																	style={{
																		color:
																			row.coverage >= 75
																				? "var(--color-accent-green)"
																				: row.coverage >= 60
																					? "var(--color-accent-amber)"
																					: "var(--color-accent-red)",
																	}}
																	dir="ltr"
																>
																	{row.coverage}%
																</span>
															</div>
														</td>
														<td className="px-4 py-2.5">
															<span
																className="text-[10px] px-1.5 py-0.5 rounded font-mono"
																style={{
																	background:
																		row.machine === "Lenovo"
																			? "oklch(0.65 0.18 250 / 0.1)"
																			: "oklch(0.62 0.18 290 / 0.1)",
																	color:
																		row.machine === "Lenovo"
																			? "var(--color-accent-blue)"
																			: "var(--color-cat-testing)",
																}}
															>
																{row.machine}
															</span>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</AccordionSection>
						)}

						{/* ── Section 5: Vitest Config Patterns ─────────────────────────── */}
						{activeTab === "frameworks" && (
							<AccordionSection
								id="vitest-patterns"
								title="תבניות Vitest — דפוסים ידועים"
								subtitle="Breaking changes, mocks, proxies — מה שחייבים לדעת"
								icon={<Zap size={20} />}
								accentColor="var(--color-accent-amber)"
							>
								<div className="pt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 stagger-grid">
									<VitestPattern
										title="maxWorkers ברמה עליונה (Vitest 4 Breaking)"
										description="Vitest 4 ביטל את poolOptions — maxWorkers חייב להיות ברמה עליונה של config. שימוש ב-poolOptions גורם ל-deprecation warnings ול-hangs עם >1 worker."
										bad={`// ❌ Vitest 3 — לא עובד ב-Vitest 4
export default defineConfig({
  test: {
    poolOptions: {
      forks: { maxForks: 2 }
    }
  }
})`}
										good={`// ✅ Vitest 4
export default defineConfig({
  test: {
    pool: "forks",
    maxWorkers: 2, // top-level!
    minWorkers: 1,
  }
})`}
										color="var(--color-accent-amber)"
									/>
									<VitestPattern
										title="vi.mock מ-__tests__/ — extra ../"
										description="כשמשתמשים ב-vi.mock מתוך תיקיית __tests__/, הנתיב הוא יחסי לקובץ הבדיקה ולא ל-root. צריך ../ נוסף."
										bad={`// ❌ מ- src/__tests__/foo.test.ts
vi.mock("@/lib/api") // נכשל`}
										good={`// ✅
vi.mock("../lib/api")
// או explicit:
vi.mock("@/lib/api", () => ({
  fetchData: vi.fn()
}))`}
										color="var(--color-accent-cyan)"
									/>
									<VitestPattern
										title="3-Trap Proxy ל-lucide-react"
										description="lucide-react משתמש ב-ESM default exports שגורמים לשגיאות ב-Vitest. 3-trap Proxy מדמה כל icon כ-React component."
										good={`// vitest.setup.ts
vi.mock("lucide-react", () => ({
  __esModule: true,
  default: new Proxy({}, {
    get: (_t, name) =>
      ({ className }: { className?: string }) =>
        React.createElement("svg", {
          "data-testid": \`icon-\${String(name)}\`,
          className,
          "aria-hidden": true,
        }),
    has: () => true,
    set: () => true,
  }),
}))`}
										color="oklch(0.62 0.18 290)"
									/>
									<VitestPattern
										title="vi.hoisted() לmock variables"
										description="משתנים שמוגדרים ב-vi.mock factory חייבים להיות hoisted לפני ה-import. vi.hoisted() פותר את זה."
										bad={`// ❌ ReferenceError
const mockFn = vi.fn()
vi.mock("@/lib/foo", () => ({
  bar: mockFn // undefined here!
}))`}
										good={`// ✅
const { mockFn } = vi.hoisted(() => ({
  mockFn: vi.fn()
}))

vi.mock("@/lib/foo", () => ({
  bar: mockFn // עכשיו עובד!
}))`}
										color="var(--color-accent-green)"
									/>
								</div>
							</AccordionSection>
						)}

						{/* ── Section 6: AI Blind Spots ──────────────────────────────────── */}
						{activeTab === "coverage" && (
							<AccordionSection
								id="blind-spots"
								title="AI Blind Spots — 4 תבניות Regression"
								subtitle="BUG-R1 עד BUG-R4 — טעויות שגנרציית AI חוזרת עליהן"
								icon={<AlertTriangle size={20} />}
								accentColor="var(--color-accent-red)"
							>
								<div className="pt-4 flex flex-col gap-4">
									<div
										className="rounded-xl p-3 border text-xs text-text-secondary leading-relaxed"
										style={{
											background: "oklch(0.62 0.22 25 / 0.06)",
											borderColor: "oklch(0.62 0.22 25 / 0.2)",
										}}
									>
										<strong className="text-accent-red">חוק:</strong> בדיקות
										Regression FIRST (מכאניות) → אחר כך code review של AI
										(הסתברותי). תן שמות מפורשים BUG-R1/R2/R3/R4 לבדיקות.
									</div>
									<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
										<BugRCard
											id="BUG-R1"
											title="Sandbox/Production Path Mismatch"
											description="AI מתקן נתיב בסביבת sandbox אבל שוכח לתקן את אותו נתיב בסביבת production. שתי הסביבות חייבות תיקון."
											example={`it("fixes path in BOTH envs (BUG-R1)", () => {
  expect(config.sandbox.apiUrl).toBe("/api/v1")
  expect(config.prod.apiUrl).toBe("/api/v1")
  // NOT: sandbox fixed, prod still "/api"
})`}
											color="var(--color-accent-red)"
										/>
										<BugRCard
											id="BUG-R2"
											title="SELECT Clause Omission"
											description="AI מוסיף שדה לtype ולresponse אבל שוכח להוסיף אותו ל-SELECT ב-SQL. הbody מחזיר undefined."
											example={`const REQUIRED_FIELDS = [
  "id", "email", "notification_settings"
]
it("returns all fields (BUG-R2)", async () => {
  for (const f of REQUIRED_FIELDS) {
    expect(json.data).toHaveProperty(f)
  }
})`}
											color="var(--color-accent-amber)"
										/>
										<BugRCard
											id="BUG-R3"
											title="Error State Leakage"
											description="AI מגדיר error state אבל שוכח לנקות את הdata הקודם. המשתמש רואה גם error וגם stale data מהבקשה הקודמת."
											example={`it("clears prev data on error (BUG-R3)", () => {
  store.setState({ data: prevData, error: null })
  store.handleError(new Error("fail"))
  // Must clear data too:
  expect(store.data).toBeNull()
  expect(store.error).toBeTruthy()
})`}
											color="oklch(0.62 0.18 290)"
										/>
										<BugRCard
											id="BUG-R4"
											title="Optimistic Update Without Rollback"
											description="AI מוסיף optimistic update (UI מעדכן מיד) אבל לא מממש rollback כשהbackend נכשל. UI נשאר לא מסונכרן."
											example={`it("rolls back on failure (BUG-R4)", async () => {
  mockApi.update.mockRejectedValue(new Error())
  await store.update(newValue)
  // Must rollback:
  expect(store.value).toBe(originalValue)
  expect(store.error).toBeTruthy()
})`}
											color="var(--color-accent-blue)"
										/>
									</div>
								</div>
							</AccordionSection>
						)}

						{/* ── Section 7: פקודות ──────────────────────────────────────────── */}
						{activeTab === "coverage" && (
							<AccordionSection
								id="commands"
								title="פקודות — Quick Reference"
								subtitle="פקודות בדיקה לפי סוג פרויקט"
								icon={<Terminal size={20} />}
								accentColor="var(--color-accent-green)"
							>
								<div className="pt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
									<CmdBlock
										label="Vitest — פיתוח"
										color="var(--color-accent-amber)"
										commands={[
											{ desc: "הרצה בwatch mode", cmd: "pnpm vitest" },
											{ desc: "הרצה חד פעמית", cmd: "pnpm vitest run" },
											{ desc: "עם כיסוי", cmd: "pnpm vitest run --coverage" },
											{
												desc: "קובץ ספציפי",
												cmd: "pnpm vitest run src/auth.test.ts",
											},
										]}
									/>
									<CmdBlock
										label="Vitest — CI"
										color="var(--color-accent-amber)"
										commands={[
											{
												desc: "CI עם 2 workers",
												cmd: "pnpm vitest run --maxWorkers=2",
											},
											{
												desc: "CI עם reporters",
												cmd: "pnpm vitest run --reporter=verbose",
											},
											{
												desc: "3-Tier FEATURE",
												cmd: "pnpm typecheck && pnpm lint && pnpm test",
											},
											{
												desc: "type coverage",
												cmd: "type-coverage --at-least 90 --detail",
											},
										]}
									/>
									<CmdBlock
										label="Playwright — E2E"
										color="var(--color-accent-green)"
										commands={[
											{ desc: "הרצת כל E2E", cmd: "pnpm playwright test" },
											{
												desc: "browser ספציפי",
												cmd: 'pnpm playwright test --project="chromium"',
											},
											{ desc: "debug mode", cmd: "pnpm playwright test --ui" },
											{ desc: "report", cmd: "pnpm playwright show-report" },
										]}
									/>
									<CmdBlock
										label="Flutter / very_good"
										color="oklch(0.62 0.18 290)"
										commands={[
											{
												desc: "NEVER use flutter test!",
												cmd: "very_good test --coverage --fail-fast",
											},
											{ desc: "פרויקט ספציפי (melos)", cmd: "melos run test" },
											{
												desc: "analyze",
												cmd: "flutter analyze lib --fatal-infos",
											},
											{ desc: "DCM", cmd: "dcm analyze lib" },
										]}
									/>
									<CmdBlock
										label="Security Gates"
										color="var(--color-accent-red)"
										commands={[
											{
												desc: "CVE scan",
												cmd: "trivy fs . --severity HIGH,CRITICAL",
											},
											{
												desc: "OWASP patterns",
												cmd: "semgrep scan . --config=auto",
											},
											{ desc: "supply chain", cmd: "socket npm install <pkg>" },
											{ desc: "secrets", cmd: "gitleaks detect --source=." },
										]}
									/>
									<CmdBlock
										label="pytest"
										color="var(--color-accent-blue)"
										commands={[
											{
												desc: "Chance Pro",
												cmd: "pytest tests/ -v --tb=short",
											},
											{
												desc: "עם coverage",
												cmd: "pytest --cov=src --cov-report=term",
											},
											{
												desc: "property-based",
												cmd: "pytest tests/test_properties.py",
											},
											{
												desc: "fast fail",
												cmd: "pytest tests/ -x --fail-fast",
											},
										]}
									/>
								</div>

								{/* CI debug commands */}
								<div className="mt-4 glass-card card-spotlight p-4">
									<div className="text-xs font-semibold text-text-muted mb-3 flex items-center gap-2">
										<Play size={12} aria-hidden="true" />
										CI Debug — local before push
									</div>
									<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
										{[
											{ desc: "מריץ CI מלא בlocal", cmd: "act push" },
											{ desc: "job ספציפי", cmd: "act -j typecheck" },
											{
												desc: "mutation tests (FEATURE only)",
												cmd: "npx stryker run",
											},
											{ desc: "knip — dead code", cmd: "knip" },
										].map(({ desc, cmd }) => (
											<div
												key={cmd}
												className="flex flex-col gap-0.5 rounded-lg p-2.5"
												style={{
													background: "oklch(0.14 0.01 260)",
													border: "1px solid oklch(0.26 0.02 260)",
												}}
											>
												<span className="text-[10px] text-text-muted">
													{desc}
												</span>
												<code
													className="text-xs font-mono text-accent-green"
													dir="ltr"
												>
													{cmd}
												</code>
											</div>
										))}
									</div>
								</div>

								{/* Key rules */}
								<div
									className="mt-4 rounded-xl p-4 border"
									style={{
										background: "oklch(0.72 0.19 155 / 0.05)",
										borderColor: "oklch(0.72 0.19 155 / 0.2)",
									}}
								>
									<div className="text-xs font-bold text-accent-green mb-3 flex items-center gap-2">
										<Shield size={12} aria-hidden="true" />
										חוקים קריטיים
									</div>
									<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-text-secondary">
										{[
											"NEVER flutter test — תמיד very_good test --coverage --fail-fast",
											"CI failures? act push — לא push נוסף",
											"Vitest pool: forks (לא threads) — בכל הפרויקטים",
											"MSW: onUnhandledRequest: 'error' — אחרת מפספסים mocks",
											"BrowserStack tests — getByRole/getByTestId בלבד",
											"Playwright mobile: quote matrix.browser עם spaces",
										].map((rule) => (
											<div key={rule} className="flex items-start gap-2">
												<Cpu
													size={10}
													className="shrink-0 mt-0.5 text-accent-green"
													aria-hidden="true"
												/>
												<span>{rule}</span>
											</div>
										))}
									</div>
								</div>
							</AccordionSection>
						)}
					</div>
				)}
			</Tabs>
		</div>
	);
}
