import {
	Activity,
	CheckCircle2,
	DollarSign,
	TrendingUp,
	Users,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type {
	AgentHeartbeat,
	BudgetStatus,
	HydraProviderScore,
} from "@/lib/api";
import { cn } from "@/lib/cn";

type KnownProvider = "codex" | "gemini" | "kimi" | "minimax" | "hermes";

interface ProviderMeta {
	label: string;
	color: string;
	badgeClass: string;
}

const PROVIDER_META: Record<KnownProvider, ProviderMeta> = {
	codex: {
		label: "Codex",
		color: "var(--color-accent-blue)",
		badgeClass:
			"border-[oklch(0.65_0.18_250_/_0.3)] bg-[oklch(0.65_0.18_250_/_0.12)] text-[var(--color-accent-blue)]",
	},
	gemini: {
		label: "Gemini",
		color: "var(--color-accent-green)",
		badgeClass:
			"border-[oklch(0.72_0.19_155_/_0.3)] bg-[oklch(0.72_0.19_155_/_0.12)] text-[var(--color-accent-green)]",
	},
	kimi: {
		label: "Kimi",
		color: "var(--color-accent-cyan)",
		badgeClass:
			"border-[oklch(0.75_0.14_200_/_0.3)] bg-[oklch(0.75_0.14_200_/_0.12)] text-[var(--color-accent-cyan)]",
	},
	minimax: {
		label: "MiniMax",
		color: "var(--color-accent-purple)",
		badgeClass:
			"border-[oklch(0.62_0.2_290_/_0.3)] bg-[oklch(0.62_0.2_290_/_0.12)] text-[var(--color-accent-purple)]",
	},
	hermes: {
		label: "Hermes",
		color: "var(--color-accent-amber)",
		badgeClass:
			"border-[oklch(0.78_0.16_75_/_0.3)] bg-[oklch(0.78_0.16_75_/_0.12)] text-[var(--color-accent-amber)]",
	},
};

const FALLBACK_META: ProviderMeta = {
	label: "לא ידוע",
	color: "var(--color-text-muted)",
	badgeClass:
		"border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]",
};

function getProviderMeta(provider: string): ProviderMeta {
	const key = provider.trim().toLowerCase() as KnownProvider;
	return (
		PROVIDER_META[key] ?? {
			...FALLBACK_META,
			label: provider || FALLBACK_META.label,
		}
	);
}

function formatCostCents(cents: number): string {
	return `$${(cents / 100).toFixed(2)}`;
}

function formatWinRate(score: HydraProviderScore | undefined): string {
	if (!score) return "—";
	if (score.total === 0) return "—";
	return `${Math.round(score.score * 100)}%`;
}

interface ProviderCardProps {
	provider: string;
	agents: AgentHeartbeat[];
	budget: BudgetStatus | undefined;
	score: HydraProviderScore | undefined;
}

function ProviderCard({ provider, agents, budget, score }: ProviderCardProps) {
	const meta = getProviderMeta(provider);
	const activeAgents = agents.filter(
		(a) =>
			a.provider.trim().toLowerCase() === provider.trim().toLowerCase() &&
			a.status === "running",
	);
	const totalAgents = agents.filter(
		(a) => a.provider.trim().toLowerCase() === provider.trim().toLowerCase(),
	);
	const totalCost = totalAgents.reduce(
		(sum, a) => sum + (a.cost_cents ?? 0),
		0,
	);

	return (
		<div
			className="rounded-2xl border bg-[var(--color-bg-elevated)]/20 p-4 transition-colors duration-200 hover:border-[var(--color-border-hover)]"
			style={{ borderColor: `oklch(from ${meta.color} l c h / 0.25)` }}
		>
			{/* Header */}
			<div className="mb-4 flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
							meta.badgeClass,
						)}
						dir="ltr"
					>
						{meta.label}
					</span>
				</div>
				{activeAgents.length > 0 && (
					<span className="flex items-center gap-1 text-xs font-medium text-[var(--color-status-running)]">
						<span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-status-running)]" />
						פעיל
					</span>
				)}
			</div>

			{/* Metrics grid */}
			<div className="grid grid-cols-2 gap-2">
				<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 p-2.5">
					<div className="mb-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
						<Users size={11} aria-hidden="true" />
						<span>סוכנים</span>
					</div>
					<div className="flex items-baseline gap-1" dir="ltr">
						<span
							className="text-base font-bold tabular-nums"
							style={{ color: meta.color }}
						>
							{activeAgents.length}
						</span>
						<span className="text-xs text-[var(--color-text-muted)]">
							/ {totalAgents.length}
						</span>
					</div>
				</div>

				<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 p-2.5">
					<div className="mb-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
						<TrendingUp size={11} aria-hidden="true" />
						<span>אחוז הצלחה</span>
					</div>
					<div
						className="text-base font-bold tabular-nums"
						style={{ color: meta.color }}
						dir="ltr"
					>
						{formatWinRate(score)}
					</div>
				</div>

				<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 p-2.5">
					<div className="mb-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
						<DollarSign size={11} aria-hidden="true" />
						<span>עלות יומית</span>
					</div>
					<div
						className="text-base font-bold tabular-nums"
						style={{ color: meta.color }}
						dir="ltr"
					>
						{budget ? formatCostCents(budget.daily_spent_cents) : "—"}
					</div>
				</div>

				<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 p-2.5">
					<div className="mb-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
						<CheckCircle2 size={11} aria-hidden="true" />
						<span>הושלמו</span>
					</div>
					<div
						className="text-base font-bold tabular-nums"
						style={{ color: meta.color }}
						dir="ltr"
					>
						{score ? (score.successes ?? 0).toLocaleString("he-IL") : "—"}
					</div>
				</div>
			</div>

			{/* Cost breakdown from agent sessions */}
			{totalCost > 0 && (
				<div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 px-3 py-2">
					<span className="text-xs text-[var(--color-text-muted)]">
						עלות סשן נוכחי
					</span>
					<span
						className="text-xs font-semibold tabular-nums"
						dir="ltr"
						style={{ color: meta.color }}
					>
						{formatCostCents(totalCost)}
					</span>
				</div>
			)}
		</div>
	);
}

