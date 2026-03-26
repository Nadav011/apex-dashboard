import ReactECharts from "echarts-for-react";
import {
	ExternalLink,
	FolderGit2,
	GitBranch,
	GitCommit,
	Globe,
	Monitor,
	Search,
	Smartphone,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useProjects } from "@/hooks/use-api";
import type { ProjectInfo } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Filter keys ───────────────────────────────────────────────────────────────

type FilterKey = "all" | "pop-os" | "MSI" | "active" | "archived";

const FILTER_LABELS: Record<FilterKey, string> = {
	all: "הכול",
	"pop-os": "pop-os",
	MSI: "MSI",
	active: "פעילים",
	archived: "ארכיון",
};

// ── Stack badge colors ────────────────────────────────────────────────────────

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
	return "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)]";
}

function StackBadges({ stack }: { stack: string | string[] }) {
	const tokens = Array.isArray(stack)
		? stack
		: stack
				.split(/\s*[+·|]\s*/)
				.map((s: string) => s.trim())
				.filter(Boolean);
	return (
		<div className="flex flex-wrap gap-1">
			{tokens.map((token) => (
				<span
					key={token}
					className={cn(
						"inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border leading-none",
						stackBadgeColor(token),
					)}
				>
					{token}
				</span>
			))}
		</div>
	);
}

// ── Machine / Platform badges ─────────────────────────────────────────────────

function MachineBadge({ machine }: { machine: string }) {
	const isPopOs = machine === "pop-os";
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
				isPopOs
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
	if (!platform) return null;
	const isMobile =
		platform === "Mobile" ||
		platform.includes("App Store") ||
		platform.includes("Play Store");
	const isCloudflare = platform === "CF Pages";
	const isNetlify = platform === "Netlify";

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

// ── Status dot ────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 text-xs font-medium shrink-0",
				status === "active"
					? "text-[oklch(0.72_0.2_155)]"
					: "text-[var(--color-text-muted)]",
			)}
		>
			<span
				className={cn(
					"w-1.5 h-1.5 rounded-full shrink-0",
					status === "active"
						? "bg-[oklch(0.72_0.2_155)] shadow-[0_0_6px_oklch(0.72_0.2_155/0.6)]"
						: "bg-[var(--color-text-muted)]",
				)}
				aria-hidden="true"
			/>
			{status === "active" ? "פעיל" : "ארכיון"}
		</span>
	);
}

// ── Commit info ───────────────────────────────────────────────────────────────

function formatRelativeDate(date: Date): string {
	const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
	if (diffDays === 0) return "היום";
	if (diffDays === 1) return "אתמול";
	if (diffDays < 7) return `לפני ${diffDays} ימים`;
	if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
	return `לפני ${Math.floor(diffDays / 30)} חודשים`;
}

function CommitInfo({
	commit,
}: {
	commit: { sha: string; message: string; date: string } | null;
}) {
	if (!commit) return null;
	const relative = formatRelativeDate(new Date(commit.date));
	return (
		<div className="flex items-start gap-1.5 text-[11px] text-[var(--color-text-muted)] mt-1">
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

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: ProjectInfo }) {
	const githubUrl = project.github
		? `https://github.com/${project.github}`
		: null;
	const domainUrl = project.domain ? `https://${project.domain}` : null;

	return (
		<div
			className={cn(
				"glass-card flex flex-col gap-3 p-4 transition-colors duration-200",
				"hover:border-[var(--color-border-hover)]",
				project.status === "archived" && "opacity-60",
			)}
		>
			{/* Name + status */}
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<h3 className="text-sm font-bold text-[var(--color-text-primary)] leading-snug truncate">
						{project.name}
					</h3>
					<p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
						{project.description}
					</p>
				</div>
				<StatusDot status={project.status} />
			</div>

			{/* Stack */}
			<StackBadges stack={project.stack} />

			{/* Machine + platform */}
			<div className="flex flex-wrap gap-1.5">
				<MachineBadge machine={project.machine} />
				{project.platform && <PlatformBadge platform={project.platform} />}
			</div>

			{/* Links */}
			<div className="flex items-center gap-3 flex-wrap">
				{domainUrl && (
					<a
						href={domainUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent-blue)] hover:text-[oklch(0.75_0.18_250)] transition-colors duration-150"
					>
						<ExternalLink size={11} aria-hidden="true" />
						{project.domain}
					</a>
				)}
				{githubUrl && (
					<a
						href={githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-150"
					>
						<GitBranch size={11} aria-hidden="true" />
						<span dir="ltr">{project.github}</span>
					</a>
				)}
			</div>

			{/* Last commit */}
			<CommitInfo commit={project.last_commit} />
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
				<div className="h-4 w-12 bg-[var(--color-bg-elevated)] rounded" />
			</div>
			<div className="flex gap-1.5">
				<div className="h-5 w-12 bg-[var(--color-bg-elevated)] rounded" />
				<div className="h-5 w-9 bg-[var(--color-bg-elevated)] rounded" />
				<div className="h-5 w-11 bg-[var(--color-bg-elevated)] rounded" />
			</div>
			<div className="flex gap-1.5">
				<div className="h-5 w-20 bg-[var(--color-bg-elevated)] rounded-full" />
				<div className="h-5 w-16 bg-[var(--color-bg-elevated)] rounded-full" />
			</div>
			<div className="h-3 bg-[var(--color-bg-elevated)] rounded w-full" />
		</div>
	);
}

