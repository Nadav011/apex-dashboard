import { lazy, Suspense, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Lazy-loaded pages (all named exports → .then(m => ({ default: m.PageName })))
const AgentGuidePage = lazy(() =>
	import("@/components/pages/AgentGuidePage").then((m) => ({
		default: m.AgentGuidePage,
	})),
);
const ArchitecturePage = lazy(() =>
	import("@/components/pages/ArchitecturePage").then((m) => ({
		default: m.ArchitecturePage,
	})),
);
const AutomationPage = lazy(() =>
	import("@/components/pages/AutomationPage").then((m) => ({
		default: m.AutomationPage,
	})),
);
const BundlePage = lazy(() =>
	import("@/components/pages/BundlePage").then((m) => ({
		default: m.BundlePage,
	})),
);
const CiCdPage = lazy(() =>
	import("@/components/pages/CiCdPage").then((m) => ({ default: m.CiCdPage })),
);
const CiTemplatesPage = lazy(() =>
	import("@/components/pages/CiTemplatesPage").then((m) => ({
		default: m.CiTemplatesPage,
	})),
);
const ControlPage = lazy(() =>
	import("@/components/pages/ControlPage").then((m) => ({
		default: m.ControlPage,
	})),
);
const DeploysPage = lazy(() =>
	import("@/components/pages/DeploysPage").then((m) => ({
		default: m.DeploysPage,
	})),
);
const DispatchGuidePage = lazy(() =>
	import("@/components/pages/DispatchGuidePage").then((m) => ({
		default: m.DispatchGuidePage,
	})),
);
const DomainsPage = lazy(() =>
	import("@/components/pages/DomainsPage").then((m) => ({
		default: m.DomainsPage,
	})),
);
const FaqPage = lazy(() =>
	import("@/components/pages/FaqPage").then((m) => ({ default: m.FaqPage })),
);
const FleetPage = lazy(() =>
	import("@/components/pages/FleetPage").then((m) => ({
		default: m.FleetPage,
	})),
);
const GsdGuidePage = lazy(() =>
	import("@/components/pages/GsdGuidePage").then((m) => ({
		default: m.GsdGuidePage,
	})),
);
const HardwarePage = lazy(() =>
	import("@/components/pages/HardwarePage").then((m) => ({
		default: m.HardwarePage,
	})),
);
const HealthPage = lazy(() =>
	import("@/components/pages/HealthPage").then((m) => ({
		default: m.HealthPage,
	})),
);
const HooksDeepPage = lazy(() =>
	import("@/components/pages/HooksDeepPage").then((m) => ({
		default: m.HooksDeepPage,
	})),
);
const HooksPage = lazy(() =>
	import("@/components/pages/HooksPage").then((m) => ({
		default: m.HooksPage,
	})),
);
const HydraPage = lazy(() =>
	import("@/components/pages/HydraPage").then((m) => ({
		default: m.HydraPage,
	})),
);
const LogsPage = lazy(() =>
	import("@/components/pages/LogsPage").then((m) => ({ default: m.LogsPage })),
);
const McpGuidePage = lazy(() =>
	import("@/components/pages/McpGuidePage").then((m) => ({
		default: m.McpGuidePage,
	})),
);
const MemoryGuidePage = lazy(() =>
	import("@/components/pages/MemoryGuidePage").then((m) => ({
		default: m.MemoryGuidePage,
	})),
);
const MetricsPage = lazy(() =>
	import("@/components/pages/MetricsPage").then((m) => ({
		default: m.MetricsPage,
	})),
);
const NotificationsPage = lazy(() =>
	import("@/components/pages/NotificationsPage").then((m) => ({
		default: m.NotificationsPage,
	})),
);
const OpenclawPage = lazy(() =>
	import("@/components/pages/OpenclawPage").then((m) => ({
		default: m.OpenclawPage,
	})),
);
const OverviewPage = lazy(() =>
	import("@/components/pages/OverviewPage").then((m) => ({
		default: m.OverviewPage,
	})),
);
const ProjectsPage = lazy(() =>
	import("@/components/pages/ProjectsPage").then((m) => ({
		default: m.ProjectsPage,
	})),
);
const RulesExplorerPage = lazy(() =>
	import("@/components/pages/RulesExplorerPage").then((m) => ({
		default: m.RulesExplorerPage,
	})),
);
const SecurityGuidePage = lazy(() =>
	import("@/components/pages/SecurityGuidePage").then((m) => ({
		default: m.SecurityGuidePage,
	})),
);
const SkillsGuidePage = lazy(() =>
	import("@/components/pages/SkillsGuidePage").then((m) => ({
		default: m.SkillsGuidePage,
	})),
);
const SyncPage = lazy(() =>
	import("@/components/pages/SyncPage").then((m) => ({ default: m.SyncPage })),
);
const SystemPage = lazy(() =>
	import("@/components/pages/SystemPage").then((m) => ({
		default: m.SystemPage,
	})),
);
const TestingPage = lazy(() =>
	import("@/components/pages/TestingPage").then((m) => ({
		default: m.TestingPage,
	})),
);

type Page =
	| "overview"
	| "fleet"
	| "projects"
	| "agent-guide"
	| "hydra"
	| "dispatch-guide"
	| "health"
	| "system"
	| "hardware"
	| "sync"
	| "hooks"
	| "hooks-deep"
	| "rules-explorer"
	| "metrics"
	| "logs"
	| "control"
	| "automation"
	| "gsd-guide"
	| "deploys"
	| "domains"
	| "cicd"
	| "ci-templates"
	| "testing"
	| "bundles"
	| "notifications"
	| "openclaw"
	| "skills-guide"
	| "architecture"
	| "memory-guide"
	| "mcp-guide"
	| "security-guide"
	| "faq";

const PAGE_TITLES: Record<Page, string> = {
	overview: "סקירה כללית",
	fleet: "צי סוכנים",
	projects: "פרויקטים",
	"agent-guide": "מדריך סוכנים",
	hydra: "Hydra",
	"dispatch-guide": "מדריך שיגור",
	health: "בריאות המערכת",
	system: "מערכת",
	hardware: "חומרה",
	sync: "סנכרון",
	hooks: "הוקים",
	"hooks-deep": "הוקים מעמיקים",
	"rules-explorer": "סייר כללים",
	metrics: "מדדים",
	logs: "לוגים",
	control: "שליטה",
	automation: "אוטומציה",
	"gsd-guide": "מדריך GSD",
	deploys: "פריסות",
	domains: "דומיינים",
	cicd: "CI/CD",
	"ci-templates": "תבניות CI",
	testing: "בדיקות",
	bundles: "חבילות",
	notifications: "התראות",
	openclaw: "OpenClaw",
	"skills-guide": "מדריך כישורים",
	architecture: "ארכיטקטורה",
	"memory-guide": "מדריך זיכרון",
	"mcp-guide": "מדריך MCP",
	"security-guide": "מדריך אבטחה",
	faq: "שאלות נפוצות",
};

const PAGE_COMPONENTS: Record<
	Page,
	React.LazyExoticComponent<() => React.ReactElement>
> = {
	overview: OverviewPage,
	fleet: FleetPage,
	projects: ProjectsPage,
	"agent-guide": AgentGuidePage,
	hydra: HydraPage,
	"dispatch-guide": DispatchGuidePage,
	health: HealthPage,
	system: SystemPage,
	hardware: HardwarePage,
	sync: SyncPage,
	hooks: HooksPage,
	"hooks-deep": HooksDeepPage,
	"rules-explorer": RulesExplorerPage,
	metrics: MetricsPage,
	logs: LogsPage,
	control: ControlPage,
	automation: AutomationPage,
	"gsd-guide": GsdGuidePage,
	deploys: DeploysPage,
	domains: DomainsPage,
	cicd: CiCdPage,
	"ci-templates": CiTemplatesPage,
	testing: TestingPage,
	bundles: BundlePage,
	notifications: NotificationsPage,
	openclaw: OpenclawPage,
	"skills-guide": SkillsGuidePage,
	architecture: ArchitecturePage,
	"memory-guide": MemoryGuidePage,
	"mcp-guide": McpGuidePage,
	"security-guide": SecurityGuidePage,
	faq: FaqPage,
};

function PageSkeleton() {
	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="flex flex-col items-center gap-4">
				<div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent-blue)] border-t-transparent animate-spin" />
				<p className="text-sm text-[var(--color-text-muted)]">טוען...</p>
			</div>
		</div>
	);
}

export default function App() {
	const [activePage, setActivePage] = useState<Page>("overview");

	// Expose navigation for Playwright testing
	// biome-ignore lint: test-only hook
	useEffect(() => {
		// @ts-expect-error — Playwright test hook, not production code
		window.__navigate = (p: string) => setActivePage(p as Page);
	}, [setActivePage]);

	useEffect(() => {
		document.title = `${PAGE_TITLES[activePage]} — APEX`;
	}, [activePage]);

	const PageComponent = PAGE_COMPONENTS[activePage];

	return (
		<DashboardLayout
			activePage={activePage}
			onNavigate={(page) => setActivePage(page as Page)}
		>
			<ErrorBoundary key={activePage}>
				<Suspense fallback={<PageSkeleton />}>
					<div className="animate-fade-in">
						<PageComponent />
					</div>
				</Suspense>
			</ErrorBoundary>
		</DashboardLayout>
	);
}
