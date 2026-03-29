import ReactECharts from "echarts-for-react";
import { RefreshCw, Webhook } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { useHooks } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

// ── Event type color mapping ────────────────────────────────────────────
const EVENT_COLORS: Record<string, string> = {
	PreToolUse: "var(--color-accent-blue)",
	PostToolUse: "var(--color-accent-green)",
	Stop: "var(--color-accent-red)",
	SessionStart: "var(--color-accent-amber)",
	PostCompact: "var(--color-accent-purple)",
	UserPromptSubmit: "var(--color-accent-cyan)",
};

const EVENT_LABELS: Record<string, string> = {
	PreToolUse: "לפני הרצת כלי",
	PostToolUse: "אחרי הרצת כלי",
	Stop: "עצירת סשן",
	SessionStart: "תחילת סשן",
	PostCompact: "אחרי דחיסה",
	UserPromptSubmit: "שליחת פרומפט",
};

type BadgeVariant =
	| "info"
	| "success"
	| "error"
	| "warning"
	| "purple"
	| "default";

const EVENT_BADGE_VARIANTS: Record<string, BadgeVariant> = {
	PreToolUse: "info",
	PostToolUse: "success",
	Stop: "error",
	SessionStart: "warning",
	PostCompact: "purple",
	UserPromptSubmit: "default",
};

function getEventColor(event: string): string {
	return EVENT_COLORS[event] ?? "oklch(0.62 0.05 260)";
}

function getEventLabel(event: string): string {
	return EVENT_LABELS[event] ?? event;
}

function getEventBadgeVariant(event: string): BadgeVariant {
	return EVENT_BADGE_VARIANTS[event] ?? "default";
}

