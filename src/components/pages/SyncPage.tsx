import {
	AlertTriangle,
	ArrowLeftRight,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Clock,
	FileCode2,
	FolderSync,
	GitBranch,
	Globe,
	HardDrive,
	Info,
	Laptop2,
	RefreshCw,
	Server,
	Shield,
	Terminal,
	Wifi,
	WifiOff,
	X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

// ── Types ────────────────────────────────────────────────────────────────────

interface MachineCard {
	name: string;
	role: "primary" | "secondary";
	ip: string;
	hostname: string;
	tailscaleConnected: boolean;
	lastSync: string;
	filesSynced: number;
	driftCount: number;
	os: string;
}

interface SyncItem {
	item: string;
	synced: boolean;
	method: string;
	notes: string;
}

interface DevConfigFile {
	path: string;
	source: string;
	description: string;
}

interface SyncCommand {
	cmd: string;
	description: string;
	direction?: "push" | "pull" | "both" | "manual";
}

interface KnownIssue {
	title: string;
	cause: string;
	fix: string;
	severity: "warn" | "info" | "critical";
}

// ── Static Data ──────────────────────────────────────────────────────────────

const MACHINES: MachineCard[] = [
	{
		name: "pop-os",
		role: "primary",
		ip: "100.82.33.122",
		hostname: "nadavcohen-system76",
		tailscaleConnected: true,
		lastSync: "לפני 4 דקות",
		filesSynced: 892,
		driftCount: 0,
		os: "Pop!_OS 22.04 LTS",
	},
	{
		name: "MSI",
		role: "secondary",
		ip: "100.87.247.87",
		hostname: "msi",
		tailscaleConnected: true,
		lastSync: "לפני 4 דקות",
		filesSynced: 892,
		driftCount: 2,
		os: "Ubuntu 22.04 LTS",
	},
];

const SYNC_TABLE: SyncItem[] = [
	{
		item: "hooks/",
		synced: true,
		method: "git",
		notes: "57+ קבצים, rsync עם --delete",
	},
	{
		item: "rules/",
		synced: true,
		method: "git",
		notes: "11 קבצי חוקים",
	},
	{
		item: "skills/",
		synced: true,
		method: "git",
		notes: "78+ מיומנויות",
	},
	{
		item: "agents/",
		synced: true,
		method: "git",
		notes: "45 סוכנים",
	},
	{
		item: "knowledge/",
		synced: true,
		method: "git + rsync",
		notes: "JSONL דרך rsync, לא git merge",
	},
	{
		item: "settings.json",
		synced: false,
		method: "ידני",
		notes: "ספציפי למכונה — MAX_AGENTS, model IDs",
	},
	{
		item: ".claude.json",
		synced: false,
		method: "לא מסונכרן",
		notes: "ספציפי לסשן — session state",
	},
	{
		item: "plugins/",
		synced: false,
		method: "לא מסונכרן",
		notes: "התקנות מקומיות",
	},
	{
		item: "projects/",
		synced: false,
		method: "לא מסונכרן",
		notes: "ממורות פרויקט מקומיות",
	},
	{
		item: "dev configs",
		synced: true,
		method: "mirror",
		notes: ".gitconfig, .npmrc, .pnpmrc, .bunfig.toml, .dart_test.yaml",
	},
];

const DEV_CONFIGS: DevConfigFile[] = [
	{
		path: "~/.gitconfig",
		source: "~/.claude/config/external/gitconfig",
		description: "Git user config, signing, aliases",
	},
	{
		path: "~/.npmrc",
		source: "~/.claude/config/external/npmrc",
		description: "npm/node memory limits, registry",
	},
	{
		path: "~/.bunfig.toml",
		source: "~/.claude/config/external/bunfig.toml",
		description: "Bun runtime config",
	},
	{
		path: "~/.pnpmrc",
		source: "~/.claude/config/external/pnpmrc",
		description: "pnpm settings, store path",
	},
	{
		path: "~/.dart_test.yaml",
		source: "~/.claude/config/external/dart_test.yaml",
		description: "Dart test runner config",
	},
];

const SYNC_COMMANDS: SyncCommand[] = [
	{
		cmd: "claude-sync push",
		description: "דחוף שינויים מהמכונה הנוכחית",
		direction: "push",
	},
	{
		cmd: "claude-sync pull",
		description: "משוך שינויים על המכונה היעד",
		direction: "pull",
	},
	{
		cmd: "auto-sync-all.sh",
		description: "סנכרון מלא על המכונה היעד (אחרי pull)",
		direction: "both",
	},
	{
		cmd: "rsync -avz --delete ~/.claude/ user@host:~/.claude/",
		description: "rsync ידני — מסנכרן הכל כולל מחיקות",
		direction: "manual",
	},
];

const KNOWN_ISSUES: KnownIssue[] = [
	{
		title: "JSONL merge conflicts",
		cause: "git merge על קבצי JSONL שובר את ה-JSON per-line structure",
		fix: "לעולם לא git merge. השתמש תמיד ב-rsync או git checkout --theirs",
		severity: "critical",
	},
	{
		title: "settings.json לא מסונכרן",
		cause: "settings.json ספציפי למכונה — MAX_AGENTS, model IDs שונים",
		fix: "שנה ידנית ב-MSI דרך SSH אחרי כל שינוי ב-pop-os",
		severity: "warn",
	},
	{
		title: "הוקים מיושנים ב-MSI",
		cause: "rsync ללא --delete משאיר קבצים ישנים שנמחקו מ-pop-os",
		fix: "השתמש ב-rsync -avz --delete ~/.claude/hooks/ host:~/.claude/hooks/",
		severity: "warn",
	},
	{
		title: "אי-התאמת גרסת Node.js",
		cause:
			"fnm מוגדר אחרי ה-interactive guard ב-.bashrc — SSH sessions לא מקבלים fnm",
		fix: "העבר fnm PATH לפני case $- in *i*) ב-.bashrc על שתי המכונות",
		severity: "critical",
	},
];

// ── Sub-components ───────────────────────────────────────────────────────────

function PageHeader({ onRefresh }: { onRefresh: () => void }) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-blue/15 shrink-0">
					<RefreshCw
						size={20}
						className="text-accent-blue"
						aria-hidden="true"
					/>
				</div>
				<div>
					<h1 className="text-2xl font-bold text-text-primary">
						סנכרון מכונות
					</h1>
					<p className="text-sm text-text-muted mt-0.5">
						pop-os ↔ MSI — claude-sync via Tailscale
					</p>
				</div>
			</div>
			<button
				type="button"
				onClick={onRefresh}
				className={cn(
					"flex items-center gap-2 rounded-lg px-4 py-2",
					"text-sm font-medium text-text-secondary",
					"border border-border hover:border-border-hover",
					"hover:text-text-primary hover:bg-bg-tertiary",
					"transition-all duration-150 min-h-11",
				)}
			>
				<RefreshCw size={15} aria-hidden="true" />
				רענן
			</button>
		</div>
	);
}

