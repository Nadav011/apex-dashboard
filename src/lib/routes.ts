import type { LucideIcon } from "lucide-react";
import {
	Activity,
	BarChart3,
	Bell,
	BookOpen,
	Bot,
	Brain,
	Building2,
	Cpu,
	FileCode2,
	FolderGit2,
	GitBranch,
	Globe,
	HeartPulse,
	LayoutDashboard,
	Network,
	Package,
	Puzzle,
	Rocket,
	ScrollText,
	Send,
	Server,
	Settings,
	Shield,
	TestTube2,
	Users,
	Webhook,
	Zap,
} from "lucide-react";

// ── Category Definitions ────────────────────────────────────────────

export type CategoryId =
	| "dashboard"
	| "agents"
	| "devops"
	| "ops"
	| "knowledge";

export interface CategoryDef {
	id: CategoryId;
	label: string;
	icon: LucideIcon;
	color: string;
}

export const CATEGORIES: CategoryDef[] = [
	{
		id: "dashboard",
		label: "לוח בקרה",
		icon: LayoutDashboard,
		color: "var(--color-accent-blue)",
	},
	{
		id: "agents",
		label: "סוכנים",
		icon: Users,
		color: "var(--color-accent-purple)",
	},
	{
		id: "devops",
		label: "פיתוח",
		icon: GitBranch,
		color: "var(--color-accent-cyan)",
	},
	{
		id: "ops",
		label: "תפעול",
		icon: Settings,
		color: "var(--color-accent-amber)",
	},
	{
		id: "knowledge",
		label: "ידע",
		icon: BookOpen,
		color: "var(--color-accent-green)",
	},
];

