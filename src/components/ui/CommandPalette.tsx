import { Clock, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { fuzzySearch } from "@/lib/fuzzy";
import { getRecentPages } from "@/lib/router";
import {
	CATEGORIES,
	CATEGORY_MAP,
	type CategoryId,
	ROUTES,
	type RouteDef,
} from "@/lib/routes";

interface CommandPaletteProps {
	open: boolean;
	onClose: () => void;
	onNavigate: (path: string) => void;
}

export function CommandPalette({
	open,
	onClose,
	onNavigate,
}: CommandPaletteProps) {
	const [query, setQuery] = useState("");
	const [selectedIdx, setSelectedIdx] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	// Fuzzy search results
	const results = useMemo(() => {
		if (!query.trim()) return ROUTES;
		return fuzzySearch(
			ROUTES,
			query,
			(r) => [r.title, r.description, ...r.keywords],
			10,
		).map((r) => r.item);
	}, [query]);

	// Group by category
	const grouped = useMemo(() => {
		const groups: {
			category: CategoryId;
			label: string;
			routes: RouteDef[];
		}[] = [];
		for (const cat of CATEGORIES) {
			const catRoutes = results.filter((r) => r.category === cat.id);
			if (catRoutes.length > 0) {
				groups.push({ category: cat.id, label: cat.label, routes: catRoutes });
			}
		}
		return groups;
	}, [results]);

	// Flat list for keyboard nav
	const flatResults = useMemo(
		() => grouped.flatMap((g) => g.routes),
		[grouped],
	);

	// Recent pages
	const recentPaths = useMemo(() => {
		if (query.trim()) return [];
		return getRecentPages();
	}, [query]);

	const recentRoutes = useMemo(
		() =>
			recentPaths
				.map((p) => ROUTES.find((r) => r.path === p))
				.filter((r): r is RouteDef => r != null),
		[recentPaths],
	);

	// Reset on open
	useEffect(() => {
		if (open) {
			setQuery("");
			setSelectedIdx(0);
			requestAnimationFrame(() => inputRef.current?.focus());
		}
	}, [open]);

	// Reset selection when results change
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional — reset on query change
	useEffect(() => {
		setSelectedIdx(0);
	}, [query]);

	const handleSelect = useCallback(
		(route: RouteDef) => {
			onNavigate(route.path);
			onClose();
		},
		[onNavigate, onClose],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIdx((i) => Math.min(i + 1, flatResults.length - 1));
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIdx((i) => Math.max(i - 1, 0));
			} else if (e.key === "Enter" && flatResults[selectedIdx]) {
				e.preventDefault();
				handleSelect(flatResults[selectedIdx]);
			} else if (e.key === "Escape") {
				onClose();
			}
		},
		[flatResults, selectedIdx, handleSelect, onClose],
	);

	let flatIdx = -1;

	return (
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 z-50 flex items-start justify-center pt-[15dvh]">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="absolute inset-0 bg-bg-primary/70 backdrop-blur-sm"
						onClick={onClose}
					/>

					{/* Dialog */}
					<motion.div
						initial={{ opacity: 0, scale: 0.96, y: -8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: -8 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						role="dialog"
						aria-modal="true"
						aria-label="פלטת פקודות — חיפוש עמוד"
						className={cn(
							"relative w-full max-w-[560px] mx-4",
							"bg-bg-secondary border border-border rounded-xl",
							"shadow-[0_24px_80px_oklch(0_0_0/0.5)]",
							"overflow-hidden",
						)}
						onKeyDown={handleKeyDown}
					>
						{/* Search Input */}
						<div className="flex items-center gap-3 px-4 py-3 border-b border-border">
							<Search
								size={16}
								className="text-text-muted shrink-0"
								aria-hidden
							/>
							<input
								ref={inputRef}
								type="text"
								placeholder="חפש עמוד..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
								dir="rtl"
							/>
							{query && (
								<button
									type="button"
									onClick={() => setQuery("")}
									aria-label="נקה חיפוש"
									className="text-text-muted hover:text-text-secondary"
								>
									<X size={14} aria-hidden="true" />
								</button>
							)}
							<kbd className="hidden sm:flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-text-muted border border-border bg-bg-primary">
								ESC
							</kbd>
						</div>

						{/* Results */}
						<div className="max-h-[50dvh] overflow-y-auto py-2">
							{/* Recent pages */}
							{recentRoutes.length > 0 && !query.trim() && (
								<div className="mb-2">
									<div className="flex items-center gap-2 px-4 py-1">
										<Clock size={11} className="text-text-muted" />
										<span className="text-[11px] font-medium text-text-muted">
											אחרונים
										</span>
									</div>
									{recentRoutes.map((route) => {
										const cat = CATEGORY_MAP[route.category];
										return (
											<button
												key={`recent-${route.id}`}
												type="button"
												onClick={() => handleSelect(route)}
												className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-tertiary transition-colors text-start"
											>
												<span
													className="size-2 rounded-full shrink-0"
													style={{ background: cat?.color }}
												/>
												<span className="text-sm text-text-primary truncate">
													{route.title}
												</span>
												<span className="text-xs text-text-muted ms-auto shrink-0">
													{cat?.label}
												</span>
											</button>
										);
									})}
									<div className="mx-4 my-1.5 border-t border-border" />
								</div>
							)}

							{/* Grouped results */}
							{grouped.map((group) => (
								<div key={group.category} className="mb-1">
									<div className="px-4 py-1">
										<span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
											{group.label}
										</span>
									</div>
									{group.routes.map((route) => {
										flatIdx++;
										const isSelected = flatIdx === selectedIdx;
										const cat = CATEGORY_MAP[route.category];
										const Icon = route.icon;
										return (
											<button
												key={route.id}
												type="button"
												onClick={() => handleSelect(route)}
												data-selected={isSelected || undefined}
												className={cn(
													"w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-start",
													isSelected
														? "bg-accent-blue/10 text-accent-blue"
														: "hover:bg-bg-tertiary text-text-secondary",
												)}
											>
												<Icon
													size={16}
													className="shrink-0"
													style={{
														color: isSelected
															? "var(--color-accent-blue)"
															: cat?.color,
													}}
												/>
												<div className="min-w-0 flex-1">
													<span className="text-sm font-medium text-text-primary block truncate">
														{route.title}
													</span>
													<span className="text-xs text-text-muted block truncate">
														{route.description}
													</span>
												</div>
											</button>
										);
									})}
								</div>
							))}

							{flatResults.length === 0 && (
								<div className="py-8 text-center">
									<p className="text-sm text-text-muted">
										לא נמצאו תוצאות עבור "{query}"
									</p>
								</div>
							)}
						</div>

						{/* Footer */}
						<div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-bg-primary/50">
							<span className="text-[10px] text-text-muted flex items-center gap-1">
								<kbd className="px-1 py-0.5 rounded border border-border bg-bg-primary font-mono">
									↑↓
								</kbd>
								ניווט
							</span>
							<span className="text-[10px] text-text-muted flex items-center gap-1">
								<kbd className="px-1 py-0.5 rounded border border-border bg-bg-primary font-mono">
									↵
								</kbd>
								בחירה
							</span>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
