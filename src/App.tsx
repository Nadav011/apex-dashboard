import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AgentGuidePage } from "@/components/pages/AgentGuidePage";
import { ArchitecturePage } from "@/components/pages/ArchitecturePage";
import { AutomationPage } from "@/components/pages/AutomationPage";
import { BundlePage } from "@/components/pages/BundlePage";
import { CiCdPage } from "@/components/pages/CiCdPage";
import { CiTemplatesPage } from "@/components/pages/CiTemplatesPage";
import { ControlPage } from "@/components/pages/ControlPage";
import { DeploysPage } from "@/components/pages/DeploysPage";
import { DispatchGuidePage } from "@/components/pages/DispatchGuidePage";
import { DomainsPage } from "@/components/pages/DomainsPage";
import { FaqPage } from "@/components/pages/FaqPage";
import { FleetPage } from "@/components/pages/FleetPage";
import { GsdGuidePage } from "@/components/pages/GsdGuidePage";
import { HardwarePage } from "@/components/pages/HardwarePage";
import { HealthPage } from "@/components/pages/HealthPage";
import { HooksDeepPage } from "@/components/pages/HooksDeepPage";
import { HooksPage } from "@/components/pages/HooksPage";
import { HydraPage } from "@/components/pages/HydraPage";
import { LogsPage } from "@/components/pages/LogsPage";
import { McpGuidePage } from "@/components/pages/McpGuidePage";
import { MemoryGuidePage } from "@/components/pages/MemoryGuidePage";
import { MetricsPage } from "@/components/pages/MetricsPage";
import { NotificationsPage } from "@/components/pages/NotificationsPage";
import { OpenclawPage } from "@/components/pages/OpenclawPage";
import { OverviewPage } from "@/components/pages/OverviewPage";
import { ProjectsPage } from "@/components/pages/ProjectsPage";
import { RulesExplorerPage } from "@/components/pages/RulesExplorerPage";
import { SkillsGuidePage } from "@/components/pages/SkillsGuidePage";
import { SyncPage } from "@/components/pages/SyncPage";
import { SystemPage } from "@/components/pages/SystemPage";
import { TestingPage } from "@/components/pages/TestingPage";

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
	| "faq";

const PAGE_COMPONENTS: Record<Page, () => React.ReactElement> = {
	overview: () => <OverviewPage />,
	fleet: () => <FleetPage />,
	projects: () => <ProjectsPage />,
	"agent-guide": () => <AgentGuidePage />,
	hydra: () => <HydraPage />,
	"dispatch-guide": () => <DispatchGuidePage />,
	health: () => <HealthPage />,
	system: () => <SystemPage />,
	hardware: () => <HardwarePage />,
	sync: () => <SyncPage />,
	hooks: () => <HooksPage />,
	"hooks-deep": () => <HooksDeepPage />,
	"rules-explorer": () => <RulesExplorerPage />,
	metrics: () => <MetricsPage />,
	logs: () => <LogsPage />,
	control: () => <ControlPage />,
	automation: () => <AutomationPage />,
	"gsd-guide": () => <GsdGuidePage />,
	deploys: () => <DeploysPage />,
	domains: () => <DomainsPage />,
	cicd: () => <CiCdPage />,
	"ci-templates": () => <CiTemplatesPage />,
	testing: () => <TestingPage />,
	bundles: () => <BundlePage />,
	notifications: () => <NotificationsPage />,
	openclaw: () => <OpenclawPage />,
	"skills-guide": () => <SkillsGuidePage />,
	architecture: () => <ArchitecturePage />,
	"memory-guide": () => <MemoryGuidePage />,
	"mcp-guide": () => <McpGuidePage />,
	faq: () => <FaqPage />,
};

export default function App() {
	const [activePage, setActivePage] = useState<Page>("overview");

	const PageComponent = PAGE_COMPONENTS[activePage];

	return (
		<DashboardLayout
			activePage={activePage}
			onNavigate={(page) => setActivePage(page as Page)}
		>
			<PageComponent />
		</DashboardLayout>
	);
}
