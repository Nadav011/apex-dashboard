import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
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
	const [isMobile, setIsMobile] = useState(false);
	const queryClient = useQueryClient();

	// Track mobile breakpoint
	useEffect(() => {
		const mq = window.matchMedia("(max-width: 767px)");
		const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
			setIsMobile(e.matches);
		};
		handleChange(mq);
		mq.addEventListener("change", handleChange);
		return () => mq.removeEventListener("change", handleChange);
	}, []);

	const sidebarWidth = collapsed ? 64 : 260;

	const handleRefreshAll = useCallback(() => {
		void queryClient.invalidateQueries();
	}, [queryClient]);

	const handleToggleCollapse = useCallback(() => {
		setCollapsed((prev) => !prev);
	}, []);

	return (
		<div className="min-h-dvh bg-bg-primary flex" dir="rtl">
			{/* Sidebar — fixed on the RIGHT (RTL), hidden on mobile */}
			{!isMobile && (
				<Sidebar
					activePage={activePage}
					onNavigate={onNavigate}
					collapsed={collapsed}
					onToggleCollapse={handleToggleCollapse}
					isMobile={false}
				/>
			)}

			{/* Main area */}
			<div
				className={cn(
					"flex flex-col flex-1 min-h-dvh",
					"transition-all duration-300 ease-in-out",
					// On mobile: no margin (sidebar is bottom bar), add bottom padding for tab bar
					isMobile ? "pb-[calc(env(safe-area-inset-bottom)+60px)]" : "",
				)}
				style={!isMobile ? { marginInlineEnd: `${sidebarWidth}px` } : undefined}
			>
				<Header onRefreshAll={handleRefreshAll} />

				<main className="flex-1 overflow-y-auto p-5 md:p-5 p-3">
					{children}
				</main>
			</div>

			{/* Bottom Tab Bar — mobile only */}
			{isMobile && (
				<Sidebar
					activePage={activePage}
					onNavigate={onNavigate}
					collapsed={false}
					onToggleCollapse={handleToggleCollapse}
					isMobile={true}
				/>
			)}
		</div>
	);
}
