import {
	Activity,
	ChevronDown,
	Copy,
	Cpu,
	FileText,
	RefreshCw,
	Search,
	SearchX,
	Square,
	Users,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAgents, useAgentsLive } from "@/hooks/use-api";
import type { AgentInfo, BackgroundTask, LiveAgent } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Category config ──────────────────────────────────────────────────────────

const CAT_LABELS: Record<string, string> = {
	all: "הכול",
	gsd: "GSD",
	security: "אבטחה",
	quality: "איכות",
	testing: "בדיקות",
	performance: "ביצועים",
	infra: "תשתית",
	general: "כללי",
};

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> =
	{
		gsd: {
			bg: "bg-[oklch(0.65_0.15_270_/_0.15)]",
			text: "text-cat-gsd",
			border: "border-[oklch(0.65_0.15_270_/_0.35)]",
		},
		security: {
			bg: "bg-[oklch(0.62_0.2_25_/_0.15)]",
			text: "text-cat-security",
			border: "border-[oklch(0.62_0.2_25_/_0.35)]",
		},
		quality: {
			bg: "bg-[oklch(0.72_0.18_155_/_0.15)]",
			text: "text-cat-quality",
			border: "border-[oklch(0.72_0.18_155_/_0.35)]",
		},
		testing: {
			bg: "bg-[oklch(0.62_0.18_290_/_0.15)]",
			text: "text-cat-testing",
			border: "border-[oklch(0.62_0.18_290_/_0.35)]",
		},
		performance: {
			bg: "bg-[oklch(0.75_0.14_200_/_0.15)]",
			text: "text-cat-performance",
			border: "border-[oklch(0.75_0.14_200_/_0.35)]",
		},
		infra: {
			bg: "bg-[oklch(0.78_0.16_75_/_0.15)]",
			text: "text-cat-infra",
			border: "border-[oklch(0.78_0.16_75_/_0.35)]",
		},
		general: {
			bg: "bg-[oklch(0.62_0.05_260_/_0.15)]",
			text: "text-cat-general",
			border: "border-[oklch(0.62_0.05_260_/_0.35)]",
		},
	};

function catStyle(cat: string) {
	return (
		CAT_COLORS[cat.toLowerCase()] ?? {
			bg: "bg-bg-elevated",
			text: "text-text-muted",
			border: "border-border",
		}
	);
}

function catLabel(cat: string): string {
	return CAT_LABELS[cat.toLowerCase()] ?? cat;
}

// ── Agent Card ───────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: AgentInfo }) {
	const style = catStyle(agent.category);
	const initials = agent.name
		.split(/[-_\s]/)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? "")
		.join("");

	return (
		<div
			className={cn(
				"glass-card flex flex-col gap-3 p-4 transition-colors duration-200",
				"hover:border-border-hover",
			)}
		>
			{/* Avatar + category badge */}
			<div className="flex items-start justify-between gap-2">
				<div
					className={cn(
						"flex items-center justify-center w-10 h-10 rounded-lg",
						"text-sm font-bold shrink-0",
						style.bg,
						style.text,
					)}
					aria-hidden="true"
				>
					{initials || "?"}
				</div>
				<span
					className={cn(
						"text-xs font-medium px-2 py-0.5 rounded-full border",
						style.bg,
						style.text,
						style.border,
					)}
				>
					{catLabel(agent.category)}
				</span>
			</div>

			{/* Name */}
			<div>
				<h3 className="text-sm font-semibold text-text-primary leading-snug">
					{agent.name}
				</h3>
				<p className="text-xs text-text-muted mt-0.5">{agent.file}</p>
			</div>

			{/* Description */}
			{agent.description && (
				<p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
					{agent.description}
				</p>
			)}
		</div>
	);
}

// ── Skeleton loading ─────────────────────────────────────────────────────────

function AgentSkeleton() {
	return (
		<div className="glass-card card-spotlight p-4 animate-pulse flex flex-col gap-3">
			<div className="flex items-start justify-between">
				<div className="w-10 h-10 rounded-lg bg-bg-elevated" />
				<div className="h-5 w-16 rounded-full bg-bg-elevated" />
			</div>
			<div className="space-y-2">
				<div className="h-4 bg-bg-elevated rounded w-3/4" />
				<div className="h-3 bg-bg-elevated rounded w-1/2" />
			</div>
			<div className="space-y-1.5">
				<div className="h-3 bg-bg-elevated rounded w-full" />
				<div className="h-3 bg-bg-elevated rounded w-2/3" />
			</div>
		</div>
	);
}

