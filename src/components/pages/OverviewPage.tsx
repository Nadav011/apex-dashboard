import {
	Activity,
	Bot,
	CheckCircle2,
	Clock,
	Cpu,
	HardDrive,
	LayoutDashboard,
	MemoryStick,
	XCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
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
		return "text-[var(--color-status-critical)]";
	}
	if (event.includes("complete") || event.includes("start")) {
		return "text-[var(--color-status-healthy)]";
	}
	return "text-[var(--color-text-secondary)]";
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SystemGauges() {
	const { data, isLoading } = useSystem();

	if (isLoading || !data) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{["מעבד", "זיכרון", "דיסק"].map((label) => (
					<div key={label} className="glass-card p-4 animate-pulse">
						<div className="h-4 bg-[var(--color-bg-elevated)] rounded w-1/3 mb-3" />
						<div className="h-2 bg-[var(--color-bg-elevated)] rounded" />
					</div>
				))}
			</div>
		);
	}

	const gauges = [
		{
			label: "זיכרון RAM",
			icon: MemoryStick,
			value: data.ram.pct,
			detail: `${data.ram.used_gb.toFixed(1)} / ${data.ram.total_gb.toFixed(1)} GB`,
		},
		{
			label: "דיסק",
			icon: HardDrive,
			value: data.disk.pct,
			detail: `${data.disk.used_gb.toFixed(0)} / ${data.disk.total_gb.toFixed(0)} GB`,
		},
		{
			label: "Swap",
			icon: Cpu,
			value: data.swap.pct,
			detail: `${data.swap.used_gb.toFixed(1)} / ${data.swap.total_gb.toFixed(1)} GB`,
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
			{gauges.map(({ label, icon: Icon, value, detail }) => (
				<div key={label} className="glass-card p-4">
					<div className="flex items-center gap-2 mb-3">
						<Icon
							size={15}
							className="text-[var(--color-text-muted)] shrink-0"
							aria-hidden="true"
						/>
						<span className="text-sm font-medium text-[var(--color-text-secondary)]">
							{label}
						</span>
					</div>
					<ProgressBar value={value} size="md" showValue />
					<p className="mt-2 text-xs text-[var(--color-text-muted)]" dir="ltr">
						{detail}
					</p>
				</div>
			))}
		</div>
	);
}

function WatcherEventRow({ event }: { event: WatcherEvent }) {
	const isOk = event.rc === undefined || event.rc === 0;
	return (
		<tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-elevated)] transition-colors duration-100">
			<td
				className="py-2 ps-4 pe-2 text-xs text-[var(--color-text-muted)] tabular-nums whitespace-nowrap"
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
			<td className="py-2 px-2 text-xs text-[var(--color-text-secondary)] max-w-32 truncate">
				{event.task_id ?? "—"}
			</td>
			<td className="py-2 px-2 text-xs text-[var(--color-accent-purple)]">
				{event.provider ?? "—"}
			</td>
			<td className="py-2 ps-2 pe-4 text-xs">
				{event.rc !== undefined ? (
					<span
						dir="ltr"
						className={cn(
							"font-mono inline-flex items-center gap-1",
							isOk
								? "text-[var(--color-status-healthy)]"
								: "text-[var(--color-status-critical)]",
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
					<span className="text-[var(--color-text-muted)]">—</span>
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

	const recentEvents = (watcher.data?.events ?? []).slice(-10).reverse();

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<LayoutDashboard
					size={20}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						סקירה כללית
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						מצב מערכת APEX Command Center
					</p>
				</div>
			</div>

			{/* Stat Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
					<p className="text-sm text-[var(--color-text-muted)] text-center py-6">
						אין אירועים עדיין
					</p>
				) : (
					<div className="overflow-x-auto -mx-4 -mb-4">
						{/* responsive-ok — table needs min width, overflow-x-auto handles it */}
						<table className="w-full min-w-max text-start">
							<thead>
								<tr className="border-b border-[var(--color-border)]">
									{["שעה", "אירוע", "מזהה משימה", "ספק", "קוד"].map((h) => (
										<th
											key={h}
											className="py-2 px-2 first:ps-4 last:pe-4 text-xs font-medium text-[var(--color-text-muted)] text-start"
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
