import ReactECharts from "echarts-for-react";
import { CheckCircle2, Clock, ListChecks, XCircle, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
	useHydraScores,
	useHydraTasks,
	useHydraWatcher,
} from "@/hooks/use-api";
import type { HydraTask, WatcherEvent } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Provider config ──────────────────────────────────────────────────────────

interface ProviderMeta {
	label: string;
	color: string;
	colorDim: string;
}

const PROVIDERS: Record<string, ProviderMeta> = {
	codex: {
		label: "Codex",
		color: "oklch(0.65 0.18 250)",
		colorDim: "oklch(0.65 0.18 250 / 0.2)",
	},
	kimi: {
		label: "Kimi",
		color: "oklch(0.75 0.14 200)",
		colorDim: "oklch(0.75 0.14 200 / 0.2)",
	},
	gemini: {
		label: "Gemini",
		color: "oklch(0.72 0.19 155)",
		colorDim: "oklch(0.72 0.19 155 / 0.2)",
	},
	minimax: {
		label: "MiniMax",
		color: "oklch(0.62 0.2 290)",
		colorDim: "oklch(0.62 0.2 290 / 0.2)",
	},
};

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
		task_start: "התחלה",
		task_complete: "הושלם",
		task_failed: "נכשל",
		watcher_start: "צופה הופעל",
		watcher_stop: "צופה נעצר",
		health_check: "בריאות",
		import_error: "שגיאה",
	};
	return MAP[event] ?? event;
}

function eventDotColor(event: string): string {
	if (event.includes("fail") || event.includes("error"))
		return "bg-[var(--color-status-critical)]";
	if (event.includes("complete")) return "bg-[var(--color-status-healthy)]";
	if (event.includes("start")) return "bg-[var(--color-status-running)]";
	return "bg-[var(--color-text-muted)]";
}

// ── Score Gauge Card ─────────────────────────────────────────────────────────

function ScoreCard({
	providerKey,
	score,
}: {
	providerKey: string;
	score: number;
}) {
	const meta = PROVIDERS[providerKey] ?? {
		label: providerKey,
		color: "oklch(0.65 0.18 250)",
		colorDim: "oklch(0.65 0.18 250 / 0.2)",
	};
	const pct = Math.round(score * 100);

	return (
		<div
			className="glass-card p-4 flex flex-col gap-3"
			style={{
				borderColor: `oklch(from ${meta.color} l c h / 0.3)`,
			}}
		>
			<div className="flex items-center justify-between">
				<span className="text-sm font-semibold text-[var(--color-text-primary)]">
					{meta.label}
				</span>
				<span
					className="text-xs font-mono font-bold tabular-nums"
					style={{ color: meta.color }}
					dir="ltr"
				>
					{score.toFixed(3)}
				</span>
			</div>

			{/* Score bar */}
			<div className="relative h-2 w-full rounded-full bg-[var(--color-bg-elevated)]">
				<div
					className="h-full rounded-full transition-all duration-700 ease-out"
					style={{
						width: `${pct}%`,
						background: meta.color,
						boxShadow: `0 0 8px ${meta.colorDim}`,
					}}
				/>
			</div>

			<div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
				<span>בייסיאן ציון</span>
				<span className="font-medium" style={{ color: meta.color }} dir="ltr">
					{pct}%
				</span>
			</div>
		</div>
	);
}

// ── Task Row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, status }: { task: HydraTask; status: string }) {
	const statusColors: Record<string, string> = {
		pending: "text-[var(--color-text-muted)]",
		in_progress: "text-[var(--color-status-running)]",
		completed: "text-[var(--color-status-healthy)]",
		verified: "text-[var(--color-status-healthy)]",
		failed: "text-[var(--color-status-critical)]",
	};

	return (
		<div className="flex items-center gap-2 py-2 border-b border-[var(--color-border)] last:border-0">
			<span
				className={cn("text-xs font-medium shrink-0", statusColors[status])}
			>
				{task.status}
			</span>
			<span
				className="text-xs text-[var(--color-text-secondary)] truncate flex-1 font-mono"
				dir="ltr"
			>
				{task.display_name ?? task.id}
			</span>
			{task.steps !== undefined && (
				<span
					className="text-xs text-[var(--color-text-muted)] shrink-0 tabular-nums"
					dir="ltr"
				>
					{task.steps}s
				</span>
			)}
		</div>
	);
}

// ── Watcher Timeline ─────────────────────────────────────────────────────────

