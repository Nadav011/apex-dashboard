import ReactECharts from "echarts-for-react";
import {
	AlertCircle,
	Archive,
	BookOpen,
	Box,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Code2,
	ExternalLink,
	FileCode2,
	FolderGit2,
	GitBranch,
	GitCommit,
	Globe,
	HardDrive,
	Link2,
	Monitor,
	Package,
	Play,
	Search,
	Server,
	Shield,
	Smartphone,
	Sparkles,
	TerminalSquare,
	TestTube2,
	Wifi,
	Wrench,
	XCircle,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useProjects } from "@/hooks/use-api";
import type {
	ProjectInfo,
	ProjectScale,
	ProjectSecurity,
	ProjectTesting,
} from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Types ──────────────────────────────────────────────────────────────────────

type MachineFilter = "all" | "Lenovo" | "MSI";
type StatusFilter = "all" | "active" | "archived" | "development";

// ── Stack badge color map ─────────────────────────────────────────────────────

function stackBadgeColor(token: string): string {
	const t = token.toLowerCase();
	if (t.includes("react"))
		return "bg-[oklch(0.6_0.18_220_/_0.18)] text-[oklch(0.72_0.18_220)] border-[oklch(0.6_0.18_220_/_0.35)]";
	if (t.includes("next"))
		return "bg-[oklch(0.62_0.05_260_/_0.18)] text-[oklch(0.82_0.05_260)] border-[oklch(0.62_0.05_260_/_0.35)]";
	if (t.includes("vite"))
		return "bg-[oklch(0.65_0.18_290_/_0.18)] text-[oklch(0.75_0.18_290)] border-[oklch(0.65_0.18_290_/_0.35)]";
	if (t.includes("supabase"))
		return "bg-[oklch(0.62_0.2_155_/_0.18)] text-[oklch(0.72_0.2_155)] border-[oklch(0.62_0.2_155_/_0.35)]";
	if (t.includes("flutter") || t.includes("dart"))
		return "bg-[oklch(0.6_0.18_250_/_0.18)] text-[oklch(0.72_0.18_250)] border-[oklch(0.6_0.18_250_/_0.35)]";
	if (t.includes("python") || t.includes("crewai"))
		return "bg-[oklch(0.72_0.18_75_/_0.18)] text-[oklch(0.8_0.18_75)] border-[oklch(0.72_0.18_75_/_0.35)]";
	if (t.includes("node") || t.includes("expo"))
		return "bg-[oklch(0.65_0.2_155_/_0.18)] text-[oklch(0.75_0.2_155)] border-[oklch(0.65_0.2_155_/_0.35)]";
	if (t.includes("docker"))
		return "bg-[oklch(0.62_0.2_220_/_0.18)] text-[oklch(0.72_0.2_220)] border-[oklch(0.62_0.2_220_/_0.35)]";
	if (t.includes("remotion"))
		return "bg-[oklch(0.62_0.2_25_/_0.18)] text-[oklch(0.72_0.2_25)] border-[oklch(0.62_0.2_25_/_0.35)]";
	if (t.includes("convex"))
		return "bg-[oklch(0.65_0.18_30_/_0.18)] text-[oklch(0.75_0.18_30)] border-[oklch(0.65_0.18_30_/_0.35)]";
	if (t.includes("typescript") || t.includes("ts"))
		return "bg-[oklch(0.58_0.16_240_/_0.18)] text-[oklch(0.72_0.16_240)] border-[oklch(0.58_0.16_240_/_0.35)]";
	if (t.includes("tailwind"))
		return "bg-[oklch(0.62_0.2_195_/_0.18)] text-[oklch(0.72_0.2_195)] border-[oklch(0.62_0.2_195_/_0.35)]";
	if (t.includes("sqlite") || t.includes("sql"))
		return "bg-[oklch(0.62_0.12_60_/_0.18)] text-[oklch(0.78_0.12_60)] border-[oklch(0.62_0.12_60_/_0.35)]";
	if (t.includes("riverpod"))
		return "bg-[oklch(0.6_0.2_310_/_0.18)] text-[oklch(0.72_0.2_310)] border-[oklch(0.6_0.2_310_/_0.35)]";
	if (t.includes("hono"))
		return "bg-[oklch(0.68_0.2_30_/_0.18)] text-[oklch(0.78_0.2_30)] border-[oklch(0.68_0.2_30_/_0.35)]";
	return "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)]";
}

// ── Feature badge colors ──────────────────────────────────────────────────────

function featureBadgeStyle(feature: string): string {
	const f = feature.toLowerCase();
	if (f.includes("pwa") || f.includes("offline"))
		return "bg-[oklch(0.58_0.2_260_/_0.2)] text-[oklch(0.75_0.2_260)] border-[oklch(0.58_0.2_260_/_0.4)]";
	if (f.includes("rtl") || f.includes("hebrew") || f.includes("i18n"))
		return "bg-[oklch(0.62_0.2_155_/_0.2)] text-[oklch(0.72_0.2_155)] border-[oklch(0.62_0.2_155_/_0.4)]";
	if (f.includes("auth") || f.includes("rls"))
		return "bg-[oklch(0.62_0.2_25_/_0.2)] text-[oklch(0.78_0.2_25)] border-[oklch(0.62_0.2_25_/_0.4)]";
	if (f.includes("real") || f.includes("live") || f.includes("socket"))
		return "bg-[oklch(0.65_0.18_290_/_0.2)] text-[oklch(0.75_0.18_290)] border-[oklch(0.65_0.18_290_/_0.4)]";
	if (f.includes("push") || f.includes("notification"))
		return "bg-[oklch(0.62_0.18_75_/_0.2)] text-[oklch(0.78_0.18_75)] border-[oklch(0.62_0.18_75_/_0.4)]";
	return "bg-[oklch(0.62_0.2_155_/_0.14)] text-[oklch(0.72_0.2_155)] border-[oklch(0.62_0.2_155_/_0.3)]";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StackBadge({ token }: { token: string }) {
	return (
		<span
			className={cn(
				"inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border leading-none",
				stackBadgeColor(token),
			)}
		>
			{token}
		</span>
	);
}

function StackBadges({ stack }: { stack: string[] }) {
	return (
		<div className="flex flex-wrap gap-1">
			{stack.map((token) => (
				<StackBadge key={token} token={token} />
			))}
		</div>
	);
}

function MachineBadge({ machine }: { machine: string }) {
	const isLenovo = machine === "Lenovo";
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
				isLenovo
					? "bg-[oklch(0.6_0.18_250_/_0.15)] text-[oklch(0.72_0.18_250)] border-[oklch(0.6_0.18_250_/_0.4)]"
					: "bg-[oklch(0.72_0.18_75_/_0.15)] text-[oklch(0.82_0.18_75)] border-[oklch(0.72_0.18_75_/_0.4)]",
			)}
		>
			<Monitor size={10} aria-hidden="true" />
			{machine}
		</span>
	);
}

