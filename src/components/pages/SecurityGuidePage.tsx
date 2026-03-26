// type-ok
import {
	AlertTriangle,
	ArrowLeft,
	Ban,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	ClipboardList,
	Code2,
	Database,
	Eye,
	FileSearch,
	Globe,
	Key,
	Layers,
	Lock,
	Package,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldOff,
	Terminal,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

// ── Shared types ─────────────────────────────────────────────────────────────

interface AccordionProps {
	id: string;
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
	accentColor?: string;
}

// ── Accordion ─────────────────────────────────────────────────────────────────

function AccordionSection({
	id,
	title,
	subtitle,
	icon,
	children,
	defaultOpen = false,
	accentColor = "var(--color-accent-blue)",
}: AccordionProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<div
			id={id}
			className={cn(
				"glass-card overflow-hidden transition-colors duration-200",
				open && "border-[var(--color-border-hover)]",
			)}
		>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				aria-expanded={open}
				className={cn(
					"w-full flex items-center gap-3 px-5 py-4 min-h-[64px]",
					"text-start cursor-pointer hover:bg-[var(--color-bg-tertiary)]",
					"transition-colors duration-150",
				)}
			>
				<span
					className="flex size-10 shrink-0 items-center justify-center rounded-xl"
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
					<div className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
						{subtitle}
					</div>
				</div>
				<span className="shrink-0 text-[var(--color-text-muted)]">
					{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</span>
			</button>

			{open && (
				<div className="border-t border-[var(--color-border)] px-5 py-5">
					{children}
				</div>
			)}
		</div>
	);
}

// ── Code block ────────────────────────────────────────────────────────────────

function CodeBlock({ children }: { children: string }) {
	return (
		<pre
			dir="ltr"
			className={cn(
				"rounded-xl px-4 py-3 text-xs font-mono overflow-x-auto",
				"bg-[var(--color-bg-primary)] text-[var(--color-accent-cyan)]",
				"border border-[var(--color-border)] leading-relaxed",
			)}
		>
			{children}
		</pre>
	);
}

// ── Severity badge ────────────────────────────────────────────────────────────

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const SEVERITY_COLORS: Record<Severity, string> = {
	CRITICAL: "oklch(0.62 0.22 25)",
	HIGH: "oklch(0.78 0.16 75)",
	MEDIUM: "oklch(0.65 0.18 250)",
	LOW: "oklch(0.72 0.19 155)",
};

function SeverityBadge({ level }: { level: Severity }) {
	const color = SEVERITY_COLORS[level];
	return (
		<span
			className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold whitespace-nowrap"
			style={{
				background: `oklch(from ${color} l c h / 0.15)`,
				color,
				border: `1px solid oklch(from ${color} l c h / 0.35)`,
			}}
		>
			{level}
		</span>
	);
}

// ── Info badge ────────────────────────────────────────────────────────────────

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

// ── Section 1 — Zero Trust ───────────────────────────────────────────────────

const ZERO_TRUST_PILLARS = [
	{
		icon: <ShieldOff size={22} />,
		title: "Never Trust",
		heTitle: "אל תסמוך אף פעם",
		color: "oklch(0.62 0.22 25)",
		desc: "כל בקשה נדרשת לאימות מלא — ללא קשר למקורה. לקוח פנימי, microservice, אדמין, הכול עובר ולידציה.",
		items: [
			"Zod validation על כל boundary",
			"JWT signature verification — לא רק קיום",
			"IP allowlist אינו תחליף לאימות",
			"Never assume auth based on network location",
		],
	},
	{
		icon: <Eye size={22} />,
		title: "Always Verify",
		heTitle: "תמיד תאמת",
		color: "oklch(0.65 0.18 250)",
		desc: "כל קריאה דורשת auth וגם authz. Authentication מוכיח זהות. Authorization מוכיח הרשאה. שניהם חובה.",
		items: [
			"getUser() server-side — לעולם לא getSession()",
			"RLS על כל טבלת Supabase",
			"RBAC: min privilege בכל action",
			"Revocation check — לא רק token expiry",
		],
	},
	{
		icon: <Key size={22} />,
		title: "Least Privilege",
		heTitle: "הרשאה מינימלית",
		color: "oklch(0.72 0.19 155)",
		desc: "כל component, שירות וסוכן מקבל בדיוק מה שהוא צריך — לא יותר. Just enough, just in time.",
		items: [
			"Per-agent tool scoping בסוכני AI",
			"SECURITY DEFINER helpers ב-Supabase",
			"maxSteps: 5-10 לסוכני AI (לא unlimited)",
			"Service role key אף פעם לא client-side",
		],
	},
];

// ── Auth chain step ───────────────────────────────────────────────────────────

const AUTH_CHAIN_STEPS = [
	{
		label: "rateLimiter",
		desc: "@upstash/ratelimit — חסימת flood ו-brute force",
		color: "oklch(0.62 0.22 25)",
		icon: <Zap size={14} />,
	},
	{
		label: "validateToken",
		desc: "JWT signature + expiry + issuer verification",
		color: "oklch(0.78 0.16 75)",
		icon: <Key size={14} />,
	},
	{
		label: "checkRevocation",
		desc: "בדיקת blacklist/revocation table בכל קריאה",
		color: "oklch(0.65 0.18 250)",
		icon: <Ban size={14} />,
	},
	{
		label: "validatePermissions",
		desc: "RBAC — הרשאות לפי תפקיד ומשאב",
		color: "oklch(0.62 0.2 290)",
		icon: <Lock size={14} />,
	},
	{
		label: "validateInput",
		desc: "Zod schema validation על כל input",
		color: "oklch(0.75 0.14 200)",
		icon: <ClipboardList size={14} />,
	},
	{
		label: "auditLog",
		desc: "Structured logging עם Pino — ללא PII",
		color: "oklch(0.72 0.19 155)",
		icon: <FileSearch size={14} />,
	},
];

function ZeroTrustSection() {
	return (
		<div className="space-y-6">
			{/* 3 pillars */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{ZERO_TRUST_PILLARS.map((pillar) => (
					<div
						key={pillar.title}
						className="rounded-xl p-4 border"
						style={{
							background: `oklch(from ${pillar.color} l c h / 0.07)`,
							borderColor: `oklch(from ${pillar.color} l c h / 0.3)`,
						}}
					>
						<div
							className="flex items-center justify-center w-11 h-11 rounded-xl mb-3"
							style={{
								background: `oklch(from ${pillar.color} l c h / 0.18)`,
								color: pillar.color,
							}}
						>
							{pillar.icon}
						</div>
						<div
							className="text-base font-bold mb-0.5"
							style={{ color: pillar.color }}
						>
							{pillar.title}
						</div>
						<div className="text-xs text-[var(--color-text-muted)] mb-2">
							{pillar.heTitle}
						</div>
						<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
							{pillar.desc}
						</p>
						<ul className="space-y-1.5">
							{pillar.items.map((item) => (
								<li key={item} className="flex items-start gap-2 text-xs">
									<CheckCircle2
										size={12}
										className="shrink-0 mt-0.5"
										style={{ color: pillar.color }}
									/>
									<span className="text-[var(--color-text-secondary)]">
										{item}
									</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			{/* Auth chain diagram */}
			<div>
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
					<Layers size={15} className="text-[var(--color-accent-blue)]" />
					שרשרת האימות — Auth Chain
				</h3>
				<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 overflow-x-auto">
					<div className="flex items-center gap-1 min-w-max flex-wrap gap-y-3">
						{AUTH_CHAIN_STEPS.map((step, i) => (
							<div key={step.label} className="flex items-center gap-1">
								<div
									className="flex flex-col items-center rounded-lg px-3 py-2 min-w-[110px] text-center"
									style={{
										background: `oklch(from ${step.color} l c h / 0.12)`,
										border: `1px solid oklch(from ${step.color} l c h / 0.3)`,
									}}
								>
									<span style={{ color: step.color }}>{step.icon}</span>
									<span
										className="text-xs font-mono font-semibold mt-1"
										style={{ color: step.color }}
									>
										{step.label}
									</span>
									<span className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight">
										{step.desc}
									</span>
								</div>
								{i < AUTH_CHAIN_STEPS.length - 1 && (
									<ArrowLeft
										size={14}
										className="shrink-0 text-[var(--color-text-muted)] rotate-180"
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* DO / NEVER */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="rounded-xl border border-[oklch(0.72_0.19_155_/_0.3)] bg-[oklch(0.72_0.19_155_/_0.07)] p-4">
					<div className="flex items-center gap-2 mb-3">
						<CheckCircle2
							size={15}
							className="text-[var(--color-accent-green)]"
						/>
						<span className="text-sm font-semibold text-[var(--color-accent-green)]">
							DO — תמיד
						</span>
					</div>
					<ul className="space-y-1.5">
						{[
							"Server-side getUser() לאימות זהות",
							"proxy.ts — route protection",
							"RLS על כל נתון",
							"Zod validation על כל boundary",
							"Parameterized queries בלבד",
							"Security headers בכל response",
						].map((item) => (
							<li
								key={item}
								className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]"
							>
								<span className="text-[var(--color-accent-green)] mt-0.5">
									✓
								</span>
								{item}
							</li>
						))}
					</ul>
				</div>
				<div className="rounded-xl border border-[oklch(0.62_0.22_25_/_0.3)] bg-[oklch(0.62_0.22_25_/_0.07)] p-4">
					<div className="flex items-center gap-2 mb-3">
						<ShieldAlert size={15} className="text-[var(--color-accent-red)]" />
						<span className="text-sm font-semibold text-[var(--color-accent-red)]">
							NEVER — אסור מוחלט
						</span>
					</div>
					<ul className="space-y-1.5">
						{[
							"Trust client data ללא validation",
							"getSession() לצורכי אבטחה",
							"Service role key בצד client",
							"דילוג על RLS בכל טבלה",
							"Secrets בקוד / git",
							"Log PII — structured logging only",
						].map((item) => (
							<li
								key={item}
								className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]"
							>
								<span className="text-[var(--color-accent-red)] mt-0.5">✗</span>
								{item}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

// ── Section 2 — CVE Table ─────────────────────────────────────────────────────

interface CveRow {
	pkg: string;
	minVersion: string;
	cve: string;
	severity: Severity;
	desc: string;
}

const CVE_ROWS: CveRow[] = [
	{
		pkg: "React",
		minVersion: "19.2.4+",
		cve: "CVE-2025-55182",
		severity: "CRITICAL",
		desc: "Remote Code Execution — CVSS 10.0",
	},
	{
		pkg: "React",
		minVersion: "19.2.4+",
		cve: "CVE-2026-23864",
		severity: "HIGH",
		desc: "Server Actions DoS — memory exhaustion",
	},
	{
		pkg: "Next.js",
		minVersion: "16.1.6+",
		cve: "RSC",
		severity: "HIGH",
		desc: "React Server Components security fixes",
	},
	{
		pkg: "Hono",
		minVersion: "4.12.2+",
		cve: "GHSA-f67f-6cw9-8mq4",
		severity: "HIGH",
		desc: "JWT algorithm confusion attack",
	},
	{
		pkg: "Hono",
		minVersion: "4.12.2+",
		cve: "CVE-2026-24771",
		severity: "HIGH",
		desc: "XSS via unescaped error messages in JSX",
	},
	{
		pkg: "Hono",
		minVersion: "4.12.2+",
		cve: "CVE-2026-24398",
		severity: "HIGH",
		desc: "IP Restriction bypass via X-Forwarded-For spoofing",
	},
	{
		pkg: "Node.js",
		minVersion: "24.14.0+",
		cve: "CVE-2025-59466",
		severity: "HIGH",
		desc: "async_hooks DoS — CVSS 7.5",
	},
	{
		pkg: "Node.js",
		minVersion: "24.14.0+",
		cve: "CVE-2026-21637",
		severity: "HIGH",
		desc: "TLS crash under load",
	},
	{
		pkg: "pnpm",
		minVersion: "10.30.3+",
		cve: "CVE-2025-69263",
		severity: "CRITICAL",
		desc: "Lockfile integrity bypass — CVSS 8.8",
	},
	{
		pkg: "pnpm",
		minVersion: "10.30.3+",
		cve: "CVE-2025-69264",
		severity: "HIGH",
		desc: "HTTP tarball without integrity hash — MITM injection",
	},
	{
		pkg: "pnpm",
		minVersion: "10.30.3+",
		cve: "CVE-2026-24842",
		severity: "HIGH",
		desc: "tar vulnerability",
	},
	{
		pkg: "MCP SDK",
		minVersion: "1.27.1+",
		cve: "CVE-2026-0621",
		severity: "MEDIUM",
		desc: "ReDoS in message validation",
	},
	{
		pkg: "MCP SDK",
		minVersion: "1.27.1+",
		cve: "CVE-2026-25536",
		severity: "MEDIUM",
		desc: "Data leak via message routing",
	},
	{
		pkg: "MCP Git",
		minVersion: "2025.12.18+",
		cve: "CVE-2025-68143/44/45",
		severity: "CRITICAL",
		desc: "RCE via prompt injection + path validation bypass",
	},
];

const PKG_COLORS: Record<string, string> = {
	React: "oklch(0.65 0.18 250)",
	"Next.js": "oklch(0.72 0.19 155)",
	Hono: "oklch(0.62 0.2 290)",
	"Node.js": "oklch(0.72 0.19 155)",
	pnpm: "oklch(0.78 0.16 75)",
	"MCP SDK": "oklch(0.75 0.14 200)",
	"MCP Git": "oklch(0.62 0.22 25)",
};

function CveSection() {
	const [filter, setFilter] = useState<Severity | "ALL">("ALL");

	const filtered =
		filter === "ALL" ? CVE_ROWS : CVE_ROWS.filter((r) => r.severity === filter);

	return (
		<div className="space-y-4">
			{/* Filter buttons */}
			<div className="flex items-center gap-2 flex-wrap">
				{(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((lvl) => {
					const isActive = filter === lvl;
					const color =
						lvl === "ALL"
							? "var(--color-accent-blue)"
							: SEVERITY_COLORS[lvl as Severity];
					return (
						<button
							key={lvl}
							type="button"
							onClick={() => setFilter(lvl)}
							className={cn(
								"px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 min-h-8",
							)}
							style={
								isActive
									? {
											background: `oklch(from ${color} l c h / 0.2)`,
											borderColor: `oklch(from ${color} l c h / 0.5)`,
											color,
										}
									: {
											background: "transparent",
											borderColor: "var(--color-border)",
											color: "var(--color-text-muted)",
										}
							}
						>
							{lvl}
						</button>
					);
				})}
				<span className="text-xs text-[var(--color-text-muted)] ms-2">
					מציג {filtered.length} מתוך {CVE_ROWS.length} CVEs
				</span>
			</div>

			{/* Table */}
			<div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-xs" dir="ltr">
						<thead>
							<tr className="bg-[var(--color-bg-tertiary)]">
								{[
									"Package",
									"Min Version",
									"CVE ID",
									"Severity",
									"Description",
								].map((h) => (
									<th
										key={h}
										className="px-4 py-3 text-start font-semibold text-[var(--color-text-secondary)] whitespace-nowrap"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filtered.map((row, i) => {
								const pkgColor =
									PKG_COLORS[row.pkg] ?? "var(--color-accent-blue)";
								return (
									<tr
										key={`${row.pkg}-${row.cve}`}
										className={cn(
											"border-t border-[var(--color-border)]",
											"hover:bg-[var(--color-bg-tertiary)] transition-colors duration-100",
											i % 2 !== 0 && "bg-[var(--color-bg-primary)]",
										)}
									>
										<td className="px-4 py-3 whitespace-nowrap">
											<span
												className="font-semibold font-mono text-xs px-2 py-0.5 rounded"
												style={{
													color: pkgColor,
													background: `oklch(from ${pkgColor} l c h / 0.1)`,
												}}
											>
												{row.pkg}
											</span>
										</td>
										<td className="px-4 py-3 whitespace-nowrap">
											<span className="font-mono text-[var(--color-accent-green)] font-semibold">
												{row.minVersion}
											</span>
										</td>
										<td className="px-4 py-3 whitespace-nowrap">
											<span className="font-mono text-[var(--color-text-secondary)]">
												{row.cve}
											</span>
										</td>
										<td className="px-4 py-3 whitespace-nowrap">
											<SeverityBadge level={row.severity} />
										</td>
										<td className="px-4 py-3 text-[var(--color-text-secondary)]">
											{row.desc}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{/* Summary stats */}
			<div className="grid grid-cols-3 gap-3">
				{(["CRITICAL", "HIGH", "MEDIUM"] as Severity[]).map((lvl) => {
					const count = CVE_ROWS.filter((r) => r.severity === lvl).length;
					const color = SEVERITY_COLORS[lvl];
					return (
						<div
							key={lvl}
							className="rounded-xl p-3 text-center border"
							style={{
								background: `oklch(from ${color} l c h / 0.08)`,
								borderColor: `oklch(from ${color} l c h / 0.3)`,
							}}
						>
							<div className="text-2xl font-bold font-mono" style={{ color }}>
								{count}
							</div>
							<div className="text-xs font-semibold mt-0.5" style={{ color }}>
								{lvl}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

// ── Section 3 — AI Security 6 Layers ─────────────────────────────────────────

const AI_LAYERS = [
	{
		step: 1,
		id: "rate-limit",
		label: "Rate Limit",
		desc: "@upstash/ratelimit — חסימת flood, DDoS ו-token exhaustion",
		color: "oklch(0.62 0.22 25)",
		icon: <Zap size={16} />,
	},
	{
		step: 2,
		id: "input-validation",
		label: "Input Validation",
		desc: "Zod schema — validation מלא לפני הגעה ל-LLM",
		color: "oklch(0.78 0.16 75)",
		icon: <ClipboardList size={16} />,
	},
	{
		step: 3,
		id: "prompt-isolation",
		label: "Prompt Isolation",
		desc: "System prompt סטטי בלבד — ללא user data ב-system prompt",
		color: "oklch(0.65 0.18 250)",
		icon: <Lock size={16} />,
	},
	{
		step: 4,
		id: "llm-call",
		label: "LLM Call",
		desc: "maxSteps: 5-10 — token budget, temperature ≤ 0.7 בproduction",
		color: "oklch(0.62 0.2 290)",
		icon: <Globe size={16} />,
	},
	{
		step: 5,
		id: "output-filtering",
		label: "Output Filtering",
		desc: "סינון PII, prompt leakage, HTML encoding לפני rendering",
		color: "oklch(0.75 0.14 200)",
		icon: <Eye size={16} />,
	},
	{
		step: 6,
		id: "monitoring",
		label: "Monitoring",
		desc: "Structured logging, anomaly detection, behavioral audit trail",
		color: "oklch(0.72 0.19 155)",
		icon: <FileSearch size={16} />,
	},
];

const OWASP_LLM = [
	{
		id: "LLM01",
		name: "Prompt Injection",
		our: "Prompt isolation, system prompt סטטי",
	},
	{
		id: "LLM02",
		name: "Sensitive Data Disclosure",
		our: "Output filtering, no PII in context",
	},
	{
		id: "LLM06/ASI01",
		name: "Excessive Agency",
		our: "maxSteps 5-10, HITL לפעולות הרסניות",
	},
	{
		id: "LLM07",
		name: "System Prompt Leakage",
		our: "ולידציה שה-prompt לא חוזר ב-output",
	},
	{
		id: "LLM10",
		name: "Unbounded Consumption",
		our: "Token budget, rate limiting, circuit breakers",
	},
	{
		id: "MCP03",
		name: "Tool Poisoning",
		our: "Allowlist MCP servers, pin versions",
	},
	{
		id: "MCP05",
		name: "Command Injection",
		our: "Parameterized queries, no execute-from-string, sandbox",
	},
];

function AiSecuritySection() {
	return (
		<div className="space-y-6">
			{/* Pipeline visual */}
			<div>
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
					<Layers size={15} className="text-[var(--color-accent-purple)]" />6
					Layers Defense-in-Depth — pipeline
				</h3>
				<div className="flex flex-col gap-2">
					{AI_LAYERS.map((layer, i) => (
						<div key={layer.id} className="flex items-stretch gap-3">
							{/* Step number + connector */}
							<div className="flex flex-col items-center">
								<div
									className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
									style={{
										background: `oklch(from ${layer.color} l c h / 0.18)`,
										color: layer.color,
										border: `1.5px solid oklch(from ${layer.color} l c h / 0.4)`,
									}}
								>
									{layer.step}
								</div>
								{i < AI_LAYERS.length - 1 && (
									<div
										className="w-px flex-1 mt-1"
										style={{
											background: `oklch(from ${layer.color} l c h / 0.25)`,
										}}
									/>
								)}
							</div>

							{/* Content */}
							<div
								className="flex-1 rounded-xl px-4 py-3 mb-1 flex items-start gap-3"
								style={{
									background: `oklch(from ${layer.color} l c h / 0.08)`,
									border: `1px solid oklch(from ${layer.color} l c h / 0.2)`,
								}}
							>
								<span style={{ color: layer.color }} className="mt-0.5">
									{layer.icon}
								</span>
								<div>
									<div
										className="text-sm font-semibold"
										style={{ color: layer.color }}
									>
										{layer.label}
									</div>
									<div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
										{layer.desc}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* OWASP LLM table */}
			<div>
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
					<ShieldAlert size={15} className="text-[var(--color-accent-amber)]" />
					OWASP LLM Top 10 — המיטיגציות שלנו
				</h3>
				<div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
					<table className="w-full text-xs" dir="ltr">
						<thead>
							<tr className="bg-[var(--color-bg-tertiary)]">
								<th className="px-4 py-3 text-start font-semibold text-[var(--color-text-secondary)]">
									ID
								</th>
								<th className="px-4 py-3 text-start font-semibold text-[var(--color-text-secondary)]">
									Risk
								</th>
								<th className="px-4 py-3 text-start font-semibold text-[var(--color-text-secondary)]">
									Our Mitigation
								</th>
							</tr>
						</thead>
						<tbody>
							{OWASP_LLM.map((row) => (
								<tr
									key={row.id}
									className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
								>
									<td className="px-4 py-3 whitespace-nowrap">
										<Badge label={row.id} color="oklch(0.78 0.16 75)" />
									</td>
									<td className="px-4 py-3 text-[var(--color-text-primary)] font-medium whitespace-nowrap">
										{row.name}
									</td>
									<td className="px-4 py-3 text-[var(--color-text-secondary)]">
										{row.our}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Rules */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="rounded-xl border border-[oklch(0.72_0.19_155_/_0.3)] bg-[oklch(0.72_0.19_155_/_0.07)] p-4">
					<div className="text-sm font-semibold text-[var(--color-accent-green)] mb-3">
						כללים חיוביים — DO
					</div>
					<ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
						{[
							"כל 6 Layers על כל AI endpoint",
							"System prompt סטטי בלבד",
							"Zod validation על AI inputs/outputs",
							"Structured logging עם Pino",
							"HITL לפעולות הרסניות",
							"Allowlist MCP servers עם version pins",
							"Validate inter-agent messages עם HMAC",
						].map((item) => (
							<li key={item} className="flex items-start gap-2">
								<span className="text-[var(--color-accent-green)] mt-0.5">
									✓
								</span>
								{item}
							</li>
						))}
					</ul>
				</div>
				<div className="rounded-xl border border-[oklch(0.62_0.22_25_/_0.3)] bg-[oklch(0.62_0.22_25_/_0.07)] p-4">
					<div className="text-sm font-semibold text-[var(--color-accent-red)] mb-3">
						אסור מוחלט — NEVER
					</div>
					<ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
						{[
							"User data ב-system prompt",
							"חשיפת ה-system prompt",
							"Trust ב-AI output ללא filtering",
							"Unlimited turns/steps/tokens",
							"דילוג על rate limiting",
							"Log של prompt contents",
							"Render raw LLM output as HTML",
							"Temperature > 0.7 בproduction",
						].map((item) => (
							<li key={item} className="flex items-start gap-2">
								<span className="text-[var(--color-accent-red)] mt-0.5">✗</span>
								{item}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

// ── Section 4 — OWASP ASI01-10 ───────────────────────────────────────────────

const ASI_ITEMS = [
	{
		id: "ASI01",
		name: "Agent Goal Hijack",
		risk: "השתלטות על מטרת הסוכן דרך prompt injection",
		mitigation:
			"Acceptance criteria לפני קידוד, prompt isolation, verification gates בכל שלב",
		color: "oklch(0.62 0.22 25)",
	},
	{
		id: "ASI02",
		name: "Tool Misuse & Exploitation",
		risk: "שימוש לרעה בכלים — ביצוע פעולות לא מורשות",
		mitigation:
			"maxSteps 5-10 (כלים לפי turn), least-privilege tools לכל סוכן, HITL לפעולות הרסניות",
		color: "oklch(0.78 0.16 75)",
	},
	{
		id: "ASI03",
		name: "Identity & Privilege Abuse",
		risk: "זיוף זהות סוכן או הסלמת הרשאות",
		mitigation:
			"Per-agent tool scoping, deny-by-default, permission-auto-decide hook, HMAC בין סוכנים",
		color: "oklch(0.65 0.18 250)",
	},
	{
		id: "ASI04",
		name: "Agentic Supply Chain Vulns",
		risk: "פגיעויות בשרשרת האספקה — MCP servers, plugins",
		mitigation:
			"Allowlist MCP servers, pin versions, Cosign signing, validate MCP outputs לפני הזנה ל-LLM",
		color: "oklch(0.62 0.2 290)",
	},
	{
		id: "ASI05",
		name: "Unexpected Code Execution",
		risk: "הרצת קוד לא מבוקרת על ידי סוכן",
		mitigation:
			"Sandbox agents, gVisor isolation, no execute-from-string, ולידציה של כל shell command",
		color: "oklch(0.75 0.14 200)",
	},
	{
		id: "ASI06",
		name: "Memory & Context Poisoning",
		risk: "הרעלת הזיכרון הקוגניטיבי של הסוכן",
		mitigation:
			"Memory decay via knowledge-curator, validate reads, freshness scoring, garbage filters",
		color: "oklch(0.72 0.19 155)",
	},
	{
		id: "ASI07",
		name: "Insecure Inter-Agent Comms",
		risk: "תקשורת לא מאובטחת בין סוכנים",
		mitigation:
			"HMAC-signed async mailbox, validate inter-agent messages, orchestrator != workers",
		color: "oklch(0.78 0.16 75)",
	},
	{
		id: "ASI08",
		name: "Cascading Failures",
		risk: "כשל מדורג — agent אחד מפיל את כולם",
		mitigation:
			"Circuit breakers, stop-verification-gate, user approval gates, blast radius containment",
		color: "oklch(0.62 0.22 25)",
	},
	{
		id: "ASI09",
		name: "Human-Agent Trust Exploitation",
		risk: "ניצול יחסי האמון בין אדם לסוכן",
		mitigation:
			"Anti-sycophancy rules, calibrated uncertainty, diplomatically honest output style",
		color: "oklch(0.65 0.18 250)",
	},
	{
		id: "ASI10",
		name: "Rogue Agents",
		risk: "סוכנים שפועלים מחוץ לגבולות — stray actions",
		mitigation:
			"beads.jsonl audit trail, behavioral anomaly detection, multi-layer kill switch",
		color: "oklch(0.62 0.2 290)",
	},
];

function OwaspAsiSection() {
	return (
		<div className="space-y-3">
			{ASI_ITEMS.map((item) => (
				<div
					key={item.id}
					className="rounded-xl p-4 border transition-colors duration-150 hover:border-[var(--color-border-hover)]"
					style={{
						background: `oklch(from ${item.color} l c h / 0.06)`,
						borderColor: `oklch(from ${item.color} l c h / 0.2)`,
					}}
				>
					<div className="flex items-start gap-3">
						<span
							className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold font-mono shrink-0"
							style={{
								background: `oklch(from ${item.color} l c h / 0.18)`,
								color: item.color,
								border: `1px solid oklch(from ${item.color} l c h / 0.4)`,
							}}
						>
							{item.id}
						</span>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<span className="text-sm font-semibold text-[var(--color-text-primary)]">
									{item.name}
								</span>
							</div>
							<div className="mt-1.5 grid grid-cols-1 gap-1.5 md:grid-cols-2">
								<div className="flex items-start gap-2 text-xs">
									<AlertTriangle
										size={11}
										className="shrink-0 mt-0.5 text-[var(--color-accent-amber)]"
									/>
									<span className="text-[var(--color-text-secondary)]">
										{item.risk}
									</span>
								</div>
								<div className="flex items-start gap-2 text-xs">
									<ShieldCheck
										size={11}
										className="shrink-0 mt-0.5 text-[var(--color-accent-green)]"
									/>
									<span className="text-[var(--color-text-secondary)]">
										{item.mitigation}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

// ── Section 5 — Supabase RLS ──────────────────────────────────────────────────

const RLS_PATTERNS = [
	{
		title: "USING(true) = data leak",
		bad: true,
		code: "-- ❌ WRONG: כל משתמש רואה הכל\nCREATE POLICY bad ON items USING (true);",
		fix: "-- ✓ CORRECT: סקופ לפי user\nCREATE POLICY good ON items USING (auth.uid() = user_id);",
	},
	{
		title: "IS NULL bypass — חורת אבטחה",
		bad: true,
		code: "-- ❌ WRONG: unauthenticated = עובר!\nUSING ((auth.uid()) IS NULL OR user_id = auth.uid())",
		fix: "-- ✓ CORRECT: רק authenticated\nUSING (auth.uid() = user_id)",
	},
	{
		title: "SECURITY DEFINER — role checks",
		bad: false,
		code: "-- ✓ CORRECT: helper function\nCREATE FUNCTION public.get_user_role()\n  RETURNS text LANGUAGE sql SECURITY DEFINER STABLE\nAS $$\n  SELECT role FROM public.profiles WHERE id = auth.uid()\n$$;",
		fix: null,
	},
	{
		title: "handle_new_user trigger — default role",
		bad: true,
		code: "-- ❌ WRONG: raw_user_meta_data client-writable!\nCOALESCE((NEW.raw_user_meta_data->>'role'), 'branch_user')",
		fix: "-- ✓ CORRECT: hardcode default\nINSERT INTO profiles (id, role) VALUES (new.id, 'user');",
	},
];

const STORAGE_RULES = [
	{
		label: "file_size_limit",
		bad: "אין הגבלה = DoS",
		good: "10MB מקסימום",
	},
	{
		label: "allowed_mime_types",
		bad: "כל סוג = SVG XSS",
		good: "['image/png','image/jpeg']",
	},
	{
		label: "public bucket",
		bad: "public=true = תמיד נגיש",
		good: "private + signed URLs",
	},
];

function SupabaseRlsSection() {
	return (
		<div className="space-y-6">
			{/* RLS patterns */}
			<div className="space-y-4">
				{RLS_PATTERNS.map((p) => (
					<div
						key={p.title}
						className="rounded-xl border border-[var(--color-border)] overflow-hidden"
					>
						<div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-bg-tertiary)]">
							{p.bad ? (
								<ShieldAlert
									size={14}
									className="text-[var(--color-accent-red)]"
								/>
							) : (
								<ShieldCheck
									size={14}
									className="text-[var(--color-accent-green)]"
								/>
							)}
							<span className="text-xs font-semibold text-[var(--color-text-primary)]">
								{p.title}
							</span>
						</div>
						<div className="px-4 py-3 space-y-2">
							<CodeBlock>{p.code}</CodeBlock>
							{p.fix && <CodeBlock>{p.fix}</CodeBlock>}
						</div>
					</div>
				))}
			</div>

			{/* Storage rules */}
			<div>
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
					<Database size={15} className="text-[var(--color-accent-amber)]" />
					Storage Bucket — חובה
				</h3>
				<div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
					<table className="w-full text-xs" dir="ltr">
						<thead>
							<tr className="bg-[var(--color-bg-tertiary)]">
								<th className="px-4 py-3 text-start font-semibold text-[var(--color-text-secondary)]">
									Setting
								</th>
								<th className="px-4 py-3 text-start font-semibold text-[var(--color-accent-red)]">
									❌ Without
								</th>
								<th className="px-4 py-3 text-start font-semibold text-[var(--color-accent-green)]">
									✓ With
								</th>
							</tr>
						</thead>
						<tbody>
							{STORAGE_RULES.map((r) => (
								<tr
									key={r.label}
									className="border-t border-[var(--color-border)]"
								>
									<td className="px-4 py-3 font-mono text-[var(--color-accent-cyan)]">
										{r.label}
									</td>
									<td className="px-4 py-3 text-[var(--color-accent-red)]">
										{r.bad}
									</td>
									<td className="px-4 py-3 text-[var(--color-accent-green)]">
										{r.good}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Edge Function CORS */}
			<div>
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
					<Globe size={15} className="text-[var(--color-accent-purple)]" />
					Edge Function CORS — אסור wildcard
				</h3>
				<CodeBlock>{`// ❌ WRONG: כל origin\nheaders.set('Access-Control-Allow-Origin', '*');\n\n// ✓ CORRECT: allowlist בלבד\nconst allowed = ['https://yourdomain.com', 'https://app.yourdomain.com'];\nconst origin = req.headers.get('origin');\nconst corsOrigin = allowed.includes(origin ?? '') ? origin! : allowed[0];\nheaders.set('Access-Control-Allow-Origin', corsOrigin);\nheaders.set('Vary', 'Origin'); // חובה למניעת CDN cache poisoning`}</CodeBlock>
			</div>

			{/* Migration trap */}
			<div className="rounded-xl p-4 border border-[oklch(0.62_0.22_25_/_0.4)] bg-[oklch(0.62_0.22_25_/_0.07)]">
				<div className="flex items-start gap-3">
					<AlertTriangle
						size={18}
						className="shrink-0 mt-0.5 text-[var(--color-accent-red)]"
					/>
					<div>
						<div className="text-sm font-semibold text-[var(--color-accent-red)] mb-1">
							Toxic Migration Sequence — מלכודת נפוצה
						</div>
						<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
							migration מאוחרת מוסיפה policies חדשות אבל{" "}
							<strong>לא מורידה</strong> את הישנות עם{" "}
							<code className="font-mono text-[var(--color-accent-cyan)]">
								DROP POLICY IF EXISTS
							</code>
							. הpolicy הישנה עם IS NULL bypass נשארת פעילה לצד החדשה. תמיד{" "}
							<code className="font-mono text-[var(--color-accent-green)]">
								DROP POLICY IF EXISTS old_name
							</code>{" "}
							לפני CREATE POLICY חדשה.
						</p>
					</div>
				</div>
			</div>

			{/* Auth fallback note */}
			<div className="rounded-xl p-4 border border-[oklch(0.65_0.18_250_/_0.3)] bg-[oklch(0.65_0.18_250_/_0.07)]">
				<div className="flex items-start gap-3">
					<Key
						size={16}
						className="shrink-0 mt-0.5 text-[var(--color-accent-blue)]"
					/>
					<div>
						<div className="text-sm font-semibold text-[var(--color-accent-blue)] mb-1">
							Auth Fallback — isVerified flag
						</div>
						<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
							שימוש ב-getSession() כ-fallback כשgetUser() נכשל = JWT-only data
							לא מאומתת. Auth context חייב לכלול{" "}
							<code className="font-mono text-[var(--color-accent-cyan)]">
								isVerified: boolean
							</code>{" "}
							להבחנה בין verified (getUser() הצליח) ל-degraded (getSession()
							fallback).
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Section 6 — Security Headers ─────────────────────────────────────────────

const HEADERS_DATA = [
	{
		header: "Cross-Origin-Opener-Policy",
		wrong: "same-origin",
		correct: "same-origin-allow-popups",
		wrongDesc: "שובר Google OAuth popup flow",
		correctDesc: "OAuth popups עובדים + isolation",
		icon: <Globe size={14} />,
		color: "oklch(0.65 0.18 250)",
	},
	{
		header: "Content-Security-Policy",
		wrong: "script-src 'unsafe-eval'",
		correct: "script-src 'wasm-unsafe-eval'",
		wrongDesc: "מאפשר execute-from-string — XSS vector",
		correctDesc: "WASM בלבד, חוסם execute-from-string",
		icon: <Code2 size={14} />,
		color: "oklch(0.62 0.2 290)",
	},
	{
		header: "X-XSS-Protection",
		wrong: "1; mode=block",
		correct: "0",
		wrongDesc: "Deprecated + information leak vulnerability",
		correctDesc: "Disabled (סמוך על CSP בלבד)",
		icon: <ShieldOff size={14} />,
		color: "oklch(0.78 0.16 75)",
	},
	{
		header: "img-src CSP",
		wrong: "img-src https:",
		correct: "img-src https://cdn.example.com",
		wrongDesc: "כל domain HTTPS — tracking pixels, data exfil",
		correctDesc: "Allowlist ספציפי לCDN בלבד",
		icon: <Eye size={14} />,
		color: "oklch(0.75 0.14 200)",
	},
	{
		header: "Access-Control-Allow-Origin",
		wrong: "*",
		correct: "https://yourdomain.com",
		wrongDesc: "כל origin — data exfiltration",
		correctDesc: "Allowlist domain מפורש + Vary: Origin",
		icon: <Globe size={14} />,
		color: "oklch(0.62 0.22 25)",
	},
];

function SecurityHeadersSection() {
	return (
		<div className="space-y-4">
			{HEADERS_DATA.map((h) => (
				<div
					key={h.header}
					className="rounded-xl border border-[var(--color-border)] overflow-hidden"
				>
					<div
						className="flex items-center gap-2 px-4 py-2.5"
						style={{ background: `oklch(from ${h.color} l c h / 0.1)` }}
					>
						<span style={{ color: h.color }}>{h.icon}</span>
						<span
							className="text-xs font-mono font-semibold"
							style={{ color: h.color }}
						>
							{h.header}
						</span>
					</div>
					<div className="grid grid-cols-1 gap-0 md:grid-cols-2">
						<div className="px-4 py-3 border-b md:border-b-0 md:border-e border-[var(--color-border)]">
							<div className="flex items-center gap-1.5 mb-2">
								<Ban size={12} className="text-[var(--color-accent-red)]" />
								<span className="text-xs font-semibold text-[var(--color-accent-red)]">
									❌ WRONG
								</span>
							</div>
							<code
								dir="ltr"
								className="block text-xs font-mono px-2 py-1.5 rounded bg-[var(--color-bg-primary)] text-[var(--color-accent-red)] mb-1"
							>
								{h.wrong}
							</code>
							<p className="text-xs text-[var(--color-text-muted)]">
								{h.wrongDesc}
							</p>
						</div>
						<div className="px-4 py-3">
							<div className="flex items-center gap-1.5 mb-2">
								<CheckCircle2
									size={12}
									className="text-[var(--color-accent-green)]"
								/>
								<span className="text-xs font-semibold text-[var(--color-accent-green)]">
									✓ CORRECT
								</span>
							</div>
							<code
								dir="ltr"
								className="block text-xs font-mono px-2 py-1.5 rounded bg-[var(--color-bg-primary)] text-[var(--color-accent-green)] mb-1"
							>
								{h.correct}
							</code>
							<p className="text-xs text-[var(--color-text-muted)]">
								{h.correctDesc}
							</p>
						</div>
					</div>
				</div>
			))}

			{/* OAuth note */}
			<div className="rounded-xl p-4 border border-[oklch(0.65_0.18_250_/_0.3)] bg-[oklch(0.65_0.18_250_/_0.07)]">
				<div className="text-sm font-semibold text-[var(--color-accent-blue)] mb-2 flex items-center gap-2">
					<Key size={14} />
					Google One Tap — iOS Safari / Non-Chrome
				</div>
				<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
					<code className="font-mono text-[var(--color-accent-amber)]">
						gis.prompt()
					</code>{" "}
					משתמש ב-FedCM שהוא Chrome-only. ב-Safari ו-Firefox — שותק ומחזיר כלום.
					תמיד render את{" "}
					<code className="font-mono text-[var(--color-accent-green)]">
						google.accounts.id.renderButton(el, {"{"}type: 'standard'{"}"})
					</code>{" "}
					לתמיכה cross-browser.
				</p>
			</div>

			{/* strict-dynamic note */}
			<div className="rounded-xl p-4 border border-[oklch(0.78_0.16_75_/_0.3)] bg-[oklch(0.78_0.16_75_/_0.07)]">
				<div className="text-sm font-semibold text-[var(--color-accent-amber)] mb-2 flex items-center gap-2">
					<AlertTriangle size={14} />
					strict-dynamic CSP שובר Vite SPAs
				</div>
				<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
					Vite משתמש ב-hash-based inline scripts. עם{" "}
					<code className="font-mono text-[var(--color-accent-red)]">
						strict-dynamic
					</code>{" "}
					רק scripts שנטענו על ידי nonce-bearing scripts נסמכים — תוצאה: blocked
					scripts + white page בproduction. השתמש ב-explicit{" "}
					<code className="font-mono text-[var(--color-accent-green)]">
						script-src
					</code>{" "}
					עם hashes במקום.
				</p>
			</div>
		</div>
	);
}

// ── Section 7 — Scanning Tools ────────────────────────────────────────────────

const SCAN_TOOLS = [
	{
		name: "trivy",
		cmd: "trivy fs . --severity HIGH,CRITICAL",
		desc: "CVEs בdependencies, hardcoded secrets, IaC misconfiguration",
		when: "לפני כל FEATURE PR עם security code, לאחר הוספת deps",
		color: "oklch(0.62 0.22 25)",
		icon: <ShieldCheck size={20} />,
		badge: "MANDATORY",
	},
	{
		name: "semgrep",
		cmd: "semgrep scan . --config=auto",
		desc: "OWASP Top 10, XSS, SQL injection, React-specific patterns",
		when: "לפני PR עם auth/payments/RLS/API code",
		color: "oklch(0.65 0.18 250)",
		icon: <FileSearch size={20} />,
		badge: "SECURITY",
	},
	{
		name: "gitleaks",
		cmd: "# runs automatically in CI",
		desc: "Secrets שהתחייבו ל-git — passwords, API keys, tokens",
		when: "פועל אוטומטית בכל CI run",
		color: "oklch(0.78 0.16 75)",
		icon: <Eye size={20} />,
		badge: "CI AUTO",
	},
	{
		name: "socket",
		cmd: "socket npm install <pkg>",
		desc: "Malicious npm packages לפני התקנה — supply chain protection",
		when: "לפני הוספת כל dependency חדש",
		color: "oklch(0.62 0.2 290)",
		icon: <Package size={20} />,
		badge: "PRE-INSTALL",
	},
];

function ScanToolsSection() {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{SCAN_TOOLS.map((tool) => (
					<div
						key={tool.name}
						className="rounded-xl border p-4 space-y-3 transition-colors duration-150 hover:border-[var(--color-border-hover)]"
						style={{
							background: `oklch(from ${tool.color} l c h / 0.06)`,
							borderColor: `oklch(from ${tool.color} l c h / 0.25)`,
						}}
					>
						<div className="flex items-start gap-3">
							<div
								className="flex size-10 shrink-0 items-center justify-center rounded-xl"
								style={{
									background: `oklch(from ${tool.color} l c h / 0.18)`,
									color: tool.color,
								}}
							>
								{tool.icon}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<span
										className="text-sm font-bold font-mono"
										style={{ color: tool.color }}
									>
										{tool.name}
									</span>
									<Badge label={tool.badge} color={tool.color} />
								</div>
								<p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
									{tool.desc}
								</p>
							</div>
						</div>
						<CodeBlock>{tool.cmd}</CodeBlock>
						<div className="flex items-start gap-2 text-xs">
							<ChevronRight
								size={12}
								className="shrink-0 mt-0.5"
								style={{ color: tool.color }}
							/>
							<span className="text-[var(--color-text-muted)]">
								<strong className="text-[var(--color-text-secondary)]">
									מתי:
								</strong>{" "}
								{tool.when}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Severity gates */}
			<div className="rounded-xl border border-[oklch(0.62_0.22_25_/_0.35)] bg-[oklch(0.62_0.22_25_/_0.07)] p-4">
				<div className="text-sm font-semibold text-[var(--color-accent-red)] mb-3 flex items-center gap-2">
					<AlertTriangle size={14} />
					שערי חומרה — Severity Gates
				</div>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<div className="flex items-center gap-2 text-xs flex-wrap">
						<SeverityBadge level="CRITICAL" />
						<span className="text-[var(--color-text-secondary)]">
							כל CRITICAL מ-trivy ={" "}
							<strong className="text-[var(--color-accent-red)]">
								BLOCK MERGE
							</strong>{" "}
							— חייב לתקן
						</span>
					</div>
					<div className="flex items-center gap-2 text-xs flex-wrap">
						<SeverityBadge level="HIGH" />
						<span className="text-[var(--color-text-secondary)]">
							כל HIGH מ-semgrep על auth code ={" "}
							<strong className="text-[var(--color-accent-amber)]">
								FIX BEFORE PR
							</strong>
						</span>
					</div>
				</div>
			</div>

			{/* Proactive trigger table */}
			<div>
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
					<Terminal size={15} className="text-[var(--color-accent-cyan)]" />
					טריגרים אוטומטיים — מתי להריץ
				</h3>
				<div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
					<table className="w-full text-xs">
						<thead>
							<tr className="bg-[var(--color-bg-tertiary)]">
								<th className="px-4 py-3 text-start font-semibold text-[var(--color-text-secondary)]">
									מצב
								</th>
								<th className="px-4 py-3 text-start font-semibold text-[var(--color-text-secondary)]">
									כלי להריץ
								</th>
							</tr>
						</thead>
						<tbody>
							{[
								["קוד auth, API, RLS, payments", "trivy fs . + semgrep scan ."],
								["הוספת npm package", "socket npm install <pkg>"],
								["שינוי Supabase RLS policy", "trivy fs . + manual audit"],
								["לפני production deploy", "trivy + semgrep + lhci autorun"],
								["TypeScript + any risk", "type-coverage --at-least 90"],
							].map(([situation, tool]) => (
								<tr
									key={situation}
									className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
								>
									<td className="px-4 py-3 text-[var(--color-text-secondary)]">
										{situation}
									</td>
									<td
										className="px-4 py-3 font-mono text-[var(--color-accent-cyan)]"
										dir="ltr"
									>
										{tool}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

// ── Section 8 — Supply Chain ──────────────────────────────────────────────────

const SUPPLY_CHAIN_INCIDENTS = [
	{
		id: "SANDWORM",
		date: "פבר 24, 2026",
		title: "SANDWORM_MODE npm worm",
		severity: "CRITICAL" as Severity,
		desc: "19 חבילות typosquatting שמכוונות לCLI tools של AI (claude-code, cline, cursor). מתקינות backdoor via postinstall.",
		fix: "pnpm config set ignore-scripts true לחבילות untrusted. allowBuilds allowlist. minimumReleaseAge: 3d.",
		color: "oklch(0.62 0.22 25)",
	},
	{
		id: "CLINE",
		date: "פבר 17, 2026",
		title: "Cline CLI 2.3.0 compromise",
		severity: "CRITICAL" as Severity,
		desc: "npm publish שנפרצה התקינה backdoor. ביצוע מלא של קוד זר עם הרשאות ה-CLI.",
		fix: "Pin CLI tools לversions מאומתים. בדוק package_security.py blocklist. אל תשתמש @latest לCLI tools.",
		color: "oklch(0.62 0.22 25)",
	},
	{
		id: "TRIVY-TAGS",
		date: "מרץ 2026",
		title: "trivy-action tags compromised",
		severity: "HIGH" as Severity,
		desc: "75 מתוך 76 tags של aquasecurity/trivy-action נחטפו (supply chain attack). שימוש ב-@v0.x.x = ריצת קוד זר.",
		fix: "Pin לfull 40-char commit SHA. קבל SHA: gh api repos/aquasecurity/trivy-action/commits/main --jq '.sha'",
		color: "oklch(0.78 0.16 75)",
	},
	{
		id: "PNPM-PKG",
		date: "2026",
		title: "pnpm < 10.30.3 PackageGate",
		severity: "CRITICAL" as Severity,
		desc: "CVE-2025-69263 (CVSS 8.8) — lockfile integrity bypass: תוקף עורך lockfile להפניית חבילות. CVE-2025-69264 — HTTP tarball ללא hash → MITM injection.",
		fix: "עדכן pnpm >= 10.30.3. אמת: pnpm --version",
		color: "oklch(0.62 0.22 25)",
	},
];

const SUPPLY_CHAIN_RULES = [
	{
		icon: <Ban size={14} />,
		color: "oklch(0.62 0.22 25)",
		rule: "אסור @latest לCLI tools של AI",
		detail: "Pin לversions מאומתים בלבד",
	},
	{
		icon: <Package size={14} />,
		color: "oklch(0.78 0.16 75)",
		rule: "socket לפני כל npm install",
		detail: "supply chain verification לפני כל dep חדש",
	},
	{
		icon: <Key size={14} />,
		color: "oklch(0.65 0.18 250)",
		rule: "VAPID private keys בenv vars בלבד",
		detail: "לעולם לא בgit/docs — rotate מיד אם נחשפו",
	},
	{
		icon: <FileSearch size={14} />,
		color: "oklch(0.62 0.2 290)",
		rule: "trivy-action: SHA pin בלבד",
		detail: "Tags נפרצו — 40-char SHA בלבד",
	},
	{
		icon: <Lock size={14} />,
		color: "oklch(0.72 0.19 155)",
		rule: "pnpm.overrides לCVE patches",
		detail: "לא root-level overrides (מתעלם בשקט)",
	},
	{
		icon: <AlertTriangle size={14} />,
		color: "oklch(0.78 0.16 75)",
		rule: "package-lock.json + pnpm-lock.yaml = false CVEs",
		detail: "מחק package-lock.json בפרויקטי pnpm",
	},
];

function SupplyChainSection() {
	return (
		<div className="space-y-5">
			{/* Incidents */}
			<div className="space-y-3">
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
					<ShieldAlert size={15} className="text-[var(--color-accent-red)]" />
					אירועי supply chain אמיתיים (2026)
				</h3>
				{SUPPLY_CHAIN_INCIDENTS.map((inc) => (
					<div
						key={inc.id}
						className="rounded-xl border p-4"
						style={{
							background: `oklch(from ${inc.color} l c h / 0.06)`,
							borderColor: `oklch(from ${inc.color} l c h / 0.3)`,
						}}
					>
						<div className="flex items-start gap-3">
							<ShieldAlert
								size={16}
								className="shrink-0 mt-0.5"
								style={{ color: inc.color }}
							/>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 flex-wrap mb-1">
									<span className="text-sm font-bold text-[var(--color-text-primary)]">
										{inc.title}
									</span>
									<SeverityBadge level={inc.severity} />
									<span className="text-xs text-[var(--color-text-muted)]">
										{inc.date}
									</span>
								</div>
								<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-2">
									{inc.desc}
								</p>
								<div
									className="rounded-lg px-3 py-2 text-xs"
									style={{
										background: `oklch(from ${inc.color} l c h / 0.1)`,
										color: inc.color,
									}}
								>
									<strong>תיקון: </strong>
									{inc.fix}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Rules grid */}
			<div>
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
					<Shield size={15} className="text-[var(--color-accent-green)]" />
					כללי supply chain — תמיד
				</h3>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					{SUPPLY_CHAIN_RULES.map((r) => (
						<div
							key={r.rule}
							className="flex items-start gap-3 rounded-xl p-3 border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]"
						>
							<span
								className="flex size-7 shrink-0 items-center justify-center rounded-lg"
								style={{
									background: `oklch(from ${r.color} l c h / 0.15)`,
									color: r.color,
								}}
							>
								{r.icon}
							</span>
							<div>
								<div className="text-xs font-semibold text-[var(--color-text-primary)]">
									{r.rule}
								</div>
								<div className="text-xs text-[var(--color-text-muted)] mt-0.5">
									{r.detail}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* pnpm overrides code */}
			<div>
				<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
					<Package size={14} className="text-[var(--color-accent-amber)]" />
					pnpm.overrides — מיקום נכון
				</h3>
				<CodeBlock>{`// ❌ WRONG: root-level overrides — מתעלם בשקט ב-pnpm
{
  "overrides": { "serialize-javascript": "7.0.4" }
}

// ✓ CORRECT: overrides בתוך pnpm field
{
  "pnpm": {
    "overrides": {
      "serialize-javascript": "7.0.4",
      "tar": ">=7.5.11",
      "rollup": ">=4.59.0"
    }
  }
}`}</CodeBlock>
			</div>
		</div>
	);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function SecurityGuidePage() {
	const SECTIONS = [
		{
			id: "zero-trust",
			title: "Zero Trust — 3 עמודות",
			subtitle:
				"Never Trust · Always Verify · Least Privilege — שרשרת האימות המלאה",
			icon: <Shield size={20} />,
			accentColor: "oklch(0.65 0.18 250)",
			defaultOpen: true,
			content: <ZeroTrustSection />,
		},
		{
			id: "cve-table",
			title: "CVE טבלה קריטית",
			subtitle:
				"גרסאות מינימום נדרשות — React, Next.js, Hono, Node.js, pnpm, MCP",
			icon: <ShieldAlert size={20} />,
			accentColor: "oklch(0.62 0.22 25)",
			defaultOpen: false,
			content: <CveSection />,
		},
		{
			id: "ai-security",
			title: "אבטחת AI — 6 Layers Defense-in-Depth",
			subtitle: "Pipeline הגנה מלא על כל AI endpoint + OWASP LLM Top 10",
			icon: <Zap size={20} />,
			accentColor: "oklch(0.62 0.2 290)",
			defaultOpen: false,
			content: <AiSecuritySection />,
		},
		{
			id: "owasp-asi",
			title: "OWASP Agentic Security — ASI01-10",
			subtitle: "10 סיכוני אבטחה ייחודיים לסוכני AI ומיטיגציות מלאות",
			icon: <ShieldCheck size={20} />,
			accentColor: "oklch(0.78 0.16 75)",
			defaultOpen: false,
			content: <OwaspAsiSection />,
		},
		{
			id: "supabase-rls",
			title: "Supabase RLS — דפוסים קריטיים",
			subtitle: "מלכודות RLS נפוצות, Storage bucket rules, Edge Function CORS",
			icon: <Database size={20} />,
			accentColor: "oklch(0.75 0.14 200)",
			defaultOpen: false,
			content: <SupabaseRlsSection />,
		},
		{
			id: "security-headers",
			title: "Security Headers",
			subtitle: "COOP, CSP, X-XSS-Protection — הגדרות נכונות לעומת שגויות",
			icon: <Globe size={20} />,
			accentColor: "oklch(0.72 0.19 155)",
			defaultOpen: false,
			content: <SecurityHeadersSection />,
		},
		{
			id: "scan-tools",
			title: "כלי סריקה",
			subtitle: "trivy · semgrep · gitleaks · socket — מתי ואיך להריץ",
			icon: <Terminal size={20} />,
			accentColor: "oklch(0.72 0.19 155)",
			defaultOpen: false,
			content: <ScanToolsSection />,
		},
		{
			id: "supply-chain",
			title: "Supply Chain",
			subtitle:
				"SANDWORM worm · Cline compromise · trivy-action tags · pnpm PackageGate",
			icon: <Package size={20} />,
			accentColor: "oklch(0.62 0.22 25)",
			defaultOpen: false,
			content: <SupplyChainSection />,
		},
	];

	return (
		<div className="max-w-5xl mx-auto space-y-5">
			{/* ── Header ── */}
			<div className="glass-card px-6 py-5">
				<div className="flex items-start gap-4">
					<div
						className="flex size-12 shrink-0 items-center justify-center rounded-xl"
						style={{
							background: "oklch(0.62 0.22 25 / 0.2)",
							border: "1.5px solid oklch(0.62 0.22 25 / 0.4)",
						}}
					>
						<ShieldCheck size={24} style={{ color: "oklch(0.62 0.22 25)" }} />
					</div>
					<div className="flex-1 min-w-0">
						<h1 className="text-xl font-bold text-[var(--color-text-primary)]">
							אבטחה — מדריך מלא
						</h1>
						<p className="text-sm text-[var(--color-text-secondary)] mt-1 leading-relaxed">
							Zero Trust · CVE tracking · AI Security · OWASP ASI01-10 ·
							Supabase RLS · Security Headers · כלי סריקה · Supply Chain
						</p>
					</div>

					{/* Stats row */}
					<div className="hidden md:flex items-center gap-6 shrink-0">
						{[
							{
								label: "CVEs tracked",
								value: CVE_ROWS.length,
								color: "oklch(0.62 0.22 25)",
							},
							{
								label: "AI layers",
								value: 6,
								color: "oklch(0.62 0.2 290)",
							},
							{
								label: "ASI risks",
								value: 10,
								color: "oklch(0.78 0.16 75)",
							},
						].map((s) => (
							<div key={s.label} className="text-center">
								<div
									className="text-2xl font-bold font-mono"
									style={{ color: s.color }}
								>
									{s.value}
								</div>
								<div className="text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">
									{s.label}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Quick nav */}
				<div className="mt-4 flex items-center gap-2 flex-wrap">
					<span className="text-xs text-[var(--color-text-muted)]">
						קפיצה מהירה:
					</span>
					{SECTIONS.map((s) => (
						<a
							key={s.id}
							href={`#${s.id}`}
							className={cn(
								"text-xs px-2.5 py-1 rounded-lg border min-h-7 flex items-center",
								"border-[var(--color-border)] text-[var(--color-text-secondary)]",
								"hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)]",
								"transition-colors duration-150",
							)}
						>
							{s.title.split("—")[0].trim()}
						</a>
					))}
				</div>
			</div>

			{/* ── Sections ── */}
			{SECTIONS.map((s) => (
				<AccordionSection
					key={s.id}
					id={s.id}
					title={s.title}
					subtitle={s.subtitle}
					icon={s.icon}
					accentColor={s.accentColor}
					defaultOpen={s.defaultOpen}
				>
					{s.content}
				</AccordionSection>
			))}

			{/* ── Footer note ── */}
			<div className="glass-card px-5 py-4 flex items-start gap-3">
				<ShieldCheck
					size={16}
					className="shrink-0 mt-0.5 text-[var(--color-accent-green)]"
				/>
				<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
					<strong className="text-[var(--color-text-secondary)]">
						עדכון אוטומטי:
					</strong>{" "}
					trivy-autofix.yml רץ כל ראשון 03:00 ופותח PR אוטומטי עם pnpm.overrides
					patches. Renovate מעדכן dependencies שבועית. Socket.dev + CodeRabbit
					עובדים על כל PR. מדיניות zero-tolerance: כל CRITICAL מ-trivy = block
					merge.
				</p>
			</div>
		</div>
	);
}
