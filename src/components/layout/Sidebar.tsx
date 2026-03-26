import {
	BarChart3,
	Bell,
	BookOpen,
	ChevronLeft,
	FileCode2,
	FolderGit2,
	GitBranch,
	Globe,
	HeartPulse,
	LayoutDashboard,
	Network,
	Puzzle,
	Server,
	Settings,
	Users,
	Webhook,
	Zap,
} from "lucide-react";
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
	{ label: "בריאות", icon: HeartPulse, page: "health" },
	{ label: "מערכת", icon: Server, page: "system" },
	{ label: "הוקים", icon: Webhook, page: "hooks" },
	{ label: "מטריקות", icon: BarChart3, page: "metrics" },
	{ label: "שליטה", icon: Settings, page: "control" },
	{ label: "Deploys", icon: Globe, page: "deploys" },
	{ label: "CI/CD", icon: GitBranch, page: "cicd" },
	{ label: "CI תבניות", icon: FileCode2, page: "ci-templates" },
	{ label: "OpenClaw", icon: Puzzle, page: "openclaw", separator: true },
	{ label: "התראות", icon: Bell, page: "notifications" },
	{ label: "ארכיטקטורה", icon: Network, page: "architecture" },
	{ label: "מדריך", icon: BookOpen, page: "faq" },
];

interface SidebarProps {
	activePage: string;
	onNavigate: (page: string) => void;
	collapsed: boolean;
	onToggleCollapse: () => void;
}

export function Sidebar({
	activePage,
	onNavigate,
	collapsed,
	onToggleCollapse,
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

			{/* Navigation */}
			<nav
				className="flex-1 overflow-y-auto py-3 px-2 space-y-1"
				aria-label="ניווט ראשי"
			>
				{NAV_ITEMS.map(({ label, icon: Icon, page, separator }) => {
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
