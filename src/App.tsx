import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AgentGuidePage } from "@/components/pages/AgentGuidePage";
import { ArchitecturePage } from "@/components/pages/ArchitecturePage";
import { CiCdPage } from "@/components/pages/CiCdPage";
import { CiTemplatesPage } from "@/components/pages/CiTemplatesPage";
import { ControlPage } from "@/components/pages/ControlPage";
import { DeploysPage } from "@/components/pages/DeploysPage";
import { FaqPage } from "@/components/pages/FaqPage";
import { FleetPage } from "@/components/pages/FleetPage";
import { HealthPage } from "@/components/pages/HealthPage";
import { HooksPage } from "@/components/pages/HooksPage";
import { HydraPage } from "@/components/pages/HydraPage";
import { MetricsPage } from "@/components/pages/MetricsPage";
import { NotificationsPage } from "@/components/pages/NotificationsPage";
import { OpenclawPage } from "@/components/pages/OpenclawPage";
import { OverviewPage } from "@/components/pages/OverviewPage";
import { ProjectsPage } from "@/components/pages/ProjectsPage";
import { SystemPage } from "@/components/pages/SystemPage";

type Page =
	| "overview"
	| "fleet"
	| "projects"
	| "agent-guide"
	| "hydra"
	| "health"
	| "system"
	| "hooks"
	| "metrics"
	| "control"
	| "deploys"
	| "cicd"
	| "ci-templates"
	| "notifications"
	| "openclaw"
	| "architecture"
	| "faq";

const PAGE_COMPONENTS: Record<Page, () => React.ReactElement> = {
	overview: () => <OverviewPage />,
	fleet: () => <FleetPage />,
	projects: () => <ProjectsPage />,
	"agent-guide": () => <AgentGuidePage />,
	hydra: () => <HydraPage />,
	health: () => <HealthPage />,
	system: () => <SystemPage />,
	hooks: () => <HooksPage />,
	metrics: () => <MetricsPage />,
	control: () => <ControlPage />,
	deploys: () => <DeploysPage />,
	cicd: () => <CiCdPage />,
	"ci-templates": () => <CiTemplatesPage />,
	notifications: () => <NotificationsPage />,
	openclaw: () => <OpenclawPage />,
	architecture: () => <ArchitecturePage />,
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
