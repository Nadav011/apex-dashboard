import {
	ArrowLeft,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	ClipboardList,
	Code2,
	Cog,
	FileText,
	Layers,
	ListChecks,
	Play,
	Rocket,
	Search,
	Settings2,
	Sparkles,
	Terminal,
	Users,
	Wrench,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

// ── Design tokens ─────────────────────────────────────────────────────────────

const C = {
	blue: "oklch(0.65 0.18 250)",
	green: "oklch(0.72 0.19 155)",
	amber: "oklch(0.78 0.16 75)",
	red: "oklch(0.62 0.22 25)",
	purple: "oklch(0.65 0.15 270)",
	cyan: "oklch(0.75 0.14 200)",
	pink: "oklch(0.68 0.18 320)",
	teal: "oklch(0.70 0.16 175)",
} as const;

// ── Sub-components ────────────────────────────────────────────────────────────

interface SectionHeadingProps {
	icon: React.ReactNode;
	title: string;
	subtitle?: string;
	accentColor?: string;
}

function SectionHeading({
	icon,
	title,
	subtitle,
	accentColor = C.blue,
}: SectionHeadingProps) {
	return (
		<div className="flex items-center gap-3 mb-4">
			<span
				className="flex size-9 shrink-0 items-center justify-center rounded-lg"
				style={{ background: `${accentColor}20`, color: accentColor }}
			>
				{icon}
			</span>
			<div>
				<h2 className="text-base font-semibold text-text-primary">{title}</h2>
				{subtitle && (
					<p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
				)}
			</div>
		</div>
	);
}

function Card({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"rounded-xl border border-border bg-bg-secondary p-4",
				className,
			)}
		>
			{children}
		</div>
	);
}

// ── Section 1: מה זה GSD? ─────────────────────────────────────────────────────

const HIERARCHY_ITEMS = [
	{
		icon: <Layers size={15} />,
		label: "Project",
		desc: "פרויקט שלם — אפליקציה, מוצר, שירות",
		color: C.blue,
	},
	{
		icon: <CheckCircle2 size={15} />,
		label: "Milestone",
		desc: "יעד גדול בתוך הפרויקט — v1.0, MVP, feature set",
		color: C.purple,
	},
	{
		icon: <ClipboardList size={15} />,
		label: "Phase",
		desc: "יחידת עבודה של ~15 דקות עם תוצאה ברורה",
		color: C.cyan,
	},
	{
		icon: <FileText size={15} />,
		label: "Plan",
		desc: "PLAN.md — צ׳קליסט צעדים אטומיים",
		color: C.teal,
	},
	{
		icon: <Play size={15} />,
		label: "Execute",
		desc: "ביצוע עם commit אטומי לכל צעד",
		color: C.green,
	},
	{
		icon: <CheckCircle2 size={15} />,
		label: "Verify",
		desc: "שלב אימות — UAT שיחתי, typecheck, tests",
		color: C.amber,
	},
];

const PRINCIPLES = [
	{
		text: "כל phase = ~15 דקות עבודה",
		icon: <Zap size={13} />,
		color: C.amber,
	},
	{ text: "Atomic commits per step", icon: <Code2 size={13} />, color: C.blue },
	{
		text: "Verification gates בין שלבים",
		icon: <CheckCircle2 size={13} />,
		color: C.green,
	},
	{
		text: "Research לפני Planning תמיד",
		icon: <Search size={13} />,
		color: C.purple,
	},
	{
		text: "Wave-based parallelization",
		icon: <Users size={13} />,
		color: C.cyan,
	},
	{
		text: "Conversational UAT לא silent",
		icon: <Terminal size={13} />,
		color: C.pink,
	},
];

