import {
	Activity,
	ChevronDown,
	ChevronLeft,
	Menu,
	RefreshCw,
	Search,
	X,
} from "lucide-react";
import { useState } from "react";
import { useRunHealthCheck, useSystem } from "@/hooks/use-api";
import { cn } from "@/lib/cn";
import {
	CATEGORIES,
	CATEGORY_MAP,
	type CategoryId,
	findRouteByHash,
	getRoutesByCategory,
} from "@/lib/routes";

type SystemStatus = "healthy" | "degraded" | "critical";

function deriveStatus(ramPct: number | undefined): SystemStatus {
	if (ramPct === undefined) return "healthy";
	if (ramPct > 90) return "critical";
	if (ramPct > 75) return "degraded";
	return "healthy";
}

const STATUS_CONFIG: Record<
	SystemStatus,
	{ label: string; dotClass: string; textClass: string }
> = {
	healthy: {
		label: "תקין",
		dotClass: "bg-status-healthy",
		textClass: "text-status-healthy",
	},
	degraded: {
		label: "מדורדר",
		dotClass: "bg-status-degraded",
		textClass: "text-status-degraded",
	},
	critical: {
		label: "קריטי",
		dotClass: "bg-status-critical",
		textClass: "text-status-critical",
	},
};

interface HeaderProps {
	category: string;
	page: string;
	onRefreshAll: () => void;
	onOpenPalette: () => void;
	onNavigate?: (path: string) => void;
}

