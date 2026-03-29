import {
	Activity,
	AlertTriangle,
	CheckCircle2,
	Database,
	Play,
	RefreshCw,
	Square,
	Trash2,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import {
	useBackup,
	useCleanOrphans,
	useStartHydra,
	useStopHydra,
	useSyncMsi,
} from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import type { ControlResponse } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Types ───────────────────────────────────────────────────────────────
interface ActionResult {
	actionLabel: string;
	response: ControlResponse;
	ts: Date;
}

type MutationReturn = {
	mutateAsync: () => Promise<ControlResponse>;
	isPending: boolean;
};

// ── Confirmation dialog ─────────────────────────────────────────────────
interface ConfirmDialogProps {
	title: string;
	description: string;
	onConfirm: () => void;
	onCancel: () => void;
	danger?: boolean;
}

function ConfirmDialog({
	title,
	description,
	onConfirm,
	onCancel,
	danger = false,
}: ConfirmDialogProps) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-label={title}
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
				onClick={onCancel}
				aria-hidden="true"
			/>
			{/* Dialog */}
			<div className="relative glass-card p-6 w-full max-w-sm mx-4 shadow-2xl">
				<div className="flex items-start gap-3 mb-4">
					<AlertTriangle
						size={20}
						className={
							danger
								? "text-[oklch(0.62_0.22_25)] shrink-0 mt-0.5"
								: "text-[oklch(0.78_0.16_75)] shrink-0 mt-0.5"
						}
						aria-hidden="true"
					/>
					<div>
						<h3 className="text-sm font-semibold text-text-primary">{title}</h3>
						<p className="text-xs text-text-secondary mt-1">{description}</p>
					</div>
				</div>
				<div className="flex items-center justify-end gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-border transition-colors min-h-11"
					>
						ביטול
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className={cn(
							"px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-11",
							danger
								? "bg-[oklch(0.62_0.22_25/0.2)] text-[oklch(0.62_0.22_25)] border border-[oklch(0.62_0.22_25/0.4)] hover:bg-[oklch(0.62_0.22_25/0.3)]"
								: "bg-[oklch(0.78_0.16_75/0.2)] text-[oklch(0.78_0.16_75)] border border-[oklch(0.78_0.16_75/0.4)] hover:bg-[oklch(0.78_0.16_75/0.3)]",
						)}
					>
						אישור
					</button>
				</div>
			</div>
		</div>
	);
}

// ── Result display ──────────────────────────────────────────────────────
function ResultBadge({
	status,
	message,
}: {
	status: "ok" | "warn" | "error";
	message: string;
}) {
	const isOk = status === "ok";
	const isWarn = status === "warn";
	return (
		<div
			className={cn(
				"flex items-start gap-2 rounded-lg px-3 py-2 mt-2 text-xs",
				isOk
					? "bg-[oklch(0.72_0.19_155/0.1)] border border-[oklch(0.72_0.19_155/0.25)] text-[oklch(0.72_0.19_155)]"
					: isWarn
						? "bg-[oklch(0.78_0.16_75/0.1)] border border-[oklch(0.78_0.16_75/0.25)] text-[oklch(0.78_0.16_75)]"
						: "bg-[oklch(0.62_0.22_25/0.1)] border border-[oklch(0.62_0.22_25/0.25)] text-[oklch(0.62_0.22_25)]",
			)}
		>
			{isOk ? (
				<CheckCircle2
					size={14}
					className="shrink-0 mt-0.5"
					aria-hidden="true"
				/>
			) : (
				<XCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
			)}
			<span>{message}</span>
		</div>
	);
}

// ── Action card ─────────────────────────────────────────────────────────
type ActionVariant = "primary" | "danger" | "warning";

interface ActionCardProps {
	label: string;
	description: string;
	icon: React.ReactNode;
	variant: ActionVariant;
	mutation: MutationReturn;
	lastResult?: ControlResponse;
	requireConfirm?: boolean;
	confirmTitle?: string;
	confirmDescription?: string;
	danger?: boolean;
	onResult: (label: string, result: ControlResponse) => void;
}

