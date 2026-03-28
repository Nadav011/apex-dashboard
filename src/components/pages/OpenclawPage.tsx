import ReactECharts from "echarts-for-react";
import { Cpu, FolderOpen, Package, Puzzle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useOpenclawDetails } from "@/hooks/use-api";
import type { OpenclawSkill } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Category classification ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
	"apex-": "oklch(0.65 0.18 250)",
	"ui-": "oklch(0.75 0.14 200)",
	"flutter-": "oklch(0.72 0.19 155)",
	security: "oklch(0.62 0.22 25)",
	"openclaw-": "oklch(0.62 0.2 290)",
	"agent-": "oklch(0.78 0.16 75)",
	other: "oklch(0.55 0.02 260)",
};

const CATEGORY_LABELS: Record<string, string> = {
	"apex-": "APEX",
	"ui-": "ממשק",
	"flutter-": "Flutter",
	security: "אבטחה",
	"openclaw-": "OpenClaw",
	"agent-": "סוכן",
	other: "כללי",
};

function classifySkill(slug: string): string {
	const s = slug.toLowerCase();
	if (s.startsWith("apex-")) return "apex-";
	if (s.startsWith("ui-")) return "ui-";
	if (s.startsWith("flutter-")) return "flutter-";
	if (s.includes("security") || s.includes("guardian") || s.includes("guard"))
		return "security";
	if (s.startsWith("openclaw-")) return "openclaw-";
	if (s.includes("agent-") || s.startsWith("agent-")) return "agent-";
	return "other";
}

function categoryColor(cat: string): string {
	return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other;
}

function categoryLabel(cat: string): string {
	return CATEGORY_LABELS[cat] ?? "כללי";
}

// ── Summary stat card ─────────────────────────────────────────────────────────

function StatCard({
	icon,
	label,
	value,
	color,
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	color: string;
}) {
	return (
		<div
			className="glass-card p-4 flex items-center gap-4"
			style={{ borderColor: `${color}4d` }}
		>
			<span
				className="flex size-10 shrink-0 items-center justify-center rounded-xl"
				style={{ background: `${color}22` }}
				aria-hidden="true"
			>
				<span style={{ color }}>{icon}</span>
			</span>
			<div className="min-w-0">
				<div
					className="text-2xl font-bold tabular-nums leading-none"
					style={{ color }}
					dir="ltr"
				>
					{value}
				</div>
				<div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
					{label}
				</div>
			</div>
		</div>
	);
}

// ── Category badge ─────────────────────────────────────────────────────────────

function CategoryBadge({ cat }: { cat: string }) {
	const color = categoryColor(cat);
	return (
		<span
			className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
			style={{ background: `${color}22`, color }}
		>
			{categoryLabel(cat)}
		</span>
	);
}

// ── Skill card ────────────────────────────────────────────────────────────────

function SkillCard({ skill }: { skill: OpenclawSkill }) {
	const cat = classifySkill(skill.slug);
	const color = categoryColor(cat);

	return (
		<div
			className="glass-card p-4 flex flex-col gap-2.5 hover:shadow-[0_0_16px_oklch(0.65_0.18_250/0.15)] transition-shadow duration-200"
			style={{ borderColor: `${color}33` }}
		>
			{/* Top row: name + badge */}
			<div className="flex items-start justify-between gap-2">
				<span className="text-sm font-semibold text-[var(--color-text-primary)] truncate leading-tight">
					{skill.name}
				</span>
				<CategoryBadge cat={cat} />
			</div>

			{/* Description */}
			{skill.description && (
				<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
					{skill.description}
				</p>
			)}

			{/* Footer: size + version */}
			<div className="flex items-center justify-between mt-auto pt-1">
				<span
					className="text-xs font-mono text-[var(--color-text-muted)] tabular-nums"
					dir="ltr"
				>
					{skill.size_kb} KB
				</span>
				{skill.version && (
					<span className="text-xs font-mono" style={{ color }} dir="ltr">
						v{skill.version}
					</span>
				)}
			</div>
		</div>
	);
}

// ── ECharts: Category pie ─────────────────────────────────────────────────────

function CategoryPieChart({
	categoryCounts,
}: {
	categoryCounts: Record<string, number>;
}) {
	const entries = Object.entries(categoryCounts)
		.filter(([, v]) => v > 0)
		.sort(([, a], [, b]) => b - a);

	const total = entries.reduce((s, [, v]) => s + v, 0);

	// rtl-ok: all ECharts layout values (left/right/center) are internal pixel offsets, not CSS direction
	const option = {
		backgroundColor: "transparent",
		tooltip: {
			trigger: "item",
			backgroundColor: "oklch(0.19 0.015 260)",
			borderColor: "oklch(0.28 0.02 260)",
			textStyle: { color: "oklch(0.95 0.01 260)", fontSize: 12 },
			formatter: "{b}: {c} ({d}%)",
		},
		legend: {
			orient: "vertical",
			right: 8, // rtl-ok — ECharts internal chart layout
			top: "center", // rtl-ok
			textStyle: { color: "oklch(0.72 0.02 260)", fontSize: 11 },
		},
		series: [
			{
				type: "pie",
				radius: ["45%", "72%"],
				center: ["38%", "50%"], // rtl-ok
				data: entries.map(([cat, count]) => ({
					value: count,
					name: categoryLabel(cat),
					itemStyle: { color: categoryColor(cat) },
				})),
				label: { show: false },
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0,0,0,0.4)",
					},
				},
			},
		],
		graphic:
			total === 0
				? []
				: [
						{
							type: "text",
							left: "34%", // rtl-ok — ECharts graphic pixel offset, not CSS
							top: "center", // rtl-ok
							style: {
								text: String(total),
								textAlign: "center",
								fill: "oklch(0.95 0.01 260)",
								fontSize: 18,
								fontWeight: "bold",
							},
						},
					],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: 200 }}
			opts={{ renderer: "canvas" }}
		/>
	);
}

