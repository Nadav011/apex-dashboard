import {
	Brain,
	ChevronDown,
	ChevronUp,
	Cpu,
	Database,
	GitBranch,
	Globe,
	HardDrive,
	Key,
	Layers,
	Lock,
	Monitor,
	Network,
	Server,
	Shield,
	Webhook,
	Zap,
} from "lucide-react";
import { useState } from "react";
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

// ── Topology Diagram ─────────────────────────────────────────────────────────

function MachineBox({
	name,
	ip,
	color,
	children,
	hardware,
}: {
	name: string;
	ip: string;
	color: string;
	children: React.ReactNode;
	hardware?: string;
}) {
	return (
		<div
			className="rounded-xl p-4 flex flex-col gap-3"
			style={{
				background: `oklch(from ${color} l c h / 0.06)`,
				border: `1.5px solid oklch(from ${color} l c h / 0.35)`,
				boxShadow: `0 0 20px oklch(from ${color} l c h / 0.08)`,
			}}
		>
			<div className="flex items-center gap-2">
				<div
					className="w-2.5 h-2.5 rounded-full animate-pulse-status shrink-0"
					style={{ background: color }}
				/>
				<span className="text-sm font-bold" style={{ color }} dir="ltr">
					{name}
				</span>
				<span
					className="text-xs text-[var(--color-text-muted)] font-mono"
					dir="ltr"
				>
					({ip})
				</span>
			</div>
			{hardware && (
				<div className="text-xs text-[var(--color-text-muted)]">{hardware}</div>
			)}
			<div className="flex flex-col gap-2">{children}</div>
		</div>
	);
}

function ServiceRow({
	icon,
	label,
	badge,
	color = "var(--color-accent-blue)",
	indent = 0,
}: {
	icon: React.ReactNode;
	label: string;
	badge?: string;
	color?: string;
	indent?: number;
}) {
	return (
		<div
			className="flex items-center gap-2"
			style={{ paddingInlineStart: `${indent * 16}px` }}
		>
			<span
				className="flex size-6 shrink-0 items-center justify-center rounded"
				style={{ color, background: `oklch(from ${color} l c h / 0.1)` }}
			>
				{icon}
			</span>
			<span className="text-xs text-[var(--color-text-secondary)] flex-1">
				{label}
			</span>
			{badge && (
				<span
					className="text-xs font-mono px-1.5 py-0.5 rounded"
					style={{
						color,
						background: `oklch(from ${color} l c h / 0.12)`,
					}}
					dir="ltr"
				>
					{badge}
				</span>
			)}
		</div>
	);
}

function ConnectorArrow({ label }: { label: string }) {
	return (
		<div className="flex flex-col items-center gap-1 py-2">
			<div className="w-px h-5 bg-[var(--color-border)]" />
			<div
				className="text-xs text-[var(--color-text-muted)] px-2 py-0.5 rounded-full"
				style={{ background: "var(--color-bg-elevated)" }}
			>
				{label}
			</div>
			<div className="w-px h-5 bg-[var(--color-border)]" />
			<div
				className="border-4 border-transparent"
				style={{ borderTopColor: "var(--color-border)" }}
			/>
		</div>
	);
}

