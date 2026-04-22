import { Activity, Bot, DollarSign, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PaperclipClaudeSession } from "@/lib/api";

// PaperclipClaudeSession may carry context_pct in future API responses
interface ExtendedClaudeSession extends PaperclipClaudeSession {
	context_pct?: number;
}

interface ClaudeSessionCardProps {
	session: ExtendedClaudeSession;
}

export function ClaudeSessionCard({ session }: ClaudeSessionCardProps) {
	const isLive = session.live_agents > 0;
	const contextPct = session.context_pct ?? null;

	return (
		<GlassCard
			title="Claude Session — פעיל עכשיו"
			icon={<Activity size={16} />}
		>
			<div className="space-y-4">
				{isLive && (
					<div className="flex items-center gap-2 mb-1">
						<span className="relative flex size-2 shrink-0">
							<span className="live-dot-pulse absolute inline-flex size-full rounded-full bg-green-400" />
							<span className="relative inline-flex size-2 rounded-full bg-green-500" />
						</span>
						<span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-400 animate-pulse">
							Live
						</span>
					</div>
				)}
				<div className="grid grid-cols-2 gap-4">
					<Metric
						icon={DollarSign}
						label="עלות היום"
						value={`$${session.cost_usd.toFixed(2)}`}
						shimmer={isLive}
					/>
					<Metric
						icon={Bot}
						label="סוכנים שנשלחו"
						value={String(session.agents_dispatched)}
					/>
					<Metric
						icon={Zap}
						label="סוכנים חיים"
						value={String(session.live_agents)}
					/>
					<Metric
						icon={Activity}
						label="סטטוס"
						value={isLive ? "פעיל" : "לא פעיל"}
						color={isLive ? "text-accent-green" : "text-text-muted"}
					/>
				</div>

				{contextPct !== null && (
					<div className="space-y-1">
						<div className="flex items-center justify-between text-xs">
							<span className="text-text-muted">שימוש בקונטקסט</span>
							<span className="font-mono font-bold text-text-primary" dir="ltr">
								{contextPct.toFixed(0)}%
							</span>
						</div>
						<div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
							<div
								className="h-full rounded-full transition-all duration-500"
								style={{
									width: `${Math.min(contextPct, 100)}%`,
									background:
										contextPct >= 80
											? "oklch(0.62 0.22 25)"
											: contextPct >= 50
												? "oklch(0.78 0.16 75)"
												: "oklch(0.65 0.18 250)",
								}}
							/>
						</div>
					</div>
				)}
			</div>
		</GlassCard>
	);
}

function Metric({
	icon: Icon,
	label,
	value,
	color,
	shimmer,
}: {
	icon: typeof Activity;
	label: string;
	value: string;
	color?: string;
	shimmer?: boolean;
}) {
	return (
		<div className="flex items-center gap-2">
			<Icon size={14} className="text-text-muted shrink-0" />
			<div>
				<div
					className={`text-sm font-bold ${color ?? "text-text-primary"} ${shimmer ? "shimmer-text" : ""}`}
					dir="ltr"
				>
					{value}
				</div>
				<div className="text-xs text-text-muted">{label}</div>
			</div>
		</div>
	);
}