// ── Summary stat card ─────────────────────────────────────────────────────────

function StatCard({
	label,
	value,
	color,
}: {
	label: string;
	value: number;
	color: string;
}) {
	return (
		<div className="glass-card p-4 flex flex-col gap-1">
			<div
				className="text-2xl font-bold tabular-nums"
				style={{ color }}
				dir="ltr"
			>
				{value}
			</div>
			<div className="text-xs text-[var(--color-text-muted)]">{label}</div>
		</div>
	);
}

// ── Platform pie chart ────────────────────────────────────────────────────────

const PLATFORM_COLORS = [
	"oklch(0.62 0.2 25)",
	"oklch(0.62 0.2 155)",
	"oklch(0.65 0.18 290)",
	"oklch(0.62 0.05 260)",
	"oklch(0.72 0.18 75)",
	"oklch(0.6 0.18 220)",
];

function buildPieOption(
	data: { name: string; value: number; itemStyle: { color: string } }[],
) {
	return {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			backgroundColor: "oklch(0.18 0.02 260)",
			borderColor: "oklch(0.3 0.04 260)",
			textStyle: { color: "oklch(0.9 0.02 260)" },
			formatter: "{b}: {c} ({d}%)",
		},
		legend: {
			orient: "vertical",
			right: "0%", // rtl-ok — ECharts internal coordinate, not CSS
			top: "center",
			textStyle: { color: "oklch(0.7 0.04 260)", fontSize: 11 },
			itemWidth: 10,
			itemHeight: 10,
		},
		series: [
			{
				type: "pie",
				radius: ["38%", "65%"],
				center: ["36%", "50%"],
				data,
				label: { show: false },
				emphasis: {
					itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.4)" },
				},
			},
		],
	};
}

function PlatformPie({ byPlatform }: { byPlatform: Record<string, number> }) {
	const data = Object.entries(byPlatform)
		.filter(([k]) => k !== "—")
		.map(([name, value], i) => ({
			name,
			value,
			itemStyle: { color: PLATFORM_COLORS[i % PLATFORM_COLORS.length] },
		}));

	return (
		<div className="glass-card p-4">
			<h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
				לפי פלטפורמה
			</h3>
			<ReactECharts
				option={buildPieOption(data)}
				style={{ height: 180 }}
				opts={{ renderer: "svg" }}
			/>
		</div>
	);
}

// ── Machine breakdown bars ────────────────────────────────────────────────────