function WatcherTimeline({ events }: { events: WatcherEvent[] }) {
	const recent = [...events].reverse().slice(0, 20);

	if (recent.length === 0) {
		return (
			<p className="text-sm text-[var(--color-text-muted)] text-center py-6">
				אין אירועים עדיין
			</p>
		);
	}

	return (
		<div className="flex flex-col">
			{recent.map((ev) => (
				<div
					key={`${ev.ts}-${ev.event}`}
					className="flex items-start gap-3 py-2.5 border-b border-[var(--color-border)] last:border-0"
				>
					{/* Timeline dot */}
					<div className="flex flex-col items-center pt-1 shrink-0">
						<span
							className={cn(
								"w-2 h-2 rounded-full shrink-0",
								eventDotColor(ev.event),
							)}
						/>
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							<span className="text-xs font-medium text-[var(--color-text-primary)]">
								{eventLabel(ev.event)}
							</span>
							{ev.provider && (
								<span className="text-xs text-[var(--color-accent-purple)]">
									{ev.provider}
								</span>
							)}
							{ev.task_id && (
								<span
									className="text-xs text-[var(--color-text-muted)] font-mono truncate"
									dir="ltr"
								>
									{ev.task_id}
								</span>
							)}
						</div>
						<span
							className="text-xs text-[var(--color-text-muted)] tabular-nums"
							dir="ltr"
						>
							{formatTs(ev.ts)}
						</span>
					</div>
					{ev.rc !== undefined && (
						<span
							className={cn(
								"shrink-0 mt-0.5",
								ev.rc === 0
									? "text-[var(--color-status-healthy)]"
									: "text-[var(--color-status-critical)]",
							)}
						>
							{ev.rc === 0 ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
						</span>
					)}
				</div>
			))}
		</div>
	);
}

// ── ECharts: Bayesian Bar ─────────────────────────────────────────────────────

function BayesianChart({ scores }: { scores: Record<string, number> }) {
	const providers = Object.keys(PROVIDERS);
	const values = providers.map((p) => scores[p] ?? 0);
	const colors = providers.map(
		(p) => PROVIDERS[p]?.color ?? "oklch(0.65 0.18 250)",
	);

	// rtl-ok: ECharts grid left/right are internal chart pixel offsets, not CSS direction
	const option = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis",
			backgroundColor: "oklch(0.19 0.015 260)",
			borderColor: "oklch(0.28 0.02 260)",
			textStyle: { color: "oklch(0.95 0.01 260)", fontSize: 12 },
			formatter: (params: { name: string; value: number }[]) => {
				const p = params[0];
				if (!p) return "";
				return `${p.name}: ${(p.value * 100).toFixed(1)}%`;
			},
		},
		grid: { top: 8, bottom: 24, left: 44, right: 12 }, // rtl-ok
		xAxis: {
			type: "category",
			data: providers.map((p) => PROVIDERS[p]?.label ?? p),
			axisLabel: { color: "oklch(0.72 0.02 260)", fontSize: 11 },
			axisLine: { lineStyle: { color: "oklch(0.28 0.02 260)" } },
			axisTick: { show: false },
		},
		yAxis: {
			type: "value",
			min: 0,
			max: 1,
			axisLabel: {
				color: "oklch(0.55 0.02 260)",
				fontSize: 10,
				formatter: (v: number) => `${(v * 100).toFixed(0)}%`,
			},
			splitLine: { lineStyle: { color: "oklch(0.22 0.02 260)" } },
		},
		series: [
			{
				type: "bar",
				data: values.map((v, i) => ({
					value: v,
					itemStyle: {
						color: colors[i],
						borderRadius: [4, 4, 0, 0],
					},
				})),
				barMaxWidth: 48,
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: 180 }}
			opts={{ renderer: "canvas" }}
		/>
	);
}

// ── ECharts: Task Status Pie ──────────────────────────────────────────────────

