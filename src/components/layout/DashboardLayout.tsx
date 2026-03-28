import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

// First 9 nav pages in order — used by Alt+1..9 keyboard shortcut
const QUICK_NAV_PAGES: string[] = [
	"overview",
	"fleet",
	"projects",
	"agent-guide",
	"hydra",
	"dispatch-guide",
	"health",
	"system",
	"hardware",
];

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

	// Global keyboard shortcuts
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			// Ctrl+K or / → focus sidebar search
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				document.querySelector<HTMLInputElement>("[data-search]")?.focus();
				return;
			}
			if (
				e.key === "/" &&
				!e.ctrlKey &&
				!e.metaKey &&
				!e.altKey &&
				document.activeElement?.tagName !== "INPUT" &&
				document.activeElement?.tagName !== "TEXTAREA"
			) {
				e.preventDefault();
				document.querySelector<HTMLInputElement>("[data-search]")?.focus();
				return;
			}
			// Escape → blur active element (dismisses mobile drawer, closes dropdowns)
			if (e.key === "Escape") {
				(document.activeElement as HTMLElement | null)?.blur();
				return;
			}
			// Alt+1..9 → quick-navigate to first 9 pages
			if (e.altKey && e.key >= "1" && e.key <= "9") {
				e.preventDefault();
				const idx = Number.parseInt(e.key, 10) - 1;
				const page = QUICK_NAV_PAGES[idx];
				if (page) onNavigate(page);
				return;
			}
			// Alt+← / Alt+→ → previous/next page (cycles through QUICK_NAV_PAGES)
			if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
				e.preventDefault();
				const currentIdx = QUICK_NAV_PAGES.indexOf(activePage);
				if (currentIdx === -1) return;
				// RTL layout: ArrowLeft = forward, ArrowRight = back
				const delta = e.key === "ArrowLeft" ? 1 : -1;
				const nextIdx =
					(currentIdx + delta + QUICK_NAV_PAGES.length) %
					QUICK_NAV_PAGES.length;
				const nextPage = QUICK_NAV_PAGES[nextIdx];
				if (nextPage) onNavigate(nextPage);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [activePage, onNavigate]);

	const sidebarWidth = collapsed ? 64 : 260;

	const handleRefreshAll = useCallback(() => {
		void queryClient.invalidateQueries();
	}, [queryClient]);

	const handleToggleCollapse = useCallback(() => {
		setCollapsed((prev) => !prev);
	}, []);

	return (
		<div className="min-h-dvh bg-bg-primary flex" dir="rtl">
			{/* Skip link — visible on keyboard focus, hidden otherwise */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:inset-inline-start-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-accent-blue)] focus:text-white focus:rounded-lg"
			>
				דלג לתוכן הראשי
			</a>

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

				<main
					id="main-content"
					className="flex-1 overflow-y-auto p-5 md:p-5 p-3"
					tabIndex={-1}
				>
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
