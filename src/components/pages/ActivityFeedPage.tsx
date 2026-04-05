import { Activity, RefreshCw } from "lucide-react";
import { useMemo, useRef } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
	useAgentsLive,
	useHydraWatcher,
	useNotificationsLog,
} from "@/hooks/use-api";
import type { LiveAgent, NotificationEvent, WatcherEvent } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Types ─────────────────────────────────────────────────────────────────────

type EventColor = "green" | "red" | "blue" | "yellow";

interface FeedEvent {
	id: string;
	ts: string;
	tsMs: number;
	color: EventColor;
	badgeLabel: string;
	description: string;
	meta?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(ts: string): string {
	try {
		const d = new Date(ts);
		if (Number.isNaN(d.getTime())) return ts;
		return d.toLocaleTimeString("he-IL", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});
	} catch {
		return ts;
	}
}

function toMs(ts: string): number {
	try {
		return new Date(ts).getTime();
	} catch {
		return 0;
	}
}

function watcherEventColor(event: WatcherEvent): EventColor {
	const e = event.event ?? "";
	if (e === "dispatch_done" || e === "graph_event") {
		if (event.rc !== undefined && event.rc !== 0) return "red";
		return "green";
	}
	if (e === "dispatch_start") return "blue";
	if (event.rc !== undefined && event.rc !== 0) return "red";
	return "blue";
}

function watcherBadgeLabel(event: WatcherEvent): string {
	const e = event.event ?? "";
	if (e === "dispatch_start") return "שיגור";
	if (e === "dispatch_done") return "אירוע";
	if (e === "graph_event") return "גרף";
	if (e === "watcher_start") return "הפעלה";
	if (e === "watcher_stop") return "עצירה";
	return "אירוע";
}

function watcherDescription(event: WatcherEvent): string {
	const e = event.event ?? "";
	const parts: string[] = [];

	if (e === "dispatch_start") {
		parts.push("שיגור משימה");
		if (event.provider) parts.push(`ספק: ${event.provider}`);
	} else if (e === "dispatch_done") {
		const success = event.rc === 0 || event.rc === undefined;
		parts.push(
			success ? "משימה הושלמה" : `משימה נכשלה (rc=${event.rc ?? "?"})`,
		);
		if (event.provider) parts.push(`ספק: ${event.provider}`);
	} else if (e === "graph_event") {
		parts.push(event.node ? `צומת: ${event.node}` : "אירוע גרף");
		if (event.provider) parts.push(`ספק: ${event.provider}`);
	} else if (e === "watcher_start") {
		parts.push("Watcher הופעל");
	} else if (e === "watcher_stop") {
		parts.push("Watcher נעצר");
	} else {
		parts.push(event.message ?? e);
	}

	return parts.join(" — ");
}

function notificationEventColor(event: NotificationEvent): EventColor {
	if (!event.sent) return "yellow";
	const e = event.event ?? "";
	if (e.includes("fail") || e.includes("critical") || e.includes("error"))
		return "red";
	if (e.includes("warn") || e.includes("high") || e.includes("unreachable"))
		return "yellow";
	return "blue";
}

function notificationBadgeLabel(_event: NotificationEvent): string {
	return "התראה";
}

function agentDescription(agent: LiveAgent, action: "start" | "stop"): string {
	const label = agent.type || "סוכן";
	return action === "start" ? `סוכן הופעל: ${label}` : `סוכן נעצר: ${label}`;
}

// ── Color dot ────────────────────────────────────────────────────────────────

const COLOR_CLASSES: Record<EventColor, string> = {
	green: "bg-accent-green",
	red: "bg-accent-red",
	blue: "bg-accent-blue",
	yellow: "bg-accent-amber",
};

const COLOR_BADGE_BG: Record<EventColor, string> = {
	green: "oklch(from var(--color-accent-green) l c h / 0.12)",
	red: "oklch(from var(--color-accent-red) l c h / 0.12)",
	blue: "oklch(from var(--color-accent-blue) l c h / 0.12)",
	yellow: "oklch(from var(--color-accent-amber) l c h / 0.12)",
};

const COLOR_BADGE_BORDER: Record<EventColor, string> = {
	green: "oklch(from var(--color-accent-green) l c h / 0.3)",
	red: "oklch(from var(--color-accent-red) l c h / 0.3)",
	blue: "oklch(from var(--color-accent-blue) l c h / 0.3)",
	yellow: "oklch(from var(--color-accent-amber) l c h / 0.3)",
};

// ── Feed Row ─────────────────────────────────────────────────────────────────

function FeedRow({ event }: { event: FeedEvent }) {
	return (
		<div
			className={cn(
				"flex items-start gap-3 px-4 py-3",
				"border-b border-border last:border-b-0",
				"hover:bg-bg-tertiary transition-colors duration-100",
			)}
		>
			{/* Timeline dot + line */}
			<div className="flex flex-col items-center gap-1 shrink-0 mt-1">
				<span
					className={cn(
						"w-2.5 h-2.5 rounded-full shrink-0",
						COLOR_CLASSES[event.color],
					)}
					aria-hidden="true"
				/>
			</div>

			{/* Time */}
			<span
				className="text-xs font-mono text-text-muted w-20 shrink-0 mt-0.5 tabular-nums"
				dir="ltr"
			>
				{formatTime(event.ts)}
			</span>

			{/* Badge */}
			<span
				className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium shrink-0 mt-0.5"
				style={{
					background: COLOR_BADGE_BG[event.color],
					color: `var(--color-accent-${event.color === "yellow" ? "amber" : event.color})`,
					border: `1px solid ${COLOR_BADGE_BORDER[event.color]}`,
				}}
			>
				{event.badgeLabel}
			</span>

			{/* Description */}
			<span className="flex-1 text-sm text-text-primary leading-relaxed min-w-0">
				{event.description}
			</span>

			{/* Meta */}
			{event.meta && (
				<span className="text-xs text-text-muted shrink-0 mt-0.5 font-mono truncate max-w-32">
					{event.meta}
				</span>
			)}
		</div>
	);
}