function ActionCard({
	label,
	description,
	icon,
	variant,
	mutation,
	lastResult,
	requireConfirm = false,
	confirmTitle,
	confirmDescription,
	danger = false,
	onResult,
}: ActionCardProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	const variantStyles: Record<
		ActionVariant,
		{ bg: string; text: string; border: string; hover: string }
	> = {
		primary: {
			bg: "bg-[oklch(0.65_0.18_250/0.15)]",
			text: "text-[oklch(0.65_0.18_250)]",
			border: "border-[oklch(0.65_0.18_250/0.35)]",
			hover: "hover:bg-[oklch(0.65_0.18_250/0.25)]",
		},
		danger: {
			bg: "bg-[oklch(0.62_0.22_25/0.15)]",
			text: "text-[oklch(0.62_0.22_25)]",
			border: "border-[oklch(0.62_0.22_25/0.35)]",
			hover: "hover:bg-[oklch(0.62_0.22_25/0.25)]",
		},
		warning: {
			bg: "bg-[oklch(0.78_0.16_75/0.15)]",
			text: "text-[oklch(0.78_0.16_75)]",
			border: "border-[oklch(0.78_0.16_75/0.35)]",
			hover: "hover:bg-[oklch(0.78_0.16_75/0.25)]",
		},
	};

	const styles = variantStyles[variant];

	const handleClick = () => {
		if (requireConfirm) {
			setShowConfirm(true);
		} else {
			void executeAction();
		}
	};

	const executeAction = async () => {
		setShowConfirm(false);
		const result = await mutation.mutateAsync();
		onResult(label, result);
	};

	const iconBgColor =
		variant === "primary"
			? "var(--color-accent-blue)"
			: variant === "danger"
				? "var(--color-accent-red)"
				: "var(--color-accent-amber)";

	return (
		<>
			{showConfirm && confirmTitle && confirmDescription && (
				<ConfirmDialog
					title={confirmTitle}
					description={confirmDescription}
					danger={danger}
					onConfirm={() => void executeAction()}
					onCancel={() => setShowConfirm(false)}
				/>
			)}

			<div className="glass-card card-spotlight p-5 flex flex-col gap-3">
				{/* Icon + label */}
				<div className="flex items-center gap-3">
					<div
						className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
						style={{
							backgroundColor: `color-mix(in oklch, ${iconBgColor} 15%, transparent)`,
						}}
					>
						<span style={{ color: iconBgColor }} aria-hidden="true">
							{icon}
						</span>
					</div>
					<div className="min-w-0">
						<div className="text-sm font-semibold text-text-primary">
							{label}
						</div>
						<div className="text-xs text-text-muted mt-0.5 leading-relaxed">
							{description}
						</div>
					</div>
				</div>

				{/* Action button */}
				<button
					type="button"
					onClick={handleClick}
					disabled={mutation.isPending}
					aria-label={label}
					className={cn(
						"w-full flex items-center justify-center gap-2 px-4 py-2.5",
						"rounded-lg border font-medium text-sm transition-all min-h-11",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						styles.bg,
						styles.text,
						styles.border,
						!mutation.isPending && styles.hover,
					)}
				>
					{mutation.isPending ? (
						<>
							<RefreshCw
								size={15}
								className="animate-spin"
								aria-hidden="true"
							/>
							<span>מבצע...</span>
						</>
					) : (
						<>
							<span aria-hidden="true">{icon}</span>
							<span>{label}</span>
						</>
					)}
				</button>

				{/* Last result */}
				{lastResult && (
					<ResultBadge
						status={lastResult.status}
						message={lastResult.message}
					/>
				)}
			</div>
		</>
	);
}

// ── Action log entry ────────────────────────────────────────────────────
function LogEntry({ entry }: { entry: ActionResult }) {
	const isOk = entry.response.status === "ok";
	const isWarn = entry.response.status === "warn";
	return (
		<div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
			{isOk ? (
				<CheckCircle2
					size={14}
					className="text-[oklch(0.72_0.19_155)] shrink-0 mt-0.5"
					aria-hidden="true"
				/>
			) : (
				<XCircle
					size={14}
					className="text-[oklch(0.62_0.22_25)] shrink-0 mt-0.5"
					aria-hidden="true"
				/>
			)}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-sm font-medium text-text-primary">
						{entry.actionLabel}
					</span>
					<Badge variant={isOk ? "success" : isWarn ? "warning" : "error"}>
						{isOk ? "הצלחה" : isWarn ? "אזהרה" : "שגיאה"}
					</Badge>
					<span className="text-xs text-text-muted">
						{entry.ts.toLocaleTimeString("he-IL")}
					</span>
				</div>
				<p className="text-xs text-text-secondary mt-0.5">
					{entry.response.message}
				</p>
			</div>
		</div>
	);
}

