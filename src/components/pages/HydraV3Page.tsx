import {
	Activity,
	DollarSign,
	ListChecks,
	ShieldAlert,
	TrendingUp,
	Zap,
} from "lucide-react";
import type { AgentHeartbeat as AgentGridHeartbeat } from "@/components/hydra-v3/AgentGrid";
import { AgentGrid } from "@/components/hydra-v3/AgentGrid";
import { ApprovalQueue } from "@/components/hydra-v3/ApprovalQueue";
import type {
	BoardAction,
	BoardControlAgent,
} from "@/components/hydra-v3/BoardControls";
import { BoardControls } from "@/components/hydra-v3/BoardControls";
import { BudgetGauge } from "@/components/hydra-v3/BudgetGauge";
import { ProviderHealth } from "@/components/hydra-v3/ProviderHealth";
import { TaskQueue } from "@/components/hydra-v3/TaskQueue";
import { WaveTimeline } from "@/components/hydra-v3/WaveTimeline";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import {
	useAgentHeartbeats,
	useApprovals,
	useBudgetStatus,
	useHydraScores,
	useHydraTasks,
	useWaveHistory,
} from "@/hooks/use-api";
import type { AgentHeartbeat as ApiAgentHeartbeat } from "@/lib/api";

// ── Type adapter ────────────────────────────────────────────────────────────
// lib/api.ts status is `string`; AgentGrid expects the discriminated union.
// Narrow it defensively — unknown values fall back to "dead".

const KNOWN_STATUSES = new Set(["running", "paused", "done", "failed", "dead"]);

function toGridStatus(
	s: string,
): "running" | "paused" | "done" | "failed" | "dead" {
	const normalized = s.trim().toLowerCase();
	if (KNOWN_STATUSES.has(normalized)) {
		return normalized as "running" | "paused" | "done" | "failed" | "dead";
	}
	// Map common aliases
	if (normalized === "in_progress" || normalized === "active") return "running";
	if (normalized === "completed" || normalized === "verified") return "done";
	if (normalized === "terminated" || normalized === "killed") return "dead";
	return "dead";
}

function apiHeartbeatToGrid(a: ApiAgentHeartbeat): AgentGridHeartbeat {
	return {
		agent_id: a.agent_id,
		session: a.session,
		provider: a.provider,
		status: toGridStatus(a.status),
		last_output: a.last_output,
		runtime_seconds: a.runtime_seconds,
		task_id: a.task_id,
		wave_id: a.wave_id,
		cost_cents: a.cost_cents,
	};
}

function apiHeartbeatToBoardControl(a: ApiAgentHeartbeat): BoardControlAgent {
	return {
		agent_id: a.agent_id,
		status: a.status,
		provider: a.provider,
		task_id: a.task_id,
		session: a.session,
	};
}

// ── Tab definitions ─────────────────────────────────────────────────────────

const TABS: Array<{ id: string; label: string; icon?: typeof Activity }> = [
	{ id: "live", label: "סוכנים חיים", icon: Activity },
	{ id: "providers", label: "ספקים", icon: TrendingUp },
	{ id: "tasks", label: "משימות", icon: ListChecks },
	{ id: "waves", label: "גלים", icon: Zap },
	{ id: "budget", label: "תקציב", icon: DollarSign },
	{ id: "approvals", label: "אישורים", icon: ShieldAlert },
];

// ── Summary stat strip ──────────────────────────────────────────────────────

function StatStrip({
	activeAgents,
	totalAgents,
	pendingApprovals,
	totalTasks,
	activeTasks,
}: {
	activeAgents: number;
	totalAgents: number;
	pendingApprovals: number;
	totalTasks: number;
	activeTasks: number;
}) {
	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/20 p-4">
				<p className="text-xs text-[var(--color-text-muted)]">סוכנים פעילים</p>
				<p
					className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-status-running)]"
					dir="ltr"
				>
					{activeAgents}
					<span className="ms-1 text-sm font-normal text-[var(--color-text-muted)]">
						/ {totalAgents}
					</span>
				</p>
			</div>
			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/20 p-4">
				<p className="text-xs text-[var(--color-text-muted)]">משימות פעילות</p>
				<p
					className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-accent-blue)]"
					dir="ltr"
				>
					{activeTasks}
					<span className="ms-1 text-sm font-normal text-[var(--color-text-muted)]">
						/ {totalTasks}
					</span>
				</p>
			</div>
			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/20 p-4">
				<p className="text-xs text-[var(--color-text-muted)]">ממתין לאישור</p>
				<p
					className={`mt-1 text-2xl font-bold tabular-nums ${pendingApprovals > 0 ? "text-[var(--color-accent-amber)]" : "text-[var(--color-text-muted)]"}`}
					dir="ltr"
				>
					{pendingApprovals}
				</p>
			</div>
			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/20 p-4">
				<p className="text-xs text-[var(--color-text-muted)]">רענון אוטומטי</p>
				<p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-status-healthy)]">
					<span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--color-status-healthy)]" />
					כל 5 שניות
				</p>
			</div>
		</div>
	);
}

