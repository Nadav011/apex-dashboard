import {
	Activity,
	Bot,
	CheckCircle2,
	Cpu,
	DollarSign,
	LayoutDashboard,
	ListChecks,
	Rocket,
	XCircle,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricGauge } from "@/components/ui/MetricGauge";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
	useAgentsLive,
	useCosts,
	useHydraTasks,
	useHydraWatcher,
	useMetrics,
	useSystem,
} from "@/hooks/use-api";
import type { WatcherEvent } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function formatCurrentTime(): string {
	return new Date().toLocaleTimeString("he-IL", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
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
		return "text-status-critical";
	}
	if (event.includes("complete") || event.includes("start")) {
		return "text-status-healthy";
	}
	return "text-text-secondary";
}

function eventIconBg(event: string): string {
	if (event.includes("fail") || event.includes("error")) {
		return "bg-[oklch(0.62_0.22_25_/_0.15)]";
	}
	if (event.includes("complete")) {
		return "bg-[oklch(0.72_0.19_155_/_0.15)]";
	}
	if (event.includes("start")) {
		return "bg-[oklch(0.65_0.18_250_/_0.15)]";
	}
	return "bg-bg-elevated";
}

function shortHash(taskId: string | undefined): string {
	if (!taskId) return "—";
	return taskId.length > 10 ? `${taskId.slice(0, 8)}…` : taskId;
}

// ── Live clock hook ───────────────────────────────────────────────────────────

function useLiveClock(): string {
	const [time, setTime] = useState(formatCurrentTime);
	useEffect(() => {
		const id = setInterval(() => setTime(formatCurrentTime()), 1000);
		return () => clearInterval(id);
	}, []);
	return time;
}

// ── CPU sparkline history hook ────────────────────────────────────────────────

const MAX_SPARKLINE_POINTS = 10;

