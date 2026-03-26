import {
	Bell,
	BellOff,
	CheckCircle2,
	Clock,
	Send,
	XCircle,
} from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import {
	useConfigureNotifications,
	useNotificationsConfig,
	useNotificationsLog,
	useSendTestNotification,
} from "@/hooks/use-api";
import type { NotificationEvent, NotificationRules } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Rule metadata ─────────────────────────────────────────────────────────────

interface RuleMeta {
	key: keyof NotificationRules;
	label: string;
	description: string;
}

const RULE_META: RuleMeta[] = [
	{
		key: "task_failed",
		label: "משימות שנכשלו",
		description: "קבל התראה כאשר משימת Hydra נכשלת",
	},
	{
		key: "health_critical",
		label: "בריאות קריטית",
		description: "קבל התראה כאשר בדיקת בריאות קריטית נכשלת",
	},
	{
		key: "ram_high",
		label: "RAM גבוה",
		description: "קבל התראה כאשר שימוש ב-RAM עולה על 90%",
	},
	{
		key: "msi_unreachable",
		label: "MSI לא זמין",
		description: "קבל התראה כאשר מכונת MSI לא מגיבה",
	},
];

// ── Connection status badge ───────────────────────────────────────────────────

function ConnectionStatus({
	tokenSet,
	chatIdSet,
}: {
	tokenSet: boolean;
	chatIdSet: boolean;
}) {
	const connected = tokenSet && chatIdSet;

	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-xl px-4 py-3 border",
				connected
					? "bg-[oklch(0.72_0.19_155_/_0.1)] border-[oklch(0.72_0.19_155_/_0.3)]"
					: "bg-[oklch(0.62_0.22_25_/_0.1)] border-[oklch(0.62_0.22_25_/_0.3)]",
			)}
		>
			{connected ? (
				<CheckCircle2
					size={18}
					className="text-[var(--color-status-healthy)] shrink-0"
					aria-hidden="true"
				/>
			) : (
				<XCircle
					size={18}
					className="text-[var(--color-status-critical)] shrink-0"
					aria-hidden="true"
				/>
			)}
			<div className="min-w-0">
				<p
					className={cn(
						"text-sm font-semibold",
						connected
							? "text-[var(--color-status-healthy)]"
							: "text-[var(--color-status-critical)]",
					)}
				>
					{connected ? "Telegram מחובר" : "Telegram לא מוגדר"}
				</p>
				<p className="text-xs text-[var(--color-text-muted)] mt-0.5">
					{connected
						? "הבוט מוכן לשלוח התראות"
						: `חסר: ${!tokenSet ? "TELEGRAM_BOT_TOKEN" : ""}${!tokenSet && !chatIdSet ? " ו-" : ""}${!chatIdSet ? "TELEGRAM_CHAT_ID" : ""}`}
				</p>
			</div>
		</div>
	);
}

// ── Setup instructions ────────────────────────────────────────────────────────

