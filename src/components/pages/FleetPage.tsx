import { Search, SearchX, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAgents } from "@/hooks/use-api";
import type { AgentInfo } from "@/lib/api";
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