interface ProviderHealthProps {
	agents: AgentHeartbeat[];
	budgets: BudgetStatus[];
	scores: Record<string, HydraProviderScore>;
}

const ALL_PROVIDERS: KnownProvider[] = [
	"codex",
	"gemini",
	"kimi",
	"minimax",
	"hermes",
];

export function ProviderHealth({
	agents,
	budgets,
	scores,
}: ProviderHealthProps) {
	// Collect providers seen in live agents + always show the canonical 5
	const seenProviders = new Set(
		agents.map((a) => a.provider.trim().toLowerCase()),
	);
	const providers = ALL_PROVIDERS.filter(
		(p) =>
			seenProviders.has(p) ||
			p in scores ||
			budgets.some((b) => b.provider.toLowerCase() === p),
	);

	// Fall back to all 5 if nothing is live yet
	const displayProviders = providers.length > 0 ? providers : ALL_PROVIDERS;

	const totalActive = agents.filter((a) => a.status === "running").length;
	const totalAgents = agents.length;

	return (
		<GlassCard
			title="בריאות ספקים"
			subtitle={
				totalAgents > 0
					? `${totalActive} פעיל מתוך ${totalAgents} סוכנים`
					: "אין נתוני ספקים זמינים"
			}
			icon={<Activity size={16} />}
			className="h-full"
		>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
				{displayProviders.map((provider) => (
					<ProviderCard
						key={provider}
						provider={provider}
						agents={agents}
						budget={budgets.find(
							(b) => b.provider.trim().toLowerCase() === provider,
						)}
						score={scores[provider]}
					/>
				))}
			</div>
		</GlassCard>
	);
}