function MachineStatusCard({ machine }: { machine: MachineCard }) {
	const isPrimary = machine.role === "primary";
	const hasDrift = machine.driftCount > 0;

	return (
		<div
			className={cn(
				"glass-card p-5 flex flex-col gap-4",
				isPrimary &&
					"border-accent-blue/30 shadow-[0_0_20px_oklch(0.65_0.18_250/0.08)]",
			)}
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
							isPrimary ? "bg-accent-blue/15" : "bg-bg-elevated",
						)}
					>
						{isPrimary ? (
							<Server
								size={18}
								className="text-accent-blue"
								aria-hidden="true"
							/>
						) : (
							<Laptop2
								size={18}
								className="text-text-secondary"
								aria-hidden="true"
							/>
						)}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="text-base font-bold text-text-primary">
								{machine.name}
							</span>
							{isPrimary && (
								<span className="text-xs px-1.5 py-0.5 rounded bg-accent-blue/15 text-accent-blue font-medium">
									Primary
								</span>
							)}
						</div>
						<span className="text-xs text-text-muted font-mono" dir="ltr">
							{machine.hostname}
						</span>
					</div>
				</div>

				{/* Tailscale badge */}
				<div
					className={cn(
						"flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0",
						machine.tailscaleConnected
							? "bg-[oklch(0.72_0.19_155_/_0.12)] border border-[oklch(0.72_0.19_155_/_0.25)] text-[var(--color-status-healthy)]"
							: "bg-[oklch(0.62_0.22_25_/_0.12)] border border-[oklch(0.62_0.22_25_/_0.25)] text-[var(--color-status-critical)]",
					)}
				>
					{machine.tailscaleConnected ? (
						<Wifi size={12} aria-hidden="true" />
					) : (
						<WifiOff size={12} aria-hidden="true" />
					)}
					Tailscale
				</div>
			</div>

			{/* IP row */}
			<div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-bg-elevated border border-border/50">
				<Globe
					size={13}
					className="text-text-muted shrink-0"
					aria-hidden="true"
				/>
				<span className="text-xs text-text-muted">IP:</span>
				<span className="text-xs font-mono text-text-primary" dir="ltr">
					{machine.ip}
				</span>
				<span className="text-xs text-text-muted me-auto">{machine.os}</span>
			</div>

			{/* Stats grid */}
			<div className="grid grid-cols-3 gap-2">
				<div className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-bg-elevated border border-border/40">
					<Clock size={14} className="text-text-muted" aria-hidden="true" />
					<span className="text-[10px] text-text-muted text-center">
						סנכרון אחרון
					</span>
					<span className="text-xs font-medium text-text-primary text-center">
						{machine.lastSync}
					</span>
				</div>
				<div className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-bg-elevated border border-border/40">
					<FolderSync
						size={14}
						className="text-accent-blue"
						aria-hidden="true"
					/>
					<span className="text-[10px] text-text-muted text-center">קבצים</span>
					<span
						className="text-xs font-bold text-accent-blue text-center"
						dir="ltr"
					>
						{machine.filesSynced.toLocaleString()}
					</span>
				</div>
				<div className="flex flex-col items-center gap-1 p-2.5 rounded-lg bg-bg-elevated border border-border/40">
					<ArrowLeftRight
						size={14}
						className={
							hasDrift
								? "text-[var(--color-status-degraded)]"
								: "text-[var(--color-status-healthy)]"
						}
						aria-hidden="true"
					/>
					<span className="text-[10px] text-text-muted text-center">drift</span>
					<span
						className={cn(
							"text-xs font-bold text-center",
							hasDrift
								? "text-[var(--color-status-degraded)]"
								: "text-[var(--color-status-healthy)]",
						)}
						dir="ltr"
					>
						{hasDrift ? `${machine.driftCount} קבצים` : "אפס"}
					</span>
				</div>
			</div>

			{/* Drift warning */}
			{hasDrift && (
				<div className="flex items-start gap-2 p-3 rounded-lg bg-[oklch(0.78_0.16_75_/_0.08)] border border-[oklch(0.78_0.16_75_/_0.2)]">
					<AlertTriangle
						size={14}
						className="text-[var(--color-status-degraded)] shrink-0 mt-0.5"
						aria-hidden="true"
					/>
					<p className="text-xs text-[var(--color-status-degraded)]">
						{machine.driftCount} קבצי config חרגו מ-pop-os — settings.json ידני
						נדרש
					</p>
				</div>
			)}
		</div>
	);
}

