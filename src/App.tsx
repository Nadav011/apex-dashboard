import { lazy, Suspense, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useHashRouter } from "@/lib/router";
import { findRouteByHash } from "@/lib/routes";

// ── Lazy-loaded pages (named exports) ──────────────────────────────

const OverviewPage = lazy(() =>
	import("@/components/pages/OverviewPage").then((m) => ({
		default: m.OverviewPage,
	})),
);
const SystemPage = lazy(() =>
	import("@/components/pages/SystemPage").then((m) => ({
		default: m.SystemPage,
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
const FleetPage = lazy(() =>
	import("@/components/pages/FleetPage").then((m) => ({
		default: m.FleetPage,
	})),
);
const HydraPage = lazy(() =>
	import("@/components/pages/HydraPage").then((m) => ({
		default: m.HydraPage,
	})),
);
const ProjectsPage = lazy(() =>
	import("@/components/pages/ProjectsPage").then((m) => ({
		default: m.ProjectsPage,
	})),
);
const AgentsGuidePage = lazy(() =>
	import("@/components/pages/AgentsGuidePage").then((m) => ({
		default: m.AgentsGuidePage,
	})),
);
const TeamModePage = lazy(() =>
	import("@/components/pages/TeamModePage").then((m) => ({
		default: m.TeamModePage,
	})),
);
const PaperclipPage = lazy(() =>
	import("@/components/pages/PaperclipPage").then((m) => ({
		default: m.PaperclipPage,
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
const DeploysPage = lazy(() =>
	import("@/components/pages/DeploysPage").then((m) => ({
		default: m.DeploysPage,
	})),
);
const DomainsPage = lazy(() =>
	import("@/components/pages/DomainsPage").then((m) => ({
		default: m.DomainsPage,
	})),
);
const TestingPage = lazy(() =>
	import("@/components/pages/TestingPage").then((m) => ({
		default: m.TestingPage,
	})),
);
const BundlePage = lazy(() =>
	import("@/components/pages/BundlePage").then((m) => ({
		default: m.BundlePage,
	})),
);
const HooksPage = lazy(() =>
	import("@/components/pages/HooksPage").then((m) => ({
		default: m.HooksPage,
	})),
);
const RulesExplorerPage = lazy(() =>
	import("@/components/pages/RulesExplorerPage").then((m) => ({
		default: m.RulesExplorerPage,
	})),
);
const AutomationPage = lazy(() =>
	import("@/components/pages/AutomationPage").then((m) => ({
		default: m.AutomationPage,
	})),
);
const ControlPage = lazy(() =>
	import("@/components/pages/ControlPage").then((m) => ({
		default: m.ControlPage,
	})),
);
const MetricsPage = lazy(() =>
	import("@/components/pages/MetricsPage").then((m) => ({
		default: m.MetricsPage,
	})),
);
const LogsPage = lazy(() =>
	import("@/components/pages/LogsPage").then((m) => ({ default: m.LogsPage })),
);
const NotificationsPage = lazy(() =>
	import("@/components/pages/NotificationsPage").then((m) => ({
		default: m.NotificationsPage,
	})),
);
const SystemGuidePage = lazy(() =>
	import("@/components/pages/SystemGuidePage").then((m) => ({
		default: m.SystemGuidePage,
	})),
);
const KnowledgePage = lazy(() =>
	import("@/components/pages/KnowledgePage").then((m) => ({
		default: m.KnowledgePage,
	})),
);
const OpenclawPage = lazy(() =>
	import("@/components/pages/OpenclawPage").then((m) => ({
		default: m.OpenclawPage,
	})),
);

// ── Route → Component mapping ──────────────────────────────────────

type RouteKey = `${string}/${string}`;

const PAGE_COMPONENTS: Record<
	RouteKey,
	React.LazyExoticComponent<() => React.ReactElement>
> = {
	"dashboard/overview": OverviewPage,
	"dashboard/system": SystemPage,
	"dashboard/hardware": HardwarePage,
	"dashboard/health": HealthPage,
	"agents/fleet": FleetPage,
	"agents/hydra": HydraPage,
	"agents/projects": ProjectsPage,
	"agents/guide": AgentsGuidePage,
	"agents/team": TeamModePage,
	"agents/paperclip": PaperclipPage,
	"devops/cicd": CiCdPage,
	"devops/templates": CiTemplatesPage,
	"devops/deploys": DeploysPage,
	"devops/domains": DomainsPage,
	"devops/testing": TestingPage,
	"devops/bundles": BundlePage,
	"ops/hooks": HooksPage,
	"ops/rules": RulesExplorerPage,
	"ops/automation": AutomationPage,
	"ops/control": ControlPage,
	"ops/metrics": MetricsPage,
	"ops/logs": LogsPage,
	"ops/notifications": NotificationsPage,
	"knowledge/system": SystemGuidePage,
	"knowledge/base": KnowledgePage,
	"knowledge/openclaw": OpenclawPage,
};

function PageSkeleton() {
	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="flex flex-col items-center gap-4">
				<div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
				<p className="text-sm text-text-muted">טוען...</p>
			</div>
		</div>
	);
}

export default function App() {
	const { category, page, navigate } = useHashRouter();

	// Redirect empty/root to overview — update URL hash to match
	useEffect(() => {
		const h = window.location.hash;
		if (!h || h === "#" || h === "#/") {
			navigate("#/dashboard/overview");
		}
	}, [navigate]);

	// Expose navigation for Playwright testing
	useEffect(() => {
		// @ts-expect-error — Playwright test hook
		window.__navigate = (p: string) => navigate(p);
	}, [navigate]);

	// Update document title
	const routeDef = findRouteByHash(category, page);
	useEffect(() => {
		document.title = routeDef
			? `${routeDef.title} — APEX`
			: "APEX Command Center";
	}, [routeDef]);

	const routeKey = `${category}/${page}` as RouteKey;
	const PageComponent =
		PAGE_COMPONENTS[routeKey] ?? PAGE_COMPONENTS["dashboard/overview"]!;

	return (
		<DashboardLayout category={category} page={page} navigate={navigate}>
			<ErrorBoundary key={routeKey}>
				<Suspense fallback={<PageSkeleton />}>
					<div className="animate-fade-in">
						<PageComponent />
					</div>
				</Suspense>
			</ErrorBoundary>
		</DashboardLayout>
	);
}