// ── Main page ───────────────────────────────────────────────────────────
export function ControlPage() {
	const [actionLog, setActionLog] = useState<ActionResult[]>([]);
	const [lastResults, setLastResults] = useState<
		Record<string, ControlResponse>
	>({});

	const startHydra = useStartHydra();
	const stopHydra = useStopHydra();
	const backup = useBackup();
	const cleanOrphans = useCleanOrphans();
	const syncMsi = useSyncMsi();

	const handleResult = (label: string, result: ControlResponse) => {
		setLastResults((prev) => ({ ...prev, [label]: result }));
		setActionLog((prev) =>
			[{ actionLabel: label, response: result, ts: new Date() }, ...prev].slice(
				0,
				50,
			),
		);
		if (result.status === "ok") {
			toast("פעולה הושלמה בהצלחה", "success");
		} else {
			toast("שגיאה בביצוע פעולה", "error");
		}
	};

	return (
		<div className="space-y-6" dir="rtl">
			<PageHeader
				icon={Activity}
				title="שליטה"
				description="פעולות שליטה — הפעלה/עצירה של שירותים, גיבוי, וניקוי"
			/>

			{/* Action cards grid */}
			<section aria-label="פעולות שליטה">
				<h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
					פעולות זמינות
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-grid">
					<ActionCard
						label="הפעל הידרה"
						description="מפעיל את תהליך Hydra v2 ומתחיל לעבד תוכניות מ-pending/"
						icon={<Play size={18} />}
						variant="primary"
						mutation={startHydra}
						lastResult={lastResults["הפעל הידרה"]}
						onResult={handleResult}
					/>

					<ActionCard
						label="עצור הידרה"
						description="שולח SIGTERM לתהליך הידרה הפעיל — מאפשר סיום מסודר"
						icon={<Square size={18} />}
						variant="danger"
						mutation={stopHydra}
						lastResult={lastResults["עצור הידרה"]}
						requireConfirm
						confirmTitle="עצור את הידרה?"
						confirmDescription="כל משימות in-progress יישארו בתיקיה in-progress/ ויצטרכו להיות מועברות ידנית ל-pending/ לניסיון חוזר."
						danger
						onResult={handleResult}
					/>

					<ActionCard
						label="גיבוי מסד נתונים"
						description="מבצע גיבוי של hydra-state.db ו-lancedb_memory לספריית backup/"
						icon={<Database size={18} />}
						variant="warning"
						mutation={backup}
						lastResult={lastResults["גיבוי מסד נתונים"]}
						onResult={handleResult}
					/>

					<ActionCard
						label="נקה תהליכים יתומים"
						description="הורג תהליכי Node.js/MCP שנשארו ללא הורה אחרי כיבוי סוכנים"
						icon={<Trash2 size={18} />}
						variant="warning"
						mutation={cleanOrphans}
						lastResult={lastResults["נקה תהליכים יתומים"]}
						requireConfirm
						confirmTitle="נקה תהליכים יתומים?"
						confirmDescription="פעולה זו תהרוג תהליכי Node.js ושרתי MCP שאינם מקושרים לסוכן פעיל."
						onResult={handleResult}
					/>

					<ActionCard
						label="סנכרן MSI"
						description="מריץ claude-sync push ומסנכרן hooks/rules/skills ל-MSI דרך Tailscale"
						icon={<RefreshCw size={18} />}
						variant="primary"
						mutation={syncMsi}
						lastResult={lastResults["סנכרן MSI"]}
						onResult={handleResult}
					/>
				</div>
			</section>

			{/* Action log */}
			<div className="glass-card card-spotlight overflow-hidden">
				<div className="p-4 border-b border-border flex items-center justify-between">
					<h2 className="text-sm font-semibold text-text-primary">
						יומן פעולות
					</h2>
					{actionLog.length > 0 && (
						<button
							type="button"
							onClick={() => setActionLog([])}
							className="text-xs text-text-muted hover:text-text-secondary transition-colors"
						>
							נקה
						</button>
					)}
				</div>
				<div className="p-4">
					{actionLog.length === 0 ? (
						<p className="text-sm text-text-muted text-center py-6">
							אין פעולות עדיין — הפעל פעולה כלשהי
						</p>
					) : (
						<div className="space-y-0">
							{actionLog.map((entry) => (
								<LogEntry
									key={`${entry.actionLabel}-${entry.ts.getTime()}`}
									entry={entry}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
