import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
	title: string;
	description?: string;
	icon?: LucideIcon;
	actions?: React.ReactNode;
	className?: string;
}

export function PageHeader({
	title,
	description,
	icon: Icon,
	actions,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn("mb-6 flex items-start justify-between gap-4", className)}
		>
			<div className="flex items-start gap-3 min-w-0">
				{Icon && (
					<span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
						<Icon size={20} strokeWidth={1.75} aria-hidden="true" />
					</span>
				)}
				<div className="min-w-0">
					<h1 className="text-xl font-bold text-text-primary leading-tight truncate sm:text-2xl">
						{title}
					</h1>
					{description && (
						<p className="mt-1 text-sm text-text-secondary leading-relaxed line-clamp-2">
							{description}
						</p>
					)}
				</div>
			</div>
			{actions && (
				<div className="flex items-center gap-2 shrink-0">{actions}</div>
			)}
		</div>
	);
}