export function Header({
	category,
	page,
	onRefreshAll,
	onOpenPalette,
	onNavigate,
}: HeaderProps) {
	const { data: system, isRefetching } = useSystem();
	const healthCheck = useRunHealthCheck();
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	const ramPct = system?.ram?.pct;
	const status = deriveStatus(ramPct);
	const cfg = STATUS_CONFIG[status];
	const memPercent = ramPct != null ? Math.round(ramPct) : null;

	// Breadcrumbs
	const categoryDef = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP];
	const routeDef = findRouteByHash(category, page);

	const handleMobileNavigate = (path: string) => {
		setMobileNavOpen(false);
		onNavigate?.(path);
	};

	return (
		<>
			<header className="sticky top-0 z-30 flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-3 bg-bg-secondary/90 backdrop-blur-md border-b border-border max-w-full overflow-hidden">
				{/* Hamburger button — mobile only */}
				<button
					type="button"
					onClick={() => setMobileNavOpen(true)}
					aria-label="פתח תפריט ניווט"
					aria-expanded={mobileNavOpen}
					aria-controls="mobile-nav-overlay"
					className={cn(
						"lg:hidden flex items-center justify-center",
						"min-w-[44px] min-h-[44px] rounded-lg",
						"text-text-muted border border-border",
						"hover:border-border-hover hover:bg-bg-tertiary hover:text-text-primary",
						"transition-all duration-150 shrink-0",
					)}
				>
					<Menu size={18} aria-hidden="true" />
				</button>

				{/* Breadcrumb */}
				<nav
					className="flex items-center gap-1.5 min-w-0 text-sm"
					aria-label="מיקום"
				>
					{categoryDef && (
						<>
							<span className="text-text-muted truncate">
								{categoryDef.label}
							</span>
							<ChevronLeft
								size={12}
								className="text-text-muted shrink-0 rtl:rotate-180"
							/>
						</>
					)}
					{routeDef && (
						<span className="text-text-primary font-medium truncate">
							{routeDef.title}
						</span>
					)}
				</nav>

				{/* Divider */}
				<span className="w-px h-5 bg-border shrink-0" aria-hidden />

				{/* Status Indicator */}
				<div
					className="flex items-center gap-2 min-w-0"
					role="status"
					aria-label={`סטטוס מערכת: ${cfg.label}`}
					aria-live="polite"
				>
					<span
						className="relative flex h-2.5 w-2.5 shrink-0"
						aria-hidden="true"
					>
						<span
							className={cn(
								"animate-ping absolute inline-flex h-full w-full rounded-full opacity-60",
								cfg.dotClass,
							)}
						/>
						<span
							className={cn(
								"relative inline-flex rounded-full h-2.5 w-2.5",
								cfg.dotClass,
							)}
						/>
					</span>
					<span className={cn("text-sm font-semibold", cfg.textClass)}>
						{cfg.label}
					</span>
				</div>

				{/* Memory */}
				{memPercent !== null && (
					<div className="hidden md:flex items-center gap-1.5">
						<Activity size={13} className="text-text-muted shrink-0" />
						<span className="text-xs text-text-muted">RAM</span>
						<span
							className={cn(
								"text-xs font-mono font-medium",
								memPercent > 90
									? "text-status-critical"
									: memPercent > 75
										? "text-status-degraded"
										: "text-text-secondary",
							)}
						>
							{memPercent}%
						</span>
						<div className="w-14 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
							<div
								className={cn(
									"h-full rounded-full transition-all duration-500",
									memPercent > 90
										? "bg-status-critical"
										: memPercent > 75
											? "bg-status-degraded"
											: "bg-status-healthy",
								)}
								style={{ width: `${memPercent}%` }}
							/>
						</div>
					</div>
				)}

				{/* Spacer */}
				<div className="flex-1" />

				{/* Actions */}
				<div className="flex items-center gap-2 shrink-0">
					{/* Command Palette trigger */}
					<button
						type="button"
						onClick={onOpenPalette}
						className={cn(
							"hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
							"text-xs text-text-muted",
							"border border-border hover:border-border-hover hover:bg-bg-tertiary",
							"transition-all duration-150 min-h-9",
						)}
					>
						<Search size={13} />
						<span>חיפוש</span>
						<kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-bg-primary border border-border ms-1">
							⌘K
						</kbd>
					</button>

					<button
						type="button"
						onClick={() => {
							void healthCheck.mutateAsync();
						}}
						disabled={healthCheck.isPending}
						className={cn(
							"flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
							"text-xs font-medium text-text-secondary",
							"border border-border hover:border-border-hover",
							"hover:bg-bg-tertiary hover:text-text-primary",
							"transition-all duration-150 min-h-9",
							"disabled:opacity-50 disabled:cursor-not-allowed",
						)}
					>
						<Activity
							size={13}
							className={cn(healthCheck.isPending && "animate-pulse")}
						/>
						<span className="hidden sm:inline">בדיקה</span>
					</button>

					<button
						type="button"
						onClick={onRefreshAll}
						disabled={isRefetching}
						title="רענן הכל"
						className={cn(
							"flex items-center justify-center w-9 h-9 rounded-lg",
							"text-text-muted border border-border",
							"hover:border-border-hover hover:bg-bg-tertiary hover:text-text-primary",
							"transition-all duration-150",
							"disabled:opacity-50 disabled:cursor-not-allowed",
						)}
					>
						<RefreshCw
							size={14}
							className={cn(isRefetching && "animate-spin")}
						/>
					</button>
				</div>
			</header>

			{/* Mobile nav overlay */}
			{mobileNavOpen && (
				<MobileNavOverlay
					id="mobile-nav-overlay"
					activeCategory={category}
					activePage={page}
					onNavigate={handleMobileNavigate}
					onClose={() => setMobileNavOpen(false)}
				/>
			)}
		</>
	);
}

// ── Mobile Nav Overlay ────────────────────────────────────────────────

interface MobileNavOverlayProps {
	id: string;
	activeCategory: string;
	activePage: string;
	onNavigate: (path: string) => void;
	onClose: () => void;
}

