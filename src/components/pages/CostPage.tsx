import ReactECharts from "echarts-for-react";
import { DollarSign, RefreshCw, TrendingUp, Wallet } from "lucide-react";
import { useCosts } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

// ── Provider color map (shared with MetricsPage palette) ────────────────────
const PROVIDER_COLORS: Record<string, string> = {
	codex: "oklch(0.65 0.18 250)",
	kimi: "oklch(0.72 0.19 155)",
	gemini: "oklch(0.78 0.16 75)",
	minimax: "oklch(0.62 0.2 290)",
	claude: "oklch(0.75 0.14 200)",
};

function providerColor(name: string): string {
	return PROVIDER_COLORS[name.toLowerCase()] ?? "oklch(0.62 0.05 260)";
}

function fmt(usd: number): string {
	return `$${usd.toFixed(2)}`;
}

// ── KPI card ─────────────────────────────────────────────────────────────────
interface KpiProps {
	label: string;
	value: string;
	sub?: string;
	color: string;
	icon: React.ReactNode;
}

function KpiCard({ label, value, sub, color, icon }: KpiProps) {
	return (
		<div className="glass-card p-5 flex items-start gap-4">
			<div
				className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
				style={{
					backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)`,
				}}
			>
				<span style={{ color }} aria-hidden="true">
					{icon}
				</span>
			</div>
			<div className="min-w-0">
				<div
					className="text-2xl font-bold tabular-nums text-text-primary"
					dir="ltr"
				>
					{value}
				</div>
				<div className="text-xs text-text-muted mt-0.5">{label}</div>
				{sub && <div className="text-xs text-text-secondary mt-1">{sub}</div>}
			</div>
		</div>
	);
}

// ── Budget progress bar ──────────────────────────────────────────────────────
interface BudgetBarProps {
	spent: number;
	budget: number;
}

function BudgetBar({ spent, budget }: BudgetBarProps) {
	const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
	const barColor =
		pct >= 80
			? "oklch(0.62 0.22 25)" // red
			: pct >= 50
				? "oklch(0.78 0.19 80)" // amber
				: "oklch(0.72 0.19 155)"; // green

	return (
		<div className="glass-card p-5">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<Wallet size={15} style={{ color: barColor }} aria-hidden="true" />
					<h2 className="text-sm font-semibold text-text-primary">
						תקציב יומי
					</h2>
				</div>
				<span className="text-xs text-text-muted tabular-nums" dir="ltr">
					{fmt(spent)} / {fmt(budget)}
				</span>
			</div>
			<div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-700 ease-out"
					style={{ width: `${pct}%`, backgroundColor: barColor }}
					role="progressbar"
					aria-valuenow={Math.round(pct)}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-label={`${Math.round(pct)}% מהתקציב נוצל`}
				/>
			</div>
			<div className="flex justify-between mt-1.5 text-xs text-text-muted">
				<span>{Math.round(pct)}% נוצל</span>
				<span dir="ltr">נותר: {fmt(budget - spent)}</span>
			</div>
		</div>
	);
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function CostPage() {
	const { data, isLoading, error } = useCosts();

	if (isLoading || !data) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex items-center gap-3 text-text-muted">
					<RefreshCw size={18} className="animate-spin" />
					<span>טוען עלויות...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 text-center text-[var(--color-accent-red)]">
				שגיאה בטעינת נתוני עלויות
			</div>
		);
	}

	const hasData =
		data.today_usd > 0 ||
		data.week_usd > 0 ||
		Object.keys(data.per_provider).length > 0;

	const providerEntries = Object.entries(data.per_provider);
	const modelEntries = Object.entries(data.per_model);

	// ── ECharts: daily history line ──────────────────────────────────────────
	const historyDates = data.daily_history.map((d) => d.date.slice(5)); // MM-DD
	const historyValues = data.daily_history.map((d) => d.usd);

	const lineChartOption = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis",
			backgroundColor: "oklch(0.22 0.02 260)",
			borderColor: "oklch(0.28 0.02 260)",
			textStyle: { color: "oklch(0.95 0.01 260)", fontSize: 12 },
			formatter: (params: unknown[]) => {
				const p = (params as Array<{ name: string; value: number }>)[0];
				return `${p.name}<br/>$${p.value.toFixed(4)}`;
			},
		},
		// rtl-ok — ECharts grid left/right are abstract chart margins, not CSS inset
		grid: { top: 12, bottom: 8, left: 8, right: 8, containLabel: true }, // rtl-ok
		xAxis: {
			type: "category",
			data: historyDates,
			axisLine: { lineStyle: { color: "oklch(0.28 0.02 260)" } },
			axisLabel: {
				color: "oklch(0.55 0.02 260)",
				fontSize: 10,
				interval: 4,
			},
			axisTick: { show: false },
		},
		yAxis: {
			type: "value",
			axisLine: { show: false },
			splitLine: { lineStyle: { color: "oklch(0.22 0.02 260)" } },
			axisLabel: {
				color: "oklch(0.55 0.02 260)",
				fontSize: 10,
				formatter: (v: number) => `$${v.toFixed(2)}`,
			},
		},
		series: [
			{
				type: "line",
				data: historyValues,
				smooth: true,
				symbol: "none",
				lineStyle: { color: "oklch(0.72 0.19 155)", width: 2 },
				areaStyle: {
					// rtl-ok — ECharts LinearGradient x/y/x2/y2 are unit-square coords, not CSS
					color: {
						type: "linear",
						x: 0,
						y: 0,
						x2: 0,
						y2: 1, // rtl-ok
						colorStops: [
							{ offset: 0, color: "oklch(0.72 0.19 155 / 0.3)" },
							{ offset: 1, color: "oklch(0.72 0.19 155 / 0.02)" },
						],
					},
				},
			},
		],
	};

	// ── ECharts: provider horizontal bar ─────────────────────────────────────
	const provBarOption = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis",
			backgroundColor: "oklch(0.22 0.02 260)",
			borderColor: "oklch(0.28 0.02 260)",
			textStyle: { color: "oklch(0.95 0.01 260)", fontSize: 12 },
			formatter: (params: unknown[]) => {
				const p = (params as Array<{ name: string; value: number }>)[0];
				return `${p.name}<br/>$${p.value.toFixed(4)}`;
			},
		},
		grid: { top: 8, bottom: 8, containLabel: true },
		xAxis: {
			type: "value",
			axisLine: { show: false },
			splitLine: { lineStyle: { color: "oklch(0.22 0.02 260)" } },
			axisLabel: {
				color: "oklch(0.55 0.02 260)",
				fontSize: 10,
				formatter: (v: number) => `$${v.toFixed(2)}`,
			},
		},
		yAxis: {
			type: "category",
			data: providerEntries.map(([name]) => name),
			axisLine: { lineStyle: { color: "oklch(0.28 0.02 260)" } },
			axisLabel: { color: "oklch(0.72 0.02 260)", fontSize: 12 },
			axisTick: { show: false },
		},
		series: [
			{
				type: "bar",
				data: providerEntries.map(([name, usd]) => ({
					value: usd,
					itemStyle: {
						color: providerColor(name),
						borderRadius: [0, 4, 4, 0], // rtl-ok — ECharts bar corner radius
					},
				})),
				barMaxWidth: 28,
			},
		],
	};

	return (
		<div className="space-y-6" dir="rtl">
			{/* Header */}
			<div>
				<div className="flex items-center gap-2">
					<DollarSign
						size={20}
						className="text-accent-green"
						aria-hidden="true"
					/>
					<h1 className="text-xl font-bold text-text-primary">
						עלויות | Costs
					</h1>
				</div>
				<p className="text-sm text-text-muted mt-0.5">
					מעקב הוצאות לפי מודל, ספק ותקציב יומי
				</p>
			</div>

			{/* Empty state */}
			{!hasData && (
				<div className="glass-card p-12 text-center flex flex-col items-center gap-4">
					<DollarSign
						size={40}
						className="text-text-muted"
						aria-hidden="true"
					/>
					<p className="text-sm text-text-muted">
						אין נתוני עלויות עדיין — הוצאות יירשמו לאחר הפעלת סשנים
					</p>
				</div>
			)}

			{/* KPI row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<KpiCard
					label="הוצאה היום"
					value={fmt(data.today_usd)}
					color="oklch(0.65 0.18 250)"
					icon={<DollarSign size={20} />}
				/>
				<KpiCard
					label="הוצאה שבועית"
					value={fmt(data.week_usd)}
					color="oklch(0.78 0.16 75)"
					icon={<TrendingUp size={20} />}
				/>
				<KpiCard
					label="הוצאה חודשית"
					value={fmt(data.month_usd)}
					color="oklch(0.72 0.19 155)"
					icon={<TrendingUp size={20} />}
				/>
				<KpiCard
					label="תקציב נותר"
					value={fmt(data.budget_remaining_usd)}
					sub={`מתוך ${fmt(data.daily_budget_usd)} יומי`}
					color="oklch(0.75 0.14 200)"
					icon={<Wallet size={20} />}
				/>
			</div>

			{/* Budget progress bar */}
			<BudgetBar spent={data.today_usd} budget={data.daily_budget_usd} />

			{/* Provider breakdown */}
			{providerEntries.length > 0 && (
				<div className="glass-card p-5">
					<div className="flex items-center gap-2 mb-4">
						<TrendingUp
							size={15}
							className="text-accent-blue"
							aria-hidden="true"
						/>
						<h2 className="text-sm font-semibold text-text-primary">
							הוצאות לפי ספק
						</h2>
					</div>
					<ReactECharts
						option={provBarOption}
						style={{ height: Math.max(80, providerEntries.length * 40) }}
						opts={{ renderer: "svg" }}
					/>
					{/* Legend */}
					<div className="mt-3 flex flex-wrap gap-3">
						{providerEntries.map(([name, usd]) => (
							<div key={name} className="flex items-center gap-1.5 text-xs">
								<span
									className="w-2 h-2 rounded-full shrink-0"
									style={{ backgroundColor: providerColor(name) }}
									aria-hidden="true"
								/>
								<span className="text-text-secondary">{name}</span>
								<span className="text-text-muted tabular-nums" dir="ltr">
									({fmt(usd)})
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Per-model table */}
			{modelEntries.length > 0 && (
				<div className="glass-card overflow-hidden">
					<div className="p-4 border-b border-border flex items-center justify-between">
						<h2 className="text-sm font-semibold text-text-primary">
							עלויות לפי מודל
						</h2>
						<span className="text-xs text-text-muted">
							{modelEntries.length} מודלים
						</span>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-start">
							<thead>
								<tr className="border-b border-border bg-bg-elevated/50">
									<th className="py-2.5 ps-4 pe-2 text-start text-xs font-semibold text-text-muted">
										מודל
									</th>
									<th className="py-2.5 ps-2 pe-4 text-start text-xs font-semibold text-text-muted">
										עלות כוללת
									</th>
								</tr>
							</thead>
							<tbody>
								{modelEntries.map(([model, usd], idx) => (
									<tr
										// biome-ignore lint/suspicious/noArrayIndexKey: no stable id available
										key={`${model}-${idx}`}
										className={cn(
											"border-b border-border/40 hover:bg-bg-elevated/50 transition-colors",
											idx % 2 === 0 ? "bg-bg-secondary/30" : "bg-transparent",
										)}
									>
										<td className="py-2.5 ps-4 pe-2">
											<span className="text-sm text-text-secondary font-mono">
												{model}
											</span>
										</td>
										<td className="py-2.5 ps-2 pe-4">
											<span
												className="text-sm text-text-primary tabular-nums font-semibold"
												dir="ltr"
											>
												{fmt(usd)}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Daily history chart */}
			{hasData && (
				<div className="glass-card p-5">
					<div className="flex items-center gap-2 mb-4">
						<TrendingUp
							size={15}
							className="text-accent-blue"
							aria-hidden="true"
						/>
						<h2 className="text-sm font-semibold text-text-primary">
							היסטוריה יומית — 30 ימים
						</h2>
					</div>
					<ReactECharts
						option={lineChartOption}
						style={{ height: 200 }}
						opts={{ renderer: "svg" }}
					/>
				</div>
			)}
		</div>
	);
}
