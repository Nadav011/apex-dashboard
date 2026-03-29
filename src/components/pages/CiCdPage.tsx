import { useQueryClient } from "@tanstack/react-query";
import ReactECharts from "echarts-for-react";
import {
	CheckCircle2,
	ExternalLink,
	GitBranch,
	HelpCircle,
	Loader2,
	RefreshCw,
	Server,
	XCircle,
} from "lucide-react";
import { useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCiStatus } from "@/hooks/use-api";
import type { CiRepo, CiRun } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(isoStr: string): string {
	if (!isoStr) return "";
	const diff = Date.now() - new Date(isoStr).getTime();
	const minutes = Math.floor(diff / 60_000);
	if (minutes < 1) return "זה עתה";
	if (minutes < 60) return `לפני ${minutes} דקות`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `לפני ${hours} שעות`;
	const days = Math.floor(hours / 24);
	return `לפני ${days} ימים`;
}

type RunStatus =
	| "success"
	| "failure"
	| "in_progress"
	| "cancelled"
	| "unknown";

function getRunStatus(run: CiRun): RunStatus {
	const { status, conclusion } = run;
	if (conclusion === "success") return "success";
	if (
		conclusion === "failure" ||
		conclusion === "startup_failure" ||
		conclusion === "timed_out"
	)
		return "failure";
	if (status === "in_progress" || status === "queued" || status === "waiting")
		return "in_progress";
	if (conclusion === "cancelled" || conclusion === "skipped")
		return "cancelled";
	return "unknown";
}

function getRepoHealth(repo: CiRepo): RunStatus {
	if (!repo.runs.length) return "unknown";
	return getRunStatus(repo.runs[0]);
}

// ── Run Status Badge ──────────────────────────────────────────────────────────

function RunBadge({ run }: { run: CiRun }) {
	const s = getRunStatus(run);
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
				s === "success" && "bg-[oklch(0.72_0.19_155_/_0.15)] text-accent-green",
				s === "failure" && "bg-[oklch(0.62_0.22_25_/_0.15)] text-accent-red",
				s === "in_progress" &&
					"bg-[oklch(0.65_0.18_250_/_0.15)] text-accent-blue",
				s === "cancelled" && "bg-[oklch(0.55_0.02_260_/_0.12)] text-text-muted",
				s === "unknown" && "bg-[oklch(0.55_0.02_260_/_0.12)] text-text-muted",
			)}
		>
			{s === "success" && <CheckCircle2 size={10} aria-hidden="true" />}
			{s === "failure" && <XCircle size={10} aria-hidden="true" />}
			{s === "in_progress" && (
				<Loader2 size={10} className="animate-spin" aria-hidden="true" />
			)}
			{s === "cancelled" && <HelpCircle size={10} aria-hidden="true" />}
			{s === "unknown" && <HelpCircle size={10} aria-hidden="true" />}
			<span className="truncate max-w-[120px]">{run.name}</span>
		</span>
	);
}

// ── Repo Card ─────────────────────────────────────────────────────────────────

