import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	BookOpen,
	Check,
	ChevronDown,
	ChevronUp,
	ClipboardList,
	Copy,
	Eye,
	FileCode2,
	Filter,
	Info,
	RefreshCw,
	Settings2,
	Shield,
	ShieldAlert,
	ShieldCheck,
	Terminal,
	Timer,
	Webhook,
	Wrench,
	Zap,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useHooks } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

// ── Color tokens (consistent with HooksPage) ─────────────────────────────────

const EVENT_COLORS: Record<string, string> = {
	PreToolUse: "oklch(0.65 0.18 250)",
	PostToolUse: "oklch(0.72 0.19 155)",
	Stop: "oklch(0.62 0.22 25)",
	SessionStart: "oklch(0.78 0.16 75)",
	PostCompact: "oklch(0.62 0.2 290)",
	UserPromptSubmit: "oklch(0.75 0.14 200)",
};

const EVENT_LABELS: Record<string, string> = {
	PreToolUse: "PreToolUse",
	PostToolUse: "PostToolUse",
	Stop: "Stop",
	SessionStart: "SessionStart",
	PostCompact: "PostCompact",
	UserPromptSubmit: "UserPromptSubmit",
};

const EVENT_BG: Record<string, string> = {
	PreToolUse:
		"bg-[oklch(0.65_0.18_250_/_0.12)] border-[oklch(0.65_0.18_250_/_0.35)]",
	PostToolUse:
		"bg-[oklch(0.72_0.19_155_/_0.12)] border-[oklch(0.72_0.19_155_/_0.35)]",
	Stop: "bg-[oklch(0.62_0.22_25_/_0.12)] border-[oklch(0.62_0.22_25_/_0.35)]",
	SessionStart:
		"bg-[oklch(0.78_0.16_75_/_0.12)] border-[oklch(0.78_0.16_75_/_0.35)]",
	PostCompact:
		"bg-[oklch(0.62_0.2_290_/_0.12)] border-[oklch(0.62_0.2_290_/_0.35)]",
	UserPromptSubmit:
		"bg-[oklch(0.75_0.14_200_/_0.12)] border-[oklch(0.75_0.14_200_/_0.35)]",
};

function getEventColor(event: string): string {
	return EVENT_COLORS[event] ?? "oklch(0.62 0.05 260)";
}

function getEventLabel(event: string): string {
	return EVENT_LABELS[event] ?? event;
}

function getEventBg(event: string): string {
	return EVENT_BG[event] ?? "bg-bg-elevated border-border";
}

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		} catch {
			// ignore
		}
	}, [text]);

	return (
		<button
			type="button"
			onClick={handleCopy}
			title="העתק"
			aria-label="העתק קוד"
			className={cn(
				"flex items-center justify-center min-h-11 min-w-11 w-7 h-7 rounded-md",
				"transition-all duration-150 cursor-pointer shrink-0",
				copied
					? "bg-accent-green/20 text-accent-green"
					: "bg-bg-elevated/80 text-text-muted hover:text-text-secondary hover:bg-bg-tertiary",
			)}
		>
			{copied ? <Check size={13} /> : <Copy size={13} />}
		</button>
	);
}

// ── Code block ───────────────────────────────────────────────────────────────

interface CodeBlockProps {
	code: string;
	lang?: string;
	title?: string;
}

function CodeBlock({ code, lang = "bash", title }: CodeBlockProps) {
	return (
		<div className="rounded-lg overflow-hidden border border-border/60 bg-bg-primary/70">
			<div className="flex items-center justify-between px-3 py-2 bg-bg-elevated/60 border-b border-border/40">
				<div className="flex items-center gap-2">
					<Terminal size={12} className="text-text-muted" aria-hidden="true" />
					{title && (
						<span className="text-xs text-text-muted font-mono">{title}</span>
					)}
					<span className="text-[10px] text-text-muted/60 font-mono">
						{lang}
					</span>
				</div>
				<CopyButton text={code} />
			</div>
			<pre className="p-4 text-xs font-mono text-text-secondary leading-relaxed overflow-x-auto whitespace-pre">
				<code>{code}</code>
			</pre>
		</div>
	);
}

// ── Accordion section ─────────────────────────────────────────────────────────

interface AccordionSectionProps {
	id: string;
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	accentColor?: string;
	badge?: string;
}

function AccordionSection({
	id,
	title,
	subtitle,
	icon,
	children,
	defaultOpen = false,
	accentColor = "var(--color-accent-blue)",
	badge,
}: AccordionSectionProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div
			className={cn(
				"glass-card overflow-hidden transition-colors duration-200",
				open && "shadow-[0_0_24px_oklch(0.65_0.18_250_/_0.08)]",
			)}
		>
			<button
				type="button"
				id={`section-${id}`}
				aria-expanded={open}
				aria-controls={`section-body-${id}`}
				onClick={() => setOpen((v) => !v)}
				className={cn(
					"w-full flex items-center gap-4 p-5 text-start",
					"hover:bg-bg-tertiary/40 transition-colors duration-150 cursor-pointer",
				)}
			>
				<div
					className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
					style={{
						backgroundColor: `color-mix(in oklch, ${accentColor} 15%, transparent)`,
					}}
				>
					{icon}
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<h2 className="text-base font-semibold text-text-primary">
							{title}
						</h2>
						{badge && (
							<span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-blue/15 text-accent-blue border border-accent-blue/25">
								{badge}
							</span>
						)}
					</div>
					<p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
				</div>
				{open ? (
					<ChevronUp size={16} className="text-text-muted shrink-0" />
				) : (
					<ChevronDown size={16} className="text-text-muted shrink-0" />
				)}
			</button>

			{open && (
				<section
					id={`section-body-${id}`}
					aria-labelledby={`section-${id}`}
					className="px-5 pb-6 space-y-4 border-t border-border/40"
				>
					<div className="pt-4">{children}</div>
				</section>
			)}
		</div>
	);
}

// ── Event type badge ──────────────────────────────────────────────────────────

function EventBadge({ event }: { event: string }) {
	return (
		<span
			className={cn(
				"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono border shrink-0",
				getEventBg(event),
			)}
			style={{ color: getEventColor(event) }}
		>
			{getEventLabel(event)}
		</span>
	);
}

// ── Decision badge ────────────────────────────────────────────────────────────

function DecisionBadge({ type }: { type: "block" | "allow" | "async" }) {
	const config = {
		block: {
			label: "BLOCKING",
			color: "oklch(0.62 0.22 25)",
			bg: "bg-[oklch(0.62_0.22_25_/_0.12)] border-[oklch(0.62_0.22_25_/_0.35)]",
		},
		allow: {
			label: "ASYNC",
			color: "oklch(0.72 0.19 155)",
			bg: "bg-[oklch(0.72_0.19_155_/_0.12)] border-[oklch(0.72_0.19_155_/_0.35)]",
		},
		async: {
			label: "ASYNC",
			color: "oklch(0.72 0.19 155)",
			bg: "bg-[oklch(0.72_0.19_155_/_0.12)] border-[oklch(0.72_0.19_155_/_0.35)]",
		},
	}[type];

	return (
		<span
			className={cn(
				"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono border shrink-0",
				config.bg,
			)}
			style={{ color: config.color }}
		>
			{config.label}
		</span>
	);
}

// ── Hook list item ────────────────────────────────────────────────────────────

interface HookItemProps {
	name: string;
	event: string;
	decision: "block" | "allow" | "async";
	description: string;
	details?: string[];
}

