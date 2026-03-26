import {
	Archive,
	BookOpen,
	Brain,
	ChevronDown,
	ChevronUp,
	Database,
	FileJson,
	FileText,
	Layers,
	RefreshCw,
	Scale,
	Search,
	Shield,
	Shuffle,
	Star,
	Tag,
	Timer,
} from "lucide-react";
import { useState } from "react";
import { useMemory } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

// ── Accordion ────────────────────────────────────────────────────────────────

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

// ── Shared sub-components ────────────────────────────────────────────────────

function CodeBlock({ children }: { children: string }) {
	return (
		<pre
			className={cn(
				"rounded-lg px-4 py-3 text-xs font-mono overflow-x-auto",
				"bg-[var(--color-bg-primary)] text-[var(--color-accent-cyan)]",
				"border border-[var(--color-border)]",
			)}
			dir="ltr"
		>
			{children}
		</pre>
	);
}

function InfoRow({
	label,
	value,
	color = "var(--color-accent-blue)",
}: {
	label: string;
	value: React.ReactNode;
	color?: string;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-1.5 border-b border-[var(--color-border)] last:border-0">
			<span className="text-sm text-[var(--color-text-secondary)]">
				{label}
			</span>
			<span className="text-sm font-mono font-semibold" style={{ color }}>
				{value}
			</span>
		</div>
	);
}

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

// ── Section 1 — סוגי זיכרון ─────────────────────────────────────────────────

const MEMORY_TYPES = [
	{
		icon: <FileJson size={18} />,
		name: "beads.jsonl",
		path: "~/.claude/knowledge/beads.jsonl",
		color: "var(--color-accent-amber)",
		desc: "לכידת ידע מכל PostToolUse Task event. כל שורה מייצגת רגע ידע: סוג סוכן, מודל, תוצאה, הקשר.",
		detail:
			'נכתב אוטומטית ע"י knowledge-capture.sh לאחר כל פעולת כלי. מהווה audit trail מלא של פעילות הסוכנים. מסתובב ב-500+ שורות.',
	},
	{
		icon: <Brain size={18} />,
		name: "LanceDB",
		path: "~/.claude/knowledge/lancedb_memory/",
		color: "var(--color-accent-purple)",
		desc: "זיכרון קוגניטיבי עם חיפוש סמנטי. כל ידע מקבל ציון חשיבות ומתיישן עם הזמן.",
		detail:
			"נוסחת ה-recall הקוגניטיבית: (similarity × 0.5) + (recency × 0.3) + (importance × 0.2). ניתן לשלוף ידע רלוונטי מכל session.",
	},
	{
		icon: <Database size={18} />,
		name: "SQLite — hydra-state.db",
		path: "~/.claude/knowledge/hydra-state.db",
		color: "var(--color-accent-cyan)",
		desc: "LangGraph checkpoints לכל משימת Hydra. מאפשר המשך מיידי אחרי קריסה.",
		detail:
			"SqliteSaver עם 5 PRAGMAs חובה: WAL, busy_timeout=30000, synchronous=NORMAL, cache_size=-65536, wal_autocheckpoint=1000. מחיקה רק בקורופציה.",
	},
	{
		icon: <FileText size={18} />,
		name: "MEMORY.md",
		path: "~/.claude/projects/-home-nadavcohen/memory/MEMORY.md",
		color: "var(--color-accent-green)",
		desc: "הקשר cross-session — מה שקלוד צריך לדעת בין שיחות. מערכת auto-memory אוטומטית.",
		detail:
			"מוגבל ל-120 שורות. פרויקטים, העדפות, נתיבים, learnings. קובצי topic נפרדים עבור פרטים מעמיקים.",
	},
	{
		icon: <BookOpen size={18} />,
		name: "auto-learned-rules.md",
		path: "~/.claude/rules/quality/auto-learned-rules.md",
		color: "var(--color-accent-blue)",
		desc: 'patterns שהתגלו מ-sessions. נכתב אוטומטית ע"י claude-md-auto-update.sh.',
		detail:
			"ציוני ביטחון: 0.3 tentative → 0.5 moderate → 0.7 strong → 0.9 near-certain. rules מועברות ל-archive כשהקובץ גדל.",
	},
	{
		icon: <Scale size={18} />,
		name: "hydra-bayesian.json",
		path: "~/.claude/knowledge/handoffs/hydra-bayesian.json",
		color: "var(--color-accent-red)",
		desc: "ציוני אמון לכל provider AI (Beta distribution). מנחה את Hydra בבחירת הסוכן הטוב ביותר.",
		detail:
			"Laplace smoothing: provider חדש מתחיל ב-0.5. אחרי 5 הצלחות: ~0.857. אחרי 5 כשלונות: ~0.143. לעולם אל תמחק קובץ זה.",
	},
];