function FlowStep({
	step,
	label,
	sub,
	isLast,
}: {
	step: number;
	label: string;
	sub: string;
	isLast?: boolean;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="flex flex-col items-center shrink-0">
				<div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent-blue/20 border border-accent-blue/40 text-accent-blue text-xs font-bold">
					{step}
				</div>
				{!isLast && (
					<div
						className="w-px flex-1 min-h-6 bg-border mt-1"
						aria-hidden="true"
					/>
				)}
			</div>
			<div className="pb-4">
				<p className="text-sm font-medium text-text-primary">{label}</p>
				<p className="text-xs text-text-muted mt-0.5">{sub}</p>
			</div>
		</div>
	);
}

function SyncTableRow({ item }: { item: SyncItem }) {
	return (
		<tr className="border-b border-border/40 last:border-0 hover:bg-bg-tertiary/50 transition-colors">
			<td className="py-3 ps-4 pe-3">
				<span className="font-mono text-xs text-text-primary bg-bg-elevated px-2 py-0.5 rounded">
					{item.item}
				</span>
			</td>
			<td className="py-3 px-3">
				{item.synced ? (
					<span className="flex items-center gap-1.5 text-[var(--color-status-healthy)]">
						<CheckCircle2 size={14} aria-hidden="true" />
						<span className="text-xs font-medium">מסונכרן</span>
					</span>
				) : (
					<span className="flex items-center gap-1.5 text-text-muted">
						<X size={14} aria-hidden="true" />
						<span className="text-xs font-medium">לא</span>
					</span>
				)}
			</td>
			<td className="py-3 px-3">
				<span className="text-xs font-mono text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">
					{item.method}
				</span>
			</td>
			<td className="py-3 ps-3 pe-4">
				<span className="text-xs text-text-muted">{item.notes}</span>
			</td>
		</tr>
	);
}

