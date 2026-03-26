import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
	activePage: string;
	onNavigate: (page: string) => void;
	children: React.ReactNode;
}

export function DashboardLayout({
	activePage,
	onNavigate,
	children,
}: DashboardLayoutProps) {
	const [collapsed, setCollapsed] = useState(false);
	const queryClient = useQueryClient();

	const sidebarWidth = collapsed ? 64 : 260;

	const handleRefreshAll = useCallback(() => {
		void queryClient.invalidateQueries();
	}, [queryClient]);

	const handleToggleCollapse = useCallback(() => {
		setCollapsed((prev) => !prev);
	}, []);

	return (
		<div className="min-h-dvh bg-bg-primary flex" dir="rtl">
			{/* Sidebar — fixed on the RIGHT (RTL) */}
			<Sidebar
				activePage={activePage}
				onNavigate={onNavigate}
				collapsed={collapsed}
				onToggleCollapse={handleToggleCollapse}
			/>

			{/* Main area — offset to account for sidebar on the right */}
			<div
				className={cn(
					"flex flex-col flex-1 min-h-dvh",
					"transition-all duration-300 ease-in-out",
				)}
				style={{ marginInlineEnd: `${sidebarWidth}px` }}
			>
				<Header onRefreshAll={handleRefreshAll} />

				<main className="flex-1 overflow-y-auto p-5">{children}</main>
			</div>
		</div>
	);
}
