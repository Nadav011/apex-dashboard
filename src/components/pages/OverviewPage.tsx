import ReactECharts from "echarts-for-react";
import {
	Activity,
	Bot,
	Cpu,
	DollarSign,
	LayoutDashboard,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LiveRunIndicator } from "@/components/company/LiveRunIndicator";
import { PaperclipDispatchStatsCard } from "@/components/company/PaperclipDispatchStatsCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricGauge } from "@/components/ui/MetricGauge";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
	useAgentsLive,
	useCosts,
	useHydraTasks,
	useMetrics,
	usePaperclipCompany,
	useSystem,
	useWatcherAll,
} from "@/hooks/use-api";
import { cn } from "@/lib/cn";

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatTs(ts: string): string {
	try {
		const d = new Date(ts);
		return d.toLocaleTimeString("he-IL", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	} catch {
		return ts;
	}
}

function eventLabel(event: string | undefined): string {
	if (!event) return "—";
	const MAP: Record<string, string> = {
		task_start: "משימה התחילה",
		task_complete: "משימה הושלמה",
		task_failed: "משימה נכשלה",
		watcher_start: "הצופה הופעל",
		watcher_stop: "הצופה נעצר",
		health_check: "בדיקת בריאות",
		import_error: "שגיאת ייבוא",
	};
	return MAP[event] ?? event;
}

function eventColorClass(event: string | undefined): string {
	if (!event) return "text-slate-400";
	if (event.includes("fail") || event.includes("error")) {
		return "text-amber-500";
	}
	if (event.includes("complete") || event.includes("start")) {
		return "text-cyan-400";
	}
	return "text-slate-400";
}

// ── Sub-components ───────────────────────────────────────────────────────────

function LiveBadge() {
	const [time, setTime] = useState(new Date());
	useEffect(() => {
		const timer = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5 w-fit shadow-sm">
			<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
			<span className="text-xs font-bold text-green-400 tracking-wider">
				LIVE
			</span>
			<span className="text-xs text-zinc-400 font-mono ms-2" dir="ltr">
				{time.toLocaleTimeString("he-IL", { hour12: false })}
			</span>
		</div>
	);
}

function ActivityStrip() {
	const watcherAll = useWatcherAll();
	const events = Array.isArray(watcherAll.data) ? watcherAll.data : [];
	const recentEvents = events
		.filter((e) => e.event != null && e.event !== "idle")
		.slice(-5)
		.reverse();

	if (recentEvents.length === 0) return null;

	return (
		<div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
			{recentEvents.map((ev, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: stable list order
					key={`${ev.ts}-${i}`}
					className="flex-none bg-slate-900 border border-slate-800 rounded-lg p-3 min-w-[200px] shadow-sm"
				>
					<div className="flex items-center justify-between mb-2">
						<span
							className={cn("text-xs font-medium", eventColorClass(ev.event))}
						>
							{eventLabel(ev.event)}
						</span>
						<span className="text-[10px] text-slate-500 font-mono" dir="ltr">
							{formatTs(ev.ts)}
						</span>
					</div>
					<div className="text-xs text-slate-300 truncate text-start">
						{ev.task_id ?? ev.provider ?? "—"}
					</div>
				</div>
			))}
		</div>
	);
}

function SystemGauges() {
	const { data, isLoading } = useSystem();

	if (isLoading || !data) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{["מעבד", "זיכרון", "דיסק"].map((label) => (
					<div
						key={label}
						className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 animate-pulse"
					>
						<div className="h-4 bg-slate-800 rounded w-1/3 mb-3" />
						<div className="h-2 bg-slate-800 rounded" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-grid">
			<MetricGauge
				value={data.ram.pct}
				label="זיכרון RAM"
				detail={`${data.ram.used_gb.toFixed(1)} / ${data.ram.total_gb.toFixed(1)} GB`}
			/>
			<MetricGauge
				value={data.disk.pct}
				label="דיסק"
				detail={`${data.disk.used_gb.toFixed(0)} / ${data.disk.total_gb.toFixed(0)} GB`}
			/>
			<MetricGauge
				value={data.swap.pct}
				label="Swap"
				detail={`${data.swap.used_gb.toFixed(1)} / ${data.swap.total_gb.toFixed(1)} GB`}
			/>
		</div>
	);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function OverviewPage() {
	const agentsLive = useAgentsLive();
	const tasks = useHydraTasks();
	const metrics = useMetrics();
	const costs = useCosts();
	const paperclip = usePaperclipCompany();

	const activeAgents = agentsLive.data?.live_count ?? 0;
	const tasksToday = tasks.data?.length ?? 0;
	const dispatches = metrics.data?.total_dispatches ?? 0;
	const costToday = costs.data?.today_usd ?? 0;
	const ds = paperclip.data?.dispatch_stats;
	const totalDispatches = ds?.total_runs ?? dispatches;
	const dispatchWinRate = `${((ds?.win_rate ?? 0) * 100).toFixed(1)}%`;
	const winRateValue = (ds?.win_rate ?? 0) * 100;
	const winRateColor =
		winRateValue >= 80
			? "text-green-400"
			: winRateValue >= 50
				? "text-amber-400"
				: "text-red-400";

	// Agent status distribution from paperclip data
	const paperclipAgents = paperclip.data?.agents ?? [];
	const dispatchStats = paperclip.data?.dispatch_stats;
	const runningCount = paperclipAgents.filter(
		(a) => a.status === "running",
	).length;
	const idleCount = paperclipAgents.filter((a) => a.status === "idle").length;
	const errorCount = paperclipAgents.filter((a) => a.status === "error").length;

	const donutOption = {
		backgroundColor: "transparent",
		tooltip: { trigger: "item" as const, formatter: "{b}: {c} ({d}%)" },
		legend: { show: false },
		series: [
			{
				type: "pie",
				radius: ["55%", "80%"],
				avoidLabelOverlap: false,
				label: { show: false },
				emphasis: { label: { show: false } },
				data: [
					{
						value: runningCount,
						name: "פעיל",
						itemStyle: { color: "#22c55e" },
					},
					{ value: idleCount, name: "ממתין", itemStyle: { color: "#3b82f6" } },
					{ value: errorCount, name: "שגיאה", itemStyle: { color: "#f59e0b" } },
				].filter((d) => d.value > 0),
			},
		],
	};

	return (
		<div className="flex flex-col gap-6 min-h-screen p-6 bg-zinc-950 text-zinc-100">
			<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
				<PageHeader
					icon={LayoutDashboard}
					title="סקירה כללית"
					description="מבט על כל המערכת — סוכנים, משימות, פעילות ועלויות"
				/>
				<LiveBadge />
			</div>

			<ActivityStrip />

			{/* Stat Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 grid-cards stagger-grid">
				<StatCard label="סוכנים פעילים" value={activeAgents} icon={Bot} />
				<StatCard label="משימות היום" value={tasksToday} icon={Activity} />
				<StatCard
					label="שיגורים"
					value={ds?.total_runs ?? dispatches}
					icon={Zap}
				/>
				<StatCard
					label="עלות יומית"
					value={`$${costToday.toFixed(2)}`}
					icon={DollarSign}
				/>
			</div>

			{/* Active Agents Panel + Status Donut */}
			{paperclipAgents.length > 0 && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4" dir="rtl">
					<GlassCard title="סוכנים פעילים — APEX" icon={<Bot size={16} />}>
						<div className="flex items-center gap-4 mb-4">
							<LiveRunIndicator count={runningCount} />
						</div>
						<div className="space-y-2">
							{[
								{
									label: "רץ כעת",
									count: runningCount,
									color: "text-green-400",
								},
								{ label: "ממתין", count: idleCount, color: "text-blue-400" },
								{
									label: "שגיאה",
									count: errorCount,
									color: "text-amber-400",
								},
							].map(({ label, count, color }) => (
								<div
									key={label}
									className="flex items-center justify-between text-sm"
								>
									<span className="text-text-muted">{label}</span>
									<span className={`font-bold tabular-nums ${color}`}>
										{count}
									</span>
								</div>
							))}
							<div className="flex items-center justify-between text-sm">
								<span className="text-text-muted">שיגורים / הצלחה</span>
								<span
									className="font-bold text-text-primary tabular-nums"
									dir="ltr"
								>
									{totalDispatches} / {dispatchWinRate}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-text-muted">הצלחת שיגורים</span>
								<span className={`font-bold tabular-nums ${winRateColor}`}>
									{dispatchWinRate}
								</span>
							</div>
							<div className="flex items-center justify-between text-sm border-t border-border pt-2 mt-2">
								<span className="text-text-muted font-semibold">סה"כ</span>
								<span className="font-bold text-text-primary tabular-nums">
									{paperclipAgents.length}
								</span>
							</div>
						</div>
					</GlassCard>

					<GlassCard title="התפלגות סטטוס סוכנים" icon={<Activity size={16} />}>
						{paperclipAgents.length > 0 ? (
							<ReactECharts
								option={donutOption}
								style={{ height: 160 }}
								opts={{ renderer: "svg" }}
							/>
						) : (
							<p className="text-sm text-text-muted text-center py-8">
								אין נתונים
							</p>
						)}
					</GlassCard>
				</div>
			)}

			{dispatchStats && (
				<PaperclipDispatchStatsCard
					stats={dispatchStats}
					title="ביצועי שיגורים"
					subtitle={`${dispatchStats.total_runs} שיגורים אחרונים`}
				/>
			)}

			{/* System Gauges */}
			<GlassCard title="מדדי מערכת" icon={<Cpu size={16} />}>
				<SystemGauges />
			</GlassCard>
		</div>
	);
}