function MemoryTypesSection() {
	return (
		<div className="flex flex-col gap-4">
			{MEMORY_TYPES.map((m) => (
				<div
					key={m.name}
					className="rounded-xl p-4 flex flex-col gap-2"
					style={{
						background: `oklch(from ${m.color} l c h / 0.05)`,
						border: `1px solid oklch(from ${m.color} l c h / 0.25)`,
					}}
				>
					<div className="flex items-center gap-2.5">
						<span
							className="flex size-8 shrink-0 items-center justify-center rounded-lg"
							style={{
								background: `oklch(from ${m.color} l c h / 0.15)`,
								color: m.color,
							}}
						>
							{m.icon}
						</span>
						<div className="flex-1 min-w-0">
							<div
								className="text-sm font-bold font-mono"
								style={{ color: m.color }}
								dir="ltr"
							>
								{m.name}
							</div>
							<div
								className="text-xs text-[var(--color-text-muted)] font-mono truncate"
								dir="ltr"
							>
								{m.path}
							</div>
						</div>
					</div>
					<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
						{m.desc}
					</p>
					<p className="text-xs text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)] pt-2">
						{m.detail}
					</p>
				</div>
			))}
		</div>
	);
}

// ── Section 2 — איך הזיכרון עובד ────────────────────────────────────────────

function FlowDiagram() {
	const boxStyle = (color: string): React.CSSProperties => ({
		background: `oklch(from ${color} l c h / 0.1)`,
		border: `1px solid oklch(from ${color} l c h / 0.35)`,
		color,
	});

	const arrowColor = "var(--color-text-muted)";

	return (
		<div className="flex flex-col gap-3" dir="ltr">
			{/* Row 1: Tool Call → PostToolUse hook → beads.jsonl */}
			<div className="flex items-center gap-2 flex-wrap">
				<div
					className="rounded-lg px-3 py-2 text-xs font-mono font-semibold shrink-0"
					style={boxStyle("var(--color-accent-cyan)")}
				>
					Tool Call
				</div>
				<span className="text-[var(--color-text-muted)] text-xs font-mono shrink-0">
					→
				</span>
				<div
					className="rounded-lg px-3 py-2 text-xs font-mono font-semibold shrink-0"
					style={boxStyle("var(--color-accent-amber)")}
				>
					PostToolUse hook
				</div>
				<span className="text-[var(--color-text-muted)] text-xs font-mono shrink-0">
					→
				</span>
				<div
					className="rounded-lg px-3 py-2 text-xs font-mono font-semibold shrink-0"
					style={boxStyle("var(--color-accent-amber)")}
				>
					beads.jsonl
				</div>
				<span className="text-[var(--color-text-muted)] text-xs font-mono shrink-0">
					→
				</span>
				<div
					className="rounded-lg px-3 py-2 text-xs font-mono font-semibold shrink-0"
					style={boxStyle("var(--color-accent-green)")}
				>
					knowledge-capture.sh
				</div>
			</div>

			{/* Arrow down */}
			<div className="flex items-center" dir="ltr">
				<div className="w-[calc(100%-120px)]" />
				<div className="text-xs font-mono" style={{ color: arrowColor }}>
					↓
				</div>
			</div>

			{/* Row 2: LanceDB encode() */}
			<div className="flex items-center gap-2 justify-end flex-wrap">
				<div
					className="rounded-lg px-3 py-2 text-xs font-mono font-semibold shrink-0"
					style={boxStyle("var(--color-accent-purple)")}
				>
					LanceDB encode()
				</div>
				<span
					className="text-xs font-mono shrink-0"
					style={{ color: arrowColor }}
				>
					scope + importance
				</span>
			</div>

			{/* Arrow down */}
			<div className="flex justify-end">
				<div className="text-xs font-mono" style={{ color: arrowColor }}>
					↓
				</div>
			</div>

			{/* Row 3: cognitive recall() */}
			<div className="flex items-center gap-2 justify-end flex-wrap">
				<div
					className="rounded-lg px-3 py-2 text-xs font-mono font-semibold shrink-0"
					style={boxStyle("var(--color-accent-purple)")}
				>
					cognitive recall()
				</div>
			</div>

			{/* Formula */}
			<div
				className="rounded-xl px-4 py-3 text-xs font-mono text-center"
				style={{
					background: `oklch(from var(--color-accent-purple) l c h / 0.07)`,
					border: `1px solid oklch(from var(--color-accent-purple) l c h / 0.25)`,
					color: "var(--color-accent-purple)",
				}}
			>
				score = (similarity × 0.5) + (recency × 0.3) + (importance × 0.2)
			</div>

			{/* Also: Bayesian scoring */}
			<div className="mt-2 pt-3 border-t border-[var(--color-border)]">
				<div className="text-xs text-[var(--color-text-muted)] mb-2">
					מסלול מקביל — ניקוד Bayesian:
				</div>
				<div className="flex items-center gap-2 flex-wrap" dir="ltr">
					<div
						className="rounded-lg px-3 py-2 text-xs font-mono font-semibold shrink-0"
						style={boxStyle("var(--color-accent-red)")}
					>
						Task result
					</div>
					<span
						className="text-xs font-mono shrink-0"
						style={{ color: arrowColor }}
					>
						→
					</span>
					<div
						className="rounded-lg px-3 py-2 text-xs font-mono font-semibold shrink-0"
						style={boxStyle("var(--color-accent-red)")}
					>
						decide_node (terminal)
					</div>
					<span
						className="text-xs font-mono shrink-0"
						style={{ color: arrowColor }}
					>
						→
					</span>
					<div
						className="rounded-lg px-3 py-2 text-xs font-mono font-semibold shrink-0"
						style={boxStyle("var(--color-accent-red)")}
					>
						hydra-bayesian.json
					</div>
				</div>
			</div>
		</div>
	);
}