// ── Category Tabs ────────────────────────────────────────────────────────────

interface CategoryTabsProps {
	categories: Record<string, number>;
	total: number;
	active: string;
	onSelect: (cat: string) => void;
}

function CategoryTabs({
	categories,
	total,
	active,
	onSelect,
}: CategoryTabsProps) {
	const tabs = [
		{ key: "all", count: total },
		...Object.entries(categories).map(([k, v]) => ({ key: k, count: v })),
	];

	return (
		<div className="flex items-center gap-1.5 flex-wrap">
			{tabs.map(({ key, count }) => {
				const isActive = active === key;
				const style = key === "all" ? null : catStyle(key);
				return (
					<button
						key={key}
						type="button"
						onClick={() => onSelect(key)}
						className={cn(
							"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
							"transition-all duration-150 cursor-pointer min-h-11",
							isActive
								? key === "all"
									? "bg-accent-blue text-white"
									: cn(style?.bg, style?.text, "border", style?.border)
								: "text-text-muted hover:text-text-secondary hover:bg-bg-elevated",
						)}
					>
						{catLabel(key)}
						<span
							className={cn(
								"text-xs tabular-nums px-1.5 py-0.5 rounded-full",
								isActive
									? "bg-white/20 text-current"
									: "bg-bg-elevated text-text-muted",
							)}
							dir="ltr"
						>
							{count}
						</span>
					</button>
				);
			})}
		</div>
	);
}

// ── Live Agent Type Colors ──────────────────────────────────────────────────

const LIVE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
	"claude-subagent": {
		bg: "bg-[oklch(0.6_0.18_30_/_0.15)]",
		text: "text-[oklch(0.75_0.18_30)]",
		dot: "bg-[oklch(0.65_0.2_30)]",
	},
	"claude-session": {
		bg: "bg-[oklch(0.6_0.18_30_/_0.15)]",
		text: "text-[oklch(0.75_0.18_30)]",
		dot: "bg-[oklch(0.65_0.2_30)]",
	},
	gemini: {
		bg: "bg-[oklch(0.6_0.15_270_/_0.15)]",
		text: "text-[oklch(0.75_0.15_270)]",
		dot: "bg-[oklch(0.65_0.18_270)]",
	},
	kimi: {
		bg: "bg-[oklch(0.6_0.15_160_/_0.15)]",
		text: "text-[oklch(0.75_0.15_160)]",
		dot: "bg-[oklch(0.65_0.18_160)]",
	},
	codex: {
		bg: "bg-[oklch(0.6_0.15_200_/_0.15)]",
		text: "text-[oklch(0.75_0.15_200)]",
		dot: "bg-[oklch(0.65_0.18_200)]",
	},
	minimax: {
		bg: "bg-[oklch(0.6_0.15_60_/_0.15)]",
		text: "text-[oklch(0.75_0.15_60)]",
		dot: "bg-[oklch(0.65_0.18_60)]",
	},
	"hydra-watcher": {
		bg: "bg-[oklch(0.6_0.15_120_/_0.15)]",
		text: "text-[oklch(0.75_0.15_120)]",
		dot: "bg-[oklch(0.65_0.18_120)]",
	},
	"hydra-executor": {
		bg: "bg-[oklch(0.6_0.15_120_/_0.15)]",
		text: "text-[oklch(0.75_0.15_120)]",
		dot: "bg-[oklch(0.65_0.18_120)]",
	},
};

function liveColor(type: string) {
	return (
		LIVE_COLORS[type] ?? {
			bg: "bg-bg-elevated",
			text: "text-text-muted",
			dot: "bg-text-muted",
		}
	);
}