function TopologyDiagram() {
	return (
		<div className="flex flex-col gap-0">
			<MachineBox
				name="pop-os"
				ip="100.82.33.122"
				color="oklch(0.65 0.18 250)"
				hardware="🖥 24 ליבות · 64GB RAM · RTX 5070 Ti · ZRAM 200GB · earlyoom פעיל · Pop!_OS"
			>
				<ServiceRow
					icon={<Zap size={12} />}
					label="Claude Code — Opus 4.6, 1M context"
					badge="MAIN"
					color="oklch(0.65 0.18 250)"
				/>
				<ServiceRow
					icon={<Cpu size={12} />}
					label="16 Sonnet subagents"
					badge="MAX_AGENTS=16"
					color="oklch(0.75 0.14 200)"
					indent={1}
				/>
				<ServiceRow
					icon={<GitBranch size={12} />}
					label="Hydra v2 — LangGraph orchestrator"
					badge="v2.0"
					color="oklch(0.72 0.19 155)"
					indent={1}
				/>
				<ServiceRow
					icon={<Monitor size={12} />}
					label="Codex (gpt-5.4, 1M ctx)"
					color="oklch(0.65 0.18 250)"
					indent={2}
				/>
				<ServiceRow
					icon={<Monitor size={12} />}
					label="Kimi (max_steps=200)"
					color="oklch(0.78 0.16 75)"
					indent={2}
				/>
				<ServiceRow
					icon={<Monitor size={12} />}
					label="Gemini (3.1-pro, 2M ctx, thinkingBudget=32768)"
					color="oklch(0.72 0.19 155)"
					indent={2}
				/>
				<ServiceRow
					icon={<Monitor size={12} />}
					label="MiniMax (M2.7, 204K ctx, 50 concurrent)"
					color="oklch(0.62 0.2 290)"
					indent={2}
				/>
				<ServiceRow
					icon={<Webhook size={12} />}
					label="78+ Hooks (PreToolUse, PostToolUse, Stop...)"
					badge="128 registered"
					color="oklch(0.62 0.22 25)"
					indent={1}
				/>
				<ServiceRow
					icon={<Layers size={12} />}
					label="79 Skills (OpenClaw)"
					badge="42 skills"
					color="oklch(0.62 0.2 290)"
					indent={1}
				/>
				<ServiceRow
					icon={<Network size={12} />}
					label="MCP Servers (unified profile — 6 active)"
					color="oklch(0.75 0.14 200)"
					indent={1}
				/>
				<ServiceRow
					icon={<Globe size={12} />}
					label="Dashboard — FastAPI :8743 + Vite :5173"
					color="oklch(0.78 0.16 75)"
					indent={1}
				/>
			</MachineBox>

			<ConnectorArrow label="Tailscale SSH (100.x.x.x)" />

			<MachineBox
				name="MSI"
				ip="100.87.247.87"
				color="oklch(0.72 0.19 155)"
				hardware="🖥 30GB RAM · Pop!_OS · ROLLUP_NATIVE_THREADS=0"
			>
				<ServiceRow
					icon={<Zap size={12} />}
					label="Claude Code + Codex + Gemini + Kimi"
					color="oklch(0.72 0.19 155)"
				/>
				<ServiceRow
					icon={<HardDrive size={12} />}
					label="7 פרויקטים ייחודיים ל-MSI (Z, shifts, brain, vibechat...)"
					color="oklch(0.78 0.16 75)"
					indent={1}
				/>
				<ServiceRow
					icon={<Cpu size={12} />}
					label="Flutter SDK (~/.flutter-sdk)"
					badge="3.41.2"
					color="oklch(0.75 0.14 200)"
					indent={1}
				/>
				<ServiceRow
					icon={<GitBranch size={12} />}
					label="Self-hosted CI runners"
					badge="5 runners"
					color="oklch(0.62 0.22 25)"
					indent={1}
				/>
				<ServiceRow
					icon={<Database size={12} />}
					label="Sync: claude-sync push/pull (rsync, bidirectional)"
					color="oklch(0.62 0.2 290)"
					indent={1}
				/>
			</MachineBox>
		</div>
	);
}

// ── Data Flow Diagram ────────────────────────────────────────────────────────

function FlowNode({
	label,
	sublabel,
	color,
	wide,
}: {
	label: string;
	sublabel?: string;
	color: string;
	wide?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center rounded-lg px-3 py-2 text-center shrink-0",
				wide ? "min-w-[120px]" : "min-w-[80px]",
			)}
			style={{
				background: `oklch(from ${color} l c h / 0.12)`,
				border: `1px solid oklch(from ${color} l c h / 0.4)`,
				color,
			}}
		>
			<span className="text-xs font-semibold leading-tight">{label}</span>
			{sublabel && (
				<span className="text-[10px] mt-0.5 opacity-75 leading-tight" dir="ltr">
					{sublabel}
				</span>
			)}
		</div>
	);
}

function FlowArrow({ label }: { label?: string }) {
	return (
		<div className="flex items-center gap-1 shrink-0">
			{label && (
				<span className="text-[10px] text-[var(--color-text-muted)]">
					{label}
				</span>
			)}
			<span className="text-[var(--color-text-muted)] text-sm">→</span>
		</div>
	);
}

