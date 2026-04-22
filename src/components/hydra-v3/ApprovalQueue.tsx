import {
	CheckCircle2,
	Clock3,
	Play,
	ShieldCheck,
	Square,
	TriangleAlert,
} from "lucide-react";
import { ActionButton, type ButtonVariant } from "@/components/ui/ActionButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge, type StatusValue } from "@/components/ui/StatusBadge";
import type {
	ApprovalRequest,
	ApprovalStatus,
	BoardAction,
	BoardActionTone,
} from "./types";

interface ApprovalQueueProps {
	requests: ApprovalRequest[];
	title?: string;
	subtitle?: string;
	className?: string;
}

const STATUS_MAP: Record<ApprovalStatus, StatusValue> = {
	pending: "pending",
	approved: "healthy",
	rejected: "failed",
};

const TONE_VARIANT: Record<BoardActionTone, ButtonVariant> = {
	primary: "primary",
	success: "success",
	warning: "warning",
	danger: "danger",
};

function resolveActionIcon(tone: BoardActionTone | undefined) {
	switch (tone) {
		case "success":
			return CheckCircle2;
		case "warning":
			return TriangleAlert;
		case "danger":
			return Square;
		default:
			return Play;
	}
}

function renderActions(actions: BoardAction[] | undefined) {
	if (!actions || actions.length === 0) return null;

	return (
		<div className="mt-4 flex flex-wrap gap-2">
			{actions.map((action) => (
				<ActionButton
					key={action.id}
					label={action.label}
					icon={resolveActionIcon(action.tone)}
					onClick={action.onClick}
					variant={TONE_VARIANT[action.tone ?? "primary"]}
					isPending={action.pending}
					disabled={action.disabled}
					className="w-full sm:w-auto"
				/>
			))}
		</div>
	);
}

export function ApprovalQueue({
	requests,
	title = "תור אישורים",
	subtitle = "בקשות שממתינות להכרעת מפעיל",
	className,
}: ApprovalQueueProps) {
	return (
		<GlassCard
			title={title}
			subtitle={subtitle}
			icon={<ShieldCheck size={18} />}
			className={className}
		>
			{requests.length === 0 ? (
				<EmptyState
					icon={Clock3}
					title="אין בקשות פעילות"
					description="כשהמערכת תדרוש אישור, הפריטים יופיעו כאן"
					className="py-10"
				/>
			) : (
				<div className="space-y-3">
					{requests.map((request) => (
						<article
							key={request.id}
							className="rounded-2xl border border-border bg-bg-elevated/70 p-4"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0 flex-1">
									<p className="text-sm font-semibold text-text-primary">
										{request.title}
									</p>
									<p className="mt-1 text-xs text-text-muted">
										{request.requester}
									</p>
								</div>
								<StatusBadge status={STATUS_MAP[request.status]} size="sm" />
							</div>

							<div className="mt-3 grid gap-2 text-xs text-text-muted sm:grid-cols-2">
								<div>
									<span>תחום</span>
									<span className="ms-2 text-text-secondary">
										{request.scope}
									</span>
								</div>
								<div>
									<span>נוצר ב-</span>
									<span
										className="ms-2 font-mono text-text-secondary"
										dir="ltr"
									>
										{request.requestedAt}
									</span>
								</div>
							</div>

							{request.summary && (
								<p className="mt-3 text-sm text-text-secondary">
									{request.summary}
								</p>
							)}

							{renderActions(request.actions)}
						</article>
					))}
				</div>
			)}
		</GlassCard>
	);
}