function RepoCard({ repo }: { repo: CiRepo }) {
	const health = getRepoHealth(repo);
	const latestRun = repo.runs[0];

	return (
		<div
			className={cn(
				"glass-card card-spotlight p-4 flex flex-col gap-3 transition-all duration-200",
				"hover:border-border-hover",
			)}
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					<span
						className={cn(
							"size-2 rounded-full shrink-0",
							health === "success" && "bg-accent-green",
							health === "failure" && "bg-accent-red",
							health === "in_progress" && "bg-accent-blue animate-pulse-status",
							(health === "cancelled" || health === "unknown") &&
								"bg-[var(--color-text-muted)]",
						)}
						aria-hidden="true"
					/>
					<span className="text-sm font-semibold text-text-primary truncate">
						{repo.name}
					</span>
				</div>
				{latestRun?.url && (
					<a
						href={latestRun.url}
						target="_blank"
						rel="noopener noreferrer"
						title="פתח ב-GitHub"
						className={cn(
							"shrink-0 text-text-muted hover:text-accent-blue",
							"transition-colors duration-150 min-h-11 min-w-11 flex items-center justify-center -m-2",
						)}
						aria-label={`פתח ${repo.name} ב-GitHub`}
					>
						<ExternalLink size={14} aria-hidden="true" />
					</a>
				)}
			</div>

			{/* Branch */}
			{latestRun?.headBranch && (
				<div className="flex items-center gap-1.5 text-xs text-text-muted">
					<GitBranch size={11} aria-hidden="true" />
					<span dir="ltr" className="truncate">
						{latestRun.headBranch}
					</span>
					{latestRun.createdAt && (
						<>
							<span className="opacity-40">·</span>
							<span>{relativeTime(latestRun.createdAt)}</span>
						</>
					)}
				</div>
			)}

			{/* Runs list */}
			{repo.error && !repo.runs.length ? (
				<p className="text-xs text-accent-red truncate">{repo.error}</p>
			) : repo.runs.length === 0 ? (
				<p className="text-xs text-text-muted">אין ריצות</p>
			) : (
				<div className="flex flex-wrap gap-1">
					{repo.runs.map((run, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: stable index for static runs list
						<RunBadge key={i} run={run} />
					))}
				</div>
			)}
		</div>
	);
}

// ── Summary Stat Card ─────────────────────────────────────────────────────────

