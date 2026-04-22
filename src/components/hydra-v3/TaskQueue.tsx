import {
	CheckCircle2,
	Clock,
	ListChecks,
	type LucideIcon,
	XCircle,
	Zap,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import type { HydraTask } from "@/lib/api";
import { cn } from "@/lib/cn";

interface StatusMeta {
	label: string;
	icon: LucideIcon;
	className: string;
}

const STATUS_META: Record<string, StatusMeta> = {
	pending: {
		label: "ממתין",
		icon: Clock,
		className: "text-[var(--color-text-muted)]",
	},
	in_progress: {
		label: "פעיל",
		icon: Zap,
		className: "text-[var(--color-status-running)]",
	},
	completed: {
		label: "הושלם",
		icon: CheckCircle2,
		className: "text-[var(--color-status-healthy)]",
	},
	verified: {
		label: "אומת",
		icon: CheckCircle2,
		className: "text-[var(--color-status-healthy)]",
	},
	failed: {
		label: "נכשל",
		icon: XCircle,
		className: "text-[var(--color-status-critical)]",
	},
};

const FALLBACK_STATUS: StatusMeta = {
	label: "לא ידוע",
	icon: Clock,
	className: "text-[var(--color-text-muted)]",
};

function getStatusMeta(status: string): StatusMeta {
	return (
		STATUS_META[status.trim().toLowerCase()] ?? {
			...FALLBACK_STATUS,
			label: status,
		}
	);
}

function TaskRow({ task }: { task: HydraTask }) {
	const meta = getStatusMeta(task.status);
	const StatusIcon = meta.icon;

	return (
		<tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-elevated)]/30 transition-colors">
			<td className="py-2.5 pe-4 ps-0">
				<div className="flex items-center gap-2">
					<StatusIcon
						size={13}
						className={cn("shrink-0", meta.className)}
						aria-hidden="true"
					/>
					<span className={cn("text-xs font-semibold", meta.className)}>
						{meta.label}
					</span>
				</div>
			</td>
			<td className="py-2.5 pe-4">
				<span
					className="text-xs font-mono text-[var(--color-text-secondary)] truncate block max-w-[200px]"
					dir="ltr"
					title={task.display_name ?? task.id}
				>
					{task.display_name ?? task.id}
				</span>
			</td>
			<td className="py-2.5 pe-4 text-end">
				{task.steps !== undefined ? (
					<span
						className="text-xs tabular-nums text-[var(--color-text-muted)]"
						dir="ltr"
					>
						{task.steps}
					</span>
				) : (
					<span className="text-xs text-[var(--color-text-muted)]">—</span>
				)}
			</td>
			<td className="py-2.5 text-end">
				{task.checkpoints !== undefined ? (
					<span
						className="text-xs tabular-nums text-[var(--color-text-muted)]"
						dir="ltr"
					>
						{task.checkpoints}
					</span>
				) : (
					<span className="text-xs text-[var(--color-text-muted)]">—</span>
				)}
			</td>
		</tr>
	);
}

interface TaskQueueProps {
	tasks: HydraTask[];
}

export function TaskQueue({ tasks }: TaskQueueProps) {
	const activeTasks = tasks.filter((t) =>
		["pending", "in_progress"].includes(t.status.trim().toLowerCase()),
	);
	const recentTasks = tasks
		.filter(
			(t) =>
				!["pending", "in_progress"].includes(t.status.trim().toLowerCase()),
		)
		.slice(0, 20);

	const displayTasks = [...activeTasks, ...recentTasks].slice(0, 50);

	return (
		<GlassCard
			title="תור משימות"
			subtitle={
				displayTasks.length > 0
					? `${activeTasks.length} פעיל / ${displayTasks.length} סה״כ`
					: "אין משימות"
			}
			icon={<ListChecks size={16} />}
			className="h-full"
		>
			{displayTasks.length === 0 ? (
				<EmptyState
					icon={ListChecks}
					title="אין משימות"
					description="כאשר Hydra יקבל משימות, הן יופיעו כאן"
					className="py-8"
				/>
			) : (
				<div className="overflow-x-auto" dir="rtl">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-[var(--color-border)]">
								<th className="py-2 pe-4 ps-0 text-start text-xs font-medium text-[var(--color-text-muted)]">
									סטטוס
								</th>
								<th className="py-2 pe-4 text-start text-xs font-medium text-[var(--color-text-muted)]">
									מזהה / שם
								</th>
								<th className="py-2 pe-4 text-end text-xs font-medium text-[var(--color-text-muted)]">
									שלבים
								</th>
								<th className="py-2 text-end text-xs font-medium text-[var(--color-text-muted)]">
									נקודות ביקורת
								</th>
							</tr>
						</thead>
						<tbody>
							{displayTasks.map((task) => (
								<TaskRow key={task.id} task={task} />
							))}
						</tbody>
					</table>
				</div>
			)}
		</GlassCard>
	);
}
