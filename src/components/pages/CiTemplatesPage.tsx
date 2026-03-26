import {
	AlertTriangle,
	Bot,
	CheckCircle2,
	ChevronDown,
	Code2,
	ExternalLink,
	FileCode2,
	FileText,
	Flame,
	GitBranch,
	Globe,
	Package,
	RefreshCw,
	Search,
	Shield,
	Terminal,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useCiTemplates } from "@/hooks/use-api";
import type { CiTemplate } from "@/lib/api";
import { cn } from "@/lib/cn";

// ── Constants ─────────────────────────────────────────────────────────────────

const PROJECTS = [
	"Mexicani",
	"Chance Pro",
	"MediFlow",
	"NadavAI",
	"Design System",
	"Signature Pro",
	"Z (Cash)",
	"Cash",
	"Shifts",
	"HatumDigital",
	"Brain",
	"SportChat",
	"VibChat",
	"FinanceApp",
];

const CI_TOOLS = [
	{
		name: "trivy",
		version: "0.69.3",
		cmd: "trivy fs . --severity HIGH,CRITICAL",
		purpose: "סריקת CVE בתלויות, סודות מוקדדים, IaC",
		category: "security",
	},
	{
		name: "semgrep",
		version: "1.155.0",
		cmd: "semgrep scan . --config=auto",
		purpose: "OWASP Top 10, XSS, SQL injection, React patterns",
		category: "security",
	},
	{
		name: "gitleaks",
		version: "CI auto",
		cmd: ".github/workflows (auto)",
		purpose: "זיהוי סודות שנשמרו ב-git",
		category: "security",
	},
	{
		name: "socket",
		version: "1.1.73",
		cmd: "socket npm install <pkg>",
		purpose: "הגנה על שרשרת האספקה",
		category: "security",
	},
	{
		name: "act",
		version: "0.2.84",
		cmd: "act push",
		purpose: "ריצת CI מקומית לדיבוג",
		category: "dev",
	},
	{
		name: "knip",
		version: "5.86.0",
		cmd: "knip",
		purpose: "זיהוי קוד מת (שבועי)",
		category: "quality",
	},
	{
		name: "type-coverage",
		version: "2.29.7",
		cmd: "type-coverage --at-least 90",
		purpose: "כיסוי TypeScript (FEATURE tier)",
		category: "quality",
	},
	{
		name: "lhci",
		version: "0.15.1",
		cmd: "lhci autorun",
		purpose: "Lighthouse CI — ביצועים, נגישות, SEO",
		category: "perf",
	},
	{
		name: "k6",
		version: "1.6.1",
		cmd: "k6 run test.js",
		purpose: "בדיקות עומס",
		category: "perf",
	},
	{
		name: "git-cliff",
		version: "2.12.0",
		cmd: "git-cliff -o CHANGELOG.md",
		purpose: "יצירת CHANGELOG אוטומטי",
		category: "dev",
	},
	{
		name: "hurl",
		version: "7.1.0",
		cmd: "hurl tests/api/",
		purpose: "בדיקות API",
		category: "quality",
	},
];

type TemplateCategory =
	| "ci"
	| "security"
	| "deploy"
	| "bundle"
	| "lighthouse"
	| "flutter"
	| "quality"
	| "other";

function categorizeTemplate(file: string, name: string): TemplateCategory {
	const f = file.toLowerCase();
	const n = name.toLowerCase();
	if (
		f.includes("ci-vite") ||
		f.includes("ci-nextjs") ||
		f.includes("ci-flutter") ||
		f.includes("ci-python") ||
		f.includes("ci-expo") ||
		f.includes("ci-supabase")
	)
		return "ci";
	if (
		f.includes("security") ||
		f.includes("trivy") ||
		f.includes("scorecard") ||
		f.includes("gitleaks") ||
		f.includes("license")
	)
		return "security";
	if (
		f.includes("deploy") ||
		f.includes("semantic-release") ||
		f.includes("changelog")
	)
		return "deploy";
	if (
		f.includes("bundle") ||
		f.includes("circular") ||
		f.includes("dependency")
	)
		return "bundle";
	if (f.includes("lighthouse")) return "lighthouse";
	if (
		f.includes("flutter") ||
		f.includes("mutation") ||
		f.includes("coverage") ||
		f.includes("accessibility")
	)
		return "quality";
	if (f.includes("flutter") || n.includes("flutter")) return "flutter";
	return "other";
}

const CATEGORY_META: Record<
	TemplateCategory,
	{
		label: string;
		color: string;
		icon: React.ComponentType<{ size?: number; className?: string }>;
	}
