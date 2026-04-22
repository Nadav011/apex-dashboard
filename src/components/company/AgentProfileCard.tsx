import {
	Bot,
	Building2,
	Crown,
	FlaskConical,
	Paintbrush,
	Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { PaperclipAgent } from "@/lib/api";
import { cn } from "@/lib/cn";

const DEPT_COLORS: Record<string, string> = {
	engineering: "#3b82f6",
	design: "#a855f7",
	research: "#06b6d4",
	qa: "#22c55e",
	ops: "#f59e0b",
	management: "#f43f5e",
};

function winRateColor(rate: number): string {
	if (rate >= 0.8) return "text-green-400";
	if (rate >= 0.5) return "text-amber-400";
	return "text-red-400";
}

const ROLE_ICON: Record<string, typeof Bot> = {
	ceo: Crown,
	engineer: Bot,
	designer: Paintbrush,
	researcher: FlaskConical,
	qa: Shield,
	ops: Building2,
};

const STATUS_COLORS: Record<string, string> = {
	running: "bg-blue-500",
	idle: "bg-green-500",
	error: "bg-red-500",
	offline: "bg-gray-500",
};

const STATUS_HE: Record<string, string> = {
	running: "פעיל",
	idle: "מוכן",
	error: "שגיאה",
	offline: "לא מחובר",
};

interface AgentProfileCardProps {
	agent: PaperclipAgent;
	compact?: boolean;
}

export function AgentProfileCard({ agent, compact }: AgentProfileCardProps) {
	const Icon = ROLE_ICON[agent.role] ?? Bot;
	const deptColor = agent.department
		? (DEPT_COLORS[agent.department] ?? null)
		: null;
	const winPct = (agent.win_rate * 100).toFixed(0);

	if (compact) {
		return (
			<div
				className="flex items-center gap-2 rounded-lg bg-bg-elevated/50 border border-border/40 p-2"
				style={
					deptColor
						? { borderInlineStartColor: deptColor, borderInlineStartWidth: 3 }
						: undefined
				}
			>
				<span
					className={cn(
						"size-2 rounded-full shrink-0",
						STATUS_COLORS[agent.status] ?? "bg-gray-500",
					)}
				/>
				<Icon size={14} className="text-text-muted shrink-0" />
				<span className="text-xs font-medium text-text-primary truncate">
					{agent.name}
				</span>
				<span className="text-xs text-text-muted">{agent.title}</span>
				<span
					className={cn(
						"ms-auto text-[10px] font-bold tabular-nums shrink-0",
						winRateColor(agent.win_rate),
					)}
					dir="ltr"
				>
					{winPct}%
				</span>
			</div>
		);
	}

	return (
		<div
			className="glass-card p-4 space-y-3"
			style={
				deptColor
					? { borderInlineStartColor: deptColor, borderInlineStartWidth: 3 }
					: undefined
			}
		>
			<div className="flex items-start gap-3">
				<span className="flex size-10 items-center justify-center rounded-xl bg-bg-elevated text-accent-blue shrink-0">
					<Icon size={20} />
				</span>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<h3
							className={cn(
								"text-sm font-semibold text-text-primary truncate",
								agent.status === "running" && "shimmer-text",
							)}
						>
							{agent.name}
						</h3>
						<span
							className={cn(
								"size-2 rounded-full shrink-0",
								STATUS_COLORS[agent.status] ?? "bg-gray-500",
							)}
						/>
					</div>
					<p className="text-xs text-text-muted">
						{agent.title} · {agent.title_en}
					</p>
				</div>
			</div>

			<div className="flex flex-wrap gap-1">
				{agent.capabilities.slice(0, 4).map((cap) => (
					<Badge key={cap} variant="default" className="text-[10px]">
						{cap}
					</Badge>
				))}
			</div>

			<div className="grid grid-cols-3 gap-2 text-center text-xs">
				<div>
					<div
						className={cn("font-bold", winRateColor(agent.win_rate))}
						dir="ltr"
					>
						{winPct}%
					</div>
					<div className="text-text-muted">הצלחה</div>
				</div>
				<div>
					<div className="font-bold text-text-primary" dir="ltr">
						${agent.budget_monthly_usd}
					</div>
					<div className="text-text-muted">תקציב</div>
				</div>
				<div>
					<div className="font-bold text-text-primary">
						{STATUS_HE[agent.status] ?? agent.status}
					</div>
					<div className="text-text-muted">סטטוס</div>
				</div>
			</div>

			{agent.total_tasks !== undefined && (
				<div className="flex items-center justify-between text-xs border-t border-border/30 pt-2">
					<span className="text-text-muted">משימות כולל</span>
					<span className="font-bold text-text-primary tabular-nums" dir="ltr">
						{agent.total_tasks}
					</span>
				</div>
			)}
		</div>
	);
}
