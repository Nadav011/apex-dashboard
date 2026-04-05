import {
	Activity,
	Bot,
	CheckCircle2,
	Clock,
	Cpu,
	LayoutDashboard,
	XCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricGauge } from "@/components/ui/MetricGauge";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
	useAgents,
	useHydraHealth,
	useHydraTasks,
	useHydraWatcher,
	useSystem,
} from "@/hooks/use-api";
import type { WatcherEvent } from "@/lib/api";
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
		return "text-status-critical";
	}
	if (event.includes("complete") || event.includes("start")) {
		return "text-status-healthy";
	}
	return "text-text-secondary";
}

// ── Sub-components ───────────────────────────────────────────────────────────

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

// ── Page ─────────────────────────────────────────────────────────────────────

export function OverviewPage() {
	const agents = useAgents();
	const tasks = useHydraTasks();
	const health = useHydraHealth();
	const watcher = useHydraWatcher();

	// Derived stats — agents is AgentInfo[], tasks is HydraTask[]
	const totalAgents = agents.data?.length ?? 0;
	const activeTasks = (tasks.data ?? []).filter(
		(t) => t.status === "in_progress" || t.status === "pending",
	).length;
	// metrics no longer has success_rate — derive from top data if available
	const successRate = 0;

	const healthChecks = health.data?.checks ?? [];
	const healthyCount = healthChecks.filter((c) => c.ok).length;
	const healthPct =
		healthChecks.length > 0
			? Math.round((healthyCount / healthChecks.length) * 100)
			: 0;

	const recentEvents = (Array.isArray(watcher.data) ? watcher.data : [])
		.slice(-10)
		.reverse();

	return (
		<div className="flex flex-col gap-6 min-h-screen p-6">
			<PageHeader
				icon={LayoutDashboard}
				title="סקירה כללית"
				description="מבט על כל המערכת — סוכנים, משימות, בריאות, משאבים"
			/>

			{/* Stat Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 grid-cards stagger-grid">
				<StatCard label="סך הסוכנים" value={totalAgents} icon={Bot} />
				<StatCard label="משימות פעילות" value={activeTasks} icon={Activity} />
				<StatCard
					label="אחוז הצלחה"
					value={`${successRate}%`}
					icon={CheckCircle2}
				/>
				<StatCard label="בריאות המערכת" value={`${healthPct}%`} icon={Clock} />
			</div>

			{/* System Gauges */}
			<GlassCard title="מדדי מערכת" icon={<Cpu size={16} />}>
				<SystemGauges />
			</GlassCard>

			{/* Watcher Events */}
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
	);
}