function PlatformBadge({ platform }: { platform: string }) {
	if (!platform || platform === "—") return null;
	const isMobile =
		platform === "Mobile" ||
		platform.includes("App Store") ||
		platform.includes("Play Store");
	const isCloudflare =
		platform.includes("CF") || platform.includes("Cloudflare");
	const isNetlify = platform.includes("Netlify");

	let cls =
		"bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)]";
	if (isCloudflare)
		cls =
			"bg-[oklch(0.62_0.2_25_/_0.15)] text-[oklch(0.78_0.2_25)] border-[oklch(0.62_0.2_25_/_0.4)]";
	else if (isNetlify)
		cls =
			"bg-[oklch(0.62_0.2_155_/_0.15)] text-[oklch(0.72_0.2_155)] border-[oklch(0.62_0.2_155_/_0.4)]";
	else if (isMobile)
		cls =
			"bg-[oklch(0.65_0.18_290_/_0.15)] text-[oklch(0.75_0.18_290)] border-[oklch(0.65_0.18_290_/_0.4)]";

	const Icon = isMobile ? Smartphone : Globe;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border",
				cls,
			)}
		>
			<Icon size={10} aria-hidden="true" />
			{platform}
		</span>
	);
}

function StatusBadge({ status }: { status: string }) {
	const cfg = {
		active: {
			label: "פעיל",
			cls: "bg-[oklch(0.62_0.2_155_/_0.18)] text-[oklch(0.72_0.2_155)] border-[oklch(0.62_0.2_155_/_0.4)]",
			dotCls:
				"bg-[oklch(0.72_0.2_155)] shadow-[0_0_6px_oklch(0.72_0.2_155/0.6)]",
		},
		development: {
			label: "פיתוח",
			cls: "bg-[oklch(0.72_0.2_75_/_0.18)] text-[oklch(0.82_0.2_75)] border-[oklch(0.72_0.2_75_/_0.4)]",
			dotCls: "bg-[oklch(0.82_0.2_75)]",
		},
		archived: {
			label: "ארכיון",
			cls: "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)]",
			dotCls: "bg-[var(--color-text-muted)]",
		},
	} as const;

	const s =
		(cfg as Record<string, (typeof cfg)[keyof typeof cfg]>)[status] ??
		cfg.archived;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
				s.cls,
			)}
		>
			<span
				className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dotCls)}
				aria-hidden="true"
			/>
			{s.label}
		</span>
	);
}

function BooleanIndicator({
	value,
	label,
}: {
	value: boolean | undefined;
	label: string;
}) {
	if (value === undefined) return null;
	return (
		<div
			className={cn(
				"flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md border",
				value
					? "bg-[oklch(0.62_0.2_155_/_0.12)] text-[oklch(0.72_0.2_155)] border-[oklch(0.62_0.2_155_/_0.3)]"
					: "bg-[oklch(0.62_0.2_25_/_0.12)] text-[oklch(0.78_0.2_25)] border-[oklch(0.62_0.2_25_/_0.3)]",
			)}
		>
			{value ? (
				<CheckCircle2 size={11} aria-hidden="true" />
			) : (
				<XCircle size={11} aria-hidden="true" />
			)}
			{label}
		</div>
	);
}

function CoverageBar({ target }: { target: number | undefined }) {
	if (!target) return null;
	const pct = Math.min(target, 100);
	const color =
		pct >= 80
			? "oklch(0.72 0.2 155)"
			: pct >= 60
				? "oklch(0.82 0.2 75)"
				: "oklch(0.72 0.2 25)";
	return (
		<div className="flex items-center gap-2">
			<div className="h-1.5 flex-1 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-700"
					style={{ width: `${pct}%`, backgroundColor: color }}
				/>
			</div>
			<span
				className="text-[10px] tabular-nums text-[var(--color-text-muted)]"
				dir="ltr"
			>
				{pct}%
			</span>
		</div>
	);
}

function SectionHeader({
	icon: Icon,
	label,
}: {
	icon: React.ComponentType<{
		size?: number;
		className?: string;
		"aria-hidden"?: "true";
	}>;
	label: string;
}) {
	return (
		<div className="flex items-center gap-1.5 mb-2">
			<Icon
				size={12}
				className="text-[var(--color-text-muted)] shrink-0"
				aria-hidden="true"
			/>
			<span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
				{label}
			</span>
		</div>
	);
}

function InfoRow({
	label,
	value,
	dir: d,
}: {
	label: string;
	value: string | undefined;
	dir?: "ltr" | "rtl";
}) {
	if (!value) return null;
	return (
		<div className="flex items-start gap-2 text-xs">
			<span className="text-[var(--color-text-muted)] shrink-0 min-w-[90px]">
				{label}
			</span>
			<span
				className="text-[var(--color-text-secondary)] break-all"
				dir={d ?? "rtl"}
			>
				{value}
			</span>
		</div>
	);
}

function ExternalLinkBadge({ href, label }: { href: string; label: string }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent-blue)] hover:text-[oklch(0.75_0.18_250)] transition-colors duration-150"
		>
			<ExternalLink size={11} aria-hidden="true" />
			{label}
		</a>
	);
}

function CommitInfo({
	commit,
}: {
	commit: { sha: string; message: string; date: string } | null;
}) {
	if (!commit) return null;
	const diffDays = Math.floor(
		(Date.now() - new Date(commit.date).getTime()) / 86_400_000,
	);
	const relative =
		diffDays === 0
			? "היום"
			: diffDays === 1
				? "אתמול"
				: diffDays < 7
					? `לפני ${diffDays} ימים`
					: diffDays < 30
						? `לפני ${Math.floor(diffDays / 7)} שבועות`
						: `לפני ${Math.floor(diffDays / 30)} חודשים`;
	return (
		<div className="flex items-start gap-1.5 text-[11px] text-[var(--color-text-muted)]">
			<GitCommit size={11} className="shrink-0 mt-0.5" aria-hidden="true" />
			<span
				dir="ltr"
				className="shrink-0 font-mono text-[oklch(0.65_0.15_270)]"
			>
				{commit.sha}
			</span>
			<span className="truncate flex-1 min-w-0">{commit.message}</span>
			<span className="shrink-0">{relative}</span>
		</div>
	);
}

