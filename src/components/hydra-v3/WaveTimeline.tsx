import {
	CheckCircle2,
	Clock,
	DollarSign,
	ListChecks,
	XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import type { WaveEntry as ApiWaveEntry } from "@/lib/api";
import { cn } from "@/lib/cn";

export interface WaveEntry extends ApiWaveEntry {}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("he-IL", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
});

function getTimestamp(value: string): number {
	const timestamp = Date.parse(value);
	return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function formatStartedAt(value: string): string {
	const timestamp = Date.parse(value);
	if (Number.isNaN(timestamp)) {
		return value;
	}

	return DATE_TIME_FORMATTER.format(new Date(timestamp));
}

function formatCost(totalCostCents: number): string {
	return `$${(totalCostCents / 100).toFixed(2)}`;
}

function formatDuration(durationSeconds: number): string {
	const totalSeconds = Math.max(0, Math.round(durationSeconds));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return [hours, minutes, seconds]
			.map((value) => value.toString().padStart(2, "0"))
			.join(":");
	}

	return [minutes, seconds]
		.map((value) => value.toString().padStart(2, "0"))
		.join(":");
}

function getWaveAccent(wave: WaveEntry): string {
	if (wave.failed > 0) {
		return "border-accent-red/25 bg-accent-red/10 text-accent-red";
	}

	if (wave.running > 0) {
		return "border-accent-blue/25 bg-accent-blue/10 text-accent-blue";
	}

	return "border-accent-green/25 bg-accent-green/10 text-accent-green";
}

function MetricPill({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="flex min-h-11 items-center gap-3 rounded-xl border border-border/50 bg-bg-elevated/35 px-3 py-2">
			<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-secondary/70 text-text-muted">
				{icon}
			</span>
			<div className="min-w-0">
				<p className="text-[11px] text-text-muted">{label}</p>
				<p
					className="text-sm font-semibold text-text-primary tabular-nums"
					dir="ltr"
				>
					{value}
				</p>
			</div>
		</div>
	);
}

export function WaveTimeline({ waves }: { waves: WaveEntry[] }) {
	const orderedWaves = [...waves].sort(
		(left, right) =>
			getTimestamp(right.started_at) - getTimestamp(left.started_at),
	);

	return (
		<GlassCard
			title="ציר גלי ביצוע"
			subtitle={
				orderedWaves.length > 0
					? `${orderedWaves.length.toLocaleString("he-IL")} גלים, החדש ביותר למעלה`
					: "אין היסטוריית גלים להצגה"
			}
			icon={<ListChecks size={16} />}
			className="h-full"
		>
			<div dir="rtl" className="space-y-4">
				{orderedWaves.length === 0 ? (
					<EmptyState
						icon={ListChecks}
						title="אין גלים להצגה"
						description="כאשר יגיעו גלי ביצוע אמיתיים, הם יופיעו כאן מהחדש לישן."
						className="py-8"
					/>
				) : (
					<ol className="space-y-4">
						{orderedWaves.map((wave, index) => (
							<li
								key={wave.wave_id}
								className={cn(
									"flex gap-4",
									index < orderedWaves.length - 1 &&
										"border-b border-border/50 pb-4",
								)}
							>
								<div className="flex shrink-0 flex-col items-center">
									<span
										className={cn(
											"mt-1 flex size-9 items-center justify-center rounded-full border",
											getWaveAccent(wave),
										)}
									>
										<ListChecks size={16} />
									</span>
									{index < orderedWaves.length - 1 && (
										<span className="mt-2 w-px flex-1 bg-border/60" />
									)}
								</div>

								<div className="min-w-0 flex-1 space-y-3">
									<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
										<div className="min-w-0 space-y-1">
											<div className="flex flex-wrap items-center gap-2">
												<h3 className="truncate text-sm font-semibold text-text-primary">
													{wave.wave_name}
												</h3>
												<Badge variant="default" className="max-w-full">
													<span className="text-text-muted">מזהה</span>
													<span className="truncate tabular-nums" dir="ltr">
														{wave.wave_id}
													</span>
												</Badge>
											</div>
											<p className="text-xs text-text-muted">
												התחיל ב־
												<span className="ms-1 tabular-nums" dir="ltr">
													{formatStartedAt(wave.started_at)}
												</span>
											</p>
										</div>

										<div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
											<MetricPill
												icon={<ListChecks size={16} />}
												label="סה״כ משימות"
												value={wave.total_tasks.toLocaleString("he-IL")}
											/>
											<MetricPill
												icon={<DollarSign size={16} />}
												label="עלות כוללת"
												value={formatCost(wave.total_cost_cents)}
											/>
											<MetricPill
												icon={<Clock size={16} />}
												label="משך כולל"
												value={formatDuration(wave.duration_seconds)}
											/>
										</div>
									</div>

									<div className="flex flex-wrap items-center gap-2">
										<Badge
											variant="success"
											className="min-h-8 border px-2.5 py-1 text-xs"
										>
											<CheckCircle2 size={13} aria-hidden="true" />
											<span>הושלמו</span>
											<span className="tabular-nums" dir="ltr">
												{wave.completed.toLocaleString("he-IL")}
											</span>
										</Badge>
										<Badge
											variant="error"
											className="min-h-8 border px-2.5 py-1 text-xs"
										>
											<XCircle size={13} aria-hidden="true" />
											<span>נכשלו</span>
											<span className="tabular-nums" dir="ltr">
												{wave.failed.toLocaleString("he-IL")}
											</span>
										</Badge>
										<Badge
											variant="info"
											className="min-h-8 border px-2.5 py-1 text-xs"
										>
											<Clock size={13} aria-hidden="true" />
											<span>רצות</span>
											<span className="tabular-nums" dir="ltr">
												{wave.running.toLocaleString("he-IL")}
											</span>
										</Badge>
									</div>
								</div>
							</li>
						))}
					</ol>
				)}
			</div>
		</GlassCard>
	);
}