function WhatIsGsd() {
	return (
		<Card>
			<SectionHeading
				icon={<Rocket size={16} />}
				title="מה זה GSD?"
				subtitle="Get Stuff Done — workflow מובנה לבניית פיצ׳רים"
				accentColor={C.purple}
			/>

			{/* Hierarchy */}
			<div className="mb-5">
				<p className="text-xs text-text-muted mb-3 font-medium uppercase tracking-wider">
					היררכיית העבודה
				</p>
				<div className="space-y-2">
					{HIERARCHY_ITEMS.map((item, idx) => (
						<div key={item.label} className="flex items-start gap-3">
							{/* connector line */}
							<div className="flex flex-col items-center shrink-0 mt-0.5">
								<span
									className="flex size-6 items-center justify-center rounded-md"
									style={{ background: `${item.color}20`, color: item.color }}
								>
									{item.icon}
								</span>
								{idx < HIERARCHY_ITEMS.length - 1 && (
									<div className="w-px h-3 bg-border mt-1" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<span
									className="text-xs font-semibold"
									style={{ color: item.color }}
								>
									{item.label}
								</span>
								<span className="text-xs text-text-muted ms-2">
									{item.desc}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Principles grid */}
			<div>
				<p className="text-xs text-text-muted mb-3 font-medium uppercase tracking-wider">
					עקרונות יסוד
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					{PRINCIPLES.map((p) => (
						<div
							key={p.text}
							className="flex items-center gap-2 rounded-lg border border-border bg-bg-tertiary px-3 py-2"
						>
							<span style={{ color: p.color }}>{p.icon}</span>
							<span className="text-xs text-text-secondary">{p.text}</span>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
}

// ── Section 2: Flow Diagram ───────────────────────────────────────────────────

const FLOW_STEPS = [
	{
		cmd: "/gsd:new-project",
		label: "אתחול",
		desc: "הגדרת context עמוק לפרויקט",
		color: C.blue,
		icon: <Layers size={14} />,
	},
	{
		cmd: "/gsd:new-milestone",
		label: "Milestone",
		desc: "פתיחת מחזור milestone חדש",
		color: C.purple,
		icon: <CheckCircle2 size={14} />,
	},
	{
		cmd: "/gsd:discuss-phase",
		label: "דיון",
		desc: "איסוף context לפני planning",
		color: C.cyan,
		icon: <Search size={14} />,
	},
	{
		cmd: "/gsd:plan-phase",
		label: "תכנון",
		desc: "יצירת PLAN.md מפורט",
		color: C.teal,
		icon: <FileText size={14} />,
	},
	{
		cmd: "/gsd:execute-phase",
		label: "ביצוע",
		desc: "ביצוע עם wave parallelization",
		color: C.green,
		icon: <Play size={14} />,
	},
	{
		cmd: "/gsd:verify-work",
		label: "אימות",
		desc: "UAT שיחתי + gates",
		color: C.amber,
		icon: <ListChecks size={14} />,
	},
];

function FlowDiagram() {
	return (
		<Card>
			<SectionHeading
				icon={<Zap size={16} />}
				title="תרשים זרימה"
				subtitle="המחזור המלא של GSD — משמאל לימין (LTR)"
				accentColor={C.cyan}
			/>

			{/* Desktop flow — horizontal */}
			<div className="hidden sm:flex items-stretch gap-0 overflow-x-auto pb-2">
				{FLOW_STEPS.map((step, idx) => (
					<div key={step.cmd} className="flex items-center shrink-0">
						{/* Step card */}
						<div
							className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl border min-w-[100px]"
							style={{
								borderColor: `${step.color}35`,
								background: `${step.color}10`,
							}}
						>
							<span
								className="flex size-8 items-center justify-center rounded-lg"
								style={{ background: `${step.color}20`, color: step.color }}
							>
								{step.icon}
							</span>
							<div className="text-center">
								<p
									className="text-[10px] font-bold"
									style={{ color: step.color }}
								>
									{step.label}
								</p>
								<p
									className="text-[9px] font-mono mt-0.5 opacity-70"
									style={{ color: step.color }}
								>
									{step.cmd.replace("/gsd:", "")}
								</p>
								<p className="text-[9px] text-text-muted mt-1 leading-tight max-w-[90px]">
									{step.desc}
								</p>
							</div>
						</div>

						{/* Arrow between steps */}
						{idx < FLOW_STEPS.length - 1 && (
							<div className="flex items-center px-1 shrink-0">
								<ArrowLeft size={14} className="text-text-muted rotate-180" />
							</div>
						)}
					</div>
				))}
			</div>

			{/* Mobile flow — vertical */}
			<div className="flex sm:hidden flex-col gap-0">
				{FLOW_STEPS.map((step, idx) => (
					<div key={step.cmd} className="flex items-start gap-3">
						<div className="flex flex-col items-center shrink-0">
							<span
								className="flex size-8 items-center justify-center rounded-lg mt-2"
								style={{ background: `${step.color}20`, color: step.color }}
							>
								{step.icon}
							</span>
							{idx < FLOW_STEPS.length - 1 && (
								<div className="w-px h-4 bg-border mt-1" />
							)}
						</div>
						<div className="flex-1 min-w-0 py-2">
							<p className="text-xs font-bold" style={{ color: step.color }}>
								{step.label}
							</p>
							<p className="text-[10px] font-mono text-text-muted">
								{step.cmd}
							</p>
							<p className="text-[10px] text-text-secondary mt-0.5">
								{step.desc}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Cycle note */}
			<div
				className="mt-4 rounded-lg border px-3 py-2 flex items-center gap-2"
				style={{ borderColor: `${C.amber}30`, background: `${C.amber}08` }}
			>
				<Zap size={13} style={{ color: C.amber }} className="shrink-0" />
				<p className="text-[11px] text-text-muted">
					<span className="font-semibold" style={{ color: C.amber }}>
						מחזור:
					</span>{" "}
					לאחר <code className="font-mono text-[10px]">verify-work</code> → חוזר
					ל-
					<code className="font-mono text-[10px]">discuss-phase</code> ל-phase
					הבאה, או ל-
					<code className="font-mono text-[10px]">new-milestone</code> אם הושלם
				</p>
			</div>
		</Card>
	);
}

// ── Section 3: פקודות GSD ─────────────────────────────────────────────────────

interface CommandDef {
	cmd: string;
	desc: string;
	detail: string;
	color: string;
	icon: React.ReactNode;
	args?: string;
}

const COMMANDS: CommandDef[] = [
	{
		cmd: "/gsd:new-project",
		desc: "Initialize project with deep context",
		detail:
			"יוצר context עמוק לפרויקט: מטרות, stack, constraints, architecture. נקודת הפתיחה לכל פרויקט GSD. שומר ב-~/.gsd/projects/.",
		color: C.blue,
		icon: <Layers size={15} />,
		args: "--name <name> --stack <stack>",
	},
	{
		cmd: "/gsd:new-milestone",
		desc: "Start new milestone cycle",
		detail:
			"פותח מחזור milestone חדש: מגדיר goals, success criteria, ורשימת phases. מייצר roadmap מלא עם prioritization.",
		color: C.purple,
		icon: <CheckCircle2 size={15} />,
		args: "--goal <goal>",
	},
	{
		cmd: "/gsd:discuss-phase",
		desc: "Gather context before planning",
		detail:
			"שלב research לפני planning. מנתח את ה-codebase, מוצא patterns, מזהה dependencies, מסכם findings ב-context file.",
		color: C.cyan,
		icon: <Search size={15} />,
		args: "--phase <name>",
	},
	{
		cmd: "/gsd:plan-phase",
		desc: "Create detailed plan (PLAN.md)",
		detail:
			"יוצר PLAN.md מפורט עם צעדים אטומיים ברי-commit. כל צעד: action, files, verification. נשמר בפרויקט.",
		color: C.teal,
		icon: <FileText size={15} />,
		args: "--depth <n>",
	},
	{
		cmd: "/gsd:execute-phase",
		desc: "Execute with wave-based parallelization",
		detail:
			"מבצע את ה-PLAN.md: wave-based parallelization עם subagents. Atomic commit לכל צעד. Stop אוטומטי אם צעד נכשל.",
		color: C.green,
		icon: <Play size={15} />,
		args: "--waves <n> --auto",
	},
	{
		cmd: "/gsd:verify-work",
		desc: "Validate via conversational UAT",
		detail:
			"UAT שיחתי: typecheck, lint, tests, security scan. שואל שאלות ישירות על הfunctionality. לא silent — מדווח כל ממצא.",
		color: C.amber,
		icon: <ListChecks size={15} />,
	},
	{
		cmd: "/gsd:progress",
		desc: "Check progress, route to next action",
		detail:
			"בודק את מצב ה-milestone הנוכחי: מה הושלם, מה נשאר, מה ה-next action המומלצת. מפרט אחוזי השלמה.",
		color: C.blue,
		icon: <ClipboardList size={15} />,
	},
	{
		cmd: "/gsd:autonomous",
		desc: "Run all remaining phases auto",
		detail:
			"מריץ את כל ה-phases שנותרו ב-milestone בצורה אוטומטית. לא ישאל שאלות — מניח decisions לפי context. לשימוש ב-overnight runs.",
		color: C.pink,
		icon: <Rocket size={15} />,
		args: "--from <phase>",
	},
	{
		cmd: "/gsd:debug",
		desc: "Systematic debugging",
		detail:
			"debugging שיטתי: scientific method — hypotheses, isolation, root cause analysis. לא guessing — evidence-based.",
		color: C.red,
		icon: <Wrench size={15} />,
		args: "--issue <desc>",
	},
	{
		cmd: "/gsd:stats",
		desc: "Project statistics",
		detail:
			"סטטיסטיקות פרויקט: phases completed, velocity, time per phase, commit frequency, test coverage trends.",
		color: C.purple,
		icon: <Sparkles size={15} />,
	},
	{
		cmd: "/gsd:quick",
		desc: "Quick task with GSD guarantees",
		detail:
			"task מהיר בלי workflow מלא — אבל עם כל ה-guarantees: typecheck, lint, commit. לתיקוני bugs קטנים ושינויי config.",
		color: C.green,
		icon: <Zap size={15} />,
		args: "--task <desc>",
	},
];

function CommandCard({ cmd }: { cmd: CommandDef }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div
			className="rounded-xl border overflow-hidden transition-all duration-200"
			style={{ borderColor: `${cmd.color}30` }}
		>
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className={cn(
					"w-full flex items-center gap-3 px-4 py-3 text-start",
					"hover:bg-bg-tertiary transition-colors duration-150 min-h-[52px]",
				)}
				style={{ background: `${cmd.color}08` }}
			>
				<span
					className="flex size-8 shrink-0 items-center justify-center rounded-lg"
					style={{ background: `${cmd.color}20`, color: cmd.color }}
				>
					{cmd.icon}
				</span>
				<div className="flex-1 min-w-0">
					<p
						className="text-xs font-mono font-bold"
						style={{ color: cmd.color }}
					>
						{cmd.cmd}
					</p>
					<p className="text-[11px] text-text-secondary mt-0.5 truncate">
						{cmd.desc}
					</p>
				</div>
				{expanded ? (
					<ChevronUp size={14} className="text-text-muted shrink-0" />
				) : (
					<ChevronDown size={14} className="text-text-muted shrink-0" />
				)}
			</button>

			{expanded && (
				<div className="px-4 pb-4 pt-2 border-t border-border bg-bg-secondary space-y-2">
					<p className="text-xs text-text-secondary leading-relaxed">
						{cmd.detail}
					</p>
					{cmd.args && (
						<div className="flex items-center gap-2">
							<span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
								args:
							</span>
							<code
								className="text-[10px] font-mono rounded px-1.5 py-0.5"
								style={{
									background: `${cmd.color}15`,
									color: cmd.color,
								}}
							>
								{cmd.args}
							</code>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function CommandsSection() {
	return (
		<Card>
			<SectionHeading
				icon={<Terminal size={16} />}
				title="פקודות GSD"
				subtitle="לחץ על כל פקודה לפרטים נוספים"
				accentColor={C.green}
			/>
			<div className="space-y-2">
				{COMMANDS.map((cmd) => (
					<CommandCard key={cmd.cmd} cmd={cmd} />
				))}
			</div>
		</Card>
	);
}

// ── Section 4: 11 GSD Agents ──────────────────────────────────────────────────

interface AgentDef {
	name: string;
	role: string;
	detail: string;
	color: string;
}

const GSD_AGENTS: AgentDef[] = [
	{
		name: "gsd-executor",
		role: "Executes with atomic commits",
		detail:
			"מבצע צעדים מתוך PLAN.md אחד אחד. Commit אטומי לכל צעד. מדווח status.",
		color: C.green,
	},
	{
		name: "gsd-planner",
		role: "Creates executable plans",
		detail:
			"יוצר PLAN.md עם צעדים ברי-ביצוע. מגדיר dependencies ו-verification per step.",
		color: C.blue,
	},
	{
		name: "gsd-verifier",
		role: "Verifies phase goal achievement",
		detail:
			"בודק שה-phase goal הושג: typecheck, tests, functional verification.",
		color: C.amber,
	},
	{
		name: "gsd-debugger",
		role: "Scientific method debugging",
		detail:
			"debugging evidence-based: hypotheses → isolation → root cause → fix.",
		color: C.red,
	},
	{
		name: "gsd-roadmapper",
		role: "Creates project roadmaps",
		detail: "יוצר roadmap מלא: milestones, phases, timelines, dependencies.",
		color: C.purple,
	},
	{
		name: "gsd-phase-researcher",
		role: "Researches before planning",
		detail: "מחקר ממוקד לפני phase: codebase analysis, patterns, API surface.",
		color: C.cyan,
	},
	{
		name: "gsd-project-researcher",
		role: "Researches domain ecosystem",
		detail:
			"מחקר רחב: domain knowledge, ecosystem, best practices, alternatives.",
		color: C.teal,
	},
	{
		name: "gsd-plan-checker",
		role: "Verifies plan quality",
		detail:
			"בודק PLAN.md: completeness, atomicity, clarity, missing edge cases.",
		color: C.pink,
	},
	{
		name: "gsd-integration-checker",
		role: "Cross-phase integration",
		detail:
			"בודק שפה לא שבורה בין phases: APIs, types, contracts, regressions.",
		color: C.blue,
	},
	{
		name: "gsd-codebase-mapper",
		role: "Structured analysis",
		detail: "ממפה את ה-codebase: structure, dependencies, complexity hotspots.",
		color: C.amber,
	},
	{
		name: "gsd-research-synthesizer",
		role: "Synthesizes research",
		detail: "מסכם findings ממספר מחקרים לdecision-ready summary.",
		color: C.purple,
	},
];

function AgentsSection() {
	return (
		<Card>
			<SectionHeading
				icon={<Users size={16} />}
				title="11 סוכני GSD"
				subtitle="סוכנים ייעודיים לכל שלב ב-workflow"
				accentColor={C.purple}
			/>

			{/* Desktop table */}
			<div className="hidden sm:block overflow-x-auto rounded-lg border border-border">
				<table className="w-full text-xs">
					<thead>
						<tr className="border-b border-border bg-bg-tertiary">
							<th className="text-start px-3 py-2.5 font-semibold text-text-secondary">
								Agent
							</th>
							<th className="text-start px-3 py-2.5 font-semibold text-text-secondary">
								תפקיד
							</th>
							<th className="text-start px-3 py-2.5 font-semibold text-text-secondary hidden md:table-cell">
								פירוט
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{GSD_AGENTS.map((agent) => (
							<tr
								key={agent.name}
								className="hover:bg-bg-tertiary transition-colors duration-100"
							>
								<td className="px-3 py-2.5 whitespace-nowrap">
									<code
										className="font-mono text-[10px] px-1.5 py-0.5 rounded"
										style={{
											background: `${agent.color}15`,
											color: agent.color,
										}}
									>
										{agent.name}
									</code>
								</td>
								<td className="px-3 py-2.5 text-text-secondary font-medium">
									{agent.role}
								</td>
								<td className="px-3 py-2.5 text-text-muted hidden md:table-cell leading-relaxed">
									{agent.detail}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile list */}
			<div className="sm:hidden space-y-2">
				{GSD_AGENTS.map((agent) => (
					<div
						key={agent.name}
						className="rounded-lg border border-border bg-bg-tertiary p-3"
					>
						<div className="flex items-center gap-2 mb-1">
							<span
								className="size-1.5 rounded-full shrink-0"
								style={{ background: agent.color }}
							/>
							<code
								className="text-[10px] font-mono font-bold"
								style={{ color: agent.color }}
							>
								{agent.name}
							</code>
						</div>
						<p className="text-[11px] font-semibold text-text-secondary">
							{agent.role}
						</p>
						<p className="text-[10px] text-text-muted mt-1 leading-relaxed">
							{agent.detail}
						</p>
					</div>
				))}
			</div>
		</Card>
	);
}

// ── Section 5: Configuration ──────────────────────────────────────────────────

const CONFIG_FIELDS = [
	{
		key: "model_profile",
		value: '"balanced"',
		desc: "balanced | quality | fast — איזון בין מהירות לאיכות",
		color: C.blue,
	},
	{
		key: "research",
		value: "true",
		desc: "הפעל שלב research לפני כל phase",
		color: C.green,
	},
	{
		key: "verifier",
		value: "true",
		desc: "הפעל gsd-verifier לאחר כל phase",
		color: C.amber,
	},
	{
		key: "max_depth",
		value: '"full"',
		desc: "עומק מקסימלי לכל שלב — never shallow",
		color: C.purple,
	},
	{
		key: "team_mode",
		value: "true",
		desc: "TEAM mode לעבודה לא-טריוויאלית",
		color: C.cyan,
	},
	{
		key: "atomic_commits",
		value: "true",
		desc: "commit אטומי לכל צעד ב-PLAN.md",
		color: C.teal,
	},
	{
		key: "wave_parallelism",
		value: "8",
		desc: "מספר subagents מקסימלי ב-wave",
		color: C.pink,
	},
];

function ConfigSection() {
	return (
		<Card>
			<SectionHeading
				icon={<Settings2 size={16} />}
				title="קונפיגורציה"
				subtitle="Global defaults ב-~/.gsd/defaults.json"
				accentColor={C.amber}
			/>

			{/* Config file path */}
			<div
				className="rounded-lg border px-3 py-2 mb-4 flex items-center gap-2"
				style={{ borderColor: `${C.amber}30`, background: `${C.amber}08` }}
			>
				<Cog size={13} style={{ color: C.amber }} className="shrink-0" />
				<code className="text-[11px] font-mono text-text-secondary">
					~/.gsd/defaults.json
				</code>
			</div>

			{/* Fields */}
			<div className="space-y-2">
				{CONFIG_FIELDS.map((field) => (
					<div
						key={field.key}
						className="flex items-start gap-3 rounded-lg border border-border bg-bg-tertiary px-3 py-2.5"
					>
						<div className="flex items-center gap-2 min-w-[220px] shrink-0">
							<span
								className="size-1.5 rounded-full shrink-0 mt-0.5"
								style={{ background: field.color }}
							/>
							<code
								className="text-[11px] font-mono font-semibold"
								style={{ color: field.color }}
							>
								{field.key}
							</code>
							<span className="text-text-muted text-[11px]">:</span>
							<code className="text-[11px] font-mono text-text-primary">
								{field.value}
							</code>
						</div>
						<p className="text-[11px] text-text-muted leading-relaxed">
							{field.desc}
						</p>
					</div>
				))}
			</div>

			{/* JSON preview */}
			<div className="mt-4">
				<p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-2">
					דוגמת קובץ
				</p>
				<pre
					className="rounded-lg border border-border bg-bg-primary p-3 text-[10px] font-mono text-text-secondary overflow-x-auto leading-relaxed"
					dir="ltr"
				>
					{`{
  "model_profile": "balanced",
  "research": true,
  "verifier": true,
  "max_depth": "full",
  "team_mode": true,
  "atomic_commits": true,
  "wave_parallelism": 8
}`}
				</pre>
			</div>
		</Card>
	);
}

// ── Section 6: Best Practices ─────────────────────────────────────────────────

const BEST_PRACTICES = [
	{
		num: "01",
		title: "תמיד discuss לפני plan",
		detail:
			"אל תתחיל לתכנן phase בלי /gsd:discuss-phase קודם. Research מוצא 80% מהtrap-ים.",
		icon: <Search size={14} />,
		color: C.cyan,
	},
	{
		num: "02",
		title: "Phase = ~15 דקות עבודה",
		detail:
			"phase שלוקח יותר מ-30 דקות — חלק אותו. phase קטן מ-5 דקות — מיזוג עם הסמוכה.",
		icon: <Zap size={14} />,
		color: C.amber,
	},
	{
		num: "03",
		title: "Atomic commits per step",
		detail:
			"כל צעד ב-PLAN.md → commit נפרד. זה מאפשר rollback מדויק וhistory ברורה.",
		icon: <Code2 size={14} />,
		color: C.blue,
	},
	{
		num: "04",
		title: "Verification לפני 'done'",
		detail:
			"לא לדווח 'done' בלי לרוץ /gsd:verify-work. typecheck + lint + tests mandatory.",
		icon: <CheckCircle2 size={14} />,
		color: C.green,
	},
	{
		num: "05",
		title: "השתמש ב-‎--auto ל-overnight",
		detail:
			"/gsd:autonomous --from current מריץ הכל אוטומטית. מתאים ל-batch overnight runs.",
		icon: <Rocket size={14} />,
		color: C.pink,
	},
	{
		num: "06",
		title: "Wave parallelism חכם",
		detail:
			"גרופ צעדים independent ל-waves. אל תריץ sequential מה שאפשר להריץ parallel.",
		icon: <Users size={14} />,
		color: C.purple,
	},
	{
		num: "07",
		title: "gsd-plan-checker תמיד",
		detail:
			"אחרי gsd-planner → הרץ gsd-plan-checker. 40% מה-plans צריכים refinement.",
		icon: <ClipboardList size={14} />,
		color: C.teal,
	},
	{
		num: "08",
		title: "Context עמוק בתחילת פרויקט",
		detail:
			"/gsd:new-project עם כמה שיותר context: stack, constraints, examples, anti-patterns.",
		icon: <Layers size={14} />,
		color: C.blue,
	},
];

function BestPracticesSection() {
	return (
		<Card>
			<SectionHeading
				icon={<Sparkles size={16} />}
				title="Best Practices"
				subtitle="8 עקרונות לעבודה אפקטיבית עם GSD"
				accentColor={C.pink}
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{BEST_PRACTICES.map((bp) => (
					<div
						key={bp.num}
						className="rounded-xl border overflow-hidden"
						style={{ borderColor: `${bp.color}25` }}
					>
						<div
							className="flex items-center gap-2 px-3 pt-3 pb-2"
							style={{ background: `${bp.color}08` }}
						>
							<span
								className="flex size-7 items-center justify-center rounded-lg shrink-0"
								style={{ background: `${bp.color}20`, color: bp.color }}
							>
								{bp.icon}
							</span>
							<div className="flex items-baseline gap-2 min-w-0">
								<span
									className="text-[10px] font-bold font-mono opacity-60"
									style={{ color: bp.color }}
								>
									{bp.num}
								</span>
								<p
									className="text-xs font-semibold truncate"
									style={{ color: bp.color }}
								>
									{bp.title}
								</p>
							</div>
						</div>
						<div className="px-3 pb-3 pt-2">
							<p className="text-[11px] text-text-muted leading-relaxed">
								{bp.detail}
							</p>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}

// ── Quick Reference Card ───────────────────────────────────────────────────────

const QUICK_REF = [
	{ label: "פרויקט חדש", cmd: "/gsd:new-project", color: C.blue },
	{ label: "Milestone חדש", cmd: "/gsd:new-milestone", color: C.purple },
	{ label: "דיון לפני plan", cmd: "/gsd:discuss-phase", color: C.cyan },
	{ label: "תכנון phase", cmd: "/gsd:plan-phase", color: C.teal },
	{ label: "ביצוע", cmd: "/gsd:execute-phase", color: C.green },
	{ label: "אימות", cmd: "/gsd:verify-work", color: C.amber },
	{ label: "אוטומטי", cmd: "/gsd:autonomous", color: C.pink },
	{ label: "debug", cmd: "/gsd:debug", color: C.red },
];

function QuickReference() {
	return (
		<Card>
			<SectionHeading
				icon={<FileText size={16} />}
				title="Quick Reference"
				subtitle="פקודות חיוניות בראש"
				accentColor={C.teal}
			/>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
				{QUICK_REF.map((item) => (
					<div
						key={item.cmd}
						className="flex flex-col gap-1 rounded-lg border px-2.5 py-2"
						style={{
							borderColor: `${item.color}30`,
							background: `${item.color}08`,
						}}
					>
						<span className="text-[10px] text-text-muted">{item.label}</span>
						<code
							className="text-[10px] font-mono font-bold leading-tight"
							style={{ color: item.color }}
						>
							{item.cmd}
						</code>
					</div>
				))}
			</div>
		</Card>
	);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function GsdGuidePage() {
	return (
		<div className="space-y-6 max-w-5xl">
			{/* Page Header */}
			<div className="flex items-start gap-4">
				<div
					className="flex size-12 shrink-0 items-center justify-center rounded-xl"
					style={{ background: `${C.purple}20` }}
				>
					<Rocket size={22} style={{ color: C.purple }} />
				</div>
				<div>
					<h1 className="text-xl font-bold text-text-primary">
						GSD — Get Stuff Done
					</h1>
					<p className="text-sm text-text-muted mt-1">
						Workflow מובנה לבניית פיצ׳רים: Project → Milestone → Phase → Plan →
						Execute → Verify
					</p>
					<div className="flex items-center gap-3 mt-2">
						<span
							className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
							style={{ background: `${C.green}20`, color: C.green }}
						>
							<span className="size-1.5 rounded-full bg-current" />
							Active
						</span>
						<span className="text-[11px] text-text-muted">
							11 agents · 11 commands · GSD v1.25.1
						</span>
					</div>
				</div>
			</div>

			{/* Quick Reference — top */}
			<QuickReference />

			{/* Section 1 */}
			<WhatIsGsd />

			{/* Section 2 */}
			<FlowDiagram />

			{/* Section 3 */}
			<CommandsSection />

			{/* Section 4 */}
			<AgentsSection />

			{/* Section 5 */}
			<ConfigSection />

			{/* Section 6 */}
			<BestPracticesSection />

			{/* Footer note */}
			<div
				className="rounded-xl border px-4 py-3 flex items-start gap-3"
				style={{ borderColor: `${C.blue}25`, background: `${C.blue}06` }}
			>
				<Rocket
					size={14}
					style={{ color: C.blue }}
					className="shrink-0 mt-0.5"
				/>
				<p className="text-xs text-text-muted leading-relaxed">
					<span className="font-semibold text-text-secondary">GSD v1.25.1</span>{" "}
					— כל ה-11 agents מוגדרים ב-
					<code className="font-mono text-[10px] mx-0.5">~/.codex/agents/</code>
					וב-
					<code className="font-mono text-[10px] mx-0.5">~/.gsd/</code>. Global
					defaults ב-
					<code className="font-mono text-[10px] mx-0.5">
						~/.gsd/defaults.json
					</code>
					. TEAM mode פעיל לכל עבודה לא-טריוויאלית. עומק מקסימלי תמיד.
				</p>
			</div>
		</div>
	);
}