function TaskPieChart({
	pending,
	inProgress,
	completed,
	failed,
}: {
	pending: number;
	inProgress: number;
	completed: number;
	failed: number;
}) {
	const total = pending + inProgress + completed + failed;

	// rtl-ok: ECharts legend right/center/left are internal chart layout, not CSS direction
	const option = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			backgroundColor: "oklch(0.19 0.015 260)",
			borderColor: "oklch(0.28 0.02 260)",
			textStyle: { color: "oklch(0.95 0.01 260)", fontSize: 12 },
			formatter: "{b}: {c} ({d}%)",
		},
		legend: {
			orient: "vertical",
			right: 8, // rtl-ok
			top: "center", // rtl-ok
			textStyle: { color: "oklch(0.72 0.02 260)", fontSize: 11 },
		},
		series: [
			{
				type: "pie",
				radius: ["45%", "72%"],
				center: ["38%", "50%"], // rtl-ok
				data: [
					{
						value: pending,
						name: "ממתין",
						itemStyle: { color: "oklch(0.55 0.02 260)" },
					},
					{
						value: inProgress,
						name: "פעיל",
						itemStyle: { color: "oklch(0.65 0.18 250)" },
					},
					{
						value: completed,
						name: "הושלם",
						itemStyle: { color: "oklch(0.72 0.19 155)" },
					},
					{
						value: failed,
						name: "נכשל",
						itemStyle: { color: "oklch(0.62 0.22 25)" },
					},
				].filter((d) => d.value > 0),
				label: { show: false },
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0,0,0,0.4)",
					},
				},
			},
		],
		graphic:
			total === 0
				? []
				: [
						{
							type: "text",
							left: "34%", // rtl-ok — ECharts graphic pixel offset
							top: "center", // rtl-ok
							style: {
								text: String(total),
								textAlign: "center",
								fill: "oklch(0.95 0.01 260)",
								fontSize: 18,
								fontWeight: "bold",
							},
						},
					],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: 180 }}
			opts={{ renderer: "canvas" }}
		/>
	);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HydraPage() {
	const scores = useHydraScores();
	const tasks = useHydraTasks();
	const watcher = useHydraWatcher();

	if (scores.isLoading || tasks.isLoading || watcher.isLoading)
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex items-center gap-3 text-text-muted">
					<Zap size={18} className="animate-spin" />
					<span>טוען נתוני Hydra...</span>
				</div>
			</div>
		);

	if (scores.error || tasks.error || watcher.error)
		return (
			<div className="p-8 text-center text-[var(--color-accent-red)]">
				שגיאה בטעינת נתונים
			</div>
		);

	// providers → Record<string, HydraProviderScore>; extract just the score number
	const rawProviders = scores.data?.providers ?? {};
	const scoresData: Record<string, number> = Object.fromEntries(
		Object.entries(rawProviders).map(([k, v]) => [k, v.score]),
	);

	// tasks is HydraTask[] — partition by status
	const allTasks = tasks.data ?? [];
	const pendingTasks = allTasks.filter((t) => t.status === "pending");
	const inProgressTasks = allTasks.filter((t) => t.status === "in_progress");
	const completedTasks = allTasks.filter(
		(t) => t.status === "completed" || t.status === "verified",
	);
	const failedTasks = allTasks.filter((t) => t.status === "failed");

	const pendingCount = pendingTasks.length;
	const inProgressCount = inProgressTasks.length;
	const completedCount = completedTasks.length;
	const failedCount = failedTasks.length;

	return (
		<div className="flex flex-col gap-6 bg-zinc-950 min-h-screen p-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Zap
					size={20}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						הידרה v2
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						ניהול LangGraph · ניקודים בייסיאניים · תורי משימות
					</p>
				</div>
			</div>

			{/* Provider Score Cards */}
			<div>
				<h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
					ניקודים בייסיאניים
				</h2>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
					{Object.keys(PROVIDERS).map((p) => (
						<ScoreCard key={p} providerKey={p} score={scoresData[p] ?? 0.5} />
					))}
				</div>
			</div>

			{/* Charts row */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<GlassCard title="ניקודי ספקים" icon={<Zap size={16} />}>
					<BayesianChart scores={scoresData} />
				</GlassCard>
				<GlassCard title="סטטוס משימות" icon={<ListChecks size={16} />}>
					<TaskPieChart
						pending={pendingCount}
						inProgress={inProgressCount}
						completed={completedCount}
						failed={failedCount}
					/>
				</GlassCard>
			</div>

			{/* Task Queues */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{/* Pending */}
				<GlassCard
					title={`ממתין (${pendingCount})`}
					icon={<Clock size={16} className="text-[var(--color-text-muted)]" />}
				>
					{pendingCount === 0 ? (
						<p className="text-xs text-[var(--color-text-muted)] text-center py-4">
							אין משימות
						</p>
					) : (
						<div className="overflow-y-auto max-h-48">
							{pendingTasks.map((t) => (
								<TaskRow key={t.id} task={t} status="pending" />
							))}
						</div>
					)}
				</GlassCard>

				{/* In Progress */}
				<GlassCard
					title={`פעיל (${inProgressCount})`}
					icon={
						<Zap size={16} className="text-[var(--color-status-running)]" />
					}
				>
					{inProgressCount === 0 ? (
						<p className="text-xs text-[var(--color-text-muted)] text-center py-4">
							אין משימות
						</p>
					) : (
						<div className="overflow-y-auto max-h-48">
							{inProgressTasks.map((t) => (
								<TaskRow key={t.id} task={t} status="in_progress" />
							))}
						</div>
					)}
				</GlassCard>

				{/* Completed */}
				<GlassCard
					title={`הושלם (${completedCount})`}
					icon={
						<CheckCircle2
							size={16}
							className="text-[var(--color-status-healthy)]"
						/>
					}
				>
					{completedCount === 0 ? (
						<p className="text-xs text-[var(--color-text-muted)] text-center py-4">
							אין משימות
						</p>
					) : (
						<div className="overflow-y-auto max-h-48">
							{completedTasks.map((t) => (
								<TaskRow key={t.id} task={t} status="completed" />
							))}
						</div>
					)}
				</GlassCard>

				{/* Failed */}
				<GlassCard
					title={`נכשל (${failedCount})`}
					icon={
						<XCircle
							size={16}
							className="text-[var(--color-status-critical)]"
						/>
					}
				>
					{failedCount === 0 ? (
						<p className="text-xs text-[var(--color-text-muted)] text-center py-4">
							אין משימות
						</p>
					) : (
						<div className="overflow-y-auto max-h-48">
							{failedTasks.map((t) => (
								<TaskRow key={t.id} task={t} status="failed" />
							))}
						</div>
					)}
				</GlassCard>
			</div>

			{/* Watcher Timeline */}
			<GlassCard
				title="ציר זמן — צופה"
				subtitle="20 אירועים אחרונים"
				icon={<Clock size={16} />}
			>
				<WatcherTimeline events={watcher.data?.events ?? []} />
			</GlassCard>
		</div>
	);
}
