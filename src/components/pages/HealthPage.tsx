import {
	AlertTriangle,
	CheckCircle2,
	HeartPulse,
	RefreshCw,
	XCircle,
} from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useHydraHealth, useRunHealthCheck } from "@/hooks/use-api";
import type { HealthCheck } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Check metadata ───────────────────────────────────────────────────────────

const CHECK_LABELS: Record<string, string> = {
	langgraph: "LangGraph",
	sqlite_db: "מסד נתונים SQLite",
	lancedb: "LanceDB זיכרון",
	python_deps: "תלויות Python",
	watcher: "צופה Hydra",
	bayesian: "ניקודים בייסיאניים",
	audit_chain: "שרשרת ביקורת",
};

const CHECK_DESCRIPTIONS: Record<string, string> = {
	langgraph: "ייבוא ופעולת StateGraph",
	sqlite_db: "גישה למסד נתונים ו-WAL pragmas",
	lancedb: "LanceDB encode/recall/forget",
	python_deps: "חבילות Python נדרשות",
	watcher: "פעולת שירות הצופה",
	bayesian: "קובץ hydra-bayesian.json",
	audit_chain: "beads.jsonl ושרשרת ביקורת",
};

const KNOWN_ORDER = [
	"langgraph",
	"sqlite_db",
	"lancedb",
	"python_deps",
	"watcher",
	"bayesian",
	"audit_chain",
];

// ── Health Card ──────────────────────────────────────────────────────────────

function HealthCard({ check }: { check: HealthCheck }) {
	const label = CHECK_LABELS[check.name] ?? check.name;
	const description = CHECK_DESCRIPTIONS[check.name];

	return (
		<div
			className={cn(
				"glass-card card-spotlight flex flex-col gap-4 p-5 transition-colors duration-200",
				check.ok
					? "border-[oklch(0.72_0.19_155_/_0.25)]"
					: "border-[oklch(0.62_0.22_25_/_0.35)]",
			)}
		>
			{/* Icon + name row */}
			<div className="flex items-start gap-4">
				<div
					className={cn(
						"flex items-center justify-center w-12 h-12 rounded-xl shrink-0",
						check.ok
							? "bg-[oklch(0.72_0.19_155_/_0.15)]"
							: "bg-[oklch(0.62_0.22_25_/_0.15)]",
					)}
					aria-hidden="true"
				>
					{check.ok ? (
						<CheckCircle2 size={24} className="text-status-healthy" />
					) : (
						<XCircle size={24} className="text-status-critical" />
					)}
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2 flex-wrap">
						<h3 className="text-sm font-semibold text-text-primary">{label}</h3>
						<Badge
							variant={check.ok ? "success" : "error"}
							className="shrink-0"
						>
							{check.ok ? "תקין" : "שגיאה"}
						</Badge>
					</div>
					{description && (
						<p className="text-xs text-text-muted mt-0.5">{description}</p>
					)}
				</div>
			</div>

			{/* Message */}
			{check.message && (
				<p
					className={cn(
						"text-xs rounded-lg px-3 py-2",
						check.ok
							? "bg-[oklch(0.72_0.19_155_/_0.08)] text-status-healthy"
							: "bg-[oklch(0.62_0.22_25_/_0.08)] text-status-critical",
					)}
				>
					{check.message}
				</p>
			)}

			{/* Duration */}
			{check.duration_ms !== undefined && (
				<p className="text-xs text-text-muted" dir="ltr">
					{check.duration_ms.toFixed(1)} ms
				</p>
			)}
		</div>
	);
}

// ── Overall health bar ───────────────────────────────────────────────────────

