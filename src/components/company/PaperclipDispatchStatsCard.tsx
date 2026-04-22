import { TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { PaperclipDispatchStats } from "@/lib/api";

interface PaperclipDispatchStatsCardProps {
	stats: PaperclipDispatchStats;
	title?: string;
	subtitle?: string;
	className?: string;
}

export function PaperclipDispatchStatsCard({
	stats,
	title,
	subtitle,
	className,
}: PaperclipDispatchStatsCardProps) {
	if (stats.total_runs <= 0) {
		return null;
	}

	const winRatePercent = (stats.win_rate * 100).toFixed(1);
	const providerEntries = Object.entries(stats.by_provider).sort(
		([, left], [, right]) => right.total - left.total,
	);

	return (
		<GlassCard
			title={title ?? `ביצועי שיגורים — ${winRatePercent}% הצלחה`}
			subtitle={subtitle ?? `${stats.total_runs} שיגורים`}
			icon={<TrendingUp size={16} />}
			className={className}
		>
			<div className="space-y-3">
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<div
							className="text-lg font-bold text-green-400 tabular-nums"
							dir="ltr"
						>
							{stats.completed}
						</div>
						<div className="text-xs text-text-muted">הושלמו</div>
					</div>
					<div>
						<div
							className="text-lg font-bold text-red-400 tabular-nums"
							dir="ltr"
						>
							{stats.failed}
						</div>
						<div className="text-xs text-text-muted">נכשלו</div>
					</div>
					<div>
						<div
							className="text-lg font-bold text-accent-blue tabular-nums"
							dir="ltr"
						>
							{winRatePercent}%
						</div>
						<div className="text-xs text-text-muted">אחוז הצלחה</div>
					</div>
				</div>

				{providerEntries.length > 0 && (
					<div className="space-y-2">
						{providerEntries.map(([provider, providerStats]) => {
							const successRate =
								providerStats.total > 0
									? Math.round(
											(providerStats.successes / providerStats.total) * 100,
										)
									: 0;

							return (
								<div key={provider} className="flex items-center gap-3 text-xs">
									<span className="w-16 font-medium text-text-primary">
										{provider}
									</span>
									<div className="flex-1">
										<ProgressBar
											value={successRate}
											size="sm"
											showValue={false}
											color={successRate >= 80 ? "blue" : "amber"}
										/>
									</div>
									<span
										className="w-20 text-end font-mono text-text-muted"
										dir="ltr"
									>
										{providerStats.successes}/{providerStats.total} (
										{successRate}%)
									</span>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</GlassCard>
	);
}