function DevConfigRow({ file }: { file: DevConfigFile }) {
	return (
		<div className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0">
			<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-purple/10 shrink-0 mt-0.5">
				<FileCode2
					size={14}
					className="text-[var(--color-accent-purple)]"
					aria-hidden="true"
				/>
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-mono text-sm text-text-primary">
						{file.path}
					</span>
					<span className="text-[10px] text-text-muted">←</span>
					<span className="font-mono text-xs text-text-muted truncate">
						{file.source}
					</span>
				</div>
				<p className="text-xs text-text-muted mt-0.5">{file.description}</p>
			</div>
			<CheckCircle2
				size={14}
				className="text-[var(--color-status-healthy)] shrink-0 mt-1.5"
				aria-hidden="true"
			/>
		</div>
	);
}

function CommandBlock({ command }: { command: SyncCommand }) {
	const directionColors: Record<string, string> = {
		push: "text-accent-blue",
		pull: "text-[var(--color-accent-cyan)]",
		both: "text-[var(--color-accent-green)]",
		manual: "text-text-muted",
	};
	const directionLabels: Record<string, string> = {
		push: "→ MSI",
		pull: "← pop-os",
		both: "↔ שתיים",
		manual: "ידני",
	};

	return (
		<div className="flex flex-col gap-1.5 p-3 rounded-lg bg-bg-elevated border border-border/50 hover:border-border-hover transition-colors">
			<div className="flex items-start justify-between gap-2">
				<code
					className="text-xs font-mono text-text-primary break-all leading-relaxed"
					dir="ltr"
				>
					{command.cmd}
				</code>
				{command.direction && (
					<span
						className={cn(
							"text-[10px] font-mono shrink-0 mt-0.5",
							directionColors[command.direction],
						)}
					>
						{directionLabels[command.direction]}
					</span>
				)}
			</div>
			<p className="text-xs text-text-muted">{command.description}</p>
		</div>
	);
}