export const CATEGORY_MAP = Object.fromEntries(
	CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryDef>;

// ── Route Definitions ───────────────────────────────────────────────

export interface RouteDef {
	id: string;
	path: string;
	title: string;
	description: string;
	icon: LucideIcon;
	category: CategoryId;
	keywords: string[];
}

export const ROUTES: RouteDef[] = [
	// ── Dashboard ─────────────────────
	{
		id: "overview",
		path: "#/dashboard/overview",
		title: "סקירה כללית",
		description: "מבט על כל המערכת — סוכנים, משימות, בריאות, משאבים",
		icon: LayoutDashboard,
		category: "dashboard",
		keywords: ["overview", "סקירה", "ראשי", "home", "dashboard"],
	},
	{
		id: "system",
		path: "#/dashboard/system",
		title: "מצב מערכת",
		description: "משאבי חומרה, שירותים, וחיבורים בין המכונות",
		icon: Server,
		category: "dashboard",
		keywords: ["system", "מערכת", "ram", "disk", "hardware"],
	},
	{
		id: "hardware",
		path: "#/dashboard/hardware",
		title: "חומרה",
		description: "מצב חומרה של שתי המכונות — Pop-OS ו-MSI",
		icon: Cpu,
		category: "dashboard",
		keywords: ["hardware", "חומרה", "lenovo", "msi", "cpu", "ram"],
	},
	{
		id: "health",
		path: "#/dashboard/health",
		title: "בריאות המערכת",
		description: "בדיקות בריאות של כל רכיבי המערכת",
		icon: HeartPulse,
		category: "dashboard",
		keywords: ["health", "בריאות", "diagnostics", "checks"],
	},

	// ── Agents ────────────────────────
	{
		id: "fleet",
		path: "#/agents/fleet",
		title: "צי סוכנים",
		description: "כל הסוכנים המוגדרים במערכת — פנימיים וחיצוניים",
		icon: Users,
		category: "agents",
		keywords: ["fleet", "צי", "agents", "סוכנים", "list"],
	},
	{
		id: "hydra",
		path: "#/agents/hydra",
		title: "Hydra — מנוע שיגור",
		description: "ניתוב משימות בין 4 ספקי AI לפי ציון ביינסיאני",
		icon: Zap,
		category: "agents",
		keywords: ["hydra", "הידרה", "dispatch", "bayesian", "providers"],
	},
	{
		id: "projects",
		path: "#/agents/projects",
		title: "פרויקטים",
		description: "כל 18 הפרויקטים — סטטוס, טכנולוגיה, ופריסה",
		icon: FolderGit2,
		category: "agents",
		keywords: ["projects", "פרויקטים", "repos", "github"],
	},
	{
		id: "agents-guide",
		path: "#/agents/guide",
		title: "מדריך סוכנים",
		description: "איך עובדים עם סוכנים, שיגור משימות, וניתוב",
		icon: Send,
		category: "agents",
		keywords: ["guide", "מדריך", "dispatch", "שיגור", "routing"],
	},

	{
		id: "team-mode",
		path: "#/agents/team",
		title: "מצב צוות",
		description:
			"ניטור Team Mode — פירוק אוטומטי, DAG execution, quality gates",
		icon: Network,
		category: "agents",
		keywords: ["team", "צוות", "dag", "decompose", "parallel", "wave"],
	},

	{
		id: "paperclip",
		path: "#/agents/paperclip",
		title: "Paperclip",
		description: "חברה וירטואלית — CEO, מהנדסים, תקציב, org chart",
		icon: Building2,
		category: "agents",
		keywords: ["paperclip", "company", "חברה", "org", "budget"],
	},

	// ── DevOps ────────────────────────
	{
		id: "cicd",
		path: "#/devops/cicd",
		title: "CI/CD",
		description: "מצב Pipeline של כל הפרויקטים — בדיקות, Build, ופריסה",
		icon: GitBranch,
		category: "devops",
		keywords: ["cicd", "pipeline", "github actions", "ci", "cd"],
	},
	{
		id: "ci-templates",
		path: "#/devops/templates",
		title: "תבניות CI",
		description: "כל תבניות ה-Workflow, כלי אבטחה, ו-Runners",
		icon: FileCode2,
		category: "devops",
		keywords: ["templates", "תבניות", "workflow", "yaml", "runners"],
	},
	{
		id: "deploys",
		path: "#/devops/deploys",
		title: "פריסות",
		description: "סטטוס כל האתרים — בדיקת זמינות בזמן אמת",
		icon: Rocket,
		category: "devops",
		keywords: ["deploys", "פריסות", "cloudflare", "netlify", "uptime"],
	},
	{
		id: "domains",
		path: "#/devops/domains",
		title: "דומיינים",
		description: "מפת דומיינים, DNS, ו-Tunnels",
		icon: Globe,
		category: "devops",
		keywords: ["domains", "דומיינים", "dns", "ssl", "tunnels"],
	},
	{
		id: "testing",
		path: "#/devops/testing",
		title: "בדיקות",
		description: "אסטרטגיית בדיקות — Unit, E2E, Coverage, Mutation",
		icon: TestTube2,
		category: "devops",
		keywords: ["testing", "בדיקות", "vitest", "playwright", "coverage"],
	},
	{
		id: "bundles",
		path: "#/devops/bundles",
		title: "חבילות",
		description: "גודל Bundle לכל פרויקט — לימיטים ומגמות",
		icon: Package,
		category: "devops",
		keywords: ["bundles", "חבילות", "bundle size", "optimization"],
	},

	// ── Operations ────────────────────
	{
		id: "hooks",
		path: "#/ops/hooks",
		title: "הוקים",
		description: "80 הוקים רשומים — אירועי Claude Code, סטטיסטיקות, ומדריך",
		icon: Webhook,
		category: "ops",
		keywords: ["hooks", "הוקים", "events", "pretooluse", "posttooluse"],
	},
	{
		id: "rules",
		path: "#/ops/rules",
		title: "כללים",
		description: "כל קבצי הכללים — בדיקת איכות, אבטחה, תיעוד, ועוד",
		icon: Shield,
		category: "ops",
		keywords: ["rules", "כללים", "quality", "security"],
	},
	{
		id: "automation",
		path: "#/ops/automation",
		title: "אוטומציה",
		description: "תהליכים אוטומטיים — Cron jobs, Self-healing, Ambient agents",
		icon: Bot,
		category: "ops",
		keywords: ["automation", "אוטומציה", "cron", "scheduled", "ambient"],
	},
	{
		id: "control",
		path: "#/ops/control",
		title: "שליטה",
		description: "פעולות שליטה — הפעלה/עצירה של שירותים, גיבוי, וניקוי",
		icon: Activity,
		category: "ops",
		keywords: ["control", "שליטה", "start", "stop", "backup"],
	},
	{
		id: "metrics",
		path: "#/ops/metrics",
		title: "מדדים",
		description: "סטטיסטיקות שיגור — ספקים, סוכנים, ופרויקטים",
		icon: BarChart3,
		category: "ops",
		keywords: ["metrics", "מדדים", "stats", "analytics"],
	},
	{
		id: "logs",
		path: "#/ops/logs",
		title: "לוגים",
		description: "כל אירועי Hydra Watcher בזמן אמת",
		icon: ScrollText,
		category: "ops",
		keywords: ["logs", "לוגים", "watcher", "events"],
	},
	{
		id: "activity",
		path: "#/ops/activity",
		title: "פיד פעילות",
		description: "כל האירועים ממקורות שונים — watcher, התראות, סוכנים",
		icon: Activity,
		category: "ops",
		keywords: ["activity", "פעילות", "feed", "events", "אירועים"],
	},
	{
		id: "notifications",
		path: "#/ops/notifications",
		title: "התראות",
		description: "הגדרות התראות Telegram ולוג אירועים",
		icon: Bell,
		category: "ops",
		keywords: ["notifications", "התראות", "telegram", "alerts"],
	},

	// ── Knowledge ─────────────────────
	{
		id: "system-guide",
		path: "#/knowledge/system",
		title: "מדריך מערכת",
		description: "זיכרון, שרתי MCP, ומיומנויות — איך הכל עובד",
		icon: Brain,
		category: "knowledge",
		keywords: ["memory", "mcp", "skills", "זיכרון", "מיומנויות"],
	},
	{
		id: "knowledge-base",
		path: "#/knowledge/base",
		title: "בסיס ידע",
		description: "ארכיטקטורה, אבטחה, GSD, ושאלות נפוצות",
		icon: Network,
		category: "knowledge",
		keywords: ["architecture", "security", "gsd", "faq", "ארכיטקטורה", "אבטחה"],
	},
	{
		id: "openclaw",
		path: "#/knowledge/openclaw",
		title: "OpenClaw",
		description: "מערכת ה-Skills הפתוחה — גרסה, רשימת Skills, וסאב-אגנטים",
		icon: Puzzle,
		category: "knowledge",
		keywords: ["openclaw", "skills", "open source"],
	},
];

// ── Lookup Helpers ───────────────────────────────────────────────────

export const ROUTE_MAP = Object.fromEntries(
	ROUTES.map((r) => [r.id, r]),
) as Record<string, RouteDef>;

export function findRouteByPath(path: string): RouteDef | undefined {
	return ROUTES.find((r) => r.path === path);
}

export function findRouteByHash(
	category: string,
	page: string,
): RouteDef | undefined {
	return ROUTES.find((r) => {
		const parts = r.path.replace("#/", "").split("/");
		return parts[0] === category && parts[1] === page;
	});
}

export function getRoutesByCategory(categoryId: CategoryId): RouteDef[] {
	return ROUTES.filter((r) => r.category === categoryId);
}

export function getCategoryDefaultPath(categoryId: CategoryId): string {
	const first = ROUTES.find((r) => r.category === categoryId);
	return first?.path ?? "#/dashboard/overview";
}
