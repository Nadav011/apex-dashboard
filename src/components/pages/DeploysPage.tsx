import { ExternalLink, Globe, RefreshCw, Rocket } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useDeploysStatus } from "@/hooks/use-api";
import type { DeploySite } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Platform badge ────────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: DeploySite["platform"] }) {
	const isCf = platform === "cloudflare";
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-[10px] font-semibold",
				"px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0",
				isCf
					? "bg-[oklch(0.65_0.18_250_/_0.15)] text-accent-blue"
					: "bg-[oklch(0.78_0.16_75_/_0.15)] text-accent-amber",
			)}
		>
			{isCf ? "CF" : "Netlify"}
		</span>
	);
}

// ── Status dot ────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: DeploySite["status"] }) {
	const isUp = status === "up";
	return (
		<span
			aria-hidden="true"
			className={cn(
				"inline-block w-2 h-2 rounded-full shrink-0",
				isUp
					? "bg-status-healthy shadow-[0_0_6px_oklch(0.72_0.19_155_/_0.7)]"
					: "bg-status-critical shadow-[0_0_6px_oklch(0.62_0.22_25_/_0.7)]",
			)}
		/>
	);
}

// ── Site card ─────────────────────────────────────────────────────────────────

function SiteCard({ site }: { site: DeploySite }) {
	const isUp = site.status === "up";

	const checkedAt = site.checked_at
		? new Date(site.checked_at).toLocaleTimeString("he-IL", {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			})
		: "—";

	return (
		<article
			className={cn(
				"glass-card card-spotlight p-5 flex flex-col gap-4 transition-colors duration-200",
				isUp
					? "border-[oklch(0.72_0.19_155_/_0.2)]"
					: "border-[oklch(0.62_0.22_25_/_0.3)]",
			)}
			aria-label={`${site.name} — ${isUp ? "פעיל" : "מושבת"}`}
		>
			{/* Top row: name + badges */}
			<div className="flex items-center justify-between gap-2 flex-wrap">
				<div className="flex items-center gap-2 min-w-0">
					<StatusDot status={site.status} />
					<h3 className="text-sm font-semibold text-text-primary truncate">
						{site.name}
					</h3>
				</div>
				<PlatformBadge platform={site.platform} />
			</div>

			{/* Status label */}
			<div className="flex items-center gap-2">
				<span
					className={cn(
						"text-xs font-medium px-2.5 py-1 rounded-full",
						isUp
							? "bg-[oklch(0.72_0.19_155_/_0.12)] text-status-healthy"
							: "bg-[oklch(0.62_0.22_25_/_0.12)] text-status-critical",
					)}
				>
					{isUp ? "פעיל" : "מושבת"}
				</span>
				{site.http_status !== null && (
					<span className="text-xs text-text-muted tabular-nums" dir="ltr">
						HTTP {site.http_status}
					</span>
				)}
			</div>

			{/* Response time */}
			<div className="flex items-center justify-between gap-2 text-xs text-text-secondary">
				<span>זמן תגובה</span>
				<span
					className={cn(
						"tabular-nums font-mono font-medium",
						site.response_ms < 300
							? "text-status-healthy"
							: site.response_ms < 800
								? "text-status-degraded"
								: "text-status-critical",
					)}
					dir="ltr"
				>
					{site.response_ms} ms
				</span>
			</div>

			{/* Error message */}
			{site.error && (
				<p className="text-xs text-status-critical bg-[oklch(0.62_0.22_25_/_0.08)] rounded-lg px-3 py-2 break-all">
					{site.error}
				</p>
			)}

			{/* URL + last checked */}
			<div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-border">
				<a
					href={site.url}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						"inline-flex items-center gap-1 text-xs text-accent-blue",
						"hover:text-text-primary transition-colors duration-150",
						"min-h-11 rounded",
					)}
					dir="ltr"
				>
					<ExternalLink size={11} aria-hidden="true" />
					<span className="truncate max-w-[160px]">
						{site.url.replace("https://", "")}
					</span>
				</a>
				<time
					className="text-[10px] text-text-muted tabular-nums shrink-0"
					dateTime={site.checked_at}
					dir="ltr"
				>
					{checkedAt}
				</time>
			</div>
		</article>
	);
}

// ── Summary stats row ─────────────────────────────────────────────────────────

