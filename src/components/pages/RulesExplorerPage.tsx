import ReactECharts from "echarts-for-react";
import { FileText, Shield } from "lucide-react";
import { useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRules } from "@/hooks/use-api";
import type { RuleInfo } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Static metadata ────────────────────────────────────────────────────────────

interface RuleMetadata {
	description: string;
	loadType: "always" | "on-demand";
}

const RULE_METADATA: Record<string, RuleMetadata> = {
	"auto-learned-rules.md": {
		description: "כללים שנלמדו אוטומטית (confidence scoring)",
		loadType: "always",
	},
	"code-quality.md": {
		description: "כללי קוד (naming, limits, TypeScript zero-tolerance)",
		loadType: "always",
	},
	"past-mistakes.md": {
		description: "טעויות נפוצות (RTL, Framework, Security, Supabase RLS)",
		loadType: "always",
	},
	"verification.md": {
		description: "אימות ובדיקות (3-tier, L10+ review)",
		loadType: "always",
	},
	"rtl-i18n.md": {
		description: "RTL ו-i18n (Tailwind mapping, patterns)",
		loadType: "always",
	},
	"auto-learned-rules-archive.md": {
		description: "ארכיון כללים שהועברו",
		loadType: "always",
	},
	"security.md": {
		description: "אבטחה (Zero Trust, CVEs, rules)",
		loadType: "always",
	},
	"ai-security.md": {
		description: "אבטחת AI (6 layers, OWASP ASI01-10)",
		loadType: "always",
	},
	"audit-gates.md": {
		description: "שערי אימות (3-tier, L10+ review)",
		loadType: "always",
	},
	"ops-rules.md": {
		description: "תפעול (machine mapping, sync, agent config)",
		loadType: "on-demand",
	},
	"hydra-v2-rules.md": {
		description: "כללי Hydra v2 (LangGraph, SQLite, LanceDB)",
		loadType: "on-demand",
	},
	"stack-rules.md": {
		description: "כללי stack (Flutter 2026, Codex config)",
		loadType: "on-demand",
	},
};

// ── Category config ────────────────────────────────────────────────────────────

interface CategoryConfig {
	label: string;
	hebrewLabel: string;
	color: string;
	loadNote: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
	quality: {
		label: "quality/",
		hebrewLabel: "איכות קוד",
		color: "oklch(0.72 0.19 155)",
		loadNote: "תמיד טעונים",
	},
	security: {
		label: "security/",
		hebrewLabel: "אבטחה",
		color: "oklch(0.62 0.22 25)",
		loadNote: "תמיד טעונים",
	},
	verification: {
		label: "verification/",
		hebrewLabel: "אימות",
		color: "oklch(0.65 0.18 250)",
		loadNote: "תמיד טעונים",
	},
	infra: {
		label: "infra/",
		hebrewLabel: "תשתית",
		color: "oklch(0.78 0.16 75)",
		loadNote: "לפי דרישה",
	},
};

const CATEGORY_ORDER = [
	"quality",
	"security",
	"verification",
	"infra",
] as const;

function getCategoryConfig(category: string): CategoryConfig {
	return (
		CATEGORY_CONFIG[category] ?? {
			label: category,
			hebrewLabel: category,
			color: "oklch(0.62 0.05 260)",
			loadNote: "לא ידוע",
		}
	);
}

function getRuleMetadata(name: string): RuleMetadata {
	return (
		RULE_METADATA[name] ?? {
			description: "קובץ כללים",
			loadType: "on-demand",
		}
	);
}

// ── Relative date ──────────────────────────────────────────────────────────────

