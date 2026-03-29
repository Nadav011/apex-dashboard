import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { AnimatedNumber } from "./AnimatedNumber";

interface StatCardProps {
	label: string;
	value: string | number;
	change?: number;
	icon: LucideIcon;
	className?: string;
}

export function StatCard({
	label,
	value,
	change,
	icon: Icon,
	className,
}: StatCardProps) {
	const isPositive = change !== undefined && change > 0;
	const isNegative = change !== undefined && change < 0;
	const hasChange = change !== undefined && change !== 0;

	return (
		<div
			className={cn(
				"glass-card flex flex-col gap-3 p-4 transition-colors duration-200",
				className,
			)}
		>
			{/* Top row: icon + change */}
			<div className="flex items-center justify-between">
				<span className="flex size-9 items-center justify-center rounded-lg bg-[var(--color-bg-elevated)] text-[var(--color-accent-blue)]">
					<Icon size={18} strokeWidth={1.75} aria-hidden="true" />
				</span>

				{hasChange && (
					<span
						className={cn(
							"inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
							isPositive &&
								"bg-[oklch(0.72_0.19_155_/_0.12)] text-[var(--color-status-healthy)]",
							isNegative &&
								"bg-[oklch(0.62_0.22_25_/_0.12)] text-[var(--color-status-critical)]",
						)}
					>
						{isPositive ? (
							<TrendingUp size={12} aria-hidden="true" />
						) : (
							<TrendingDown size={12} aria-hidden="true" />
						)}
						<span dir="ltr">
							{isPositive ? "+" : ""}
							{change}%
						</span>
					</span>
				)}
			</div>

			{/* Value */}
			<div>
				<p
					className="text-2xl font-bold leading-none tracking-tight text-[var(--color-text-primary)]"
					dir="ltr"
				>
					{typeof value === "number" ? <AnimatedNumber value={value} /> : value}
				</p>
				<p className="mt-1 text-sm text-[var(--color-text-secondary)]">
					{label}
				</p>
			</div>
		</div>
	);
}