function SummaryRow({
	total,
	upCount,
	downCount,
	isFetching,
}: {
	total: number;
	upCount: number;
	downCount: number;
	isFetching: boolean;
}) {
	return (
		<div className="flex flex-wrap gap-3">
			{/* Total */}
			<div className="glass-card card-spotlight px-5 py-3 flex items-center gap-3 min-w-[120px]">
				<Globe
					size={16}
					className="text-accent-blue shrink-0"
					aria-hidden="true"
				/>
				<div>
					<p className="text-[10px] text-text-muted uppercase tracking-wide">
						סה״כ אתרים
					</p>
					<p
						className="text-xl font-bold text-text-primary tabular-nums"
						dir="ltr"
					>
						{total}
					</p>
				</div>
			</div>

			{/* Up */}
			<div className="glass-card card-spotlight px-5 py-3 flex items-center gap-3 min-w-[120px] border-[oklch(0.72_0.19_155_/_0.2)]">
				<span
					className="w-3 h-3 rounded-full bg-status-healthy shadow-[0_0_8px_oklch(0.72_0.19_155_/_0.6)] shrink-0"
					aria-hidden="true"
				/>
				<div>
					<p className="text-[10px] text-text-muted uppercase tracking-wide">
						פעילים
					</p>
					<p
						className="text-xl font-bold text-status-healthy tabular-nums"
						dir="ltr"
					>
						{upCount}
					</p>
				</div>
			</div>

			{/* Down */}
			<div
				className={cn(
					"glass-card card-spotlight px-5 py-3 flex items-center gap-3 min-w-[120px]",
					downCount > 0 && "border-[oklch(0.62_0.22_25_/_0.3)]",
				)}
			>
				<span
					className={cn(
						"w-3 h-3 rounded-full shrink-0",
						downCount > 0
							? "bg-status-critical shadow-[0_0_8px_oklch(0.62_0.22_25_/_0.6)]"
							: "bg-[var(--color-text-muted)]",
					)}
					aria-hidden="true"
				/>
				<div>
					<p className="text-[10px] text-text-muted uppercase tracking-wide">
						מושבתים
					</p>
					<p
						className={cn(
							"text-xl font-bold tabular-nums",
							downCount > 0 ? "text-status-critical" : "text-text-muted",
						)}
						dir="ltr"
					>
						{downCount}
					</p>
				</div>
			</div>

			{/* Live indicator */}
			{isFetching && (
				<div className="flex items-center gap-2 text-xs text-text-muted ms-auto self-center">
					<RefreshCw size={12} className="animate-spin" aria-hidden="true" />
					<span>מרענן...</span>
				</div>
			)}
		</div>
	);
}

// ── Loading skeletons ─────────────────────────────────────────────────────────

function SkeletonGrid() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{Array.from({ length: 9 }).map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
					key={i}
					className="glass-card p-5 flex flex-col gap-4 animate-pulse"
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-bg-elevated" />
							<div className="h-4 bg-bg-elevated rounded w-24" />
						</div>
						<div className="h-4 bg-bg-elevated rounded w-12" />
					</div>
					<div className="h-6 bg-bg-elevated rounded w-16" />
					<div className="flex justify-between">
						<div className="h-3 bg-bg-elevated rounded w-20" />
						<div className="h-3 bg-bg-elevated rounded w-16" />
					</div>
					<div className="flex justify-between pt-1 border-t border-border">
						<div className="h-3 bg-bg-elevated rounded w-32" />
						<div className="h-3 bg-bg-elevated rounded w-12" />
					</div>
				</div>
			))}
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DeploysPage() {
	const { data, isLoading, isFetching, error } = useDeploysStatus();

	const sites = data?.sites ?? [];
	const total = data?.total ?? 0;
	const upCount = data?.up_count ?? 0;
	const downCount = data?.down_count ?? 0;

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				icon={Rocket}
				title="פריסות"
				description="סטטוס כל האתרים — בדיקת זמינות בזמן אמת"
			/>
			{/* Header */}
			<div className="flex items-center gap-3">
				<Globe
					size={20}
					className="text-accent-blue shrink-0"
					aria-hidden="true"
				/>
			</div>

			{/* Error */}
			{error && (
				<div className="p-8 text-center text-accent-red">
					שגיאה בטעינת נתונים
				</div>
			)}

			{/* Summary */}
			{!isLoading && !error && (
				<SummaryRow
					total={total}
					upCount={upCount}
					downCount={downCount}
					isFetching={isFetching}
				/>
			)}

			{/* Skeleton */}
			{isLoading && !error && <SkeletonGrid />}

			{/* Empty state */}
			{!isLoading && !error && sites.length === 0 && (
				<EmptyState
					icon={Globe}
					title="אין אתרים מוגדרים"
					description="לא נמצאו פריסות זמינות. ודא שהגדרת אתרים לניטור"
				/>
			)}

			{/* Site grid: down first, then alphabetical (sorted server-side) */}
			{!isLoading && !error && sites.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid">
					{sites.map((site) => (
						<SiteCard key={site.name} site={site} />
					))}
				</div>
			)}

			{/* Last checked footer */}
			{data?.checked_at && (
				<p className="text-xs text-text-muted text-end" dir="ltr">
					נבדק לאחרונה: {new Date(data.checked_at).toLocaleTimeString("he-IL")}
				</p>
			)}
		</div>
	);
}
