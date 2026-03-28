import ReactECharts from "echarts-for-react";
import {
	Activity,
	Bot,
	FolderOpen,
	RefreshCw,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useMetrics } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

// ── KPI card ────────────────────────────────────────────────────────────
interface KpiCardProps {
	label: string;
	value: string;
	sub?: string;
	color: string;
	icon: React.ReactNode;
}

function KpiCard({ label, value, sub, color, icon }: KpiCardProps) {
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
				<div className="text-2xl font-bold tabular-nums text-text-primary">
					{value}
				</div>
				<div className="text-xs text-text-muted mt-0.5">{label}</div>
				{sub && <div className="text-xs text-text-secondary mt-1">{sub}</div>}
			</div>
		</div>
	);
}

const PROVIDER_COLORS: Record<string, string> = {
	codex: "oklch(0.65 0.18 250)",
	kimi: "oklch(0.72 0.19 155)",
	gemini: "oklch(0.78 0.16 75)",
	minimax: "oklch(0.62 0.2 290)",
	claude: "oklch(0.75 0.14 200)",
};

function getProviderColor(name: string): string {
	return PROVIDER_COLORS[name.toLowerCase()] ?? "oklch(0.62 0.05 260)";
}

// ── Top-N bar chart (agents or projects) ─────────────────────────────────
interface TopBarChartProps {
	title: string;
	icon: React.ReactNode;
	items: Array<{ name: string; count: number }>;
	color: string;
	emptyLabel: string;
}

function TopBarChart({
	title,
	icon,
	items,
	color,
	emptyLabel,
}: TopBarChartProps) {
	const chartOption = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis",
			backgroundColor: "oklch(0.22 0.02 260)",
			borderColor: "oklch(0.28 0.02 260)",
			textStyle: { color: "oklch(0.95 0.01 260)", fontSize: 12 },
			axisPointer: { type: "shadow" },
		},
		grid: { top: 8, bottom: 8, containLabel: true },
		xAxis: {
			type: "value",
			minInterval: 1,
			axisLine: { show: false },
			splitLine: { lineStyle: { color: "oklch(0.22 0.02 260)" } },
			axisLabel: { color: "oklch(0.55 0.02 260)", fontSize: 11 },
		},
		yAxis: {
			type: "category",
			data: items.map((i) => i.name),
			axisLine: { lineStyle: { color: "oklch(0.28 0.02 260)" } },
			axisLabel: {
				color: "oklch(0.72 0.02 260)",
				fontSize: 11,
				width: 90,
				overflow: "truncate",
			},
			axisTick: { show: false },
		},
		series: [
			{
				type: "bar",
				data: items.map((i) => ({
					value: i.count,
					itemStyle: {
						color,
						borderRadius: [0, 4, 4, 0], // rtl-ok — ECharts bar corner radius
					},
				})),
				barMaxWidth: 24,
			},
		],
	};

	return (
		<div className="glass-card p-5">
			<div className="flex items-center gap-2 mb-4">
				<span className="text-accent-blue" aria-hidden="true">
					{icon}
				</span>
				<h2 className="text-sm font-semibold text-text-primary">{title}</h2>
			</div>
			{items.length > 0 ? (
				<ReactECharts
					option={chartOption}
					style={{ height: Math.max(120, items.length * 32) }}
					opts={{ renderer: "svg" }}
				/>
			) : (
				<p className="text-sm text-text-muted py-8 text-center">{emptyLabel}</p>
			)}
		</div>
	);
}

