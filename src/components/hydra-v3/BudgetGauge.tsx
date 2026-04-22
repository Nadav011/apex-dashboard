import { DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import type { BudgetStatus as ApiBudgetStatus } from "@/lib/api";
import { cn } from "@/lib/cn";

export interface BudgetStatus extends ApiBudgetStatus {}

interface BudgetMetricRowProps {
	provider: string;
	label: string;
	spentCents: number;
	limitCents: number;
	showFreeBadge?: boolean;
}

const USD_FORMATTER = new Intl.NumberFormat("he-IL", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 2,
});

const ORANGE = "oklch(0.72 0.17 45)";

function formatAmount(cents: number): string {
	return USD_FORMATTER.format(cents / 100);
}

function getUsageTone(percent: number) {
	if (percent < 50) {
		return "var(--color-accent-green)";
	}
	if (percent < 80) {
		return "var(--color-accent-amber)";
	}
	if (percent < 100) {
		return ORANGE;
	}
	return "var(--color-accent-red)";
}

function BudgetMetricRow({
	provider,
	label,
	spentCents,
	limitCents,
	showFreeBadge = true,
}: BudgetMetricRowProps) {
	const isFree = limitCents === 0;
	const rawPercent = isFree ? 0 : (spentCents / limitCents) * 100;
	const displayPercent = Math.max(0, Math.round(rawPercent));
	const widthPercent = Math.max(0, Math.min(rawPercent, 100));
	const tone = getUsageTone(rawPercent);

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap items-center gap-2 text-sm">
				<span className="font-medium text-[var(--color-text-primary)]">
					{label}
				</span>
				<span
					className="text-xs text-[var(--color-text-muted)] sm:text-sm"
					dir="ltr"
				>
					{formatAmount(spentCents)} /{" "}
					{isFree ? "ללא תקרה" : formatAmount(limitCents)}
				</span>
				<div className="ms-auto flex items-center">
					{isFree ? (
						showFreeBadge ? (
							<Badge variant="info">FREE</Badge>
						) : (
							<span className="text-xs font-semibold text-[var(--color-accent-blue)]">
								ללא תקרה
							</span>
						)
					) : (
						<span
							className="text-sm font-semibold tabular-nums"
							dir="ltr"
							style={{ color: tone }}
						>
							{displayPercent}%
						</span>
					)}
				</div>
			</div>

			<div
				className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]"
				role="progressbar"
				aria-label={`${provider} ${label}`}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={isFree ? undefined : Math.min(displayPercent, 100)}
				aria-valuetext={isFree ? "FREE" : `${displayPercent}%`}
			>
				<div
					className={cn(
						"h-full rounded-full transition-[width] duration-500 ease-out",
						isFree && "opacity-80",
					)}
					style={{
						width: isFree ? "100%" : `${widthPercent}%`,
						background: isFree ? "var(--color-accent-blue)" : tone,
					}}
				/>
			</div>
		</div>
	);
}

export function BudgetGauge({ budgets }: { budgets: BudgetStatus[] }) {
	return (
		<GlassCard
			title="תקציב ספקים"
			subtitle="ניצול יומי וחודשי לכל ספק"
			icon={<DollarSign size={16} />}
			className="h-full"
		>
			{budgets.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)]/30 px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
					אין נתוני תקציב זמינים.
				</div>
			) : (
				<div className="space-y-4">
					{budgets.map((budget) => {
						const providerIsFree =
							budget.daily_limit_cents === 0 &&
							budget.monthly_limit_cents === 0;

						return (
							<div
								key={budget.provider}
								className={cn(
									"rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/20 p-4",
									"transition-colors duration-200 hover:border-[var(--color-border-hover)]",
								)}
							>
								<div className="mb-4 flex items-start gap-3">
									<div className="min-w-0 flex-1">
										<h3 className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
											{budget.provider}
										</h3>
										<p className="mt-1 text-xs text-[var(--color-text-muted)]">
											תקציב יומי ותקציב חודשי
										</p>
									</div>
									{providerIsFree ? <Badge variant="info">FREE</Badge> : null}
								</div>

								<div className="space-y-3">
									<BudgetMetricRow
										provider={budget.provider}
										label="יומי"
										spentCents={budget.daily_spent_cents}
										limitCents={budget.daily_limit_cents}
										showFreeBadge={!providerIsFree}
									/>
									<BudgetMetricRow
										provider={budget.provider}
										label="חודשי"
										spentCents={budget.monthly_spent_cents}
										limitCents={budget.monthly_limit_cents}
										showFreeBadge={!providerIsFree}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</GlassCard>
	);
}