function MobileNavOverlay({
	id,
	activeCategory,
	activePage,
	onNavigate,
	onClose,
}: MobileNavOverlayProps) {
	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm border-none cursor-default"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				aria-label="סגור תפריט"
				tabIndex={-1}
			/>

			{/* Slide-in panel from start side */}
			<div
				id={id}
				role="dialog"
				aria-modal="true"
				aria-label="תפריט ניווט"
				dir="rtl"
				className={cn(
					"fixed inset-s-0 inset-y-0 z-50 w-[280px] max-w-[85vw]",
					"flex flex-col",
					"bg-bg-secondary border-e border-border",
					"animate-slide-in-start",
					"overflow-hidden",
				)}
			>
				{/* Header row */}
				<div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
					<div className="flex items-center gap-2">
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-blue/20">
							<span className="text-accent-blue text-xs font-bold">⚡</span>
						</div>
						<span className="text-sm font-bold text-text-primary">
							APEX Command
						</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="סגור תפריט"
						className={cn(
							"flex items-center justify-center",
							"min-w-[44px] min-h-[44px] rounded-lg",
							"text-text-muted hover:text-text-primary hover:bg-bg-tertiary",
							"transition-colors duration-150",
						)}
					>
						<X size={18} aria-hidden="true" />
					</button>
				</div>

				{/* Nav categories */}
				<nav
					className="flex-1 overflow-y-auto py-2 px-2"
					aria-label="ניווט ראשי"
				>
					{CATEGORIES.map((cat) => (
						<MobileNavCategory
							key={cat.id}
							categoryId={cat.id}
							activeCategory={activeCategory}
							activePage={activePage}
							onNavigate={onNavigate}
						/>
					))}
				</nav>
			</div>
		</>
	);
}

// ── Mobile Nav Category ───────────────────────────────────────────────

function MobileNavCategory({
	categoryId,
	activeCategory,
	activePage,
	onNavigate,
}: {
	categoryId: CategoryId;
	activeCategory: string;
	activePage: string;
	onNavigate: (path: string) => void;
}) {
	const cat = CATEGORY_MAP[categoryId];
	const routes = getRoutesByCategory(categoryId);
	const isActiveCategory = activeCategory === categoryId;
	const [expanded, setExpanded] = useState(isActiveCategory);
	const Icon = cat.icon;

	return (
		<div className="mb-1">
			{/* Category header button */}
			<button
				type="button"
				onClick={() => setExpanded((prev) => !prev)}
				className={cn(
					"w-full flex items-center gap-2 px-3 py-2 rounded-lg",
					"text-xs font-semibold uppercase tracking-wider",
					"transition-colors duration-150 min-h-[44px]",
					isActiveCategory
						? "text-text-primary"
						: "text-text-muted hover:text-text-secondary hover:bg-bg-tertiary",
				)}
			>
				<Icon
					size={15}
					style={{ color: cat.color }}
					aria-hidden="true"
					className="shrink-0"
				/>
				<span className="flex-1 text-start">{cat.label}</span>
				<span className="text-[10px] font-normal text-text-muted tabular-nums">
					{routes.length}
				</span>
				<ChevronDown
					size={13}
					className={cn(
						"text-text-muted transition-transform duration-200 shrink-0",
						!expanded && "-rotate-90",
					)}
					aria-hidden="true"
				/>
			</button>

			{/* Routes list */}
			<div
				className={cn(
					"overflow-hidden transition-all duration-200 ease-out",
					expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
				)}
			>
				<div className="space-y-0.5 py-0.5 ps-1">
					{routes.map((route) => {
						const RouteIcon = route.icon;
						const parts = route.path.replace("#/", "").split("/");
						const isActive =
							parts[0] === activeCategory && parts[1] === activePage;

						return (
							<button
								key={route.id}
								type="button"
								onClick={() => onNavigate(route.path)}
								aria-current={isActive ? "page" : undefined}
								className={cn(
									"w-full flex items-center gap-3 rounded-lg",
									"min-h-[44px] px-3 py-2 text-start ms-1",
									"transition-all duration-150",
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
								<RouteIcon
									size={16}
									className="shrink-0"
									style={{ color: isActive ? undefined : cat.color }}
									aria-hidden="true"
								/>
								<span className="text-sm font-medium truncate">
									{route.title}
								</span>
								{isActive && (
									<span className="ms-auto w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0 animate-pulse-status" />
								)}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
