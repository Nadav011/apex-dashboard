import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface Tab {
	id: string;
	label: string;
	icon?: LucideIcon;
}

interface TabsProps {
	tabs: Tab[];
	defaultTab?: string;
	children: (activeTab: string) => React.ReactNode;
	className?: string;
}

export function Tabs({ tabs, defaultTab, children, className }: TabsProps) {
	const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");
	const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
	const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
	const containerRef = useRef<HTMLDivElement>(null);

	const updateIndicator = useCallback(() => {
		const el = tabRefs.current.get(activeTab);
		const container = containerRef.current;
		if (el && container) {
			const containerRect = container.getBoundingClientRect();
			const elRect = el.getBoundingClientRect();
			// Use inset-inline-start for RTL-safe positioning
			const inlineStart =
				document.dir === "rtl" || document.documentElement.dir === "rtl"
					? containerRect.right - elRect.right
					: elRect.left - containerRect.left;
			setIndicatorStyle({
				width: elRect.width,
				insetInlineStart: inlineStart,
			});
		}
	}, [activeTab]);

	useEffect(() => {
		updateIndicator();
		window.addEventListener("resize", updateIndicator);
		return () => window.removeEventListener("resize", updateIndicator);
	}, [updateIndicator]);

	return (
		<div className={className}>
			{/* Tab bar */}
			<div className="relative mb-5 border-b border-border" ref={containerRef}>
				<div
					className="flex gap-1 overflow-x-auto scrollbar-hide"
					role="tablist"
				>
					{tabs.map((tab) => {
						const isActive = activeTab === tab.id;
						const TabIcon = tab.icon;
						return (
							<button
								key={tab.id}
								ref={(el) => {
									if (el) tabRefs.current.set(tab.id, el);
									else tabRefs.current.delete(tab.id);
								}}
								type="button"
								role="tab"
								aria-selected={isActive}
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap",
									"transition-colors duration-150 shrink-0",
									isActive
										? "text-accent-blue"
										: "text-text-muted hover:text-text-secondary",
								)}
							>
								{TabIcon && <TabIcon size={15} aria-hidden="true" />}
								{tab.label}
							</button>
						);
					})}
				</div>
				{/* Animated underline — uses inset-inline-start for RTL support */}
				<span
					className="absolute bottom-0 h-0.5 bg-accent-blue rounded-full transition-all duration-200 ease-out"
					style={indicatorStyle}
				/>
			</div>

			{/* Tab content */}
			<div className="animate-fade-in" key={activeTab}>
				{children(activeTab)}
			</div>
		</div>
	);
}
