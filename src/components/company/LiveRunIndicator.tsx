interface LiveRunIndicatorProps {
	count: number;
	label?: string;
}

export function LiveRunIndicator({ count, label }: LiveRunIndicatorProps) {
	if (count === 0) return null;

	return (
		<div className="flex items-center gap-2 rounded-full bg-accent-blue/10 border border-accent-blue/30 px-3 py-1.5 w-fit">
			<span className="relative flex h-3 w-3 shrink-0">
				<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-blue opacity-70" />
				<span className="relative inline-flex h-3 w-3 rounded-full bg-accent-blue" />
			</span>
			<span className="text-xs font-semibold text-accent-blue" dir="ltr">
				{count}
			</span>
			<span className="text-xs text-text-muted">
				{label ?? "סוכנים פעילים"}
			</span>
		</div>
	);
}