function SetupInstructions() {
	return (
		<div className="glass-card p-5 flex flex-col gap-4">
			<h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
				<Bell
					size={16}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				הגדרת Telegram Bot
			</h3>

			<ol className="flex flex-col gap-3 text-sm text-[var(--color-text-secondary)]">
				<li className="flex gap-2">
					<span
						className="text-[var(--color-accent-blue)] font-bold shrink-0"
						dir="ltr"
					>
						1.
					</span>
					<span>
						פתח Telegram וחפש{" "}
						<code
							className="bg-[var(--color-bg-elevated)] px-1.5 py-0.5 rounded text-xs"
							dir="ltr"
						>
							@BotFather
						</code>{" "}
						— שלח{" "}
						<code
							className="bg-[var(--color-bg-elevated)] px-1.5 py-0.5 rounded text-xs"
							dir="ltr"
						>
							/newbot
						</code>{" "}
						וקבל token.
					</span>
				</li>
				<li className="flex gap-2">
					<span
						className="text-[var(--color-accent-blue)] font-bold shrink-0"
						dir="ltr"
					>
						2.
					</span>
					<span>
						שלח הודעה לבוט, ואז בדוק את ה-chat_id שלך ב:{" "}
						<code
							className="bg-[var(--color-bg-elevated)] px-1.5 py-0.5 rounded text-xs break-all"
							dir="ltr"
						>
							https://api.telegram.org/bot&lt;TOKEN&gt;/getUpdates
						</code>
					</span>
				</li>
				<li className="flex gap-2">
					<span
						className="text-[var(--color-accent-blue)] font-bold shrink-0"
						dir="ltr"
					>
						3.
					</span>
					<span>
						הוסף למשתני הסביבה לפני הפעלת{" "}
						<code
							className="bg-[var(--color-bg-elevated)] px-1.5 py-0.5 rounded text-xs"
							dir="ltr"
						>
							dashboard.py
						</code>
						:
					</span>
				</li>
			</ol>

			<pre
				className="text-xs bg-[var(--color-bg-elevated)] rounded-lg px-4 py-3 overflow-x-auto"
				dir="ltr"
			>
				<code className="text-[var(--color-text-secondary)]">
					{`export TELEGRAM_BOT_TOKEN="1234567890:ABC-DEF..."
export TELEGRAM_CHAT_ID="123456789"
python3 dashboard.py`}
				</code>
			</pre>
		</div>
	);
}

// ── Rule toggle row ───────────────────────────────────────────────────────────

function RuleToggle({
	rule,
	enabled,
	onToggle,
	disabled,
}: {
	rule: RuleMeta;
	enabled: boolean;
	onToggle: (key: keyof NotificationRules, value: boolean) => void;
	disabled: boolean;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-3">
			<div className="min-w-0">
				<p className="text-sm font-medium text-[var(--color-text-primary)]">
					{rule.label}
				</p>
				<p className="text-xs text-[var(--color-text-muted)] mt-0.5">
					{rule.description}
				</p>
			</div>

			<button
				type="button"
				role="switch"
				aria-checked={enabled}
				aria-label={rule.label}
				disabled={disabled}
				onClick={() => onToggle(rule.key, !enabled)}
				className={cn(
					"relative inline-flex w-11 h-6 shrink-0 items-center rounded-full",
					"transition-colors duration-200 focus-visible:outline-none",
					"focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
					"focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]",
					"disabled:cursor-not-allowed disabled:opacity-50",
					enabled
						? "bg-[var(--color-accent-blue)]"
						: "bg-[var(--color-bg-elevated)]",
				)}
			>
				<span
					className={cn(
						"inline-block h-4 w-4 rounded-full bg-white shadow-sm",
						"transition-transform duration-200",
						enabled ? "translate-x-6" : "translate-x-1",
					)}
					style={{
						transform: enabled ? "translateX(22px)" : "translateX(2px)",
					}}
				/>
			</button>
		</div>
	);
}

// ── Notification log row ──────────────────────────────────────────────────────

