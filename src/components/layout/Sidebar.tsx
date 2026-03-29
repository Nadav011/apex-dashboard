import { ChevronDown, ChevronLeft, Search, Zap } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import {
	CATEGORIES,
	CATEGORY_MAP,
	type CategoryId,
	getRoutesByCategory,
	type RouteDef,
} from "@/lib/routes";

interface SidebarProps {
	activeCategory: string;
	activePage: string;
	onNavigate: (path: string) => void;
	collapsed: boolean;
	onToggleCollapse: () => void;
	onOpenPalette: () => void;
}

export function Sidebar({
	activeCategory,
	activePage,
	onNavigate,
	collapsed,
	onToggleCollapse,
	onOpenPalette,
}: SidebarProps) {
	return (
		<aside
			className={cn(
				"fixed inset-e-0 inset-y-0 z-40 flex flex-col",
				"bg-bg-secondary border-s border-border",
				"transition-all duration-300 ease-in-out",
				collapsed ? "w-16" : "w-[260px]",
			)}
		>
			{/* Logo */}
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

			{/* Search trigger — opens command palette */}
			{!collapsed && (
				<div className="shrink-0 px-3 py-2 border-b border-border">
					<button
						type="button"
						onClick={onOpenPalette}
						data-search
						className={cn(
							"w-full flex items-center gap-2 text-xs rounded-lg pe-3 ps-3 py-2",
							"bg-bg-elevated border border-border",
							"text-text-muted hover:text-text-secondary hover:border-border-hover",
							"transition-colors duration-150",
						)}
					>
						<Search size={13} aria-hidden="true" />
						<span className="flex-1 text-start">חפש עמוד...</span>
						<kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg-primary border border-border">
							⌘K
						</kbd>
					</button>
				</div>
			)}

			{/* Category groups */}
			<nav className="flex-1 overflow-y-auto py-2 px-2" aria-label="ניווט ראשי">
				{CATEGORIES.map((cat) => (
					<CategoryGroup
						key={cat.id}
						category={cat.id}
						activeCategory={activeCategory}
						activePage={activePage}
						onNavigate={onNavigate}
						collapsed={collapsed}
					/>
				))}
			</nav>

			{/* Collapse toggle */}
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

// ── Category Group ────────────────────────────────────────────────────

function CategoryGroup({
	category,
	activeCategory,
	activePage,
	onNavigate,
	collapsed,
}: {
	category: CategoryId;
	activeCategory: string;
	activePage: string;
	onNavigate: (path: string) => void;
	collapsed: boolean;
}) {
	const cat = CATEGORY_MAP[category];
	const routes = getRoutesByCategory(category);
	const isActiveCategory = activeCategory === category;
	const [expanded, setExpanded] = useState(isActiveCategory);

	// Auto-expand when navigating into this category
	const handleNavigateAndExpand = useCallback(
		(path: string) => {
			onNavigate(path);
		},
		[onNavigate],
	);

	// Keep expanded when active
	if (isActiveCategory && !expanded) {
		setExpanded(true);
	}

	const Icon = cat.icon;

	if (collapsed) {
		// In collapsed mode: just show the category icon, navigate to first page on click
		return (
			<div className="mb-1">
				<button
					type="button"
					onClick={() => handleNavigateAndExpand(routes[0]?.path ?? "#/")}
					title={cat.label}
					className={cn(
						"w-full flex items-center justify-center rounded-lg py-3",
						"transition-all duration-150",
						isActiveCategory
							? "bg-accent-blue/15 text-accent-blue"
							: "text-text-muted hover:text-text-secondary hover:bg-bg-tertiary",
					)}
				>
					<Icon
						size={18}
						style={{ color: isActiveCategory ? undefined : cat.color }}
					/>
				</button>
			</div>
		);
	}

	return (
		<div className="mb-1">
			{/* Category header */}
			<button
				type="button"
				onClick={() => setExpanded((prev) => !prev)}
				className={cn(
					"w-full flex items-center gap-2 px-3 py-2 rounded-lg",
					"text-xs font-semibold uppercase tracking-wider",
					"transition-colors duration-150",
					isActiveCategory
						? "text-text-primary"
						: "text-text-muted hover:text-text-secondary",
				)}
			>
				<Icon size={14} style={{ color: cat.color }} aria-hidden="true" />
				<span className="flex-1 text-start">{cat.label}</span>
				<span className="text-[10px] font-normal text-text-muted tabular-nums">
					{routes.length}
				</span>
				<ChevronDown
					size={12}
					className={cn(
						"text-text-muted transition-transform duration-200",
						!expanded && "-rotate-90",
					)}
				/>
			</button>

			{/* Routes in this category */}
			<div
				className={cn(
					"overflow-hidden transition-all duration-200 ease-out",
					expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
				)}
			>
				<div className="space-y-0.5 py-0.5">
					{routes.map((route) => (
						<NavItem
							key={route.id}
							route={route}
							isActive={isRouteActive(route, activeCategory, activePage)}
							onNavigate={handleNavigateAndExpand}
							categoryColor={cat.color}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

// ── Nav Item ──────────────────────────────────────────────────────────

function NavItem({
	route,
	isActive,
	onNavigate,
	categoryColor,
}: {
	route: RouteDef;
	isActive: boolean;
	onNavigate: (path: string) => void;
	categoryColor: string;
}) {
	const Icon = route.icon;

	return (
		<button
			type="button"
			onClick={() => onNavigate(route.path)}
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"w-full flex items-center gap-3 rounded-lg",
				"transition-all duration-150 cursor-pointer",
				"min-h-10 px-3 py-2 text-start ms-2",
				isActive
					? [
							"bg-accent-blue/12 text-accent-blue",
							"shadow-[0_0_12px_oklch(0.65_0.18_250/0.15)]",
						]
					: [
							"text-text-secondary hover:text-text-primary",
							"hover:bg-bg-tertiary",
						],
			)}
		>
			<Icon
				size={16}
				className="shrink-0"
				style={{ color: isActive ? undefined : categoryColor }}
			/>
			<span className="text-sm font-medium truncate">{route.title}</span>
			{isActive && (
				<span className="ms-auto w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0 animate-pulse-status" />
			)}
		</button>
	);
}

function isRouteActive(
	route: RouteDef,
	activeCategory: string,
	activePage: string,
): boolean {
	const parts = route.path.replace("#/", "").split("/");
	return parts[0] === activeCategory && parts[1] === activePage;
}

// ── Mobile Bottom Tab Bar ─────────────────────────────────────────────

export function MobileTabBar({
	activeCategory,
	onNavigate,
}: {
	activeCategory: string;
	onNavigate: (path: string) => void;
}) {
	return (
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
			{CATEGORIES.map((cat) => {
				const isActive = activeCategory === cat.id;
				const Icon = cat.icon;
				const firstRoute = getRoutesByCategory(cat.id)[0];

				return (
					<button
						key={cat.id}
						type="button"
						onClick={() => {
							if (firstRoute) onNavigate(firstRoute.path);
						}}
						aria-current={isActive ? "page" : undefined}
						title={cat.label}
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
								className={cn(isActive ? "text-accent-blue" : "text-current")}
							/>
						</div>
						<span className="text-[10px] font-medium truncate max-w-[56px] text-center">
							{cat.label}
						</span>
					</button>
				);
			})}
		</nav>
	);
}