// ── Expanded details sections ─────────────────────────────────────────────────

function SectionGeneral({ project }: { project: ProjectInfo }) {
	return (
		<div>
			<SectionHeader icon={BookOpen} label="מידע כללי" />
			<div className="flex flex-col gap-1.5">
				<InfoRow label="נתיב" value={project.path} dir="ltr" />
				<InfoRow label="מחשב" value={project.machine} dir="ltr" />
				<InfoRow
					label="ענף ברירת מחדל"
					value={project.default_branch}
					dir="ltr"
				/>
				<InfoRow
					label="מנהל חבילות"
					value={project.package_manager}
					dir="ltr"
				/>
				{project.description_he && (
					<InfoRow label="תיאור עברית" value={project.description_he} />
				)}
				{project.description_en && (
					<InfoRow
						label="תיאור אנגלית"
						value={project.description_en}
						dir="ltr"
					/>
				)}
				{project.supabase_project && (
					<InfoRow
						label="Supabase"
						value={project.supabase_project}
						dir="ltr"
					/>
				)}
			</div>
		</div>
	);
}

function SectionStack({ stack }: { stack: string[] }) {
	if (!stack.length) return null;
	return (
		<div>
			<SectionHeader icon={Code2} label="Stack טכנולוגי" />
			<div className="flex flex-wrap gap-1.5">
				{stack.map((t) => (
					<StackBadge key={t} token={t} />
				))}
			</div>
		</div>
	);
}

function SectionGithub({ project }: { project: ProjectInfo }) {
	if (!project.github_url && !project.github_repo) return null;
	return (
		<div>
			<SectionHeader icon={FolderGit2} label="GitHub" />
			<div className="flex flex-col gap-1.5">
				{project.github_url && (
					<ExternalLinkBadge
						href={project.github_url}
						label={project.github_repo || "פתח ב-GitHub"}
					/>
				)}
				{project.default_branch && (
					<div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
						<GitBranch size={11} aria-hidden="true" />
						<span dir="ltr">{project.default_branch}</span>
					</div>
				)}
			</div>
		</div>
	);
}

