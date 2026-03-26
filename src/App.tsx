import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FaqPage } from "@/components/pages/FaqPage";

// Page type — matches sidebar nav items
type Page =
	| "overview"
	| "fleet"
	| "hydra"
	| "health"
	| "system"
	| "hooks"
	| "metrics"
	| "control"
	| "faq";

// Placeholder page — replace with real page components as they are built
function PlaceholderPage({ name }: { name: string }) {
	return (
		<div className="flex items-center justify-center min-h-96">
			<div className="glass-card p-8 text-center">
				<div className="text-4xl mb-3 opacity-30">🚧</div>
				<h2 className="text-lg font-semibold text-text-primary mb-1">{name}</h2>
				<p className="text-sm text-text-muted">עמוד זה בפיתוח</p>
			</div>
		</div>
	);
}

const PAGE_COMPONENTS: Record<Page, () => React.ReactElement> = {
	overview: () => <PlaceholderPage name="סקירה כללית" />,
	fleet: () => <PlaceholderPage name="צי סוכנים" />,
	hydra: () => <PlaceholderPage name="הידרה" />,
	health: () => <PlaceholderPage name="בריאות" />,
	system: () => <PlaceholderPage name="מערכת" />,
	hooks: () => <PlaceholderPage name="הוקים" />,
	metrics: () => <PlaceholderPage name="מטריקות" />,
	control: () => <PlaceholderPage name="שליטה" />,
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