> = {
	ci: {
		label: "CI ראשי",
		color: "text-[var(--color-accent-blue)] bg-[oklch(0.65_0.18_250_/_0.12)]",
		icon: GitBranch,
	},
	security: {
		label: "אבטחה",
		color: "text-[var(--color-accent-red)] bg-[oklch(0.62_0.22_25_/_0.12)]",
		icon: Shield,
	},
	deploy: {
		label: "פריסה",
		color: "text-[var(--color-accent-green)] bg-[oklch(0.72_0.19_155_/_0.12)]",
		icon: Globe,
	},
	bundle: {
		label: "חבילה",
		color: "text-[var(--color-accent-amber)] bg-[oklch(0.78_0.16_75_/_0.12)]",
		icon: Package,
	},
	lighthouse: {
		label: "Lighthouse",
		color: "text-[var(--color-accent-cyan)] bg-[oklch(0.75_0.14_200_/_0.12)]",
		icon: Flame,
	},
	flutter: {
		label: "Flutter",
		color: "text-[var(--color-accent-purple)] bg-[oklch(0.62_0.2_290_/_0.12)]",
		icon: Zap,
	},
	quality: {
		label: "איכות",
		color: "text-[var(--color-accent-purple)] bg-[oklch(0.62_0.2_290_/_0.12)]",
		icon: CheckCircle2,
	},
	other: {
		label: "אחר",
		color: "text-[var(--color-text-muted)] bg-[oklch(0.55_0.02_260_/_0.12)]",
		icon: FileCode2,
	},
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({
	id,
	title,
	icon,
	children,
	defaultOpen = false,
}: {
	id: string;
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className="glass-card overflow-hidden" id={id}>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				className={cn(
					"w-full flex items-center gap-3 px-5 py-4 min-h-11",
					"text-start transition-colors duration-150",
					"hover:bg-[var(--color-bg-tertiary)]",
				)}
				aria-expanded={open}
			>
				<span className="text-[var(--color-accent-blue)] shrink-0">{icon}</span>
				<span className="text-sm font-semibold text-[var(--color-text-primary)] flex-1">
					{title}
				</span>
				<ChevronDown
					size={16}
					className={cn(
						"text-[var(--color-text-muted)] transition-transform duration-200 shrink-0",
						open && "rotate-180",
					)}
					aria-hidden="true"
				/>
			</button>
			{open && (
				<div className="px-5 pb-5 border-t border-[var(--color-border)]">
					{children}
				</div>
			)}
		</div>
	);
}

// ── Section 1: Introduction ───────────────────────────────────────────────────

function IntroSection() {
	return (
		<SectionCard
			id="intro"
			title="מבוא — תשתית CI/CD"
			icon={<GitBranch size={18} />}
			defaultOpen={true}
		>
			<div className="mt-4 space-y-4">
				<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
					כל פרויקטי APEX משתמשים בתשתית CI/CD אחידה מבוססת על ריפו{" "}
					<span
						className="font-mono text-xs text-[var(--color-accent-cyan)]"
						dir="ltr"
					>
						Nadav011/ci-standards
					</span>{" "}
					המכיל תבניות Workflow לשימוש חוזר. כל שינוי בתבנית אחת מתפשט אוטומטית
					לכל הפרויקטים.
				</p>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{[
						{
							label: "ריפו תבניות",
							value: "Nadav011/ci-standards",
							sub: "~/ci-standards/",
							color: "border-[var(--color-accent-blue)]/30",
						},
						{
							label: "Workflows לשימוש חוזר",
							value: "ci-vite-react.yml",
							sub: "ci-nextjs.yml · ci-flutter.yml",
							color: "border-[var(--color-accent-green)]/30",
						},
						{
							label: "Runner",
							value: "self-hosted",
							sub: "[linux, x64, pop-os]",
							color: "border-[var(--color-accent-amber)]/30",
						},
					].map(({ label, value, sub, color }) => (
						<div key={label} className={cn("glass-card p-3 border", color)}>
							<p className="text-xs text-[var(--color-text-muted)] mb-1">
								{label}
							</p>
							<p
								className="text-sm font-mono font-semibold text-[var(--color-text-primary)]"
								dir="ltr"
							>
								{value}
							</p>
							<p
								className="text-xs text-[var(--color-text-muted)] mt-0.5"
								dir="ltr"
							>
								{sub}
							</p>
						</div>
					))}
				</div>

				<div className="space-y-2">
					<h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
						עקרונות מרכזיים
					</h3>
					{[
						{
							icon: <CheckCircle2 size={14} />,
							color: "text-[var(--color-accent-green)]",
							text: (
								<>
									<code className="font-mono text-xs text-[var(--color-accent-cyan)]">
										cancel-in-progress: true
									</code>{" "}
									בכל workflow — עצירת ריצות ישנות כשנכנסת ריצה חדשה
								</>
							),
						},
						{
							icon: <CheckCircle2 size={14} />,
							color: "text-[var(--color-accent-green)]",
							text: (
								<>
									פריסה מצריכה{" "}
									<code className="font-mono text-xs text-[var(--color-accent-cyan)]">
										needs: ci-gate
									</code>{" "}
									— קוד שבור לא מגיע לפרודקשן
								</>
							),
						},
						{
							icon: <CheckCircle2 size={14} />,
							color: "text-[var(--color-accent-green)]",
							text: (
								<>
									<code className="font-mono text-xs text-[var(--color-accent-cyan)]">
										runs-on: [self-hosted, linux, x64, pop-os]
									</code>{" "}
									— לעולם לא{" "}
									<code className="font-mono text-xs text-[var(--color-accent-red)]">
										ubuntu-latest
									</code>
								</>
							),
						},
						{
							icon: <CheckCircle2 size={14} />,
							color: "text-[var(--color-accent-green)]",
							text: "deploy.yml: cancel-in-progress: false — פריסה חלקית גרועה מאי-פריסה",
						},
					].map(({ icon, color, text }, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: static list
						<div key={i} className="flex items-start gap-2">
							<span className={cn("shrink-0 mt-0.5", color)}>{icon}</span>
							<span className="text-sm text-[var(--color-text-secondary)]">
								{text}
							</span>
						</div>
					))}
				</div>
			</div>
		</SectionCard>
	);
}

// ── Section 2: Template Gallery ───────────────────────────────────────────────

function TemplateCard({
	template,
}: {
	template: CiTemplate & { category: TemplateCategory };
}) {
	const meta = CATEGORY_META[template.category];
	const Icon = meta.icon;
	return (
		<div
			className={cn(
				"glass-card p-3 flex flex-col gap-2 transition-all duration-150",
				"hover:border-[var(--color-border-hover)]",
			)}
		>
			<div className="flex items-start gap-2">
				<span
					className={cn(
						"flex items-center justify-center size-7 rounded-md shrink-0",
						meta.color,
					)}
					aria-hidden="true"
				>
					<Icon size={14} />
				</span>
				<div className="min-w-0 flex-1">
					<p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
						{template.name}
					</p>
					<p
						className="text-xs text-[var(--color-text-muted)] truncate font-mono"
						dir="ltr"
					>
						{template.file}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-2 flex-wrap">
				<span
					className={cn(
						"inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full",
						meta.color,
					)}
				>
					{meta.label}
				</span>
				<span className="text-xs text-[var(--color-text-muted)]" dir="ltr">
					{template.lines} שורות · {template.size_kb}KB
				</span>
			</div>
		</div>
	);
}

function TemplateGallery({ templates }: { templates: CiTemplate[] }) {
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<
		TemplateCategory | "all"
	>("all");

	const annotated = useMemo(
		() =>
			templates.map((t) => ({
				...t,
				category: categorizeTemplate(t.file, t.name),
			})),
		[templates],
	);

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return annotated.filter((t) => {
			const matchSearch =
				!q ||
				t.name.toLowerCase().includes(q) ||
				t.file.toLowerCase().includes(q);
			const matchCat =
				activeCategory === "all" || t.category === activeCategory;
			return matchSearch && matchCat;
		});
	}, [annotated, search, activeCategory]);

	const categories = useMemo(() => {
		const counts: Partial<Record<TemplateCategory | "all", number>> = {
			all: annotated.length,
		};
		for (const t of annotated) {
			counts[t.category] = (counts[t.category] ?? 0) + 1;
		}
		return counts;
	}, [annotated]);

	return (
		<div className="mt-4 space-y-4">
			{/* Search */}
			<div className="relative">
				<Search
					size={14}
					className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
					aria-hidden="true"
				/>
				<input
					type="search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="חיפוש תבנית..."
					className={cn(
						"w-full rounded-lg ps-8 pe-4 py-2 text-sm",
						"bg-[var(--color-bg-primary)] border border-[var(--color-border)]",
						"text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
						"focus:outline-none focus:border-[var(--color-accent-blue)]/60",
						"transition-colors duration-150",
					)}
					aria-label="חיפוש תבניות CI/CD"
				/>
			</div>

			{/* Category filter pills */}
			<div className="flex flex-wrap gap-2">
				{(
					[
						"all",
						"ci",
						"security",
						"deploy",
						"quality",
						"bundle",
						"lighthouse",
						"flutter",
						"other",
					] as const
				).map((cat) => {
					const count = categories[cat];
					if (count === undefined) return null;
					const meta = cat === "all" ? null : CATEGORY_META[cat];
					return (
						<button
							key={cat}
							type="button"
							onClick={() => setActiveCategory(cat)}
							className={cn(
								"inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
								"transition-all duration-150 min-h-7",
								activeCategory === cat
									? cat === "all"
										? "bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)] ring-1 ring-[var(--color-accent-blue)]/40"
										: cn(meta?.color, "ring-1 ring-current/40")
									: "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]",
							)}
						>
							{cat === "all" ? "הכל" : meta?.label}
							<span
								dir="ltr"
								className={cn(
									"text-xs tabular-nums",
									activeCategory === cat ? "opacity-80" : "opacity-50",
								)}
							>
								{count}
							</span>
						</button>
					);
				})}
			</div>

			{/* Grid */}
			{filtered.length === 0 ? (
				<p className="text-sm text-[var(--color-text-muted)] text-center py-6">
					לא נמצאו תבניות
				</p>
			) : (
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((t) => (
						<TemplateCard key={t.file} template={t} />
					))}
				</div>
			)}

			{templates.length === 0 && (
				<div className="text-center py-8">
					<FileCode2
						size={32}
						className="mx-auto mb-2 text-[var(--color-text-muted)] opacity-40"
						aria-hidden="true"
					/>
					<p className="text-sm text-[var(--color-text-muted)]">
						לא נמצאו תבניות ב-~/ci-standards/
					</p>
					<p className="text-xs text-[var(--color-text-muted)] mt-1" dir="ltr">
						git clone https://github.com/Nadav011/ci-standards ~/ci-standards
					</p>
				</div>
			)}
		</div>
	);
}

