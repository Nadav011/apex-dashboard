import { CheckCircle2, Circle, Loader2, Target } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { PaperclipGoalItem } from "@/lib/api";
import { cn } from "@/lib/cn";

const STATUS_ICON: Record<string, typeof Circle> = {
	done: CheckCircle2,
	in_progress: Loader2,
	pending: Circle,
};

const STATUS_COLOR: Record<string, string> = {
	done: "text-accent-green",
	in_progress: "text-accent-blue",
	pending: "text-text-muted",
};

interface GoalTreeProps {
	goals: PaperclipGoalItem[];
}

export function GoalTree({ goals }: GoalTreeProps) {
	return (
		<GlassCard title="יעדים" icon={<Target size={16} />}>
			<div className="stagger-grid space-y-4">
				{goals.map((goal) => (
					<GoalNode key={goal.id} goal={goal} />
				))}
			</div>
		</GlassCard>
	);
}

function GoalNode({
	goal,
	depth = 0,
}: {
	goal: PaperclipGoalItem;
	depth?: number;
}) {
	const Icon = STATUS_ICON[goal.status] ?? Circle;
	const color = STATUS_COLOR[goal.status] ?? "text-text-muted";

	return (
		<div className={cn(depth > 0 && "ps-4 border-s-2 border-border/30")}>
			<div className="flex items-start gap-2 rounded-lg px-2 py-1 -mx-2 hover:bg-bg-elevated/40 transition-colors">
				<Icon
					size={14}
					className={cn(
						"mt-0.5 shrink-0",
						color,
						goal.status === "in_progress" && "animate-spin",
					)}
				/>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="text-sm font-medium text-text-primary">
							{goal.title}
						</span>
						<span
							className={cn(
								"text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full shrink-0",
								goal.status === "done"
									? "bg-green-500/15 text-green-400"
									: goal.status === "in_progress"
										? "bg-blue-500/15 text-blue-400"
										: "bg-bg-elevated text-text-muted",
							)}
							dir="ltr"
						>
							{goal.progress}%
						</span>
						<span className="text-xs text-text-muted font-mono" dir="ltr">
							{goal.id}
						</span>
					</div>
					<ProgressBar
						value={goal.progress}
						size="sm"
						showValue
						color={
							goal.status === "done"
								? "green"
								: goal.status === "in_progress"
									? "blue"
									: undefined
						}
						className="mt-1"
					/>
				</div>
			</div>

			{goal.sub_goals && goal.sub_goals.length > 0 && (
				<div className="mt-2 space-y-2">
					{goal.sub_goals.map((sub) => (
						<GoalNode key={sub.id} goal={sub} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	);
}
