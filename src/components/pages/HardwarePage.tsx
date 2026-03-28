// rtl-ok — ECharts grid config uses "left"/"right" as chart margin labels, not CSS directional properties

import ReactECharts from "echarts-for-react";
import {
	Activity,
	ArrowLeftRight,
	Check,
	Cpu,
	Database,
	FolderGit2,
	GitBranch,
	Globe,
	Layers,
	MemoryStick,
	Monitor,
	Network,
	Server,
	Shield,
	Terminal,
	Wifi,
	Wrench,
	Zap,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

// ── Static machine data ─────────────────────────────────────────────────────

const POPOS_PROJECTS = [
	"mexicani",
	"chance-pro",
	"mediflow",
	"nadavai",
	"MEX",
	"ai-agent-system",
	"ai-assistant",
	"ai-stack",
	"design-system",
	"my-video",
	"signature-pro",
];

const LENOVO_PROJECTS = [
	"Z (cash-control)",
	"cash",
	"shifts",
	"hatumdigital",
	"brain",
	"SportChat",
	"vibechat",
	"FinanceApp",
	"YUVAI",
	"hatumdigital-next [ארכיב]",
];

const POPOS_TOOLS = [
	"act",
	"trivy",
	"semgrep",
	"git-cliff",
	"hurl",
	"k6",
	"knip",
	"type-coverage",
	"lhci",
];

const POPOS_SERVICES = [
	{ name: "Hydra Watcher", port: null, status: "healthy" as const },
	{ name: "Turbo Cache", port: 3030, status: "healthy" as const },
	{ name: "Dashboard API", port: 8743, status: "healthy" as const },
];

// ── Shared sub-components ───────────────────────────────────────────────────

function SectionTitle({
	icon,
	children,
}: {
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-2 mb-3">
			<span className="text-accent-blue" aria-hidden="true">
				{icon}
			</span>
			<h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
				{children}
			</h3>
		</div>
	);
}

function SpecRow({
	label,
	value,
	mono = false,
	highlight = false,
}: {
	label: string;
	value: React.ReactNode;
	mono?: boolean;
	highlight?: boolean;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-2 border-b border-border/40 last:border-0">
			<span className="text-sm text-text-muted shrink-0">{label}</span>
			<span
				className={cn(
					"text-sm text-start",
					mono && "font-mono text-xs",
					highlight ? "text-accent-blue font-semibold" : "text-text-primary",
				)}
			>
				{value}
			</span>
		</div>
	);
}

function ProjectPill({ name }: { name: string }) {
	const isArchived = name.includes("ארכיב");
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
				isArchived
					? "bg-bg-elevated text-text-muted line-through"
					: "bg-accent-blue/10 text-accent-blue",
			)}
		>
			{name}
		</span>
	);
}

function ToolBadge({ name }: { name: string }) {
	return (
		<span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-mono bg-bg-elevated text-text-secondary border border-border/60">
			{name}
		</span>
	);
}

function ServiceRow({
	name,
	port,
	status,
}: {
	name: string;
	port: number | null;
	status: "healthy" | "degraded" | "critical";
}) {
	return (
		<div className="flex items-center justify-between gap-3 py-1.5">
			<div className="flex items-center gap-2 min-w-0">
				<span
					className={cn(
						"w-2 h-2 rounded-full shrink-0",
						status === "healthy"
							? "bg-accent-green animate-pulse-status"
							: status === "degraded"
								? "bg-accent-amber"
								: "bg-accent-red",
					)}
					aria-hidden="true"
				/>
				<span className="text-sm text-text-secondary truncate">{name}</span>
			</div>
			<div className="flex items-center gap-2">
				{port && (
					<span className="text-xs font-mono text-text-muted" dir="ltr">
						:{port}
					</span>
				)}
				<StatusBadge status={status} size="sm" />
			</div>
		</div>
	);
}

// ── RAM gauge (ECharts) ──────────────────────────────────────────────────────

