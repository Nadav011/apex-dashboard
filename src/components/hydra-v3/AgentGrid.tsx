import {
	Activity,
	CheckCircle2,
	Clock,
	type LucideIcon,
	Pause,
	XCircle,
	Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/cn";

export interface AgentHeartbeat {
	agent_id: string;
	session: string;
	provider: string;
	status: "running" | "paused" | "done" | "failed" | "dead";
	last_output: string;
	runtime_seconds: number;
	task_id: string;
	wave_id: string;
	cost_cents?: number;
}

type KnownProvider = "codex" | "gemini" | "kimi" | "minimax";

interface ProviderMeta {
	label: string;
	badgeClassName: string;
	iconClassName: string;
}

interface StatusMeta {
	label: string;
	icon: LucideIcon;
	badgeClassName: string;
	iconClassName: string;
}

const PROVIDER_META: Record<KnownProvider, ProviderMeta> = {
	codex: {
		label: "codex",
		badgeClassName:
			"border-[oklch(0.65_0.18_250_/_0.25)] bg-[oklch(0.65_0.18_250_/_0.12)] text-[var(--color-accent-blue)]",
		iconClassName: "text-[var(--color-accent-blue)]",
	},
	gemini: {
		label: "gemini",
		badgeClassName:
			"border-[oklch(0.72_0.19_155_/_0.25)] bg-[oklch(0.72_0.19_155_/_0.12)] text-[var(--color-accent-green)]",
		iconClassName: "text-[var(--color-accent-green)]",
	},
	kimi: {
		label: "kimi",
		badgeClassName:
			"border-[oklch(0.75_0.14_200_/_0.25)] bg-[oklch(0.75_0.14_200_/_0.12)] text-[var(--color-accent-cyan)]",
		iconClassName: "text-[var(--color-accent-cyan)]",
	},
	minimax: {
		label: "minimax",
		badgeClassName:
			"border-[oklch(0.62_0.2_290_/_0.25)] bg-[oklch(0.62_0.2_290_/_0.12)] text-[var(--color-accent-purple)]",
		iconClassName: "text-[var(--color-accent-purple)]",
	},
};

const FALLBACK_PROVIDER_META: ProviderMeta = {
	label: "לא ידוע",
	badgeClassName:
		"border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]",
	iconClassName: "text-[var(--color-text-secondary)]",
};

const STATUS_META: Record<AgentHeartbeat["status"], StatusMeta> = {
	running: {
		label: "רץ",
		icon: Activity,
		badgeClassName:
			"border-[oklch(0.65_0.18_250_/_0.25)] bg-[oklch(0.65_0.18_250_/_0.12)] text-[var(--color-status-running)]",
		iconClassName: "text-[var(--color-status-running)]",
	},
	paused: {
		label: "מושהה",
		icon: Pause,
		badgeClassName:
			"border-[oklch(0.78_0.16_75_/_0.25)] bg-[oklch(0.78_0.16_75_/_0.12)] text-[var(--color-accent-amber)]",
		iconClassName: "text-[var(--color-accent-amber)]",
	},
	done: {
		label: "הושלם",
		icon: CheckCircle2,
		badgeClassName:
			"border-[oklch(0.72_0.19_155_/_0.25)] bg-[oklch(0.72_0.19_155_/_0.12)] text-[var(--color-status-healthy)]",
		iconClassName: "text-[var(--color-status-healthy)]",
	},
	failed: {
		label: "נכשל",
		icon: XCircle,
		badgeClassName:
			"border-[oklch(0.62_0.22_25_/_0.25)] bg-[oklch(0.62_0.22_25_/_0.12)] text-[var(--color-status-critical)]",
		iconClassName: "text-[var(--color-status-critical)]",
	},
	dead: {
		label: "מנותק",
		icon: Clock,
		badgeClassName:
			"border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]",
		iconClassName: "text-[var(--color-text-muted)]",
	},
};

function isKnownProvider(provider: string): provider is KnownProvider {
	return provider in PROVIDER_META;
}

function getProviderMeta(provider: string): ProviderMeta {
	if (isKnownProvider(provider)) {
		return PROVIDER_META[provider];
	}

	return {
		...FALLBACK_PROVIDER_META,
		label: provider || FALLBACK_PROVIDER_META.label,
	};
}

function formatRuntime(runtimeSeconds: number): string {
	const safeSeconds = Math.max(0, Math.floor(runtimeSeconds));
	const minutes = Math.floor(safeSeconds / 60)
		.toString()
		.padStart(2, "0");
	const seconds = (safeSeconds % 60).toString().padStart(2, "0");

	return `${minutes}:${seconds}`;
}

function formatCost(costCents?: number): string {
	if (costCents === undefined) {
		return "—";
	}

	return `$${(costCents / 100).toFixed(2)}`;
}

function getTaskDescription(agent: AgentHeartbeat): string {
	const output = agent.last_output.trim();

	if (output.length > 0) {
		return output;
	}

	return `משימה ${agent.task_id}`;
}

function MetaTile({
	label,
	value,
	icon: Icon,
	dir = "rtl",
	valueClassName,
}: {
	label: string;
	value: string;
	icon: LucideIcon;
	dir?: "ltr" | "rtl";
	valueClassName?: string;
}) {
	return (
		<div className="rounded-xl border border-border bg-bg-elevated/60 p-3">
			<div className="mb-1.5 flex items-center gap-2 text-xs text-text-muted">
				<Icon size={13} className="shrink-0" aria-hidden="true" />
				<span>{label}</span>
			</div>
			<div
				className={cn(
					"text-sm font-semibold text-text-primary",
					dir === "ltr" && "font-mono tabular-nums",
					valueClassName,
				)}
				dir={dir}
			>
				{value}
			</div>
		</div>
	);
}

export function AgentGrid({ agents }: { agents: AgentHeartbeat[] }) {
	if (agents.length === 0) {
		return (
			<div className="glass-card flex min-h-44 items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center">
				<div className="flex max-w-sm flex-col items-center gap-3">
					<Activity
						size={20}
						className="text-[var(--color-text-muted)]"
						aria-hidden="true"
					/>
					<div>
						<p className="text-sm font-semibold text-text-primary">
							אין דיווחי סוכנים פעילים כרגע
						</p>
						<p className="mt-1 text-xs leading-6 text-text-muted">
							כאשר דיווחים חיים יגיעו מהמערכת, הכרטיסים יופיעו כאן בזמן אמת.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
			<AnimatePresence initial={false} mode="popLayout">
				{agents.map((agent, index) => {
					const providerMeta = getProviderMeta(agent.provider);
					const statusMeta = STATUS_META[agent.status];
					const StatusIcon = statusMeta.icon;

					return (
						<motion.div
							key={`${agent.session}-${agent.agent_id}`}
							layout
							initial={{ opacity: 0, y: 12, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -12, scale: 0.98 }}
							transition={{
								duration: 0.22,
								delay: Math.min(index * 0.03, 0.18),
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<GlassCard
								title={agent.agent_id}
								subtitle={`סשן ${agent.session}`}
								icon={
									<Zap
										size={16}
										className={providerMeta.iconClassName}
										aria-hidden="true"
									/>
								}
								className="h-full"
							>
								<div className="flex h-full flex-col gap-4">
									<div className="flex flex-wrap items-center gap-2">
										<span
											className={cn(
												"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
												providerMeta.badgeClassName,
											)}
											dir="ltr"
										>
											{providerMeta.label}
										</span>
										<span
											className={cn(
												"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
												statusMeta.badgeClassName,
											)}
										>
											<StatusIcon
												size={14}
												className={cn(
													"shrink-0",
													statusMeta.iconClassName,
													agent.status === "running" && "animate-pulse-status",
												)}
												aria-hidden="true"
											/>
											{statusMeta.label}
										</span>
									</div>

									<div className="space-y-2">
										<p className="text-xs font-medium text-text-muted">
											תיאור משימה נוכחי
										</p>
										<p className="line-clamp-3 text-sm leading-6 text-text-primary">
											{getTaskDescription(agent)}
										</p>
									</div>

									<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
										<MetaTile
											label="זמן ריצה"
											value={formatRuntime(agent.runtime_seconds)}
											icon={Clock}
											dir="ltr"
										/>
										<MetaTile
											label="עלות מוערכת"
											value={formatCost(agent.cost_cents)}
											icon={Zap}
											dir="ltr"
										/>
									</div>

									<div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
										<MetaTile
											label="מזהה משימה"
											value={agent.task_id}
											icon={Activity}
											dir="ltr"
											valueClassName="break-all"
										/>
										<MetaTile
											label="מזהה גל"
											value={agent.wave_id}
											icon={Activity}
											dir="ltr"
											valueClassName="break-all"
										/>
									</div>
								</div>
							</GlassCard>
						</motion.div>
					);
				})}
			</AnimatePresence>
		</div>
	);
}
