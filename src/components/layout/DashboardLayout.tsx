import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { cn } from "@/lib/cn";
import { Header } from "./Header";
import { MobileTabBar, Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
	category: string;
	page: string;
	navigate: (path: string) => void;
	children: React.ReactNode;
}

export function DashboardLayout({
	category,
	page,
	navigate,
	children,
}: DashboardLayoutProps) {
	const [collapsed, setCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [paletteOpen, setPaletteOpen] = useState(false);
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
			// Ctrl+K or Cmd+K → open command palette
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				setPaletteOpen(true);
				return;
			}
			// / → open palette (when not in input)
			if (
				e.key === "/" &&
				!e.ctrlKey &&
				!e.metaKey &&
				!e.altKey &&
				document.activeElement?.tagName !== "INPUT" &&
				document.activeElement?.tagName !== "TEXTAREA"
			) {
				e.preventDefault();
				setPaletteOpen(true);
				return;
			}
			// Escape → close palette or blur
			if (e.key === "Escape") {
				if (paletteOpen) {
					setPaletteOpen(false);
				} else {
					(document.activeElement as HTMLElement | null)?.blur();
				}
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [paletteOpen]);

	const sidebarWidth = collapsed ? 64 : 260;

	const handleRefreshAll = useCallback(() => {
		void queryClient.invalidateQueries();
	}, [queryClient]);

	const handleToggleCollapse = useCallback(() => {
		setCollapsed((prev) => !prev);
	}, []);

	const handleOpenPalette = useCallback(() => {
		setPaletteOpen(true);
	}, []);

	return (
		<div className="min-h-dvh bg-bg-primary flex" dir="rtl">
			{/* Skip link */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:inset-inline-start-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-blue focus:text-white focus:rounded-lg"
			>
				דלג לתוכן הראשי
			</a>

			{/* Ambient background orbs — decorative, fixed position, fluid sizes */}
			{/* responsive-ok: these are decorative blurred orbs, not content containers */}
			<div
				className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
				aria-hidden
			>
				<div className="absolute top-[20%] start-[10%] w-full max-w-sm h-auto aspect-square rounded-full bg-accent-blue/[0.04] blur-[100px] animate-drift-1" />
				<div className="absolute bottom-[30%] end-[15%] w-full max-w-xs h-auto aspect-square rounded-full bg-accent-purple/[0.04] blur-[80px] animate-drift-2" />
			</div>

			{/* Desktop sidebar */}
			{!isMobile && (
				<Sidebar
					activeCategory={category}
					activePage={page}
					onNavigate={navigate}
					collapsed={collapsed}
					onToggleCollapse={handleToggleCollapse}
					onOpenPalette={handleOpenPalette}
				/>
			)}

			{/* Command Palette */}
			<CommandPalette
				open={paletteOpen}
				onClose={() => setPaletteOpen(false)}
				onNavigate={navigate}
			/>

			{/* Main area */}
			<div
				className={cn(
					"flex flex-col flex-1 min-h-dvh relative z-10",
					"transition-all duration-300 ease-in-out",
					isMobile ? "pb-[calc(env(safe-area-inset-bottom)+60px)]" : "",
				)}
				style={!isMobile ? { marginInlineEnd: `${sidebarWidth}px` } : undefined}
			>
				<Header
					category={category}
					page={page}
					onRefreshAll={handleRefreshAll}
					onOpenPalette={handleOpenPalette}
				/>

				<main
					id="main-content"
					className="flex-1 overflow-y-auto p-3 md:p-5"
					tabIndex={-1}
				>
					{children}
				</main>
			</div>

			{/* Mobile bottom bar */}
			{isMobile && (
				<MobileTabBar activeCategory={category} activePage={page} onNavigate={navigate} />
			)}
		</div>
	);
}