function RamGauge({
	usedGb,
	totalGb,
	color,
}: {
	usedGb: number;
	totalGb: number;
	color: string;
}) {
	const pct = Math.round((usedGb / totalGb) * 100);

	const option = {
		animation: true,
		series: [
			{
				type: "gauge",
				startAngle: 200,
				endAngle: -20,
				min: 0,
				max: totalGb,
				splitNumber: 4,
				itemStyle: {
					color,
					shadowColor: `${color}55`,
					shadowBlur: 10,
				},
				progress: {
					show: true,
					roundCap: true,
					width: 10,
				},
				pointer: { show: false },
				axisLine: {
					roundCap: true,
					lineStyle: {
						width: 10,
						color: [[1, "oklch(0.22 0.02 260)"]],
					},
				},
				axisTick: { show: false },
				splitLine: { show: false },
				axisLabel: { show: false },
				detail: {
					valueAnimation: true,
					formatter: `{value} GB\n${pct}%`,
					color: "oklch(0.95 0.01 260)",
					fontSize: 12,
					fontFamily: "Heebo, Inter, system-ui",
					offsetCenter: [0, "10%"],
				},
				data: [{ value: usedGb, name: "RAM" }],
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: 140, width: "100%" }}
			opts={{ renderer: "svg" }}
		/>
	);
}

// ── CI runners bar chart ─────────────────────────────────────────────────────

function CiRunnersChart({ popOs, lenovo }: { popOs: number; lenovo: number }) {
	// ECharts grid "left"/"right" are chart margin labels, not CSS direction — rtl-ok
	const option = {
		animation: true,
		grid: { top: 8, bottom: 24, left: 10, right: 10, containLabel: true }, // rtl-ok
		xAxis: {
			type: "category",
			data: ["Lenovo", "MSI"],
			axisLabel: {
				color: "oklch(0.55 0.02 260)",
				fontSize: 11,
				fontFamily: "Heebo, Inter, system-ui",
			},
			axisLine: { lineStyle: { color: "oklch(0.28 0.02 260)" } },
			axisTick: { show: false },
		},
		yAxis: {
			type: "value",
			axisLabel: {
				color: "oklch(0.55 0.02 260)",
				fontSize: 10,
			},
			splitLine: { lineStyle: { color: "oklch(0.22 0.02 260)" } },
		},
		series: [
			{
				type: "bar",
				data: [
					{
						value: popOs,
						itemStyle: {
							color: "oklch(0.65 0.18 250)",
							borderRadius: [4, 4, 0, 0],
						},
					},
					{
						value: lenovo,
						itemStyle: {
							color: "oklch(0.62 0.2 290)",
							borderRadius: [4, 4, 0, 0],
						},
					},
				],
				barMaxWidth: 40,
				label: {
					show: true,
					position: "top",
					color: "oklch(0.95 0.01 260)",
					fontSize: 13,
					fontWeight: "bold",
					fontFamily: "Heebo, Inter, system-ui",
				},
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: 140, width: "100%" }}
			opts={{ renderer: "svg" }}
		/>
	);
}

// ── CPU cores visual ─────────────────────────────────────────────────────────

function CpuCoresGrid({ count, color }: { count: number; color: string }) {
	return (
		<div className="flex flex-wrap gap-1">
			{Array.from({ length: count }).map((_, idx) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: static grid
					key={`core-${idx}`}
					className="w-4 h-4 rounded-sm transition-opacity duration-300"
					style={{ background: idx < count * 0.6 ? color : `${color}40` }}
					aria-hidden="true"
				/>
			))}
		</div>
	);
}

// ── Memory optimization chip ─────────────────────────────────────────────────

function MemChip({ label }: { label: string }) {
	return (
		<span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
			<Database size={10} aria-hidden="true" />
			{label}
		</span>
	);
}

// ── Network topology diagram ─────────────────────────────────────────────────

