import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AgentGuidePage } from "@/components/pages/AgentGuidePage";
import { ArchitecturePage } from "@/components/pages/ArchitecturePage";
import { CiCdPage } from "@/components/pages/CiCdPage";
import { CiTemplatesPage } from "@/components/pages/CiTemplatesPage";
import { ControlPage } from "@/components/pages/ControlPage";
import { DeploysPage } from "@/components/pages/DeploysPage";
import { DispatchGuidePage } from "@/components/pages/DispatchGuidePage";
import { FaqPage } from "@/components/pages/FaqPage";
import { FleetPage } from "@/components/pages/FleetPage";
import { HardwarePage } from "@/components/pages/HardwarePage";
import { HealthPage } from "@/components/pages/HealthPage";
import { HooksDeepPage } from "@/components/pages/HooksDeepPage";
import { HooksPage } from "@/components/pages/HooksPage";
import { HydraPage } from "@/components/pages/HydraPage";
import { McpGuidePage } from "@/components/pages/McpGuidePage";
import { MemoryGuidePage } from "@/components/pages/MemoryGuidePage";
import { MetricsPage } from "@/components/pages/MetricsPage";
import { NotificationsPage } from "@/components/pages/NotificationsPage";
import { OpenclawPage } from "@/components/pages/OpenclawPage";
import { OverviewPage } from "@/components/pages/OverviewPage";
import { ProjectsPage } from "@/components/pages/ProjectsPage";
import { RulesExplorerPage } from "@/components/pages/RulesExplorerPage";
import { SkillsGuidePage } from "@/components/pages/SkillsGuidePage";
import { SystemPage } from "@/components/pages/SystemPage";

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
	| "hooks"
	| "hooks-deep"
	| "rules-explorer"
	| "metrics"
	| "control"
	| "deploys"
	| "cicd"
	| "ci-templates"
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
	hooks: () => <HooksPage />,
	"hooks-deep": () => <HooksDeepPage />,
	"rules-explorer": () => <RulesExplorerPage />,
	metrics: () => <MetricsPage />,
	control: () => <ControlPage />,
	deploys: () => <DeploysPage />,
	cicd: () => <CiCdPage />,
	"ci-templates": () => <CiTemplatesPage />,
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