function IssueCard({ issue }: { issue: KnownIssue }) {
	const [open, setOpen] = useState(false);

	const colors = {
		critical: {
			bg: "bg-[oklch(0.62_0.22_25_/_0.08)]",
			border: "border-[oklch(0.62_0.22_25_/_0.25)]",
			icon: "text-[var(--color-status-critical)]",
			dot: "bg-[var(--color-status-critical)]",
		},
		warn: {
			bg: "bg-[oklch(0.78_0.16_75_/_0.08)]",
			border: "border-[oklch(0.78_0.16_75_/_0.25)]",
			icon: "text-[var(--color-status-degraded)]",
			dot: "bg-[var(--color-status-degraded)]",
		},
		info: {
			bg: "bg-accent-blue/5",
			border: "border-accent-blue/20",
			icon: "text-accent-blue",
			dot: "bg-accent-blue",
		},
	};

	const c = colors[issue.severity];

	return (
		<div
			className={cn("rounded-lg border p-4 transition-colors", c.bg, c.border)}
		>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between gap-3 min-h-11 text-start"
				aria-expanded={open}
			>
				<div className="flex items-center gap-3">
					<span
						className={cn(
							"w-2 h-2 rounded-full shrink-0 animate-pulse-status",
							c.dot,
						)}
						aria-hidden="true"
					/>
					<span className={cn("text-sm font-medium", c.icon)}>
						{issue.title}
					</span>
				</div>
				{open ? (
					<ChevronUp
						size={15}
						className="text-text-muted shrink-0"
						aria-hidden="true"
					/>
				) : (
					<ChevronDown
						size={15}
						className="text-text-muted shrink-0"
						aria-hidden="true"
					/>
				)}
			</button>

			{open && (
				<div className="mt-3 space-y-2 ps-5">
					<div className="flex items-start gap-2">
						<Info
							size={12}
							className="text-text-muted shrink-0 mt-0.5"
							aria-hidden="true"
						/>
						<p className="text-xs text-text-secondary">{issue.cause}</p>
					</div>
					<div className="flex items-start gap-2">
						<CheckCircle2
							size={12}
							className="text-[var(--color-status-healthy)] shrink-0 mt-0.5"
							aria-hidden="true"
						/>
						<p className="text-xs text-text-primary font-medium">{issue.fix}</p>
					</div>
				</div>
			)}
		</div>
	);
}

function SectionCard({
	icon,
	title,
	children,
	className,
}: {
	icon: React.ReactNode;
	title: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("glass-card p-5", className)}>
			<div className="flex items-center gap-2 mb-4">
				<span className="text-accent-blue" aria-hidden="true">
					{icon}
				</span>
				<h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
					{title}
				</h2>
			</div>
			{children}
		</section>
	);
}

// ── Main Page ────────────────────────────────────────────────────────────────