function NetworkTopology() {
	return (
		<div className="relative flex items-center justify-center gap-0 py-6">
			{/* Lenovo node (primary) */}
			<div className="flex flex-col items-center gap-2 z-10">
				<div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-accent-blue/20 border-2 border-accent-blue/50 shadow-[0_0_20px_oklch(0.65_0.18_250/0.3)]">
					<Monitor size={28} className="text-accent-blue" aria-hidden="true" />
				</div>
				<div className="text-center">
					<div className="text-xs font-bold text-text-primary">Lenovo</div>
					<div className="text-xs font-mono text-text-muted" dir="ltr">
						100.82.33.122
					</div>
				</div>
			</div>

			{/* Connection line with Tailscale hub */}
			<div className="flex flex-col items-center gap-1 mx-4 z-10">
				<div className="flex items-center gap-2">
					<div className="w-16 h-0.5 bg-gradient-to-e from-accent-blue to-accent-purple rounded-full" />
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-elevated border border-border shadow-md">
						<Network
							size={16}
							className="text-accent-cyan"
							aria-hidden="true"
						/>
					</div>
					<div className="w-16 h-0.5 bg-gradient-to-e from-accent-purple to-accent-blue rounded-full" />
				</div>
				<div className="text-xs text-text-muted mt-1">Tailscale</div>
				<div className="flex items-center gap-1">
					<span
						className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-status"
						aria-hidden="true"
					/>
					<span className="text-xs text-accent-green">מחובר</span>
				</div>
			</div>

			{/* MSI node (secondary) */}
			<div className="flex flex-col items-center gap-2 z-10">
				<div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-accent-purple/20 border-2 border-accent-purple/50 shadow-[0_0_20px_oklch(0.62_0.2_290/0.3)]">
					<Server size={28} className="text-accent-purple" aria-hidden="true" />
				</div>
				<div className="text-center">
					<div className="text-xs font-bold text-text-primary">MSI</div>
					<div className="text-xs font-mono text-text-muted" dir="ltr">
						100.87.247.87
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Sync operation row ───────────────────────────────────────────────────────

function SyncOpRow({ cmd, desc }: { cmd: string; desc: string }) {
	return (
		<div className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
			<Terminal
				size={14}
				className="text-accent-amber mt-0.5 shrink-0"
				aria-hidden="true"
			/>
			<div className="min-w-0">
				<code className="text-xs font-mono text-accent-amber block" dir="ltr">
					{cmd}
				</code>
				<span className="text-xs text-text-muted">{desc}</span>
			</div>
		</div>
	);
}

// ── Comparison table ─────────────────────────────────────────────────────────

interface CompareRow {
	feature: string;
	popos: React.ReactNode;
	lenovo: React.ReactNode;
	advantage?: "popos" | "lenovo" | "equal";
}

const COMPARE_ROWS: CompareRow[] = [
	{
		feature: "זיכרון RAM",
		popos: "64 GB",
		lenovo: "64 GB",
		advantage: "equal",
	},
	{
		feature: "ליבות CPU",
		popos: "Intel Core Ultra 9 275HX / 24",
		lenovo: "סטנדרטי",
		advantage: "popos",
	},
	{ feature: "אחסון", popos: "~500 GB SSD", lenovo: "SSD", advantage: "popos" },
	{
		feature: "מערכת הפעלה",
		popos: "Pop!_OS 24.04",
		lenovo: "Windows 11",
		advantage: "equal",
	},
	{ feature: "פרויקטים", popos: "11", lenovo: "10", advantage: "equal" },
	{ feature: "ריצות CI", popos: "~17", lenovo: "5", advantage: "popos" },
	{
		feature: "תפקיד ראשי",
		popos: "פיתוח + Hydra",
		lenovo: "פיתוח + Flutter",
		advantage: "equal",
	},
	{
		feature: "GPU",
		popos: "RTX 5070 Ti Laptop",
		lenovo: "RTX 4060 Mobile",
		advantage: "popos",
	},
	{
		feature: "Node.js",
		popos: "v24.14.0 (fnm)",
		lenovo: "v24.x (fnm)",
		advantage: "equal",
	},
	{
		feature: "Flutter",
		popos: "—",
		lenovo: "~/.flutter-sdk",
		advantage: "lenovo",
	},
	{
		feature: "ZRAM",
		popos: "200 GB lz4",
		lenovo: "—",
		advantage: "popos",
	},
	{
		feature: "Rollup threads",
		popos: "—",
		lenovo: "ROLLUP_NATIVE_THREADS=0",
		advantage: "equal",
	},
];

function CompareTable() {
	return (
		<div className="overflow-x-auto">
			<table
				className="w-full text-sm border-collapse"
				aria-label="השוואת מכונות"
			>
				<thead>
					<tr className="border-b border-border">
						<th
							className="text-start pe-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider w-1/3"
							scope="col"
						>
							תכונה
						</th>
						<th
							className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider w-1/3"
							style={{ color: "oklch(0.65 0.18 250)" }}
							scope="col"
						>
							Lenovo
						</th>
						<th
							className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider w-1/3"
							style={{ color: "oklch(0.62 0.2 290)" }}
							scope="col"
						>
							MSI
						</th>
					</tr>
				</thead>
				<tbody>
					{COMPARE_ROWS.map(({ feature, popos, lenovo, advantage }) => (
						<tr
							key={feature}
							className="border-b border-border/40 hover:bg-bg-tertiary/50 transition-colors duration-100"
						>
							<td className="pe-4 py-2.5 text-text-muted text-xs font-medium">
								{feature}
							</td>
							<td
								className={cn(
									"text-center px-4 py-2.5",
									advantage === "popos"
										? "text-accent-blue font-semibold"
										: "text-text-secondary",
								)}
							>
								<span className="flex items-center justify-center gap-1.5">
									{advantage === "popos" && (
										<Check
											size={12}
											className="text-accent-blue"
											aria-hidden="true"
										/>
									)}
									{popos}
								</span>
							</td>
							<td
								className={cn(
									"text-center px-4 py-2.5",
									advantage === "lenovo"
										? "text-accent-purple font-semibold"
										: "text-text-secondary",
								)}
							>
								<span className="flex items-center justify-center gap-1.5">
									{advantage === "lenovo" && (
										<Check
											size={12}
											className="text-accent-purple"
											aria-hidden="true"
										/>
									)}
									{lenovo}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

// ── Resource panel (per machine) ─────────────────────────────────────────────

function ResourcePanel({
	machineName,
	ramUsed,
	ramTotal,
	diskUsed,
	diskTotal,
	cpuCores,
	ciRunners,
	totalCiRunners,
	color,
}: {
	machineName: string;
	ramUsed: number;
	ramTotal: number;
	diskUsed: number;
	diskTotal: number;
	cpuCores: number | null;
	ciRunners: number;
	totalCiRunners: number;
	color: string;
}) {
	const diskPct = Math.round((diskUsed / diskTotal) * 100);
	const ciPct = Math.round((ciRunners / totalCiRunners) * 100);

	return (
		<div className="glass-card p-5 space-y-5">
			{/* Header */}
			<div className="flex items-center gap-2">
				<span
					className="w-2.5 h-2.5 rounded-full"
					style={{ background: color }}
					aria-hidden="true"
				/>
				<span className="text-sm font-bold text-text-primary">
					{machineName}
				</span>
			</div>

			{/* RAM Gauge */}
			<div>
				<div className="text-xs text-text-muted mb-1 flex items-center justify-between">
					<span className="flex items-center gap-1">
						<MemoryStick size={11} aria-hidden="true" />
						זיכרון RAM
					</span>
					<span dir="ltr" className="font-mono">
						{ramUsed} / {ramTotal} GB
					</span>
				</div>
				<RamGauge usedGb={ramUsed} totalGb={ramTotal} color={color} />
			</div>

			{/* Progress bars */}
			<div className="space-y-3">
				<ProgressBar
					label="אחסון דיסק"
					value={diskPct}
					color={color}
					size="sm"
					showValue
				/>
				<div>
					<div className="flex items-center justify-between mb-1.5">
						<span className="text-xs font-medium text-text-secondary flex items-center gap-1">
							<GitBranch size={11} aria-hidden="true" />
							ריצות CI
						</span>
						<span
							className="text-xs font-mono tabular-nums text-text-muted"
							dir="ltr"
						>
							{ciRunners}
						</span>
					</div>
					<ProgressBar
						value={ciPct}
						color={color}
						size="sm"
						showValue={false}
					/>
				</div>
			</div>

			{/* CPU cores grid */}
			{cpuCores && (
				<div>
					<div className="text-xs text-text-muted mb-2 flex items-center gap-1">
						<Cpu size={11} aria-hidden="true" />
						{cpuCores} ליבות CPU
					</div>
					<CpuCoresGrid count={cpuCores} color={color} />
				</div>
			)}
		</div>
	);
}

// ── Machine card ─────────────────────────────────────────────────────────────

interface MachineCardProps {
	isPrimary: boolean;
	nickname: string;
	fullName: string;
	hostname: string;
	ip: string;
	cpu: string;
	ram: string;
	gpu?: string;
	storage: string;
	os: string;
	machineRole: string;
	projects: string[];
	ciRunners: string;
	services?: Array<{
		name: string;
		port: number | null;
		status: "healthy" | "degraded" | "critical";
	}>;
	memOptimizations?: string[];
	nodejsVersion?: string;
	tools?: string[];
	criticalNote?: string;
	flutterPath?: string;
	connectionNote?: string;
	accentColor: string;
	roleIcon: React.ReactNode;
}

function MachineCard({
	isPrimary,
	nickname,
	fullName,
	hostname,
	ip,
	cpu,
	ram,
	gpu,
	storage,
	os,
	machineRole,
	projects,
	ciRunners,
	services,
	memOptimizations,
	nodejsVersion,
	tools,
	criticalNote,
	flutterPath,
	connectionNote,
	accentColor,
	roleIcon,
}: MachineCardProps) {
	return (
		<article
			className="glass-card p-6 flex flex-col gap-5"
			style={{ borderColor: `${accentColor}30` }}
			aria-label={`מחשב ${nickname}`}
		>
			{/* Card header */}
			<div className="flex items-start gap-4">
				<div
					className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0"
					style={{
						background: `${accentColor}18`,
						border: `2px solid ${accentColor}40`,
						boxShadow: `0 0 20px ${accentColor}25`,
					}}
				>
					<span style={{ color: accentColor }}>{roleIcon}</span>
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2 flex-wrap">
						<h2
							className="text-lg font-bold text-text-primary"
							style={{ color: accentColor }}
						>
							{nickname}
						</h2>
						{isPrimary && (
							<span
								className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
								style={{
									background: `${accentColor}15`,
									color: accentColor,
									border: `1px solid ${accentColor}30`,
								}}
							>
								<Zap size={10} aria-hidden="true" />
								ראשי
							</span>
						)}
					</div>
					<div className="text-sm text-text-secondary mt-0.5">{fullName}</div>
					<div className="flex items-center gap-2 mt-1">
						<Wifi
							size={12}
							className="text-accent-green shrink-0"
							aria-hidden="true"
						/>
						<code className="text-xs font-mono text-text-muted" dir="ltr">
							{ip}
						</code>
					</div>
				</div>

				<StatusBadge status="healthy" size="sm" />
			</div>

			{/* Critical note banner */}
			{criticalNote && (
				<div className="flex items-start gap-2 p-3 rounded-lg bg-accent-amber/10 border border-accent-amber/25">
					<Shield
						size={14}
						className="text-accent-amber shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<code
						className="text-xs font-mono text-accent-amber break-all"
						dir="ltr"
					>
						{criticalNote}
					</code>
				</div>
			)}

			{/* Specs */}
			<section aria-label="מפרט טכני">
				<SectionTitle icon={<Cpu size={14} />}>מפרט</SectionTitle>
				<div className="space-y-0 bg-bg-elevated/50 rounded-lg px-3">
					<SpecRow label="שם מארח" value={hostname} mono />
					<SpecRow label="CPU" value={cpu} />
					<SpecRow label="RAM" value={ram} highlight />
					{gpu && <SpecRow label="GPU" value={gpu} />}
					<SpecRow label="אחסון" value={storage} />
					<SpecRow label="מערכת הפעלה" value={os} />
					<SpecRow label="תפקיד" value={machineRole} />
					<SpecRow label="ריצות CI" value={ciRunners} />
					{nodejsVersion && (
						<SpecRow label="Node.js" value={nodejsVersion} mono />
					)}
					{flutterPath && <SpecRow label="Flutter" value={flutterPath} mono />}
					{connectionNote && <SpecRow label="חיבור" value={connectionNote} />}
				</div>
			</section>

			{/* Memory optimizations */}
			{memOptimizations && memOptimizations.length > 0 && (
				<section aria-label="אופטימיזציות זיכרון">
					<SectionTitle icon={<Database size={14} />}>
						אופטימיזציות זיכרון
					</SectionTitle>
					<div className="flex flex-wrap gap-1.5">
						{memOptimizations.map((opt) => (
							<MemChip key={opt} label={opt} />
						))}
					</div>
				</section>
			)}

			{/* Active services */}
			{services && services.length > 0 && (
				<section aria-label="שירותים פעילים">
					<SectionTitle icon={<Activity size={14} />}>שירותים</SectionTitle>
					<div className="bg-bg-elevated/50 rounded-lg px-3">
						{services.map((svc) => (
							<ServiceRow
								key={svc.name}
								name={svc.name}
								port={svc.port}
								status={svc.status}
							/>
						))}
					</div>
				</section>
			)}

			{/* Projects */}
			<section aria-label="פרויקטים">
				<SectionTitle icon={<FolderGit2 size={14} />}>
					פרויקטים ({projects.length})
				</SectionTitle>
				<div className="flex flex-wrap gap-1.5">
					{projects.map((p) => (
						<ProjectPill key={p} name={p} />
					))}
				</div>
			</section>

			{/* CLI Tools */}
			{tools && tools.length > 0 && (
				<section aria-label="כלי פיתוח">
					<SectionTitle icon={<Wrench size={14} />}>כלי CLI</SectionTitle>
					<div className="flex flex-wrap gap-1.5">
						{tools.map((t) => (
							<ToolBadge key={t} name={t} />
						))}
					</div>
				</section>
			)}
		</article>
	);
}

// ── Main page ────────────────────────────────────────────────────────────────

export function HardwarePage() {
	return (
		<div className="space-y-8" dir="rtl">
			{/* Page header */}
			<header>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-blue/15 border border-accent-blue/30">
						<Monitor
							size={20}
							className="text-accent-blue"
							aria-hidden="true"
						/>
					</div>
					<div>
						<h1 className="text-xl font-bold text-text-primary">
							חומרה ומכונות
						</h1>
						<p className="text-sm text-text-muted mt-0.5">
							מפרט מלא וניטור שתי מכונות הפיתוח
						</p>
					</div>
				</div>
			</header>

			{/* Machine cards side by side */}
			<section aria-label="מכונות פיתוח">
				<h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
					מכונות
				</h2>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<MachineCard
						isPrimary
						nickname="Lenovo"
						fullName="Lenovo"
						hostname="pop-os"
						ip="100.82.33.122"
						cpu="Intel Core Ultra 9 275HX — 24 ליבות"
						ram="64 GB"
						gpu="RTX 5070 Ti Laptop"
						storage="~500 GB SSD"
						os="Pop!_OS 24.04"
						machineRole="מכונת הפיתוח הראשית"
						projects={POPOS_PROJECTS}
						ciRunners="~17"
						services={POPOS_SERVICES}
						memOptimizations={[
							"ZRAM 200 GB lz4",
							"swappiness=180",
							"THP=defer+madvise",
							"earlyoom פעיל",
						]}
						nodejsVersion="v24.14.0 (fnm)"
						tools={POPOS_TOOLS}
						accentColor="oklch(0.65 0.18 250)"
						roleIcon={<Monitor size={28} />}
					/>

					<MachineCard
						isPrimary={false}
						nickname="MSI"
						fullName="MSI"
						hostname="msi"
						ip="100.87.247.87"
						cpu="סטנדרטי"
						ram="64 GB"
						storage="SSD"
						gpu="RTX 4060 Mobile"
						os="Windows 11"
						machineRole="פיתוח משני + Flutter"
						projects={LENOVO_PROJECTS}
						ciRunners="5"
						criticalNote="ROLLUP_NATIVE_THREADS=0"
						flutterPath="~/.flutter-sdk/bin/flutter"
						connectionNote="Tailscale SSH מ-Lenovo"
						nodejsVersion="v24.x (fnm)"
						accentColor="oklch(0.62 0.2 290)"
						roleIcon={<Server size={28} />}
					/>
				</div>
			</section>

			{/* Resource charts */}
			<section aria-label="משאבים">
				<h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
					ניצול משאבים (הערכה)
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<ResourcePanel
						machineName="Lenovo"
						ramUsed={28}
						ramTotal={64}
						diskUsed={220}
						diskTotal={500}
						cpuCores={24}
						ciRunners={17}
						totalCiRunners={22}
						color="oklch(0.65 0.18 250)"
					/>
					<ResourcePanel
						machineName="MSI"
						ramUsed={14}
						ramTotal={64}
						diskUsed={150}
						diskTotal={300}
						cpuCores={null}
						ciRunners={5}
						totalCiRunners={22}
						color="oklch(0.62 0.2 290)"
					/>
				</div>
			</section>

			{/* CI runners comparison chart */}
			<section aria-label="השוואת ריצות CI">
				<div className="glass-card p-5">
					<div className="flex items-center gap-2 mb-4">
						<GitBranch
							size={16}
							className="text-accent-blue"
							aria-hidden="true"
						/>
						<h2 className="text-sm font-semibold text-text-primary">
							ריצות CI לפי מכונה
						</h2>
					</div>
					<CiRunnersChart popOs={17} lenovo={5} />
				</div>
			</section>

			{/* Network section */}
			<section aria-label="רשת ותקשורת">
				<h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
					רשת ותקשורת
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Topology */}
					<div className="glass-card p-5">
						<div className="flex items-center gap-2 mb-1">
							<Network
								size={16}
								className="text-accent-cyan"
								aria-hidden="true"
							/>
							<h3 className="text-sm font-semibold text-text-primary">
								Tailscale Mesh
							</h3>
						</div>
						<p className="text-xs text-text-muted mb-2">
							רשת mesh מוצפנת בין המכונות
						</p>
						<NetworkTopology />
						<div className="mt-3 grid grid-cols-2 gap-3 text-xs">
							<div className="flex items-center gap-2 p-2 rounded-lg bg-bg-elevated/60">
								<Globe
									size={12}
									className="text-accent-blue"
									aria-hidden="true"
								/>
								<div>
									<div className="font-medium text-text-secondary">
										IP Lenovo
									</div>
									<code className="text-text-muted font-mono" dir="ltr">
										100.82.33.122
									</code>
								</div>
							</div>
							<div className="flex items-center gap-2 p-2 rounded-lg bg-bg-elevated/60">
								<Globe
									size={12}
									className="text-accent-purple"
									aria-hidden="true"
								/>
								<div>
									<div className="font-medium text-text-secondary">IP MSI</div>
									<code className="text-text-muted font-mono" dir="ltr">
										100.87.247.87
									</code>
								</div>
							</div>
						</div>
					</div>
					{/* Sync operations */}
					<div className="glass-card p-5">
						<div className="flex items-center gap-2 mb-1">
							<ArrowLeftRight
								size={16}
								className="text-accent-amber"
								aria-hidden="true"
							/>
							<h3 className="text-sm font-semibold text-text-primary">
								פעולות סנכרון
							</h3>
						</div>
						<p className="text-xs text-text-muted mb-4">
							סנכרון קבצי קונפיגורציה ותצורה
						</p>
						<div className="space-y-0">
							<SyncOpRow
								cmd="claude-sync push"
								desc="דחיפת הגדרות מ-Lenovo ל-MSI"
							/>
							<SyncOpRow cmd="claude-sync pull" desc="משיכת עדכונים מ-MSI" />
							<SyncOpRow
								cmd="rsync -avz ~/.claude/ msi:~/.claude/"
								desc="סנכרון ספריות שאינן git"
							/>
							<SyncOpRow
								cmd="ssh 100.87.247.87"
								desc="גישה ישירה ל-MSI ב-Tailscale"
							/>
						</div>
						<div className="mt-4 p-3 rounded-lg bg-accent-amber/8 border border-accent-amber/20">
							<div className="flex items-start gap-2">
								<Layers
									size={13}
									className="text-accent-amber shrink-0 mt-0.5"
									aria-hidden="true"
								/>
								<p className="text-xs text-text-secondary">
									<span className="font-semibold text-accent-amber">
										סדר סנכרון:
									</span>{" "}
									push במקור ← pull ביעד ← פתרון קונפליקטים JSONL עם{" "}
									<code className="font-mono">git checkout --theirs</code>
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Comparison table */}
			<section aria-label="טבלת השוואה">
				<div className="glass-card p-5">
					<div className="flex items-center gap-2 mb-5">
						<ArrowLeftRight
							size={16}
							className="text-accent-blue"
							aria-hidden="true"
						/>
						<h2 className="text-sm font-semibold text-text-primary">
							השוואה מלאה
						</h2>
					</div>
					<CompareTable />
				</div>
			</section>

			{/* Quick-fact stat cards */}
			<section aria-label="עובדות מהירות">
				<h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
					עובדות מהירות
				</h2>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
					{[
						{
							icon: <MemoryStick size={18} />,
							label: "סה״כ RAM",
							value: "94 GB",
							color: "oklch(0.65 0.18 250)",
						},
						{
							icon: <GitBranch size={18} />,
							label: "סה״כ ריצות CI",
							value: "~22",
							color: "oklch(0.72 0.19 155)",
						},
						{
							icon: <FolderGit2 size={18} />,
							label: "סה״כ פרויקטים",
							value: "21",
							color: "oklch(0.78 0.16 75)",
						},
						{
							icon: <Wifi size={18} />,
							label: "רשת Tailscale",
							value: "פעיל",
							color: "oklch(0.72 0.19 155)",
						},
					].map(({ icon, label, value, color }) => (
						<div key={label} className="glass-card p-4 flex items-center gap-4">
							<div
								className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
								style={{
									background: `${color}15`,
									border: `1px solid ${color}30`,
								}}
							>
								<span style={{ color }}>{icon}</span>
							</div>
							<div>
								<div className="text-xl font-bold" dir="ltr" style={{ color }}>
									{value}
								</div>
								<div className="text-xs text-text-muted">{label}</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Lenovo critical rules */}
			<section aria-label="כללים קריטיים MSI">
				<div
					className="glass-card p-5"
					style={{ borderColor: "oklch(0.78 0.16 75 / 0.25)" }}
				>
					<div className="flex items-center gap-2 mb-4">
						<Shield
							size={16}
							className="text-accent-amber"
							aria-hidden="true"
						/>
						<h2 className="text-sm font-semibold text-text-primary">
							כללים קריטיים — MSI
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{[
							{
								title: "ROLLUP_NATIVE_THREADS=0",
								desc: "חובה בכל build Vite/Rollup — ללא זה Rollup קורס",
							},
							{
								title: "~/.flutter-sdk/bin/flutter",
								desc: "נתיב Flutter הנכון — לא ~/.local/bin/flutter",
							},
							{
								title: "Z (cash-control) — npm בלבד",
								desc: "packageManager: npm@10.9.2 — לא pnpm",
							},
							{
								title: "git operations ב-SSH",
								desc: "פעולות git ב-MSI דרך Python subprocess",
							},
						].map(({ title, desc }) => (
							<div
								key={title}
								className="flex items-start gap-3 p-3 rounded-lg bg-accent-amber/8 border border-accent-amber/15"
							>
								<Shield
									size={13}
									className="text-accent-amber shrink-0 mt-0.5"
									aria-hidden="true"
								/>
								<div>
									<code className="text-xs font-mono text-accent-amber block">
										{title}
									</code>
									<span className="text-xs text-text-muted mt-0.5 block">
										{desc}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Lenovo services detail */}
			<section aria-label="שירותי Lenovo">
				<div className="glass-card p-5">
					<div className="flex items-center gap-2 mb-4">
						<Server size={16} className="text-accent-blue" aria-hidden="true" />
						<h2 className="text-sm font-semibold text-text-primary">
							שירותים פעילים — Lenovo
						</h2>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{[
							{
								name: "Hydra Watcher",
								desc: "מנהל תורי משימות LangGraph",
								port: null,
								color: "oklch(0.72 0.19 155)",
							},
							{
								name: "Turbo Cache",
								desc: "Turborepo Remote Cache Server",
								port: 3030,
								color: "oklch(0.78 0.16 75)",
							},
							{
								name: "Dashboard API",
								desc: "API לדשבורד זה",
								port: 8743,
								color: "oklch(0.65 0.18 250)",
							},
						].map(({ name, desc, port, color }) => (
							<div
								key={name}
								className="flex flex-col gap-2 p-4 rounded-xl"
								style={{
									background: `${color}0a`,
									border: `1px solid ${color}25`,
								}}
							>
								<div className="flex items-center justify-between">
									<span className="text-sm font-semibold text-text-primary">
										{name}
									</span>
									{port && (
										<code
											className="text-xs font-mono rounded px-1.5 py-0.5"
											dir="ltr"
											style={{
												background: `${color}15`,
												color,
											}}
										>
											:{port}
										</code>
									)}
								</div>
								<span className="text-xs text-text-muted">{desc}</span>
								<div className="flex items-center gap-1.5 mt-1">
									<span
										className="w-1.5 h-1.5 rounded-full animate-pulse-status"
										style={{ background: color }}
										aria-hidden="true"
									/>
									<span className="text-xs" style={{ color }}>
										פעיל
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