function LiveAgentCard({
	agent,
	expanded,
	onToggle,
}: {
	agent: LiveAgent;
	expanded: boolean;
	onToggle: () => void;
}) {
	const c = liveColor(agent.type);
	const desc = agent.description;
	const uptime = agent.uptime;
	const status = agent.status;
	const catBadge = agent.category ? catStyle(agent.category) : null;

	function copyPid() {
		navigator.clipboard.writeText(String(agent.pid)).catch(() => undefined);
	}

	function handleAction(action: "restart" | "stop" | "log", pid: number) {
		fetch("https://api.nadavc.ai/api/control/agent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action, pid }),
		}).catch(console.error);
	}

	// Determine which control buttons to show based on agent.type
	const FULL_CONTROL_TYPES = new Set([
		"hydra-watcher",
		"ambient-receiver",
		"devbot",
		"memory-inbox",
		"hermes-gateway",
		"apex-observer",
		"dashboard-api",
	]);
	const STOP_ONLY_TYPES = new Set(["gemini", "kimi", "codex", "minimax"]);
	const NO_CONTROL_TYPES = new Set(["gh-runner", "hydra-executor"]);
	const CLAUDE_TYPES = new Set([
		"claude-interactive",
		"claude-subagent",
		"claude-headless",
	]);

	const showRestart =
		FULL_CONTROL_TYPES.has(agent.type) && !NO_CONTROL_TYPES.has(agent.type);
	const showStop =
		(FULL_CONTROL_TYPES.has(agent.type) || STOP_ONLY_TYPES.has(agent.type)) &&
		!NO_CONTROL_TYPES.has(agent.type);
	const showLog =
		!NO_CONTROL_TYPES.has(agent.type) &&
		(FULL_CONTROL_TYPES.has(agent.type) ||
			STOP_ONLY_TYPES.has(agent.type) ||
			CLAUDE_TYPES.has(agent.type));
	const showAnyButton = showRestart || showStop || showLog;

	return (
		<div
			className={cn(
				"glass-card flex flex-col transition-colors duration-200",
				c.bg,
				expanded ? "ring-1 ring-border-hover" : "",
			)}
		>
			{/* Main row — always visible */}
			<button
				type="button"
				onClick={onToggle}
				className="flex items-center gap-3 p-3 w-full text-start cursor-pointer"
				aria-expanded={expanded}
			>
				<div className="relative shrink-0">
					<Cpu size={20} className={c.text} />
					<span
						className={cn(
							"absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full",
							status === "active" ? "animate-pulse" : "",
							c.dot,
						)}
					/>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<span className={cn("text-sm font-semibold", c.text)}>
							{desc || agent.type}
						</span>
					</div>
					<div className="flex items-center gap-2 mt-0.5">
						<span className="text-xs text-text-muted tabular-nums" dir="ltr">
							PID {agent.pid}
						</span>
						{uptime && (
							<span className="text-xs text-text-muted">{uptime}</span>
						)}
						<span className="text-xs text-text-muted tabular-nums" dir="ltr">
							{agent.cpu}% CPU
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<span
						className={cn(
							"text-xs font-medium px-1.5 py-0.5 rounded",
							status === "active"
								? "bg-[oklch(0.45_0.18_145_/_0.2)] text-accent-green"
								: "bg-bg-elevated text-text-muted",
						)}
					>
						{status === "active" ? "פעיל" : "ממתין"}
					</span>
					<ChevronDown
						size={14}
						className={cn(
							"text-text-muted transition-transform duration-200",
							expanded ? "rotate-180" : "",
						)}
					/>
				</div>
			</button>

			{/* Expanded details */}
			{expanded && (
				<div className="border-t border-border px-3 pb-3 pt-2 flex flex-col gap-2">
					{/* Category badge */}
					{catBadge && agent.category && (
						<div className="flex items-center gap-1.5">
							<span className="text-xs text-text-muted">קטגוריה:</span>
							<span
								className={cn(
									"text-xs font-medium px-2 py-0.5 rounded-full border",
									catBadge.bg,
									catBadge.text,
									catBadge.border,
								)}
							>
								{catLabel(agent.category)}
							</span>
						</div>
					)}

					{/* PID with copy */}
					<div className="flex items-center gap-1.5">
						<span className="text-xs text-text-muted">PID:</span>
						<span
							className="text-xs font-mono text-text-primary tabular-nums"
							dir="ltr"
						>
							{agent.pid}
						</span>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								copyPid();
							}}
							className="flex items-center gap-0.5 text-xs text-text-muted hover:text-text-secondary transition-colors px-1 py-0.5 rounded hover:bg-bg-elevated"
							title="העתק PID"
						>
							<Copy size={11} />
						</button>
					</div>

					{/* Memory */}
					<div className="flex items-center gap-1.5">
						<span className="text-xs text-text-muted">זיכרון:</span>
						<span className="text-xs text-text-primary tabular-nums" dir="ltr">
							{agent.mem.toFixed(1)}%
						</span>
					</div>

					{/* Full command line */}
					<div className="flex flex-col gap-0.5">
						<span className="text-xs text-text-muted">פקודה:</span>
						<code
							className="text-xs font-mono text-text-secondary bg-bg-elevated rounded px-2 py-1.5 break-all leading-relaxed"
							dir="ltr"
						>
							{agent.cmd}
						</code>
					</div>

					{/* Control buttons */}
					{showAnyButton && (
						<div className="flex items-center gap-1.5 pt-1 flex-wrap">
							{showRestart && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleAction("restart", agent.pid);
									}}
									className={cn(
										"inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium",
										"bg-[oklch(0.55_0.18_75_/_0.15)] text-[oklch(0.78_0.18_75)] border border-[oklch(0.55_0.18_75_/_0.3)]",
										"hover:bg-[oklch(0.55_0.18_75_/_0.25)] transition-colors duration-150",
									)}
								>
									<RefreshCw size={11} />
									הפעל מחדש
								</button>
							)}
							{showStop && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleAction("stop", agent.pid);
									}}
									className={cn(
										"inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium",
										"bg-[oklch(0.55_0.2_25_/_0.15)] text-[oklch(0.72_0.2_25)] border border-[oklch(0.55_0.2_25_/_0.3)]",
										"hover:bg-[oklch(0.55_0.2_25_/_0.25)] transition-colors duration-150",
									)}
								>
									<Square size={11} />
									עצור
								</button>
							)}
							{showLog && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleAction("log", agent.pid);
									}}
									className={cn(
										"inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium",
										"bg-[oklch(0.55_0.15_240_/_0.15)] text-[oklch(0.72_0.15_240)] border border-[oklch(0.55_0.15_240_/_0.3)]",
										"hover:bg-[oklch(0.55_0.15_240_/_0.25)] transition-colors duration-150",
									)}
								>
									<FileText size={11} />
									צפה בלוג
								</button>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function LiveSection() {
	const { data: liveData, isLoading, isError } = useAgentsLive();
	const [expandedPids, setExpandedPids] = useState<Set<number>>(new Set());

	function togglePid(pid: number) {
		setExpandedPids((prev) => {
			const next = new Set(prev);
			if (next.has(pid)) {
				next.delete(pid);
			} else {
				next.add(pid);
			}
			return next;
		});
	}

	// Filter out CI runners — they belong on CI/CD page, not Fleet
	const agents = (liveData?.live_agents ?? []).filter(
		(a) => a.category !== "ci",
	);
	const bgRecent =
		liveData?.background_tasks?.filter(
			(t: BackgroundTask) => t.status === "recent",
		).length ?? 0;

	const summaryHe = (liveData as { summary_he?: string } | undefined)
		?.summary_he;

	// Active = cpu > 0, idle = cpu === 0
	const activeCount = agents.filter((a) => a.cpu > 0).length;
	const idleCount = agents.length - activeCount;

	// Per-category counts for summary badges
	const catCounts = agents.reduce<Record<string, number>>((acc, a) => {
		const cat = a.category || a.type;
		acc[cat] = (acc[cat] ?? 0) + 1;
		return acc;
	}, {});

	// Group by category (not type) for cleaner display
	const groups = agents.reduce<Record<string, LiveAgent[]>>((acc, a) => {
		const cat = a.category || a.type;
		if (!acc[cat]) acc[cat] = [];
		acc[cat].push(a);
		return acc;
	}, {});

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-2">
						<Activity size={18} className="text-accent-green" />
						<h2 className="text-base font-semibold text-text-primary">
							סוכנים פעילים עכשיו
						</h2>
					</div>
					{/* Summary counts */}
					{agents.length > 0 && (
						<div className="flex items-center gap-1.5 flex-wrap">
							{/* Active badge */}
							<span
								className="text-xs font-medium px-2 py-0.5 rounded-full tabular-nums bg-[oklch(0.45_0.18_145_/_0.2)] text-accent-green"
								dir="ltr"
							>
								{activeCount} פעיל
							</span>
							{/* Idle badge */}
							{idleCount > 0 && (
								<span
									className="text-xs font-medium px-2 py-0.5 rounded-full tabular-nums bg-bg-elevated text-text-muted"
									dir="ltr"
								>
									{idleCount} ממתין
								</span>
							)}
							{/* Per-category badges */}
							{Object.entries(catCounts).map(([cat, count]) => {
								const s = liveColor(cat);
								return (
									<span
										key={cat}
										className={cn(
											"text-xs font-medium px-2 py-0.5 rounded-full tabular-nums",
											s.bg,
											s.text,
										)}
										dir="ltr"
									>
										{cat} {count}
									</span>
								);
							})}
						</div>
					)}
					{agents.length === 0 && !isLoading && !isError && (
						<span
							className="text-xs font-bold px-2 py-0.5 rounded-full tabular-nums bg-bg-elevated text-text-muted self-start"
							dir="ltr"
						>
							0
						</span>
					)}
				</div>
				<div className="flex items-center gap-3 shrink-0">
					{summaryHe && (
						<span className="text-xs text-text-secondary">{summaryHe}</span>
					)}
					{bgRecent > 0 && (
						<div className="flex items-center gap-1.5 text-xs text-text-muted">
							<Zap size={13} className="text-accent-amber" />
							<span dir="ltr">{bgRecent} background tasks</span>
						</div>
					)}
				</div>
			</div>

			{isLoading ? (
				<div className="glass-card p-4 text-center text-sm text-text-muted animate-pulse">
					טוען ניטור סוכנים...
				</div>
			) : isError ? (
				<div className="glass-card p-4 text-center text-sm text-text-muted">
					ניטור לא זמין — API לא מגיב
				</div>
			) : agents.length === 0 ? (
				<div className="glass-card p-4 text-center text-sm text-text-muted">
					אין סוכנים פעילים כרגע
				</div>
			) : (
				<div className="space-y-2">
					{Object.entries(groups).map(([type, list]) => (
						<div key={type}>
							<div className="flex items-center gap-2 mb-1.5">
								<span
									className={cn(
										"text-xs font-medium px-2 py-0.5 rounded-full",
										liveColor(type).bg,
										liveColor(type).text,
									)}
								>
									{type} ({list.length})
								</span>
							</div>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
								{list.map((a) => (
									<LiveAgentCard
										key={a.pid}
										agent={a}
										expanded={expandedPids.has(a.pid)}
										onToggle={() => togglePid(a.pid)}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function FleetPage() {
	const { data, isLoading } = useAgents();
	const [activeCategory, setActiveCategory] = useState("all");
	const [search, setSearch] = useState("");

	// data is AgentInfo[] (flat array from backend)
	const allAgents = data ?? [];

	// Derive categories count from the array
	const categories = useMemo<Record<string, number>>(() => {
		const acc: Record<string, number> = {};
		for (const a of allAgents) {
			const cat = a.category.toLowerCase();
			acc[cat] = (acc[cat] ?? 0) + 1;
		}
		return acc;
	}, [allAgents]);

	const filtered = useMemo<AgentInfo[]>(() => {
		const q = search.trim().toLowerCase();
		return allAgents.filter((a) => {
			const matchesCat =
				activeCategory === "all" ||
				a.category.toLowerCase() === activeCategory.toLowerCase();
			const matchesSearch =
				!q ||
				a.name.toLowerCase().includes(q) ||
				(a.description ?? "").toLowerCase().includes(q) ||
				a.category.toLowerCase().includes(q);
			return matchesCat && matchesSearch;
		});
	}, [allAgents, activeCategory, search]);

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				icon={Users}
				title="צי סוכנים"
				description="כל הסוכנים המוגדרים במערכת — פנימיים וחיצוניים"
			/>

			{/* Live Agents — real-time monitoring */}
			<LiveSection />

			<div className="border-t border-border" />

			{/* Controls */}
			<div className="flex flex-col gap-3">
				{/* Search */}
				<div className="relative max-w-sm">
					<Search
						size={15}
						className="absolute inset-y-0 inset-e-3 my-auto text-text-muted pointer-events-none"
						aria-hidden="true"
					/>
					<input
						type="search"
						placeholder="חיפוש סוכן..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={cn(
							"w-full h-10 ps-3 pe-9 rounded-lg text-sm",
							"bg-bg-elevated border border-border",
							"text-text-primary placeholder:text-text-muted",
							"focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
							"transition-colors duration-150",
						)}
						aria-label="חיפוש סוכן"
					/>
				</div>

				{/* Category tabs */}
				{data && (
					<CategoryTabs
						categories={categories}
						total={allAgents.length}
						active={activeCategory}
						onSelect={setActiveCategory}
					/>
				)}
			</div>

			{/* Agent Grid */}
			{isLoading ? (
				<div className="grid-cards stagger-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
					{Array.from({ length: 12 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
						<AgentSkeleton key={i} />
					))}
				</div>
			) : filtered.length === 0 ? (
				<EmptyState
					icon={SearchX}
					title={search ? "לא נמצאו סוכנים" : "אין סוכנים בקטגוריה זו"}
					description={
						search
							? `לא נמצאו סוכנים התואמים לחיפוש "${search}"`
							: "נסה לבחור קטגוריה אחרת"
					}
				/>
			) : (
				<div className="grid-cards stagger-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
					{filtered.map((agent) => (
						<AgentCard key={agent.name} agent={agent} />
					))}
				</div>
			)}
		</div>
	);
}
