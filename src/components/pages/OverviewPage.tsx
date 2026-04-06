import {
	Activity,
	Bot,
	Cpu,
	DollarSign,
	LayoutDashboard,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricGauge } from "@/components/ui/MetricGauge";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
	useAgentsLive,
	useCosts,
	useHydraTasks,
	useMetrics,
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

function eventLabel(event: string): string {
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

function eventColorClass(event: string): string {
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
		.filter((e) => e.event !== "idle")
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

	const activeAgents = agentsLive.data?.live_count ?? 0;
	const tasksToday = tasks.data?.length ?? 0;
	const dispatches = metrics.data?.total_dispatches ?? 0;
	const costToday = costs.data?.today_usd ?? 0;

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
				<StatCard label="שיגורים" value={dispatches} icon={Zap} />
				<StatCard
					label="עלות יומית"
					value={`$${costToday.toFixed(2)}`}
					icon={DollarSign}
				/>
			</div>

			{/* System Gauges */}
			<GlassCard title="מדדי מערכת" icon={<Cpu size={16} />}>
				<SystemGauges />
			</GlassCard>
		</div>
	);
}
