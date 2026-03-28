import {
	BookOpen,
	Command,
	HelpCircle,
	Lightbulb,
	Search,
	Sparkles,
	Tag,
	Terminal,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSkills } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

// ── Static skill category metadata ────────────────────────────────────────────

interface CategoryMeta {
	hebrewTitle: string;
	hebrewDesc: string;
	whenToUse: string;
	color: string;
	examples: string[];
}

const CAT_META: Record<string, CategoryMeta> = {
	apex: {
		hebrewTitle: "APEX — מיומנויות ליבה",
		hebrewDesc:
			"מיומנויות הליבה של מערכת APEX: code-reviewer ברמת L10+, adversarial-review, edge-case-hunter, reality-checker, brainstorming ועוד. מפעיל את מחזורי האיכות האוטומטיים.",
		whenToUse: "ביקורת קוד, איכות, הגשת PR, בדיקות קצה, ביקורת מציאות",
		color: "oklch(0.65 0.18 250)",
		examples: ["/code-reviewer", "/adversarial-review", "/edge-case-hunter"],
	},
	hydra: {
		hebrewTitle: "Hydra — אורקסטרציה",
		hebrewDesc:
			"מיומנויות לניהול מערכת Hydra v2: הפעלת watcher, ניהול תורים, מעקב checkpoints, ניתוח Bayesian scores ותיאום ריצות מקביליות של ספקים.",
		whenToUse:
			"הפעלת Hydra, ניהול תורי משימות, ניטור ספקים, resume לאחר SIGTERM",
		color: "oklch(0.72 0.19 155)",
		examples: ["/hydra-start", "/hydra-status", "/hydra-resume"],
	},
	ui: {
		hebrewTitle: "UI — ממשק משתמש",
		hebrewDesc:
			"מיומנויות לבניית ממשקים: shadcn/ui, Tailwind 4.2, RTL-first, OKLCH colors, ReactBits, Aceternity, GSAP animations. כולל תמיכה ב-playground fidelity.",
		whenToUse:
			"בניית קומפוננטות, RTL, אנימציות, design system, playground → implementation",
		color: "oklch(0.75 0.14 200)",
		examples: ["/ui-shadcn", "/ui-colors", "/ui-reactbits"],
	},
	flutter: {
		hebrewTitle: "Flutter — מובייל",
		hebrewDesc:
			"מיומנויות לפיתוח Flutter 3.41: Riverpod 3, GoRouter, freezed, RTL-first (EdgeInsetsDirectional), Patrol E2E, golden tests עם Alchemist, DCM analysis.",
		whenToUse:
			"פיתוח Flutter, Riverpod, GoRouter, E2E, golden tests, RTL מובייל",
		color: "oklch(0.62 0.2 290)",
		examples: ["/flutter-rules", "/flutter-migration", "/mobile-mastery"],
	},
	security: {
		hebrewTitle: "אבטחה",
		hebrewDesc:
			"ביקורת אבטחה מקיפה: OWASP Top 10, OWASP ASI01–ASI10, RLS Supabase, JWT, supply chain, MCP security. מריץ trivy + semgrep + gitleaks.",
		whenToUse: "לפני deploy, קוד auth, RLS, הוספת תלויות, ביקורת MCP",
		color: "oklch(0.62 0.22 25)",
		examples: ["/security-rules", "/security-auditor", "/trivy-scan"],
	},
	testing: {
		hebrewTitle: "בדיקות",
		hebrewDesc:
			"יצירת בדיקות Vitest, Playwright, k6, fast-check. כולל mutation testing (Stryker), E2E, load tests, property-based testing ו-BUG-R1/R2/R3/R4 regression.",
		whenToUse: "כיסוי קוד, regression, E2E, load testing, mutation testing",
		color: "oklch(0.78 0.16 75)",
		examples: ["/testing-rules", "/e2e-strategy", "/edge-case-hunter"],
	},
	frontend: {
		hebrewTitle: "Frontend — כללי",
		hebrewDesc:
			"מיומנויות frontend כלליות: Next.js 16, React 19, TanStack Query, bundle optimization, PWA, Service Worker, CSP, performance audit.",
		whenToUse: "Next.js, React, TanStack Query, bundle, PWA, performance",
		color: "oklch(0.65 0.15 270)",
		examples: ["/frontend-rules", "/bundle-check", "/pwa-expert"],
	},
	backend: {
		hebrewTitle: "Backend",
		hebrewDesc:
			"מיומנויות backend: Hono 4.12, Supabase Edge Functions, Deno, API design, RLS policies, database migrations, CRON jobs, rate limiting.",
		whenToUse: "Hono, Supabase, Edge Functions, API, migrations, RLS",
		color: "oklch(0.65 0.18 250)",
		examples: ["/backend-rules", "/supabase-audit", "/edge-functions"],
	},
	ai: {
		hebrewTitle: "AI — בינה מלאכותית",
		hebrewDesc:
			"ביקורת אבטחת AI, OWASP LLM Top 10, prompt injection, output filtering, MCP security, rate limiting, בניית harness evaluation ל-LLM.",
		whenToUse: "בניית endpoints AI, MCP servers, ביקורת prompt, eval harness",
		color: "oklch(0.72 0.18 155)",
		examples: ["/ai-rules", "/ai-security", "/ai-eval"],
	},
	devops: {
		hebrewTitle: "DevOps — CI/CD",
		hebrewDesc:
			"GitHub Actions, Cloudflare Pages, Netlify, bundle-check, Dagger, trivy-autofix, renovate, gitleaks. כולל self-hosted runners ו-ci-standards.",
		whenToUse: "CI/CD, deploy, workflows, bundle CI, security scans, auto PR",
		color: "oklch(0.75 0.14 200)",
		examples: ["/devops-rules", "/ci-setup", "/bundle-ci"],
	},
	mobile: {
		hebrewTitle: "Mobile — שדרוגים 2026",
		hebrewDesc:
			"Play Integrity, TrustPin SDK, WCAG 2.2 EAA, Patrol E2E, flutter_secure_storage v10, Alchemist goldens, DCM, SPKI pinning, App Store compliance.",
		whenToUse:
			"Play Store, App Store, certificate pinning, accessibility, compliance",
		color: "oklch(0.62 0.2 25)",
		examples: ["/mobile-upgrade-2026", "/mobile-mastery", "/a11y"],
	},
	openclaw: {
		hebrewTitle: "OpenClaw — כלים מותאמים",
		hebrewDesc:
			"מיומנויות ייחודיות שנוצרו במסגרת מערכת OpenClaw v2026.3.22: 78+ כלים מותאמים לפרויקטים הספציפיים, אינטגרציות מיוחדות ומאיץ משימות.",
		whenToUse: "משימות ספציפיות לפרויקט, אינטגרציות מותאמות, אוטומציה ייחודית",
		color: "oklch(0.62 0.2 290)",
		examples: ["/openclaw-run", "/openclaw-list", "/openclaw-sync"],
	},
};