function SummaryStat({
	label,
	value,
	color,
	icon: Icon,
}: {
	label: string;
	value: number;
	color: string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
	return (
		<div className="glass-card card-spotlight p-4 flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<Icon size={16} className={color} aria-hidden="true" />
				<span className="text-sm text-text-secondary">{label}</span>
			</div>
			<p className="text-3xl font-bold text-text-primary" dir="ltr">
				{value}
			</p>
		</div>
	);
}

// ── Pie Chart ─────────────────────────────────────────────────────────────────

function CiPieChart({
	passing,
	failing,
	unknown,
}: {
	passing: number;
	failing: number;
	unknown: number;
}) {
	const option = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			formatter: "{b}: {c} ({d}%)",
			backgroundColor: "var(--color-bg-elevated)",
			borderColor: "var(--color-border)",
			textStyle: { color: "var(--color-text-primary)" },
		},
		series: [
			{
				type: "pie",
				radius: ["45%", "72%"],
				center: ["50%", "50%"],
				avoidLabelOverlap: true,
				label: { show: false },
				emphasis: {
					label: { show: true, fontSize: 14, fontWeight: "bold" },
					itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.5)" },
				},
				data: [
					{
						value: passing,
						name: "עבר",
						itemStyle: { color: "var(--color-accent-green)" },
					},
					{
						value: failing,
						name: "נכשל",
						itemStyle: { color: "var(--color-accent-red)" },
					},
					{
						value: unknown,
						name: "לא ידוע",
						itemStyle: { color: "var(--color-text-muted)" },
					},
				].filter((d) => d.value > 0),
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: "220px", width: "100%" }}
			opts={{ renderer: "svg" }}
		/>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function CiCdPage() {
	const { data, isLoading, error, dataUpdatedAt } = useCiStatus();
	const qc = useQueryClient();

	const handleRefresh = useCallback(() => {
		qc.invalidateQueries({ queryKey: ["ci"] });
	}, [qc]);

	const repos = data?.repos ?? [];
	const passing = repos.filter((r) => getRepoHealth(r) === "success").length;
	const failing = repos.filter((r) => getRepoHealth(r) === "failure").length;
	const unknown = repos.filter(
		(r) =>
			getRepoHealth(r) === "unknown" ||
			getRepoHealth(r) === "cancelled" ||
			getRepoHealth(r) === "in_progress",
	).length;

	return (
		<div className="flex flex-col gap-6 pb-8">
			<PageHeader
				icon={GitBranch}
				title="CI/CD"
				description="מצב Pipeline של כל הפרויקטים — בדיקות, Build, ופריסה"
			/>
			{/* Refresh button */}
			<div className="flex items-center justify-end">
				<button
					type="button"
					onClick={handleRefresh}
					disabled={isLoading}
					title="רענן נתוני CI"
					aria-label="רענן נתוני CI"
					className={cn(
						"flex items-center gap-2 rounded-lg px-3 py-2",
						"text-sm text-text-secondary hover:text-text-primary",
						"bg-bg-tertiary hover:bg-bg-elevated",
						"border border-border hover:border-border-hover",
						"transition-colors duration-150 min-h-11",
						"disabled:opacity-50 disabled:cursor-not-allowed",
					)}
				>
					<RefreshCw
						size={14}
						className={cn(isLoading && "animate-spin")}
						aria-hidden="true"
					/>
					<span>רענן</span>
				</button>
			</div>

			{/* Error state */}
			{error && (
				<div className="glass-card p-4 border-[var(--color-accent-red)]/40 bg-[oklch(0.62_0.22_25_/_0.08)]">
					<p className="text-sm text-accent-red">
						שגיאה בטעינת נתוני CI: {(error as Error).message}
					</p>
				</div>
			)}

			{/* Summary cards + pie */}
			{!isLoading && (
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4 stagger-grid">
					<SummaryStat
						label="סך הכל ריפוs"
						value={repos.length}
						color="text-text-secondary"
						icon={Server}
					/>
					<SummaryStat
						label="עבר בהצלחה"
						value={passing}
						color="text-accent-green"
						icon={CheckCircle2}
					/>
					<SummaryStat
						label="נכשל"
						value={failing}
						color="text-accent-red"
						icon={XCircle}
					/>
					<SummaryStat
						label="לא ידוע / פעיל"
						value={unknown}
						color="text-text-muted"
						icon={HelpCircle}
					/>
				</div>
			)}

			{/* Loading shimmer for summary cards */}
			{isLoading && (
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton count
						<div key={i} className="glass-card p-4 h-24 shimmer" />
					))}
				</div>
			)}

			{/* Pie chart + legend */}
			{!isLoading && repos.length > 0 && (
				<div className="glass-card card-spotlight p-5">
					<h2 className="text-sm font-semibold text-text-secondary mb-4">
						התפלגות סטטוס
					</h2>
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
						<div className="w-full max-w-[220px]">
							<CiPieChart
								passing={passing}
								failing={failing}
								unknown={unknown}
							/>
						</div>
						<div className="flex flex-col gap-3 flex-1">
							{[
								{
									label: "עבר",
									value: passing,
									color: "bg-accent-green",
								},
								{
									label: "נכשל",
									value: failing,
									color: "bg-accent-red",
								},
								{
									label: "לא ידוע / פעיל",
									value: unknown,
									color: "bg-[var(--color-text-muted)]",
								},
							].map(({ label, value, color }) => (
								<div
									key={label}
									className="flex items-center justify-between gap-3"
								>
									<div className="flex items-center gap-2">
										<span
											className={cn("size-2.5 rounded-full shrink-0", color)}
											aria-hidden="true"
										/>
										<span className="text-sm text-text-secondary">{label}</span>
									</div>
									<span
										className="text-sm font-semibold text-text-primary"
										dir="ltr"
									>
										{value}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Repo grid */}
			<div>
				<h2 className="text-sm font-semibold text-text-secondary mb-3">
					ריפוs ({repos.length})
				</h2>
				{isLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{Array.from({ length: 6 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton count
							<div key={i} className="glass-card p-4 h-32 shimmer" />
						))}
					</div>
				) : repos.length === 0 ? (
					<div className="glass-card p-8 text-center">
						<p className="text-text-muted">אין נתונים זמינים</p>
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 stagger-grid">
						{repos.map((repo) => (
							<RepoCard key={repo.full_name} repo={repo} />
						))}
					</div>
				)}
			</div>

			{/* Last updated timestamp */}
			{dataUpdatedAt > 0 && (
				<p className="text-xs text-text-muted text-center">
					נתונים מתרעננים אוטומטית כל 60 שניות
				</p>
			)}
		</div>
	);
}
