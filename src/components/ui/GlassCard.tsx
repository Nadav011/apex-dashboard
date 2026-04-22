import { cn } from "@/lib/cn";

interface GlassCardProps {
	title: React.ReactNode;
	subtitle?: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

export function GlassCard({
	title,
	subtitle,
	icon,
	children,
	className,
}: GlassCardProps) {
	return (
		<div
			className={cn(
				"glass-card flex flex-col transition-colors duration-200",
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3">
				<span
					className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-elevated)] text-[var(--color-accent-blue)]"
					aria-hidden="true"
				>
					{icon}
				</span>
				<div className="min-w-0 flex-1">
					<h2 className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
						{title}
					</h2>
					{subtitle && (
						<p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
							{subtitle}
						</p>
					)}
				</div>
			</div>

			{/* Body */}
			<div className="flex-1 p-4">{children}</div>
		</div>
	);
}