function HowItWorksSection() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					זרימת לכידת ידע
				</div>
				<FlowDiagram />
			</div>

			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					עקרונות מרכזיים
				</div>
				<div className="flex flex-col gap-2">
					{[
						{
							icon: <Timer size={14} />,
							color: "var(--color-accent-cyan)",
							text: "זיכרון Bayesian נשמר רק במצבי terminal (verified / failed) — לעולם לא במהלך ריצה",
						},
						{
							icon: <Shield size={14} />,
							color: "var(--color-accent-green)",
							text: "LanceDB הנגישות היא תמיד דרך recall() עם ניקוד קוגניטיבי — לא ישירות מהטבלה",
						},
						{
							icon: <RefreshCw size={14} />,
							color: "var(--color-accent-amber)",
							text: "SQLite דורש 5 PRAGMAs בכל חיבור — SqliteSaver לא מגדיר אותם אוטומטית",
						},
						{
							icon: <Archive size={14} />,
							color: "var(--color-accent-purple)",
							text: "MEMORY.md מוגבל ל-120 שורות — פרטים מעמיקים עוברים לקבצי topic נפרדים",
						},
					].map((item) => (
						<div
							key={item.text}
							className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
							style={{
								background: `oklch(from ${item.color} l c h / 0.05)`,
								border: `1px solid oklch(from ${item.color} l c h / 0.2)`,
							}}
						>
							<span className="mt-0.5 shrink-0" style={{ color: item.color }}>
								{item.icon}
							</span>
							<span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
								{item.text}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ── Section 3 — MEMORY.md מדריך ─────────────────────────────────────────────

const MEMORY_ENTRY_TYPES = [
	{
		type: "user",
		label: "user",
		color: "var(--color-accent-blue)",
		icon: <FileText size={14} />,
		when: "העדפות משתמש, stack, מכונות, תפקיד",
		example: "user-profile.md — זהות, עסק, hardware",
	},
	{
		type: "feedback",
		label: "feedback",
		color: "var(--color-accent-amber)",
		icon: <Star size={14} />,
		when: "תיקונים שהמשתמש נתן, דפוסים שחוזרים",
		example: "feedback_stop-claiming-done-early.md",
	},
	{
		type: "project",
		label: "project",
		color: "var(--color-accent-green)",
		icon: <Shuffle size={14} />,
		when: "מצב פרויקט, קבצים חשובים, עבודה בתהליך",
		example: "project-map.md, project_mexicani_vitest.md",
	},
	{
		type: "reference",
		label: "reference",
		color: "var(--color-accent-purple)",
		icon: <BookOpen size={14} />,
		when: "מחקר, נתונים טכניים, תוצאות session",
		example: "research-hydra-v2-migration.md",
	},
];

function MemoryMdSection() {
	return (
		<div className="flex flex-col gap-6">
			{/* Types */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					סוגי קבצים
				</div>
				<div className="grid grid-cols-1 gap-3">
					{MEMORY_ENTRY_TYPES.map((t) => (
						<div
							key={t.type}
							className="rounded-xl px-4 py-3 flex flex-col gap-1.5"
							style={{
								background: `oklch(from ${t.color} l c h / 0.06)`,
								border: `1px solid oklch(from ${t.color} l c h / 0.25)`,
							}}
						>
							<div className="flex items-center gap-2">
								<span style={{ color: t.color }}>{t.icon}</span>
								<span
									className="text-xs font-bold font-mono"
									style={{ color: t.color }}
								>
									{t.label}
								</span>
							</div>
							<div className="text-xs text-[var(--color-text-secondary)]">
								<span className="font-medium">מתי: </span>
								{t.when}
							</div>
							<div
								className="text-xs text-[var(--color-text-muted)] font-mono"
								dir="ltr"
							>
								{t.example}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Structure */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					מבנה קובץ
				</div>
				<CodeBlock>{`# Claude Code Memory — Nadav Cohen

> Auto-memory is ON. Keep this file under 120 lines.
> **User:** \`user-profile.md\` | **Projects:** \`project-map.md\`

## User Preferences
- Hebrew-first communication
- "שיא" = EVERY agent at ITS maximum

## Key Technical Learnings
**Gemini CLI: ONLY \`gemini-3.1-pro-preview\`**`}</CodeBlock>
			</div>

			{/* Location */}
			<div
				className="rounded-xl px-4 py-3 flex items-center gap-3"
				style={{
					background: `oklch(from var(--color-accent-green) l c h / 0.06)`,
					border: `1px solid oklch(from var(--color-accent-green) l c h / 0.25)`,
				}}
			>
				<FileText
					size={16}
					className="shrink-0"
					style={{ color: "var(--color-accent-green)" }}
				/>
				<div className="flex flex-col gap-0.5">
					<span className="text-xs text-[var(--color-text-muted)]">מיקום</span>
					<span
						className="text-xs font-mono font-semibold"
						style={{ color: "var(--color-accent-green)" }}
						dir="ltr"
					>
						~/.claude/projects/-home-nadavcohen/memory/
					</span>
				</div>
			</div>
		</div>
	);
}

// ── Section 4 — LanceDB חיפוש סמנטי ─────────────────────────────────────────

const IMPORTANCE_TIERS = [
	{
		score: "0.9",
		desc: "תיקוני משתמש, הפרות כללים קבועות",
		color: "var(--color-accent-red)",
	},
	{
		score: "0.7",
		desc: "כשלונות provider, learnings ספציפיים למשימה",
		color: "var(--color-accent-amber)",
	},
	{
		score: "0.5",
		desc: "עובדות ביצוע ניטרליות (דועכות אחרי 15 ימים)",
		color: "var(--color-accent-blue)",
	},
	{
		score: "0.3",
		desc: "הערות debug, מצב חולף (מועמדים ל-forget)",
		color: "var(--color-text-muted)",
	},
];

const SCOPE_EXAMPLES = [
	{ scope: "dispatch/kimi", desc: "כללי dispatch ספציפיים ל-Kimi" },
	{ scope: "dispatch/gemini", desc: "flags ספציפיים ל-Gemini" },
	{ scope: "project/mexicani", desc: "זיכרונות מקומיים לפרויקט mexicani" },
	{ scope: "task/<task-id>", desc: "הערות ביצוע per-task" },
	{ scope: "bayesian/scores", desc: "היסטוריית ציוני provider" },
	{ scope: "error/<provider>", desc: "דפוסי כשל ספציפיים ל-provider" },
];

function LanceDbSection() {
	return (
		<div className="flex flex-col gap-6">
			{/* API */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					API
				</div>
				<div className="flex flex-col gap-2">
					{[
						{
							fn: "encode(text, scope, importance)",
							desc: "שמור ידע עם scope היררכי וחשיבות 0.0–1.0",
							color: "var(--color-accent-green)",
						},
						{
							fn: "recall(query, scope, top_k)",
							desc: "חפש סמנטית עם ניקוד קוגניטיבי מלא",
							color: "var(--color-accent-blue)",
						},
						{
							fn: "forget(age_days, max_importance)",
							desc: "מחק זיכרונות ישנים ובעלי חשיבות נמוכה — age_days >= 1",
							color: "var(--color-accent-red)",
						},
					].map((api) => (
						<div
							key={api.fn}
							className="rounded-lg px-4 py-3 flex flex-col gap-1"
							style={{
								background: `oklch(from ${api.color} l c h / 0.06)`,
								border: `1px solid oklch(from ${api.color} l c h / 0.2)`,
							}}
						>
							<code
								className="text-xs font-mono font-bold"
								style={{ color: api.color }}
								dir="ltr"
							>
								{api.fn}
							</code>
							<span className="text-xs text-[var(--color-text-secondary)]">
								{api.desc}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Importance tiers */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					רמות חשיבות (importance)
				</div>
				<div className="rounded-xl overflow-hidden border border-[var(--color-border)]">
					{IMPORTANCE_TIERS.map((tier, i) => (
						<div
							key={tier.score}
							className={cn(
								"flex items-center gap-3 px-4 py-2.5",
								i < IMPORTANCE_TIERS.length - 1 &&
									"border-b border-[var(--color-border)]",
							)}
						>
							<span
								className="text-base font-mono font-black w-8 shrink-0 text-center"
								style={{ color: tier.color }}
							>
								{tier.score}
							</span>
							<span className="text-xs text-[var(--color-text-secondary)]">
								{tier.desc}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Scope naming */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
					מוסכמות scope
				</div>
				<div className="text-xs text-[var(--color-text-muted)] mb-3">
					היררכי, מופרד ב-
					<code className="font-mono" dir="ltr">
						/
					</code>
					. תווים מותרים:{" "}
					<code className="font-mono" dir="ltr">
						[a-zA-Z0-9_/\-.]+
					</code>
					. רווחים, נקודתיים, ועברית — אסורים.
				</div>
				<div className="rounded-xl overflow-hidden border border-[var(--color-border)]">
					{SCOPE_EXAMPLES.map((s, i) => (
						<div
							key={s.scope}
							className={cn(
								"flex items-center gap-4 px-4 py-2.5",
								i < SCOPE_EXAMPLES.length - 1 &&
									"border-b border-[var(--color-border)]",
							)}
						>
							<code
								className="text-xs font-mono font-semibold text-[var(--color-accent-cyan)] w-40 shrink-0"
								dir="ltr"
							>
								{s.scope}
							</code>
							<span className="text-xs text-[var(--color-text-muted)]">
								{s.desc}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Cognitive formula */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					נוסחת recall קוגניטיבי
				</div>
				<CodeBlock>{`# ניקוד כל תוצאה בחיפוש:
score = (similarity * 0.5) + (recency * 0.3) + (importance * 0.2)

# similarity  — קרבה סמנטית ל-query (0.0–1.0)
# recency     — עכשוויות (דועך לפי גיל הרשומה)
# importance  — ערך שהוגדר בעת encode()

# מחיקה בטוחה (מינימלית):
mem.forget(age_days=60, max_importance=0.5)`}</CodeBlock>
			</div>
		</div>
	);
}

// ── Section 5 — Rules System ─────────────────────────────────────────────────

const RULE_FILES = [
	{
		path: "rules/quality/",
		label: "quality/",
		type: "תמיד נטען",
		badge: "always",
		color: "var(--color-accent-green)",
		files: [
			"past-mistakes.md",
			"code-quality.md",
			"verification.md",
			"rtl-i18n.md",
			"auto-learned-rules.md",
		],
	},
	{
		path: "rules/security/",
		label: "security/",
		type: "תמיד נטען",
		badge: "always",
		color: "var(--color-accent-red)",
		files: ["security.md", "ai-security.md"],
	},
	{
		path: "rules/verification/",
		label: "verification/",
		type: "תמיד נטען",
		badge: "always",
		color: "var(--color-accent-blue)",
		files: ["audit-gates.md"],
	},
	{
		path: "rules/infra/ops-rules.md",
		label: "infra/ops-rules.md",
		type: "לפי דרישה",
		badge: "on-demand",
		color: "var(--color-accent-amber)",
		files: ["machine mapping, sync, git, agent settings"],
	},
	{
		path: "rules/infra/hydra-v2-rules.md",
		label: "infra/hydra-v2-rules.md",
		type: "לפי דרישה",
		badge: "on-demand",
		color: "var(--color-accent-amber)",
		files: ["LangGraph, SQLite, LanceDB, SIGTERM, Bayesian, FastAPI"],
	},
	{
		path: "rules/infra/stack-rules.md",
		label: "infra/stack-rules.md",
		type: "לפי דרישה",
		badge: "on-demand",
		color: "var(--color-accent-amber)",
		files: ["Flutter 2026, Base44, Kimi batch, DCM"],
	},
	{
		path: "rules/quality/auto-learned-rules-archive.md",
		label: "auto-learned-rules-archive.md",
		type: "ארכיון",
		badge: "archive",
		color: "var(--color-text-muted)",
		files: ["rules ישנות, Gemini dispatch, Codex config, infra/hook"],
	},
];

const BADGE_STYLES: Record<string, string> = {
	always: "var(--color-accent-green)",
	"on-demand": "var(--color-accent-amber)",
	archive: "var(--color-text-muted)",
};

const CONFIDENCE_TIERS = [
	{
		score: "0.3",
		label: "tentative",
		desc: "2 מופעים",
		color: "var(--color-text-muted)",
	},
	{
		score: "0.5",
		label: "moderate",
		desc: "3 מופעים",
		color: "var(--color-accent-cyan)",
	},
	{
		score: "0.7",
		label: "strong",
		desc: "5+ מופעים",
		color: "var(--color-accent-blue)",
	},
	{
		score: "0.9",
		label: "near-certain",
		desc: "10+ מופעים",
		color: "var(--color-accent-green)",
	},
];

function RulesSection() {
	return (
		<div className="flex flex-col gap-6">
			{/* Rule files */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					קבצי כללים
				</div>
				<div className="flex flex-col gap-2">
					{RULE_FILES.map((rf) => (
						<div
							key={rf.path}
							className="rounded-xl px-4 py-3 flex flex-col gap-1.5"
							style={{
								background: `oklch(from ${rf.color} l c h / 0.05)`,
								border: `1px solid oklch(from ${rf.color} l c h / 0.2)`,
							}}
						>
							<div className="flex items-center gap-2 flex-wrap">
								<code
									className="text-xs font-mono font-bold"
									style={{ color: rf.color }}
									dir="ltr"
								>
									{rf.label}
								</code>
								<Badge label={rf.type} color={BADGE_STYLES[rf.badge]} />
							</div>
							<div className="flex flex-wrap gap-1.5 mt-0.5">
								{rf.files.map((f) => (
									<span
										key={f}
										className="text-xs text-[var(--color-text-muted)] font-mono"
										dir="ltr"
									>
										{f}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Confidence scoring */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					מודל ציוני ביטחון
				</div>
				<div className="rounded-xl overflow-hidden border border-[var(--color-border)]">
					{CONFIDENCE_TIERS.map((tier, i) => (
						<div
							key={tier.score}
							className={cn(
								"flex items-center gap-3 px-4 py-3",
								i < CONFIDENCE_TIERS.length - 1 &&
									"border-b border-[var(--color-border)]",
							)}
						>
							<span
								className="text-base font-mono font-black w-8 shrink-0 text-center"
								style={{ color: tier.color }}
							>
								{tier.score}
							</span>
							<div className="flex flex-col gap-0.5">
								<span
									className="text-xs font-mono font-semibold"
									style={{ color: tier.color }}
								>
									{tier.label}
								</span>
								<span className="text-xs text-[var(--color-text-muted)]">
									{tier.desc}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Auto-update pipeline */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
					פייפליין auto-update
				</div>
				<CodeBlock>{`correction-detector.sh  → corrections.jsonl
dispatch-auto-log.sh    → audit-patterns.jsonl
claude-md-auto-update.sh → auto-learned-rules.md
knowledge-capture.sh    → beads.jsonl
memory-bridge.sh        → Memory MCP`}</CodeBlock>
			</div>
		</div>
	);
}

// ── Section 6 — סטטיסטיקות חיות ──────────────────────────────────────────────

function LiveStatsSection() {
	const { data, isLoading, error } = useMemory();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3">
				{[1, 2, 3, 4].map((n) => (
					<div key={n} className="shimmer h-10 rounded-lg" />
				))}
			</div>
		);
	}

	if (error || !data) {
		return (
			<div
				className="rounded-xl px-4 py-3 text-sm text-[var(--color-accent-amber)]"
				style={{
					background: `oklch(from var(--color-accent-amber) l c h / 0.08)`,
					border: `1px solid oklch(from var(--color-accent-amber) l c h / 0.25)`,
				}}
			>
				לא ניתן לטעון נתונים — שרת API לא זמין
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* MEMORY.md stats */}
			<div>
				<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
					<FileText size={14} className="text-[var(--color-accent-green)]" />
					MEMORY.md
				</div>
				<div
					className="rounded-xl px-4 py-1 border border-[var(--color-border)]"
					style={{ background: "var(--color-bg-elevated)" }}
				>
					<InfoRow
						label="מצב"
						value={data.exists ? "קיים" : "לא נמצא"}
						color={
							data.exists
								? "var(--color-accent-green)"
								: "var(--color-accent-red)"
						}
					/>
					<InfoRow
						label="שורות"
						value={<span dir="ltr">{data.line_count} / 120</span>}
						color={
							data.line_count > 100
								? "var(--color-accent-red)"
								: data.line_count > 80
									? "var(--color-accent-amber)"
									: "var(--color-accent-green)"
						}
					/>
					<InfoRow
						label="עדכון אחרון"
						value={
							data.last_modified
								? new Date(data.last_modified).toLocaleString("he-IL")
								: "—"
						}
						color="var(--color-text-secondary)"
					/>
					<InfoRow
						label="sections"
						value={data.sections.length}
						color="var(--color-accent-blue)"
					/>
				</div>
			</div>

			{/* Sections list */}
			{data.sections.length > 0 && (
				<div>
					<div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
						<Tag size={14} className="text-[var(--color-accent-blue)]" />
						סעיפים ב-MEMORY.md
					</div>
					<div className="flex flex-col gap-1.5">
						{data.sections.map((section) => (
							<div
								key={section}
								className="flex items-center gap-2 rounded-lg px-3 py-2"
								style={{
									background: `oklch(from var(--color-accent-blue) l c h / 0.06)`,
									border: `1px solid oklch(from var(--color-accent-blue) l c h / 0.15)`,
								}}
							>
								<span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)] shrink-0" />
								<span className="text-xs text-[var(--color-text-secondary)]">
									{section}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Knowledge & Rules counts */}
			<div className="grid grid-cols-2 gap-3">
				<div
					className="rounded-xl px-4 py-4 flex flex-col items-center gap-1"
					style={{
						background: `oklch(from var(--color-accent-purple) l c h / 0.08)`,
						border: `1px solid oklch(from var(--color-accent-purple) l c h / 0.25)`,
					}}
				>
					<Database size={18} className="text-[var(--color-accent-purple)]" />
					<span
						className="text-2xl font-black font-mono"
						style={{ color: "var(--color-accent-purple)" }}
					>
						{data.knowledge_files}
					</span>
					<span className="text-xs text-[var(--color-text-muted)] text-center">
						קבצי knowledge
					</span>
				</div>
				<div
					className="rounded-xl px-4 py-4 flex flex-col items-center gap-1"
					style={{
						background: `oklch(from var(--color-accent-amber) l c h / 0.08)`,
						border: `1px solid oklch(from var(--color-accent-amber) l c h / 0.25)`,
					}}
				>
					<BookOpen size={18} className="text-[var(--color-accent-amber)]" />
					<span
						className="text-2xl font-black font-mono"
						style={{ color: "var(--color-accent-amber)" }}
					>
						{data.rules_files ?? "—"}
					</span>
					<span className="text-xs text-[var(--color-text-muted)] text-center">
						קבצי rules
					</span>
				</div>
			</div>

			{/* Total rules count */}
			{data.rules_count !== undefined && (
				<div
					className="rounded-xl px-4 py-3 flex items-center justify-between"
					style={{
						background: `oklch(from var(--color-accent-amber) l c h / 0.06)`,
						border: `1px solid oklch(from var(--color-accent-amber) l c h / 0.2)`,
					}}
				>
					<div className="flex items-center gap-2">
						<Layers size={15} style={{ color: "var(--color-accent-amber)" }} />
						<span className="text-sm text-[var(--color-text-secondary)]">
							סה"כ rules
						</span>
					</div>
					<span
						className="text-lg font-mono font-black"
						style={{ color: "var(--color-accent-amber)" }}
					>
						{data.rules_count}
					</span>
				</div>
			)}
		</div>
	);
}

// ── Page ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
	{
		id: "memory-types",
		title: "סוגי זיכרון",
		subtitle:
			"6 שכבות ידע — beads, LanceDB, SQLite, MEMORY.md, rules, Bayesian",
		icon: <Brain size={18} />,
		color: "var(--color-accent-purple)",
		component: <MemoryTypesSection />,
		defaultOpen: true,
	},
	{
		id: "how-it-works",
		title: "איך הזיכרון עובד",
		subtitle: "זרימת לכידת ידע מ-Tool Call ועד LanceDB encode()",
		icon: <Shuffle size={18} />,
		color: "var(--color-accent-cyan)",
		component: <HowItWorksSection />,
	},
	{
		id: "memory-md",
		title: "MEMORY.md — מדריך",
		subtitle: "4 סוגי קבצים, מבנה, ומיקום",
		icon: <FileText size={18} />,
		color: "var(--color-accent-green)",
		component: <MemoryMdSection />,
	},
	{
		id: "lancedb",
		title: "LanceDB — חיפוש סמנטי",
		subtitle: "encode / recall / forget + scope naming + נוסחת קוגניטיבי",
		icon: <Search size={18} />,
		color: "var(--color-accent-purple)",
		component: <LanceDbSection />,
	},
	{
		id: "rules",
		title: "מערכת הכללים",
		subtitle: "always-loaded, on-demand, archive + ציוני ביטחון",
		icon: <BookOpen size={18} />,
		color: "var(--color-accent-blue)",
		component: <RulesSection />,
	},
	{
		id: "live-stats",
		title: "סטטיסטיקות חיות",
		subtitle: "MEMORY.md, knowledge files, rules — נתונים מה-API",
		icon: <Layers size={18} />,
		color: "var(--color-accent-amber)",
		component: <LiveStatsSection />,
	},
];

export function MemoryGuidePage() {
	return (
		<div className="max-w-3xl mx-auto flex flex-col gap-5">
			{/* Page header */}
			<div className="flex items-center gap-3">
				<div
					className="flex size-10 shrink-0 items-center justify-center rounded-xl"
					style={{
						background: `oklch(from var(--color-accent-purple) l c h / 0.15)`,
					}}
				>
					<Brain size={20} style={{ color: "var(--color-accent-purple)" }} />
				</div>
				<div>
					<h1 className="text-xl font-bold text-[var(--color-text-primary)]">
						מערכת הזיכרון
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						כל מה שצריך לדעת על שכבות הידע של APEX
					</p>
				</div>
			</div>

			{/* Accordion sections */}
			<div className="flex flex-col gap-3">
				{SECTIONS.map((s) => (
					<AccordionSection
						key={s.id}
						id={s.id}
						title={s.title}
						subtitle={s.subtitle}
						icon={s.icon}
						accentColor={s.color}
						defaultOpen={s.defaultOpen}
					>
						{s.component}
					</AccordionSection>
				))}
			</div>
		</div>
	);
}