// ── Subagents list ────────────────────────────────────────────────────────────

function SubagentRow({ name, path }: { name: string; path: string }) {
	return (
		<div className="flex items-center gap-3 py-2.5 border-b border-[var(--color-border)] last:border-0">
			<Cpu
				size={14}
				className="shrink-0 text-[var(--color-accent-purple)]"
				aria-hidden="true"
			/>
			<div className="flex-1 min-w-0">
				<span className="text-sm font-medium text-[var(--color-text-primary)]">
					{name}
				</span>
			</div>
			<span
				className="text-xs font-mono text-[var(--color-text-muted)] truncate max-w-[200px]"
				dir="ltr"
			>
				{path}
			</span>
		</div>
	);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function OpenclawPage() {
	const { data, isLoading, error } = useOpenclawDetails();
	const [search, setSearch] = useState("");

	const skills = data?.skills ?? [];
	const subagents = data?.subagents ?? [];

	// Category counts for pie chart
	const categoryCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const cat of Object.keys(CATEGORY_COLORS)) {
			counts[cat] = 0;
		}
		for (const skill of skills) {
			const cat = classifySkill(skill.slug);
			counts[cat] = (counts[cat] ?? 0) + 1;
		}
		return counts;
	}, [skills]);

	// Filtered skills
	const filteredSkills = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return skills;
		return skills.filter(
			(s) =>
				s.name.toLowerCase().includes(q) ||
				s.slug.toLowerCase().includes(q) ||
				s.description.toLowerCase().includes(q) ||
				s.tags.some((t) => t.toLowerCase().includes(q)),
		);
	}, [skills, search]);

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-64">
				<div className="glass-card p-8 text-center">
					<Puzzle
						size={32}
						className="mx-auto mb-3 text-[var(--color-status-critical)] opacity-60"
					/>
					<p className="text-sm text-[var(--color-text-muted)]">
						שגיאה בטעינת נתוני OpenClaw
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 bg-zinc-950 min-h-screen p-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Puzzle
					size={20}
					className="text-[var(--color-accent-purple)]"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						OpenClaw
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						מיומנויות · סוכנים · פלאגינים · ניהול יכולות
					</p>
				</div>
			</div>

			{/* Summary stats */}
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
				<StatCard
					icon={<Package size={20} />}
					label="מיומנויות"
					value={isLoading ? "—" : (data?.skills_count ?? 0)}
					color="oklch(0.62 0.2 290)"
				/>
				<StatCard
					icon={<Cpu size={20} />}
					label="סוכנים"
					value={isLoading ? "—" : (data?.subagents_count ?? 0)}
					color="oklch(0.65 0.18 250)"
				/>
				<StatCard
					icon={<FolderOpen size={20} />}
					label="גרסה"
					value={isLoading ? "—" : data?.version || "—"}
					color="oklch(0.72 0.19 155)"
				/>
			</div>

			{/* Charts row + subagents */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<GlassCard title="קטגוריות מיומנויות" icon={<Puzzle size={16} />}>
					{isLoading ? (
						<div className="h-[200px] flex items-center justify-center text-sm text-[var(--color-text-muted)]">
							טוען...
						</div>
					) : (
						<CategoryPieChart categoryCounts={categoryCounts} />
					)}
				</GlassCard>

				<GlassCard
					title={`סוכנים (${data?.subagents_count ?? 0})`}
					icon={<Cpu size={16} />}
				>
					{isLoading ? (
						<div className="py-6 text-center text-sm text-[var(--color-text-muted)]">
							טוען...
						</div>
					) : subagents.length === 0 ? (
						<p className="text-sm text-[var(--color-text-muted)] text-center py-6">
							אין סוכנים
						</p>
					) : (
						<div className="overflow-y-auto max-h-48">
							{subagents.map((a) => (
								<SubagentRow key={a.name} name={a.name} path={a.path} />
							))}
						</div>
					)}
				</GlassCard>
			</div>

			{/* Skills grid with search */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between flex-wrap gap-3">
					<h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
						מיומנויות ({filteredSkills.length}
						{search ? `/${skills.length}` : ""})
					</h2>

					{/* Search */}
					<label className="relative flex items-center">
						<Search
							size={14}
							className="absolute inset-s-3 text-[var(--color-text-muted)] pointer-events-none"
							aria-hidden="true"
						/>
						<input
							type="search"
							placeholder="חיפוש מיומנות..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className={cn(
								"ps-8 pe-3 py-2 text-sm rounded-lg w-56",
								"bg-[var(--color-bg-elevated)] border border-[var(--color-border)]",
								"text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
								"focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)]",
								"focus:border-[var(--color-accent-blue)] transition-colors duration-150",
							)}
							aria-label="חיפוש מיומנות"
						/>
					</label>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
								key={i}
								className="glass-card h-28 animate-pulse"
								aria-hidden="true"
							/>
						))}
					</div>
				) : filteredSkills.length === 0 ? (
					<div className="glass-card p-10 text-center">
						<Search
							size={28}
							className="mx-auto mb-3 text-[var(--color-text-muted)] opacity-40"
						/>
						<p className="text-sm text-[var(--color-text-muted)]">
							{search ? "לא נמצאו תוצאות" : "אין מיומנויות"}
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{filteredSkills.map((skill) => (
							<SkillCard key={skill.slug} skill={skill} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
