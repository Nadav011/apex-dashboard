import { Activity, AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
	useAgentsLive,
	useHydraWatcher,
	useNotificationsLog,
} from "@/hooks/use-api";
import type { LiveAgentsResponse } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────

interface UnifiedEvent {
	id: string;
	ts: string;
	source: "watcher" | "notification" | "agent";
	type: string;
	title: string;
	detail: string;
	status: "success" | "error" | "info" | "warning";
}

// ── Helpers ───────────────────────────────────────────────────────────

const EVENT_LABELS: Record<string, string> = {
	dispatch_start: "שיגור משימה",
	dispatch_done: "משימה הסתיימה",
	graph_event: "אירוע גרף",
	watcher_start: "מנוע הופעל",
	state_transition: "מעבר מצב",
	idle_shutdown: "כיבוי אוטומ��י",
};

function statusColor(s: UnifiedEvent["status"]): string {
	switch (s) {
		case "success":
			return "text-emerald-400";
		case "error":
			return "text-red-400";
		case "warning":
			return "text-amber-400";
		default:
			return "text-sky-400";
	}
}

function statusIcon(s: UnifiedEvent["status"]) {
	switch (s) {
		case "success":
			return <CheckCircle2 size={14} />;
		case "error":
			return <AlertCircle size={14} />;
		case "warning":
			return <Zap size={14} />;
		default:
			return <Clock size={14} />;
	}
}

function formatTime(ts: string): string {
	if (!ts) return "—";
	try {
		const d = new Date(ts);
		return d.toLocaleTimeString("he-IL", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	} catch {
		return ts.slice(11, 19);
	}
}

// ── Component ─────────────────────────────────────────────────────────

export function ActivityFeedPage() {
	const watcher = useHydraWatcher();
	const notifications = useNotificationsLog();
	const agents = useAgentsLive();

	// Merge all sources into unified events
	const events: UnifiedEvent[] = [];

	// Watcher events (filter out idle_tick)
	const watcherData = Array.isArray(watcher.data) ? watcher.data : [];
	for (const e of watcherData) {
		if (e.event === "idle_tick") continue;

		const evt = e.event;
		const taskId = e.task_id ?? "";
		const displayName =
			((e as unknown as Record<string, unknown>).display_name as string) ?? "";
		const rc = e.rc;
		const provider = e.provider ?? "";
		const ts = e.ts;

		const label = EVENT_LABELS[evt] ?? evt;
		const taskLabel = displayName || (taskId ? taskId.slice(0, 8) : "");

		events.push({
			id: `w-${ts}-${taskId}`,
			ts,
			source: "watcher",
			type: evt,
			title: label,
			detail: [taskLabel, provider, rc != null ? `rc=${rc}` : ""]
				.filter(Boolean)
				.join(" · "),
			status:
				evt === "dispatch_done" ? (rc === 0 ? "success" : "error") : "info",
		});
	}

	// Notification log
	const notifData = Array.isArray(notifications.data) ? notifications.data : [];
	for (const n of notifData) {
		events.push({
			id: `n-${n.ts}`,
			ts: n.ts,
			source: "notification",
			type: "notification",
			title: n.event ?? "התראה",
			detail: n.message,
			status: "info",
		});
	}

	// Sort newest first, cap at 100
	events.sort((a, b) => (b.ts > a.ts ? 1 : -1));
	const feed = events.slice(0, 100);

	// Stats
	const liveCount =
		(agents.data as LiveAgentsResponse | undefined)?.live_count ?? 0;

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						פיד פעילות
					</h1>
					<p className="text-xs text-[var(--color-text-muted)]">
						כל האירועים ממקורות שונים — watcher, התראות, סוכנים
					</p>
				</div>
				<div className="flex items-center gap-3">
					<span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
						<span className="size-2 animate-pulse rounded-full bg-emerald-400" />
						LIVE
					</span>
					<span className="rounded-full bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-text-muted)]">
						{String(liveCount)} סוכנים פעילים
					</span>
				</div>
			</div>

			{/* Summary badges */}
			<div className="flex flex-wrap gap-2">
				{[
					{
						label: "watcher",
						count: feed.filter((e) => e.source === "watcher").length,
						color: "bg-sky-500/10 text-sky-400",
					},
					{
						label: "התראות",
						count: feed.filter((e) => e.source === "notification").length,
						color: "bg-amber-500/10 text-amber-400",
					},
					{
						label: "הצלחות",
						count: feed.filter((e) => e.status === "success").length,
						color: "bg-emerald-500/10 text-emerald-400",
					},
					{
						label: "שגיאות",
						count: feed.filter((e) => e.status === "error").length,
						color: "bg-red-500/10 text-red-400",
					},
				].map((b) => (
					<span
						key={b.label}
						className={`rounded-full px-2.5 py-0.5 text-xs ${b.color}`}
					>
						{b.label}: {b.count}
					</span>
				))}
			</div>

			{/* Feed */}
			<GlassCard title="אירועים אחרונים" icon={<Activity size={16} />}>
				{feed.length === 0 ? (
					<p className="py-8 text-center text-sm text-[var(--color-text-muted)]">
						אין אירועים
					</p>
				) : (
					<ul className="divide-y divide-[var(--color-border)]">
						{feed.map((e) => (
							<li
								key={e.id}
								className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
							>
								{/* Time */}
								<span className="w-16 shrink-0 font-mono text-xs text-[var(--color-text-muted)]">
									{formatTime(e.ts)}
								</span>

								{/* Status dot */}
								<span className={`mt-0.5 shrink-0 ${statusColor(e.status)}`}>
									{statusIcon(e.status)}
								</span>

								{/* Content */}
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-[var(--color-text-primary)]">
											{e.title}
										</span>
										<span
											className={`rounded px-1.5 py-0.5 text-[10px] ${
												e.source === "watcher"
													? "bg-sky-500/10 text-sky-400"
													: e.source === "notification"
														? "bg-amber-500/10 text-amber-400"
														: "bg-purple-500/10 text-purple-400"
											}`}
										>
											{e.source}
										</span>
									</div>
									{e.detail && (
										<p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
											{e.detail}
										</p>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
			</GlassCard>
		</div>
	);
}