const FALLBACK_META: CategoryMeta = {
	hebrewTitle: "כללי",
	hebrewDesc:
		"מיומנויות למשימות כלליות — מחקר, תכנון, refactoring, תיעוד ועוד.",
	whenToUse: "משימות ad-hoc, מחקר, תכנון, תיעוד",
	color: "oklch(0.55 0.02 260)",
	examples: [],
};

function getMeta(cat: string): CategoryMeta {
	return CAT_META[cat.toLowerCase()] ?? FALLBACK_META;
}

// ── Category filter tabs ───────────────────────────────────────────────────────

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
		{ key: "all", count: total, label: "הכול" },
		...Object.entries(categories).map(([k, v]) => ({
			key: k,
			count: v,
			label: getMeta(k).hebrewTitle.split(" — ")[0],
		})),
	];

	return (
		<div
			className="flex items-center gap-1.5 flex-wrap"
			role="tablist"
			aria-label="סינון קטגוריית מיומנות"
		>
			{tabs.map(({ key, count, label }) => {
				const isActive = active === key;
				const color = key === "all" ? null : getMeta(key).color;
				return (
					<button
						key={key}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onSelect(key)}
						className={cn(
							"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
							"transition-all duration-150 cursor-pointer min-h-11",
							isActive
								? "text-white shadow-sm"
								: "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]",
						)}
						style={
							isActive && color
								? {
										background: `${color}33`,
										color: color,
										boxShadow: `0 0 12px ${color}44`,
									}
								: isActive
									? { background: "var(--color-accent-blue)", color: "white" }
									: undefined
						}
					>
						{label}
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

// ── Skill card (static enrichment) ────────────────────────────────────────────

function SkillExampleBadge({ name }: { name: string }) {
	return (
		<span
			className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-mono font-medium leading-none"
			style={{
				background: "oklch(0.65 0.18 250 / 0.12)",
				color: "oklch(0.7 0.14 250)",
				border: "1px solid oklch(0.65 0.18 250 / 0.3)",
			}}
			dir="ltr"
		>
			<Command size={10} aria-hidden="true" />
			{name}
		</span>
	);
}

function CategoryCard({ catKey, count }: { catKey: string; count: number }) {
	const meta = getMeta(catKey);

	return (
		<div
			className="glass-card flex flex-col gap-3 p-4 hover:border-[var(--color-border-hover)] transition-all duration-200"
			style={{ borderColor: `${meta.color}33` }}
		>
			{/* Header row */}
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1 min-w-0">
					<h3
						className="text-sm font-bold leading-tight"
						style={{ color: meta.color }}
					>
						{meta.hebrewTitle}
					</h3>
				</div>
				<span
					className="shrink-0 text-xs font-bold tabular-nums px-2 py-0.5 rounded-full"
					style={{
						background: `${meta.color}22`,
						color: meta.color,
					}}
					dir="ltr"
				>
					{count}
				</span>
			</div>

			{/* Description */}
			<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
				{meta.hebrewDesc}
			</p>

			{/* When to use */}
			<div className="flex gap-1.5 items-start">
				<Lightbulb
					size={11}
					className="shrink-0 mt-0.5"
					style={{ color: meta.color }}
					aria-hidden="true"
				/>
				<p className="text-xs text-[var(--color-text-muted)] leading-snug">
					{meta.whenToUse}
				</p>
			</div>

			{/* Example invocations */}
			{meta.examples.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-auto pt-1">
					{meta.examples.map((ex) => (
						<SkillExampleBadge key={ex} name={ex} />
					))}
				</div>
			)}
		</div>
	);
}

// ── How skills work section ────────────────────────────────────────────────────

function HowSkillsWorkSection() {
	const steps = [
		{
			icon: <Terminal size={14} />,
			title: 'הקלד "/" ואחריו שם המיומנות',
			desc: "לדוגמה: /commit, /review-pr, /code-reviewer — Claude Code יזהה ויפעיל את המיומנות המתאימה",
			color: "oklch(0.65 0.18 250)",
		},
		{
			icon: <Tag size={14} />,
			title: "מיומנויות מספקות יכולות מתמחות",
			desc: "כל מיומנות מכילה הוראות, כללים וידע תחומי ספציפי — תיאוריית L10+ לקוד-ריוויו, RTL לממשק, Patrol ל-E2E",
			color: "oklch(0.72 0.19 155)",
		},
		{
			icon: <Zap size={14} />,
			title: "מיומנויות מול פקודות ישירות",
			desc: "מיומנות = מומחיות מובנית. לשאלות כלליות עדיף פקודה ישירה. לביקורת קוד, אבטחה, Flutter, CI — תמיד מיומנות ייעודית",
			color: "oklch(0.78 0.16 75)",
		},
		{
			icon: <Search size={14} />,
			title: "איך למצוא את המיומנות הנכונה",
			desc: "זהה את הקטגוריה (ui/security/flutter/testing), חפש בגריד למעלה, או השתמש בחיפוש החופשי. בספק — /brainstorming",
			color: "oklch(0.62 0.22 25)",
		},
	];

	return (
		<section className="glass-card p-5 flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<BookOpen
					size={16}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				<h2 className="text-sm font-bold text-[var(--color-text-primary)]">
					איך עובדות מיומנויות?
				</h2>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{steps.map((step) => (
					<div
						key={step.title}
						className="flex gap-3 p-3 rounded-lg"
						style={{ background: `${step.color}0d` }}
					>
						<span
							className="shrink-0 mt-0.5 flex size-7 items-center justify-center rounded-lg"
							style={{
								background: `${step.color}22`,
								color: step.color,
							}}
							aria-hidden="true"
						>
							{step.icon}
						</span>
						<div className="min-w-0">
							<div
								className="text-xs font-semibold leading-tight mb-1"
								style={{ color: step.color }}
							>
								{step.title}
							</div>
							<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
								{step.desc}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

// ── Tips section ──────────────────────────────────────────────────────────────

function TipsSection() {
	const tips = [
		{
			q: "מתי להשתמש במיומנות ולא בפקודה ישירה?",
			a: "כשהמשימה דורשת ידע תחומי מובנה: code-review ברמת L10+, ביקורת אבטחה, Flutter RTL, CI/CD. לשאלות פשוטות — Claude ישיר מספיק.",
		},
		{
			q: "איך להפעיל מיומנות עם ארגומנטים?",
			a: 'הוסף את הטקסט אחרי שם המיומנות: /review-pr 123 או /commit "feat: add skill guide". רוב המיומנויות מקבלות הקשר חופשי.',
		},
		{
			q: "מה ההבדל בין APEX, OpenClaw ו-GSD?",
			a: "APEX = מיומנויות ליבה לאיכות. OpenClaw = כלים מותאמים לפרויקטים ספציפיים. GSD = סוכנים שמריצים pipelines מורכבים מקצה לקצה.",
		},
		{
			q: "האם מיומנויות פועלות על Sonnet או Opus?",
			a: "code-reviewer, adversarial-review, security-auditor — תמיד Opus 4.6 (L10+). שאר המיומנויות — Sonnet 4.6 (מהיר, חסכוני).",
		},
	];

	return (
		<section className="glass-card p-5 flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<HelpCircle
					size={16}
					className="text-[var(--color-accent-amber)]"
					aria-hidden="true"
				/>
				<h2 className="text-sm font-bold text-[var(--color-text-primary)]">
					טיפים ושאלות נפוצות
				</h2>
			</div>

			<div className="flex flex-col gap-3">
				{tips.map((tip) => (
					<div
						key={tip.q}
						className="border-s-2 ps-3 py-1"
						style={{ borderColor: "oklch(0.78 0.16 75 / 0.5)" }}
					>
						<div className="text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
							{tip.q}
						</div>
						<p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
							{tip.a}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}

// ── Summary stats ─────────────────────────────────────────────────────────────

function SummaryStats({
	total,
	categories,
	pluginsCount,
}: {
	total: number;
	categories: Record<string, number>;
	pluginsCount: number;
}) {
	const catCount = Object.keys(categories).length;

	return (
		<div className="flex items-center gap-2 flex-wrap">
			{/* Total skills */}
			<div className="glass-card flex items-center gap-2 px-3 py-2">
				<Sparkles
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
				<span className="text-xs text-[var(--color-text-muted)]">
					מיומנויות
				</span>
			</div>

			{/* Categories count */}
			<div className="glass-card flex items-center gap-2 px-3 py-2">
				<Tag
					size={14}
					className="text-[var(--color-accent-green)]"
					aria-hidden="true"
				/>
				<span
					className="text-sm font-bold tabular-nums text-[var(--color-text-primary)]"
					dir="ltr"
				>
					{catCount}
				</span>
				<span className="text-xs text-[var(--color-text-muted)]">קטגוריות</span>
			</div>

			{/* Plugins count */}
			{pluginsCount > 0 && (
				<div className="glass-card flex items-center gap-2 px-3 py-2">
					<Zap
						size={14}
						className="text-[var(--color-accent-purple)]"
						aria-hidden="true"
					/>
					<span
						className="text-sm font-bold tabular-nums text-[var(--color-text-primary)]"
						dir="ltr"
					>
						{pluginsCount}
					</span>
					<span className="text-xs text-[var(--color-text-muted)]">
						פלאגינים
					</span>
				</div>
			)}

			{/* Per-category breakdown */}
			{Object.entries(categories)
				.sort(([, a], [, b]) => b - a)
				.slice(0, 5)
				.map(([cat, count]) => {
					const meta = getMeta(cat);
					return (
						<div
							key={cat}
							className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs glass-card"
							style={{
								borderColor: `${meta.color}33`,
								background: `${meta.color}11`,
							}}
						>
							<span className="font-medium" style={{ color: meta.color }}>
								{meta.hebrewTitle.split(" — ")[0]}
							</span>
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

// ── Loading skeleton ──────────────────────────────────────────────────────────

function SkeletonGrid() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
					key={i}
					className="glass-card h-36 animate-pulse"
					aria-hidden="true"
				/>
			))}
		</div>
	);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function SkillsGuidePage() {
	const { data, isLoading, error } = useSkills();
	const [activeCategory, setActiveCategory] = useState("all");
	const [search, setSearch] = useState("");

	const total = data?.total ?? 0;
	const categories = data?.categories ?? {};
	const pluginsCount = data?.plugins_count ?? 0;

	// Filter categories by search
	const filteredCategories = useMemo<Record<string, number>>(() => {
		if (activeCategory !== "all") {
			const count = categories[activeCategory];
			if (count === undefined) return {};
			return { [activeCategory]: count };
		}

		const q = search.trim().toLowerCase();
		if (!q) return categories;

		return Object.fromEntries(
			Object.entries(categories).filter(([cat]) => {
				const meta = getMeta(cat);
				return (
					cat.toLowerCase().includes(q) ||
					meta.hebrewTitle.toLowerCase().includes(q) ||
					meta.hebrewDesc.toLowerCase().includes(q) ||
					meta.whenToUse.toLowerCase().includes(q) ||
					meta.examples.some((ex) => ex.toLowerCase().includes(q))
				);
			}),
		);
	}, [categories, activeCategory, search]);

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-64">
				<div className="glass-card p-10 text-center">
					<Sparkles
						size={32}
						className="mx-auto mb-3 text-[var(--color-status-critical)] opacity-60"
						aria-hidden="true"
					/>
					<p className="text-sm text-[var(--color-text-muted)]">
						שגיאה בטעינת נתוני מיומנויות
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 bg-zinc-950">
			{/* ── Header ── */}
			<div className="flex items-center gap-3">
				<Sparkles
					size={20}
					className="text-[var(--color-accent-blue)]"
					aria-hidden="true"
				/>
				<div>
					<h1 className="text-lg font-bold text-[var(--color-text-primary)]">
						מדריך מיומנויות
					</h1>
					<p className="text-sm text-[var(--color-text-muted)]">
						מדריך מלא ל-
						<span
							className="tabular-nums font-semibold text-[var(--color-text-secondary)]"
							dir="ltr"
						>
							{isLoading ? "…" : total}
						</span>{" "}
						מיומנויות — קטגוריות, הפעלה וטיפים
					</p>
				</div>
			</div>

			{/* ── Stats strip ── */}
			{!isLoading && total > 0 && (
				<SummaryStats
					total={total}
					categories={categories}
					pluginsCount={pluginsCount}
				/>
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
						placeholder="חיפוש לפי קטגוריה, תיאור, שם מיומנות..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={cn(
							"w-full h-10 ps-3 pe-9 rounded-lg text-sm",
							"bg-[var(--color-bg-elevated)] border border-[var(--color-border)]",
							"text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
							"focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]",
							"transition-colors duration-150",
						)}
						aria-label="חיפוש מיומנות"
					/>
				</div>

				{/* Category tabs */}
				{!isLoading && (
					<CategoryTabs
						categories={categories}
						total={total}
						active={activeCategory}
						onSelect={(cat) => {
							setActiveCategory(cat);
							setSearch("");
						}}
					/>
				)}
			</div>

			{/* ── Skills grid ── */}
			{isLoading ? (
				<SkeletonGrid />
			) : Object.keys(filteredCategories).length === 0 ? (
				<div className="glass-card p-12 text-center">
					<Search
						size={28}
						className="mx-auto mb-3 text-[var(--color-text-muted)] opacity-40"
						aria-hidden="true"
					/>
					<p className="text-sm text-[var(--color-text-muted)]">
						{search ? "לא נמצאו קטגוריות התואמות לחיפוש" : "אין מיומנויות"}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{Object.entries(filteredCategories)
						.sort(([, a], [, b]) => b - a)
						.map(([cat, count]) => (
							<CategoryCard key={cat} catKey={cat} count={count} />
						))}
				</div>
			)}

			{/* ── How skills work ── */}
			<HowSkillsWorkSection />

			{/* ── Tips ── */}
			<TipsSection />
		</div>
	);
}
