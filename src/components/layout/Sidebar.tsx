import {
	BarChart3,
	Bell,
	BookOpen,
	Bot,
	Brain,
	ChevronLeft,
	Cpu,
	FileCode2,
	FolderGit2,
	GitBranch,
	Globe,
	HeartPulse,
	LayoutDashboard,
	MoreHorizontal,
	Network,
	Package,
	Puzzle,
	RefreshCw,
	Rocket,
	ScrollText,
	Search,
	Send,
	Server,
	Settings,
	Shield,
	ShieldCheck,
	Sparkles,
	TestTube2,
	Users,
	Webhook,
	X,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface NavItem {
	label: string;
	icon: React.ComponentType<{ className?: string; size?: number }>;
	page: string;
	separator?: boolean;
}

const NAV_ITEMS: NavItem[] = [
	{ label: "סקירה כללית", icon: LayoutDashboard, page: "overview" },
	{ label: "צי סוכנים", icon: Users, page: "fleet" },
	{ label: "פרויקטים", icon: FolderGit2, page: "projects" },
	{ label: "מדריך סוכנים", icon: BookOpen, page: "agent-guide" },
	{ label: "הידרה", icon: Zap, page: "hydra" },
	{ label: "Dispatch", icon: Send, page: "dispatch-guide" },
	{ label: "בריאות", icon: HeartPulse, page: "health" },
	{ label: "מערכת", icon: Server, page: "system" },
	{ label: "חומרה", icon: Cpu, page: "hardware" },
	{ label: "סנכרון", icon: RefreshCw, page: "sync" },
	{ label: "הוקים", icon: Webhook, page: "hooks" },
	{ label: "הוקים מדריך", icon: BookOpen, page: "hooks-deep" },
	{ label: "חוקים", icon: Shield, page: "rules-explorer" },
	{ label: "אבטחה מדריך", icon: ShieldCheck, page: "security-guide" },
	{ label: "מטריקות", icon: BarChart3, page: "metrics" },
	{ label: "לוגים", icon: ScrollText, page: "logs" },
	{ label: "שליטה", icon: Settings, page: "control" },
	{ label: "אוטומציה", icon: Bot, page: "automation" },
	{ label: "GSD", icon: Rocket, page: "gsd-guide" },
	{ label: "Deploys", icon: Globe, page: "deploys" },
	{ label: "דומיינים", icon: Globe, page: "domains" },
	{ label: "CI/CD", icon: GitBranch, page: "cicd" },
	{ label: "CI תבניות", icon: FileCode2, page: "ci-templates" },
	{ label: "בדיקות", icon: TestTube2, page: "testing" },
	{ label: "חבילות", icon: Package, page: "bundles" },
	{ label: "OpenClaw", icon: Puzzle, page: "openclaw", separator: true },
	{ label: "מיומנויות", icon: Sparkles, page: "skills-guide" },
	{ label: "התראות", icon: Bell, page: "notifications" },
	{ label: "ארכיטקטורה", icon: Network, page: "architecture" },
	{ label: "זיכרון", icon: Brain, page: "memory-guide" },
	{ label: "שרתי MCP", icon: Server, page: "mcp-guide" },
	{ label: "מדריך", icon: BookOpen, page: "faq" },
];

// Top 5 items shown in mobile bottom bar; rest go behind "more"
const MOBILE_PRIMARY_PAGES = ["overview", "fleet", "hydra", "health", "system"];
const MOBILE_PRIMARY = NAV_ITEMS.filter((i) =>
	MOBILE_PRIMARY_PAGES.includes(i.page),
);

interface SidebarProps {
	activePage: string;
	onNavigate: (page: string) => void;
	collapsed: boolean;
	onToggleCollapse: () => void;
	isMobile: boolean;
}

export function Sidebar({
	activePage,
	onNavigate,
	collapsed,
	onToggleCollapse,
	isMobile,
}: SidebarProps) {
	const [moreOpen, setMoreOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredNavItems = searchQuery.trim()
		? NAV_ITEMS.filter((item) =>
				item.label.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: NAV_ITEMS;

	// ── Mobile: Bottom Tab Bar ───────────────────────────────────────────
	if (isMobile) {
		const isMoreActive =
			!MOBILE_PRIMARY_PAGES.includes(activePage) && activePage !== "";

		return (
			<>
				{/* "More" drawer — slides up from bottom */}
				{moreOpen && (
					<>
						{/* Backdrop */}
						<button
							type="button"
							aria-label="סגור תפריט"
							className="fixed inset-0 z-40 bg-bg-primary/70 backdrop-blur-sm"
							onClick={() => setMoreOpen(false)}
						/>
						{/* Drawer */}
						<div
							className={cn(
								"fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+60px)] z-50",
								"bg-bg-secondary border-t border-border",
								"rounded-t-2xl shadow-[0_-8px_32px_oklch(0_0_0/0.5)]",
								"max-h-[60dvh] overflow-y-auto",
								"py-3 px-2",
							)}
						>
							{/* Mobile search */}
							<div className="relative mb-2 mx-1">
								<Search
									size={13}
									className="absolute inset-y-0 end-3 my-auto text-[var(--color-text-muted)] pointer-events-none"
									aria-hidden="true"
								/>
								<input
									type="search"
									placeholder="חיפוש..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className={cn(
										"w-full text-xs rounded-lg pe-8 ps-3 py-2",
										"bg-[var(--color-bg-elevated)] border border-[var(--color-border)]",
										"text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
										"focus:outline-none focus:border-[var(--color-accent-blue)]",
										"transition-colors duration-150",
									)}
									dir="rtl"
								/>
							</div>
							<div className="grid grid-cols-4 gap-1">
								{filteredNavItems
									.filter((i) => !MOBILE_PRIMARY_PAGES.includes(i.page))
									.map(({ label, icon: Icon, page }) => {
										const isActive = activePage === page;
										return (
											<button
												key={page}
												type="button"
												onClick={() => {
													onNavigate(page);
													setMoreOpen(false);
												}}
												aria-current={isActive ? "page" : undefined}
												className={cn(
													"flex flex-col items-center gap-1 rounded-xl",
													"min-h-[64px] px-1 py-2",
													"transition-all duration-150",
													isActive
														? "bg-accent-blue/15 text-accent-blue"
														: "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
												)}
											>
												<Icon
													size={20}
													className={cn(
														"shrink-0",
														isActive ? "text-accent-blue" : "text-current",
													)}
												/>
												<span className="text-[10px] font-medium text-center leading-tight line-clamp-2">
													{label}
												</span>
											</button>
										);
									})}
							</div>
						</div>
					</>
				)}

				{/* Bottom Tab Bar */}
				<nav
					aria-label="ניווט תחתון"
					className={cn(
						"fixed inset-x-0 bottom-0 z-40",
						"bg-bg-secondary/95 backdrop-blur-md",
						"border-t border-border",
						"flex items-center justify-around",
						"h-[calc(env(safe-area-inset-bottom)+60px)]",
						"pb-[env(safe-area-inset-bottom)]",
					)}
				>
					{MOBILE_PRIMARY.map(({ label, icon: Icon, page }) => {
						const isActive = activePage === page;
						return (
							<button
								key={page}
								type="button"
								onClick={() => {
									onNavigate(page);
									setMoreOpen(false);
								}}
								aria-current={isActive ? "page" : undefined}
								title={label}
								className={cn(
									"flex flex-col items-center justify-center gap-0.5",
									"min-w-[44px] min-h-[44px] flex-1 py-1",
									"transition-all duration-150",
									isActive
										? "text-accent-blue"
										: "text-text-muted hover:text-text-secondary",
								)}
							>
								<div
									className={cn(
										"flex items-center justify-center w-10 h-7 rounded-xl",
										"transition-all duration-150",
										isActive ? "bg-accent-blue/20" : "bg-transparent",
									)}
								>
									<Icon
										size={20}
										className={cn(
											isActive ? "text-accent-blue" : "text-current",
										)}
									/>
								</div>
								<span className="text-[10px] font-medium truncate max-w-[56px] text-center">
									{label}
								</span>
							</button>
						);
					})}

					{/* More button */}
					<button
						type="button"
						onClick={() => setMoreOpen((prev) => !prev)}
						title="עוד"
						className={cn(
							"flex flex-col items-center justify-center gap-0.5",
							"min-w-[44px] min-h-[44px] flex-1 py-1",
							"transition-all duration-150",
							isMoreActive || moreOpen
								? "text-accent-blue"
								: "text-text-muted hover:text-text-secondary",
						)}
					>
						<div
							className={cn(
								"flex items-center justify-center w-10 h-7 rounded-xl",
								"transition-all duration-150",
								isMoreActive || moreOpen
									? "bg-accent-blue/20"
									: "bg-transparent",
							)}
						>
							<MoreHorizontal
								size={20}
								className={cn(
									isMoreActive || moreOpen
										? "text-accent-blue"
										: "text-current",
								)}
							/>
						</div>
						<span className="text-[10px] font-medium truncate max-w-[56px] text-center">
							עוד
						</span>
					</button>
				</nav>
			</>
		);
	}

	// ── Desktop: Vertical Sidebar ────────────────────────────────────────
	return (
		<aside
			className={cn(
				"fixed inset-e-0 inset-y-0 z-40 flex flex-col",
				"bg-bg-secondary border-s border-border",
				"transition-all duration-300 ease-in-out",
				collapsed ? "w-16" : "w-[260px]",
			)}
		>
			{/* Logo / Title */}
			<div
				className={cn(
					"flex items-center gap-3 px-4 py-5",
					"border-b border-border shrink-0",
					collapsed && "justify-center px-0",
				)}
			>
				<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-blue/20 shrink-0">
					<Zap size={18} className="text-accent-blue" />
				</div>
				{!collapsed && (
					<div className="overflow-hidden">
						<div className="text-sm font-bold text-text-primary leading-tight truncate">
							APEX Command
						</div>
						<div className="text-xs text-text-muted leading-tight truncate">
							Center
						</div>
					</div>
				)}
			</div>

			{/* Desktop search — hidden when collapsed */}
			{!collapsed && (
				<div className="shrink-0 px-3 py-2 border-b border-border">
					<div className="relative">
						<Search
							size={13}
							className="absolute inset-y-0 end-3 my-auto text-[var(--color-text-muted)] pointer-events-none"
							aria-hidden="true"
						/>
						<input
							type="search"
							placeholder="חיפוש בתפריט..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className={cn(
								"w-full text-xs rounded-lg pe-8 ps-3 py-2",
								"bg-[var(--color-bg-elevated)] border border-[var(--color-border)]",
								"text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
								"focus:outline-none focus:border-[var(--color-accent-blue)]",
								"transition-colors duration-150",
							)}
							dir="rtl"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								aria-label="נקה חיפוש"
								className="absolute inset-y-0 start-2 my-auto flex items-center justify-center w-4 h-4 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
							>
								<X size={10} />
							</button>
						)}
					</div>
				</div>
			)}

			{/* Navigation */}
			<nav
				className="flex-1 overflow-y-auto py-3 px-2 space-y-1"
				aria-label="ניווט ראשי"
			>
				{filteredNavItems.length === 0 && (
					<p className="text-xs text-[var(--color-text-muted)] text-center py-6 px-2">
						אין תוצאות עבור "{searchQuery}"
					</p>
				)}
				{filteredNavItems.map(({ label, icon: Icon, page, separator }) => {
					const isActive = activePage === page;
					return (
						<div key={page}>
							{separator && (
								<div
									className="mx-2 my-1.5 border-t border-border"
									aria-hidden="true"
								/>
							)}
							<button
								type="button"
								onClick={() => onNavigate(page)}
								aria-current={isActive ? "page" : undefined}
								title={collapsed ? label : undefined}
								className={cn(
									"w-full flex items-center gap-3 rounded-lg",
									"transition-all duration-150 cursor-pointer",
									"min-h-11 text-start",
									collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
									isActive
										? [
												"bg-accent-blue/15 text-accent-blue",
												"shadow-[0_0_12px_oklch(0.65_0.18_250/0.2)]",
											]
										: [
												"text-text-secondary hover:text-text-primary",
												"hover:bg-bg-tertiary",
											],
								)}
							>
								<Icon
									size={18}
									className={cn(
										"shrink-0",
										isActive ? "text-accent-blue" : "text-current",
									)}
								/>
								{!collapsed && (
									<span className="text-sm font-medium truncate">{label}</span>
								)}
								{isActive && !collapsed && (
									<span className="ms-auto w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />
								)}
							</button>
						</div>
					);
				})}
			</nav>

			{/* Collapse Toggle */}
			<div className="shrink-0 p-2 border-t border-border">
				<button
					type="button"
					onClick={onToggleCollapse}
					title={collapsed ? "הרחב תפריט" : "כווץ תפריט"}
					className={cn(
						"w-full flex items-center justify-center rounded-lg",
						"min-h-10 text-text-muted hover:text-text-secondary",
						"hover:bg-bg-tertiary transition-colors duration-150",
					)}
				>
					<ChevronLeft
						size={16}
						className={cn(
							"transition-transform duration-300",
							collapsed && "rotate-180",
						)}
					/>
				</button>
			</div>
		</aside>
	);
}
