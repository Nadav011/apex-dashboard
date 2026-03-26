import {
	BookOpen,
	Bot,
	ChevronDown,
	ChevronUp,
	Search,
	Shield,
	Sparkles,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAgents } from "@/hooks/use-api";
import type { AgentInfo } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Category config ───────────────────────────────────────────────────────────

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

type CatStyle = { bg: string; text: string; border: string; glow: string };

const CAT_COLORS: Record<string, CatStyle> = {
	gsd: {
		bg: "bg-[oklch(0.65_0.15_270_/_0.15)]",
		text: "text-[var(--color-cat-gsd)]",
		border: "border-[oklch(0.65_0.15_270_/_0.35)]",
		glow: "oklch(0.65 0.15 270)",
	},
	security: {
		bg: "bg-[oklch(0.62_0.2_25_/_0.15)]",
		text: "text-[var(--color-cat-security)]",
		border: "border-[oklch(0.62_0.2_25_/_0.35)]",
		glow: "oklch(0.62 0.2 25)",
	},
	quality: {
		bg: "bg-[oklch(0.72_0.18_155_/_0.15)]",
		text: "text-[var(--color-cat-quality)]",
		border: "border-[oklch(0.72_0.18_155_/_0.35)]",
		glow: "oklch(0.72 0.18 155)",
	},
	testing: {
		bg: "bg-[oklch(0.62_0.18_290_/_0.15)]",
		text: "text-[var(--color-cat-testing)]",
		border: "border-[oklch(0.62_0.18_290_/_0.35)]",
		glow: "oklch(0.62 0.18 290)",
	},
	performance: {
		bg: "bg-[oklch(0.75_0.14_200_/_0.15)]",
		text: "text-[var(--color-cat-performance)]",
		border: "border-[oklch(0.75_0.14_200_/_0.35)]",
		glow: "oklch(0.75 0.14 200)",
	},
	infra: {
		bg: "bg-[oklch(0.78_0.16_75_/_0.15)]",
		text: "text-[var(--color-cat-infra)]",
		border: "border-[oklch(0.78_0.16_75_/_0.35)]",
		glow: "oklch(0.78 0.16 75)",
	},
	general: {
		bg: "bg-[oklch(0.62_0.05_260_/_0.15)]",
		text: "text-[var(--color-cat-general)]",
		border: "border-[oklch(0.62_0.05_260_/_0.35)]",
		glow: "oklch(0.62 0.05 260)",
	},
};

const FALLBACK_STYLE: CatStyle = {
	bg: "bg-[var(--color-bg-elevated)]",
	text: "text-[var(--color-text-muted)]",
	border: "border-[var(--color-border)]",
	glow: "oklch(0.55 0.02 260)",
};

function catStyle(cat: string): CatStyle {
	return CAT_COLORS[cat.toLowerCase()] ?? FALLBACK_STYLE;
}

function catLabel(cat: string): string {
	return CAT_LABELS[cat.toLowerCase()] ?? cat;
}

// ── Static enrichment data ────────────────────────────────────────────────────
// Provides Hebrew descriptions, when-to-use tips, model info and flow diagrams
// for known agent categories. The backend's live data remains authoritative for
// name/description/tools — this layer adds the *guide* layer on top.

