import { clsx } from "clsx";
import {
	AlertCircle,
	CheckCircle2,
	Info,
	TriangleAlert,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
	type ToastItem,
	type ToastType,
	useToastState,
} from "@/hooks/use-toast";

// ── Visual config per type ────────────────────────────────────────────────

const CONFIG: Record<
	ToastType,
	{ icon: React.ReactNode; border: string; bg: string; text: string }
> = {
	success: {
		icon: <CheckCircle2 className="size-4 shrink-0" />,
		border: "border-[oklch(0.72_0.19_155)]",
		bg: "bg-[oklch(0.72_0.19_155/0.12)]",
		text: "text-[oklch(0.72_0.19_155)]",
	},
	error: {
		icon: <AlertCircle className="size-4 shrink-0" />,
		border: "border-[oklch(0.62_0.22_25)]",
		bg: "bg-[oklch(0.62_0.22_25/0.12)]",
		text: "text-[oklch(0.62_0.22_25)]",
	},
	warning: {
		icon: <TriangleAlert className="size-4 shrink-0" />,
		border: "border-[oklch(0.78_0.16_75)]",
		bg: "bg-[oklch(0.78_0.16_75/0.12)]",
		text: "text-[oklch(0.78_0.16_75)]",
	},
	info: {
		icon: <Info className="size-4 shrink-0" />,
		border: "border-[oklch(0.65_0.18_250)]",
		bg: "bg-[oklch(0.65_0.18_250/0.12)]",
		text: "text-[oklch(0.65_0.18_250)]",
	},
};

const LABELS: Record<ToastType, string> = {
	success: "הצלחה",
	error: "שגיאה",
	warning: "אזהרה",
	info: "מידע",
};

// ── Single toast item ─────────────────────────────────────────────────────

function ToastCard({
	item,
	onDismiss,
}: {
	item: ToastItem;
	onDismiss: (id: string) => void;
}) {
	const cfg = CONFIG[item.type];

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: -20, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -12, scale: 0.95 }}
			transition={{ type: "spring", stiffness: 400, damping: 30 }}
			className={clsx(
				"flex items-start gap-3 rounded-xl border px-4 py-3",
				"shadow-lg shadow-black/40 backdrop-blur-md",
				"min-w-[280px] max-w-sm",
				cfg.border,
				cfg.bg,
			)}
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			{/* Icon */}
			<span className={clsx("mt-0.5", cfg.text)} aria-hidden="true">
				{cfg.icon}
			</span>

			{/* Text */}
			<div className="flex flex-1 flex-col gap-0.5 min-w-0">
				<span
					className={clsx(
						"text-xs font-semibold uppercase tracking-wider",
						cfg.text,
					)}
				>
					{LABELS[item.type]}
				</span>
				<p className="text-sm text-[oklch(0.95_0.01_260)] leading-snug break-words">
					{item.message}
				</p>
			</div>

			{/* Dismiss */}
			<button
				type="button"
				onClick={() => onDismiss(item.id)}
				className={clsx(
					"mt-0.5 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100",
					"focus-visible:outline-2 focus-visible:outline-offset-2",
					cfg.text,
				)}
				aria-label="סגור התראה"
			>
				<X className="size-3.5" />
			</button>
		</motion.div>
	);
}

// ── Provider / container ──────────────────────────────────────────────────

/**
 * Mount once at the app root.  All calls to toast() rendered here.
 */
export function ToastProvider() {
	const [toasts, dismiss] = useToastState();

	return (
		<section
			className="fixed top-4 inset-x-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-4"
			aria-label="התראות מערכת"
		>
			<AnimatePresence mode="sync">
				{toasts.map((item) => (
					<div key={item.id} className="pointer-events-auto">
						<ToastCard item={item} onDismiss={dismiss} />
					</div>
				))}
			</AnimatePresence>
		</section>
	);
}