function HookItem({
	name,
	event,
	decision,
	description,
	details,
}: HookItemProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="border border-border/40 rounded-lg bg-bg-secondary/30 hover:bg-bg-secondary/50 transition-colors duration-150">
			<div className="flex items-start gap-3 p-3">
				<div className="flex flex-col items-start gap-1.5 pt-0.5 shrink-0 min-w-0">
					<EventBadge event={event} />
					<DecisionBadge type={decision} />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<span className="text-sm font-mono text-text-primary break-all">
							{name}
						</span>
						{details && details.length > 0 && (
							<button
								type="button"
								onClick={() => setExpanded((v) => !v)}
								aria-label={expanded ? "כווץ פרטים" : "הרחב פרטים"}
								className="shrink-0 text-text-muted hover:text-text-secondary transition-colors cursor-pointer mt-0.5"
							>
								{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
							</button>
						)}
					</div>
					<p className="text-xs text-text-muted mt-1 leading-relaxed">
						{description}
					</p>
					{expanded && details && (
						<ul className="mt-2 space-y-1">
							{details.map((d) => (
								<li
									key={d}
									className="flex items-start gap-2 text-xs text-text-secondary"
								>
									<ArrowLeft
										size={10}
										className="text-accent-blue shrink-0 mt-0.5 rtl:rotate-180"
										aria-hidden="true"
									/>
									<span>{d}</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}

// ── Flow diagram ──────────────────────────────────────────────────────────────

function FlowDiagram() {
	return (
		<div className="glass-card p-6" dir="rtl">
			<h3 className="text-sm font-semibold text-text-primary mb-6 flex items-center gap-2">
				<Zap size={14} className="text-accent-blue" aria-hidden="true" />
				זרימת Hook — מה קורה בפועל
			</h3>

			{/* Main flow row */}
			<div className="flex items-center gap-2 flex-wrap justify-center mb-6">
				{/* Step 1 */}
				<div className="flex flex-col items-center gap-1.5">
					<div className="w-28 h-14 rounded-lg flex flex-col items-center justify-center gap-1 bg-[oklch(0.75_0.14_200_/_0.12)] border border-[oklch(0.75_0.14_200_/_0.35)]">
						<Eye size={14} className="text-accent-cyan" aria-hidden="true" />
						<span className="text-[10px] font-medium text-accent-cyan text-center leading-tight">
							פעולת משתמש
						</span>
					</div>
					<span className="text-[9px] text-text-muted">User Action</span>
				</div>

				{/* Arrow */}
				<ArrowRight
					size={16}
					className="text-text-muted shrink-0 rtl:rotate-180"
					aria-hidden="true"
				/>

				{/* Step 2 */}
				<div className="flex flex-col items-center gap-1.5">
					<div className="w-28 h-14 rounded-lg flex flex-col items-center justify-center gap-1 bg-[oklch(0.65_0.18_250_/_0.12)] border border-[oklch(0.65_0.18_250_/_0.35)]">
						<Webhook
							size={14}
							className="text-accent-blue"
							aria-hidden="true"
						/>
						<span className="text-[10px] font-medium text-accent-blue text-center leading-tight">
							אירוע מופעל
						</span>
					</div>
					<span className="text-[9px] text-text-muted">Event Fires</span>
				</div>

				{/* Arrow */}
				<ArrowRight
					size={16}
					className="text-text-muted shrink-0 rtl:rotate-180"
					aria-hidden="true"
				/>

				{/* Step 3 */}
				<div className="flex flex-col items-center gap-1.5">
					<div className="w-28 h-14 rounded-lg flex flex-col items-center justify-center gap-1 bg-[oklch(0.78_0.16_75_/_0.12)] border border-[oklch(0.78_0.16_75_/_0.35)]">
						<Terminal
							size={14}
							className="text-accent-amber"
							aria-hidden="true"
						/>
						<span className="text-[10px] font-medium text-accent-amber text-center leading-tight">
							סקריפט רץ
						</span>
					</div>
					<span className="text-[9px] text-text-muted">Hook Script Runs</span>
				</div>

				{/* Arrow */}
				<ArrowRight
					size={16}
					className="text-text-muted shrink-0 rtl:rotate-180"
					aria-hidden="true"
				/>

				{/* Step 4 */}
				<div className="flex flex-col items-center gap-1.5">
					<div className="w-28 h-14 rounded-lg flex flex-col items-center justify-center gap-1 bg-bg-elevated border border-border">
						<Settings2
							size={14}
							className="text-text-secondary"
							aria-hidden="true"
						/>
						<span className="text-[10px] font-medium text-text-secondary text-center leading-tight">
							החלטה
						</span>
					</div>
					<span className="text-[9px] text-text-muted">Decision</span>
				</div>
			</div>

			{/* Decision branches */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
				{/* ALLOW */}
				<div className="rounded-lg border border-[oklch(0.72_0.19_155_/_0.4)] bg-[oklch(0.72_0.19_155_/_0.08)] p-3">
					<div className="flex items-center gap-2 mb-2">
						<Check size={13} className="text-accent-green" aria-hidden="true" />
						<span className="text-xs font-semibold text-accent-green">
							ALLOW
						</span>
					</div>
					<p className="text-[11px] text-text-secondary leading-relaxed">
						Claude Code ממשיך בפעולה כרגיל. exit code{" "}
						<span dir="ltr" className="font-mono">
							0
						</span>
						.
					</p>
				</div>

				{/* BLOCK */}
				<div className="rounded-lg border border-[oklch(0.62_0.22_25_/_0.4)] bg-[oklch(0.62_0.22_25_/_0.08)] p-3">
					<div className="flex items-center gap-2 mb-2">
						<ShieldAlert
							size={13}
							className="text-accent-red"
							aria-hidden="true"
						/>
						<span className="text-xs font-semibold text-accent-red">BLOCK</span>
					</div>
					<p className="text-[11px] text-text-secondary leading-relaxed">
						הפעולה נחסמת. Hook מחזיר JSON עם{" "}
						<span className="font-mono text-accent-red/80">
							"decision": "block"
						</span>{" "}
						והסיבה מוצגת לקלוד.
					</p>
				</div>

				{/* MODIFY */}
				<div className="rounded-lg border border-[oklch(0.62_0.2_290_/_0.4)] bg-[oklch(0.62_0.2_290_/_0.08)] p-3">
					<div className="flex items-center gap-2 mb-2">
						<Wrench
							size={13}
							className="text-accent-purple"
							aria-hidden="true"
						/>
						<span className="text-xs font-semibold text-accent-purple">
							MODIFY
						</span>
					</div>
					<p className="text-[11px] text-text-secondary leading-relaxed">
						Hook מחזיר{" "}
						<span className="font-mono text-accent-purple/80">
							"additionalContext"
						</span>{" "}
						— מידע נוסף שמוזרק לקונטקסט של קלוד.
					</p>
				</div>
			</div>

			{/* Input/Output format note */}
			<div className="mt-4 p-3 rounded-lg bg-bg-elevated/50 border border-border/40">
				<div className="flex items-start gap-2">
					<Info
						size={12}
						className="text-accent-blue shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<p className="text-[11px] text-text-muted leading-relaxed">
						<span className="text-text-secondary font-medium">
							פרוטוקול תקשורת:
						</span>{" "}
						Claude Code שולח JSON לתוך stdin של הסקריפט. הסקריפט מחזיר JSON
						ל-stdout. Blocking hooks (PreToolUse, Stop) חייבים להחזיר תשובה לפני
						שהפעולה תמשיך. Async hooks (PostToolUse) רצים ברקע ולא חוסמים.
					</p>
				</div>
			</div>
		</div>
	);
}

// ── Statistics section ────────────────────────────────────────────────────────

function StatsSection() {
	const { data, isLoading } = useHooks();

	if (isLoading || !data) {
		return (
			<div className="flex items-center justify-center h-32">
				<div className="flex items-center gap-3 text-text-muted">
					<RefreshCw size={16} className="animate-spin" aria-label="טוען..." />
					<span className="text-sm">טוען נתונים...</span>
				</div>
			</div>
		);
	}

	const sortedEvents = Object.entries(data.by_event).sort(
		([, a], [, b]) => b - a,
	);
	const maxCount = sortedEvents[0]?.[1] ?? 1;

	return (
		<div className="space-y-4">
			{/* Total */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<div className="glass-card p-4 text-center col-span-2 sm:col-span-1">
					<div
						className="text-3xl font-bold tabular-nums text-accent-blue"
						dir="ltr"
					>
						{data.total}
					</div>
					<div className="text-xs text-text-muted mt-1">הוקים כולל</div>
				</div>
				{sortedEvents.slice(0, 3).map(([event, count]) => (
					<div key={event} className="glass-card p-4 text-center">
						<div
							className="text-2xl font-bold tabular-nums"
							style={{ color: getEventColor(event) }}
							dir="ltr"
						>
							{count}
						</div>
						<div className="text-[10px] text-text-muted mt-1 font-mono">
							{event}
						</div>
					</div>
				))}
			</div>

			{/* Bar breakdown */}
			<div className="glass-card p-4 space-y-3">
				<h4 className="text-xs font-semibold text-text-muted">
					התפלגות לפי סוג אירוע
				</h4>
				{sortedEvents.map(([event, count]) => {
					const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
					const color = getEventColor(event);
					return (
						<div key={event} className="space-y-1.5">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span
										className="w-2 h-2 rounded-full shrink-0"
										style={{ backgroundColor: color }}
										aria-hidden="true"
									/>
									<span className="text-xs font-mono" style={{ color }}>
										{event}
									</span>
								</div>
								<span
									className="text-xs text-text-muted tabular-nums"
									dir="ltr"
								>
									{count} הוקים
								</span>
							</div>
							<div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
								<div
									className="h-full rounded-full transition-all duration-700"
									style={{ width: `${pct}%`, backgroundColor: color }}
								/>
							</div>
						</div>
					);
				})}
			</div>

			{/* Recent runs */}
			{data.recent.length > 0 && (
				<div className="glass-card overflow-hidden">
					<div className="px-4 py-3 border-b border-border/40">
						<h4 className="text-xs font-semibold text-text-muted">
							הרצות אחרונות
						</h4>
					</div>
					<div className="divide-y divide-border/30">
						{data.recent.slice(0, 8).map((item, idx) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: no stable id
								key={`${item.hook}-${idx}`}
								className="flex items-center justify-between px-4 py-2.5 hover:bg-bg-elevated/40 transition-colors"
							>
								<span className="text-xs font-mono text-text-secondary truncate max-w-[200px]">
									{item.hook}
								</span>
								<div className="flex items-center gap-3 shrink-0">
									<span
										className="text-[11px] text-text-muted tabular-nums"
										dir="ltr"
									>
										{item.duration_ms.toLocaleString("he-IL")} ms
									</span>
									<span
										className="text-[10px] text-text-muted font-mono"
										dir="ltr"
									>
										{(() => {
											try {
												return new Date(item.ts).toLocaleTimeString("he-IL", {
													hour: "2-digit",
													minute: "2-digit",
													second: "2-digit",
												});
											} catch {
												return item.ts;
											}
										})()}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function HooksDeepPage() {
	return (
		<div className="space-y-6" dir="rtl">
			{/* ── Page Header ─────────────────────────────────────────────────── */}
			<div className="glass-card p-6">
				<div className="flex items-start gap-4">
					<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-blue/15 border border-accent-blue/25 shrink-0">
						<Webhook
							size={22}
							className="text-accent-blue"
							aria-hidden="true"
						/>
					</div>
					<div className="flex-1 min-w-0">
						<h1 className="text-2xl font-bold text-text-primary leading-tight">
							מערכת הוקים — מדריך מלא
						</h1>
						<p className="text-sm text-text-muted mt-1 leading-relaxed">
							Hooks הם סקריפטים אוטומטיים שרצים בתגובה לאירועים ב-Claude Code.
							הם מספקים שכבת שליטה, אבטחה, ואוטומציה מעל כל פעולה של הסוכן.
						</p>
					</div>
				</div>

				{/* Quick stats row */}
				<div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border/40">
					<div className="text-center">
						<div className="text-lg font-bold text-accent-blue" dir="ltr">
							6
						</div>
						<div className="text-[10px] text-text-muted">סוגי אירועים</div>
					</div>
					<div className="text-center">
						<div className="text-lg font-bold text-accent-green" dir="ltr">
							78
						</div>
						<div className="text-[10px] text-text-muted">הוקים פעילים</div>
					</div>
					<div className="text-center">
						<div className="text-lg font-bold text-accent-amber" dir="ltr">
							3
						</div>
						<div className="text-[10px] text-text-muted">סוגי החלטות</div>
					</div>
				</div>
			</div>

			{/* ── Section 1: מה זה Hook ───────────────────────────────────────── */}
			<AccordionSection
				id="what-is-hook"
				title="מה זה Hook?"
				subtitle="הגדרה, מטרה, ו-6 סוגי אירועים"
				icon={
					<BookOpen size={18} className="text-accent-blue" aria-hidden="true" />
				}
				defaultOpen
				accentColor="oklch(0.65 0.18 250)"
				badge="פרק 1"
			>
				<p className="text-sm text-text-secondary leading-relaxed mb-5">
					Hook הוא סקריפט (shell/Python/JavaScript) שמוגדר ב-
					<span className="font-mono text-accent-blue/80">settings.json</span>{" "}
					ורץ אוטומטית כשקלוד מפעיל אירוע מסוים. זוהי הדרך לשלוט בהתנהגות קלוד,
					לאכוף כללים, לתפוס מידע, ולהוסיף קונטקסט — הכל ללא צורך בהתערבות
					ידנית.
				</p>

				{/* 6 event types */}
				<div className="space-y-3">
					{/* PreToolUse */}
					<div className="rounded-lg border border-[oklch(0.65_0.18_250_/_0.3)] bg-[oklch(0.65_0.18_250_/_0.05)] p-4">
						<div className="flex items-start gap-3">
							<div
								className="w-2 h-2 rounded-full bg-[oklch(0.65_0.18_250)] shrink-0 mt-1.5"
								aria-hidden="true"
							/>
							<div>
								<div className="flex items-center gap-2 mb-1.5">
									<span className="text-sm font-bold font-mono text-[oklch(0.7_0.15_250)]">
										PreToolUse
									</span>
									<span className="text-[10px] px-2 py-0.5 rounded bg-[oklch(0.62_0.22_25_/_0.2)] text-accent-red border border-[oklch(0.62_0.22_25_/_0.3)] font-mono">
										יכול לחסום
									</span>
								</div>
								<p className="text-sm text-text-secondary leading-relaxed">
									רץ <strong className="text-text-primary">לפני</strong> שכלי
									מבצע פעולה (Bash, Edit, Write, Read, וכו׳). אם ה-hook מחזיר{" "}
									<span className="font-mono text-accent-red/80">
										"decision": "block"
									</span>
									, הפעולה לא תתבצע. שימוש עיקרי: הגנה מפני פקודות מסוכנות,
									אכיפת בדיקות מוקדמות.
								</p>
								<div className="mt-2 text-xs text-text-muted font-mono bg-bg-primary/50 rounded px-2 py-1">
									Input: tool_name, tool_input → Output: &#123;"decision":
									"block", "reason": "..."&#125; | &#123;&#125;
								</div>
							</div>
						</div>
					</div>

					{/* PostToolUse */}
					<div className="rounded-lg border border-[oklch(0.72_0.19_155_/_0.3)] bg-[oklch(0.72_0.19_155_/_0.05)] p-4">
						<div className="flex items-start gap-3">
							<div
								className="w-2 h-2 rounded-full bg-[oklch(0.72_0.19_155)] shrink-0 mt-1.5"
								aria-hidden="true"
							/>
							<div>
								<div className="flex items-center gap-2 mb-1.5">
									<span className="text-sm font-bold font-mono text-[oklch(0.75_0.16_155)]">
										PostToolUse
									</span>
									<span className="text-[10px] px-2 py-0.5 rounded bg-[oklch(0.72_0.19_155_/_0.2)] text-accent-green border border-[oklch(0.72_0.19_155_/_0.3)] font-mono">
										async
									</span>
								</div>
								<p className="text-sm text-text-secondary leading-relaxed">
									רץ <strong className="text-text-primary">אחרי</strong> שכלי
									הסתיים. מקבל גם את הקלט וגם את הפלט של הכלי. רץ ברקע — לא
									חוסם. שימוש עיקרי: לוגינג, שמירת ידע, auto-format, typecheck
									אחרי עריכה.
								</p>
								<div className="mt-2 text-xs text-text-muted font-mono bg-bg-primary/50 rounded px-2 py-1">
									Input: tool_name, tool_input, tool_response → Output:
									additionalContext (אופציונלי)
								</div>
							</div>
						</div>
					</div>

					{/* Stop */}
					<div className="rounded-lg border border-[oklch(0.62_0.22_25_/_0.3)] bg-[oklch(0.62_0.22_25_/_0.05)] p-4">
						<div className="flex items-start gap-3">
							<div
								className="w-2 h-2 rounded-full bg-[oklch(0.62_0.22_25)] shrink-0 mt-1.5"
								aria-hidden="true"
							/>
							<div>
								<div className="flex items-center gap-2 mb-1.5">
									<span className="text-sm font-bold font-mono text-[oklch(0.67_0.2_25)]">
										Stop
									</span>
									<span className="text-[10px] px-2 py-0.5 rounded bg-[oklch(0.62_0.22_25_/_0.2)] text-accent-red border border-[oklch(0.62_0.22_25_/_0.3)] font-mono">
										יכול לחסום
									</span>
								</div>
								<p className="text-sm text-text-secondary leading-relaxed">
									רץ כשקלוד{" "}
									<strong className="text-text-primary">עומד להפסיק</strong>{" "}
									לענות. יכול לחסום את ה"סיום" ולאלץ את קלוד להמשיך לעבוד. שימוש
									עיקרי: anti-premature-completion — בדיקה שהמשימה באמת הושלמה.
								</p>
								<div className="mt-2 text-xs text-text-muted font-mono bg-bg-primary/50 rounded px-2 py-1">
									Input: lastAssistantMessage → Output: &#123;"decision":
									"block", "reason": "..."&#125; | &#123;&#125;
								</div>
							</div>
						</div>
					</div>

					{/* PostCompact */}
					<div className="rounded-lg border border-[oklch(0.62_0.2_290_/_0.3)] bg-[oklch(0.62_0.2_290_/_0.05)] p-4">
						<div className="flex items-start gap-3">
							<div
								className="w-2 h-2 rounded-full bg-[oklch(0.62_0.2_290)] shrink-0 mt-1.5"
								aria-hidden="true"
							/>
							<div>
								<div className="flex items-center gap-2 mb-1.5">
									<span className="text-sm font-bold font-mono text-[oklch(0.67_0.18_290)]">
										PostCompact
									</span>
									<span className="text-[10px] px-2 py-0.5 rounded bg-[oklch(0.72_0.19_155_/_0.2)] text-accent-green border border-[oklch(0.72_0.19_155_/_0.3)] font-mono">
										async
									</span>
								</div>
								<p className="text-sm text-text-secondary leading-relaxed">
									רץ{" "}
									<strong className="text-text-primary">
										אחרי קיצור קונטקסט
									</strong>{" "}
									(compact). מידע ספציפי עלול ללכת לאיבוד בקיצור — ה-hook מאפשר
									להחזיר אותו. שימוש עיקרי: re-inject של CURRENT_TASK.md כדי
									שקלוד לא ישכח מה הוא עושה.
								</p>
								<div className="mt-2 text-xs text-text-muted font-mono bg-bg-primary/50 rounded px-2 py-1">
									Input: summary → Output: additionalContext (תוכן שיוזרק חזרה
									לקונטקסט)
								</div>
							</div>
						</div>
					</div>

					{/* UserPromptSubmit */}
					<div className="rounded-lg border border-[oklch(0.75_0.14_200_/_0.3)] bg-[oklch(0.75_0.14_200_/_0.05)] p-4">
						<div className="flex items-start gap-3">
							<div
								className="w-2 h-2 rounded-full bg-[oklch(0.75_0.14_200)] shrink-0 mt-1.5"
								aria-hidden="true"
							/>
							<div>
								<div className="flex items-center gap-2 mb-1.5">
									<span className="text-sm font-bold font-mono text-[oklch(0.78_0.12_200)]">
										UserPromptSubmit
									</span>
									<span className="text-[10px] px-2 py-0.5 rounded bg-[oklch(0.72_0.19_155_/_0.2)] text-accent-green border border-[oklch(0.72_0.19_155_/_0.3)] font-mono">
										async
									</span>
								</div>
								<p className="text-sm text-text-secondary leading-relaxed">
									רץ כשהמשתמש{" "}
									<strong className="text-text-primary">שולח הודעה</strong>.
									יכול לקרוא את הפרומפט ולהוסיף מידע לקונטקסט לפני שקלוד רואה
									אותו. שימוש עיקרי: capture-user-request — שמירת הבקשה הראשונה
									לקובץ CURRENT_TASK.md.
								</p>
								<div className="mt-2 text-xs text-text-muted font-mono bg-bg-primary/50 rounded px-2 py-1">
									Input: prompt → Output: additionalContext (מידע שיוזרק לפני
									שקלוד עונה)
								</div>
							</div>
						</div>
					</div>

					{/* SessionStart */}
					<div className="rounded-lg border border-[oklch(0.78_0.16_75_/_0.3)] bg-[oklch(0.78_0.16_75_/_0.05)] p-4">
						<div className="flex items-start gap-3">
							<div
								className="w-2 h-2 rounded-full bg-[oklch(0.78_0.16_75)] shrink-0 mt-1.5"
								aria-hidden="true"
							/>
							<div>
								<div className="flex items-center gap-2 mb-1.5">
									<span className="text-sm font-bold font-mono text-[oklch(0.8_0.14_75)]">
										SessionStart
									</span>
									<span className="text-[10px] px-2 py-0.5 rounded bg-[oklch(0.72_0.19_155_/_0.2)] text-accent-green border border-[oklch(0.72_0.19_155_/_0.3)] font-mono">
										async
									</span>
								</div>
								<p className="text-sm text-text-secondary leading-relaxed">
									רץ{" "}
									<strong className="text-text-primary">בתחילת כל סשן</strong>.
									מאפשר לטעון קונטקסט קבוע — כמו מצב המערכת, פרויקט נוכחי, או
									חוקים שצריכים להיות זמינים תמיד. שימוש עיקרי:
									session-create-task-file — יצירת תבנית CURRENT_TASK.md.
								</p>
								<div className="mt-2 text-xs text-text-muted font-mono bg-bg-primary/50 rounded px-2 py-1">
									Input: session_id, cwd → Output: additionalContext (הוזרק
									לפרומפט המערכת)
								</div>
							</div>
						</div>
					</div>
				</div>
			</AccordionSection>

			{/* ── Section 2: Flow Diagram ─────────────────────────────────────── */}
			<AccordionSection
				id="flow"
				title="איך Hook עובד — תרשים זרימה"
				subtitle="ויזואליזציה של המחזור המלא: פעולה → אירוע → החלטה"
				icon={
					<Zap size={18} className="text-accent-amber" aria-hidden="true" />
				}
				defaultOpen
				accentColor="oklch(0.78 0.16 75)"
				badge="פרק 2"
			>
				<FlowDiagram />

				{/* stdin/stdout protocol detail */}
				<div className="mt-4 space-y-3">
					<h4 className="text-sm font-semibold text-text-secondary">
						פרוטוקול stdin / stdout — הפרטים הטכניים
					</h4>
					<CodeBlock
						lang="jsonc"
						title="stdin — מה קלוד שולח להוק"
						code={`// PreToolUse — שנשלח לפני Bash
{
  "session_id": "abc123",
  "tool_name": "Bash",
  "tool_input": {
    "command": "rm -rf /important"
  }
}

// Stop — שנשלח לפני שקלוד עוצר
{
  "session_id": "abc123",
  "lastAssistantMessage": "סיימתי את המשימה! הכל עובד."
}

// PostToolUse — שנשלח אחרי Edit
{
  "session_id": "abc123",
  "tool_name": "Write",
  "tool_input": { "file_path": "src/App.tsx", "content": "..." },
  "tool_response": { "success": true }
}`}
					/>
					<CodeBlock
						lang="jsonc"
						title="stdout — מה ההוק מחזיר לקלוד"
						code={`// 1. ALLOW — מאפשר להמשיך (exit 0 + JSON ריק)
{}

// 2. BLOCK — חוסם את הפעולה
{
  "decision": "block",
  "reason": "פקודה זו אסורה: rm -rf. השתמש במחיקה בטוחה."
}

// 3. INJECT CONTEXT — מוסיף מידע לקונטקסט של קלוד
{
  "additionalContext": "תזכורת: המשימה הנוכחית היא לתקן bug #142.\\nCURRENT_TASK: ..."
}`}
					/>
				</div>
			</AccordionSection>

			{/* ── Section 3: Hooks חשובים ────────────────────────────────────── */}
			<AccordionSection
				id="important-hooks"
				title="הוקים חשובים — לפי קטגוריה"
				subtitle="Anti-Sycophancy, Security, Auto-Format, Knowledge"
				icon={
					<Shield size={18} className="text-accent-purple" aria-hidden="true" />
				}
				defaultOpen
				accentColor="oklch(0.62 0.2 290)"
				badge="פרק 3"
			>
				<div className="space-y-6">
					{/* Anti-Sycophancy */}
					<div>
						<div className="flex items-center gap-2 mb-3">
							<div className="flex items-center justify-center w-6 h-6 rounded-md bg-accent-red/15">
								<ShieldAlert
									size={13}
									className="text-accent-red"
									aria-hidden="true"
								/>
							</div>
							<h4 className="text-sm font-semibold text-text-primary">
								Anti-Sycophancy
							</h4>
							<span className="text-[10px] text-text-muted">
								5 הוקים — מונעים תשובות שטחיות ו"done" מוקדם
							</span>
						</div>
						<div className="space-y-2">
							<HookItem
								name="anti-premature-completion.sh"
								event="Stop"
								decision="block"
								description="חוסם קלוד אם הוא כותב 'done'/'סיימתי' עם פריטים שטרם טופלו (TODO/pending/חסר/unchecked) בתשובה."
								details={[
									"בודק lastAssistantMessage עם regex patterns עבריים ואנגליים",
									"אם נמצא פריט פתוח — מחזיר block עם הסבר מה חסר",
									"מחייב את קלוד לסיים את כל הסעיפים לפני שמצהיר 'done'",
								]}
							/>
							<HookItem
								name="prerequisite-check.sh"
								event="PreToolUse"
								decision="block"
								description="חוסם mutation testing (stryker/mutmut/glados) אם פחות מ-3 קבצי טסט קיימים בפרויקט."
								details={[
									"מונע הרצת mutation testing על codebase ריק מטסטים",
									"בודק count של *.test.ts/*.spec.ts בתיקיית הפרויקט",
									"משמש כ-prerequisite gate גנרי לכלים כבדים",
								]}
							/>
							<HookItem
								name="post-compact-reinject.sh"
								event="PostCompact"
								decision="async"
								description="אחרי /compact, קורא את CURRENT_TASK.md ומזריק את תוכנו חזרה לקונטקסט — כך קלוד לא שוכח מה המשימה."
								details={[
									"משתמש ב-git rev-parse --show-toplevel כ-fallback אם CWD לא root",
									"אם הקובץ לא קיים — מחזיר additionalContext ריק (לא נכשל)",
									"CRITICAL: ה-CWD בזמן hook fire יכול להיות $HOME או /tmp — תמיד עם fallback",
								]}
							/>
							<HookItem
								name="session-create-task-file.sh"
								event="SessionStart"
								decision="async"
								description="בתחילת כל סשן, יוצר .claude/CURRENT_TASK.md עם תבנית ריקה אם הפרויקט הוא git repo."
								details={[
									"בודק שה-cwd הוא git repo לפני יצירה",
									"רק יוצר אם הקובץ לא קיים — לא מחליף קיים",
								]}
							/>
							<HookItem
								name="capture-user-request.sh"
								event="UserPromptSubmit"
								decision="async"
								description="כשהמשתמש שולח הודעה ראשונה (>20 תווים), כותב אותה ל-.claude/CURRENT_TASK.md."
								details={[
									"רק ההודעה הראשונה הארוכה — לא כל הודעה",
									"מאפשר ל-post-compact-reinject לשחזר מה ביקשנו",
								]}
							/>
						</div>
					</div>

					{/* Security */}
					<div>
						<div className="flex items-center gap-2 mb-3">
							<div className="flex items-center justify-center w-6 h-6 rounded-md bg-accent-amber/15">
								<ShieldCheck
									size={13}
									className="text-accent-amber"
									aria-hidden="true"
								/>
							</div>
							<h4 className="text-sm font-semibold text-text-primary">אבטחה</h4>
							<span className="text-[10px] text-text-muted">
								3 הוקים — הגנה מפני פעולות הרסניות
							</span>
						</div>
						<div className="space-y-2">
							<HookItem
								name="tool-guard-hybrid.py"
								event="PreToolUse"
								decision="block"
								description="חוסם פקודות Bash מסוכנות: rm -rf, git push --force, git reset --hard, chmod 777, curl | bash, ועוד."
								details={[
									"שני רבדים: block מוחלט (rm -rf /), ו-warn בלבד (git reset --hard ~ בתוך ה-HOME)",
									"Python לצד bash — מאפשר regex מורכב ו-path analysis",
									"Exception list: פקודות ssh מרחוק, git branch -D בתוך feature branches",
									"מחזיר JSON עם decision=block ורשימת המתאים שנמצא",
								]}
							/>
							<HookItem
								name="dispatch-command-guard.sh"
								event="PreToolUse"
								decision="block"
								description="מוודא שפקודות dispatch לסוכנים חיצוניים (kimi, gemini, codex, minimax) משתמשות בדגלים הנכונים."
								details={[
									"Kimi: חייב --quiet ו--yolo. חסום stdin pipe בלי -p",
									"Codex: חייב --dangerously-bypass. חסום --full-auto",
									"Gemini: מוודא -m gemini-3.1-pro-preview",
									"Exclusions: pip install, grep, cat, --version — לא חסומים",
								]}
							/>
							<HookItem
								name="git-commit-guard.sh"
								event="PreToolUse"
								decision="block"
								description="חוסם git commit ישיר — מחייב שה-typecheck וה-lint יעברו לפני כל commit."
								details={[
									"חוסם גם פקודות ssh שמכילות 'git commit' (הפעל מקומית!)",
									"חלופה: python3 subprocess עם ['git','commit','-m','msg'] ב-SSH",
								]}
							/>
						</div>
					</div>

					{/* Auto-Format */}
					<div>
						<div className="flex items-center gap-2 mb-3">
							<div className="flex items-center justify-center w-6 h-6 rounded-md bg-accent-blue/15">
								<Wrench
									size={13}
									className="text-accent-blue"
									aria-hidden="true"
								/>
							</div>
							<h4 className="text-sm font-semibold text-text-primary">
								Auto-Format
							</h4>
							<span className="text-[10px] text-text-muted">
								3 הוקים — שמירה על איכות קוד אוטומטית
							</span>
						</div>
						<div className="space-y-2">
							<HookItem
								name="post-edit-format.sh"
								event="PostToolUse"
								decision="async"
								description="אחרי כל Edit/Write על קובץ .ts/.tsx/.js/.jsx — מריץ Biome format אוטומטית."
								details={[
									"בודק שקיים biome.json בפרויקט לפני הרצה — לא מריץ בפרויקטים ללא Biome",
									"async — לא חוסם את קלוד, רץ ברקע",
								]}
							/>
							<HookItem
								name="post-edit-typecheck.sh"
								event="PostToolUse"
								decision="async"
								description="אחרי כל Edit על קובץ .ts/.tsx — מריץ TypeScript --noEmit על הקובץ הספציפי ומציג שגיאות."
								details={[
									"מציג רק שגיאות רלוונטיות לקובץ שנערך, לא את כל הפרויקט",
									"מאפשר לקלוד לתפוס שגיאות TypeScript מיד אחרי כל עריכה",
								]}
							/>
							<HookItem
								name="check-console-log.sh"
								event="Stop"
								decision="async"
								description="לפני עצירה, בודק קבצי JS/TS שנשתנו ב-git ומזהיר על בדיקת לוגים שנשכחו."
								details={[
									"מדלג על קבצי test/spec/config — בדיקת לוגים בטסטים מותר",
									"async — מזהיר אבל לא חוסם. ניתן לשנות לחסימה אם רוצים",
								]}
							/>
						</div>
					</div>

					{/* Knowledge */}
					<div>
						<div className="flex items-center gap-2 mb-3">
							<div className="flex items-center justify-center w-6 h-6 rounded-md bg-accent-cyan/15">
								<ClipboardList
									size={13}
									className="text-accent-cyan"
									aria-hidden="true"
								/>
							</div>
							<h4 className="text-sm font-semibold text-text-primary">
								ידע ולמידה
							</h4>
							<span className="text-[10px] text-text-muted">
								2 הוקים — תיעוד אוטומטי של למידות
							</span>
						</div>
						<div className="space-y-2">
							<HookItem
								name="knowledge-capture.sh"
								event="PostToolUse"
								decision="async"
								description="תופס תוצרי Task/Agent ושומר אותם ל-beads.jsonl — יומן הידע המרכזי של APEX."
								details={[
									"בודק agent_id ב-stdin — מדלג על subagents (רק CLI sessions)",
									"שומר: timestamp, tool, task summary, project, cwd",
									"JSONL: tr '\\n' ' ' לפני כתיבה — מניע corruption",
									"מגביל ל-500 שורות, מסובב אוטומטית",
								]}
							/>
							<HookItem
								name="correction-detector.sh"
								event="PostToolUse"
								decision="async"
								description="מזהה כשהמשתמש מתקן את קלוד (כתב 'לא', 'שגוי', 'תתקן') ושומר ל-corrections.jsonl."
								details={[
									"עוקב אחרי patterns של תיקון: 'לא', 'אבל', 'שגוי', 'תתקן'",
									"מזין את ה-claude-md-auto-update.sh שמעדכן auto-learned-rules.md",
								]}
							/>
						</div>
					</div>
				</div>
			</AccordionSection>

			{/* ── Section 4: איך לכתוב Hook ──────────────────────────────────── */}
			<AccordionSection
				id="how-to-write"
				title="איך לכתוב Hook"
				subtitle="תבניות מלאות, פורמט JSON, כללים חשובים"
				icon={
					<FileCode2
						size={18}
						className="text-accent-green"
						aria-hidden="true"
					/>
				}
				accentColor="oklch(0.72 0.19 155)"
				badge="פרק 4"
			>
				<div className="space-y-5">
					{/* Settings registration */}
					<div>
						<h4 className="text-sm font-semibold text-text-secondary mb-3">
							1. רישום ב-settings.json
						</h4>
						<CodeBlock
							lang="json"
							title="~/.claude/settings.json"
							code={`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/tool-guard-hybrid.py",
            "timeout": 5
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/post-edit-format.sh",
            "timeout": 10
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/anti-premature-completion.sh",
            "timeout": 3
          }
        ]
      }
    ]
  }
}`}
						/>
						<div className="mt-2 p-3 rounded-lg bg-[oklch(0.62_0.22_25_/_0.08)] border border-[oklch(0.62_0.22_25_/_0.3)]">
							<div className="flex items-start gap-2">
								<AlertTriangle
									size={12}
									className="text-accent-red shrink-0 mt-0.5"
									aria-hidden="true"
								/>
								<p className="text-xs text-text-secondary leading-relaxed">
									<strong className="text-accent-red">
										timeout בשניות, לא מילישניות!
									</strong>{" "}
									<span className="font-mono">timeout: 5000</span> = 83 דקות.{" "}
									<span className="font-mono">timeout: 5</span> = 5 שניות. טעות
									זו קיימת בגרסאות ישנות.
								</p>
							</div>
						</div>
					</div>

					{/* Blocking hook template */}
					<div>
						<h4 className="text-sm font-semibold text-text-secondary mb-3">
							2. תבנית Hook חוסם (PreToolUse)
						</h4>
						<CodeBlock
							lang="bash"
							title="blocking-hook-template.sh"
							code={`#!/usr/bin/env bash
# Hook חוסם — PreToolUse
# Input: JSON ב-stdin
# Output: JSON ל-stdout + exit code

set -euo pipefail

# קרא input מ-stdin
INPUT=$(cat)

# חלץ שם הכלי והפקודה
TOOL_NAME=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('tool_name', ''))
" 2>/dev/null || echo "")

COMMAND=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('tool_input', {}).get('command', ''))
" 2>/dev/null || echo "")

# בדוק תנאי חסימה
if echo "$COMMAND" | grep -qE 'rm -rf /|:(){:|sudo rm'; then
  # חסום!
  python3 -c "
import json, sys
print(json.dumps({
    'decision': 'block',
    'reason': 'פקודה מסוכנת זוהתה: ' + sys.argv[1]
}, ensure_ascii=False))
" "$COMMAND"
  exit 0
fi

# אם הכל תקין — החזר JSON ריק (ALLOW)
echo '{}'
exit 0`}
						/>
					</div>

					{/* Async hook template */}
					<div>
						<h4 className="text-sm font-semibold text-text-secondary mb-3">
							3. תבנית Hook אסינכרוני (PostToolUse)
						</h4>
						<CodeBlock
							lang="bash"
							title="async-hook-template.sh"
							code={`#!/usr/bin/env bash
# Hook אסינכרוני — PostToolUse
# רץ ברקע, לא חוסם. יכול להחזיר additionalContext.

set -euo pipefail

INPUT=$(cat)

# בדוק אם זה subagent — אם כן, דלג
AGENT_ID=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('agent_id', ''))
" 2>/dev/null || echo "")

# מדלג על subagents
[ -n "$AGENT_ID" ] && echo '{}' && exit 0

# חלץ מידע על הכלי
TOOL=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('tool_name', ''))
" 2>/dev/null || echo "")

FILE=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('tool_input', {}).get('file_path', ''))
" 2>/dev/null || echo "")

# פעולה אסינכרונית (לוגינג, format, וכו')
if [ -n "$FILE" ] && [[ "$FILE" == *.ts || "$FILE" == *.tsx ]]; then
  # הרץ Biome ברקע
  biome format --write "$FILE" 2>/dev/null &
fi

# אפשר להחזיר additionalContext
echo '{}'
exit 0`}
						/>
					</div>

					{/* Testing a hook */}
					<div>
						<h4 className="text-sm font-semibold text-text-secondary mb-3">
							4. איך לבדוק Hook
						</h4>
						<CodeBlock
							lang="bash"
							title="testing hooks locally"
							code={`# בדיקת PreToolUse hook
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf /"}}' \\
  | bash ~/.claude/hooks/tool-guard-hybrid.py

# בדיקת Stop hook
echo '{"lastAssistantMessage":"סיימתי! הכל עובד בצורה מושלמת."}' \\
  | bash ~/.claude/hooks/anti-premature-completion.sh

# בדיקת PostCompact hook
echo '{"summary":"context was compacted"}' \\
  | bash ~/.claude/hooks/post-compact-reinject.sh

# בדיקה עם jq לפרסור נוח
echo '{"tool_name":"Bash","tool_input":{"command":"git status"}}' \\
  | bash ~/.claude/hooks/tool-guard-hybrid.py | python3 -m json.tool`}
						/>
					</div>

					{/* Timeout rules */}
					<div className="p-4 rounded-lg bg-bg-elevated/40 border border-border space-y-2">
						<div className="flex items-center gap-2">
							<Timer
								size={14}
								className="text-accent-amber"
								aria-hidden="true"
							/>
							<h4 className="text-sm font-semibold text-text-secondary">
								כללי timeout
							</h4>
						</div>
						<ul className="space-y-1.5 text-xs text-text-secondary">
							<li className="flex items-start gap-2">
								<span className="text-accent-green font-mono mt-0.5">✓</span>
								<span>
									Blocking hooks (PreToolUse, Stop):{" "}
									<span className="font-mono text-text-primary">
										timeout: 3–5
									</span>{" "}
									שניות מקסימום
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-accent-green font-mono mt-0.5">✓</span>
								<span>
									Async hooks (PostToolUse):{" "}
									<span className="font-mono text-text-primary">
										timeout: 10–30
									</span>{" "}
									שניות (כי לא חוסמים)
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-accent-red font-mono mt-0.5">✗</span>
								<span>
									<span className="font-mono text-accent-red">
										timeout: 5000
									</span>{" "}
									= 83 דקות (טעות נפוצה — זה שניות, לא מילי!)
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-accent-amber font-mono mt-0.5">!</span>
								<span>
									Hooks שתולים (hang) חוסמים את Claude Code — תמיד הגדר timeout
								</span>
							</li>
						</ul>
					</div>
				</div>
			</AccordionSection>

			{/* ── Section 5: סטטיסטיקות ─────────────────────────────────────── */}
			<AccordionSection
				id="statistics"
				title="סטטיסטיקות בזמן אמת"
				subtitle="נתונים חיים מה-API — כמות הוקים, התפלגות, הרצות אחרונות"
				icon={
					<Filter size={18} className="text-accent-cyan" aria-hidden="true" />
				}
				accentColor="oklch(0.75 0.14 200)"
				badge="פרק 5"
			>
				<StatsSection />
			</AccordionSection>

			{/* ── Section 6: כללים חשובים ────────────────────────────────────── */}
			<AccordionSection
				id="rules"
				title="כללים וטיפים חשובים"
				subtitle="Timeout units, agent_id guard, dead hooks, CWD fallback"
				icon={
					<AlertTriangle
						size={18}
						className="text-accent-red"
						aria-hidden="true"
					/>
				}
				accentColor="oklch(0.62 0.22 25)"
				badge="פרק 6"
			>
				<div className="space-y-4">
					{/* Critical rules */}
					<div className="space-y-3">
						{/* Rule 1 */}
						<div className="rounded-lg border border-[oklch(0.62_0.22_25_/_0.4)] bg-[oklch(0.62_0.22_25_/_0.06)] p-4">
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-red/20 shrink-0 mt-0.5">
									<span className="text-xs font-bold text-accent-red">1</span>
								</div>
								<div>
									<h5 className="text-sm font-semibold text-text-primary mb-1">
										timeout — שניות, לא מילישניות
									</h5>
									<p className="text-xs text-text-secondary leading-relaxed">
										Claude Code settings.json:{" "}
										<span className="font-mono text-accent-red">
											timeout: 5000
										</span>{" "}
										= 83 דקות! כתוב תמיד{" "}
										<span className="font-mono text-accent-green">
											timeout: 5
										</span>{" "}
										לחסימה של 5 שניות. בדוק עם:{" "}
										<span className="font-mono text-text-primary">
											{"grep '\"timeout\": [0-9]{4,}'"}
										</span>{" "}
										כדי לאתר בעיות.
									</p>
									<CodeBlock
										lang="jsonc"
										code={`// ❌ שגוי — 83 דקות!
"timeout": 5000

// ✅ נכון — 5 שניות
"timeout": 5`}
									/>
								</div>
							</div>
						</div>

						{/* Rule 2 */}
						<div className="rounded-lg border border-[oklch(0.78_0.16_75_/_0.4)] bg-[oklch(0.78_0.16_75_/_0.06)] p-4">
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-amber/20 shrink-0 mt-0.5">
									<span className="text-xs font-bold text-accent-amber">2</span>
								</div>
								<div>
									<h5 className="text-sm font-semibold text-text-primary mb-1">
										agent_id guard — דלג על subagents
									</h5>
									<p className="text-xs text-text-secondary leading-relaxed mb-2">
										Hooks שכותבים ל-state גלובלי (JSONL, corrections, knowledge)
										חייבים לדלג כשמדובר ב-subagent — אחרת הם כותבים לוגים
										כפולים.
									</p>
									<CodeBlock
										lang="bash"
										code={`# תמיד בתחילת hooks שכותבים ל-state
AGENT_ID=$(echo "$INPUT" | python3 -c "
import sys, json
print(json.load(sys.stdin).get('agent_id', ''))
" 2>/dev/null || echo "")

# דלג אם זה subagent
[ -n "$AGENT_ID" ] && echo '{}' && exit 0

# אפשר גם לבדוק CLAUDE_CODE_ENTRYPOINT
[ "$CLAUDE_CODE_ENTRYPOINT" != "cli" ] && echo '{}' && exit 0`}
									/>
								</div>
							</div>
						</div>

						{/* Rule 3 */}
						<div className="rounded-lg border border-[oklch(0.62_0.2_290_/_0.4)] bg-[oklch(0.62_0.2_290_/_0.06)] p-4">
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-purple/20 shrink-0 mt-0.5">
									<span className="text-xs font-bold text-accent-purple">
										3
									</span>
								</div>
								<div>
									<h5 className="text-sm font-semibold text-text-primary mb-1">
										CWD Fallback ב-PostCompact
									</h5>
									<p className="text-xs text-text-secondary leading-relaxed mb-2">
										ה-CWD בזמן שה-hook יורה יכול להיות{" "}
										<span className="font-mono">$HOME</span> או{" "}
										<span className="font-mono">/tmp</span> — לא project root.
										כל hook שמנסה לקרוא קבצים יחסיים חייב fallback.
									</p>
									<CodeBlock
										lang="bash"
										code={`# ❌ שגוי — CWD לא בטוח
TASK_FILE=".claude/CURRENT_TASK.md"

# ✅ נכון — עם git fallback
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
if [ -n "$PROJECT_ROOT" ]; then
  TASK_FILE="$PROJECT_ROOT/.claude/CURRENT_TASK.md"
else
  echo '{}' && exit 0  # אין git repo, דלג בשקט
fi`}
									/>
								</div>
							</div>
						</div>

						{/* Rule 4 */}
						<div className="rounded-lg border border-[oklch(0.65_0.18_250_/_0.4)] bg-[oklch(0.65_0.18_250_/_0.06)] p-4">
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-blue/20 shrink-0 mt-0.5">
									<span className="text-xs font-bold text-accent-blue">4</span>
								</div>
								<div>
									<h5 className="text-sm font-semibold text-text-primary mb-1">
										אל תשכח: כל exit path חייב JSON תקין
									</h5>
									<p className="text-xs text-text-secondary leading-relaxed mb-2">
										Claude Code מפרסר את stdout בכל מקרה — גם אם ה-hook נכשל.
										שגיאת JSON ב-stdout = בעיה. כל{" "}
										<span className="font-mono">exit</span> חייב לפלוט JSON.
									</p>
									<CodeBlock
										lang="bash"
										code={`# ❌ שגוי — exit בלי JSON
if [ "$CONDITION" ]; then
  echo "error happened"
  exit 1  # Claude Code יקבל פלט לא תקין
fi

# ✅ נכון — כל exit path עם JSON
if [ "$CONDITION" ]; then
  echo '{"decision": "block", "reason": "שגיאה"}'
  exit 0  # תמיד exit 0 עם JSON מובנה
fi

# ❌ אל תשכח trap
trap 'echo "{}"' ERR EXIT  # fallback ל-JSON ריק בכשלון`}
									/>
								</div>
							</div>
						</div>

						{/* Rule 5 */}
						<div className="rounded-lg border border-[oklch(0.72_0.19_155_/_0.4)] bg-[oklch(0.72_0.19_155_/_0.06)] p-4">
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-green/20 shrink-0 mt-0.5">
									<span className="text-xs font-bold text-accent-green">5</span>
								</div>
								<div>
									<h5 className="text-sm font-semibold text-text-primary mb-1">
										זיהוי Dead Hooks
									</h5>
									<p className="text-xs text-text-secondary leading-relaxed mb-2">
										Hooks שלא רשומים ב-settings.json הם dead code — לא מבצעים
										כלום. בדוק תקופתית:
									</p>
									<CodeBlock
										lang="bash"
										code={`# זיהוי hooks ללא callers
for f in ~/.claude/hooks/*.{sh,js,py}; do
  name=$(basename "$f")
  refs=$(grep -rl "$name" ~/.claude/settings.json ~/.claude/hooks/ \\
    --include="*.sh" --include="*.json" 2>/dev/null \\
    | grep -v "$f" | wc -l)
  [ "$refs" -eq 0 ] && echo "DEAD HOOK: $name"
done

# סה"כ hooks רשומים
python3 -c "
import json
s = json.load(open("$HOME/.claude/settings.json"))
hooks = s.get('hooks', {})
total = sum(len(v) for events in hooks.values() for v in events)
print(f'רשומים: {total} hook entries')
"`}
									/>
								</div>
							</div>
						</div>

						{/* Rule 6 */}
						<div className="rounded-lg border border-[oklch(0.75_0.14_200_/_0.4)] bg-[oklch(0.75_0.14_200_/_0.06)] p-4">
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-cyan/20 shrink-0 mt-0.5">
									<span className="text-xs font-bold text-accent-cyan">6</span>
								</div>
								<div>
									<h5 className="text-sm font-semibold text-text-primary mb-1">
										Blocking hooks חייבים להיות מהירים
									</h5>
									<p className="text-xs text-text-secondary leading-relaxed">
										PreToolUse ו-Stop חוסמים את כל Claude Code עד שהם מסיימים.
										Hook שלוקח 3 שניות = Claude נעצר 3 שניות בכל Bash פקודה.
										כלל: Blocking hook חייב לסיים תוך{" "}
										<strong className="text-text-primary">3 שניות</strong>.
										פעולות כבדות (biome format, typecheck) → PostToolUse בלבד
										(async).
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Summary table */}
					<div className="rounded-lg border border-border/50 overflow-hidden">
						<div className="px-4 py-3 bg-bg-elevated/60 border-b border-border/40">
							<h4 className="text-xs font-semibold text-text-muted">
								טבלת סיכום — סוגי אירועים
							</h4>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-xs" dir="rtl">
								<thead>
									<tr className="border-b border-border/40 bg-bg-elevated/30">
										<th className="py-2 ps-4 pe-3 text-start font-semibold text-text-muted">
											אירוע
										</th>
										<th className="py-2 px-3 text-start font-semibold text-text-muted">
											מתי
										</th>
										<th className="py-2 px-3 text-start font-semibold text-text-muted">
											חסימה?
										</th>
										<th className="py-2 px-3 text-start font-semibold text-text-muted">
											Timeout מומלץ
										</th>
										<th className="py-2 ps-3 pe-4 text-start font-semibold text-text-muted">
											שימוש טיפוסי
										</th>
									</tr>
								</thead>
								<tbody>
									{[
										{
											event: "PreToolUse",
											when: "לפני כלי",
											block: true,
											timeout: "3–5s",
											use: "אבטחה, הגנה",
										},
										{
											event: "PostToolUse",
											when: "אחרי כלי",
											block: false,
											timeout: "10–30s",
											use: "format, typecheck, לוגינג",
										},
										{
											event: "Stop",
											when: "לפני עצירה",
											block: true,
											timeout: "3s",
											use: "anti-completion, בדיקת לוגים check",
										},
										{
											event: "PostCompact",
											when: "אחרי /compact",
											block: false,
											timeout: "5s",
											use: "reinject task context",
										},
										{
											event: "UserPromptSubmit",
											when: "שליחת הודעה",
											block: false,
											timeout: "5s",
											use: "capture request, inject context",
										},
										{
											event: "SessionStart",
											when: "תחילת סשן",
											block: false,
											timeout: "10s",
											use: "create task file, load state",
										},
									].map((row, idx) => (
										<tr
											// biome-ignore lint/suspicious/noArrayIndexKey: stable static list
											key={idx}
											className={cn(
												"border-b border-border/30 hover:bg-bg-elevated/30 transition-colors",
												idx % 2 === 0 ? "bg-bg-secondary/20" : "",
											)}
										>
											<td className="py-2.5 ps-4 pe-3">
												<span
													className="font-mono"
													style={{ color: getEventColor(row.event) }}
												>
													{row.event}
												</span>
											</td>
											<td className="py-2.5 px-3 text-text-secondary">
												{row.when}
											</td>
											<td className="py-2.5 px-3">
												{row.block ? (
													<span className="text-accent-red font-semibold">
														כן
													</span>
												) : (
													<span className="text-accent-green">לא</span>
												)}
											</td>
											<td
												className="py-2.5 px-3 font-mono text-text-secondary"
												dir="ltr"
											>
												{row.timeout}
											</td>
											<td className="py-2.5 ps-3 pe-4 text-text-muted">
												{row.use}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</AccordionSection>

			{/* ── Footer note ─────────────────────────────────────────────────── */}
			<div className="glass-card p-4">
				<div className="flex items-start gap-3">
					<Info
						size={14}
						className="text-accent-blue shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<div>
						<p className="text-xs text-text-muted leading-relaxed">
							<span className="text-text-secondary font-medium">
								מיקום hooks:
							</span>{" "}
							<span className="font-mono">~/.claude/hooks/</span> — כל קבצי
							ה-sh/py/js.
							<span className="text-text-secondary font-medium ms-2">
								רישום:
							</span>{" "}
							<span className="font-mono">~/.claude/settings.json</span> בתוך
							block <span className="font-mono">"hooks"</span>.
							<span className="text-text-secondary font-medium ms-2">
								לוגים:
							</span>{" "}
							Claude Code מציג את פלט ה-hook בממשק כשיש block. Async hooks לא
							מוצגים ישירות — בדוק עם{" "}
							<span className="font-mono">tail -f /tmp/hook-debug.log</span>{" "}
							בזמן פיתוח.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