export function SyncPage() {
	const [refreshKey, setRefreshKey] = useState(0);

	return (
		<div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto" key={refreshKey}>
			{/* ── Header ── */}
			<PageHeader onRefresh={() => setRefreshKey((k) => k + 1)} />

			{/* ── Section 1: סטטוס סנכרון ── */}
			<div>
				<h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
					סטטוס סנכרון
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{MACHINES.map((machine) => (
						<MachineStatusCard key={machine.ip} machine={machine} />
					))}
				</div>

				{/* Connection pulse indicator */}
				<div className="mt-3 flex items-center justify-center gap-3">
					<span className="text-xs text-text-muted font-medium">pop-os</span>
					<div className="flex items-center gap-1">
						<div className="w-12 h-px bg-[var(--color-status-healthy)]" />
						<div className="w-2 h-2 rounded-full bg-[var(--color-status-healthy)] animate-pulse-status" />
						<div className="w-12 h-px bg-[var(--color-status-healthy)]" />
					</div>
					<span className="text-xs text-text-muted font-medium">MSI</span>
					<span className="text-xs text-[var(--color-status-healthy)] font-medium">
						Tailscale מחובר
					</span>
				</div>
			</div>

			{/* ── Section 2: claude-sync — איך עובד ── */}
			<SectionCard
				icon={<GitBranch size={16} />}
				title="claude-sync — איך עובד"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Flow steps */}
					<div>
						<p className="text-xs text-text-muted mb-4">
							תהליך הסנכרון הסטנדרטי:
						</p>
						<div>
							<FlowStep
								step={1}
								label="claude-sync push — על המכונה המקורית"
								sub="commit + push ל-git repo של ~/.claude/"
							/>
							<FlowStep
								step={2}
								label="claude-sync pull — על המכונה היעד"
								sub="git pull + rsync לתיקיות non-git"
							/>
							<FlowStep
								step={3}
								label="פתרון קונפליקטים JSONL"
								sub="git checkout --theirs — לעולם לא git merge על JSONL"
							/>
							<FlowStep
								step={4}
								label="rsync לתיקיות non-git"
								sub="knowledge/, hooks/ עם --delete למניעת קבצים מיושנים"
								isLast
							/>
						</div>
					</div>

					{/* Excludes */}
					<div>
						<p className="text-xs text-text-muted mb-4">מוחרגים מהסנכרון:</p>
						<div className="space-y-2">
							{[
								{
									name: ".claude.json",
									reason: "ספציפי לסשן",
									icon: <Shield size={13} />,
								},
								{
									name: "settings.json",
									reason: "ספציפי למכונה (MAX_AGENTS, models)",
									icon: <HardDrive size={13} />,
								},
								{
									name: "plugins/",
									reason: "התקנות מקומיות",
									icon: <HardDrive size={13} />,
								},
								{
									name: "projects/",
									reason: "ממורות פרויקט מקומיות",
									icon: <HardDrive size={13} />,
								},
							].map(({ name, reason, icon }) => (
								<div
									key={name}
									className="flex items-center gap-3 py-2 px-3 rounded-lg bg-bg-elevated border border-border/40"
								>
									<span className="text-text-muted shrink-0">{icon}</span>
									<span className="font-mono text-xs text-text-primary shrink-0">
										{name}
									</span>
									<span className="text-xs text-text-muted">{reason}</span>
								</div>
							))}
						</div>

						<div className="mt-4 p-3 rounded-lg bg-[oklch(0.62_0.22_25_/_0.06)] border border-[oklch(0.62_0.22_25_/_0.2)]">
							<div className="flex items-start gap-2">
								<AlertTriangle
									size={13}
									className="text-[var(--color-status-critical)] shrink-0 mt-0.5"
									aria-hidden="true"
								/>
								<p className="text-xs text-text-secondary">
									<span className="font-semibold text-[var(--color-status-critical)]">
										כלל JSONL:
									</span>{" "}
									לעולם לא git merge על קבצי JSONL. השתמש תמיד ב-rsync או{" "}
									<code className="text-xs font-mono">
										git checkout --theirs
									</code>{" "}
									לפתרון קונפליקטים.
								</p>
							</div>
						</div>
					</div>
				</div>
			</SectionCard>

			{/* ── Section 3: מה מסונכרן ── */}
			<SectionCard icon={<FolderSync size={16} />} title="מה מסונכרן">
				{/* overflow-x-auto scroll container — table needs minimum width for readability */}
				<div className="overflow-x-auto -mx-1">
					<table className="w-full text-start" style={{ minWidth: "480px" }}>
						{" "}
						{/* responsive-ok — inside overflow-x-auto scroll container */}
						<thead>
							<tr className="border-b border-border">
								<th className="py-2 ps-4 pe-3 text-xs font-semibold text-text-muted text-start">
									פריט
								</th>
								<th className="py-2 px-3 text-xs font-semibold text-text-muted text-start">
									מסונכרן?
								</th>
								<th className="py-2 px-3 text-xs font-semibold text-text-muted text-start">
									שיטה
								</th>
								<th className="py-2 ps-3 pe-4 text-xs font-semibold text-text-muted text-start">
									הערות
								</th>
							</tr>
						</thead>
						<tbody>
							{SYNC_TABLE.map((item) => (
								<SyncTableRow key={item.item} item={item} />
							))}
						</tbody>
					</table>
				</div>

				{/* Summary pills */}
				<div className="mt-4 flex flex-wrap gap-2">
					<span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[oklch(0.72_0.19_155_/_0.12)] border border-[oklch(0.72_0.19_155_/_0.25)] text-[var(--color-status-healthy)]">
						<CheckCircle2 size={12} aria-hidden="true" />
						{SYNC_TABLE.filter((i) => i.synced).length} מסונכרנים
					</span>
					<span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[oklch(0.55_0.02_260_/_0.12)] border border-[oklch(0.55_0.02_260_/_0.25)] text-text-muted">
						<X size={12} aria-hidden="true" />
						{SYNC_TABLE.filter((i) => !i.synced).length} מוחרגים
					</span>
				</div>
			</SectionCard>

			{/* ── Section 4: Dev Config Sync ── */}
			<SectionCard icon={<FileCode2 size={16} />} title="Dev Config Sync">
				<p className="text-xs text-text-muted mb-4">
					קבצים ב-{" "}
					<code className="font-mono text-xs text-text-secondary">
						~/.claude/config/external/
					</code>{" "}
					— מסונכרנים דו-כיווני דרך mirror_in/mirror_out. זהה על שתי המכונות.
				</p>
				<div>
					{DEV_CONFIGS.map((file) => (
						<DevConfigRow key={file.path} file={file} />
					))}
				</div>
				<div className="mt-4 p-3 rounded-lg bg-accent-blue/5 border border-accent-blue/15">
					<div className="flex items-start gap-2">
						<Info
							size={13}
							className="text-accent-blue shrink-0 mt-0.5"
							aria-hidden="true"
						/>
						<p className="text-xs text-text-secondary">
							אחרי כל שינוי באחד מהקבצים האלה — הרץ{" "}
							<code className="text-xs font-mono text-accent-blue">
								claude-sync push
							</code>{" "}
							כדי לסנכרן למכונה השנייה.
						</p>
					</div>
				</div>
			</SectionCard>

			{/* ── Section 5: כלים לסנכרון ── */}
			<SectionCard icon={<Terminal size={16} />} title="כלים לסנכרון">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{SYNC_COMMANDS.map((cmd) => (
						<CommandBlock key={cmd.cmd} command={cmd} />
					))}
				</div>

				{/* SSH shortcut */}
				<div className="mt-4 p-3 rounded-lg bg-bg-elevated border border-border/50">
					<p className="text-xs text-text-muted mb-2 font-medium">
						גישה ל-MSI דרך Tailscale:
					</p>
					<div className="space-y-1.5">
						<code
							className="block text-xs font-mono text-text-secondary"
							dir="ltr"
						>
							ssh nadavcohen@100.87.247.87
						</code>
						<code
							className="block text-xs font-mono text-text-secondary"
							dir="ltr"
						>
							# לאחר sync — הרץ על MSI:
						</code>
						<code
							className="block text-xs font-mono text-text-secondary"
							dir="ltr"
						>
							source ~/.zshrc && auto-sync-all.sh
						</code>
					</div>
				</div>

				<div className="mt-3 p-3 rounded-lg bg-[oklch(0.78_0.16_75_/_0.06)] border border-[oklch(0.78_0.16_75_/_0.2)]">
					<div className="flex items-start gap-2">
						<AlertTriangle
							size={13}
							className="text-[var(--color-status-degraded)] shrink-0 mt-0.5"
							aria-hidden="true"
						/>
						<p className="text-xs text-text-secondary">
							<span className="font-semibold text-[var(--color-status-degraded)]">
								ROLLUP_NATIVE_THREADS=0
							</span>{" "}
							נדרש לכל build ב-MSI. כבר מוגדר ב-
							<code className="text-xs font-mono">~/.zshrc</code> ב-MSI.
						</p>
					</div>
				</div>
			</SectionCard>

			{/* ── Section 6: בעיות נפוצות ── */}
			<SectionCard icon={<AlertTriangle size={16} />} title="בעיות נפוצות">
				<div className="space-y-3">
					{KNOWN_ISSUES.map((issue) => (
						<IssueCard key={issue.title} issue={issue} />
					))}
				</div>

				{/* Quick diagnostics */}
				<div className="mt-4 p-4 rounded-lg bg-bg-elevated border border-border/50">
					<p className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">
						בדיקות אבחון מהירות
					</p>
					<div className="space-y-3">
						{[
							{ label: "בדוק חיבור Tailscale", cmd: "tailscale status" },
							{
								label: "בדוק Node.js ב-SSH (MSI)",
								cmd: "ssh 100.87.247.87 'node --version'",
							},
							{
								label: "בדוק קבצים ב-MSI hooks",
								cmd: "ssh 100.87.247.87 'ls ~/.claude/hooks/ | wc -l'",
							},
							{
								label: "בדוק git status של ~/.claude",
								cmd: "git -C ~/.claude status --short",
							},
						].map(({ label, cmd }) => (
							<div key={cmd} className="flex flex-col gap-1">
								<span className="text-xs text-text-muted">{label}:</span>
								<code
									className="text-xs font-mono text-text-secondary bg-bg-primary px-2 py-1 rounded"
									dir="ltr"
								>
									{cmd}
								</code>
							</div>
						))}
					</div>
				</div>
			</SectionCard>
		</div>
	);
}