// ── Status bar ───────────────────────────────────────────────────────────────

function StatusBar({
	total,
	isLoading,
	lastUpdate,
}: {
	total: number;
	isLoading: boolean;
	lastUpdate: string;
}) {
	return (
		<div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-secondary/60">
			<div className="flex items-center gap-2 text-xs text-text-muted">
				<span
					className="w-2 h-2 rounded-full bg-accent-green animate-pulse"
					aria-hidden="true"
				/>
				<span>עדכון אוטומטי כל 3 שניות</span>
			</div>
			<div className="flex items-center gap-3 text-xs text-text-muted">
				{isLoading && (
					<RefreshCw
						size={12}
						className="animate-spin text-accent-blue"
						aria-hidden="true"
					/>
				)}
				<span>{total} אירועים</span>
				{lastUpdate && (
					<span className="font-mono" dir="ltr">
						{lastUpdate}
					</span>
				)}
			</div>
		</div>
	);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ActivityFeedPage() {
	const watcherQuery = useHydraWatcher();
	const notifQuery = useNotificationsLog();
	const agentsQuery = useAgentsLive();

	// Track previous agent PIDs to detect starts/stops
	const prevAgentPids = useRef<Set<number>>(new Set());

	const isLoading =
		watcherQuery.isFetching || notifQuery.isFetching || agentsQuery.isFetching;

	const feed = useMemo<FeedEvent[]>(() => {
		const events: FeedEvent[] = [];

		// ── Watcher events ─────────────────────────────────────────────
		const watcherData = watcherQuery.data ?? [];
		for (let i = 0; i < watcherData.length; i++) {
			const ev = watcherData[i];
			events.push({
				id: `watcher-${i}-${ev.ts}`,
				ts: ev.ts,
				tsMs: toMs(ev.ts),
				color: watcherEventColor(ev),
				badgeLabel: watcherBadgeLabel(ev),
				description: watcherDescription(ev),
				meta: ev.task_id,
			});
		}

		// ── Notification events ────────────────────────────────────────
		const notifData = notifQuery.data ?? [];
		for (let i = 0; i < notifData.length; i++) {
			const ev = notifData[i];
			events.push({
				id: `notif-${i}-${ev.ts}`,
				ts: ev.ts,
				tsMs: toMs(ev.ts),
				color: notificationEventColor(ev),
				badgeLabel: notificationBadgeLabel(ev),
				description: ev.message || ev.event,
				meta: ev.sent ? "נשלח" : "לא נשלח",
			});
		}

		// ── Agent start/stop events (diff against prev set) ───────────
		const liveAgents = agentsQuery.data?.live_agents ?? [];
		const currentPids = new Set<number>(
			liveAgents.map((a: LiveAgent) => a.pid),
		);

		// Detect newly started agents (pids in current but not prev)
		for (const agent of liveAgents) {
			if (!prevAgentPids.current.has(agent.pid)) {
				const started = agent.started ?? new Date().toISOString();
				events.push({
					id: `agent-start-${agent.pid}`,
					ts: started,
					tsMs: toMs(started),
					color: "green",
					badgeLabel: "סוכן",
					description: agentDescription(agent, "start"),
					meta: `pid ${agent.pid}`,
				});
			}
		}

		// Detect stopped agents (pids in prev but not current)
		if (prevAgentPids.current.size > 0) {
			for (const pid of prevAgentPids.current) {
				if (!currentPids.has(pid)) {
					const now = new Date().toISOString();
					events.push({
						id: `agent-stop-${pid}-${Date.now()}`,
						ts: now,
						tsMs: toMs(now),
						color: "yellow",
						badgeLabel: "סוכן",
						description: `סוכן נעצר (pid ${pid})`,
						meta: `pid ${pid}`,
					});
				}
			}
		}

		// Update ref for next render
		prevAgentPids.current = currentPids;

		// Sort newest first, take last 100
		events.sort((a, b) => b.tsMs - a.tsMs);
		return events.slice(0, 100);
	}, [watcherQuery.data, notifQuery.data, agentsQuery.data]);

	const lastUpdate = useMemo(() => {
		if (!feed.length) return "";
		const newest = feed[0];
		return formatTime(newest.ts);
	}, [feed]);

	const hasError =
		watcherQuery.isError && notifQuery.isError && agentsQuery.isError;

	return (
		<div dir="rtl" className="flex flex-col gap-6">
			<PageHeader
				title="פיד פעילות"
				description="כל האירועים במערכת בזמן אמת"
				icon={Activity}
			/>

			<div className="glass-card overflow-hidden">
				<StatusBar
					total={feed.length}
					isLoading={isLoading}
					lastUpdate={lastUpdate}
				/>

				{hasError ? (
					<div className="px-4 py-8">
						<EmptyState
							icon={Activity}
							title="שגיאה בטעינת אירועים"
							description="לא ניתן לטעון נתונים מהשרת. בדוק שהשרת פועל."
						/>
					</div>
				) : feed.length === 0 ? (
					<div className="px-4 py-8">
						<EmptyState
							icon={Activity}
							title="אין אירועים עדיין"
							description="האירועים יופיעו כאן בזמן אמת ברגע שיתרחשו."
						/>
					</div>
				) : (
					<ul className="list-none m-0 p-0" aria-label="פיד פעילות">
						{feed.map((event) => (
							<li key={event.id}>
								<FeedRow event={event} />
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
