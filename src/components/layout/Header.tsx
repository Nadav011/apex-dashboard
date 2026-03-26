import { Activity, RefreshCw } from "lucide-react";
import { useRunHealthCheck, useSystem } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

type SystemStatus = "healthy" | "degraded" | "critical";

function deriveStatus(ramPct: number | undefined): SystemStatus {
	if (ramPct === undefined) return "healthy";
	if (ramPct > 90) return "critical";
	if (ramPct > 75) return "degraded";
	return "healthy";
}

const STATUS_CONFIG: Record<
	SystemStatus,
	{ label: string; dotClass: string; textClass: string }
> = {
	healthy: {
		label: "תקין",
		dotClass: "bg-status-healthy",
		textClass: "text-status-healthy",
	},
	degraded: {
		label: "מדורדר",
		dotClass: "bg-status-degraded",
		textClass: "text-status-degraded",
	},
	critical: {
		label: "קריטי",
		dotClass: "bg-status-critical",
		textClass: "text-status-critical",
	},
};

interface HeaderProps {
	onRefreshAll: () => void;
}

export function Header({ onRefreshAll }: HeaderProps) {
	const { data: system, isRefetching } = useSystem();
	const healthCheck = useRunHealthCheck();

	const ramPct = system?.ram?.pct;
	const status = deriveStatus(ramPct);
	const cfg = STATUS_CONFIG[status];

	const memPercent = ramPct != null ? Math.round(ramPct) : null;

	return (
		<header className="sticky top-0 z-30 flex items-center gap-4 px-5 py-3 bg-bg-secondary/90 backdrop-blur-md border-b border-border">
			{/* Status Indicator */}
			<div className="flex items-center gap-2 min-w-0">
				<span className={cn("relative flex h-2.5 w-2.5 shrink-0")}>
					<span
						className={cn(
							"animate-ping absolute inline-flex h-full w-full rounded-full opacity-60",
							cfg.dotClass,
						)}
					/>
					<span
						className={cn(
							"relative inline-flex rounded-full h-2.5 w-2.5",
							cfg.dotClass,
						)}
					/>
				</span>
				<span className={cn("text-sm font-semibold", cfg.textClass)}>
					{cfg.label}
				</span>
			</div>

			{/* Divider */}
			<span className="w-px h-5 bg-border shrink-0" aria-hidden />

			{/* Memory */}
			{memPercent !== null && (
				<div className="flex items-center gap-1.5 hidden md:flex">
					<Activity size={13} className="text-text-muted shrink-0" />
					<span className="text-xs text-text-muted">RAM</span>
					<span
						className={cn(
							"text-xs font-mono font-medium",
							memPercent > 90
								? "text-status-critical"
								: memPercent > 75
									? "text-status-degraded"
									: "text-text-secondary",
						)}
					>
						{memPercent}%
					</span>
					{/* Mini progress bar */}
					<div className="w-14 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
						<div
							className={cn(
								"h-full rounded-full transition-all duration-500",
								memPercent > 90
									? "bg-status-critical"
									: memPercent > 75
										? "bg-status-degraded"
										: "bg-status-healthy",
							)}
							style={{ width: `${memPercent}%` }}
						/>
					</div>
				</div>
			)}

			{/* Uptime */}
			{system?.uptime && (
				<span className="text-xs text-text-muted hidden lg:block">
					פעיל:{" "}
					<span className="text-text-secondary font-mono">{system.uptime}</span>
				</span>
			)}

			{/* Spacer */}
			<div className="flex-1" />

			{/* Quick Actions */}
			<div className="flex items-center gap-2 shrink-0">
				<button
					type="button"
					onClick={() => {
						void healthCheck.mutateAsync();
					}}
					disabled={healthCheck.isPending}
					className={cn(
						"flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
						"text-xs font-medium text-text-secondary",
						"border border-border hover:border-border-hover",
						"hover:bg-bg-tertiary hover:text-text-primary",
						"transition-all duration-150 min-h-9",
						"disabled:opacity-50 disabled:cursor-not-allowed",
					)}
				>
					<Activity
						size={13}
						className={cn(healthCheck.isPending && "animate-pulse")}
					/>
					<span className="hidden sm:inline">בדיקת בריאות</span>
				</button>

				<button
					type="button"
					onClick={onRefreshAll}
					disabled={isRefetching}
					title="רענן הכל"
					className={cn(
						"flex items-center justify-center w-9 h-9 rounded-lg",
						"text-text-muted border border-border",
						"hover:border-border-hover hover:bg-bg-tertiary hover:text-text-primary",
						"transition-all duration-150",
						"disabled:opacity-50 disabled:cursor-not-allowed",
					)}
				>
					<RefreshCw size={14} className={cn(isRefetching && "animate-spin")} />
				</button>
			</div>
		</header>
	);
}