function useCpuHistory(currentCpu: number | null): number[] {
	const [history, setHistory] = useState<number[]>([]);
	useEffect(() => {
		if (currentCpu === null) return;
		setHistory((prev) => {
			const next = [...prev, currentCpu];
			return next.length > MAX_SPARKLINE_POINTS
				? next.slice(next.length - MAX_SPARKLINE_POINTS)
				: next;
		});
	}, [currentCpu]);
	return history;
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────────

function SparklineChart({ points }: { points: number[] }) {
	if (points.length < 2) {
		return (
			<div className="flex items-center justify-center h-16 text-xs text-text-muted">
				אוסף נתונים…
			</div>
		);
	}

	const W = 280;
	const H = 56;
	const PAD = 4;
	const max = Math.max(...points, 1);
	const min = Math.min(...points);
	const range = max - min || 1;

	const xs = points.map(
		(_, i) => PAD + (i / (points.length - 1)) * (W - PAD * 2),
	);
	const ys = points.map((v) => H - PAD - ((v - min) / range) * (H - PAD * 2));

	// Build SVG path
	const linePath = xs
		.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`)
		.join(" ");

	// Area fill path: close below the line
	const areaPath = `${linePath} L${xs[xs.length - 1].toFixed(1)},${H} L${xs[0].toFixed(1)},${H} Z`;

	const lastVal = points[points.length - 1];
	const lastX = xs[xs.length - 1];
	const lastY = ys[ys.length - 1];

	return (
		<div className="flex items-center gap-3">
			<svg
				viewBox={`0 0 ${W} ${H}`}
				width={W}
				height={H}
				aria-hidden="true"
				className="overflow-visible flex-1"
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="0%"
							stopColor="var(--color-accent-cyan)"
							stopOpacity="0.35"
						/>
						<stop
							offset="100%"
							stopColor="var(--color-accent-cyan)"
							stopOpacity="0"
						/>
					</linearGradient>
				</defs>
				{/* Area fill */}
				<path d={areaPath} fill="url(#sparkFill)" />
				{/* Line */}
				<path
					d={linePath}
					fill="none"
					stroke="var(--color-accent-cyan)"
					strokeWidth="1.75"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				{/* Current value dot */}
				<circle
					cx={lastX}
					cy={lastY}
					r="3"
					fill="var(--color-accent-cyan)"
					className="animate-pulse-status"
				/>
			</svg>
			<span
				className="text-lg font-bold tabular-nums text-accent-cyan shrink-0"
				dir="ltr"
			>
				{lastVal.toFixed(1)}%
			</span>
		</div>
	);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SystemGauges() {
	const { data, isLoading } = useSystem();

	if (isLoading || !data) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{["מעבד", "זיכרון", "דיסק"].map((label) => (
					<div
						key={label}
						className="glass-card card-spotlight p-4 animate-pulse"
					>
						<div className="h-4 bg-bg-elevated rounded w-1/3 mb-3" />
						<div className="h-2 bg-bg-elevated rounded" />
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

// ── Recent Activity Strip ─────────────────────────────────────────────────────

function ActivityStrip({
	events,
	onCardClick,
}: {
	events: WatcherEvent[];
	onCardClick: () => void;
}) {
	if (events.length === 0) {
		return (
			<p className="text-sm text-text-muted text-center py-4">
				אין אירועים אחרונים
			</p>
		);
	}

	return (
		<div
			className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1"
			style={{ scrollbarWidth: "none" }}
		>
			{events.map((ev, i) => {
				const isOk = ev.rc === undefined || ev.rc === 0;
				return (
					<button
						// biome-ignore lint/suspicious/noArrayIndexKey: stable strip order
						key={`${ev.ts}-${i}-${ev.task_id ?? ""}`}
						type="button"
						onClick={onCardClick}
						className={cn(
							"shrink-0 flex flex-col gap-1.5 rounded-xl p-3 text-start",
							"border border-border transition-colors duration-150",
							"hover:border-accent-blue/40 hover:bg-bg-elevated cursor-pointer",
							"w-40 min-w-[10rem]",
							eventIconBg(ev.event),
						)}
					>
						<span
							className={cn(
								"text-xs font-semibold truncate w-full",
								eventColorClass(ev.event),
							)}
						>
							{eventLabel(ev.event)}
						</span>
						<span
							className="text-[10px] text-text-muted tabular-nums"
							dir="ltr"
						>
							{formatTs(ev.ts)}
						</span>
						<span className="text-[10px] text-text-muted font-mono truncate w-full">
							{shortHash(ev.task_id)}
						</span>
						{ev.rc !== undefined && (
							<span
								className={cn(
									"self-start inline-flex items-center gap-0.5 text-[10px] font-medium",
									isOk ? "text-status-healthy" : "text-status-critical",
								)}
							>
								{isOk ? (
									<CheckCircle2 size={10} aria-hidden="true" />
								) : (
									<XCircle size={10} aria-hidden="true" />
								)}
								{ev.rc}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}

// ── Watcher Events Table ──────────────────────────────────────────────────────

function WatcherEventRow({ event }: { event: WatcherEvent }) {
	const isOk = event.rc === undefined || event.rc === 0;
	return (
		<tr className="border-b border-border last:border-0 hover:bg-bg-elevated transition-colors duration-100">
			<td
				className="py-2 ps-4 pe-2 text-xs text-text-muted tabular-nums whitespace-nowrap"
				dir="ltr"
			>
				{formatTs(event.ts)}
			</td>
			<td
				className={cn(
					"py-2 px-2 text-xs font-medium",
					eventColorClass(event.event),
				)}
			>
				{eventLabel(event.event)}
			</td>
			<td className="py-2 px-2 text-xs text-text-secondary max-w-32 truncate">
				{event.task_id ?? "—"}
			</td>
			<td className="py-2 px-2 text-xs text-accent-purple">
				{event.provider ?? "—"}
			</td>
			<td className="py-2 ps-2 pe-4 text-xs">
				{event.rc !== undefined ? (
					<span
						dir="ltr"
						className={cn(
							"font-mono inline-flex items-center gap-1",
							isOk ? "text-status-healthy" : "text-status-critical",
						)}
					>
						{isOk ? (
							<CheckCircle2 size={12} aria-hidden="true" />
						) : (
							<XCircle size={12} aria-hidden="true" />
						)}
						{event.rc}
					</span>
				) : (
					<span className="text-text-muted">—</span>
				)}
			</td>
		</tr>
	);
}

// ── Live header badge ─────────────────────────────────────────────────────────

function LiveBadge({ time }: { time: string }) {
	return (
		<div className="flex items-center gap-2">
			<span className="relative flex size-2">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-healthy opacity-75" />
				<span className="relative inline-flex size-2 rounded-full bg-status-healthy" />
			</span>
			<span className="text-xs font-semibold text-status-healthy tracking-wider">
				LIVE
			</span>
			<span className="text-xs text-text-muted tabular-nums" dir="ltr">
				{time}
			</span>
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function OverviewPage() {
	const liveTime = useLiveClock();
	const agentsLive = useAgentsLive();
	const tasks = useHydraTasks();
	const metrics = useMetrics();
	const costs = useCosts();
	const watcher = useHydraWatcher();

	// Ref to scroll to watcher table section on activity card click
	const watcherRef = useRef<HTMLDivElement>(null);
	const scrollToWatcher = useCallback(() => {
		watcherRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	}, []);

	// ── Derived stats ──────────────────────────────────────────────────────────

	// Active agents: live_agents where cpu > 0
	const liveAgentsList = agentsLive.data?.live_agents ?? [];
	const activeAgentsCount = liveAgentsList.filter((a) => a.cpu > 0).length;

	// Total CPU across live agents (for sparkline)
	const totalCpu =
		liveAgentsList.length > 0
			? liveAgentsList.reduce((sum, a) => sum + a.cpu, 0) /
				liveAgentsList.length
			: null;
	const cpuHistory = useCpuHistory(totalCpu);

	// Tasks completed (HydraTask has no date field — count all completed/verified)
	const allTasks = tasks.data ?? [];
	const completedTodayCount = allTasks.filter(
		(t) => t.status === "completed" || t.status === "verified",
	).length;

	// Total dispatches from metrics
	const totalDispatches = metrics.data?.total_dispatches ?? 0;

	// Cost today
	const todayUsd = costs.data?.today_usd ?? 0;
	const costLabel = `$${todayUsd.toFixed(2)}`;

	// Watcher events
	const allEvents = Array.isArray(watcher.data) ? watcher.data : [];
	const recentEvents = allEvents.slice(-10).reverse();
	const stripEvents = allEvents.slice(-5).reverse();

	return (
		<div className="flex flex-col gap-6 min-h-screen p-6">
			{/* Header with live badge */}
			<PageHeader
				icon={LayoutDashboard}
				title="סקירה כללית"
				description="מבט על כל המערכת — סוכנים, משימות, בריאות, משאבים"
				actions={<LiveBadge time={liveTime} />}
			/>

			{/* Stat Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 grid-cards stagger-grid">
				<StatCard label="סוכנים פעילים" value={activeAgentsCount} icon={Bot} />
				<StatCard
					label="משימות היום"
					value={completedTodayCount}
					icon={ListChecks}
				/>
				<StatCard
					label={`Dispatches (היום)`}
					value={totalDispatches}
					icon={Rocket}
				/>
				<StatCard label="סה״כ עלות היום" value={costLabel} icon={DollarSign} />
			</div>

			{/* Recent Activity Strip */}
			<GlassCard
				title="פעילות אחרונה"
				subtitle="5 האירועים האחרונים — לחץ לגלול לטבלה"
				icon={<Zap size={16} />}
			>
				<ActivityStrip events={stripEvents} onCardClick={scrollToWatcher} />
			</GlassCard>

			{/* System Pulse — CPU sparkline */}
			<GlassCard
				title="דופק המערכת"
				subtitle="ממוצע CPU על סוכנים חיים — מתעדכן כל 3 שניות"
				icon={<Cpu size={16} />}
			>
				<SparklineChart points={cpuHistory} />
			</GlassCard>

			{/* System Gauges */}
			<GlassCard title="מדדי מערכת" icon={<Cpu size={16} />}>
				<SystemGauges />
			</GlassCard>

			{/* Watcher Events Table */}
			<div ref={watcherRef}>
				<GlassCard
					title="אירועי צופה אחרונים"
					subtitle="10 האחרונים"
					icon={<Activity size={16} />}
				>
					{recentEvents.length === 0 ? (
						<p className="text-sm text-text-muted text-center py-6">
							אין אירועים עדיין
						</p>
					) : (
						<div className="overflow-x-auto -mx-4 -mb-4">
							{/* responsive-ok — table needs min width, overflow-x-auto handles it */}
							<table className="w-full min-w-max text-start">
								<thead>
									<tr className="border-b border-border">
										{["שעה", "אירוע", "מזהה משימה", "ספק", "קוד"].map((h) => (
											<th
												key={h}
												scope="col"
												className="py-2 px-2 first:ps-4 last:pe-4 text-xs font-medium text-text-muted text-start"
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{recentEvents.map((ev, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: stable list order
										<WatcherEventRow key={`${ev.ts}-${i}`} event={ev} />
									))}
								</tbody>
							</table>
						</div>
					)}
				</GlassCard>
			</div>
		</div>
	);
}