function NotificationRow({ event }: { event: NotificationEvent }) {
	const date = event.ts
		? new Date(event.ts).toLocaleString("he-IL", {
				day: "2-digit",
				month: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			})
		: "—";

	return (
		<div className="flex items-start gap-3 py-2.5 border-b border-[var(--color-border)] last:border-0">
			<div className="mt-0.5 shrink-0">
				{event.sent ? (
					<CheckCircle2
						size={14}
						className="text-[var(--color-status-healthy)]"
						aria-hidden="true"
					/>
				) : (
					<XCircle
						size={14}
						className="text-[var(--color-status-critical)]"
						aria-hidden="true"
					/>
				)}
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-xs font-medium text-[var(--color-text-primary)] break-words">
					{event.message}
				</p>
				<div className="flex items-center gap-2 mt-1">
					<span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-1.5 py-0.5 rounded">
						{event.event}
					</span>
					<span
						className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"
						dir="ltr"
					>
						<Clock size={10} aria-hidden="true" />
						{date}
					</span>
				</div>
			</div>
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function NotificationsPage() {
	const { data: config, isLoading: configLoading } = useNotificationsConfig();
	const { data: log } = useNotificationsLog();
	const sendTest = useSendTestNotification();
	const configure = useConfigureNotifications();

	const isConnected = Boolean(config?.token_set && config.chat_id_set);
	const rules = config?.rules;

	function handleRuleToggle(key: keyof NotificationRules, value: boolean) {
		configure.mutate({ [key]: value });
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div className="flex items-center gap-3">
					<Bell
						size={20}
						className="text-[var(--color-accent-blue)]"
						aria-hidden="true"
					/>
					<div>
						<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
							התראות
						</h1>
						<p className="text-sm text-[var(--color-text-muted)]">
							שלח התראות Telegram לנייד
						</p>
					</div>
				</div>

				<ActionButton
					label="שלח הודעת בדיקה"
					icon={Send}
					onClick={() => sendTest.mutate()}
					isPending={sendTest.isPending}
					disabled={!isConnected}
					variant="primary"
				/>
			</div>

			{/* Mutation result banner */}
			{(sendTest.data ?? configure.data) && (
				<div
					className={cn(
						"rounded-lg px-4 py-3 text-sm font-medium",
						(sendTest.data ?? configure.data)?.status === "ok"
							? "bg-[oklch(0.72_0.19_155_/_0.12)] text-[var(--color-status-healthy)] border border-[oklch(0.72_0.19_155_/_0.25)]"
							: "bg-[oklch(0.62_0.22_25_/_0.12)] text-[var(--color-status-critical)] border border-[oklch(0.62_0.22_25_/_0.25)]",
					)}
					role="status"
					aria-live="polite"
				>
					{(sendTest.data ?? configure.data)?.message}
				</div>
			)}

			{/* Connection status */}
			{!configLoading && config && (
				<ConnectionStatus
					tokenSet={config.token_set}
					chatIdSet={config.chat_id_set}
				/>
			)}

			{/* Setup instructions (shown when not configured) */}
			{!configLoading && !isConnected && <SetupInstructions />}

			{/* Notification rules */}
			<div className="glass-card p-5 flex flex-col gap-1">
				<h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
					כללי התראות
				</h2>

				{configLoading && (
					<div className="flex flex-col gap-3 animate-pulse">
						{RULE_META.map((r) => (
							<div
								key={r.key}
								className="flex items-center justify-between py-3"
							>
								<div className="flex flex-col gap-1.5">
									<div className="h-3.5 bg-[var(--color-bg-elevated)] rounded w-32" />
									<div className="h-2.5 bg-[var(--color-bg-elevated)] rounded w-48" />
								</div>
								<div className="w-11 h-6 bg-[var(--color-bg-elevated)] rounded-full" />
							</div>
						))}
					</div>
				)}

				{!configLoading && rules && (
					<div className="divide-y divide-[var(--color-border)]">
						{RULE_META.map((rule) => (
							<RuleToggle
								key={rule.key}
								rule={rule}
								enabled={rules[rule.key] ?? false}
								onToggle={handleRuleToggle}
								disabled={configure.isPending}
							/>
						))}
					</div>
				)}

				{!configLoading && !rules && (
					<div className="flex items-center gap-2 py-6 justify-center">
						<BellOff
							size={20}
							className="text-[var(--color-text-muted)]"
							aria-hidden="true"
						/>
						<p className="text-sm text-[var(--color-text-muted)]">
							לא ניתן לטעון את הגדרות ההתראות
						</p>
					</div>
				)}
			</div>

			{/* Recent notifications log */}
			<div className="glass-card p-5 flex flex-col gap-3">
				<h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
					התראות אחרונות
				</h2>

				{!log || log.length === 0 ? (
					<div className="flex items-center gap-2 py-8 justify-center">
						<Bell
							size={20}
							className="text-[var(--color-text-muted)]"
							aria-hidden="true"
						/>
						<p className="text-sm text-[var(--color-text-muted)]">
							אין התראות עדיין
						</p>
					</div>
				) : (
					<div>
						{log.map((event, idx) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: log entries have no stable id
							<NotificationRow key={idx} event={event} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