// ── Main page ───────────────────────────────────────────────────────────
export function HooksPage() {
	const { data, isLoading, error } = useHooks();

	if (isLoading || !data) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex items-center gap-3 text-text-muted">
					<RefreshCw size={18} className="animate-spin" />
					<span>טוען הוקים...</span>
				</div>
			</div>
		);
	}

	if (error)
		return (
			<div className="p-8 text-center text-accent-red">שגיאה בטעינת נתונים</div>
		);

	const sortedEvents = Object.entries(data.by_event).sort(
		([, a], [, b]) => b - a,
	);

	const chartOption = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis",
			backgroundColor: "var(--color-bg-elevated)",
			borderColor: "var(--color-border)",
			textStyle: { color: "var(--color-text-primary)", fontSize: 12 },
			axisPointer: { type: "shadow" },
			formatter: (params: Array<{ name: string; value: number }>) => {
				const p = params[0];
				return `${getEventLabel(p.name)}<br/><b>${p.value} הוקים</b>`;
			},
		},
		grid: { top: 12, bottom: 8, containLabel: true },
		xAxis: {
			type: "category",
			data: sortedEvents.map(([e]) => getEventLabel(e)),
			axisLine: { lineStyle: { color: "var(--color-border)" } },
			axisLabel: { color: "var(--color-text-muted)", fontSize: 11, rotate: 20 },
			axisTick: { show: false },
		},
		yAxis: {
			type: "value",
			minInterval: 1,
			axisLine: { show: false },
			splitLine: { lineStyle: { color: "var(--color-bg-elevated)" } },
			axisLabel: { color: "var(--color-text-muted)", fontSize: 11 },
		},
		series: [
			{
				type: "bar",
				data: sortedEvents.map(([event, count]) => ({
					value: count,
					name: event,
					itemStyle: {
						color: getEventColor(event),
						borderRadius: [4, 4, 0, 0], // rtl-ok — ECharts bar corner radius, not CSS direction
					},
				})),
				barMaxWidth: 48,
			},
		],
	};

	const formatTs = (ts: string) => {
		try {
			return new Date(ts).toLocaleTimeString("he-IL", {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			});
		} catch {
			return ts;
		}
	};

	return (
		<div className="space-y-6 min-h-screen p-6" dir="rtl">
			<PageHeader
				icon={Webhook}
				title="הוקים"
				description="80 הוקים רשומים — אירועי Claude Code, סטטיסטיקות, ומדריך"
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-grid">
				{/* Stat + breakdown */}
				<div className="flex flex-col gap-3 md:col-span-1">
					<div className="glass-card card-spotlight p-4 flex items-center gap-4">
						<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-blue/15 shrink-0">
							<Webhook
								size={18}
								className="text-accent-blue"
								aria-hidden="true"
							/>
						</div>
						<div>
							<div className="text-2xl font-bold tabular-nums text-text-primary">
								{data.total}
							</div>
							<div className="text-xs text-text-muted">הוקים כולל</div>
						</div>
					</div>

					<div className="glass-card card-spotlight p-4 space-y-2">
						<h3 className="text-xs font-semibold text-text-muted mb-3">
							לפי סוג אירוע
						</h3>
						{sortedEvents.map(([event, count]) => {
							const color = getEventColor(event);
							const pct = data.total > 0 ? (count / data.total) * 100 : 0;
							return (
								<div key={event} className="space-y-1">
									<div className="flex items-center justify-between gap-2">
										<Badge variant={getEventBadgeVariant(event)}>
											{getEventLabel(event)}
										</Badge>
										<span className="text-xs text-text-muted tabular-nums shrink-0">
											{count}
										</span>
									</div>
									<div className="h-1 rounded-full bg-bg-elevated overflow-hidden">
										<div
											className="h-full rounded-full transition-all duration-500"
											style={{ width: `${pct}%`, backgroundColor: color }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Bar chart */}
				<div className="glass-card card-spotlight p-4 md:col-span-2">
					<h3 className="text-xs font-semibold text-text-muted mb-3">
						התפלגות לפי אירוע
					</h3>
					<ReactECharts
						option={chartOption}
						style={{ height: 200 }}
						opts={{ renderer: "svg" }}
					/>
				</div>
			</div>

			{/* Recent hook invocations table */}
			<div className="glass-card card-spotlight overflow-hidden">
				<div className="p-4 border-b border-border">
					<h2 className="text-sm font-semibold text-text-primary">
						הרצות אחרונות
					</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-start">
						<thead>
							<tr className="border-b border-border bg-bg-elevated/50">
								<th
									scope="col"
									className="py-2.5 ps-4 pe-2 text-start text-xs font-semibold text-text-muted"
								>
									שם
								</th>
								<th
									scope="col"
									className="py-2.5 px-2 text-start text-xs font-semibold text-text-muted"
								>
									משך (ms)
								</th>
								<th
									scope="col"
									className="py-2.5 ps-2 pe-4 text-start text-xs font-semibold text-text-muted"
								>
									שעה
								</th>
							</tr>
						</thead>
						<tbody>
							{data.recent.length === 0 ? (
								<tr>
									<td
										colSpan={3}
										className="py-12 text-center text-sm text-text-muted"
									>
										אין הרצות אחרונות
									</td>
								</tr>
							) : (
								data.recent.map((item, idx) => (
									<tr
										// biome-ignore lint/suspicious/noArrayIndexKey: no stable id
										key={`${item.hook}-${idx}`}
										className={cn(
											"border-b border-border/40 hover:bg-bg-elevated/50 transition-colors",
											idx % 2 === 0 ? "bg-bg-secondary/30" : "bg-transparent",
										)}
									>
										<td className="py-2.5 ps-4 pe-2">
											<span className="text-sm text-text-primary font-mono truncate block max-w-[220px]">
												{item.hook}
											</span>
										</td>
										<td className="py-2.5 px-2">
											<span
												className="text-sm text-text-secondary tabular-nums"
												dir="ltr"
											>
												{item.duration_ms.toLocaleString("he-IL")}
											</span>
										</td>
										<td className="py-2.5 ps-2 pe-4">
											<span
												className="text-xs text-text-muted font-mono"
												dir="ltr"
											>
												{formatTs(item.ts)}
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