interface CategoryMeta {
	hebrewTitle: string;
	hebrewDesc: string;
	whenToUse: string;
	flow?: string;
	icon: React.ReactNode;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
	gsd: {
		hebrewTitle: "מערכת GSD — Get Stuff Done",
		hebrewDesc:
			"סוכנים שמתכננים, מבצעים ומאמתים משימות מורכבות מקצה לקצה. מתאים לפיצ'רים חדשים, רפקטורינג גדול, ופרויקטים שדורשים תכנון מפורט לפני ביצוע.",
		whenToUse:
			"פיצ'רים חדשים, refactor רב-קבצים, פרויקטים חדשים, משימות שדורשות תכנון מפורט",
		flow: "roadmapper → plan-researcher → planner → plan-checker → executor → verifier",
		icon: <Zap size={14} />,
	},
	security: {
		hebrewTitle: "ביקורת אבטחה",
		hebrewDesc:
			"סוכנים לביקורת אבטחה מעמיקה — OWASP Top 10, מדיניות RLS, אבטחת MCP, גבולות הרשאות ובדיקות חדירה לוגיות. כולל ביקורת אבטחת סוכנים (OWASP ASI01–ASI10).",
		whenToUse:
			"קוד auth, מדיניות RLS ב-Supabase, נקודות API, לפני deploy לפרודקשן, עדכוני תלויות",
		icon: <Shield size={14} />,
	},
	quality: {
		hebrewTitle: "בקרת איכות",
		hebrewDesc:
			"סקירת קוד ב-16 מימדים ברמת L10+ (Distinguished Engineer). כולל בדיקת נגישות WCAG 2.2, חוזי API, בדיקת מציאות (reality checker) ובדיקת מקרי קצה.",
		whenToUse: "לאחר מימוש פיצ'רים, לפני PR, בדיקת נגישות, ביקורת ארכיטקטורה",
		icon: <Sparkles size={14} />,
	},
	testing: {
		hebrewTitle: "יצירת בדיקות",
		hebrewDesc:
			"יצירה אוטומטית של unit tests, integration tests, E2E, load tests ובדיקות race conditions. תומך ב-Vitest, Playwright, k6 ו-fast-check לבדיקות property-based.",
		whenToUse:
			"לאחר כתיבת קוד, פערי coverage, שיפור אמינות, בדיקת ביצועים בעומס",
		icon: <BookOpen size={14} />,
	},
	performance: {
		hebrewTitle: "ניתוח ביצועים",
		hebrewDesc:
			"ביקורת Lighthouse, ניתוח bundle, אופטימיזציית מסד נתונים, זיהוי N+1 queries וניתוח זמני טעינה. מאמת Core Web Vitals ומזהה צווארי בקבוק.",
		whenToUse:
			"דפים איטיים, bundle גדול, N+1 queries, ירידה בציון Lighthouse, אופטימיזציה לפני launch",
		icon: <Zap size={14} />,
	},
	infra: {
		hebrewTitle: "תשתית ו-DevOps",
		hebrewDesc:
			"ניהול CI/CD, migrations למסד נתונים, ניהול releases, בניית MCP servers מותאמים, ואוטומציה של תהליכי deploy. כולל תמיכה ב-GitHub Actions, Cloudflare Pages ו-Netlify.",
		whenToUse:
			"deploy, migrations, releases, בניית MCP servers, אוטומציה של CI/CD",
		icon: <Bot size={14} />,
	},
	general: {
		hebrewTitle: "סוכנים כלליים",
		hebrewDesc:
			"מחקר, תכנון, פישוט קוד, refactoring, יצירת תיעוד ועוד. הסוכנים הגמישים ביותר במערכת — מתאימים למגוון משימות שאינן דורשות התמחות ספציפית.",
		whenToUse:
			"מחקר טכנולוגי, תכנון ארכיטקטורה, פישוט קוד, יצירת תיעוד, משימות ad-hoc",
		icon: <BookOpen size={14} />,
	},
};

// ── Model assignment heuristics ───────────────────────────────────────────────

function inferModel(agent: AgentInfo): string {
	const n = agent.name.toLowerCase();
	const c = agent.category.toLowerCase();
	if (
		c === "security" ||
		n.includes("security") ||
		n.includes("auditor") ||
		n.includes("reviewer") ||
		n.includes("reality") ||
		n.includes("adversarial")
	) {
		return "Opus 4.6";
	}
	return "Sonnet 4.6";
}

// ── Tool badge ────────────────────────────────────────────────────────────────

const TOOL_COLOR: Record<string, string> = {
	Read: "oklch(0.72 0.19 155)",
	Write: "oklch(0.65 0.18 250)",
	Edit: "oklch(0.75 0.14 200)",
	Bash: "oklch(0.78 0.16 75)",
	Grep: "oklch(0.62 0.2 290)",
	Glob: "oklch(0.62 0.18 290)",
	WebSearch: "oklch(0.62 0.2 25)",
	WebFetch: "oklch(0.62 0.2 25)",
	Task: "oklch(0.65 0.15 270)",
	TodoWrite: "oklch(0.65 0.15 270)",
};

