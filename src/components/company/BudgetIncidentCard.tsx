import {
	AlertTriangle,
	ArrowLeftRight,
	Pause,
	TrendingUp,
	XCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { PaperclipAgent, PaperclipBudgetIncident } from "@/lib/api";
import { cn } from "@/lib/cn";

interface BudgetIncidentCardProps {
	agents: PaperclipAgent[];
	totalBudget: number;
	incidents?: PaperclipBudgetIncident[];
}

export function BudgetIncidentCard({
	agents,
	totalBudget,
	incidents,
}: BudgetIncidentCardProps) {
	const totalSpent = agents.reduce((sum, a) => sum + a.cost_today_usd, 0);
	const pct =
		totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
	const atRisk = pct >= 80;
	const hasHardStop = incidents?.some((i) => i.threshold_type === "hard_stop");

	return (
		<GlassCard
			title={atRisk ? "התראת תקציב" : "מצב תקציב"}
			icon={
				<AlertTriangle
					size={16}
					className={atRisk ? "text-accent-amber" : "text-accent-blue"}
				/>
			}
			className={cn(hasHardStop && "border-red-500/40 animate-pulse")}
		>
			<div className="space-y-4">
				{/* Budget incidents */}
				{incidents && incidents.length > 0 && (
					<div className="space-y-2">
						{incidents.map((incident) => {
							const isHard = incident.threshold_type === "hard_stop";
							return (
								<div
									key={`${incident.provider}-${incident.scope}`}
									className={cn(
										"flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
										isHard
											? "bg-red-500/15 border border-red-500/30 text-red-400"
											: "bg-amber-500/15 border border-amber-500/30 text-amber-400",
									)}
								>
									{isHard ? (
										<XCircle size={14} className="shrink-0" />
									) : (
										<AlertTriangle size={14} className="shrink-0" />
									)}
									<span className="font-medium">{incident.provider}</span>
									<span className="text-text-muted">
										{incident.scope === "daily" ? "יומי" : "חודשי"}
									</span>
									<span className="ms-auto font-mono" dir="ltr">
										{incident.pct.toFixed(0)}% (${incident.observed_usd} / $
										{incident.limit_usd})
									</span>
								</div>
							);
						})}
					</div>
				)}

				{/* Overall budget bar */}
				<div>
					<div className="flex items-center justify-between text-sm mb-1">
						<span className="text-text-muted">ניצול יומי</span>
						<span className="font-mono text-text-primary" dir="ltr">
							${totalSpent.toFixed(2)} / ${totalBudget}
						</span>
					</div>
					<ProgressBar
						value={pct}
						color={atRisk ? "amber" : "blue"}
						showValue
						size="md"
					/>
				</div>

				{/* Per-agent breakdown */}
				<div className="space-y-2">
					{agents
						.filter((a) => a.budget_monthly_usd > 0)
						.sort((a, b) => b.cost_today_usd - a.cost_today_usd)
						.map((agent) => {
							const agentPct =
								agent.budget_monthly_usd > 0
									? Math.round(
											(agent.cost_today_usd / agent.budget_monthly_usd) * 100,
										)
									: 0;
							return (
								<div key={agent.id} className="flex items-center gap-3 text-xs">
									<span className="text-text-primary w-24 truncate">
										{agent.name}
									</span>
									<div className="flex-1">
										<ProgressBar
											value={Math.min(agentPct, 100)}
											size="sm"
											showValue={false}
											color={agentPct >= 80 ? "amber" : "blue"}
										/>
									</div>
									<span
										className="font-mono text-text-muted w-16 text-end"
										dir="ltr"
									>
										${agent.cost_today_usd.toFixed(2)}
									</span>
								</div>
							);
						})}
				</div>

				{/* Action buttons — shown when budget hard stop or at risk */}
				{(hasHardStop || atRisk) && (
					<div className="flex gap-2 pt-2 border-t border-border/40">
						<ActionBtn icon={Pause} label="השאר מושהה" />
						<ActionBtn icon={TrendingUp} label="העלה תקציב" />
						<ActionBtn icon={ArrowLeftRight} label="החלף ספק" />
					</div>
				)}
			</div>
		</GlassCard>
	);
}

function ActionBtn({
	icon: Icon,
	label,
}: {
	icon: typeof Pause;
	label: string;
}) {
	return (
		<button
			type="button"
			className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium bg-bg-elevated/60 text-text-secondary border border-border/40 hover:bg-bg-elevated hover:text-text-primary transition-colors"
			onClick={() => {
				// Future: wire to actual API actions
			}}
		>
			<Icon size={12} />
			{label}
		</button>
	);
}