function DataFlowDiagram() {
	return (
		<div className="flex flex-col gap-5 overflow-x-auto pb-2">
			{/* Row 1: Main request flow */}
			<div>
				<div className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
					זרימת בקשה ראשית
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					<FlowNode label="בקשת משתמש" color="oklch(0.75 0.14 200)" />
					<FlowArrow />
					<FlowNode
						label="Claude Code"
						sublabel="Opus 4.6"
						color="oklch(0.65 0.18 250)"
						wide
					/>
					<FlowArrow />
					<FlowNode
						label="PreToolUse"
						sublabel="Hook"
						color="oklch(0.62 0.22 25)"
					/>
					<FlowArrow />
					<FlowNode label="ביצוע כלי" color="oklch(0.72 0.19 155)" />
					<FlowArrow />
					<FlowNode
						label="PostToolUse"
						sublabel="Hook"
						color="oklch(0.62 0.22 25)"
					/>
					<FlowArrow />
					<FlowNode label="תגובה" color="oklch(0.72 0.19 155)" />
				</div>
			</div>

			{/* Row 2: Hydra flow */}
			<div>
				<div className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
					זרימת Hydra v2 (LangGraph)
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					<FlowNode
						label="Hydra v2"
						sublabel="dispatch"
						color="oklch(0.65 0.18 250)"
					/>
					<FlowArrow />
					<FlowNode
						label="decide_node"
						sublabel="Bayesian"
						color="oklch(0.62 0.2 290)"
					/>
					<FlowArrow />
					<FlowNode
						label="execute_node"
						sublabel="910s timeout"
						color="oklch(0.78 0.16 75)"
					/>
					<FlowArrow />
					<FlowNode
						label="verify_node"
						sublabel="120s gate"
						color="oklch(0.75 0.14 200)"
					/>
					<FlowArrow />
					<FlowNode label="END" color="oklch(0.72 0.19 155)" />
				</div>
			</div>

			{/* Row 3: Storage */}
			<div>
				<div className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
					שמירת נתונים
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{(
						[
							{
								label: "SQLite",
								sublabel: "checkpoint",
								color: "oklch(0.65 0.18 250)",
								desc: "מצב LangGraph בין הפעלות",
							},
							{
								label: "LanceDB",
								sublabel: "cognitive mem",
								color: "oklch(0.62 0.2 290)",
								desc: "זיכרון סמנטי + דירוג קוגניטיבי",
							},
							{
								label: "beads.jsonl",
								sublabel: "knowledge",
								color: "oklch(0.72 0.19 155)",
								desc: "לכידת ידע אוטומטית",
							},
							{
								label: "hydra-bayesian.json",
								sublabel: "scores",
								color: "oklch(0.78 0.16 75)",
								desc: "ניקוד בייסיאני לספקים",
							},
						] as const
					).map((item) => (
						<div
							key={item.label}
							className="rounded-lg p-3"
							style={{
								background: `oklch(from ${item.color} l c h / 0.08)`,
								border: `1px solid oklch(from ${item.color} l c h / 0.3)`,
							}}
						>
							<div
								className="text-xs font-semibold font-mono mb-1"
								style={{ color: item.color }}
								dir="ltr"
							>
								{item.label}
							</div>
							<div className="text-[10px] text-[var(--color-text-muted)]">
								{item.desc}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ── Security Layers ──────────────────────────────────────────────────────────

const SECURITY_LAYERS = [
	{
		num: 1,
		label: "הגבלת קצב",
		desc: "@upstash/ratelimit — מניעת DDoS ועומס יתר",
		color: "oklch(0.62 0.22 25)",
		icon: <Shield size={14} />,
	},
	{
		num: 2,
		label: "וולידציה",
		desc: "Zod schema — אפס any, אפס cast ללא בדיקה",
		color: "oklch(0.78 0.16 75)",
		icon: <Key size={14} />,
	},
	{
		num: 3,
		label: "בידוד Prompt",
		desc: "system prompt סטטי — אין נתוני משתמש בהקשר",
		color: "oklch(0.75 0.14 200)",
		icon: <Lock size={14} />,
	},
	{
		num: 4,
		label: "קריאת LLM",
		desc: "maxSteps=10, token budget, temperature ≤ 0.7",
		color: "oklch(0.65 0.18 250)",
		icon: <Brain size={14} />,
	},
	{
		num: 5,
		label: "סינון פלט",
		desc: "סינון PII, חסימת dynamic code, HTML encoding",
		color: "oklch(0.62 0.2 290)",
		icon: <Shield size={14} />,
	},
	{
		num: 6,
		label: "ניטור",
		desc: "beads.jsonl audit trail + Sentry + behavioral anomaly detection",
		color: "oklch(0.72 0.19 155)",
		icon: <Monitor size={14} />,
	},
] as const;

function SecurityLayers() {
	return (
		<div className="flex flex-col gap-4">
			{/* Visual pipeline */}
			<div className="flex items-stretch gap-0 overflow-x-auto pb-2">
				{SECURITY_LAYERS.map((layer, idx) => (
					<div key={layer.num} className="flex items-stretch shrink-0">
						<div
							className="flex flex-col items-center justify-center px-3 py-3 rounded-lg text-center"
							style={{
								background: `oklch(from ${layer.color} l c h / 0.1)`,
								border: `1px solid oklch(from ${layer.color} l c h / 0.35)`,
								minWidth: "90px",
							}}
						>
							<span style={{ color: layer.color }}>{layer.icon}</span>
							<span
								className="text-[10px] font-bold mt-1 leading-tight"
								style={{ color: layer.color }}
							>
								{layer.label}
							</span>
						</div>
						{idx < SECURITY_LAYERS.length - 1 && (
							<div className="flex items-center px-1 text-[var(--color-text-muted)] text-xs shrink-0">
								→
							</div>
						)}
					</div>
				))}
			</div>

			{/* Detail cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{SECURITY_LAYERS.map((layer) => (
					<div
						key={layer.num}
						className="rounded-lg p-3 flex gap-3"
						style={{
							background: `oklch(from ${layer.color} l c h / 0.06)`,
							border: `1px solid oklch(from ${layer.color} l c h / 0.25)`,
						}}
					>
						<div
							className="flex size-7 shrink-0 items-center justify-center rounded"
							style={{
								background: `oklch(from ${layer.color} l c h / 0.15)`,
								color: layer.color,
							}}
						>
							{layer.icon}
						</div>
						<div className="min-w-0">
							<div
								className="text-xs font-semibold"
								style={{ color: layer.color }}
							>
								{layer.num}. {layer.label}
							</div>
							<div className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight">
								{layer.desc}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ── Hooks System ─────────────────────────────────────────────────────────────

const HOOK_TYPES = [
	{
		event: "SessionStart",
		count: 8,
		color: "oklch(0.72 0.19 155)",
		desc: "רץ בתחילת כל סשן — ממלא CURRENT_TASK.md, מזריק context",
		examples: ["session-create-task-file.sh", "capture-user-request.sh"],
	},
	{
		event: "PreToolUse",
		count: 19,
		color: "oklch(0.62 0.22 25)",
		desc: "חוסם/משנה קריאות כלים לפני ביצוע — בדיקות אבטחה, prerequisites",
		examples: [
			"prerequisite-check.sh",
			"dispatch-command-guard.sh",
			"auto-tmux-dev.sh",
		],
	},
	{
		event: "PostToolUse",
		count: 15,
		color: "oklch(0.78 0.16 75)",
		desc: "רץ אחרי השלמת כלי — format, typecheck, knowledge capture",
		examples: [
			"post-edit-format.sh",
			"post-edit-typecheck.sh",
			"knowledge-capture.sh",
		],
	},
	{
		event: "UserPromptSubmit",
		count: 10,
		color: "oklch(0.75 0.14 200)",
		desc: "מעבד קלט משתמש — RTL check, anti-sycophancy, לוגים",
		examples: ["capture-user-request.sh", "correction-detector.sh"],
	},
	{
		event: "Stop",
		count: 11,
		color: "oklch(0.62 0.2 290)",
		desc: "רץ לפני סיום סשן — בדיקת השלמה, בדיקת לוגים",
		examples: ["anti-premature-completion.sh", "check-console-log.sh"],
	},
	{
		event: "PostCompact",
		count: 3,
		color: "oklch(0.65 0.18 250)",
		desc: "רץ אחרי דחיסת context — מחדיר מחדש את הדרישות המקוריות",
		examples: ["post-compact-reinject.sh"],
	},
] as const;

function HooksSystem() {
	return (
		<div className="flex flex-col gap-4">
			{/* Summary badges */}
			<div className="flex flex-wrap gap-2">
				{HOOK_TYPES.map((h) => (
					<div
						key={h.event}
						className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
						style={{
							background: `oklch(from ${h.color} l c h / 0.1)`,
							border: `1px solid oklch(from ${h.color} l c h / 0.35)`,
						}}
					>
						<span
							className="text-xs font-bold tabular-nums"
							style={{ color: h.color }}
							dir="ltr"
						>
							{h.count}
						</span>
						<span
							className="text-[10px] font-mono"
							style={{ color: h.color }}
							dir="ltr"
						>
							{h.event}
						</span>
					</div>
				))}
				<div
					className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
					style={{
						background: "oklch(0.22 0.02 260)",
						border: "1px solid var(--color-border)",
					}}
				>
					<span
						className="text-xs font-bold text-[var(--color-text-secondary)]"
						dir="ltr"
					>
						128
					</span>
					<span className="text-[10px] text-[var(--color-text-muted)]">
						רשומים (שתי מכונות)
					</span>
				</div>
			</div>

			{/* Detail cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{HOOK_TYPES.map((h) => (
					<div
						key={h.event}
						className="rounded-lg p-3"
						style={{
							background: `oklch(from ${h.color} l c h / 0.06)`,
							border: `1px solid oklch(from ${h.color} l c h / 0.25)`,
						}}
					>
						<div className="flex items-center gap-2 mb-1.5">
							<span
								className="text-xs font-bold font-mono"
								style={{ color: h.color }}
								dir="ltr"
							>
								{h.event}
							</span>
							<span
								className="text-[10px] font-bold px-1.5 rounded"
								style={{
									background: `oklch(from ${h.color} l c h / 0.2)`,
									color: h.color,
								}}
								dir="ltr"
							>
								×{h.count}
							</span>
						</div>
						<p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-2">
							{h.desc}
						</p>
						<div className="flex flex-wrap gap-1">
							{h.examples.map((ex) => (
								<span
									key={ex}
									className="text-[9px] font-mono px-1 py-0.5 rounded"
									style={{
										background: "var(--color-bg-elevated)",
										color: "var(--color-text-muted)",
									}}
									dir="ltr"
								>
									{ex}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ── Hydra Graph ──────────────────────────────────────────────────────────────

const GRAPH_NODES = [
	{
		id: "init",
		label: "init",
		desc: "אתחול מצב — טעינת Bayesian scores, ניסיון 0",
		color: "oklch(0.65 0.18 250)",
	},
	{
		id: "plan_node",
		label: "plan_node",
		desc: "קריאת קובץ plan, עיבוד frontmatter, הכנת context",
		color: "oklch(0.75 0.14 200)",
	},
	{
		id: "decide_node",
		label: "decide_node",
		desc: "בחירת ספק לפי Beta distribution — Codex/Kimi/Gemini/MiniMax",
		color: "oklch(0.62 0.2 290)",
	},
	{
		id: "execute_node",
		label: "execute_node",
		desc: "הרצת hydra-executor.sh — 910 שניות timeout, ניהול subprocess",
		color: "oklch(0.78 0.16 75)",
	},
	{
		id: "verify_node",
		label: "verify_node",
		desc: "בדיקת verify-execution.sh — 120 שניות, שמירת Bayesian scores",
		color: "oklch(0.72 0.19 155)",
	},
	{
		id: "END",
		label: "END",
		desc: "סיום — עדכון hydra-bayesian.json, log event",
		color: "oklch(0.72 0.19 155)",
	},
] as const;

function HydraGraph() {
	return (
		<div className="flex flex-col gap-5">
			{/* State machine pipeline */}
			<div className="overflow-x-auto pb-2">
				<div className="flex items-center gap-0 min-w-fit">
					{GRAPH_NODES.map((node, idx) => (
						<div key={node.id} className="flex items-center shrink-0">
							<div
								className="flex flex-col items-center justify-center rounded-lg px-3 py-2.5 text-center"
								style={{
									background: `oklch(from ${node.color} l c h / 0.12)`,
									border: `1.5px solid oklch(from ${node.color} l c h / 0.45)`,
									minWidth: "85px",
								}}
							>
								<span
									className="text-[10px] font-bold font-mono leading-tight"
									style={{ color: node.color }}
									dir="ltr"
								>
									{node.label}
								</span>
							</div>
							{idx < GRAPH_NODES.length - 1 && (
								<div className="flex items-center px-1 text-[var(--color-text-muted)] text-xs shrink-0">
									→
								</div>
							)}
						</div>
					))}
				</div>

				{/* Retry annotation */}
				<div
					className="mt-2 flex items-center gap-2 rounded-lg px-3 py-1.5 w-fit"
					style={{ background: "var(--color-bg-elevated)" }}
				>
					<span
						className="text-[10px] text-[var(--color-accent-amber)]"
						dir="ltr"
					>
						↻ retry (max 3): execute_node → decide_node (ניסיון חוזר עם ספק אחר)
					</span>
				</div>
			</div>

			{/* Node descriptions */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{GRAPH_NODES.map((node) => (
					<div
						key={node.id}
						className="rounded-lg p-3"
						style={{
							background: `oklch(from ${node.color} l c h / 0.06)`,
							border: `1px solid oklch(from ${node.color} l c h / 0.25)`,
						}}
					>
						<div
							className="text-xs font-bold font-mono mb-1"
							style={{ color: node.color }}
							dir="ltr"
						>
							{node.label}
						</div>
						<div className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
							{node.desc}
						</div>
					</div>
				))}
			</div>

			{/* Storage note */}
			<div
				className="rounded-lg p-3 flex gap-3 items-start"
				style={{
					background: "var(--color-bg-elevated)",
					border: "1px solid var(--color-border)",
				}}
			>
				<Database
					size={14}
					className="text-[var(--color-accent-blue)] shrink-0 mt-0.5"
				/>
				<div>
					<div className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">
						שכבת אחסון
					</div>
					<div className="flex flex-wrap gap-4 text-[11px] text-[var(--color-text-secondary)]">
						<span>
							<span
								className="text-[var(--color-accent-blue)] font-mono"
								dir="ltr"
							>
								SqliteSaver
							</span>{" "}
							— checkpoint בין ה-nodes (WAL mode, 30s busy_timeout)
						</span>
						<span>
							<span
								className="text-[var(--color-accent-purple)] font-mono"
								dir="ltr"
							>
								hydra-state.db
							</span>{" "}
							— resume עם --resume --task-id לאחר SIGTERM
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Memory System ────────────────────────────────────────────────────────────

const MEMORY_STORES = [
	{
		name: "beads.jsonl",
		icon: <Database size={14} />,
		color: "oklch(0.65 0.18 250)",
		type: "JSONL",
		path: "~/.claude/knowledge/beads.jsonl",
		desc: "לכידת ידע אוטומטית מכל סשן. כולל: קוד שנלמד, תיקונים, patterns. גדל אוטומטית.",
		access: "append-only",
	},
	{
		name: "LanceDB",
		icon: <Brain size={14} />,
		color: "oklch(0.62 0.2 290)",
		type: "Vector DB",
		path: "~/.claude/knowledge/lancedb_memory",
		desc: "זיכרון קוגניטיבי — חיפוש סמנטי + דירוג: (sim×0.5) + (recency×0.3) + (importance×0.2). forget() לניקוי.",
		access: "recall() API",
	},
	{
		name: "hydra-state.db",
		icon: <HardDrive size={14} />,
		color: "oklch(0.78 0.16 75)",
		type: "SQLite",
		path: "~/.claude/knowledge/hydra-state.db",
		desc: "LangGraph checkpoints — מצב בין nodes. resume אחרי SIGTERM. WAL mode + busy_timeout=30s.",
		access: "SqliteSaver",
	},
	{
		name: "MEMORY.md",
		icon: <Layers size={14} />,
		color: "oklch(0.72 0.19 155)",
		type: "Markdown",
		path: "~/.claude/projects/.../memory/MEMORY.md",
		desc: "context cross-session — עד 120 שורות. מכיל links לקבצי זיכרון נוספים לפי נושא.",
		access: "load at session start",
	},
	{
		name: "auto-learned-rules.md",
		icon: <Key size={14} />,
		color: "oklch(0.75 0.14 200)",
		type: "Markdown",
		path: "~/.claude/rules/quality/auto-learned-rules.md",
		desc: "חוקים שנלמדו אוטומטית מניסיון (correction-detector.sh). confidence scoring: 0.3 → 0.9.",
		access: "always-loaded",
	},
	{
		name: "hydra-bayesian.json",
		icon: <GitBranch size={14} />,
		color: "oklch(0.62 0.22 25)",
		type: "JSON",
		path: "~/.claude/knowledge/handoffs/hydra-bayesian.json",
		desc: "ניקוד Beta distribution לכל ספק (Codex/Kimi/Gemini/MiniMax). Laplace smoothing. שמירה רק בסיום.",
		access: "score_persistence.py",
	},
] as const;

function MemorySystem() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
			{MEMORY_STORES.map((store) => (
				<div
					key={store.name}
					className="rounded-lg p-3"
					style={{
						background: `oklch(from ${store.color} l c h / 0.06)`,
						border: `1px solid oklch(from ${store.color} l c h / 0.3)`,
					}}
				>
					<div className="flex items-center gap-2 mb-2">
						<span
							className="flex size-7 shrink-0 items-center justify-center rounded"
							style={{
								background: `oklch(from ${store.color} l c h / 0.15)`,
								color: store.color,
							}}
						>
							{store.icon}
						</span>
						<div className="flex-1 min-w-0">
							<div
								className="text-xs font-bold font-mono"
								style={{ color: store.color }}
								dir="ltr"
							>
								{store.name}
							</div>
							<div
								className="text-[9px] text-[var(--color-text-muted)] font-mono truncate"
								dir="ltr"
							>
								{store.path}
							</div>
						</div>
						<span
							className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
							style={{
								background: `oklch(from ${store.color} l c h / 0.1)`,
								color: store.color,
							}}
						>
							{store.type}
						</span>
					</div>
					<p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-1.5">
						{store.desc}
					</p>
					<div
						className="text-[9px] font-mono px-1.5 py-0.5 rounded w-fit"
						style={{
							background: "var(--color-bg-elevated)",
							color: "var(--color-text-muted)",
						}}
						dir="ltr"
					>
						access: {store.access}
					</div>
				</div>
			))}
		</div>
	);
}

// ── MCP Servers ──────────────────────────────────────────────────────────────

const MCP_SERVERS = [
	{
		name: "context7",
		icon: <Globe size={14} />,
		color: "oklch(0.65 0.18 250)",
		desc: "תיעוד ספריות בזמן אמת — React, Next.js, Tailwind, Supabase, Flutter",
		tools: "resolve-library-id, get-library-docs",
	},
	{
		name: "github",
		icon: <GitBranch size={14} />,
		color: "oklch(0.72 0.19 155)",
		desc: "פעולות repo — יצירת PR, push files, ניהול issues, בדיקת CI",
		tools: "create_pull_request, push_files, list_issues",
	},
	{
		name: "playwright",
		icon: <Monitor size={14} />,
		color: "oklch(0.75 0.14 200)",
		desc: "בדיקות browser E2E — screenshot, click, navigation, accessibility",
		tools: "browser_navigate, browser_snapshot, browser_screenshot",
	},
	{
		name: "supabase",
		icon: <Database size={14} />,
		color: "oklch(0.78 0.16 75)",
		desc: "פעולות DB — execute_sql, ניהול migrations, RLS policies",
		tools: "execute_sql, list_tables, apply_migration",
	},
	{
		name: "claude-mem",
		icon: <Brain size={14} />,
		color: "oklch(0.62 0.2 290)",
		desc: "חיפוש זיכרון — search ב-beads.jsonl, smart_search, timeline",
		tools: "search, smart_search, get_observations, timeline",
	},
	{
		name: "browserstack",
		icon: <Cpu size={14} />,
		color: "oklch(0.62 0.22 25)",
		desc: "בדיקות cross-browser — iOS, Android, desktop — BrowserStack Automate",
		tools: "run_tests, take_screenshot, run_live_session",
	},
	{
		name: "minimax",
		icon: <Zap size={14} />,
		color: "oklch(0.75 0.14 200)",
		desc: "יצירת תוכן AI — text_to_audio, generate_video, voice_clone",
		tools: "text_to_audio, music_generation, generate_video",
	},
] as const;

function McpServers() {
	return (
		<div className="flex flex-col gap-4">
			{/* Profile indicator */}
			<div
				className="flex items-center gap-2 rounded-lg px-3 py-2 flex-wrap"
				style={{
					background: "var(--color-bg-elevated)",
					border: "1px solid var(--color-border)",
				}}
			>
				<div className="w-2 h-2 rounded-full bg-[var(--color-accent-green)] animate-pulse-status" />
				<span className="text-xs text-[var(--color-text-secondary)]">
					פרופיל פעיל:{" "}
					<span className="font-mono text-[var(--color-accent-blue)]" dir="ltr">
						unified
					</span>{" "}
					— 7 שרתים פעילים
				</span>
				<span
					className="text-[10px] text-[var(--color-text-muted)] ms-auto"
					dir="ltr"
				>
					mcp-toggle unified|lean|ui|flutter|minimal
				</span>
			</div>

			{/* Server cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{MCP_SERVERS.map((server) => (
					<div
						key={server.name}
						className="rounded-lg p-3"
						style={{
							background: `oklch(from ${server.color} l c h / 0.06)`,
							border: `1px solid oklch(from ${server.color} l c h / 0.25)`,
						}}
					>
						<div className="flex items-center gap-2 mb-2">
							<span
								className="flex size-7 shrink-0 items-center justify-center rounded"
								style={{
									background: `oklch(from ${server.color} l c h / 0.15)`,
									color: server.color,
								}}
							>
								{server.icon}
							</span>
							<div className="flex-1 min-w-0">
								<div
									className="text-xs font-bold font-mono"
									style={{ color: server.color }}
									dir="ltr"
								>
									{server.name}
								</div>
							</div>
							<div
								className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full"
								style={{
									background: "oklch(0.72 0.19 155 / 0.12)",
									color: "oklch(0.72 0.19 155)",
								}}
							>
								<div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)]" />
								פעיל
							</div>
						</div>
						<p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed mb-1.5">
							{server.desc}
						</p>
						<div
							className="text-[9px] font-mono px-1.5 py-0.5 rounded"
							style={{
								background: "var(--color-bg-elevated)",
								color: "var(--color-text-muted)",
							}}
							dir="ltr"
						>
							{server.tools}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ── Quick Nav ────────────────────────────────────────────────────────────────

const SECTIONS = [
	{ id: "topology", label: "טופולוגיה" },
	{ id: "dataflow", label: "זרימת נתונים" },
	{ id: "security", label: "אבטחה" },
	{ id: "hooks", label: "Hooks" },
	{ id: "hydra-graph", label: "Hydra v2" },
	{ id: "memory", label: "זיכרון" },
	{ id: "mcp", label: "MCP" },
] as const;

function QuickNav() {
	return (
		<div className="flex flex-wrap gap-2">
			{SECTIONS.map((s) => (
				<a
					key={s.id}
					href={`#${s.id}`}
					className="text-xs px-3 py-1.5 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150"
					style={{
						background: "var(--color-bg-elevated)",
						border: "1px solid var(--color-border)",
					}}
				>
					{s.label}
				</a>
			))}
		</div>
	);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function ArchitecturePage() {
	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Network
					size={20}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						ארכיטקטורה וטופולוגיה
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						מבנה המערכת · חיבורים · זרימת נתונים · כל הרכיבים
					</p>
				</div>
			</div>

			{/* Quick navigation */}
			<QuickNav />

			{/* Section 1: System Topology */}
			<AccordionSection
				id="topology"
				title="טופולוגיית המערכת"
				subtitle="מכונות, חיבורים, ושירותים פעילים"
				icon={<Server size={16} />}
				defaultOpen
				accentColor="oklch(0.65 0.18 250)"
			>
				<TopologyDiagram />
			</AccordionSection>

			{/* Section 2: Data Flow */}
			<AccordionSection
				id="dataflow"
				title="זרימת נתונים"
				subtitle="מבקשת המשתמש ועד לאחסון — כל הצמתים"
				icon={<GitBranch size={16} />}
				accentColor="oklch(0.75 0.14 200)"
			>
				<DataFlowDiagram />
			</AccordionSection>

			{/* Section 3: Security Layers */}
			<AccordionSection
				id="security"
				title="שכבות האבטחה"
				subtitle="6 שכבות הגנה — Defense-in-Depth"
				icon={<Shield size={16} />}
				accentColor="oklch(0.62 0.22 25)"
			>
				<SecurityLayers />
			</AccordionSection>

			{/* Section 4: Hooks System */}
			<AccordionSection
				id="hooks"
				title="מערכת ה-Hooks"
				subtitle="57 קבצי hook, 128 רשומים — אכיפה דטרמיניסטית"
				icon={<Webhook size={16} />}
				accentColor="oklch(0.78 0.16 75)"
			>
				<HooksSystem />
			</AccordionSection>

			{/* Section 5: Hydra v2 Graph */}
			<AccordionSection
				id="hydra-graph"
				title="Hydra v2 — גרף LangGraph"
				subtitle="State machine · SqliteSaver · Bayesian routing"
				icon={<Zap size={16} />}
				accentColor="oklch(0.72 0.19 155)"
			>
				<HydraGraph />
			</AccordionSection>

			{/* Section 6: Memory System */}
			<AccordionSection
				id="memory"
				title="מערכת הזיכרון"
				subtitle="6 מאגרי נתונים — מ-JSONL ועד Vector DB"
				icon={<Brain size={16} />}
				accentColor="oklch(0.62 0.2 290)"
			>
				<MemorySystem />
			</AccordionSection>

			{/* Section 7: MCP Servers */}
			<AccordionSection
				id="mcp"
				title="שרתי MCP"
				subtitle="7 שרתים פעילים — unified profile"
				icon={<Network size={16} />}
				accentColor="oklch(0.75 0.14 200)"
			>
				<McpServers />
			</AccordionSection>

			{/* Footer note */}
			<div
				className="rounded-lg px-4 py-3 text-xs text-[var(--color-text-muted)]"
				style={{
					background: "var(--color-bg-elevated)",
					border: "1px solid var(--color-border)",
				}}
			>
				<span className="text-[var(--color-accent-blue)] font-semibold">
					APEX Command Center
				</span>{" "}
				— מצב מערכת נכון ל-2026-03-26. 78+ skills · 45 agents · 128 hooks ·
				pop-os + MSI via Tailscale.
			</div>
		</div>
	);
}
