import {
	BookOpen,
	ChevronDown,
	Code2,
	Cpu,
	Globe,
	HelpCircle,
	Layers,
	Search,
	Shield,
	Terminal,
	Wrench,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FaqSection {
	id: string;
	icon: React.ReactNode;
	title: string;
	content: React.ReactNode;
	tags: string[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CodeBlock({ children, label }: { children: string; label?: string }) {
	return (
		<div className="mt-2 mb-1">
			{label && (
				<p className="text-xs text-[var(--color-text-muted)] mb-1">{label}</p>
			)}
			<pre
				className={cn(
					"rounded-lg px-4 py-3 text-xs font-mono leading-relaxed overflow-x-auto",
					"bg-[var(--color-bg-primary)] text-[var(--color-accent-cyan)]",
					"border border-[var(--color-border)] whitespace-pre-wrap break-words",
				)}
				dir="ltr"
			>
				{children}
			</pre>
		</div>
	);
}

function SectionHeading({ children }: { children: React.ReactNode }) {
	return (
		<h3 className="text-sm font-semibold text-[var(--color-accent-blue)] mt-5 mb-2 flex items-center gap-2">
			{children}
		</h3>
	);
}

function Badge({
	children,
	color = "blue",
}: {
	children: React.ReactNode;
	color?: "blue" | "green" | "amber" | "red" | "purple" | "cyan";
}) {
	const colorMap = {
		blue: "bg-[oklch(0.65_0.18_250_/_0.15)] text-[var(--color-accent-blue)]",
		green: "bg-[oklch(0.72_0.19_155_/_0.15)] text-[var(--color-accent-green)]",
		amber: "bg-[oklch(0.78_0.16_75_/_0.15)] text-[var(--color-accent-amber)]",
		red: "bg-[oklch(0.62_0.22_25_/_0.15)] text-[var(--color-accent-red)]",
		purple: "bg-[oklch(0.62_0.2_290_/_0.15)] text-[var(--color-accent-purple)]",
		cyan: "bg-[oklch(0.75_0.14_200_/_0.15)] text-[var(--color-accent-cyan)]",
	};
	return (
		<span
			className={cn(
				"inline-block text-xs font-medium px-2 py-0.5 rounded-full",
				colorMap[color],
			)}
		>
			{children}
		</span>
	);
}

function InfoRow({
	label,
	value,
	mono = false,
}: {
	label: string;
	value: React.ReactNode;
	mono?: boolean;
}) {
	return (
		<div className="flex items-start gap-3 py-1.5 border-b border-[var(--color-border)] last:border-0">
			<span className="text-xs text-[var(--color-text-muted)] shrink-0 w-36 pt-0.5">
				{label}
			</span>
			<span
				className={cn(
					"text-xs text-[var(--color-text-primary)] flex-1",
					mono && "font-mono text-[var(--color-accent-cyan)]",
				)}
				dir={mono ? "ltr" : undefined}
			>
				{value}
			</span>
		</div>
	);
}

function BulletList({ items }: { items: React.ReactNode[] }) {
	return (
		<ul className="space-y-1.5 mt-2">
			{items.map((item) => (
				<li
					key={String(item)}
					className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
				>
					<span
						className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)] shrink-0"
						aria-hidden="true"
					/>
					<span>{item}</span>
				</li>
			))}
		</ul>
	);
}

// ── FAQ Sections Data ─────────────────────────────────────────────────────────

function buildSections(): FaqSection[] {
	return [
		// ── Section 1: What is APEX ────────────────────────────────────────────
		{
			id: "what-is-apex",
			icon: <Zap size={16} />,
			title: "מה זה APEX Command Center?",
			tags: ["apex", "מבוא", "מה זה", "מערכת", "כללי"],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-4">
					<p>
						APEX Command Center הוא לוח בקרה מרכזי לניטור ושליטה על מערכת{" "}
						<strong className="text-[var(--color-text-primary)]">
							AI Agents
						</strong>{" "}
						— צי של 45+ סוכנים אוטונומיים שמבצעים משימות פיתוח, בדיקות, אבטחה
						ותחזוקה.
					</p>

					<SectionHeading>מבנה הארכיטקטורה</SectionHeading>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="glass-card p-4 border-[oklch(0.65_0.18_250_/_0.2)]">
							<div className="flex items-center gap-2 mb-2">
								<Terminal
									size={14}
									className="text-[var(--color-accent-blue)]"
								/>
								<span className="text-xs font-semibold text-[var(--color-text-primary)]">
									Backend — Python
								</span>
							</div>
							<p className="text-xs text-[var(--color-text-muted)]">
								<code className="font-mono text-[var(--color-accent-cyan)]">
									dashboard.py
								</code>{" "}
								פועל על פורט{" "}
								<code
									className="font-mono text-[var(--color-accent-cyan)]"
									dir="ltr"
								>
									8743
								</code>
								. קורא logs, SQLite DB, LanceDB, קבצי config, מצב מערכת, ומגיש
								26 API endpoints לממשק.
							</p>
						</div>
						<div className="glass-card p-4 border-[oklch(0.72_0.19_155_/_0.2)]">
							<div className="flex items-center gap-2 mb-2">
								<Globe size={14} className="text-[var(--color-accent-green)]" />
								<span className="text-xs font-semibold text-[var(--color-text-primary)]">
									Frontend — React
								</span>
							</div>
							<p className="text-xs text-[var(--color-text-muted)]">
								Dashboard זה (Vite + React 19 + Tailwind 4.2) פועל על פורט{" "}
								<code
									className="font-mono text-[var(--color-accent-cyan)]"
									dir="ltr"
								>
									5173
								</code>
								. מציג נתונים ויזואלית ומאפשר שליטה על Hydra v2 ורכיבי מערכת.
							</p>
						</div>
					</div>

					<SectionHeading>מה ניתן לעשות?</SectionHeading>
					<BulletList
						items={[
							"לצפות בסטטוס כל 45 הסוכנים — מי פעיל, מה הסטטיסטיקות שלו",
							"לעקוב אחרי משימות Hydra v2 — מ-pending עד verified",
							"לבדוק את בריאות המערכת — SQLite, LangGraph, LanceDB",
							"לנטר שימוש ב-RAM, CPU, Disk בזמן אמת",
							"להפעיל ולכבות את שירות Hydra, לנקות orphan processes",
							"לצפות בכל 78+ ה-hooks ובסטטיסטיקות ביצוע שלהם",
							"לראות ניקודים בייסיאניים של ספקי AI (Codex, Kimi, Gemini, MiniMax)",
						]}
					/>
				</div>
			),
		},

		// ── Section 2: How to start ────────────────────────────────────────────
		{
			id: "how-to-start",
			icon: <Terminal size={16} />,
			title: "איך מפעילים את ה-Dashboard?",
			tags: ["הפעלה", "התחלה", "terminal", "פורט", "dev", "start"],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-4">
					<p>
						ה-Dashboard מורכב משני חלקים שצריכים לפעול בו-זמנית: Backend Python
						ו-Frontend React. פתח שני חלונות טרמינל.
					</p>

					<SectionHeading>שלב 1 — הפעל את ה-Backend</SectionHeading>
					<CodeBlock label="טרמינל 1">{`cd ~/.claude/scripts/hydra-v2
python3 dashboard.py`}</CodeBlock>
					<p className="text-xs text-[var(--color-text-muted)]">
						Backend יתחיל להאזין על{" "}
						<span
							className="font-mono text-[var(--color-accent-cyan)]"
							dir="ltr"
						>
							http://localhost:8743
						</span>
						. תראה הודעה:{" "}
						<span
							className="font-mono text-[var(--color-accent-green)]"
							dir="ltr"
						>
							INFO: Uvicorn running on http://0.0.0.0:8743
						</span>
					</p>

					<SectionHeading>שלב 2 — הפעל את ה-Frontend</SectionHeading>
					<CodeBlock label="טרמינל 2">{`cd ~/Desktop/hydra-dashboard
pnpm dev`}</CodeBlock>
					<p className="text-xs text-[var(--color-text-muted)]">
						Frontend יתחיל על{" "}
						<span
							className="font-mono text-[var(--color-accent-cyan)]"
							dir="ltr"
						>
							http://localhost:5173
						</span>
						. Vite מוגדר ל-proxy בקשות{" "}
						<span className="font-mono text-[var(--color-accent-cyan)]">
							/api/
						</span>{" "}
						אל{" "}
						<span
							className="font-mono text-[var(--color-accent-cyan)]"
							dir="ltr"
						>
							localhost:8743
						</span>
						.
					</p>

					<SectionHeading>שלב 3 — פתח בדפדפן</SectionHeading>
					<CodeBlock>{`http://localhost:5173`}</CodeBlock>

					<SectionHeading>Build לפרודקשן</SectionHeading>
					<CodeBlock>{`pnpm build
pnpm preview   # תצוגה מקדימה של ה-build`}</CodeBlock>

					<div className="mt-4 p-3 rounded-lg bg-[oklch(0.78_0.16_75_/_0.1)] border border-[oklch(0.78_0.16_75_/_0.2)]">
						<p className="text-xs text-[var(--color-accent-amber)]">
							<strong>חשוב:</strong> Backend חייב לפעול לפני פתיחת Frontend. בלי
							Backend, הממשק יציג שגיאות חיבור ולא יטען נתונים.
						</p>
					</div>
				</div>
			),
		},

		// ── Section 3: Dashboard pages guide ──────────────────────────────────
		{
			id: "pages-guide",
			icon: <Layers size={16} />,
			title: "מדריך לכל דף Dashboard",
			tags: [
				"דפים",
				"ניווט",
				"סקירה",
				"צי",
				"הידרה",
				"בריאות",
				"מערכת",
				"הוקים",
				"מטריקות",
				"שליטה",
			],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-5">
					{/* Overview */}
					<div>
						<SectionHeading>
							<span className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)]" />
							סקירה כללית
						</SectionHeading>
						<p className="mb-2">הדף הראשי — תמונת מצב מיידית של כל המערכת.</p>
						<div className="space-y-1">
							<InfoRow
								label="KPIs עליונים"
								value="מספר סוכנים, משימות, אחוז הצלחה, dispatches סך הכל"
							/>
							<InfoRow
								label="System Gauges"
								value="CPU%, RAM%, Disk% — מד עיגול עם צבעי אזהרה"
							/>
							<InfoRow
								label="Watcher Events"
								value="10 האירועים האחרונים מ-hydra-watcher.jsonl"
							/>
						</div>
					</div>

					{/* Fleet */}
					<div>
						<SectionHeading>
							<span className="w-2 h-2 rounded-full bg-[var(--color-cat-gsd)]" />
							צי סוכנים
						</SectionHeading>
						<p className="mb-2">
							כל 45 הסוכנים, מאורגנים לפי קטגוריה עם אפשרויות סינון.
						</p>
						<div className="space-y-1">
							<InfoRow
								label="קטגוריות"
								value={
									<span className="flex flex-wrap gap-1">
										<Badge color="purple">GSD</Badge>
										<Badge color="red">אבטחה</Badge>
										<Badge color="green">איכות</Badge>
										<Badge color="cyan">ביצועים</Badge>
										<Badge color="amber">תשתית</Badge>
									</span>
								}
							/>
							<InfoRow
								label="חיפוש"
								value="שדה חיפוש בשם הסוכן — filtering בזמן אמת"
							/>
							<InfoRow
								label="כרטיס סוכן"
								value="שם, תיאור, קטגוריה, מספר dispatches, סטטוס אחרון"
							/>
						</div>
					</div>

					{/* Hydra */}
					<div>
						<SectionHeading>
							<span className="w-2 h-2 rounded-full bg-[var(--color-accent-amber)]" />
							הידרה v2
						</SectionHeading>
						<p className="mb-2">
							ניטור מלא של מנוע Hydra — Bayesian routing, task lifecycle,
							אירועים.
						</p>
						<div className="space-y-1">
							<InfoRow
								label="Bayesian Scores"
								value="ניקוד 0–1 לכל ספק (Codex/Kimi/Gemini/MiniMax) — מעודכן אחרי כל משימה"
							/>
							<InfoRow
								label="Task Pipeline"
								value="חמישה שלבים: pending → plan → decide → execute → verify/failed"
							/>
							<InfoRow
								label="Timeline"
								value="ציר זמן של אירועי watcher — שגיאות, השלמות, restart"
							/>
						</div>
					</div>

					{/* Health */}
					<div>
						<SectionHeading>
							<span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)]" />
							בריאות
						</SectionHeading>
						<p className="mb-2">7 בדיקות בריאות — ירוק/אדום לכל רכיב.</p>
						<div className="space-y-1">
							<InfoRow
								label="בדיקות"
								value="LangGraph, SQLite DB, LanceDB, Python deps, Watcher, Bayesian, Audit chain"
							/>
							<InfoRow
								label="כפתור"
								value="'הרץ בדיקת בריאות' — טריגר ל-health_check.py ב-Backend"
							/>
							<InfoRow
								label="פרטים"
								value="כל כרטיס ניתן להרחבה — מציג message ו-details מהבדיקה"
							/>
						</div>
					</div>

					{/* System */}
					<div>
						<SectionHeading>
							<span className="w-2 h-2 rounded-full bg-[var(--color-accent-cyan)]" />
							מערכת
						</SectionHeading>
						<p className="mb-2">מצב חומרה ותשתית — pop-os ו-MSI בו-זמנית.</p>
						<div className="space-y-1">
							<InfoRow
								label="משאבים"
								value="RAM, CPU, Disk, Swap — progress bars ואחוזים"
							/>
							<InfoRow
								label="uptime"
								value="כמה זמן המחשב פועל, PID של שירותים"
							/>
							<InfoRow
								label="MCP Servers"
								value="אילו MCP servers פועלים, כמה RAM צורכים"
							/>
							<InfoRow
								label="earlyoom"
								value="סטטוס daemon שמגן מפני OOM (Out of Memory)"
							/>
							<InfoRow
								label="Orphan processes"
								value="node.*mcp processes שנשארו חיים — כמה יש, כמה RAM"
							/>
							<InfoRow
								label="MSI"
								value="סטטוס המכונה השנייה דרך Tailscale (100.87.247.87)"
							/>
						</div>
					</div>

					{/* Hooks */}
					<div>
						<SectionHeading>
							<span className="w-2 h-2 rounded-full bg-[var(--color-accent-purple)]" />
							הוקים
						</SectionHeading>
						<p className="mb-2">
							כל 78+ ה-hooks — מאורגנים לפי סוג אירוע עם סטטיסטיקות.
						</p>
						<div className="space-y-1">
							<InfoRow
								label="סוגי אירועים"
								value="PreToolUse, PostToolUse, Stop, SessionStart, UserPromptSubmit, PostCompact"
							/>
							<InfoRow
								label="סטטיסטיקות"
								value="כמה פעמים כל hook רץ, כמה נחסמו, זמן ריצה ממוצע"
							/>
							<InfoRow
								label="קוד"
								value="שם קובץ ה-.sh, timeout, האם blocking או async"
							/>
						</div>
					</div>

					{/* Metrics */}
					<div>
						<SectionHeading>
							<span className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)]" />
							מטריקות
						</SectionHeading>
						<p className="mb-2">
							סטטיסטיקות מצטברות — 580+ dispatches, top agents, פרויקטים.
						</p>
						<div className="space-y-1">
							<InfoRow
								label="כולל"
								value="סך dispatches, success rate, זמן ריצה ממוצע לספק"
							/>
							<InfoRow
								label="Top Agents"
								value="הסוכנים הנפוצים ביותר — בר גרף עם ספירת ריצות"
							/>
							<InfoRow
								label="לפי ספק"
								value="כמה משימות לכל Codex/Kimi/Gemini/MiniMax, אחוז הצלחה"
							/>
							<InfoRow
								label="לפי פרויקט"
								value="כמה dispatches לכל פרויקט (mexicani, chance-pro, וכו')"
							/>
						</div>
					</div>

					{/* Control */}
					<div>
						<SectionHeading>
							<span className="w-2 h-2 rounded-full bg-[var(--color-accent-red)]" />
							שליטה
						</SectionHeading>
						<p className="mb-2">
							פעולות ניהול —{" "}
							<strong className="text-[var(--color-accent-amber)]">
								זהירות: כמה כפתורים מבצעים פעולות בלתי הפיכות.
							</strong>
						</p>
						<div className="space-y-1">
							<InfoRow
								label="Start Hydra"
								value="מפעיל systemctl --user start hydra-dispatch.service"
							/>
							<InfoRow
								label="Stop Hydra"
								value="עוצר systemctl --user stop hydra-dispatch.service"
							/>
							<InfoRow
								label="Backup DB"
								value="מעתיק hydra-state.db לקובץ .bak עם timestamp"
							/>
							<InfoRow
								label="Clean Orphans"
								value="pkill -f 'node.*mcp' — מנקה orphan processes שאוכלים RAM"
							/>
							<InfoRow
								label="Sync MSI"
								value="claude-sync push — סינכרון הגדרות ל-MSI (100.87.247.87)"
							/>
						</div>
					</div>
				</div>
			),
		},

		// ── Section 4: Hydra v2 full guide ────────────────────────────────────
		{
			id: "hydra-v2",
			icon: <Zap size={16} />,
			title: "Hydra v2 — מדריך מלא למנוע האורקסטרציה",
			tags: [
				"hydra",
				"langgraph",
				"bayesian",
				"provider",
				"codex",
				"kimi",
				"gemini",
				"minimax",
				"checkpoint",
				"watcher",
				"sqlite",
			],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-4">
					<p>
						Hydra v2 הוא מנוע אורקסטרציה מבוסס{" "}
						<strong className="text-[var(--color-text-primary)]">
							LangGraph StateGraph
						</strong>{" "}
						שמנהל dispatching של משימות ל-4 ספקי AI, עם routing בייסיאני אוטומטי
						ו-crash recovery מלא.
					</p>

					<SectionHeading>4 ספקי AI</SectionHeading>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
						{[
							{
								name: "Codex",
								model: "gpt-5.4",
								ctx: "1M",
								color: "blue" as const,
								strength: "אבטחה, refactor",
							},
							{
								name: "Kimi",
								model: "Kimi k2",
								ctx: "128K",
								color: "purple" as const,
								strength: "UI/CSS, React",
							},
							{
								name: "Gemini",
								model: "3.1-pro",
								ctx: "2M",
								color: "green" as const,
								strength: "ניתוח גדול, 2M context",
							},
							{
								name: "MiniMax",
								model: "M2.7",
								ctx: "204K",
								color: "amber" as const,
								strength: "batch, 50 parallel",
							},
						].map((p) => (
							<div key={p.name} className="glass-card p-3 flex flex-col gap-1">
								<Badge color={p.color}>{p.name}</Badge>
								<p
									className="text-xs font-mono text-[var(--color-accent-cyan)] mt-1"
									dir="ltr"
								>
									{p.model}
								</p>
								<p className="text-xs text-[var(--color-text-muted)]">
									{p.ctx} context
								</p>
								<p className="text-xs text-[var(--color-text-secondary)]">
									{p.strength}
								</p>
							</div>
						))}
					</div>

					<SectionHeading>מחזור חיי משימה</SectionHeading>
					<div className="flex items-center gap-1.5 flex-wrap">
						{[
							{ label: "pending", color: "text-[var(--color-text-muted)]" },
							{ label: "→", color: "text-[var(--color-text-muted)]" },
							{ label: "plan", color: "text-[var(--color-accent-blue)]" },
							{ label: "→", color: "text-[var(--color-text-muted)]" },
							{ label: "decide", color: "text-[var(--color-accent-purple)]" },
							{ label: "→", color: "text-[var(--color-text-muted)]" },
							{ label: "execute", color: "text-[var(--color-accent-amber)]" },
							{ label: "→", color: "text-[var(--color-text-muted)]" },
							{ label: "verify", color: "text-[var(--color-accent-cyan)]" },
							{ label: "→", color: "text-[var(--color-text-muted)]" },
							{
								label: "verified ✓",
								color: "text-[var(--color-accent-green)]",
							},
						].map((step) => (
							<span
								key={step.label}
								className={cn("text-xs font-mono font-medium", step.color)}
							>
								{step.label}
							</span>
						))}
						<span className="text-xs text-[var(--color-text-muted)] ms-1">
							| failed ✗
						</span>
					</div>
					<BulletList
						items={[
							<>
								<strong>pending</strong> — קובץ .md בתיקיית{" "}
								<code className="font-mono text-xs">
									~/.claude/knowledge/handoffs/pending/
								</code>
							</>,
							<>
								<strong>plan</strong> — Hydra מנתח את קובץ ה-plan, מחלץ
								frontmatter
							</>,
							<>
								<strong>decide</strong> — Bayesian routing בוחר ספק לפי ניקוד
								היסטורי
							</>,
							<>
								<strong>execute</strong> — שולח ל-hydra-executor.sh, מגבלת 910
								שניות
							</>,
							<>
								<strong>verify</strong> — verify-execution.sh בודק תוצאה (120
								שניות)
							</>,
							<>
								<strong>verified/failed</strong> — מעדכן Bayesian scores ±0.15
							</>,
						]}
					/>

					<SectionHeading>Bayesian Routing</SectionHeading>
					<p>
						כל ספק מקבל ניקוד 0–1 המחושב לפי הצלחות/כשלונות היסטוריים עם Laplace
						smoothing. ספק חדש מתחיל ב-0.5. אחרי 5 הצלחות: ~0.857. הניקוד נשמר
						ב-{" "}
						<code
							className="font-mono text-xs text-[var(--color-accent-cyan)]"
							dir="ltr"
						>
							~/.claude/knowledge/handoffs/hydra-bayesian.json
						</code>
					</p>

					<SectionHeading>SQLite Checkpoints — Crash Recovery</SectionHeading>
					<p className="mb-2">
						כל node ב-LangGraph מוגן — אם Hydra קורסת, ניתן להמשיך מהנקודה
						האחרונה.
					</p>
					<CodeBlock>{`# המשך משימה שנפסקה
python3 ~/.claude/scripts/hydra-v2/run_hydra.py \\
  --resume --task-id <task_id> --sqlite`}</CodeBlock>

					<SectionHeading>פקודות Hydra v2</SectionHeading>
					<div className="space-y-2">
						<CodeBlock label="הפעל שירות (systemd)">{`systemctl --user start hydra-dispatch.service`}</CodeBlock>
						<CodeBlock label="עצור שירות">{`systemctl --user stop hydra-dispatch.service`}</CodeBlock>
						<CodeBlock label="בדיקת בריאות">{`python3 ~/.claude/scripts/hydra-v2/health_check.py --json`}</CodeBlock>
						<CodeBlock label="הרץ משימה ספציפית">{`python3 ~/.claude/scripts/hydra-v2/run_hydra.py \\
  --plan-path ~/.claude/knowledge/handoffs/pending/my-task.md \\
  --sqlite`}</CodeBlock>
						<CodeBlock label="הפעל Watcher (daemon mode)">{`python3 ~/.claude/scripts/hydra-v2/hydra_watcher.py \\
  --sqlite --max-concurrent 3`}</CodeBlock>
						<CodeBlock label="FastAPI (HTTP interface)">{`cd ~/.claude/scripts/hydra-v2
python3 fastapi_wrapper.py
# API זמין על http://localhost:8742`}</CodeBlock>
					</div>

					<SectionHeading>Watcher — ניהול תור משימות</SectionHeading>
					<BulletList
						items={[
							<>
								<code className="font-mono text-xs">pending/</code> — משימות
								ממתינות
							</>,
							<>
								<code className="font-mono text-xs">in-progress/</code> — משימות
								שרצות עכשיו (atomic rename)
							</>,
							<>
								<code className="font-mono text-xs">completed/</code> — משימות
								שהסתיימו בהצלחה
							</>,
							<>
								<code className="font-mono text-xs">failed/</code> — משימות
								שנכשלו
							</>,
							<>max-concurrent: ברירת מחדל 3, מקסימום חמור 8</>,
						]}
					/>

					<div className="mt-3 p-3 rounded-lg bg-[oklch(0.62_0.22_25_/_0.1)] border border-[oklch(0.62_0.22_25_/_0.2)]">
						<p className="text-xs text-[var(--color-accent-red)]">
							<strong>זהירות SIGTERM:</strong> תמיד{" "}
							<code className="font-mono">kill PID</code> (SIGTERM) — לא{" "}
							<code className="font-mono">kill -9 PID</code> (SIGKILL). SIGTERM
							שומר checkpoint. SIGKILL הורג את התהליך ומשאיר orphan subprocess.
						</p>
					</div>
				</div>
			),
		},

		// ── Section 5: Backend API endpoints ──────────────────────────────────
		{
			id: "api-endpoints",
			icon: <Globe size={16} />,
			title: "Backend API — כל ה-Endpoints",
			tags: ["api", "endpoints", "backend", "rest", "http"],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-3">
					<p>
						ה-Backend חושף 26 endpoints על{" "}
						<code
							className="font-mono text-xs text-[var(--color-accent-cyan)]"
							dir="ltr"
						>
							http://localhost:8743
						</code>
						. ה-Frontend מגיע אליהם דרך proxy ב-{" "}
						<code className="font-mono text-xs text-[var(--color-accent-cyan)]">
							/api/
						</code>
						.
					</p>

					<SectionHeading>GET — קריאת נתונים (20 endpoints)</SectionHeading>
					<div className="space-y-1">
						{[
							{
								path: "GET /api/overview",
								desc: "KPIs ראשיים — agents, tasks, success rate, uptime",
							},
							{
								path: "GET /api/agents",
								desc: "רשימת כל 45 הסוכנים עם קטגוריה ומטא-דטה",
							},
							{
								path: "GET /api/agents/{name}",
								desc: "פרטים מלאים על סוכן ספציפי",
							},
							{
								path: "GET /api/hydra/status",
								desc: "סטטוס Hydra watcher — פועל/כבוי, PID",
							},
							{
								path: "GET /api/hydra/tasks",
								desc: "כל המשימות — pending, in-progress, completed, failed",
							},
							{
								path: "GET /api/hydra/bayesian",
								desc: "ניקודי Bayesian לכל ספק AI",
							},
							{
								path: "GET /api/hydra/events",
								desc: "אירועי watcher — 50 האחרונים מ-JSONL",
							},
							{
								path: "GET /api/health",
								desc: "תוצאות 7 בדיקות בריאות — ok/fail + message",
							},
							{
								path: "GET /api/system",
								desc: "RAM, CPU, Disk, Swap, uptime, hostname",
							},
							{
								path: "GET /api/system/msi",
								desc: "מצב מכונת MSI דרך Tailscale SSH",
							},
							{
								path: "GET /api/system/mcp",
								desc: "רשימת MCP servers פועלים + RAM usage",
							},
							{
								path: "GET /api/system/orphans",
								desc: "orphan node.*mcp processes + PID + RAM",
							},
							{
								path: "GET /api/hooks",
								desc: "כל ה-hooks רשומים ב-settings.json",
							},
							{
								path: "GET /api/hooks/stats",
								desc: "סטטיסטיקות ביצוע — כמה פעמים רץ, blocked, avg time",
							},
							{
								path: "GET /api/metrics",
								desc: "סטטיסטיקות מצטברות מ-beads.jsonl ו-audit-patterns.jsonl",
							},
							{
								path: "GET /api/metrics/agents",
								desc: "top agents — ספירת dispatches ממוינת",
							},
							{
								path: "GET /api/metrics/providers",
								desc: "סטטיסטיקות לפי ספק — הצלחה/כשלון",
							},
							{
								path: "GET /api/metrics/projects",
								desc: "dispatches לפי פרויקט",
							},
							{
								path: "GET /api/logs/watcher",
								desc: "100 שורות אחרונות מ-hydra-watcher.jsonl",
							},
							{
								path: "GET /api/logs/structured",
								desc: "100 שורות אחרונות מ-hydra-structured.jsonl",
							},
						].map((ep) => (
							<div
								key={ep.path}
								className="flex items-start gap-3 py-1.5 border-b border-[var(--color-border)] last:border-0"
							>
								<code
									className="font-mono text-xs text-[var(--color-accent-cyan)] shrink-0 w-52"
									dir="ltr"
								>
									{ep.path}
								</code>
								<span className="text-xs text-[var(--color-text-secondary)]">
									{ep.desc}
								</span>
							</div>
						))}
					</div>

					<SectionHeading>POST — פעולות שליטה (6 endpoints)</SectionHeading>
					<div className="space-y-1">
						{[
							{
								path: "POST /api/health/run",
								desc: "הרץ health check מיידי — מחזיר תוצאות מעודכנות",
							},
							{
								path: "POST /api/hydra/start",
								desc: "הפעל systemctl --user start hydra-dispatch.service",
							},
							{
								path: "POST /api/hydra/stop",
								desc: "עצור systemctl --user stop hydra-dispatch.service",
							},
							{
								path: "POST /api/system/clean-orphans",
								desc: "pkill -f 'node.*mcp' — ניקוי orphan processes",
							},
							{
								path: "POST /api/system/backup-db",
								desc: "העתק hydra-state.db לקובץ .bak עם timestamp",
							},
							{
								path: "POST /api/system/sync-msi",
								desc: "הרץ claude-sync push לסינכרון עם MSI",
							},
						].map((ep) => (
							<div
								key={ep.path}
								className="flex items-start gap-3 py-1.5 border-b border-[var(--color-border)] last:border-0"
							>
								<code
									className="font-mono text-xs text-[var(--color-accent-amber)] shrink-0 w-52"
									dir="ltr"
								>
									{ep.path}
								</code>
								<span className="text-xs text-[var(--color-text-secondary)]">
									{ep.desc}
								</span>
							</div>
						))}
					</div>

					<div className="mt-3 p-3 rounded-lg bg-[oklch(0.65_0.18_250_/_0.1)] border border-[oklch(0.65_0.18_250_/_0.2)]">
						<p className="text-xs text-[var(--color-accent-blue)]">
							<strong>טיפ:</strong> ניתן לקרוא לכל endpoint ישירות דרך{" "}
							<code className="font-mono" dir="ltr">
								curl http://localhost:8743/api/overview
							</code>{" "}
							לניפוי שגיאות.
						</p>
					</div>
				</div>
			),
		},

		// ── Section 6: Terminal commands ───────────────────────────────────────
		{
			id: "terminal-commands",
			icon: <Terminal size={16} />,
			title: "פקודות Terminal חשובות",
			tags: ["terminal", "cli", "פקודות", "bash", "sync", "build", "scan"],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-4">
					<SectionHeading>סינכרון בין מכונות</SectionHeading>
					<CodeBlock label="שלח הגדרות מ-pop-os ל-MSI">{`claude-sync push`}</CodeBlock>
					<CodeBlock label="קבל הגדרות מ-MSI ל-pop-os">{`claude-sync pull`}</CodeBlock>

					<SectionHeading>ניהול זיכרון ו-Processes</SectionHeading>
					<CodeBlock label="נקה orphan MCP processes (מונע OOM)">{`clean-memory`}</CodeBlock>
					<CodeBlock label="ידנית — kill כל node.*mcp">{`pkill -f "node.*mcp" && pkill -f "node.*apex" && pkill -f "node.*context7"`}</CodeBlock>
					<CodeBlock label="בדוק כמה orphans יש">{`ps aux | grep "node.*mcp" | grep -v grep | wc -l`}</CodeBlock>

					<SectionHeading>Hydra v2</SectionHeading>
					<CodeBlock label="בדיקת בריאות מלאה (JSON output)">{`python3 ~/.claude/scripts/hydra-v2/health_check.py --json`}</CodeBlock>
					<CodeBlock label="הרץ משימה חדשה">{`python3 ~/.claude/scripts/hydra-v2/run_hydra.py \\
  --plan-path /path/to/task.md --sqlite`}</CodeBlock>
					<CodeBlock label="המשך משימה שנפסקה">{`python3 ~/.claude/scripts/hydra-v2/run_hydra.py \\
  --resume --task-id my-task-id --sqlite`}</CodeBlock>
					<CodeBlock label="בדוק ניקודי Bayesian">{`python3 ~/.claude/scripts/hydra-v2/score_persistence.py`}</CodeBlock>
					<CodeBlock label="עקוב אחרי log בזמן אמת">{`tail -f ~/.config/agents/logs/hydra-watcher.jsonl | python3 -m json.tool`}</CodeBlock>

					<SectionHeading>Dashboard</SectionHeading>
					<CodeBlock label="הפעל development server">{`cd ~/Desktop/hydra-dashboard && pnpm dev`}</CodeBlock>
					<CodeBlock label="בנה לפרודקשן">{`cd ~/Desktop/hydra-dashboard && pnpm build`}</CodeBlock>
					<CodeBlock label="TypeScript typecheck">{`pnpm typecheck`}</CodeBlock>

					<SectionHeading>אבטחה וסריקות</SectionHeading>
					<CodeBlock label="סרוק CVEs (HIGH/CRITICAL בלבד)">{`trivy fs . --severity HIGH,CRITICAL`}</CodeBlock>
					<CodeBlock label="סרוק OWASP patterns">{`semgrep scan . --config=auto`}</CodeBlock>
					<CodeBlock label="בדוק כיסוי TypeScript">{`type-coverage --at-least 90`}</CodeBlock>

					<SectionHeading>Hydra Watcher — ניהול תור</SectionHeading>
					<CodeBlock label="בדוק משימות תקועות (>25 דקות)">{`find ~/.claude/knowledge/handoffs/in-progress/ \\
  -name "*.md" -mmin +25`}</CodeBlock>
					<CodeBlock label="החזר משימות תקועות ל-pending">{`mv ~/.claude/knowledge/handoffs/in-progress/*.md \\
  ~/.claude/knowledge/handoffs/pending/`}</CodeBlock>
				</div>
			),
		},

		// ── Section 7: Architecture ────────────────────────────────────────────
		{
			id: "architecture",
			icon: <Layers size={16} />,
			title: "ארכיטקטורה — איך הכל מתחבר",
			tags: [
				"ארכיטקטורה",
				"flow",
				"lancedb",
				"sqlite",
				"langgraph",
				"sse",
				"proxy",
			],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-4">
					<SectionHeading>Flow מלא — משימה מקצה לקצה</SectionHeading>
					<div className="space-y-2">
						{[
							{
								step: "1",
								color: "blue" as const,
								title: "יצירת Plan",
								desc: (
									<>
										המשתמש יוצר קובץ .md עם frontmatter (id, priority, project,
										stage, role) ומניח אותו ב-{" "}
										<code className="font-mono text-xs">
											~/.claude/knowledge/handoffs/pending/
										</code>
									</>
								),
							},
							{
								step: "2",
								color: "purple" as const,
								title: "Watcher מגלה",
								desc: "hydra_watcher.py סורק את תיקיית pending/ כל שנייה. כשמוצא קובץ חדש — מבצע atomic rename ל-in-progress/ ומפעיל LangGraph graph.",
							},
							{
								step: "3",
								color: "amber" as const,
								title: "LangGraph Graph",
								desc: "StateGraph עם 5 nodes: initial_node → plan_node → decide_node → execute_node → verify_node. כל node checkpoint ב-SQLite.",
							},
							{
								step: "4",
								color: "cyan" as const,
								title: "Bayesian Routing",
								desc: "decide_node בוחר ספק לפי Beta distribution scores. ספק עם הציון הגבוה ביותר מקבל את המשימה (Codex/Kimi/Gemini/MiniMax).",
							},
							{
								step: "5",
								color: "green" as const,
								title: "Execution",
								desc: "hydra-executor.sh מריץ את הספק הנבחר. Timeout: 910 שניות. LanceDB מנגיש זיכרון קוגניטיבי לסוכן.",
							},
							{
								step: "6",
								color: "red" as const,
								title: "Verification",
								desc: "verify-execution.sh בודק את התוצאה (120 שניות). אם עבר — Bayesian score +0.15. אם נכשל — -0.15. מסמן completed/ או failed/.",
							},
						].map((item) => (
							<div key={item.step} className="flex items-start gap-3">
								<div
									className={cn(
										"flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-xs font-bold mt-0.5",
										{
											"bg-[oklch(0.65_0.18_250_/_0.2)] text-[var(--color-accent-blue)]":
												item.color === "blue",
											"bg-[oklch(0.62_0.2_290_/_0.2)] text-[var(--color-accent-purple)]":
												item.color === "purple",
											"bg-[oklch(0.78_0.16_75_/_0.2)] text-[var(--color-accent-amber)]":
												item.color === "amber",
											"bg-[oklch(0.75_0.14_200_/_0.2)] text-[var(--color-accent-cyan)]":
												item.color === "cyan",
											"bg-[oklch(0.72_0.19_155_/_0.2)] text-[var(--color-accent-green)]":
												item.color === "green",
											"bg-[oklch(0.62_0.22_25_/_0.2)] text-[var(--color-accent-red)]":
												item.color === "red",
										},
									)}
								>
									{item.step}
								</div>
								<div>
									<p className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">
										{item.title}
									</p>
									<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
										{item.desc}
									</p>
								</div>
							</div>
						))}
					</div>

					<SectionHeading>מסדי נתונים</SectionHeading>
					<div className="space-y-1">
						<InfoRow
							label="SQLite"
							value="~/.claude/knowledge/hydra-state.db — checkpoints LangGraph. WAL mode, 30s busy_timeout. Crash recovery."
						/>
						<InfoRow
							label="LanceDB"
							value="~/.claude/knowledge/lancedb_memory — זיכרון קוגניטיבי. encode/recall/forget עם Laplace scoring."
						/>
						<InfoRow
							label="hydra-bayesian.json"
							value="~/.claude/knowledge/handoffs/hydra-bayesian.json — ניקודי Bayesian לכל ספק. atomic write."
						/>
						<InfoRow
							label="beads.jsonl"
							value="~/.claude/knowledge/beads.jsonl — audit trail של כל פעולת Claude Code."
						/>
					</div>

					<SectionHeading>תקשורת Frontend ↔ Backend</SectionHeading>
					<BulletList
						items={[
							<>
								React Query (TanStack Query) — polling כל 5 שניות לנתונים
								שמשתנים
							</>,
							<>SSE (Server-Sent Events) — stream real-time לאירועי watcher</>,
							<>
								Vite proxy:{" "}
								<code className="font-mono text-xs">
									/api/ → localhost:8743
								</code>{" "}
								(מונע CORS)
							</>,
							<>
								Mutations (POST) — React Query{" "}
								<code className="font-mono text-xs">useMutation</code> לפעולות
								שליטה
							</>,
						]}
					/>

					<SectionHeading>Multi-Machine Setup</SectionHeading>
					<div className="space-y-1">
						<InfoRow
							label="pop-os"
							value="100.82.33.122 — מכונה ראשית, כל פרויקטי פיתוח"
							mono
						/>
						<InfoRow
							label="MSI"
							value="100.87.247.87 — מכונה שנייה, פרויקטים נפרדים"
							mono
						/>
						<InfoRow
							label="Tailscale"
							value="VPN mesh בין שתי המכונות — SSH ישיר ב-LAN-speed"
						/>
						<InfoRow
							label="claude-sync"
							value="סינכרון .claude/ configs בין המכונות — git-based"
						/>
					</div>
				</div>
			),
		},

		// ── Section 8: Troubleshooting ─────────────────────────────────────────
		{
			id: "troubleshooting",
			icon: <Wrench size={16} />,
			title: "פתרון בעיות נפוצות",
			tags: ["בעיות", "שגיאות", "debug", "troubleshoot", "לא עובד", "תקלות"],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-5">
					{[
						{
							problem: "Dashboard לא נטען — 'Failed to fetch'",
							color: "red" as const,
							solutions: [
								<>
									בדוק שה-Backend פועל:{" "}
									<code className="font-mono text-xs" dir="ltr">
										curl http://localhost:8743/api/overview
									</code>
								</>,
								<>
									אם Backend לא פועל:{" "}
									<code className="font-mono text-xs" dir="ltr">
										cd ~/.claude/scripts/hydra-v2 && python3 dashboard.py
									</code>
								</>,
								"בדוק שאין תהליך אחר שמשתמש בפורט 8743",
							],
						},
						{
							problem: "אין נתונים — הכל מציג '0' או ריק",
							color: "amber" as const,
							solutions: [
								<>
									בדוק proxy ב-vite.config.ts — חייב להפנות{" "}
									<code className="font-mono text-xs">/api/</code>{" "}
									ל-localhost:8743
								</>,
								<>
									בדוק console הדפדפן (F12) — האם יש שגיאות 404 על{" "}
									<code className="font-mono text-xs">/api/</code> endpoints?
								</>,
								"פתח Backend log ובדוק שאין Python exceptions",
							],
						},
						{
							problem: "MSI מציג 'Unreachable'",
							color: "amber" as const,
							solutions: [
								<>
									בדוק Tailscale:{" "}
									<code className="font-mono text-xs" dir="ltr">
										tailscale status
									</code>
								</>,
								<>
									פינג ל-MSI:{" "}
									<code className="font-mono text-xs" dir="ltr">
										ping 100.87.247.87
									</code>
								</>,
								<>
									SSH ידני:{" "}
									<code className="font-mono text-xs" dir="ltr">
										ssh nadavcohen@100.87.247.87
									</code>
								</>,
							],
						},
						{
							problem: "Health Check נכשל — SQLite DB שגיאה",
							color: "red" as const,
							solutions: [
								<>
									הרץ health check ידנית:{" "}
									<code className="font-mono text-xs" dir="ltr">
										python3 ~/.claude/scripts/hydra-v2/health_check.py --json
									</code>
								</>,
								<>
									אם DB פגום — גבה והמחק:{" "}
									<code className="font-mono text-xs" dir="ltr">
										cp hydra-state.db hydra-state.db.bak && rm hydra-state.db
									</code>
								</>,
								"הפעל מחדש Hydra עם InMemorySaver (ללא --sqlite) עד שה-DB יווצר מחדש",
							],
						},
						{
							problem: "RAM גבוה — 90%+ שימוש",
							color: "amber" as const,
							solutions: [
								<>
									נקה orphan processes:{" "}
									<code className="font-mono text-xs" dir="ltr">
										clean-memory
									</code>
								</>,
								<>או דרך Dashboard: דף שליטה → כפתור "נקה Orphans"</>,
								<>
									בדוק כמה orphans:{" "}
									<code className="font-mono text-xs" dir="ltr">
										ps aux | grep "node.*mcp" | grep -v grep | wc -l
									</code>
								</>,
							],
						},
						{
							problem: "Hydra משימה תקועה ב-in-progress",
							color: "amber" as const,
							solutions: [
								<>
									בדוק משימות ישנות:{" "}
									<code className="font-mono text-xs" dir="ltr">
										find ~/.claude/knowledge/handoffs/in-progress/ -name "*.md"
										-mmin +25
									</code>
								</>,
								<>
									החזר ל-pending:{" "}
									<code className="font-mono text-xs" dir="ltr">
										mv ~/.claude/knowledge/handoffs/in-progress/*.md
										~/.claude/knowledge/handoffs/pending/
									</code>
								</>,
								"הגדר זמן המתנה של 10 דקות לפני retry — ספק rate limit",
							],
						},
						{
							problem: "LanceDB שגיאה — 'recall failed'",
							color: "red" as const,
							solutions: [
								<>
									מחק ואפס:{" "}
									<code className="font-mono text-xs" dir="ltr">
										rm -rf ~/.claude/knowledge/lancedb_memory/
									</code>
								</>,
								"CognitiveMemory.__init__() ייצור את ה-table מחדש אוטומטית",
								<>
									הגר זיכרון ישן:{" "}
									<code className="font-mono text-xs" dir="ltr">
										python3 ~/.claude/scripts/hydra-v2/migrate_beads.py
									</code>
								</>,
							],
						},
					].map((item) => (
						<div key={item.problem}>
							<div
								className={cn(
									"flex items-start gap-2 mb-2",
									item.color === "red"
										? "text-[var(--color-accent-red)]"
										: "text-[var(--color-accent-amber)]",
								)}
							>
								<span className="text-sm">⚠</span>
								<span className="text-sm font-semibold">{item.problem}</span>
							</div>
							<BulletList items={item.solutions} />
						</div>
					))}
				</div>
			),
		},

		// ── Section 9: Glossary ────────────────────────────────────────────────
		{
			id: "glossary",
			icon: <BookOpen size={16} />,
			title: "מילון מונחים",
			tags: [
				"מילון",
				"מונחים",
				"הגדרות",
				"agent",
				"hook",
				"mcp",
				"bayesian",
				"langgraph",
				"sse",
				"rtl",
				"auap",
				"watcher",
				"checkpoint",
			],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
					<div className="space-y-0">
						{[
							{
								term: "Agent (סוכן)",
								def: "תהליך אוטונומי המסוגל לבצע משימות — לקרוא קבצים, לכתוב קוד, להריץ בדיקות. Hydra מנהל 45 סוכנים מוגדרים מראש ב-~/.codex/agents/ ו-~/.gemini/agents/.",
							},
							{
								term: "APEX",
								def: "Autonomous Programming EXecution — שם המערכת הכוללת: Claude Code + Hydra + hooks + agents + MCPs + CI/CD.",
							},
							{
								term: "AUAP (Agent Universal Action Protocol)",
								def: "פרוטוקול תדריך אחיד לכל הסוכנים. builder script יוצר prompt מובנה עם role, stage, project, task — מבטיח שכל סוכן מקבל הקשר מלא.",
							},
							{
								term: "Bayesian Routing",
								def: "מנגנון בחירת ספק AI לפי Beta Distribution. כל ספק מקבל ניקוד 0–1 המתעדכן אחרי כל משימה (+0.15 הצלחה, -0.15 כשלון). Laplace smoothing מונע ניקוד 0 לספק חדש.",
							},
							{
								term: "Checkpoint",
								def: "שמירת מצב LangGraph ב-SQLite לאחר כל node. מאפשר crash recovery — אם Hydra קורסת, ניתן להמשיך עם --resume --task-id מהנקודה האחרונה.",
							},
							{
								term: "Hook",
								def: "סקריפט bash/python שמופעל אוטומטית על ידי Claude Code לפי אירוע: PreToolUse (לפני כלי), PostToolUse (אחרי), Stop (בסיום), SessionStart (בהתחלה), UserPromptSubmit (לפי הודעת משתמש).",
							},
							{
								term: "LanceDB",
								def: "מסד נתונים וקטורי לזיכרון קוגניטיבי של Hydra. מאחסן memories עם scope, importance, ו-embedding. recall() מחזיר memories רלוונטיים לפי cosine similarity + recency + importance.",
							},
							{
								term: "LangGraph",
								def: "ספריית Python לבניית AI agents כ-State Machines. Hydra v2 משתמש ב-StateGraph עם 5 nodes. כל node מקבל את ה-HydraState ומחזיר state מעודכן.",
							},
							{
								term: "MCP (Model Context Protocol)",
								def: "פרוטוקול חיבור כלים ל-Claude Code — ממשק stdio בין Claude לשרת שמספק tools (github, supabase, playwright, context7, memory). כל MCP server מריץ node.js process.",
							},
							{
								term: "Orphan Process",
								def: "node.*mcp process שנשאר פעיל אחרי שהסוכן שהפעיל אותו מת. כל orphan צורך ~400MB RAM. clean-memory / pkill מנקה אותם.",
							},
							{
								term: "Provider (ספק)",
								def: "מודל AI שמבצע את המשימה: Codex (OpenAI gpt-5.4), Kimi (Moonshot k2), Gemini (Google 3.1-pro-preview), MiniMax (M2.7). לכל ספק חוזקות שונות.",
							},
							{
								term: "RTL (Right-to-Left)",
								def: "כיוון טקסט ימין-לשמאל. Dashboard זה בנוי RTL-first: direction: rtl בכל ה-HTML. Tailwind logical properties: ms-/me-/ps-/pe- (לא ml-/mr-/pl-/pr-).",
							},
							{
								term: "SSE (Server-Sent Events)",
								def: "פרוטוקול HTTP לstream של events מה-server ל-client בזמן אמת (חד-כיווני). Backend ב-dashboard.py משדר אירועי watcher חדשים דרך SSE endpoint.",
							},
							{
								term: "Watcher",
								def: "hydra_watcher.py — daemon שסורק את תיקיית pending/ ומפעיל LangGraph graph על כל משימה חדשה. ThreadPoolExecutor עם max 3 concurrent (מקסימום 8). Priority queue: urgent→high→normal→low.",
							},
						].map((item) => (
							<div
								key={item.term}
								className="py-3 border-b border-[var(--color-border)] last:border-0"
							>
								<p className="text-sm font-semibold text-[var(--color-accent-blue)] mb-1">
									{item.term}
								</p>
								<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
									{item.def}
								</p>
							</div>
						))}
					</div>
				</div>
			),
		},

		// ── Section 10: Security & best practices ──────────────────────────────
		{
			id: "security",
			icon: <Shield size={16} />,
			title: "אבטחה ופרקטיקות נכונות",
			tags: ["אבטחה", "security", "secrets", "env", "rls", "cve"],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-4">
					<SectionHeading>עקרונות בסיסיים</SectionHeading>
					<BulletList
						items={[
							<>
								<strong>אל תשמור secrets בקוד</strong> — כל API keys ב-
								<code className="font-mono text-xs">~/.secrets</code> (מחוץ
								ל-git)
							</>,
							<>
								<strong>אל תשתמש ב-kill -9</strong> על Hydra — תמיד{" "}
								<code className="font-mono text-xs">kill PID</code> (SIGTERM)
								לשמירת checkpoint
							</>,
							<>
								<strong>גבה DB לפני שינויים גדולים</strong> — דרך דף שליטה או{" "}
								<code className="font-mono text-xs">
									cp hydra-state.db hydra-state.db.$(date +%Y%m%d)
								</code>
							</>,
							<>
								<strong>אל תמחק hydra-bayesian.json</strong> — מכיל שבועות של
								calibration data בייסיאנית
							</>,
						]}
					/>

					<SectionHeading>סריקות CVE אוטומטיות</SectionHeading>
					<BulletList
						items={[
							<>
								Trivy סורק כל יום ראשון 3:00 AM — מגיש PR עם patches אוטומטיים
							</>,
							<>Semgrep סורק OWASP Top 10 ב-CI לפני כל PR</>,
							<>Renovate (GitHub App) — PR שבועי לעדכוני dependencies</>,
						]}
					/>

					<SectionHeading>Backend Dashboard — מה חשוף?</SectionHeading>
					<p className="text-xs text-[var(--color-accent-amber)] p-3 rounded-lg bg-[oklch(0.78_0.16_75_/_0.1)] border border-[oklch(0.78_0.16_75_/_0.2)]">
						<strong>שים לב:</strong> dashboard.py חושף מידע רגיש מקומית — נתיבי
						קבצים, ניקודי providers, מצב מערכת.{" "}
						<strong>לעולם אל תחשוף פורט 8743 לאינטרנט</strong>. הוא מיועד לגישה
						מקומית בלבד (localhost / Tailscale).
					</p>

					<SectionHeading>Hydra Task Security</SectionHeading>
					<BulletList
						items={[
							"Plan frontmatter מאומת — id ללא תווים מיוחדים, priority מ-4 ערכים מוגדרים",
							"Atomic file rename — מונע double-dispatch בין threads",
							"Executor timeout 910s — מונע tasks שרצים לנצח",
							"Bayesian score floor 0.0 — ספק שנכשל תמיד מקבל עדיפות נמוכה יותר",
						]}
					/>
				</div>
			),
		},

		// ── Section 11: Tips & shortcuts ──────────────────────────────────────
		{
			id: "tips",
			icon: <Code2 size={16} />,
			title: "טיפים, קיצורי דרך ו-Best Practices",
			tags: ["טיפים", "shortcuts", "best practices", "workflow"],
			content: (
				<div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-4">
					<SectionHeading>Workflow יעיל</SectionHeading>
					<BulletList
						items={[
							"פתח Dashboard כטאב קבוע בדפדפן — auto-refresh כל 5 שניות",
							"השתמש בשדה חיפוש בדף FAQ (מלמעלה) לגישה מהירה לתשובות",
							"לפני dispatch גדול — בדוק RAM בדף מערכת (כדאי להיות מתחת 70%)",
							"הרץ health check לפני batch tasks גדולים",
							"אחרי Kimi/Gemini batch — תמיד נקה orphans",
						]}
					/>

					<SectionHeading>Hydra Plan — Format נכון</SectionHeading>
					<CodeBlock label="template מינימלי לקובץ task.md">{`---
id: my-task-unique-id
priority: high
project: mexicani
stage: implement
role: implementer
---

# תיאור המשימה

מה צריך לעשות...`}</CodeBlock>

					<SectionHeading>MCP Profiles</SectionHeading>
					<p className="mb-2">משנה אילו MCP servers פועלים (שפוגע ב-RAM):</p>
					<div className="space-y-1">
						<InfoRow
							label="unified (ברירת מחדל)"
							value="context7 + github + playwright + supabase + claude-mem + browserstack"
						/>
						<InfoRow label="lean" value="context7 + github בלבד — RAM נמוך" />
						<InfoRow label="ui" value="מוסיף chrome-devtools לפיתוח UI" />
						<InfoRow label="flutter" value="dart + flutter tools" />
						<InfoRow label="minimal" value="שום MCP — עצמאי לחלוטין" />
					</div>
					<CodeBlock>{`mcp-toggle lean        # עבור ל-lean
mcp-toggle status      # בדוק מה פעיל`}</CodeBlock>

					<SectionHeading>Context Management</SectionHeading>
					<BulletList
						items={[
							<>
								<strong>/compact</strong> — דחס context (מנקה 40-60% tokens).
								הרץ לפני tasks כבדים
							</>,
							<>
								<strong>/clear</strong> — נקה context לחלוטין. הרץ בין tasks
								שונים
							</>,
							<>אחוז context: WARN=70% → AUTO-COMPACT=80% → BLOCK=88%</>,
						]}
					/>

					<SectionHeading>Auto-Research Pattern</SectionHeading>
					<BulletList
						items={[
							"לכל task לא טריוויאלי — dispatch 5+ research agents תחילה",
							"gap-check agent בסוף — מה החמצנו?",
							"brainstorm agent — רעיונות שלא חשבת עליהם",
							"SHARED_TASK_NOTES.md — bridge בין iterations",
						]}
					/>
				</div>
			),
		},
	];
}

// ── Accordion Item ────────────────────────────────────────────────────────────

function AccordionItem({
	section,
	isOpen,
	onToggle,
}: {
	section: FaqSection;
	isOpen: boolean;
	onToggle: () => void;
}) {
	return (
		<div
			className={cn(
				"glass-card overflow-hidden transition-colors duration-200",
				isOpen && "border-[var(--color-border-hover)]",
			)}
		>
			{/* Header button */}
			<button
				type="button"
				onClick={onToggle}
				aria-expanded={isOpen}
				className={cn(
					"w-full flex items-center gap-3 px-5 py-4",
					"text-start cursor-pointer min-h-14",
					"transition-colors duration-150",
					isOpen
						? "bg-[oklch(0.65_0.18_250_/_0.06)]"
						: "hover:bg-[var(--color-bg-tertiary)]",
				)}
			>
				{/* Icon */}
				<span
					className={cn(
						"flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
						"transition-colors duration-150",
						isOpen
							? "bg-[oklch(0.65_0.18_250_/_0.2)] text-[var(--color-accent-blue)]"
							: "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]",
					)}
					aria-hidden="true"
				>
					{section.icon}
				</span>

				{/* Title */}
				<span
					className={cn(
						"flex-1 text-sm font-semibold leading-snug",
						isOpen
							? "text-[var(--color-text-primary)]"
							: "text-[var(--color-text-secondary)]",
					)}
				>
					{section.title}
				</span>

				{/* Chevron */}
				<ChevronDown
					size={16}
					className={cn(
						"shrink-0 transition-transform duration-300",
						"text-[var(--color-text-muted)]",
						isOpen && "rotate-180",
					)}
					aria-hidden="true"
				/>
			</button>

			{/* Content */}
			{isOpen && (
				<div className="px-5 pb-5 pt-1 border-t border-[var(--color-border)]">
					{section.content}
				</div>
			)}
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function FaqPage() {
	const sections = useMemo(() => buildSections(), []);
	const [openSections, setOpenSections] = useState<Set<string>>(
		() => new Set(["what-is-apex"]),
	);
	const [searchQuery, setSearchQuery] = useState("");

	function toggleSection(id: string) {
		setOpenSections((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}

	function expandAll() {
		setOpenSections(new Set(sections.map((s) => s.id)));
	}

	function collapseAll() {
		setOpenSections(new Set());
	}

	// Filter sections by search query
	const filteredSections = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return sections;
		return sections.filter(
			(s) =>
				s.title.toLowerCase().includes(q) ||
				s.tags.some((tag) => tag.toLowerCase().includes(q)),
		);
	}, [sections, searchQuery]);

	// Auto-expand all matching sections when search is active
	const displayedSections = useMemo(() => {
		if (!searchQuery.trim()) return filteredSections;
		// When searching, show all matching sections as open
		return filteredSections;
	}, [filteredSections, searchQuery]);

	const getIsOpen = (id: string) => {
		if (searchQuery.trim()) return true; // expand all when searching
		return openSections.has(id);
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Page header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div className="flex items-center gap-3">
					<BookOpen
						size={20}
						className="text-[var(--color-accent-blue)]"
						aria-hidden="true"
					/>
					<div>
						<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
							מדריך APEX Command Center
						</h1>
						<p className="text-sm text-[var(--color-text-muted)]">
							תיעוד מלא — שאלות נפוצות, הסברים, פקודות ומדריכים
						</p>
					</div>
				</div>

				{/* Expand/collapse controls */}
				{!searchQuery.trim() && (
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={expandAll}
							className={cn(
								"text-xs px-3 py-1.5 rounded-lg min-h-8",
								"bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]",
								"hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]",
								"transition-colors duration-150 border border-[var(--color-border)]",
							)}
						>
							פתח הכל
						</button>
						<button
							type="button"
							onClick={collapseAll}
							className={cn(
								"text-xs px-3 py-1.5 rounded-lg min-h-8",
								"bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]",
								"hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]",
								"transition-colors duration-150 border border-[var(--color-border)]",
							)}
						>
							כווץ הכל
						</button>
					</div>
				)}
			</div>

			{/* Search bar */}
			<div className="relative">
				<Search
					size={15}
					className="absolute inset-e-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
					aria-hidden="true"
				/>
				<input
					type="search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="חפש בתוכן המדריך..."
					className={cn(
						"w-full rounded-lg px-4 pe-10 py-2.5 text-sm",
						"bg-[var(--color-bg-elevated)] border border-[var(--color-border)]",
						"text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
						"focus:outline-none focus:border-[var(--color-accent-blue)]",
						"focus:shadow-[0_0_0_2px_oklch(0.65_0.18_250_/_0.15)]",
						"transition-all duration-150",
					)}
					aria-label="חיפוש בתוכן המדריך"
				/>
			</div>

			{/* Section count / search state */}
			{searchQuery.trim() && (
				<p className="text-xs text-[var(--color-text-muted)] -mt-3">
					{displayedSections.length === 0
						? "לא נמצאו תוצאות"
						: `נמצאו ${displayedSections.length} סעיפים`}{" "}
					עבור "{searchQuery}"
				</p>
			)}

			{/* Empty search state */}
			{searchQuery.trim() && displayedSections.length === 0 && (
				<div className="glass-card p-12 text-center flex flex-col items-center gap-4">
					<HelpCircle
						size={40}
						className="text-[var(--color-text-muted)]"
						aria-hidden="true"
					/>
					<div>
						<p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">
							לא נמצאו תוצאות
						</p>
						<p className="text-xs text-[var(--color-text-muted)]">
							נסה מילות חיפוש אחרות — למשל: hydra, agent, terminal, bayesian
						</p>
					</div>
					<button
						type="button"
						onClick={() => setSearchQuery("")}
						className="text-xs text-[var(--color-accent-blue)] hover:underline"
					>
						נקה חיפוש
					</button>
				</div>
			)}

			{/* Accordion sections */}
			<div className="flex flex-col gap-3">
				{displayedSections.map((section) => (
					<AccordionItem
						key={section.id}
						section={section}
						isOpen={getIsOpen(section.id)}
						onToggle={() => toggleSection(section.id)}
					/>
				))}
			</div>

			{/* Footer note */}
			{!searchQuery.trim() && (
				<div className="glass-card p-4 flex items-start gap-3">
					<Cpu
						size={16}
						className="text-[var(--color-text-muted)] shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
						מדריך זה מתעדכן אוטומטית עם שינויים במערכת. לדיווח על בעיות או הצעות
						— פתח שיחה חדשה עם Claude Code ותאר את הבעיה.
					</p>
				</div>
			)}
		</div>
	);
}