// ── Provider events table ────────────────────────────────────────────────
// ── Main page ───────────────────────────────────────────────────────────
export function MetricsPage() {
	const { data, isLoading, error } = useMetrics();

	if (isLoading || !data) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex items-center gap-3 text-text-muted">
					<RefreshCw size={18} className="animate-spin" />
					<span>טוען מטריקות...</span>
				</div>
			</div>
		);
	}

	if (error)
		return (
			<div className="p-8 text-center text-[var(--color-accent-red)]">
				שגיאה בטעינת נתונים
			</div>
		);

	// Build per-provider total from provider_events
	const providerTotals: Record<string, number> = {};
	for (const ev of data.provider_events) {
		providerTotals[ev.provider] =
			(providerTotals[ev.provider] ?? 0) + (ev.count ?? 1);
	}
	const providerEntries = Object.entries(providerTotals).sort(
		([, a], [, b]) => b - a,
	);

	const providerChartOption = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis",
			backgroundColor: "oklch(0.22 0.02 260)",
			borderColor: "oklch(0.28 0.02 260)",
			textStyle: { color: "oklch(0.95 0.01 260)", fontSize: 12 },
			axisPointer: { type: "shadow" },
		},
		grid: { top: 8, bottom: 8, containLabel: true },
		xAxis: {
			type: "category",
			data: providerEntries.map(([name]) => name),
			axisLine: { lineStyle: { color: "oklch(0.28 0.02 260)" } },
			axisLabel: { color: "oklch(0.72 0.02 260)", fontSize: 12 },
			axisTick: { show: false },
		},
		yAxis: {
			type: "value",
			minInterval: 1,
			axisLine: { show: false },
			splitLine: { lineStyle: { color: "oklch(0.22 0.02 260)" } },
			axisLabel: { color: "oklch(0.55 0.02 260)", fontSize: 11 },
		},
		series: [
			{
				type: "bar",
				data: providerEntries.map(([name, count]) => ({
					value: count,
					itemStyle: {
						color: getProviderColor(name),
						borderRadius: [4, 4, 0, 0], // rtl-ok — ECharts bar corner radius
					},
				})),
				barMaxWidth: 40,
			},
		],
	};

	return (
		<div className="space-y-6 bg-zinc-950 min-h-screen p-6" dir="rtl">
			{/* Header */}
			<div>
				<h1 className="text-xl font-bold text-text-primary">מטריקות</h1>
				<p className="text-sm text-text-muted mt-0.5">
					ביצועי שיגור הידרה לפי ספק, סוכן ופרויקט
				</p>
			</div>

			{/* KPI row */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<KpiCard
					label="שיגורים כולל"
					value={data.total_dispatches.toLocaleString("he-IL")}
					color="oklch(0.65 0.18 250)"
					icon={<Zap size={20} />}
				/>
				<KpiCard
					label="סוכנים פעילים"
					value={String(data.top_agents.length)}
					sub={
						data.top_agents[0] ? `מוביל: ${data.top_agents[0].name}` : undefined
					}
					color="oklch(0.72 0.19 155)"
					icon={<Bot size={20} />}
				/>
				<KpiCard
					label="פרויקטים פעילים"
					value={String(data.top_projects.length)}
					sub={
						data.top_projects[0]
							? `מוביל: ${data.top_projects[0].name}`
							: undefined
					}
					color="oklch(0.75 0.14 200)"
					icon={<FolderOpen size={20} />}
				/>
			</div>

			{/* Provider breakdown chart */}
			{providerEntries.length > 0 && (
				<div className="glass-card p-5">
					<div className="flex items-center gap-2 mb-4">
						<TrendingUp
							size={15}
							className="text-accent-blue"
							aria-hidden="true"
						/>
						<h2 className="text-sm font-semibold text-text-primary">
							אירועים לפי ספק
						</h2>
					</div>
					<ReactECharts
						option={providerChartOption}
						style={{ height: 200 }}
						opts={{ renderer: "svg" }}
					/>
					{/* Provider color legend */}
					<div className="mt-3 flex flex-wrap gap-3">
						{providerEntries.map(([name, count]) => (
							<div key={name} className="flex items-center gap-1.5 text-xs">
								<span
									className="w-2 h-2 rounded-full shrink-0"
									style={{ backgroundColor: getProviderColor(name) }}
									aria-hidden="true"
								/>
								<span className="text-text-secondary">{name}</span>
								<span className="text-text-muted tabular-nums" dir="ltr">
									({count})
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Top agents + Top projects */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<TopBarChart
					title="סוכנים מובילים"
					icon={<Bot size={15} />}
					items={data.top_agents}
					color="oklch(0.65 0.18 250)"
					emptyLabel="אין נתוני סוכנים"
				/>
				<TopBarChart
					title="פרויקטים מובילים"
					icon={<FolderOpen size={15} />}
					items={data.top_projects}
					color="oklch(0.75 0.14 200)"
					emptyLabel="אין נתוני פרויקטים"
				/>
			</div>

			{/* Provider events table */}
			{data.provider_events.length > 0 && (
				<div className="glass-card overflow-hidden">
					<div className="p-4 border-b border-border flex items-center justify-between">
						<h2 className="text-sm font-semibold text-text-primary">
							אירועי ספקים
						</h2>
						<span className="text-xs text-text-muted">
							{data.provider_events.length} רשומות
						</span>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-start">
							<thead>
								<tr className="border-b border-border bg-bg-elevated/50">
									<th className="py-2.5 ps-4 pe-2 text-start text-xs font-semibold text-text-muted">
										ספק
									</th>
									<th className="py-2.5 px-2 text-start text-xs font-semibold text-text-muted">
										אירוע
									</th>
									<th className="py-2.5 ps-2 pe-4 text-start text-xs font-semibold text-text-muted">
										כמות
									</th>
								</tr>
							</thead>
							<tbody>
								{data.provider_events.map((ev, idx) => (
									<tr
										// biome-ignore lint/suspicious/noArrayIndexKey: no stable id available
										key={`${ev.provider}-${ev.event}-${idx}`}
										className={cn(
											"border-b border-border/40 hover:bg-bg-elevated/50 transition-colors",
											idx % 2 === 0 ? "bg-bg-secondary/30" : "bg-transparent",
										)}
									>
										<td className="py-2.5 ps-4 pe-2">
											<div className="flex items-center gap-1.5">
												<span
													className="w-2 h-2 rounded-full shrink-0"
													style={{
														backgroundColor: getProviderColor(ev.provider),
													}}
													aria-hidden="true"
												/>
												<span className="text-sm text-text-secondary font-medium">
													{ev.provider}
												</span>
											</div>
										</td>
										<td className="py-2.5 px-2">
											<span className="text-sm text-text-secondary font-mono">
												{ev.event}
											</span>
										</td>
										<td className="py-2.5 ps-2 pe-4">
											<span className="text-sm text-text-muted tabular-nums">
												{ev.count ?? 1}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Empty state */}
			{data.provider_events.length === 0 &&
				data.top_agents.length === 0 &&
				data.top_projects.length === 0 && (
					<div className="glass-card p-12 text-center flex flex-col items-center gap-4">
						<Activity
							size={40}
							className="text-text-muted"
							aria-hidden="true"
						/>
						<p className="text-sm text-text-muted">
							אין נתוני מטריקות עדיין — הרץ שיגורי הידרה כדי לראות נתונים
						</p>
					</div>
				)}
		</div>
	);
}