function ToolBadge({ name }: { name: string }) {
	const color =
		TOOL_COLOR[name] ??
		TOOL_COLOR[name.split(/(?=[A-Z])/)[0]] ??
		"oklch(0.55 0.02 260)";
	return (
		<span
			className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono font-medium leading-none"
			style={{
				background: `${color}22`,
				color,
				border: `1px solid ${color}44`,
			}}
		>
			{name}
		</span>
	);
}

// ── Agent detail card ─────────────────────────────────────────────────────────

function AgentDetailCard({ agent }: { agent: AgentInfo }) {
	const [expanded, setExpanded] = useState(false);
	const style = catStyle(agent.category);
	const model = inferModel(agent);
	const isOpus = model === "Opus 4.6";
	const meta = CATEGORY_META[agent.category.toLowerCase()];

	const initials = agent.name
		.split(/[-_\s]/)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? "")
		.join("");

	return (
		<div
			className={cn(
				"glass-card flex flex-col gap-0 transition-all duration-200",
				"hover:border-[var(--color-border-hover)]",
				expanded && "shadow-[0_0_24px_oklch(0.65_0.18_250_/_0.12)]",
			)}
		>
			{/* ── Collapsed header — always visible ── */}
			<button
				type="button"
				onClick={() => setExpanded((p) => !p)}
				className={cn(
					"flex items-center gap-3 p-4 w-full text-start",
					"cursor-pointer transition-colors duration-150",
					"hover:bg-[var(--color-bg-elevated)] rounded-xl",
					expanded && "rounded-b-none border-b border-[var(--color-border)]",
				)}
				aria-expanded={expanded}
			>
				{/* Avatar */}
				<div
					className={cn(
						"flex items-center justify-center w-9 h-9 rounded-lg text-xs font-bold shrink-0",
						style.bg,
						style.text,
					)}
					aria-hidden="true"
				>
					{initials || "?"}
				</div>

				{/* Name + category */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
							{agent.name}
						</span>
						<span
							className={cn(
								"text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0",
								style.bg,
								style.text,
								style.border,
							)}
						>
							{catLabel(agent.category)}
						</span>
					</div>
					{agent.description && (
						<p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
							{agent.description}
						</p>
					)}
				</div>

				{/* Model badge */}
				<span
					className={cn(
						"text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0",
						isOpus
							? "bg-[oklch(0.62_0.2_25_/_0.12)] text-[oklch(0.75_0.18_25)] border-[oklch(0.62_0.2_25_/_0.3)]"
							: "bg-[oklch(0.65_0.18_250_/_0.12)] text-[oklch(0.7_0.14_250)] border-[oklch(0.65_0.18_250_/_0.3)]",
					)}
					dir="ltr"
				>
					{model}
				</span>

				{/* Expand chevron */}
				<span className="text-[var(--color-text-muted)] shrink-0">
					{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
				</span>
			</button>

			{/* ── Expanded body ── */}
			{expanded && (
				<div className="flex flex-col gap-4 p-4">
					{/* Hebrew description from meta */}
					{meta && (
						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-semibold text-[var(--color-text-secondary)]">
								תיאור
							</span>
							<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
								{agent.description ?? meta.hebrewDesc}
							</p>
						</div>
					)}

					{/* When to use */}
					{meta?.whenToUse && (
						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-semibold text-[var(--color-text-secondary)]">
								מתי להשתמש
							</span>
							<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
								{meta.whenToUse}
							</p>
						</div>
					)}

					{/* Tools */}
					{agent.tools.length > 0 && (
						<div className="flex flex-col gap-1.5">
							<span className="text-xs font-semibold text-[var(--color-text-secondary)]">
								כלים זמינים
							</span>
							<div className="flex flex-wrap gap-1">
								{agent.tools.map((t) => (
									<ToolBadge key={t} name={t} />
								))}
							</div>
						</div>
					)}

					{/* Model */}
					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold text-[var(--color-text-secondary)]">
							מודל:
						</span>
						<span
							className="text-xs font-mono text-[var(--color-text-muted)]"
							dir="ltr"
						>
							claude-{model === "Opus 4.6" ? "opus-4-6" : "sonnet-4-6"}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

// ── Category section ──────────────────────────────────────────────────────────

function CategorySection({
	category,
	agents,
}: {
	category: string;
	agents: AgentInfo[];
}) {
	const style = catStyle(category);
	const meta = CATEGORY_META[category.toLowerCase()];
	const [collapsed, setCollapsed] = useState(false);

	if (agents.length === 0) return null;

	return (
		<section className="flex flex-col gap-3">
			{/* Section header */}
			<button
				type="button"
				onClick={() => setCollapsed((p) => !p)}
				className={cn(
					"flex items-center gap-3 w-full text-start cursor-pointer",
					"py-3 px-4 rounded-xl border transition-all duration-150",
					"hover:bg-[var(--color-bg-elevated)]",
					style.bg,
					style.border,
				)}
				aria-expanded={!collapsed}
			>
				{/* Category icon */}
				<span className={cn("shrink-0", style.text)} aria-hidden="true">
					{meta?.icon ?? <Bot size={14} />}
				</span>

				{/* Category info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span className={cn("text-sm font-bold", style.text)}>
							{meta?.hebrewTitle ?? catLabel(category)}
						</span>
						<span
							className={cn(
								"text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
								style.bg,
								style.text,
								style.border,
							)}
							dir="ltr"
						>
							{agents.length}
						</span>
					</div>
					{meta?.hebrewDesc && !collapsed && (
						<p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
							{meta.hebrewDesc}
						</p>
					)}
				</div>

				{/* Flow hint */}
				{meta?.flow && !collapsed && (
					<span
						className="hidden sm:block text-[10px] font-mono text-[var(--color-text-muted)] truncate max-w-[260px] shrink-0"
						dir="ltr"
					>
						{meta.flow}
					</span>
				)}

				<span className={cn("shrink-0", style.text)}>
					{collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
				</span>
			</button>

			{/* Agent cards */}
			{!collapsed && (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 ps-2">
					{agents.map((agent) => (
						<AgentDetailCard key={agent.name} agent={agent} />
					))}
				</div>
			)}
		</section>
	);
}

// ── Stats strip ───────────────────────────────────────────────────────────────

function StatsStrip({
	total,
	byCategory,
}: {
	total: number;
	byCategory: Record<string, number>;
}) {
	return (
		<div className="flex items-center gap-2 flex-wrap">
			{/* Total */}
			<div className="glass-card flex items-center gap-2 px-3 py-2">
				<Bot
					size={14}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				<span className="text-xs text-[var(--color-text-muted)]">סה"כ</span>
				<span
					className="text-sm font-bold tabular-nums text-[var(--color-text-primary)]"
					dir="ltr"
				>
					{total}
				</span>
			</div>

			{/* Per category */}
			{Object.entries(byCategory)
				.sort(([, a], [, b]) => b - a)
				.map(([cat, count]) => {
					const s = catStyle(cat);
					return (
						<div
							key={cat}
							className={cn(
								"flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs",
								s.bg,
								s.border,
							)}
						>
							<span className={cn("font-medium", s.text)}>{catLabel(cat)}</span>
							<span
								className="tabular-nums font-bold text-[var(--color-text-primary)]"
								dir="ltr"
							>
								{count}
							</span>
						</div>
					);
				})}
		</div>
	);
}

// ── Category tab bar ──────────────────────────────────────────────────────────

function CategoryTabs({
	categories,
	total,
	active,
	onSelect,
}: {
	categories: Record<string, number>;
	total: number;
	active: string;
	onSelect: (cat: string) => void;
}) {
	const tabs = [
		{ key: "all", count: total },
		...Object.entries(categories).map(([k, v]) => ({ key: k, count: v })),
	];

	return (
		<div
			className="flex items-center gap-1.5 flex-wrap"
			role="tablist"
			aria-label="סינון קטגוריה"
		>
			{tabs.map(({ key, count }) => {
				const isActive = active === key;
				const style = key === "all" ? null : catStyle(key);
				return (
					<button
						key={key}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onSelect(key)}
						className={cn(
							"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
							"transition-all duration-150 cursor-pointer min-h-9",
							isActive
								? key === "all"
									? "bg-[var(--color-accent-blue)] text-white"
									: cn(style?.bg, style?.text, "border", style?.border)
								: "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]",
						)}
					>
						{catLabel(key)}
						<span
							className={cn(
								"text-xs tabular-nums px-1.5 py-0.5 rounded-full",
								isActive
									? "bg-white/20 text-current"
									: "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]",
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

// ── Skeleton ──────────────────────────────────────────────────────────────────

function GuideSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="glass-card p-4 animate-pulse flex flex-col gap-3"
				>
					<div className="h-5 w-48 bg-[var(--color-bg-elevated)] rounded" />
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
						{Array.from({ length: 3 }).map((_, j) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
								key={j}
								className="h-16 bg-[var(--color-bg-elevated)] rounded-xl"
								aria-hidden="true"
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

const CAT_ORDER: string[] = [
	"gsd",
	"security",
	"quality",
	"testing",
	"performance",
	"infra",
	"general",
];

export function AgentGuidePage() {
	const { data, isLoading, error } = useAgents();
	const [activeCategory, setActiveCategory] = useState("all");
	const [search, setSearch] = useState("");

	const allAgents: AgentInfo[] = data ?? [];

	// Derive per-category counts
	const categories = useMemo<Record<string, number>>(() => {
		const acc: Record<string, number> = {};
		for (const a of allAgents) {
			const cat = a.category.toLowerCase();
			acc[cat] = (acc[cat] ?? 0) + 1;
		}
		return acc;
	}, [allAgents]);

	// Filter by search + category
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
				a.category.toLowerCase().includes(q) ||
				a.tools.some((t) => t.toLowerCase().includes(q));
			return matchesCat && matchesSearch;
		});
	}, [allAgents, activeCategory, search]);

	const grouped = useMemo<Record<string, AgentInfo[]>>(() => {
		const acc: Record<string, AgentInfo[]> = {};
		for (const a of filtered) {
			const cat = a.category.toLowerCase();
			if (!acc[cat]) acc[cat] = [];
			acc[cat].push(a);
		}
		return acc;
	}, [filtered]);

	// Ordered category keys for rendering
	const orderedCats = useMemo<string[]>(() => {
		const known = CAT_ORDER.filter((c) => grouped[c]?.length);
		const other = Object.keys(grouped).filter((c) => !CAT_ORDER.includes(c));
		return [...known, ...other];
	}, [grouped]);

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-64">
				<div className="glass-card p-10 text-center">
					<Bot
						size={32}
						className="mx-auto mb-3 text-[var(--color-status-critical)] opacity-60"
						aria-hidden="true"
					/>
					<p className="text-sm text-[var(--color-text-muted)]">
						שגיאה בטעינת נתוני הסוכנים
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* ── Header ── */}
			<div className="flex items-center gap-3">
				<BookOpen
					size={20}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						מדריך סוכנים
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						מדריך מלא לכל{" "}
						<span
							dir="ltr"
							className="tabular-nums font-semibold text-[var(--color-text-secondary)]"
						>
							{allAgents.length}
						</span>{" "}
						סוכני המערכת — תפקיד, כלים ומתי להשתמש
					</p>
				</div>
			</div>

			{/* ── Stats strip ── */}
			{!isLoading && allAgents.length > 0 && (
				<StatsStrip total={allAgents.length} byCategory={categories} />
			)}

			{/* ── Controls ── */}
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
						placeholder="חיפוש לפי שם, תיאור או כלי..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={cn(
							"w-full h-10 ps-3 pe-9 rounded-lg text-sm",
							"bg-[var(--color-bg-elevated)] border border-[var(--color-border)]",
							"text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
							"focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
							"transition-colors duration-150",
						)}
						aria-label="חיפוש סוכנים"
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

			{/* ── Content ── */}
			{isLoading ? (
				<GuideSkeleton />
			) : filtered.length === 0 ? (
				<div className="glass-card p-12 text-center">
					<Search
						size={28}
						className="mx-auto mb-3 text-[var(--color-text-muted)] opacity-40"
						aria-hidden="true"
					/>
					<p className="text-sm text-[var(--color-text-muted)]">
						{search
							? "לא נמצאו סוכנים התואמים לחיפוש"
							: "אין סוכנים בקטגוריה זו"}
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-5">
					{orderedCats.map((cat) => (
						<CategorySection
							key={cat}
							category={cat}
							agents={grouped[cat] ?? []}
						/>
					))}
				</div>
			)}
		</div>
	);
}
