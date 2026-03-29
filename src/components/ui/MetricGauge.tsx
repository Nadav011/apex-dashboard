import { cn } from "@/lib/cn";

interface MetricGaugeProps {
	value: number;
	label: string;
	detail?: string;
	size?: number;
	className?: string;
}

export function MetricGauge({
	value,
	label,
	detail,
	size = 120,
	className,
}: MetricGaugeProps) {
	const radius = (size - 12) / 2;
	const circumference = 2 * Math.PI * radius;
	const clamped = Math.max(0, Math.min(100, value));
	const offset = circumference - (clamped / 100) * circumference;

	const color =
		clamped >= 90
			? "var(--color-accent-red)"
			: clamped >= 70
				? "var(--color-accent-amber)"
				: "var(--color-accent-blue)";

	return (
		<div
			className={cn(
				"glass-card flex flex-col items-center gap-3 p-4",
				className,
			)}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="-rotate-90"
				aria-hidden="true"
			>
				{/* Background track */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="var(--color-bg-elevated)"
					strokeWidth={6}
				/>
				{/* Value arc */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={color}
					strokeWidth={6}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					className="transition-[stroke-dashoffset] duration-700 ease-out"
				/>
			</svg>
			{/* Center value overlay */}
			<div
				className="absolute flex flex-col items-center justify-center"
				style={{ width: size, height: size }}
			>
				<span
					className="text-xl font-bold text-text-primary"
					dir="ltr"
					style={{ color }}
				>
					{Math.round(clamped)}%
				</span>
			</div>
			<div className="text-center -mt-1">
				<p className="text-sm font-medium text-text-primary">{label}</p>
				{detail && (
					<p className="text-xs text-text-muted mt-0.5" dir="ltr">
						{detail}
					</p>
				)}
			</div>
		</div>
	);
}
