import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	icon: Icon = Inbox,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-16 px-4 text-center",
				className,
			)}
		>
			<span className="flex size-14 items-center justify-center rounded-2xl bg-bg-elevated text-text-muted mb-4">
				<Icon size={28} strokeWidth={1.5} aria-hidden="true" />
			</span>
			<h3 className="text-base font-semibold text-text-primary mb-1">
				{title}
			</h3>
			{description && (
				<p className="text-sm text-text-muted max-w-md">{description}</p>
			)}
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}
