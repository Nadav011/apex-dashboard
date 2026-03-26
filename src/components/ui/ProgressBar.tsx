import { cn } from "@/lib/cn";

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressColor =
	| "blue"
	| "green"
	| "amber"
	| "red"
	| "purple"
	| "cyan";

interface ProgressBarProps {
	/** 0–100 */
	value: number;
	/**
	 * Named color token from the OKLCH design system, or any CSS color string.
	 * Defaults to an auto-selected accent based on value if omitted.
	 */
	color?: ProgressColor | string;
	label?: string;
	size?: ProgressSize;
	/** Show the numeric percentage next to the label. Defaults to true. */
	showValue?: boolean;
	className?: string;
}

const SIZE_TRACK: Record<ProgressSize, string> = {
	sm: "h-1",
	md: "h-2",
	lg: "h-3",
};

const SIZE_TEXT: Record<ProgressSize, string> = {
	sm: "text-xs",
	md: "text-sm",
	lg: "text-base",
};

/** Map named color tokens to design-system OKLCH values. */
const COLOR_TOKEN: Record<ProgressColor, string> = {
	blue: "var(--color-accent-blue)",
	green: "var(--color-accent-green)",
	amber: "var(--color-accent-amber)",
	red: "var(--color-accent-red)",
	purple: "var(--color-accent-purple)",
	cyan: "var(--color-accent-cyan)",
};

const NAMED_COLORS = new Set<string>(Object.keys(COLOR_TOKEN));

function resolveFill(
	color: ProgressColor | string | undefined,
	value: number,
): string {
	if (!color) {
		// Auto-select based on usage level
		if (value >= 90) return "var(--color-status-critical)";
		if (value >= 70) return "var(--color-status-degraded)";
		return "var(--color-accent-blue)";
	}
	if (NAMED_COLORS.has(color)) return COLOR_TOKEN[color as ProgressColor];
	return color; // raw CSS string pass-through
}

export function ProgressBar({
	value,
	color,
	label,
	size = "md",
	showValue = true,
	className,
}: ProgressBarProps) {
	const clamped = Math.max(0, Math.min(100, value));
	const fill = resolveFill(color, clamped);
	const hasHeader = label || showValue;

	return (
		<div className={cn("w-full", className)}>
			{hasHeader && (
				<div className="mb-1.5 flex items-center justify-between gap-2">
					{label ? (
						<span
							className={cn(
								"font-medium text-[var(--color-text-secondary)]",
								SIZE_TEXT[size],
							)}
						>
							{label}
						</span>
					) : (
						<span aria-hidden="true" />
					)}
					{showValue && (
						<span
							className={cn(
								"ms-auto font-mono tabular-nums text-[var(--color-text-muted)]",
								SIZE_TEXT[size],
							)}
							dir="ltr"
						>
							{clamped.toFixed(0)}%
						</span>
					)}
				</div>
			)}

			{/* Track */}
			<div
				className={cn(
					"w-full overflow-hidden rounded-full bg-[var(--color-bg-elevated)]",
					SIZE_TRACK[size],
				)}
				role="progressbar"
				aria-valuenow={clamped}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={label}
			>
				<div
					className="h-full rounded-full transition-all duration-500 ease-out"
					style={{ width: `${clamped}%`, background: fill }}
				/>
			</div>
		</div>
	);
}