function MachineBreakdown({
	byMachine,
	total,
}: {
	byMachine: Record<string, number>;
	total: number;
}) {
	return (
		<div className="glass-card p-4 flex flex-col gap-3">
			<h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
				לפי מחשב
			</h3>
			{Object.entries(byMachine).map(([machine, count]) => {
				const pct = total > 0 ? Math.round((count / total) * 100) : 0;
				const barColor =
					machine === "pop-os" ? "oklch(0.65 0.18 250)" : "oklch(0.78 0.18 75)";
				return (
					<div key={machine} className="flex flex-col gap-1">
						<div className="flex items-center justify-between text-xs">
							<span
								className="font-medium text-[var(--color-text-secondary)]"
								dir="ltr"
							>
								{machine}
							</span>
							<span
								className="text-[var(--color-text-muted)] tabular-nums"
								dir="ltr"
							>
								{count}
							</span>
						</div>
						<div className="h-1.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
							<div
								className="h-full rounded-full transition-all duration-500"
								style={{ width: `${pct}%`, backgroundColor: barColor }}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

interface FilterTabsProps {
	active: FilterKey;
	onSelect: (f: FilterKey) => void;
	counts: Record<FilterKey, number>;
}

function FilterTabs({ active, onSelect, counts }: FilterTabsProps) {
	const tabs: FilterKey[] = ["all", "pop-os", "MSI", "active", "archived"];
	return (
		<div className="flex items-center gap-1.5 flex-wrap">
			{tabs.map((key) => (
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
					{FILTER_LABELS[key]}
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

// ── Page ──────────────────────────────────────────────────────────────────────

export function ProjectsPage() {
	const { data, isLoading } = useProjects();
	const [filter, setFilter] = useState<FilterKey>("all");
	const [search, setSearch] = useState("");

	const allProjects = data?.projects ?? [];

	const counts = useMemo<Record<FilterKey, number>>(
		() => ({
			all: allProjects.length,
			"pop-os": allProjects.filter((p) => p.machine === "pop-os").length,
			MSI: allProjects.filter((p) => p.machine === "MSI").length,
			active: allProjects.filter((p) => p.status === "active").length,
			archived: allProjects.filter((p) => p.status === "archived").length,
		}),
		[allProjects],
	);

	const filtered = useMemo<ProjectInfo[]>(() => {
		const q = search.trim().toLowerCase();
		return allProjects.filter((p) => {
			const matchesFilter =
				filter === "all" ||
				(filter === "pop-os" && p.machine === "pop-os") ||
				(filter === "MSI" && p.machine === "MSI") ||
				(filter === "active" && p.status === "active") ||
				(filter === "archived" && p.status === "archived");
			const matchesSearch =
				!q ||
				p.name.toLowerCase().includes(q) ||
				(p.description ?? "").toLowerCase().includes(q) ||
				(Array.isArray(p.stack) ? p.stack.join(" ") : (p.stack ?? ""))
					.toLowerCase()
					.includes(q) ||
				(p.platform ?? "").toLowerCase().includes(q) ||
				(p.github ?? "").toLowerCase().includes(q);
			return matchesFilter && matchesSearch;
		});
	}, [allProjects, filter, search]);

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<FolderGit2
					size={20}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						פרויקטים
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						{data ? `${data.total} פרויקטים, ${data.active} פעילים` : "טוען..."}
					</p>
				</div>
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<StatCard
					label="סה״כ פרויקטים"
					value={data?.total ?? 0}
					color="oklch(0.72 0.18 250)"
				/>
				<StatCard
					label="פעילים"
					value={data?.active ?? 0}
					color="oklch(0.72 0.2 155)"
				/>
				<StatCard
					label="pop-os"
					value={data?.by_machine?.["pop-os"] ?? 0}
					color="oklch(0.72 0.18 250)"
				/>
				<StatCard
					label="MSI"
					value={data?.by_machine?.MSI ?? 0}
					color="oklch(0.82 0.18 75)"
				/>
			</div>

			{/* Charts row */}
			{data && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<PlatformPie byPlatform={data.by_platform} />
					<MachineBreakdown byMachine={data.by_machine} total={data.total} />
				</div>
			)}

			{/* Search + filter */}
			<div className="flex flex-col gap-3">
				<div className="relative max-w-sm">
					<Search
						size={15}
						className="absolute inset-y-0 end-3 my-auto text-[var(--color-text-muted)] pointer-events-none"
						aria-hidden="true"
					/>
					<input
						type="search"
						placeholder="חיפוש פרויקט..."
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
				<FilterTabs active={filter} onSelect={setFilter} counts={counts} />
			</div>

			{/* Grid */}
			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{Array.from({ length: 9 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
						<ProjectSkeleton key={i} />
					))}
				</div>
			) : filtered.length === 0 ? (
				<div className="glass-card p-12 text-center">
					<p className="text-[var(--color-text-muted)] text-sm">
						{search
							? "לא נמצאו פרויקטים התואמים לחיפוש"
							: "אין פרויקטים בסינון זה"}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{filtered.map((project) => (
						<ProjectCard key={project.name} project={project} />
					))}
				</div>
			)}
		</div>
	);
}