// ── Section 3: Pipeline Architecture ─────────────────────────────────────────

function PipelineStep({
	label,
	sub,
	color,
	isParallel,
}: {
	label: string;
	sub?: string;
	color: string;
	isParallel?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center px-3 py-2 rounded-lg text-center",
				"border text-xs font-medium min-w-[88px]",
				isParallel
					? "border-dashed bg-[var(--color-bg-primary)]"
					: "bg-[var(--color-bg-secondary)]",
				color,
			)}
		>
			<span>{label}</span>
			{sub && (
				<span className="text-[10px] opacity-60 mt-0.5 font-normal">{sub}</span>
			)}
		</div>
	);
}

function Arrow() {
	return (
		<div
			className="flex items-center text-[var(--color-text-muted)] shrink-0"
			aria-hidden="true"
		>
			<div className="w-4 h-px bg-current opacity-40" />
			<div className="w-0 h-0 border-y-[4px] border-y-transparent border-s-[6px] border-s-current opacity-40" />
		</div>
	);
}

function PipelineDiagram() {
	return (
		<div className="mt-4 space-y-4">
			<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
				ה-pipeline מורכב משלבים סדרתיים ומקבילים. שלבי האבטחה (trivy, semgrep,
				gitleaks) ושלבי הבדיקות רצים במקביל לחסוך זמן.
			</p>

			{/* Pipeline visual */}
			<div className="overflow-x-auto pb-3">
				<div className="flex items-center gap-1 min-w-max">
					{/* install */}
					<PipelineStep
						label="install"
						sub="pnpm ci"
						color="border-[var(--color-accent-cyan)]/40 text-[var(--color-accent-cyan)]"
					/>
					<Arrow />

					{/* Parallel block */}
					<div
						className={cn(
							"flex flex-col gap-2 p-3 rounded-xl",
							"border border-dashed border-[var(--color-accent-blue)]/30",
							"bg-[oklch(0.65_0.18_250_/_0.04)]",
						)}
					>
						<span className="text-[10px] text-[var(--color-accent-blue)] text-center font-semibold uppercase tracking-wide">
							במקביל
						</span>
						<div className="flex flex-wrap gap-2 justify-center">
							<PipelineStep
								label="typecheck"
								color="border-[var(--color-accent-blue)]/40 text-[var(--color-accent-blue)]"
								isParallel
							/>
							<PipelineStep
								label="lint"
								color="border-[var(--color-accent-blue)]/40 text-[var(--color-accent-blue)]"
								isParallel
							/>
							<PipelineStep
								label="semgrep"
								color="border-[var(--color-accent-red)]/40 text-[var(--color-accent-red)]"
								isParallel
							/>
							<PipelineStep
								label="trivy"
								color="border-[var(--color-accent-red)]/40 text-[var(--color-accent-red)]"
								isParallel
							/>
							<PipelineStep
								label="gitleaks"
								color="border-[var(--color-accent-red)]/40 text-[var(--color-accent-red)]"
								isParallel
							/>
							<PipelineStep
								label="socket-ci"
								color="border-[var(--color-accent-amber)]/40 text-[var(--color-accent-amber)]"
								isParallel
							/>
							<PipelineStep
								label="tests"
								sub="4 shards"
								color="border-[var(--color-accent-green)]/40 text-[var(--color-accent-green)]"
								isParallel
							/>
						</div>
					</div>

					<Arrow />
					<PipelineStep
						label="lhci"
						sub="Lighthouse"
						color="border-[var(--color-accent-cyan)]/40 text-[var(--color-accent-cyan)]"
					/>
					<Arrow />
					<PipelineStep
						label="build"
						color="border-[var(--color-accent-amber)]/40 text-[var(--color-accent-amber)]"
					/>
					<Arrow />
					<PipelineStep
						label="ci-gate"
						sub="all must pass"
						color="border-[var(--color-accent-blue)]/60 text-[var(--color-accent-blue)] bg-[oklch(0.65_0.18_250_/_0.08)]"
					/>
					<Arrow />
					<PipelineStep
						label="deploy"
						sub="main only"
						color="border-[var(--color-accent-green)]/60 text-[var(--color-accent-green)] bg-[oklch(0.72_0.19_155_/_0.08)]"
					/>
				</div>
			</div>

			{/* Key rules */}
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{[
					{
						icon: <Shield size={13} />,
						color: "text-[var(--color-accent-red)]",
						text: "semgrep, trivy, gitleaks — security gates, לא אופציונלי",
					},
					{
						icon: <CheckCircle2 size={13} />,
						color: "text-[var(--color-accent-green)]",
						text: "ci-gate חייב לעבור לפני כל deploy",
					},
					{
						icon: <Zap size={13} />,
						color: "text-[var(--color-accent-blue)]",
						text: "tests: 4 shards במקביל — מקסימום מהירות",
					},
					{
						icon: <AlertTriangle size={13} />,
						color: "text-[var(--color-accent-amber)]",
						text: "cancel-in-progress: false בפריסה — מונע מצב לא עקבי",
					},
				].map(({ icon, color, text }, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static list
					<div key={i} className="flex items-start gap-2">
						<span className={cn("shrink-0 mt-0.5", color)}>{icon}</span>
						<span className="text-xs text-[var(--color-text-secondary)]">
							{text}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

// ── Section 4: Installed Tools ────────────────────────────────────────────────

function ToolsTable() {
	const categoryColors: Record<string, string> = {
		security: "text-[var(--color-accent-red)] bg-[oklch(0.62_0.22_25_/_0.12)]",
		quality: "text-[var(--color-accent-blue)] bg-[oklch(0.65_0.18_250_/_0.12)]",
		perf: "text-[var(--color-accent-cyan)] bg-[oklch(0.75_0.14_200_/_0.12)]",
		dev: "text-[var(--color-accent-green)] bg-[oklch(0.72_0.19_155_/_0.12)]",
	};
	const categoryLabels: Record<string, string> = {
		security: "אבטחה",
		quality: "איכות",
		perf: "ביצועים",
		dev: "פיתוח",
	};

	return (
		<div className="mt-4">
			<div className="overflow-x-auto">
				<table className="w-full text-xs" aria-label="כלי CI מותקנים">
					<thead>
						<tr className="border-b border-[var(--color-border)]">
							{["כלי", "גרסה", "פקודה", "מטרה", "קטגוריה"].map((h) => (
								<th
									key={h}
									className="text-start pb-2 pe-4 text-[var(--color-text-muted)] font-medium"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{CI_TOOLS.map((tool) => (
							<tr
								key={tool.name}
								className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors duration-100"
							>
								<td className="py-2 pe-4 font-semibold text-[var(--color-text-primary)] font-mono">
									{tool.name}
								</td>
								<td
									className="py-2 pe-4 text-[var(--color-text-muted)] font-mono"
									dir="ltr"
								>
									{tool.version}
								</td>
								<td className="py-2 pe-4">
									<code
										className="text-[var(--color-accent-cyan)] font-mono text-xs bg-[var(--color-bg-primary)] px-1.5 py-0.5 rounded border border-[var(--color-border)]"
										dir="ltr"
									>
										{tool.cmd}
									</code>
								</td>
								<td className="py-2 pe-4 text-[var(--color-text-secondary)]">
									{tool.purpose}
								</td>
								<td className="py-2">
									<span
										className={cn(
											"inline-block text-xs font-medium px-2 py-0.5 rounded-full",
											categoryColors[tool.category] ??
												"text-[var(--color-text-muted)] bg-[oklch(0.55_0.02_260_/_0.12)]",
										)}
									>
										{categoryLabels[tool.category] ?? tool.category}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-4 p-3 rounded-lg bg-[oklch(0.65_0.18_250_/_0.06)] border border-[var(--color-accent-blue)]/20">
				<p className="text-xs text-[var(--color-text-secondary)]">
					<span className="font-semibold text-[var(--color-accent-blue)]">
						מיקומי התקנה:
					</span>{" "}
					trivy/semgrep/act/git-cliff/hurl/k6 →{" "}
					<code className="font-mono text-[var(--color-accent-cyan)]" dir="ltr">
						~/.local/bin/
					</code>
					{" | "}
					knip/type-coverage/lhci/socket →{" "}
					<code className="font-mono text-[var(--color-accent-cyan)]" dir="ltr">
						~/.local/share/pnpm/
					</code>
				</p>
			</div>
		</div>
	);
}

// ── Section 5: GitHub Apps ────────────────────────────────────────────────────

function GithubAppsSection() {
	const apps = [
		{
			name: "Renovate",
			icon: <RefreshCw size={16} />,
			color: "text-[var(--color-accent-blue)]",
			bg: "bg-[oklch(0.65_0.18_250_/_0.12)]",
			desc: "עדכון תלויות אוטומטי שבועי — PR מוכן לכל שדרוג",
			details: [
				"רץ כל ראשון בבוקר",
				"מסנן CVEs ידועים",
				"PR עם שינויי lockfile מדויקים",
				"מגדיר minimumReleaseAge: 3d כהגנת supply-chain",
			],
		},
		{
			name: "Socket.dev",
			icon: <Shield size={16} />,
			color: "text-[var(--color-accent-red)]",
			bg: "bg-[oklch(0.62_0.22_25_/_0.12)]",
			desc: "ניטור שרשרת אספקה — מזהה חבילות זדוניות לפני merge",
			details: [
				"בדיקה על כל PR שמשנה חבילות",
				"מזהה typosquatting, postinstall ריצות חשודות",
				"חוסם חבילות עם גישה לרשת, מערכת קבצים או env",
				"כל הריפוs מחוברים",
			],
		},
		{
			name: "CodeRabbit",
			icon: <Bot size={16} />,
			color: "text-[var(--color-accent-purple)]",
			bg: "bg-[oklch(0.62_0.2_290_/_0.12)]",
			desc: "סקירת קוד AI — מציין בעיות ב-PR לפני code-reviewer",
			details: [
				"סקירה אוטומטית על כל PR",
				"מוצא RTL violations, security issues, type errors",
				"עובד יחד עם code-reviewer skill (Opus L10+)",
				"לא מחליף את code-reviewer — שכבה נוספת",
			],
		},
	];

	return (
		<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
			{apps.map((app) => (
				<div key={app.name} className="glass-card p-4 space-y-3">
					<div className="flex items-center gap-2">
						<span
							className={cn(
								"flex items-center justify-center size-8 rounded-lg",
								app.bg,
								app.color,
							)}
							aria-hidden="true"
						>
							{app.icon}
						</span>
						<span className="text-sm font-semibold text-[var(--color-text-primary)]">
							{app.name}
						</span>
					</div>
					<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
						{app.desc}
					</p>
					<ul className="space-y-1">
						{app.details.map((d) => (
							<li
								key={d}
								className="flex items-start gap-1.5 text-xs text-[var(--color-text-muted)]"
							>
								<span
									className={cn("mt-1 size-1 rounded-full shrink-0", app.bg)}
									aria-hidden="true"
								/>
								{d}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}

// ── Section 6: Security Rules ─────────────────────────────────────────────────

function SecurityRulesSection() {
	const rules = [
		{
			id: "harden-runner",
			severity: "critical",
			label: "harden-runner v2.16.0",
			desc: "פינוי CVE-2026-25598 (DNS-over-HTTPS bypass) ו-GHSA-g699-3x6g-wm3g (DNS-over-TCP bypass). גרסאות ישנות מאפשרות exfiltration של נתונים.",
			code: "uses: step-security/harden-runner@v2.16.0",
			wrong:
				"uses: step-security/harden-runner@v2  # floating tag = vulnerable",
		},
		{
			id: "trivy-sha",
			severity: "critical",
			label: "trivy-action — pin SHA, לא tag",
			desc: "תגי trivy-action נפרצו במרץ 2026 (75 מתוך 76 תגים). שימוש ב-@v0.x.x = ריצת קוד זדוני ב-CI.",
			code: "uses: aquasecurity/trivy-action@<FULL_40_CHAR_SHA>",
			wrong: "uses: aquasecurity/trivy-action@v0.35.0  # COMPROMISED TAG",
		},
		{
			id: "ubuntu-latest",
			severity: "critical",
			label: "לעולם לא ubuntu-latest",
			desc: "ubuntu-latest שונה מ-pop-os: binaries שונים, Node.js שונה, cache miss. גורם לכשלים שקטים.",
			code: "runs-on: [self-hosted, linux, x64, pop-os]",
			wrong: "runs-on: ubuntu-latest  # NEVER — wrong OS/binaries",
		},
		{
			id: "cancel-deploy",
			severity: "warning",
			label: "deploy: cancel-in-progress: false",
			desc: "CI workflows: true (עצור ישנים). Deploy workflows: false — פריסה חלקית מותירה תשתית במצב לא ידוע.",
			code: "# deploy.yml\nconcurrency:\n  group: deploy-prod\n  cancel-in-progress: false",
			wrong:
				"# WRONG for deploy:\nconcurrency:\n  group: deploy-prod\n  cancel-in-progress: true",
		},
		{
			id: "semgrep-autofix",
			severity: "warning",
			label: "semgrep scan --autofix (לא semgrep ci)",
			desc: "semgrep ci --autofix מתעלם מדגל --autofix לחלוטין. Auto-fix עובד רק עם semgrep scan --autofix.",
			code: "semgrep scan --autofix\ngit add -A && git commit",
			wrong: "semgrep ci --autofix  # SILENTLY IGNORES --autofix",
		},
		{
			id: "no-or-true",
			severity: "warning",
			label: "אסור || true בפקודות security",
			desc: "|| true גורם לפקודה תמיד לסיים בהצלחה — גם אם מצא CVE. security scans חייבים להכשיל את ה-pipeline.",
			code: "trivy fs . --severity HIGH,CRITICAL  # exits non-zero on findings",
			wrong:
				"trivy fs . --severity HIGH,CRITICAL || true  # ALWAYS PASSES = useless",
		},
	];

	const severityColors = {
		critical: {
			badge: "bg-[oklch(0.62_0.22_25_/_0.15)] text-[var(--color-accent-red)]",
			border: "border-[var(--color-accent-red)]/20",
		},
		warning: {
			badge: "bg-[oklch(0.78_0.16_75_/_0.15)] text-[var(--color-accent-amber)]",
			border: "border-[var(--color-accent-amber)]/20",
		},
	};

	return (
		<div className="mt-4 space-y-3">
			{rules.map((rule) => {
				const colors =
					severityColors[rule.severity as keyof typeof severityColors];
				return (
					<div
						key={rule.id}
						className={cn("glass-card p-4 border", colors.border)}
					>
						<div className="flex items-start gap-3 mb-2">
							<span
								className={cn(
									"text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
									colors.badge,
								)}
							>
								{rule.severity === "critical" ? "קריטי" : "אזהרה"}
							</span>
							<span className="text-sm font-semibold text-[var(--color-text-primary)]">
								{rule.label}
							</span>
						</div>
						<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
							{rule.desc}
						</p>
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
							<div>
								<p className="text-xs text-[var(--color-accent-green)] mb-1 font-medium">
									נכון:
								</p>
								<pre
									className="text-xs font-mono text-[var(--color-accent-cyan)] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap"
									dir="ltr"
								>
									{rule.code}
								</pre>
							</div>
							<div>
								<p className="text-xs text-[var(--color-accent-red)] mb-1 font-medium">
									שגוי:
								</p>
								<pre
									className="text-xs font-mono text-[var(--color-accent-red)]/80 bg-[oklch(0.62_0.22_25_/_0.04)] border border-[var(--color-accent-red)]/20 rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap"
									dir="ltr"
								>
									{rule.wrong}
								</pre>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

// ── Section 7: Per-Project Matrix ─────────────────────────────────────────────

function ProjectMatrixSection() {
	const features = [
		"bundle-check",
		"lighthouse",
		"trivy-autofix",
		"renovate",
	] as const;
	const featureLabels: Record<(typeof features)[number], string> = {
		"bundle-check": "bundle-check",
		lighthouse: "lighthouse CI",
		"trivy-autofix": "trivy weekly",
		renovate: "Renovate",
	};
	const featureColors: Record<(typeof features)[number], string> = {
		"bundle-check": "text-[var(--color-accent-amber)]",
		lighthouse: "text-[var(--color-accent-cyan)]",
		"trivy-autofix": "text-[var(--color-accent-red)]",
		renovate: "text-[var(--color-accent-blue)]",
	};

	// All deployed on Mar 17, 2026 to all web projects
	const webProjects = [
		"Mexicani",
		"Chance Pro",
		"MediFlow",
		"NadavAI",
		"Design System",
		"Signature Pro",
		"Z (Cash)",
		"Cash",
		"Shifts",
		"HatumDigital",
		"Brain",
	];

	return (
		<div className="mt-4 space-y-4">
			<p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
				כל 4 הכלים נפרסו לכל פרויקטי הווב ב-17 מרץ 2026 כחלק מ-CI mega session.
				SportChat ו-FinanceApp: Flutter-specific CI בלבד (לא Vite/bundle CI).
			</p>

			<div className="overflow-x-auto">
				<table className="w-full text-xs" aria-label="מטריצת CI לפי פרויקט">
					<thead>
						<tr className="border-b border-[var(--color-border)]">
							<th className="text-start pb-2 pe-4 text-[var(--color-text-muted)] font-medium">
								פרויקט
							</th>
							{features.map((f) => (
								<th
									key={f}
									className={cn(
										"text-center pb-2 pe-3 font-medium",
										featureColors[f],
									)}
								>
									{featureLabels[f]}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{webProjects.map((proj) => (
							<tr
								key={proj}
								className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-colors duration-100"
							>
								<td className="py-2 pe-4 font-medium text-[var(--color-text-primary)]">
									{proj}
								</td>
								{features.map((f) => (
									<td key={f} className="py-2 pe-3 text-center">
										<CheckCircle2
											size={14}
											className="mx-auto text-[var(--color-accent-green)]"
											aria-label="פעיל"
										/>
									</td>
								))}
							</tr>
						))}
						<tr className="border-b border-[var(--color-border)]">
							<td className="py-2 pe-4 font-medium text-[var(--color-text-primary)]">
								SportChat
							</td>
							{features.map((f) => (
								<td key={f} className="py-2 pe-3 text-center">
									{f === "renovate" ? (
										<CheckCircle2
											size={14}
											className="mx-auto text-[var(--color-accent-green)]"
											aria-label="פעיל"
										/>
									) : (
										<span
											className="text-[var(--color-text-muted)] text-base leading-none"
											title="Flutter — CI אחר"
										>
											—
										</span>
									)}
								</td>
							))}
						</tr>
						<tr>
							<td className="py-2 pe-4 font-medium text-[var(--color-text-primary)]">
								FinanceApp
							</td>
							{features.map((f) => (
								<td key={f} className="py-2 pe-3 text-center">
									{f === "renovate" ? (
										<CheckCircle2
											size={14}
											className="mx-auto text-[var(--color-accent-green)]"
											aria-label="פעיל"
										/>
									) : (
										<span
											className="text-[var(--color-text-muted)] text-base leading-none"
											title="Expo RN — CI אחר"
										>
											—
										</span>
									)}
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</div>

			<div className="p-3 rounded-lg bg-[oklch(0.72_0.19_155_/_0.05)] border border-[var(--color-accent-green)]/20">
				<p className="text-xs text-[var(--color-text-secondary)]">
					<span className="font-semibold text-[var(--color-accent-green)]">
						בדיקה:
					</span>{" "}
					<code
						className="font-mono text-[var(--color-accent-cyan)] text-xs"
						dir="ltr"
					>
						gh api repos/Nadav011/&lt;repo&gt;/contents/.github/workflows/ | jq
						'.[].name'
					</code>{" "}
					— לבדיקת תוכן ה-workflows בכל ריפו
				</p>
			</div>
		</div>
	);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function CiTemplatesPage() {
	const { data, isLoading, error, refetch } = useCiTemplates();
	const templates = data?.templates ?? [];

	return (
		<div className="flex flex-col gap-4 pb-8">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center size-10 rounded-lg bg-[oklch(0.65_0.18_250_/_0.15)]">
						<FileCode2
							size={20}
							className="text-[var(--color-accent-blue)]"
							aria-hidden="true"
						/>
					</div>
					<div>
						<h1 className="text-xl font-bold text-[var(--color-text-primary)]">
							CI/CD תבניות ומדריך
						</h1>
						<p className="text-xs text-[var(--color-text-muted)]">
							{isLoading
								? "טוען..."
								: data
									? `${data.count} תבניות ב-${data.path}`
									: "~/ci-standards/"}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{data?.path && (
						<a
							href="https://github.com/Nadav011/ci-standards"
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								"flex items-center gap-1.5 rounded-lg px-3 py-2 min-h-11",
								"text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent-blue)]",
								"bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)]",
								"border border-[var(--color-border)] hover:border-[var(--color-accent-blue)]/40",
								"transition-colors duration-150",
							)}
							aria-label="פתח ci-standards ב-GitHub"
						>
							<ExternalLink size={13} aria-hidden="true" />
							<span>GitHub</span>
						</a>
					)}
					<button
						type="button"
						onClick={() => refetch()}
						disabled={isLoading}
						className={cn(
							"flex items-center gap-1.5 rounded-lg px-3 py-2 min-h-11",
							"text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
							"bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)]",
							"border border-[var(--color-border)] hover:border-[var(--color-border-hover)]",
							"transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
						)}
						aria-label="רענן רשימת תבניות"
					>
						<RefreshCw
							size={13}
							className={cn(isLoading && "animate-spin")}
							aria-hidden="true"
						/>
						<span>רענן</span>
					</button>
				</div>
			</div>

			{/* Error */}
			{error && (
				<div className="glass-card p-4 border-[var(--color-accent-amber)]/30 bg-[oklch(0.78_0.16_75_/_0.05)]">
					<p className="text-sm text-[var(--color-accent-amber)] flex items-center gap-2">
						<AlertTriangle size={14} aria-hidden="true" />
						שגיאה בטעינת תבניות: {(error as Error).message}
					</p>
				</div>
			)}

			{/* Summary stats */}
			{data && (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{[
						{
							label: "סה״כ תבניות",
							value: data.count,
							color: "text-[var(--color-text-secondary)]",
							icon: <FileCode2 size={15} />,
						},
						{
							label: "CI ראשי",
							value: templates.filter(
								(t) => categorizeTemplate(t.file, t.name) === "ci",
							).length,
							color: "text-[var(--color-accent-blue)]",
							icon: <GitBranch size={15} />,
						},
						{
							label: "אבטחה",
							value: templates.filter(
								(t) => categorizeTemplate(t.file, t.name) === "security",
							).length,
							color: "text-[var(--color-accent-red)]",
							icon: <Shield size={15} />,
						},
						{
							label: "פריסה",
							value: templates.filter(
								(t) => categorizeTemplate(t.file, t.name) === "deploy",
							).length,
							color: "text-[var(--color-accent-green)]",
							icon: <Globe size={15} />,
						},
					].map(({ label, value, color, icon }) => (
						<div key={label} className="glass-card p-3 flex flex-col gap-1">
							<div className={cn("flex items-center gap-1.5", color)}>
								{icon}
								<span className="text-xs text-[var(--color-text-secondary)]">
									{label}
								</span>
							</div>
							<p
								className="text-2xl font-bold text-[var(--color-text-primary)]"
								dir="ltr"
							>
								{isLoading ? (
									<span className="inline-block w-8 h-6 rounded shimmer" />
								) : (
									value
								)}
							</p>
						</div>
					))}
				</div>
			)}

			{/* Accordion sections */}
			<IntroSection />

			<SectionCard
				id="gallery"
				title={`גלריית תבניות (${templates.length})`}
				icon={<FileText size={18} />}
				defaultOpen={true}
			>
				{isLoading ? (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
						{Array.from({ length: 6 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
							<div key={i} className="h-20 rounded-lg shimmer" />
						))}
					</div>
				) : (
					<TemplateGallery templates={templates} />
				)}
			</SectionCard>

			<SectionCard
				id="pipeline"
				title="ארכיטקטורת Pipeline"
				icon={<Zap size={18} />}
				defaultOpen={false}
			>
				<PipelineDiagram />
			</SectionCard>

			<SectionCard
				id="tools"
				title="כלים מותקנים"
				icon={<Terminal size={18} />}
				defaultOpen={false}
			>
				<ToolsTable />
			</SectionCard>

			<SectionCard
				id="github-apps"
				title="GitHub Apps"
				icon={<Code2 size={18} />}
				defaultOpen={false}
			>
				<GithubAppsSection />
			</SectionCard>

			<SectionCard
				id="security-rules"
				title="חוקי אבטחה קריטיים"
				icon={<Shield size={18} />}
				defaultOpen={false}
			>
				<SecurityRulesSection />
			</SectionCard>

			<SectionCard
				id="project-matrix"
				title={`מטריצה לפי פרויקט (${PROJECTS.length} פרויקטים)`}
				icon={<Globe size={18} />}
				defaultOpen={false}
			>
				<ProjectMatrixSection />
			</SectionCard>

			{/* Quick commands reference */}
			<div className="glass-card p-5">
				<h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
					<Terminal size={14} aria-hidden="true" />
					פקודות מהירות
				</h2>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{[
						{
							label: "סריקת CVE מקומית",
							cmd: "trivy fs . --severity HIGH,CRITICAL",
						},
						{
							label: "ריצת CI מקומית (debug)",
							cmd: "act push",
						},
						{
							label: "בדיקת כיסוי TypeScript",
							cmd: "type-coverage --at-least 90 --detail",
						},
						{
							label: "OWASP + code quality",
							cmd: "semgrep scan . --config=auto",
						},
						{
							label: "Lighthouse CI",
							cmd: "lhci autorun",
						},
						{
							label: "קוד מת שבועי",
							cmd: "knip",
						},
						{
							label: "בדיקות עומס",
							cmd: "k6 run tests/load/test.js",
						},
						{
							label: "CHANGELOG",
							cmd: "git-cliff -o CHANGELOG.md",
						},
					].map(({ label, cmd }) => (
						<div
							key={cmd}
							className="flex items-start gap-2 py-1.5 border-b border-[var(--color-border)] last:border-0"
						>
							<span className="text-xs text-[var(--color-text-muted)] w-32 shrink-0 pt-0.5">
								{label}
							</span>
							<code
								className="text-xs font-mono text-[var(--color-accent-cyan)] flex-1 break-all"
								dir="ltr"
							>
								{cmd}
							</code>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