function OverallHealthBar({
	healthy,
	total,
}: {
	healthy: number;
	total: number;
}) {
	const pct = total > 0 ? Math.round((healthy / total) * 100) : 0;
	const color =
		pct === 100
			? ("green" as const)
			: pct >= 60
				? ("amber" as const)
				: ("red" as const);

	const statusText =
		pct === 100
			? "כל הבדיקות תקינות"
			: pct >= 60
				? "בריאות ירודה — חלק מהבדיקות נכשלו"
				: "בריאות קריטית — רוב הבדיקות נכשלו";

	const Icon = pct === 100 ? CheckCircle2 : pct >= 60 ? AlertTriangle : XCircle;
	const iconColor =
		pct === 100
			? "text-status-healthy"
			: pct >= 60
				? "text-status-degraded"
				: "text-status-critical";
	const valueColor =
		pct === 100
			? "var(--color-status-healthy)"
			: pct >= 60
				? "var(--color-status-degraded)"
				: "var(--color-status-critical)";

	return (
		<div className="glass-card card-spotlight p-5 flex flex-col gap-4">
			<div className="flex items-center justify-between gap-3 flex-wrap">
				<div className="flex items-center gap-3">
					<Icon size={20} className={iconColor} aria-hidden="true" />
					<div>
						<p className="text-sm font-semibold text-text-primary">
							{statusText}
						</p>
						<p className="text-xs text-text-muted">
							<span dir="ltr">
								{healthy}/{total}
							</span>{" "}
							בדיקות עברו
						</p>
					</div>
				</div>
				<span
					className="text-2xl font-bold tabular-nums"
					style={{ color: valueColor }}
					dir="ltr"
				>
					{pct}%
				</span>
			</div>
			<ProgressBar value={pct} color={color} size="lg" showValue={false} />
		</div>
	);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HealthPage() {
	const { data, isLoading, isFetching } = useHydraHealth();
	const runCheck = useRunHealthCheck();

	const checks = data?.checks ?? [];

	// Sort by known order first, then alphabetical
	const sorted = [...checks].sort((a, b) => {
		const ai = KNOWN_ORDER.indexOf(a.name);
		const bi = KNOWN_ORDER.indexOf(b.name);
		if (ai !== -1 && bi !== -1) return ai - bi;
		if (ai !== -1) return -1;
		if (bi !== -1) return 1;
		return a.name.localeCompare(b.name, "he");
	});

	const total = sorted.length;
	const healthy = sorted.filter((c) => c.ok).length;

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				icon={HeartPulse}
				title="בריאות המערכת"
				description="בדיקות בריאות של כל רכיבי המערכת"
			/>

			{/* Action row */}
			<div className="flex items-center justify-end gap-4 flex-wrap">
				<ActionButton
					label="הרץ בדיקת בריאות"
					icon={RefreshCw}
					onClick={() => runCheck.mutate()}
					isPending={runCheck.isPending || isFetching}
					variant="primary"
				/>
			</div>

			{/* Mutation result banner */}
			{runCheck.data && (
				<div
					className={cn(
						"rounded-lg px-4 py-3 text-sm font-medium",
						runCheck.data.status === "ok"
							? "bg-[oklch(0.72_0.19_155_/_0.12)] text-status-healthy border border-[oklch(0.72_0.19_155_/_0.25)]"
							: "bg-[oklch(0.62_0.22_25_/_0.12)] text-status-critical border border-[oklch(0.62_0.22_25_/_0.25)]",
					)}
					role="status"
					aria-live="polite"
				>
					{runCheck.data.message}
				</div>
			)}

			{/* Overall health bar */}
			{!isLoading && total > 0 && (
				<OverallHealthBar healthy={healthy} total={total} />
			)}

			{/* Loading skeletons */}
			{isLoading && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{KNOWN_ORDER.slice(0, 5).map((k) => (
						<div
							key={k}
							className="glass-card p-5 animate-pulse flex flex-col gap-4"
						>
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 rounded-xl bg-bg-elevated" />
								<div className="flex-1 space-y-2">
									<div className="h-4 bg-bg-elevated rounded w-2/3" />
									<div className="h-3 bg-bg-elevated rounded w-1/2" />
								</div>
							</div>
							<div className="h-3 bg-bg-elevated rounded" />
						</div>
					))}
				</div>
			)}

			{/* Empty state */}
			{!isLoading && sorted.length === 0 && (
				<div className="glass-card p-12 text-center flex flex-col items-center gap-4">
					<HeartPulse
						size={40}
						className="text-text-muted"
						aria-hidden="true"
					/>
					<p className="text-sm text-text-muted">
						אין נתוני בריאות זמינים — לחץ "הרץ בדיקת בריאות"
					</p>
				</div>
			)}

			{/* Check Cards */}
			{!isLoading && sorted.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 grid-cards stagger-grid">
					{sorted.map((check) => (
						<HealthCard key={check.name} check={check} />
					))}
				</div>
			)}
		</div>
	);
}
