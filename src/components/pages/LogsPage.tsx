import {
	AlertTriangle,
	Archive,
	BookOpen,
	ChevronDown,
	ChevronUp,
	Clock,
	Database,
	FileJson,
	FileText,
	Filter,
	HardDrive,
	Info,
	RefreshCw,
	RotateCcw,
	ScrollText,
	Search,
	Terminal,
	Trash2,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

// ── Accordion ─────────────────────────────────────────────────────────────────

interface AccordionSectionProps {
	id: string;
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	accentColor?: string;
}

function AccordionSection({
	id,
	title,
	subtitle,
	icon,
	children,
	defaultOpen = false,
	accentColor = "var(--color-accent-blue)",
}: AccordionSectionProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div
			className={cn(
				"glass-card overflow-hidden transition-colors duration-200",
				open && "border-[var(--color-border-hover)]",
			)}
			id={id}
		>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				className={cn(
					"w-full flex items-center gap-3 px-4 py-4",
					"transition-colors duration-150 cursor-pointer",
					"hover:bg-[var(--color-bg-tertiary)]",
					"min-h-[60px] text-start",
				)}
				aria-expanded={open}
			>
				<span
					className="flex size-9 shrink-0 items-center justify-center rounded-lg"
					style={{
						background: `oklch(from ${accentColor} l c h / 0.15)`,
						color: accentColor,
					}}
					aria-hidden="true"
				>
					{icon}
				</span>
				<div className="flex-1 min-w-0">
					<div className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
						{title}
					</div>
					<div className="text-xs text-[var(--color-text-muted)] truncate">
						{subtitle}
					</div>
				</div>
				<span className="shrink-0 text-[var(--color-text-muted)]">
					{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</span>
			</button>

			{open && (
				<div className="border-t border-[var(--color-border)] px-4 py-5">
					{children}
				</div>
			)}
		</div>
	);
}

// ── Code Block ───────────────────────────────────────────────────────────────

function CodeBlock({ children }: { children: string }) {
	return (
		<pre
			className={cn(
				"rounded-lg px-4 py-3 text-xs font-mono overflow-x-auto",
				"bg-[var(--color-bg-primary)] text-[var(--color-accent-cyan)]",
				"border border-[var(--color-border)]",
				"leading-relaxed",
			)}
			dir="ltr"
		>
			{children}
		</pre>
	);
}

// ── Badge ────────────────────────────────────────────────────────────────────

function Badge({
	label,
	color = "var(--color-accent-blue)",
}: {
	label: string;
	color?: string;
}) {
	return (
		<span
			className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
			style={{
				background: `oklch(from ${color} l c h / 0.12)`,
				color,
				border: `1px solid oklch(from ${color} l c h / 0.3)`,
			}}
		>
			{label}
		</span>
	);
}

// ── Alert Box ────────────────────────────────────────────────────────────────

function AlertBox({
	type,
	children,
}: {
	type: "warning" | "info" | "error";
	children: React.ReactNode;
}) {
	const config = {
		warning: {
			color: "var(--color-accent-amber)",
			icon: <AlertTriangle size={14} />,
		},
		info: {
			color: "var(--color-accent-blue)",
			icon: <Info size={14} />,
		},
		error: {
			color: "var(--color-accent-red)",
			icon: <AlertTriangle size={14} />,
		},
	}[type];

	return (
		<div
			className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs"
			style={{
				background: `oklch(from ${config.color} l c h / 0.1)`,
				border: `1px solid oklch(from ${config.color} l c h / 0.25)`,
				color: config.color,
			}}
		>
			<span className="shrink-0 mt-0.5">{config.icon}</span>
			<span className="leading-relaxed">{children}</span>
		</div>
	);
}

// ── Log File Card ────────────────────────────────────────────────────────────

interface LogFileCardProps {
	name: string;
	path: string;
	purpose: string;
	rotation: string;
	rotationColor: "green" | "amber" | "blue";
	size?: string;
	format: string;
	accentColor: string;
	icon: React.ReactNode;
	notes?: string[];
}

function LogFileCard({
	name,
	path,
	purpose,
	rotation,
	rotationColor,
	size,
	format,
	accentColor,
	icon,
	notes,
}: LogFileCardProps) {
	const rotationColors = {
		green: "var(--color-accent-green)",
		amber: "var(--color-accent-amber)",
		blue: "var(--color-accent-blue)",
	};

	return (
		<div className="glass-card p-4 flex flex-col gap-3 hover:border-[var(--color-border-hover)] transition-colors duration-200">
			{/* Header */}
			<div className="flex items-start gap-3">
				<div
					className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
					style={{
						background: `oklch(from ${accentColor} l c h / 0.15)`,
					}}
				>
					<span style={{ color: accentColor }} aria-hidden="true">
						{icon}
					</span>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span
							className="text-sm font-bold font-mono"
							style={{ color: accentColor }}
						>
							{name}
						</span>
						<Badge label={format} color={accentColor} />
					</div>
					<div
						className="text-xs font-mono mt-0.5 truncate"
						style={{ color: "var(--color-text-muted)" }}
						dir="ltr"
					>
						{path}
					</div>
				</div>
			</div>

			{/* Purpose */}
			<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
				{purpose}
			</p>

			{/* Meta */}
			<div className="flex flex-wrap gap-2 items-center">
				<div
					className="flex items-center gap-1.5 text-xs"
					style={{ color: rotationColors[rotationColor] }}
				>
					<RotateCcw size={11} aria-hidden="true" />
					<span>{rotation}</span>
				</div>
				{size && (
					<div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
						<HardDrive size={11} aria-hidden="true" />
						<span dir="ltr">{size}</span>
					</div>
				)}
			</div>

			{/* Notes */}
			{notes && notes.length > 0 && (
				<ul className="space-y-1">
					{notes.map((note) => (
						<li
							key={note}
							className="text-xs text-[var(--color-text-muted)] flex items-start gap-1.5"
						>
							<span
								className="text-[var(--color-accent-blue)] mt-0.5 shrink-0"
								aria-hidden="true"
							>
								›
							</span>
							{note}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

// ── Log Files Data ───────────────────────────────────────────────────────────

const LOG_FILES: LogFileCardProps[] = [
	{
		name: "hydra-structured.jsonl",
		path: "~/.config/agents/logs/hydra-structured.jsonl",
		purpose:
			"הלוג הראשי של מערכת Hydra — מכיל כל אירועי גרף LangGraph, החלטות ניתוב Bayesian, תוצאות ביצוע ושגיאות. כל שורה היא JSON תקני עם שדות ts, level, module, message.",
		rotation: "RotatingFileHandler — 10MB × 7 גיבויים (70MB מקסימום)",
		rotationColor: "green",
		size: "עד 70MB",
		format: "JSONL",
		accentColor: "var(--color-accent-blue)",
		icon: <FileJson size={18} />,
		notes: [
			"מכיל שדות: ts, level, module, message, task_id (אופציונלי), provider (אופציונלי), exc_info (אופציונלי)",
			"הלוג המשני בו להשתמש לניפוי שגיאות — מספק הקשר מפורט לאחר hydra-watcher",
		],
	},
	{
		name: "hydra-watcher.jsonl",
		path: "~/.config/agents/logs/hydra-watcher.jsonl",
		purpose:
			"יומן אירועי Watcher — מתעד כל מחזור חיי תכנית: pending→in-progress→done/failed. נכתב על-ידי הפונקציה _log() ב-hydra_watcher.py. ללא רוטציה אוטומטית — גדל ללא הגבלה.",
		rotation: "ללא רוטציה — דורש סיבוב ידני כשמעל 50MB",
		rotationColor: "amber",
		size: "גדל ללא הגבלה",
		format: "JSONL",
		accentColor: "var(--color-accent-amber)",
		icon: <FileText size={18} />,
		notes: [
			"לוג הציר הראשי — התחל כאן בניפוי שגיאות",
			"סיבוב ידני: mv hydra-watcher.jsonl hydra-watcher.jsonl.$(date +%Y%m%d) && touch hydra-watcher.jsonl",
			"מעקב גודל: du -sh ~/.config/agents/logs/hydra-watcher.jsonl",
		],
	},
	{
		name: "beads.jsonl",
		path: "~/.claude/knowledge/beads.jsonl",
		purpose:
			"לכידת ידע מכל PostToolUse — מתעד את סוג הסוכן, המודל, הכלי שהשתמש בו ותקציר התוצאה. בסיס הנתונים הגולמי של זיכרון LanceDB. מכיל JSON עם timestamp, session_id, ושדה data.",
		rotation: "סיבוב ידני — מומלץ כשמעל 500 שורות",
		rotationColor: "blue",
		size: "אין הגבלה רשמית",
		format: "JSONL",
		accentColor: "var(--color-accent-cyan)",
		icon: <Database size={18} />,
		notes: [
			"נקרא על-ידי migrate_beads.py לייבוא ל-LanceDB אחרי מחיקת lancedb_memory",
			"כתיבה בטוחה: tr '\\n' ' ' לפני כתיבה למניעת שחיתות",
			"ניתוח: python3 -c \"import json; [print(json.loads(l)['data'][:100]) for l in open('beads.jsonl')]\"",
		],
	},
	{
		name: "corrections.jsonl",
		path: "~/.claude/knowledge/corrections.jsonl",
		purpose:
			"תיקוני משתמש שזוהו על-ידי correction-detector.sh — מתעד מתי Claude טעה ומה התיקון הנכון. מזין את מערכת הלמידה האוטומטית ומשמש לעדכון auto-learned-rules.md.",
		rotation: "סיבוב ידני — Rotate כשמעל 500 שורות",
		rotationColor: "amber",
		size: "אין הגבלה רשמית",
		format: "JSONL",
		accentColor: "var(--color-accent-purple)",
		icon: <RefreshCw size={18} />,
		notes: [
			"כל שורה: { timestamp, session_id, correction_type, original, corrected }",
			"מעובד על-ידי claude-md-auto-update.sh לכלל auto-learned חדש",
		],
	},
	{
		name: "audit-patterns.jsonl",
		path: "~/.claude/knowledge/audit-patterns.jsonl",
		purpose:
			"תבניות Dispatch שנרשמו על-ידי dispatch-auto-log.sh — מתעד כל dispatch: מה נשלח, לאיזה ספק, מה היה הזמן, מה התוצאה. משמש לאנליזה של הצלחות/כישלונות.",
		rotation: "סיבוב ידני — מומלץ כשמעל 500 שורות",
		rotationColor: "blue",
		size: "אין הגבלה רשמית",
		format: "JSONL",
		accentColor: "var(--color-accent-green)",
		icon: <Zap size={18} />,
		notes: [
			"שדות: timestamp, provider, task_type, duration_s, status, task_id",
			'ניתוח הצלחה: grep \'"status": "success"\' audit-patterns.jsonl | wc -l',
		],
	},
	{
		name: "completions.jsonl",
		path: "~/.claude/knowledge/completions.jsonl",
		purpose:
			"השלמות משימה — מתעד כל משימה שהסתיימה בהצלחה: מה הושג, מה הזמן שנדרש, באיזה כלים הושתמש. בסיס לסטטיסטיקות ביצועים ל-Metrics.",
		rotation: "סיבוב ידני — Rotate כשמעל 500 שורות",
		rotationColor: "blue",
		size: "אין הגבלה רשמית",
		format: "JSONL",
		accentColor: "var(--color-accent-amber)",
		icon: <Archive size={18} />,
		notes: [
			"שדות: timestamp, task_id, duration_s, tools_used[], outcome_summary",
			"אזהרה: completions.jsonl.bak יכול לחרוג מ-500KB — הוסף ל-.gitignore",
		],
	},
];

// ── Rotation Table Data ──────────────────────────────────────────────────────

interface RotationRow {
	file: string;
	maxSize: string;
	policy: string;
	command: string;
	priority: "high" | "medium" | "low";
}

const ROTATION_ROWS: RotationRow[] = [
	{
		file: "hydra-watcher.jsonl",
		maxSize: "50MB",
		policy: "ידני",
		command:
			"mv hydra-watcher.jsonl hydra-watcher.jsonl.$(date +%Y%m%d) && touch hydra-watcher.jsonl",
		priority: "high",
	},
	{
		file: "hydra-structured.jsonl",
		maxSize: "10MB × 7",
		policy: "אוטומטי (RotatingFileHandler)",
		command: "אוטומטי — לא נדרש פעולה",
		priority: "low",
	},
	{
		file: "beads.jsonl",
		maxSize: "500 שורות",
		policy: "ידני",
		command:
			"tail -n 500 beads.jsonl > /tmp/beads.tmp && mv /tmp/beads.tmp beads.jsonl",
		priority: "medium",
	},
	{
		file: "corrections.jsonl",
		maxSize: "500 שורות",
		policy: "ידני",
		command:
			"tail -n 500 corrections.jsonl > /tmp/corr.tmp && mv /tmp/corr.tmp corrections.jsonl",
		priority: "medium",
	},
	{
		file: "audit-patterns.jsonl",
		maxSize: "500 שורות",
		policy: "ידני",
		command:
			"tail -n 500 audit-patterns.jsonl > /tmp/audit.tmp && mv /tmp/audit.tmp audit-patterns.jsonl",
		priority: "medium",
	},
	{
		file: "completions.jsonl",
		maxSize: "500 שורות",
		policy: "ידני",
		command:
			"tail -n 500 completions.jsonl > /tmp/comp.tmp && mv /tmp/comp.tmp completions.jsonl",
		priority: "low",
	},
];

const PRIORITY_COLOR = {
	high: "var(--color-accent-red)",
	medium: "var(--color-accent-amber)",
	low: "var(--color-accent-green)",
} as const;

const PRIORITY_LABEL = {
	high: "דחוף",
	medium: "בינוני",
	low: "נמוך",
} as const;

// ── Troubleshooting Data ─────────────────────────────────────────────────────

interface TroubleshootItem {
	problem: string;
	symptom: string;
	solution: string;
	command?: string;
	severity: "error" | "warning" | "info";
}

const TROUBLESHOOT_ITEMS: TroubleshootItem[] = [
	{
		problem: "hydra-watcher.jsonl גדל ללא הגבלה",
		symptom:
			"קובץ חורג מ-50MB — בדוק: du -sh ~/.config/agents/logs/hydra-watcher.jsonl",
		solution: "סיבוב ידני — הזז לגיבוי עם תאריך ויצור קובץ חדש ריק",
		command:
			"mv ~/.config/agents/logs/hydra-watcher.jsonl ~/.config/agents/logs/hydra-watcher.jsonl.$(date +%Y%m%d) && touch ~/.config/agents/logs/hydra-watcher.jsonl && systemctl --user restart hydra-watcher",
		severity: "warning",
	},
	{
		problem: "beads.jsonl שחות / JSON לא תקין",
		symptom:
			"json.JSONDecodeError בעת קריאת beads.jsonl — שורות עם newlines לא מוברחים",
		solution:
			"JSONL חייב להיכתב עם tr '\\n' ' ' לפני הוספה לקובץ. נקה שורות פגומות עם jq:",
		command:
			"python3 -c \"import json; lines=[l for l in open('beads.jsonl') if json.loads(l)]; open('beads.jsonl','w').writelines(lines)\" 2>/dev/null || echo 'יש שורות פגומות'",
		severity: "error",
	},
	{
		problem: "תהליכי MCP עזובים אוכלים RAM",
		symptom:
			"ps aux | grep node | grep -v grep | wc -l מחזיר 20-60+ תהליכים — 4-5GB RAM לבזבוז",
		solution: "הרג תהליכי node orphan של MCP servers ושחרר RAM",
		command:
			"pkill -f 'node.*mcp' || true; pkill -f 'node.*apex' || true; pkill -f 'node.*context7' || true; pkill -f 'node.*github' || true; echo 'RAM freed'",
		severity: "error",
	},
	{
		problem: "hydra-structured.jsonl ריק / לא נכתב",
		symptom: "קובץ קיים אבל ריק — hydra_logger.py לא מאותחל",
		solution:
			"hydra_logger.py משתמש ב-singleton — ייבוא חוזר לא יוצר handler כפול. בדוק שהמודול נטען:",
		command:
			"python3 -c \"from hydra_logger import logger; logger.info('test'); print('OK')\" 2>&1",
		severity: "warning",
	},
	{
		problem: "completions.jsonl.bak חוסם pre-commit",
		symptom:
			"pre-commit hook חוסם commit עם שגיאת large file (>500KB) על completions.jsonl.bak",
		solution: "הוסף ל-.gitignore — קבצי .bak הם גיבויים זמניים, לא לגיט:",
		command:
			"echo 'knowledge/*.bak' >> .gitignore && echo 'knowledge/completions.jsonl.bak' >> .gitignore",
		severity: "info",
	},
	{
		problem: "LanceDB directory שחות",
		symptom:
			"health_check.py check_memory() מחזיר ok=False — ייתכן פגמה ב-lancedb_memory/",
		solution:
			"מחק את ספריית LanceDB — CognitiveMemory.__init__() תיצור מחדש. זיכרונות יאבדו — ייבא מחדש מ-beads.jsonl:",
		command:
			"rm -rf ~/.claude/knowledge/lancedb_memory/ && python3 -c \"from cognitive_memory import CognitiveMemory; m=CognitiveMemory(); print('rebuilt OK')\"",
		severity: "error",
	},
];

// ── Query Examples Data ──────────────────────────────────────────────────────

interface QueryExample {
	title: string;
	description: string;
	code: string;
	icon: React.ReactNode;
	color: string;
}

const QUERY_EXAMPLES: QueryExample[] = [
	{
		title: "משימות שנכשלו בשעה האחרונה",
		description: "חיפוש מהיר בלוג ה-Watcher לכל failures",
		code: `grep '"failed"' ~/.config/agents/logs/hydra-watcher.jsonl | tail -20`,
		icon: <AlertTriangle size={14} />,
		color: "var(--color-accent-red)",
	},
	{
		title: "אירועים לפי task_id ספציפי",
		description: "מעקב אחרי מסלול של משימה בודדת",
		code: `grep '"task_id": "my-task"' ~/.config/agents/logs/hydra-watcher.jsonl`,
		icon: <Filter size={14} />,
		color: "var(--color-accent-blue)",
	},
	{
		title: "מעקב בזמן אמת (Live)",
		description: "צפייה בלוג פעיל עם pretty-print JSON",
		code: `tail -f ~/.config/agents/logs/hydra-watcher.jsonl | python3 -m json.tool`,
		icon: <Clock size={14} />,
		color: "var(--color-accent-green)",
	},
	{
		title: "הצגת שדה message בלבד",
		description: "חיפוש ב-structured log עם jq — קריאה מהירה",
		code: `cat ~/.config/agents/logs/hydra-structured.jsonl | jq -r '.message' | tail -50`,
		icon: <Search size={14} />,
		color: "var(--color-accent-cyan)",
	},
	{
		title: "ספירת providers שנכשלו",
		description: "סטטיסטיקת כישלונות לפי ספק",
		code: `grep '"status": "failed"' ~/.config/agents/logs/hydra-watcher.jsonl \\
  | python3 -c "import json,sys,collections; \\
    data=[json.loads(l) for l in sys.stdin]; \\
    c=collections.Counter(d.get('provider','unknown') for d in data); \\
    [print(f'{k}: {v}') for k,v in c.most_common()]"`,
		icon: <BarChart3Icon size={14} />,
		color: "var(--color-accent-purple)",
	},
	{
		title: "בדיקת גודל כל הלוגים",
		description: "סקירה מהירה של גודל כל קבצי הלוג",
		code: `du -sh ~/.config/agents/logs/hydra-*.jsonl ~/.claude/knowledge/*.jsonl 2>/dev/null | sort -h`,
		icon: <HardDrive size={14} />,
		color: "var(--color-accent-amber)",
	},
];

// Inline minimal icon for bar chart (not in lucide by default)
function BarChart3Icon({ size = 14 }: { size?: number }) {
	return <Filter size={size} />;
}

// ── Beads Data ───────────────────────────────────────────────────────────────

const BEADS_FIELDS = [
	{
		field: "timestamp",
		type: "ISO 8601 string",
		example: "2026-03-26T14:32:11Z",
		color: "var(--color-accent-cyan)",
	},
	{
		field: "session_id",
		type: "string (uuid)",
		example: "sess-abc123def456",
		color: "var(--color-accent-blue)",
	},
	{
		field: "agent_type",
		type: "string",
		example: "codex | kimi | gemini | minimax",
		color: "var(--color-accent-purple)",
	},
	{
		field: "model",
		type: "string",
		example: "gpt-5.4 | gemini-3.1-pro-preview",
		color: "var(--color-accent-green)",
	},
	{
		field: "tool_used",
		type: "string",
		example: "Write | Edit | Bash | Read",
		color: "var(--color-accent-amber)",
	},
	{
		field: "data",
		type: "string (תקציר התוצאה)",
		example: "Created auth.ts with JWT validation...",
		color: "var(--color-text-primary)",
	},
];

// ── Main Page Component ──────────────────────────────────────────────────────

export function LogsPage() {
	return (
		<div className="space-y-8 pb-10 min-h-screen bg-zinc-950 p-6" dir="rtl">
			{/* ── Page Header ── */}
			<div className="flex items-center gap-4">
				<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-blue/10 shrink-0">
					<ScrollText
						size={24}
						className="text-accent-blue"
						aria-hidden="true"
					/>
				</div>
				<div>
					<h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
						לוגים ופעילות
					</h1>
					<p className="text-sm text-[var(--color-text-muted)] mt-0.5">
						כל קבצי הלוג, כיצד לחפש, ופתרון בעיות
					</p>
				</div>
			</div>

			{/* ── Stats Strip ── */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{[
					{
						label: "קבצי לוג",
						value: "6",
						color: "var(--color-accent-blue)",
						icon: <FileJson size={16} />,
					},
					{
						label: "רוטציה אוטומטית",
						value: "1",
						color: "var(--color-accent-green)",
						icon: <RefreshCw size={16} />,
					},
					{
						label: "רוטציה ידנית",
						value: "5",
						color: "var(--color-accent-amber)",
						icon: <RotateCcw size={16} />,
					},
					{
						label: "תקן כתיבה",
						value: "JSONL",
						color: "var(--color-accent-cyan)",
						icon: <FileText size={16} />,
					},
				].map(({ label, value, color, icon }) => (
					<div key={label} className="glass-card p-3 flex items-center gap-3">
						<div
							className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
							style={{ background: `oklch(from ${color} l c h / 0.15)` }}
						>
							<span style={{ color }} aria-hidden="true">
								{icon}
							</span>
						</div>
						<div className="min-w-0">
							<div className="text-lg font-bold tabular-nums text-[var(--color-text-primary)]">
								{value}
							</div>
							<div className="text-xs text-[var(--color-text-muted)] truncate">
								{label}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* ── Section 1: Log Files ── */}
			<AccordionSection
				id="log-files"
				title="קבצי לוג"
				subtitle="6 קבצים — מבנה, מיקום, ומדיניות סיבוב"
				icon={<FileJson size={18} />}
				defaultOpen
				accentColor="var(--color-accent-blue)"
			>
				<div className="space-y-4">
					<AlertBox type="info">
						כל קבצי הלוג נכתבים בתקן JSONL — כל שורה היא JSON עצמאי ותקני. תמיד
						בדוק שורות בנפרד עם jq אחד לשורה, לא את כל הקובץ כ-array.
					</AlertBox>

					<div className="grid gap-4 sm:grid-cols-2">
						{LOG_FILES.map((file) => (
							<LogFileCard key={file.name} {...file} />
						))}
					</div>
				</div>
			</AccordionSection>

			{/* ── Section 2: Query Examples ── */}
			<AccordionSection
				id="search-logs"
				title="איך לחפש בלוגים"
				subtitle="דוגמאות grep, jq, ו-Python לניתוח לוגים"
				icon={<Search size={18} />}
				defaultOpen
				accentColor="var(--color-accent-cyan)"
			>
				<div className="space-y-5">
					<AlertBox type="info">
						הלוגים הם JSONL — כל שורה JSON עצמאי. השתמש ב-grep לחיפוש מהיר, jq
						לפענוח מובנה, ו-python3 לאנליזה מורכבת.
					</AlertBox>

					<div className="grid gap-4">
						{QUERY_EXAMPLES.map((example) => (
							<div key={example.title} className="glass-card p-4 space-y-2">
								<div className="flex items-center gap-2">
									<span style={{ color: example.color }} aria-hidden="true">
										{example.icon}
									</span>
									<span
										className="text-sm font-semibold"
										style={{ color: example.color }}
									>
										{example.title}
									</span>
								</div>
								<p className="text-xs text-[var(--color-text-muted)]">
									{example.description}
								</p>
								<CodeBlock>{example.code}</CodeBlock>
							</div>
						))}
					</div>

					{/* Live Monitor Pattern */}
					<div className="glass-card p-4 space-y-3">
						<div className="flex items-center gap-2">
							<Terminal
								size={14}
								className="text-accent-green"
								aria-hidden="true"
							/>
							<span className="text-sm font-semibold text-[var(--color-accent-green)]">
								מעקב לוג מלא — Live Dashboard בטרמינל
							</span>
						</div>
						<p className="text-xs text-[var(--color-text-muted)]">
							הפעל שני טרמינלים: אחד עם tail -f לכל לוג, שני עם watch לגדלים
						</p>
						<CodeBlock>{`# טרמינל 1 — אירועי Watcher בזמן אמת
tail -f ~/.config/agents/logs/hydra-watcher.jsonl \\
  | python3 -c "
import sys, json
for line in sys.stdin:
    try:
        d = json.loads(line)
        print(f'[{d.get("ts","?")[:19]}] {d.get("event","?")} task={d.get("task_id","-")}')
    except: pass
"

# טרמינל 2 — גדלי קבצים כל 5 שניות
watch -n 5 'du -sh ~/.config/agents/logs/hydra-*.jsonl ~/.claude/knowledge/*.jsonl 2>/dev/null | sort -h'`}</CodeBlock>
					</div>
				</div>
			</AccordionSection>

			{/* ── Section 3: Beads Knowledge Capture ── */}
			<AccordionSection
				id="beads-knowledge"
				title="Beads — Knowledge Capture"
				subtitle="מה נלכד, מבנה הנתונים, וכיצד לנתח"
				icon={<Database size={18} />}
				defaultOpen
				accentColor="var(--color-accent-purple)"
			>
				<div className="space-y-5">
					<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
						<strong className="text-[var(--color-text-primary)]">
							beads.jsonl
						</strong>{" "}
						הוא מאגר הידע הגולמי של APEX — כל PostToolUse hook מוסיף רשומה.
						הנתונים מועברים ל-LanceDB לחיפוש סמנטי, ומשמשים לשיפור עתידי של קבלת
						החלטות.
					</p>

					{/* What gets captured */}
					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
							<BookOpen
								size={14}
								className="text-accent-purple"
								aria-hidden="true"
							/>
							מה נלכד בכל פעולה
						</h3>
						<div className="grid gap-3 sm:grid-cols-2">
							{[
								{
									label: "סוג סוכן",
									desc: "codex / kimi / gemini / minimax / claude",
									icon: <Zap size={12} />,
									color: "var(--color-accent-amber)",
								},
								{
									label: "מודל שהופעל",
									desc: "gpt-5.4, gemini-3.1-pro-preview, MiniMax-M2.7",
									icon: <Terminal size={12} />,
									color: "var(--color-accent-cyan)",
								},
								{
									label: "כלי שהשתמש",
									desc: "Write, Edit, Bash, Read, TodoWrite, WebFetch",
									icon: <FileText size={12} />,
									color: "var(--color-accent-blue)",
								},
								{
									label: "תקציר תוצאה",
									desc: "100+ תוים ראשונים של תוצאת הפעולה",
									icon: <Archive size={12} />,
									color: "var(--color-accent-green)",
								},
							].map(({ label, desc, icon, color }) => (
								<div
									key={label}
									className="flex items-start gap-2.5 p-3 rounded-lg"
									style={{ background: `oklch(from ${color} l c h / 0.06)` }}
								>
									<span
										style={{ color }}
										className="mt-0.5 shrink-0"
										aria-hidden="true"
									>
										{icon}
									</span>
									<div>
										<div className="text-xs font-semibold" style={{ color }}>
											{label}
										</div>
										<div className="text-xs text-[var(--color-text-muted)] mt-0.5">
											{desc}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Format / Schema */}
					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
							<FileJson
								size={14}
								className="text-accent-purple"
								aria-hidden="true"
							/>
							מבנה שדות — Schema
						</h3>
						<div className="glass-card overflow-hidden">
							<table className="w-full text-xs">
								<thead>
									<tr className="border-b border-[var(--color-border)]">
										<th className="px-3 py-2.5 text-start font-semibold text-[var(--color-text-muted)]">
											שדה
										</th>
										<th className="px-3 py-2.5 text-start font-semibold text-[var(--color-text-muted)]">
											סוג
										</th>
										<th className="px-3 py-2.5 text-start font-semibold text-[var(--color-text-muted)] hidden sm:table-cell">
											דוגמה
										</th>
									</tr>
								</thead>
								<tbody>
									{BEADS_FIELDS.map(({ field, type, example, color }) => (
										<tr
											key={field}
											className="border-b border-[var(--color-border)] last:border-0"
										>
											<td
												className="px-3 py-2 font-mono font-semibold"
												style={{ color }}
											>
												{field}
											</td>
											<td className="px-3 py-2 text-[var(--color-text-muted)]">
												{type}
											</td>
											<td
												className="px-3 py-2 font-mono text-[var(--color-text-muted)] hidden sm:table-cell truncate max-w-[200px]"
												dir="ltr"
											>
												{example}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Parse example */}
					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
							ניתוח beads.jsonl
						</h3>
						<CodeBlock>{`# קריאת תקציר כל רשומה (100 תווים ראשונים)
python3 -c "
import json
for line in open('~/.claude/knowledge/beads.jsonl'):
    try:
        d = json.loads(line)
        print(d.get('data', '')[:100])
    except json.JSONDecodeError:
        pass  # שורה פגומה — דלג
"

# סטטיסטיקה לפי סוג סוכן
python3 -c "
import json, collections
data = [json.loads(l) for l in open('~/.claude/knowledge/beads.jsonl') if l.strip()]
counter = collections.Counter(d.get('agent_type','unknown') for d in data)
for k, v in counter.most_common(): print(f'{k}: {v}')
"

# ייבוא ל-LanceDB אחרי שחזור
python3 ~/.claude/scripts/hydra-v2/migrate_beads.py`}</CodeBlock>
					</div>

					{/* Size management */}
					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
							ניהול גודל
						</h3>
						<div className="space-y-2">
							<AlertBox type="warning">
								סיבוב beads.jsonl מעל 500 שורות — שמור את ה-500 האחרונות. לפני
								הסיבוב, בצע ייבוא ל-LanceDB כדי לא לאבד זיכרון.
							</AlertBox>
							<CodeBlock>{`# בדוק מספר שורות
wc -l ~/.claude/knowledge/beads.jsonl

# סיבוב — שמור 500 אחרונות
tail -n 500 ~/.claude/knowledge/beads.jsonl > /tmp/beads.tmp
mv /tmp/beads.tmp ~/.claude/knowledge/beads.jsonl

# JSONL בטוח — כתיבה נכונה (עם tr)
echo '{"timestamp":"...","data":"..."}' | tr '\\n' ' ' >> beads.jsonl`}</CodeBlock>
						</div>
					</div>
				</div>
			</AccordionSection>

			{/* ── Section 4: Rotation Table ── */}
			<AccordionSection
				id="log-rotation"
				title="Log Rotation — מדיניות סיבוב"
				subtitle="טבלה מלאה: גודל מקסימלי, מדיניות, ופקודות ניקוי"
				icon={<RotateCcw size={18} />}
				defaultOpen
				accentColor="var(--color-accent-green)"
			>
				<div className="space-y-4">
					<div className="glass-card overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-xs">
								<thead>
									<tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-tertiary)]">
										<th className="px-3 py-2.5 text-start font-semibold text-[var(--color-text-muted)]">
											קובץ
										</th>
										<th className="px-3 py-2.5 text-start font-semibold text-[var(--color-text-muted)] hidden sm:table-cell">
											גודל מקס׳
										</th>
										<th className="px-3 py-2.5 text-start font-semibold text-[var(--color-text-muted)]">
											מדיניות
										</th>
										<th className="px-3 py-2.5 text-start font-semibold text-[var(--color-text-muted)]">
											עדיפות
										</th>
									</tr>
								</thead>
								<tbody>
									{ROTATION_ROWS.map((row) => (
										<tr
											key={row.file}
											className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors"
										>
											<td className="px-3 py-2.5 font-mono text-[var(--color-accent-cyan)]">
												{row.file}
											</td>
											<td
												className="px-3 py-2.5 text-[var(--color-text-secondary)] hidden sm:table-cell"
												dir="ltr"
											>
												{row.maxSize}
											</td>
											<td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
												{row.policy}
											</td>
											<td className="px-3 py-2.5">
												<Badge
													label={PRIORITY_LABEL[row.priority]}
													color={PRIORITY_COLOR[row.priority]}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Commands per file */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
							פקודות סיבוב לפי קובץ
						</h3>
						{ROTATION_ROWS.filter(
							(r) =>
								r.priority !== "low" || r.file === "hydra-structured.jsonl",
						).map((row) => (
							<div key={row.file} className="space-y-1">
								<div className="flex items-center gap-2">
									<Badge
										label={
											row.priority === "high"
												? "דחוף"
												: row.priority === "medium"
													? "בינוני"
													: "אוטומטי"
										}
										color={PRIORITY_COLOR[row.priority]}
									/>
									<span className="text-xs font-mono text-[var(--color-accent-cyan)]">
										{row.file}
									</span>
								</div>
								<CodeBlock>{row.command}</CodeBlock>
							</div>
						))}
					</div>

					<AlertBox type="info">
						logrotate לניהול אוטומטי — הוסף ל-/etc/logrotate.d/hydra-watcher כדי
						לסובב אוטומטית כשמגיע ל-50MB. בלעדי זה, הסיבוב נדרש ידנית.
					</AlertBox>
					<CodeBlock>{`# /etc/logrotate.d/hydra-watcher
/home/nadavcohen/.config/agents/logs/hydra-watcher.jsonl {
    size 50M
    rotate 5
    compress
    missingok
    notifempty
    postrotate
        systemctl --user restart hydra-watcher 2>/dev/null || true
    endscript
}`}</CodeBlock>
				</div>
			</AccordionSection>

			{/* ── Section 5: Troubleshooting ── */}
			<AccordionSection
				id="troubleshooting"
				title="פתרון בעיות"
				subtitle="בעיות נפוצות ופתרונות מוכחים"
				icon={<AlertTriangle size={18} />}
				defaultOpen
				accentColor="var(--color-accent-red)"
			>
				<div className="space-y-4">
					{TROUBLESHOOT_ITEMS.map((item) => (
						<div key={item.problem} className="glass-card p-4 space-y-3">
							{/* Problem header */}
							<div className="flex items-start gap-3">
								<div
									className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
									style={{
										background:
											item.severity === "error"
												? "oklch(from var(--color-accent-red) l c h / 0.15)"
												: item.severity === "warning"
													? "oklch(from var(--color-accent-amber) l c h / 0.15)"
													: "oklch(from var(--color-accent-blue) l c h / 0.15)",
									}}
								>
									<span
										style={{
											color:
												item.severity === "error"
													? "var(--color-accent-red)"
													: item.severity === "warning"
														? "var(--color-accent-amber)"
														: "var(--color-accent-blue)",
										}}
										aria-hidden="true"
									>
										{item.severity === "error" ? (
											<Trash2 size={14} />
										) : item.severity === "warning" ? (
											<AlertTriangle size={14} />
										) : (
											<Info size={14} />
										)}
									</span>
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-semibold text-[var(--color-text-primary)]">
										{item.problem}
									</div>
									<div className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
										{item.symptom}
									</div>
								</div>
								<Badge
									label={
										item.severity === "error"
											? "שגיאה"
											: item.severity === "warning"
												? "אזהרה"
												: "מידע"
									}
									color={
										item.severity === "error"
											? "var(--color-accent-red)"
											: item.severity === "warning"
												? "var(--color-accent-amber)"
												: "var(--color-accent-blue)"
									}
								/>
							</div>

							{/* Solution */}
							<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed ps-11">
								{item.solution}
							</p>

							{/* Command */}
							{item.command && (
								<div className="ps-11">
									<CodeBlock>{item.command}</CodeBlock>
								</div>
							)}
						</div>
					))}

					{/* Quick reference */}
					<div className="glass-card p-4 space-y-3">
						<div className="flex items-center gap-2">
							<BookOpen
								size={14}
								className="text-accent-blue"
								aria-hidden="true"
							/>
							<span className="text-sm font-semibold text-[var(--color-text-primary)]">
								רשימת בדיקה מהירה — Checklist לניפוי שגיאות
							</span>
						</div>
						<div className="space-y-1.5">
							{[
								"1. בדוק גודל hydra-watcher.jsonl — אם >50MB, סובב ידנית",
								"2. הפעל health_check.py — בדוק SQLite ו-LanceDB",
								"3. ספור תהליכי node: ps aux | grep node | grep -v grep | wc -l",
								"4. בדוק שורות אחרונות בלוג: tail -20 hydra-watcher.jsonl",
								"5. בדוק גודל כל הלוגים: du -sh ~/.config/agents/logs/*.jsonl",
								"6. אם LanceDB פגום: מחק lancedb_memory/ והפעל מחדש",
							].map((step) => (
								<div
									key={step}
									className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2"
								>
									<span
										className="text-[var(--color-accent-blue)] shrink-0 mt-0.5"
										aria-hidden="true"
									>
										›
									</span>
									{step}
								</div>
							))}
						</div>
					</div>

					{/* Important rules */}
					<div className="space-y-2">
						<AlertBox type="error">
							<strong>JSONL חייב להישמר בצורה נכונה</strong> — כל שורה JSON
							עצמאי ללא newlines פנימיים. תמיד השתמש ב:{" "}
							<code className="font-mono bg-black/20 px-1 rounded">
								tr '\n' ' '
							</code>{" "}
							לפני כתיבה. שורה פגומה גורמת לשגיאת JSONDecodeError שמפסיקה את כל
							הקריאה.
						</AlertBox>
						<AlertBox type="warning">
							<strong>לעולם אל תמחק hydra-bayesian.json</strong> — קובץ זה מאחסן
							ציוני Bayesian לכל הספקים. מחיקה מאפסת שבועות של כיול נתונים ל-0.5
							לכולם.
						</AlertBox>
					</div>
				</div>
			</AccordionSection>
		</div>
	);
}