function SectionDeployment({ project }: { project: ProjectInfo }) {
	const hasDeploy =
		project.deploy_platform || project.domain || project.bundle_limit_kb;
	if (!hasDeploy) return null;
	return (
		<div>
			<SectionHeader icon={Server} label="Deployment" />
			<div className="flex flex-col gap-2">
				{project.deploy_platform && (
					<div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
						<span className="text-[var(--color-text-muted)] min-w-[90px]">
							פלטפורמה
						</span>
						<PlatformBadge platform={project.deploy_platform} />
					</div>
				)}
				{project.domain && project.domain !== "—" && (
					<div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
						<span className="text-[var(--color-text-muted)] min-w-[90px]">
							דומיין
						</span>
						<ExternalLinkBadge
							href={`https://${project.domain}`}
							label={project.domain}
						/>
					</div>
				)}
				{project.bundle_limit_kb && (
					<div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
						<span className="text-[var(--color-text-muted)] min-w-[90px]">
							מגבלת Bundle
						</span>
						<span
							className="font-mono text-[oklch(0.82_0.18_75)] bg-[oklch(0.72_0.18_75_/_0.1)] px-1.5 py-0.5 rounded border border-[oklch(0.72_0.18_75_/_0.3)]"
							dir="ltr"
						>
							{project.bundle_limit_kb} KB
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

function SectionCICD({ workflows }: { workflows: string[] }) {
	if (!workflows.length) return null;
	return (
		<div>
			<SectionHeader icon={Play} label="CI/CD" />
			<div className="flex flex-wrap gap-1.5">
				{workflows.map((wf) => (
					<span
						key={wf}
						className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border bg-[oklch(0.6_0.05_260_/_0.15)] text-[oklch(0.75_0.05_260)] border-[oklch(0.6_0.05_260_/_0.3)]"
					>
						<FileCode2 size={9} aria-hidden="true" />
						{wf}
					</span>
				))}
			</div>
		</div>
	);
}

function SectionFeatures({ features }: { features: string[] }) {
	if (!features.length) return null;
	return (
		<div>
			<SectionHeader icon={Sparkles} label="Features" />
			<div className="flex flex-wrap gap-1.5">
				{features.map((f) => (
					<span
						key={f}
						className={cn(
							"inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border",
							featureBadgeStyle(f),
						)}
					>
						{f}
					</span>
				))}
			</div>
		</div>
	);
}

function SectionTesting({ testing }: { testing: ProjectTesting }) {
	return (
		<div>
			<SectionHeader icon={TestTube2} label="Testing" />
			<div className="flex flex-col gap-2">
				{testing.framework && (
					<div className="flex items-center gap-2 text-xs">
						<span className="text-[var(--color-text-muted)] min-w-[90px]">
							Framework
						</span>
						<span
							className="text-[var(--color-text-secondary)] font-mono"
							dir="ltr"
						>
							{testing.framework}
						</span>
					</div>
				)}
				{testing.e2e && (
					<div className="flex items-center gap-2 text-xs">
						<span className="text-[var(--color-text-muted)] min-w-[90px]">
							E2E
						</span>
						<span
							className="text-[var(--color-text-secondary)] font-mono"
							dir="ltr"
						>
							{testing.e2e}
						</span>
					</div>
				)}
				{testing.mutation && (
					<div className="flex items-center gap-2 text-xs">
						<span className="text-[var(--color-text-muted)] min-w-[90px]">
							Mutation
						</span>
						<span
							className="text-[var(--color-text-secondary)] font-mono"
							dir="ltr"
						>
							{testing.mutation}
						</span>
					</div>
				)}
				{testing.coverage_target !== undefined && (
					<div className="flex flex-col gap-1">
						<span className="text-[var(--color-text-muted)] text-xs">
							Coverage target
						</span>
						<CoverageBar target={testing.coverage_target} />
					</div>
				)}
			</div>
		</div>
	);
}

function SectionSecurity({ security }: { security: ProjectSecurity }) {
	return (
		<div>
			<SectionHeader icon={Shield} label="אבטחה" />
			<div className="flex flex-wrap gap-1.5">
				<BooleanIndicator value={security.rls} label="RLS" />
				<BooleanIndicator value={security.csp} label="CSP" />
				<BooleanIndicator value={security.trivy} label="Trivy" />
				<BooleanIndicator value={security.semgrep} label="Semgrep" />
				<BooleanIndicator value={security.gitleaks} label="Gitleaks" />
			</div>
		</div>
	);
}

function SectionConnections({ connections }: { connections: string[] }) {
	if (!connections.length) return null;
	return (
		<div>
			<SectionHeader icon={Wifi} label="חיבורים חיצוניים" />
			<div className="flex flex-wrap gap-1.5">
				{connections.map((c) => (
					<span
						key={c}
						className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border bg-[oklch(0.62_0.15_310_/_0.12)] text-[oklch(0.75_0.15_310)] border-[oklch(0.62_0.15_310_/_0.3)]"
					>
						<Link2 size={9} aria-hidden="true" />
						{c}
					</span>
				))}
			</div>
		</div>
	);
}

function SectionRelated({
	related,
	allProjects,
}: {
	related: string[];
	allProjects: ProjectInfo[];
}) {
	if (!related.length) return null;
	return (
		<div>
			<SectionHeader icon={FolderGit2} label="פרויקטים קשורים" />
			<div className="flex flex-wrap gap-1.5">
				{related.map((r) => {
					const found = allProjects.find((p) => p.name === r);
					return (
						<span
							key={r}
							className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border bg-[oklch(0.6_0.18_220_/_0.12)] text-[oklch(0.72_0.18_220)] border-[oklch(0.6_0.18_220_/_0.3)]"
						>
							<Box size={9} aria-hidden="true" />
							{found?.display_name ?? r}
						</span>
					);
				})}
			</div>
		</div>
	);
}

function SectionScale({ scale }: { scale: ProjectScale | undefined }) {
	if (!scale) return null;
	const entries = Object.entries(scale).filter(
		([, v]) => v !== undefined && v !== 0,
	) as [string, number][];
	if (!entries.length) return null;

	const labelMap: Record<string, string> = {
		pages: "דפים",
		components: "קומפוננטות",
		hooks: "Hooks",
		lib: "ספריות",
		migrations: "מיגרציות",
		edge_functions: "Edge Functions",
		tables: "טבלאות DB",
	};

	return (
		<div>
			<SectionHeader icon={HardDrive} label="קנה מידה" />
			<div className="grid grid-cols-3 gap-2">
				{entries.map(([key, val]) => (
					<div
						key={key}
						className="flex flex-col items-center gap-0.5 p-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"
					>
						<span
							className="text-lg font-bold tabular-nums text-[oklch(0.72_0.18_250)]"
							dir="ltr"
						>
							{val}
						</span>
						<span className="text-[9px] text-[var(--color-text-muted)] text-center">
							{labelMap[key] ?? key}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

function SectionNotes({ notes }: { notes: string }) {
	if (!notes) return null;
	return (
		<div>
			<SectionHeader icon={AlertCircle} label="הערות" />
			<div className="flex items-start gap-2 p-2.5 rounded-lg bg-[oklch(0.72_0.18_75_/_0.08)] border border-[oklch(0.72_0.18_75_/_0.25)]">
				<AlertCircle
					size={12}
					className="shrink-0 mt-0.5 text-[oklch(0.78_0.18_75)]"
					aria-hidden="true"
				/>
				<p className="text-xs text-[oklch(0.82_0.12_75)] leading-relaxed">
					{notes}
				</p>
			</div>
		</div>
	);
}

// ── Expandable Project Card ───────────────────────────────────────────────────

function ProjectCard({
	project,
	allProjects,
}: {
	project: ProjectInfo;
	allProjects: ProjectInfo[];
}) {
	const [expanded, setExpanded] = useState(false);

	const domainUrl =
		project.domain && project.domain !== "—"
			? `https://${project.domain}`
			: null;

	return (
		<div
			className={cn(
				"glass-card flex flex-col transition-all duration-200",
				"border border-[var(--color-border)]",
				expanded
					? "border-[oklch(0.55_0.15_250_/_0.5)]"
					: "hover:border-[var(--color-border-hover)]",
				project.status === "archived" && "opacity-70",
			)}
		>
			{/* ── Collapsed header (always visible) ───────────────────────────── */}
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="flex flex-col gap-3 p-4 text-start w-full cursor-pointer"
				aria-expanded={expanded}
			>
				{/* Name row */}
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<h3 className="text-sm font-bold text-[var(--color-text-primary)] leading-snug">
							{project.display_name || project.name}
						</h3>
						{project.description_he && (
							<p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed line-clamp-2">
								{project.description_he}
							</p>
						)}
					</div>
					<div className="flex items-center gap-1.5 shrink-0">
						<StatusBadge status={project.status} />
						{expanded ? (
							<ChevronUp
								size={14}
								className="text-[var(--color-text-muted)]"
								aria-hidden="true"
							/>
						) : (
							<ChevronDown
								size={14}
								className="text-[var(--color-text-muted)]"
								aria-hidden="true"
							/>
						)}
					</div>
				</div>

				{/* Stack */}
				<StackBadges stack={project.stack} />

				{/* Machine + platform row */}
				<div className="flex flex-wrap items-center gap-1.5">
					<MachineBadge machine={project.machine} />
					{project.deploy_platform && project.deploy_platform !== "—" && (
						<PlatformBadge platform={project.deploy_platform} />
					)}
				</div>

				{/* Quick links */}
				<div className="flex items-center gap-4 flex-wrap">
					{domainUrl && (
						<a
							href={domainUrl}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent-blue)] hover:text-[oklch(0.75_0.18_250)] transition-colors duration-150"
						>
							<ExternalLink size={11} aria-hidden="true" />
							{project.domain}
						</a>
					)}
					{project.github_url && (
						<a
							href={project.github_url}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-150"
						>
							<GitBranch size={11} aria-hidden="true" />
							<span dir="ltr">{project.github_repo}</span>
						</a>
					)}
				</div>
			</button>

			{/* ── Expanded details ─────────────────────────────────────────────── */}
			{expanded && (
				<div className="flex flex-col gap-4 px-4 pb-4 pt-0 border-t border-[var(--color-border)]">
					{/* Divider label */}
					<div className="flex items-center gap-2 pt-3">
						<div className="h-px flex-1 bg-[var(--color-border)]" />
						<span className="text-[10px] text-[var(--color-text-muted)] font-medium px-1">
							פרטים מלאים
						</span>
						<div className="h-px flex-1 bg-[var(--color-border)]" />
					</div>

					<SectionGeneral project={project} />
					<SectionStack stack={project.stack} />
					<SectionGithub project={project} />
					<SectionDeployment project={project} />

					{project.ci_workflows.length > 0 && (
						<SectionCICD workflows={project.ci_workflows} />
					)}

					{project.features.length > 0 && (
						<SectionFeatures features={project.features} />
					)}

					<SectionTesting testing={project.testing} />
					<SectionSecurity security={project.security} />

					{project.connections.length > 0 && (
						<SectionConnections connections={project.connections} />
					)}

					{project.related_projects.length > 0 && (
						<SectionRelated
							related={project.related_projects}
							allProjects={allProjects}
						/>
					)}

					{project.scale && <SectionScale scale={project.scale} />}

					{project.notes && <SectionNotes notes={project.notes} />}

					{/* Last commit */}
					{project.last_commit && (
						<div>
							<SectionHeader icon={GitCommit} label="עדכון אחרון" />
							<CommitInfo commit={project.last_commit} />
						</div>
					)}
				</div>
			)}
		</div>
	);
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ProjectSkeleton() {
	return (
		<div className="glass-card p-4 animate-pulse flex flex-col gap-3">
			<div className="flex items-start justify-between gap-2">
				<div className="space-y-1.5 flex-1">
					<div className="h-4 bg-[var(--color-bg-elevated)] rounded w-2/3" />
					<div className="h-3 bg-[var(--color-bg-elevated)] rounded w-full" />
				</div>
				<div className="h-5 w-14 bg-[var(--color-bg-elevated)] rounded-full" />
			</div>
			<div className="flex gap-1.5 flex-wrap">
				<div className="h-5 w-12 bg-[var(--color-bg-elevated)] rounded" />
				<div className="h-5 w-9 bg-[var(--color-bg-elevated)] rounded" />
				<div className="h-5 w-11 bg-[var(--color-bg-elevated)] rounded" />
			</div>
			<div className="flex gap-1.5">
				<div className="h-5 w-20 bg-[var(--color-bg-elevated)] rounded-full" />
				<div className="h-5 w-16 bg-[var(--color-bg-elevated)] rounded-full" />
			</div>
			<div className="flex gap-3">
				<div className="h-3.5 w-24 bg-[var(--color-bg-elevated)] rounded" />
				<div className="h-3.5 w-20 bg-[var(--color-bg-elevated)] rounded" />
			</div>
		</div>
	);
}

// ── Summary strip ─────────────────────────────────────────────────────────────

function SummaryStrip({
	total,
	active,
	archived,
	development,
	lenovoCount,
	msiCount,
	withGithub,
	byMachine,
}: {
	total: number;
	active: number;
	archived: number;
	development: number;
	lenovoCount: number;
	msiCount: number;
	withGithub: number;
	byMachine: Record<string, number>;
}) {
	// Mini donut — ECharts internal coordinates (not CSS, rtl-ok)
	const donutOption = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			backgroundColor: "oklch(0.18 0.02 260)",
			borderColor: "oklch(0.3 0.04 260)",
			textStyle: { color: "oklch(0.9 0.02 260)", fontSize: 11 },
			formatter: "{b}: {c}",
		},
		series: [
			{
				type: "pie",
				radius: ["50%", "78%"],
				center: ["50%", "50%"],
				data: Object.entries(byMachine).map(([name, value]) => ({
					name,
					value,
					itemStyle: {
						color:
							name === "Lenovo"
								? "oklch(0.65 0.18 250)"
								: "oklch(0.78 0.18 75)",
					},
				})),
				label: { show: false },
				emphasis: {
					itemStyle: { shadowBlur: 6, shadowColor: "rgba(0,0,0,0.3)" },
				},
			},
		],
	};

	const stats = [
		{
			label: "סה״כ",
			value: total,
			color: "oklch(0.72 0.18 250)",
			icon: FolderGit2,
		},
		{ label: "פעילים", value: active, color: "oklch(0.72 0.2 155)", icon: Zap },
		{
			label: "ארכיון",
			value: archived,
			color: "oklch(0.6 0.05 260)",
			icon: Archive,
		},
		{
			label: "בפיתוח",
			value: development,
			color: "oklch(0.82 0.2 75)",
			icon: Wrench,
		},
		{
			label: "Lenovo",
			value: lenovoCount,
			color: "oklch(0.72 0.18 250)",
			icon: Monitor,
		},
		{
			label: "MSI",
			value: msiCount,
			color: "oklch(0.82 0.18 75)",
			icon: Monitor,
		},
		{
			label: "עם GitHub",
			value: withGithub,
			color: "oklch(0.72 0.12 260)",
			icon: FolderGit2,
		},
	];

	return (
		<div className="glass-card p-4">
			<div className="flex items-center gap-4 flex-wrap">
				{/* Stats */}
				<div className="flex flex-wrap gap-3 flex-1 min-w-0">
					{stats.map(({ label, value, color, icon: Icon }) => (
						<div
							key={label}
							className="flex flex-col items-center gap-0.5 min-w-[52px]"
						>
							<div className="flex items-center gap-1">
								<Icon
									size={11}
									className="shrink-0"
									style={{ color }}
									aria-hidden="true"
								/>
								<span
									className="text-xl font-bold tabular-nums leading-none"
									style={{ color }}
									dir="ltr"
								>
									{value}
								</span>
							</div>
							<span className="text-[10px] text-[var(--color-text-muted)]">
								{label}
							</span>
						</div>
					))}
				</div>

				{/* Mini donut */}
				<div className="shrink-0 w-[90px] h-[70px]">
					<ReactECharts
						option={donutOption}
						style={{ height: 70, width: 90 }}
						opts={{ renderer: "svg" }}
					/>
				</div>
			</div>
		</div>
	);
}

// ── Machine filter tabs ───────────────────────────────────────────────────────

function MachineFilterTabs({
	active,
	onSelect,
	counts,
}: {
	active: MachineFilter;
	onSelect: (f: MachineFilter) => void;
	counts: Record<MachineFilter, number>;
}) {
	const tabs: { key: MachineFilter; label: string }[] = [
		{ key: "all", label: "הכול" },
		{ key: "Lenovo", label: "Lenovo" },
		{ key: "Lenovo", label: "Lenovo" },
	];
	return (
		<div className="flex items-center gap-1.5">
			{tabs.map(({ key, label }) => (
				<button
					key={key}
					type="button"
					onClick={() => onSelect(key)}
					className={cn(
						"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
						"transition-all duration-150 cursor-pointer min-h-9",
						active === key
							? "bg-[var(--color-accent-blue)] text-white"
							: "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]",
					)}
				>
					{label}
					<span
						className={cn(
							"text-xs tabular-nums px-1.5 py-0.5 rounded-full",
							active === key
								? "bg-white/20 text-current"
								: "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]",
						)}
						dir="ltr"
					>
						{counts[key]}
					</span>
				</button>
			))}
		</div>
	);
}

// ── Status filter tabs ────────────────────────────────────────────────────────

function StatusFilterTabs({
	active,
	onSelect,
	counts,
}: {
	active: StatusFilter;
	onSelect: (f: StatusFilter) => void;
	counts: Record<StatusFilter, number>;
}) {
	const tabs: { key: StatusFilter; label: string }[] = [
		{ key: "all", label: "הכול" },
		{ key: "active", label: "פעילים" },
		{ key: "development", label: "פיתוח" },
		{ key: "archived", label: "ארכיון" },
	];
	return (
		<div className="flex items-center gap-1.5 flex-wrap">
			{tabs.map(({ key, label }) => (
				<button
					key={key}
					type="button"
					onClick={() => onSelect(key)}
					className={cn(
						"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
						"transition-all duration-150 cursor-pointer min-h-9",
						active === key
							? "bg-[oklch(0.62_0.2_155_/_0.8)] text-white"
							: "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]",
					)}
				>
					{label}
					<span
						className={cn(
							"text-xs tabular-nums px-1.5 py-0.5 rounded-full",
							active === key
								? "bg-white/20 text-current"
								: "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]",
						)}
						dir="ltr"
					>
						{counts[key]}
					</span>
				</button>
			))}
		</div>
	);
}

// ── Bottom charts ─────────────────────────────────────────────────────────────

const CHART_COLORS = [
	"oklch(0.62 0.2 25)",
	"oklch(0.62 0.2 155)",
	"oklch(0.65 0.18 290)",
	"oklch(0.62 0.05 260)",
	"oklch(0.72 0.18 75)",
	"oklch(0.6 0.18 220)",
	"oklch(0.62 0.2 310)",
];

function DeployPlatformPie({
	byPlatform,
}: {
	byPlatform: Record<string, number>;
}) {
	const data = Object.entries(byPlatform)
		.filter(([k, v]) => k !== "—" && v > 0)
		.map(([name, value], i) => ({
			name,
			value,
			itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
		}));

	// rtl-ok — ECharts legend uses its own internal coordinate system, not CSS
	const option = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			backgroundColor: "oklch(0.18 0.02 260)",
			borderColor: "oklch(0.3 0.04 260)",
			textStyle: { color: "oklch(0.9 0.02 260)", fontSize: 11 },
			formatter: "{b}: {c} ({d}%)",
		},
		legend: {
			orient: "vertical",
			right: "0%", // rtl-ok: ECharts internal coordinate
			top: "center",
			textStyle: { color: "oklch(0.7 0.04 260)", fontSize: 10 },
			itemWidth: 8,
			itemHeight: 8,
		},
		series: [
			{
				type: "pie",
				radius: ["38%", "65%"],
				center: ["38%", "50%"],
				data,
				label: { show: false },
				emphasis: {
					itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.4)" },
				},
			},
		],
	};

	return (
		<div className="glass-card p-4">
			<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
				<Server
					size={14}
					className="text-[var(--color-text-muted)]"
					aria-hidden="true"
				/>
				לפי פלטפורמת Deploy
			</h3>
			<ReactECharts
				option={option}
				style={{ height: 190 }}
				opts={{ renderer: "svg" }}
			/>
		</div>
	);
}

function StackTypeBar({
	byStackType,
}: {
	byStackType: Record<string, number>;
}) {
	const entries = Object.entries(byStackType)
		.filter(([, v]) => v > 0)
		.sort(([, a], [, b]) => b - a);

	// rtl-ok — ECharts grid uses its own internal coordinate system, not CSS
	const option = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "axis",
			backgroundColor: "oklch(0.18 0.02 260)",
			borderColor: "oklch(0.3 0.04 260)",
			textStyle: { color: "oklch(0.9 0.02 260)", fontSize: 11 },
			axisPointer: { type: "shadow" },
		},
		grid: {
			left: "3%", // rtl-ok: ECharts grid internal coordinate
			right: "8%", // rtl-ok: ECharts grid internal coordinate
			top: "5%",
			bottom: "3%",
			containLabel: true,
		},
		xAxis: {
			type: "value",
			axisLine: { show: false },
			splitLine: {
				lineStyle: { color: "oklch(0.3 0.02 260 / 0.4)", type: "dashed" },
			},
			axisLabel: { color: "oklch(0.6 0.03 260)", fontSize: 10 },
		},
		yAxis: {
			type: "category",
			data: entries.map(([k]) => k),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: { color: "oklch(0.7 0.04 260)", fontSize: 10 },
		},
		series: [
			{
				type: "bar",
				data: entries.map(([, v], i) => ({
					value: v,
					itemStyle: {
						color: CHART_COLORS[i % CHART_COLORS.length],
						borderRadius: [0, 4, 4, 0],
					},
				})),
				barMaxWidth: 24,
				label: {
					show: true,
					position: "right",
					color: "oklch(0.7 0.04 260)",
					fontSize: 10,
				},
			},
		],
	};

	return (
		<div className="glass-card p-4">
			<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
				<TerminalSquare
					size={14}
					className="text-[var(--color-text-muted)]"
					aria-hidden="true"
				/>
				לפי סוג Stack
			</h3>
			<ReactECharts
				option={option}
				style={{ height: 190 }}
				opts={{ renderer: "svg" }}
			/>
		</div>
	);
}

// ── Machine breakdown ─────────────────────────────────────────────────────────

function MachineBreakdownCard({
	byMachine,
	total,
}: {
	byMachine: Record<string, number>;
	total: number;
}) {
	return (
		<div className="glass-card p-4 flex flex-col gap-3">
			<h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
				<Monitor
					size={14}
					className="text-[var(--color-text-muted)]"
					aria-hidden="true"
				/>
				לפי מחשב
			</h3>
			{Object.entries(byMachine).map(([machine, count]) => {
				const pct = total > 0 ? Math.round((count / total) * 100) : 0;
				const barColor =
					machine === "Lenovo" ? "oklch(0.65 0.18 250)" : "oklch(0.78 0.18 75)";
				return (
					<div key={machine} className="flex flex-col gap-1.5">
						<div className="flex items-center justify-between text-xs">
							<span
								className="font-semibold text-[var(--color-text-secondary)]"
								dir="ltr"
							>
								{machine}
							</span>
							<span
								className="text-[var(--color-text-muted)] tabular-nums font-mono"
								dir="ltr"
							>
								{count} / {pct}%
							</span>
						</div>
						<div className="h-2 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
							<div
								className="h-full rounded-full transition-all duration-700"
								style={{ width: `${pct}%`, backgroundColor: barColor }}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}

// ── Package manager breakdown ─────────────────────────────────────────────────

function PackageManagerSummary({ projects }: { projects: ProjectInfo[] }) {
	const counts = useMemo(() => {
		const map: Record<string, number> = {};
		for (const p of projects) {
			const pm = p.package_manager || "unknown";
			map[pm] = (map[pm] ?? 0) + 1;
		}
		return Object.entries(map).sort(([, a], [, b]) => b - a);
	}, [projects]);

	const pmColors: Record<string, string> = {
		pnpm: "bg-[oklch(0.62_0.2_310_/_0.15)] text-[oklch(0.75_0.2_310)] border-[oklch(0.62_0.2_310_/_0.35)]",
		npm: "bg-[oklch(0.62_0.2_25_/_0.15)] text-[oklch(0.78_0.2_25)] border-[oklch(0.62_0.2_25_/_0.35)]",
		pub: "bg-[oklch(0.6_0.18_250_/_0.15)] text-[oklch(0.72_0.18_250)] border-[oklch(0.6_0.18_250_/_0.35)]",
		unknown:
			"bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)]",
	};

	return (
		<div className="glass-card p-4 flex flex-col gap-3">
			<h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
				<Package
					size={14}
					className="text-[var(--color-text-muted)]"
					aria-hidden="true"
				/>
				מנהלי חבילות
			</h3>
			<div className="flex flex-wrap gap-2">
				{counts.map(([pm, count]) => (
					<div
						key={pm}
						className={cn(
							"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium",
							pmColors[pm] ?? pmColors.unknown,
						)}
					>
						<span dir="ltr">{pm}</span>
						<span
							className="px-1 py-0.5 rounded-full bg-black/10 text-[10px] tabular-nums"
							dir="ltr"
						>
							{count}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

// ── Security overview ─────────────────────────────────────────────────────────

function SecurityOverview({ projects }: { projects: ProjectInfo[] }) {
	const stats = useMemo(() => {
		const all = projects.filter((p) => p.security);
		return {
			all: all.length,
			withRls: all.filter((p) => p.security?.rls === true).length,
			withCsp: all.filter((p) => p.security?.csp === true).length,
			withTrivy: all.filter((p) => p.security?.trivy === true).length,
			withSemgrep: all.filter((p) => p.security?.semgrep === true).length,
			withGitleaks: all.filter((p) => p.security?.gitleaks === true).length,
		};
	}, [projects]);

	if (stats.all === 0) return null;

	const rows = [
		{ label: "RLS", count: stats.withRls },
		{ label: "CSP", count: stats.withCsp },
		{ label: "Trivy", count: stats.withTrivy },
		{ label: "Semgrep", count: stats.withSemgrep },
		{ label: "Gitleaks", count: stats.withGitleaks },
	];

	return (
		<div className="glass-card p-4">
			<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
				<Shield
					size={14}
					className="text-[var(--color-text-muted)]"
					aria-hidden="true"
				/>
				כיסוי אבטחה
			</h3>
			<div className="flex flex-col gap-2">
				{rows.map(({ label, count }) => {
					const pct = stats.all > 0 ? Math.round((count / stats.all) * 100) : 0;
					const barColor =
						pct >= 80
							? "oklch(0.72 0.2 155)"
							: pct >= 50
								? "oklch(0.82 0.2 75)"
								: "oklch(0.72 0.2 25)";
					return (
						<div key={label} className="flex items-center gap-2">
							<span
								className="text-[11px] text-[var(--color-text-muted)] font-mono min-w-[60px]"
								dir="ltr"
							>
								{label}
							</span>
							<div className="h-1.5 flex-1 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
								<div
									className="h-full rounded-full transition-all duration-700"
									style={{ width: `${pct}%`, backgroundColor: barColor }}
								/>
							</div>
							<span
								className="text-[10px] tabular-nums text-[var(--color-text-muted)] min-w-[40px] text-end"
								dir="ltr"
							>
								{count}/{stats.all}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

// ── CI coverage summary ───────────────────────────────────────────────────────

function CICoverageSummary({ projects }: { projects: ProjectInfo[] }) {
	const stats = useMemo(() => {
		const withCi = projects.filter((p) => p.ci_workflows?.length > 0);
		const workflowCounts: Record<string, number> = {};
		for (const p of projects) {
			for (const wf of p.ci_workflows ?? []) {
				workflowCounts[wf] = (workflowCounts[wf] ?? 0) + 1;
			}
		}
		const topWorkflows = Object.entries(workflowCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 6);
		return { withCi: withCi.length, topWorkflows, total: projects.length };
	}, [projects]);

	if (!stats.topWorkflows.length) return null;

	return (
		<div className="glass-card p-4">
			<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
				<Play
					size={14}
					className="text-[var(--color-text-muted)]"
					aria-hidden="true"
				/>
				כיסוי CI/CD
				<span className="text-xs text-[var(--color-text-muted)] font-normal">
					{stats.withCi}/{stats.total} פרויקטים
				</span>
			</h3>
			<div className="flex flex-wrap gap-1.5">
				{stats.topWorkflows.map(([wf, count]) => (
					<span
						key={wf}
						className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border bg-[oklch(0.6_0.05_260_/_0.12)] text-[oklch(0.72_0.05_260)] border-[oklch(0.6_0.05_260_/_0.3)]"
					>
						<FileCode2 size={9} aria-hidden="true" />
						{wf}
						<span
							className="px-1 rounded-full bg-black/10 tabular-nums"
							dir="ltr"
						>
							×{count}
						</span>
					</span>
				))}
			</div>
		</div>
	);
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ search }: { search: string }) {
	return (
		<div className="glass-card p-12 text-center flex flex-col items-center gap-3">
			<FolderGit2
				size={40}
				className="text-[var(--color-text-muted)] opacity-40"
				aria-hidden="true"
			/>
			<p className="text-[var(--color-text-muted)] text-sm">
				{search
					? `לא נמצאו פרויקטים התואמים "${search}"`
					: "אין פרויקטים בסינון זה"}
			</p>
			{search && (
				<p className="text-[var(--color-text-muted)] text-xs">
					ניתן לחפש לפי שם, תיאור, Stack, דומיין או מחשב
				</p>
			)}
		</div>
	);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function ProjectsPage() {
	const { data, isLoading } = useProjects();
	const [machineFilter, setMachineFilter] = useState<MachineFilter>("all");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [search, setSearch] = useState("");

	const allProjects = data?.projects ?? [];

	// Machine filter counts
	const machineCounts = useMemo<Record<MachineFilter, number>>(
		() => ({
			all: allProjects.length,
			Lenovo: allProjects.filter((p) => p.machine === "Lenovo").length,
			MSI: allProjects.filter((p) => p.machine === "MSI").length,
		}),
		[allProjects],
	);

	// Status filter counts
	const statusCounts = useMemo<Record<StatusFilter, number>>(
		() => ({
			all: allProjects.length,
			active: allProjects.filter((p) => p.status === "active").length,
			archived: allProjects.filter((p) => p.status === "archived").length,
			development: allProjects.filter((p) => p.status === "development").length,
		}),
		[allProjects],
	);

	// Filtered projects
	const filtered = useMemo<ProjectInfo[]>(() => {
		const q = search.trim().toLowerCase();
		return allProjects.filter((p) => {
			const matchesMachine =
				machineFilter === "all" || p.machine === machineFilter;
			const matchesStatus = statusFilter === "all" || p.status === statusFilter;
			const matchesSearch =
				!q ||
				p.name.toLowerCase().includes(q) ||
				p.display_name.toLowerCase().includes(q) ||
				(p.description_he ?? "").toLowerCase().includes(q) ||
				(p.description_en ?? "").toLowerCase().includes(q) ||
				p.stack.join(" ").toLowerCase().includes(q) ||
				(p.domain ?? "").toLowerCase().includes(q) ||
				(p.github_repo ?? "").toLowerCase().includes(q) ||
				(p.deploy_platform ?? "").toLowerCase().includes(q) ||
				p.features.join(" ").toLowerCase().includes(q) ||
				(p.notes ?? "").toLowerCase().includes(q);
			return matchesMachine && matchesStatus && matchesSearch;
		});
	}, [allProjects, machineFilter, statusFilter, search]);

	return (
		<div className="flex flex-col gap-6">
			{/* ── Header ──────────────────────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<FolderGit2
					size={22}
					className="text-[var(--color-accent-blue)] shrink-0"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-xl font-bold text-[var(--color-text-primary)]">
						פרויקטים — מפה מלאה
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						{data
							? `${data.total} פרויקטים רשומים — ${data.active} פעילים, ${data.development ?? 0} בפיתוח`
							: "טוען נתוני פרויקטים…"}
					</p>
				</div>
			</div>

			{/* ── Summary strip ────────────────────────────────────────────────── */}
			{data && (
				<SummaryStrip
					total={data.total}
					active={data.active}
					archived={data.archived}
					development={data.development}
					lenovoCount={data.by_machine?.["Lenovo"] ?? 0}
					msiCount={data.by_machine?.["MSI"] ?? 0}
					withGithub={data.with_github ?? 0}
					byMachine={data.by_machine ?? {}}
				/>
			)}

			{/* ── Filters bar ──────────────────────────────────────────────────── */}
			<div className="flex flex-col gap-3">
				{/* Search */}
				<div className="relative max-w-sm">
					<Search
						size={15}
						className="absolute inset-y-0 end-3 my-auto text-[var(--color-text-muted)] pointer-events-none"
						aria-hidden="true"
					/>
					<input
						type="search"
						placeholder="חיפוש לפי שם, Stack, דומיין, תיאור…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={cn(
							"w-full h-10 ps-3 pe-9 rounded-lg text-sm",
							"bg-[var(--color-bg-elevated)] border border-[var(--color-border)]",
							"text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
							"focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
							"transition-colors duration-150",
						)}
						aria-label="חיפוש פרויקט"
					/>
				</div>

				{/* Machine tabs */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<Monitor
							size={12}
							className="text-[var(--color-text-muted)]"
							aria-hidden="true"
						/>
						<span className="text-xs text-[var(--color-text-muted)] font-medium">
							מחשב
						</span>
					</div>
					<MachineFilterTabs
						active={machineFilter}
						onSelect={setMachineFilter}
						counts={machineCounts}
					/>
				</div>

				{/* Status tabs */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<Zap
							size={12}
							className="text-[var(--color-text-muted)]"
							aria-hidden="true"
						/>
						<span className="text-xs text-[var(--color-text-muted)] font-medium">
							סטטוס
						</span>
					</div>
					<StatusFilterTabs
						active={statusFilter}
						onSelect={setStatusFilter}
						counts={statusCounts}
					/>
				</div>

				{/* Results count */}
				{!isLoading && (
					<p className="text-xs text-[var(--color-text-muted)]" dir="ltr">
						{filtered.length === allProjects.length
							? `${allProjects.length} פרויקטים`
							: `${filtered.length} מתוך ${allProjects.length} פרויקטים`}
					</p>
				)}
			</div>

			{/* ── Projects grid ────────────────────────────────────────────────── */}
			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{Array.from({ length: 9 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
						<ProjectSkeleton key={i} />
					))}
				</div>
			) : filtered.length === 0 ? (
				<EmptyState search={search} />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{filtered.map((project) => (
						<ProjectCard
							key={project.name}
							project={project}
							allProjects={allProjects}
						/>
					))}
				</div>
			)}

			{/* ── Bottom analytics section ─────────────────────────────────────── */}
			{data && !isLoading && (
				<>
					{/* Divider */}
					<div className="flex items-center gap-3">
						<div className="h-px flex-1 bg-[var(--color-border)]" />
						<span className="text-xs text-[var(--color-text-muted)] font-medium px-1 flex items-center gap-1.5">
							<Zap size={11} aria-hidden="true" />
							אנליטיקס
						</span>
						<div className="h-px flex-1 bg-[var(--color-border)]" />
					</div>

					{/* Charts row */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<DeployPlatformPie byPlatform={data.by_platform} />
						<StackTypeBar byStackType={data.by_stack_type ?? {}} />
					</div>

					{/* Stats row */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<MachineBreakdownCard
							byMachine={data.by_machine}
							total={data.total}
						/>
						<SecurityOverview projects={allProjects} />
						<PackageManagerSummary projects={allProjects} />
					</div>

					{/* CI coverage */}
					<CICoverageSummary projects={allProjects} />
				</>
			)}
		</div>
	);
}