function relativeDate(iso: string): string {
	try {
		const diff = Date.now() - new Date(iso).getTime();
		const mins = Math.floor(diff / 60_000);
		if (mins < 1) return "עכשיו";
		if (mins < 60) return `לפני ${mins} דק׳`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `לפני ${hours} שע׳`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `לפני ${days} ימים`;
		const months = Math.floor(days / 30);
		return `לפני ${months} חד׳`;
	} catch {
		return iso;
	}
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SummaryStatCard({
	label,
	value,
	color,
	sub,
}: {
	label: string;
	value: string | number;
	color: string;
	sub?: string;
}) {
	return (
		<div
			className="glass-card p-4 flex items-center gap-4"
			style={{ borderColor: `${color}4d` }}
		>
			<div
				className="flex size-10 shrink-0 items-center justify-center rounded-xl"
				style={{ background: `${color}22` }}
				aria-hidden="true"
			>
				<Shield size={18} style={{ color }} />
			</div>
			<div className="min-w-0">
				<div
					className="text-2xl font-bold tabular-nums leading-none"
					style={{ color }}
					dir="ltr"
				>
					{value}
				</div>
				<div className="text-xs text-text-muted mt-0.5">{label}</div>
				{sub && <div className="text-xs text-text-muted/70 mt-0.5">{sub}</div>}
			</div>
		</div>
	);
}

function LoadTypeBadge({ type }: { type: "always" | "on-demand" }) {
	const isAlways = type === "always";
	return (
		<span
			className={cn(
				"inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold leading-tight shrink-0",
				isAlways
					? "bg-accent-green/15 text-accent-green border border-accent-green/30"
					: "bg-accent-amber/15 text-accent-amber border border-accent-amber/30",
			)}
		>
			{isAlways ? "תמיד טעון" : "לפי דרישה"}
		</span>
	);
}

function CategoryBadge({ category }: { category: string }) {
	const cfg = getCategoryConfig(category);
	return (
		<span
			className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold leading-tight shrink-0"
			style={{
				background: `${cfg.color}18`,
				color: cfg.color,
				border: `1px solid ${cfg.color}40`,
			}}
		>
			{cfg.hebrewLabel}
		</span>
	);
}

function RuleFileCard({ rule }: { rule: RuleInfo }) {
	const meta = getRuleMetadata(rule.name);
	return (
		<div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-bg-elevated/30 transition-colors rounded-lg px-2 -mx-2">
			{/* File icon */}
			<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-elevated mt-0.5">
				<FileText size={14} className="text-text-muted" aria-hidden="true" />
			</div>

			{/* Main content */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap mb-1">
					<span className="text-sm font-mono font-semibold text-text-primary truncate">
						{rule.name}
					</span>
					<CategoryBadge category={rule.category} />
					<LoadTypeBadge type={meta.loadType} />
				</div>

				<p className="text-xs text-text-secondary leading-relaxed mb-1.5">
					{meta.description}
				</p>

				<div className="flex items-center gap-3 text-[11px] text-text-muted">
					<span dir="ltr" className="tabular-nums">
						{rule.size_kb.toFixed(1)} KB
					</span>
					<span className="text-border">·</span>
					<span>{relativeDate(rule.last_modified)}</span>
				</div>
			</div>
		</div>
	);
}

function CategorySection({
	category,
	rules,
}: {
	category: string;
	rules: RuleInfo[];
}) {
	const cfg = getCategoryConfig(category);
	const totalKb = rules.reduce((s, r) => s + r.size_kb, 0);

	return (
		<GlassCard
			title={`${cfg.hebrewLabel} — ${cfg.label}`}
			subtitle={`${rules.length} קבצים · ${totalKb.toFixed(1)} KB · ${cfg.loadNote}`}
			icon={<Shield size={16} />}
		>
			<div>
				{rules.map((rule) => (
					<RuleFileCard key={rule.path} rule={rule} />
				))}
				{rules.length === 0 && (
					<p className="text-sm text-text-muted text-center py-4">
						אין קבצים בקטגוריה זו
					</p>
				)}
			</div>
		</GlassCard>
	);
}

// ── Pie chart ──────────────────────────────────────────────────────────────────

function CategoryPieChart({
	byCategory,
}: {
	byCategory: Record<string, number>;
}) {
	const data = useMemo(
		() =>
			Object.entries(byCategory)
				.filter(([, count]) => count > 0)
				.map(([cat, count]) => {
					const cfg = getCategoryConfig(cat);
					return {
						name: cfg.hebrewLabel,
						value: count,
						itemStyle: { color: cfg.color },
					};
				}),
		[byCategory],
	);

	const option = useMemo(
		() => ({
			backgroundColor: "transparent",
			tooltip: {
				trigger: "item",
				backgroundColor: "oklch(0.22 0.02 260)",
				borderColor: "oklch(0.28 0.02 260)",
				textStyle: { color: "oklch(0.95 0.01 260)", fontSize: 12 },
				formatter: "{b}: {c} קבצים ({d}%)",
			},
			series: [
				{
					type: "pie",
					radius: ["42%", "70%"],
					center: ["50%", "50%"],
					data,
					label: {
						show: true,
						color: "oklch(0.72 0.02 260)",
						fontSize: 11,
						formatter: "{b}\n{d}%",
					},
					labelLine: {
						lineStyle: { color: "oklch(0.38 0.03 260)" },
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 16,
							shadowColor: "oklch(0.65 0.18 250 / 0.4)",
						},
					},
				},
			],
		}),
		[data],
	);

	return (
		<ReactECharts
			option={option}
			style={{ height: 220 }}
			opts={{ renderer: "svg" }}
		/>
	);
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function LoadingSkeleton() {
	return (
		<div className="space-y-6" dir="rtl">
			<div>
				<div className="h-6 w-48 bg-bg-elevated rounded animate-pulse" />
				<div className="h-4 w-72 bg-bg-elevated rounded animate-pulse mt-2" />
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				{Array.from({ length: 4 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
					<div key={i} className="glass-card p-4 h-20 animate-pulse" />
				))}
			</div>
			{Array.from({ length: 4 }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
				<div key={i} className="glass-card p-6 h-48 animate-pulse" />
			))}
		</div>
	);
}

// ── Main page ──────────────────────────────────────────────────────────────────

export function RulesExplorerPage() {
	const { data: rules, isLoading } = useRules();

	const grouped = useMemo<Record<string, RuleInfo[]>>(() => {
		if (!rules) return {};
		const result: Record<string, RuleInfo[]> = {};
		for (const rule of rules) {
			if (!result[rule.category]) result[rule.category] = [];
			result[rule.category].push(rule);
		}
		return result;
	}, [rules]);

	const byCategory = useMemo<Record<string, number>>(() => {
		const result: Record<string, number> = {};
		for (const [cat, items] of Object.entries(grouped)) {
			result[cat] = items.length;
		}
		return result;
	}, [grouped]);

	const totalKb = useMemo(
		() => (rules ?? []).reduce((s, r) => s + r.size_kb, 0),
		[rules],
	);

	const alwaysCount = useMemo(
		() =>
			(rules ?? []).filter((r) => getRuleMetadata(r.name).loadType === "always")
				.length,
		[rules],
	);

	const onDemandCount = useMemo(
		() =>
			(rules ?? []).filter(
				(r) => getRuleMetadata(r.name).loadType === "on-demand",
			).length,
		[rules],
	);

	if (isLoading || !rules) return <LoadingSkeleton />;

	const orderedCategories = [
		...CATEGORY_ORDER.filter((c) => grouped[c]?.length),
		...Object.keys(grouped).filter(
			(c) => !CATEGORY_ORDER.includes(c as (typeof CATEGORY_ORDER)[number]),
		),
	];

	return (
		<div className="space-y-6 bg-zinc-950" dir="rtl">
			{/* Header */}
			<div className="flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-blue/15 mt-0.5">
					<Shield size={20} className="text-accent-blue" aria-hidden="true" />
				</div>
				<div>
					<h1 className="text-xl font-bold text-text-primary">חוקים וכללים</h1>
					<p className="text-sm text-text-muted mt-0.5">
						{rules.length} קבצי כללים · {Object.keys(grouped).length} קטגוריות
					</p>
				</div>
			</div>

			{/* Summary stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				<SummaryStatCard
					label="סה״כ קבצים"
					value={rules.length}
					color="oklch(0.65 0.18 250)"
				/>
				<SummaryStatCard
					label="תמיד טעונים"
					value={alwaysCount}
					color="oklch(0.72 0.19 155)"
					sub="נטענים בכל סשן"
				/>
				<SummaryStatCard
					label="לפי דרישה"
					value={onDemandCount}
					color="oklch(0.78 0.16 75)"
					sub="נטענים לפי הקשר"
				/>
				<SummaryStatCard
					label="סה״כ גודל"
					value={`${totalKb.toFixed(0)} KB`}
					color="oklch(0.62 0.2 290)"
				/>
			</div>

			{/* Chart + category breakdown */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Pie chart */}
				<div className="glass-card p-4">
					<h3 className="text-xs font-semibold text-text-muted mb-3">
						התפלגות לפי קטגוריה
					</h3>
					<CategoryPieChart byCategory={byCategory} />
				</div>

				{/* Category breakdown list */}
				<div className="glass-card p-4 md:col-span-2">
					<h3 className="text-xs font-semibold text-text-muted mb-3">
						קטגוריות
					</h3>
					<div className="space-y-3">
						{orderedCategories.map((cat) => {
							const cfg = getCategoryConfig(cat);
							const catRules = grouped[cat] ?? [];
							const catKb = catRules.reduce((s, r) => s + r.size_kb, 0);
							const pct =
								rules.length > 0 ? (catRules.length / rules.length) * 100 : 0;
							return (
								<div key={cat} className="space-y-1.5">
									<div className="flex items-center justify-between text-xs">
										<div className="flex items-center gap-2">
											<span
												className="w-2.5 h-2.5 rounded-sm shrink-0"
												style={{ background: cfg.color }}
												aria-hidden="true"
											/>
											<span
												style={{ color: cfg.color }}
												className="font-medium"
											>
												{cfg.hebrewLabel}
											</span>
											<span className="text-text-muted">{cfg.label}</span>
										</div>
										<div className="flex items-center gap-3 text-text-muted">
											<span dir="ltr" className="tabular-nums">
												{catKb.toFixed(1)} KB
											</span>
											<span className="tabular-nums font-medium">
												{catRules.length} קבצים
											</span>
										</div>
									</div>
									<div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
										<div
											className="h-full rounded-full transition-all duration-700"
											style={{ width: `${pct}%`, backgroundColor: cfg.color }}
										/>
									</div>
								</div>
							);
						})}
					</div>

					{/* Load type legend */}
					<div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-4 flex-wrap">
						<span className="text-[11px] text-text-muted font-medium">
							סוגי טעינה:
						</span>
						<div className="flex items-center gap-1.5">
							<span className="w-2 h-2 rounded-full bg-accent-green shrink-0" />
							<span className="text-[11px] text-text-secondary">תמיד טעון</span>
						</div>
						<div className="flex items-center gap-1.5">
							<span className="w-2 h-2 rounded-full bg-accent-amber shrink-0" />
							<span className="text-[11px] text-text-secondary">לפי דרישה</span>
						</div>
					</div>
				</div>
			</div>

			{/* Category sections */}
			{orderedCategories.map((cat) => (
				<CategorySection key={cat} category={cat} rules={grouped[cat] ?? []} />
			))}
		</div>
	);
}