// ── Page ────────────────────────────────────────────────────────────────────

export function HydraV3Page() {
	// Data hooks — all with built-in refetch intervals from use-api.ts
	const heartbeatsQuery = useAgentHeartbeats(); // 5s
	const budgetQuery = useBudgetStatus(); // 30s
	const wavesQuery = useWaveHistory(); // 10s
	const approvalsQuery = useApprovals(); // 15s
	const tasksQuery = useHydraTasks(); // 3s
	const scoresQuery = useHydraScores(); // 10s

	const apiAgents = heartbeatsQuery.data ?? [];
	const gridAgents = apiAgents.map(apiHeartbeatToGrid);
	const boardAgents = apiAgents.map(apiHeartbeatToBoardControl);

	const budgets = budgetQuery.data ?? [];
	const waves = wavesQuery.data ?? [];
	const approvals = approvalsQuery.data ?? [];
	const tasks = tasksQuery.data ?? [];
	const scores = scoresQuery.data?.providers ?? {};

	const activeAgents = gridAgents.filter((a) => a.status === "running").length;
	const activeTasks = tasks.filter((t) =>
		["pending", "in_progress"].includes(t.status.trim().toLowerCase()),
	).length;
	const pendingApprovals = approvals.length;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Hydra v3 — ניהול סוכנים"
				description="ניטור רב-מודלי בזמן אמת עם אכיפת תקציב ושערי אישור"
			/>

			{/* Summary strip */}
			<StatStrip
				activeAgents={activeAgents}
				totalAgents={gridAgents.length}
				pendingApprovals={pendingApprovals}
				totalTasks={tasks.length}
				activeTasks={activeTasks}
			/>

			{/* Tabs */}
			<Tabs tabs={TABS} defaultTab="live">
				{(activeTab) => (
					<>
						{/* ── Live Agents ── */}
						{activeTab === "live" && (
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
								<div className="lg:col-span-2">
									{heartbeatsQuery.isLoading ? (
										<div className="animate-pulse h-64 rounded-2xl bg-[var(--color-bg-elevated)]/30" />
									) : gridAgents.length === 0 ? (
										<div className="glass-card flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-center">
											<EmptyState
												icon={Activity}
												title="אין סוכנים פעילים"
												description="כאשר heartbeats יגיעו מהמערכת, הכרטיסים יופיעו כאן בזמן אמת"
											/>
										</div>
									) : (
										<AgentGrid agents={gridAgents} />
									)}
								</div>
								<div>
									<BoardControls
										agents={boardAgents}
										onAction={async (_action: BoardAction) => {
											/* mutations handled internally by BoardControls */
										}}
									/>
								</div>
							</div>
						)}

						{/* ── Provider Health ── */}
						{activeTab === "providers" && (
							<ProviderHealth
								agents={apiAgents}
								budgets={budgets}
								scores={scores}
							/>
						)}

						{/* ── Task Queue ── */}
						{activeTab === "tasks" && <TaskQueue tasks={tasks} />}

						{/* ── Wave Timeline ── */}
						{activeTab === "waves" &&
							(waves.length === 0 && !wavesQuery.isLoading ? (
								<GlassCard title="ציר גלי ביצוע" icon={<Zap size={16} />}>
									<EmptyState
										icon={Zap}
										title="אין היסטוריית גלים"
										description="כאשר יגיעו גלי ביצוע אמיתיים, הם יופיעו כאן מהחדש לישן"
										className="py-8"
									/>
								</GlassCard>
							) : (
								<WaveTimeline waves={waves} />
							))}

						{/* ── Budget ── */}
						{activeTab === "budget" && <BudgetGauge budgets={budgets} />}

						{/* ── Approvals ── */}
						{activeTab === "approvals" && (
							<GlassCard title="תור אישורים" icon={<ShieldAlert size={18} />}>
								<ApprovalQueue requests={[]} />
							</GlassCard>
						)}
					</>
				)}
			</Tabs>
		</div>
	);
}
