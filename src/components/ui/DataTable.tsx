import { ChevronDown, ChevronsUpDown, ChevronUp, Inbox } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

type SortDir = "asc" | "desc" | null;

export interface Column<T> {
	key: keyof T & string;
	label: string;
	render?: (value: T[keyof T], row: T) => React.ReactNode;
	sortable?: boolean;
	align?: "start" | "end" | "center";
}

interface DataTableProps<T extends Record<string, unknown>> {
	columns: Column<T>[];
	data: T[];
	emptyMessage?: string;
	className?: string;
}

function SortIcon({ dir }: { dir: SortDir }) {
	if (dir === "asc")
		return <ChevronUp size={13} aria-hidden="true" className="shrink-0" />;
	if (dir === "desc")
		return <ChevronDown size={13} aria-hidden="true" className="shrink-0" />;
	return (
		<ChevronsUpDown
			size={13}
			aria-hidden="true"
			className="shrink-0 opacity-40"
		/>
	);
}

export function DataTable<T extends Record<string, unknown>>({
	columns,
	data,
	emptyMessage = "אין נתונים להצגה",
	className,
}: DataTableProps<T>) {
	const [sortKey, setSortKey] = useState<string | null>(null);
	const [sortDir, setSortDir] = useState<SortDir>(null);

	function handleSort(key: string) {
		if (sortKey !== key) {
			setSortKey(key);
			setSortDir("asc");
		} else if (sortDir === "asc") {
			setSortDir("desc");
		} else if (sortDir === "desc") {
			setSortKey(null);
			setSortDir(null);
		} else {
			setSortDir("asc");
		}
	}

	const sorted = [...data].sort((a, b) => {
		if (!sortKey || !sortDir) return 0;
		const av = a[sortKey];
		const bv = b[sortKey];
		if (av === bv) return 0;
		const cmp =
			typeof av === "number" && typeof bv === "number"
				? av - bv
				: String(av).localeCompare(String(bv), "he");
		return sortDir === "asc" ? cmp : -cmp;
	});

	const alignClass = (align: Column<T>["align"]) => {
		if (align === "end") return "text-end";
		if (align === "center") return "text-center";
		return "text-start";
	};

	return (
		<div className={cn("glass-card overflow-hidden", className)}>
			<div className="overflow-x-auto">
				<table className="w-full min-w-0 border-collapse text-sm">
					<thead>
						<tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
							{columns.map((col) => (
								<th
									key={col.key}
									scope="col"
									className={cn(
										"px-4 py-3 font-semibold text-[var(--color-text-secondary)]",
										alignClass(col.align),
										col.sortable &&
											"cursor-pointer select-none hover:text-[var(--color-text-primary)]",
									)}
									onClick={col.sortable ? () => handleSort(col.key) : undefined}
								>
									<span className="inline-flex items-center gap-1">
										{col.label}
										{col.sortable && (
											<SortIcon dir={sortKey === col.key ? sortDir : null} />
										)}
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sorted.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className="py-12 text-center text-[var(--color-text-muted)]"
								>
									<Inbox
										size={32}
										strokeWidth={1.25}
										className="mx-auto mb-2 opacity-40"
										aria-hidden="true"
									/>
									<p>{emptyMessage}</p>
								</td>
							</tr>
						) : (
							sorted.map((row, rowIdx) => (
								<tr
									key={String(row[columns[0]?.key ?? ""] ?? rowIdx)}
									className={cn(
										"border-b border-[var(--color-border)] transition-colors duration-100",
										"last:border-b-0",
										rowIdx % 2 === 0
											? "bg-transparent"
											: "bg-[var(--color-bg-secondary)]",
										"hover:bg-[var(--color-bg-elevated)]",
									)}
								>
									{columns.map((col) => (
										<td
											key={col.key}
											className={cn(
												"px-4 py-3 text-[var(--color-text-primary)]",
												alignClass(col.align),
											)}
										>
											{col.render
												? col.render(row[col.key], row)
												: String(row[col.key] ?? "")}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
