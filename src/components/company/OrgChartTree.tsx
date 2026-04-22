import {
	Bot,
	Building2,
	Crown,
	FlaskConical,
	Paintbrush,
	Shield,
	User,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { PaperclipOrgNode } from "@/lib/api";
import { cn } from "@/lib/cn";

const ROLE_ICON: Record<string, typeof Bot> = {
	board: User,
	ceo: Crown,
	engineer: Bot,
	designer: Paintbrush,
	researcher: FlaskConical,
	qa: Shield,
	ops: Building2,
};

const STATUS_DOT: Record<string, string> = {
	active: "bg-green-500",
	running: "bg-cyan-400 animate-pulse",
	idle: "bg-blue-500",
	error: "bg-red-400",
	offline: "bg-gray-500",
};

// ── Layout constants ────────────────────────────────────────────────────────
const NODE_W = 200;
const NODE_H = 90;
const GAP_X = 32;
const GAP_Y = 80;
const PADDING = 60;

// ── Tree layout ─────────────────────────────────────────────────────────────

interface LayoutNode {
	node: PaperclipOrgNode;
	x: number;
	y: number;
	children: LayoutNode[];
}

function subtreeWidth(node: PaperclipOrgNode): number {
	if (!node.reports || node.reports.length === 0) return NODE_W;
	const childrenWidth = node.reports.reduce(
		(sum, child) => sum + subtreeWidth(child) + GAP_X,
		-GAP_X,
	);
	return Math.max(NODE_W, childrenWidth);
}

function layoutTree(node: PaperclipOrgNode, x: number, y: number): LayoutNode {
	const children: LayoutNode[] = [];
	if (node.reports && node.reports.length > 0) {
		const totalW = node.reports.reduce(
			(sum, child) => sum + subtreeWidth(child) + GAP_X,
			-GAP_X,
		);
		let cx = x - totalW / 2;
		for (const child of node.reports) {
			const cw = subtreeWidth(child);
			children.push(layoutTree(child, cx + cw / 2, y + NODE_H + GAP_Y));
			cx += cw + GAP_X;
		}
	}
	return { node, x, y, children };
}

function flattenLayout(root: LayoutNode): LayoutNode[] {
	const result: LayoutNode[] = [root];
	for (const child of root.children) {
		result.push(...flattenLayout(child));
	}
	return result;
}

interface Edge {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

function collectEdges(root: LayoutNode): Edge[] {
	const edges: Edge[] = [];
	for (const child of root.children) {
		edges.push({
			x1: root.x + NODE_W / 2,
			y1: root.y + NODE_H,
			x2: child.x + NODE_W / 2,
			y2: child.y,
		});
		edges.push(...collectEdges(child));
	}
	return edges;
}

// ── Component ───────────────────────────────────────────────────────────────

interface OrgChartTreeProps {
	root: PaperclipOrgNode;
}

export function OrgChartTree({ root }: OrgChartTreeProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [scale, setScale] = useState(1);
	const [isPanning, setIsPanning] = useState(false);
	const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
	const [hoveredNode, setHoveredNode] = useState<string | null>(null);

	const layoutRoot = useMemo(() => {
		const totalW = subtreeWidth(root);
		return layoutTree(root, totalW / 2, PADDING);
	}, [root]);

	const allNodes = useMemo(() => flattenLayout(layoutRoot), [layoutRoot]);
	const edges = useMemo(() => collectEdges(layoutRoot), [layoutRoot]);

	// Compute SVG viewport
	const allX = allNodes.map((n) => n.x);
	const allY = allNodes.map((n) => n.y);
	const minX = Math.min(...allX) - PADDING;
	const maxX = Math.max(...allX) + NODE_W + PADDING;
	const minY = Math.min(...allY) - PADDING;
	const maxY = Math.max(...allY) + NODE_H + PADDING;
	const svgW = maxX - minX;
	const svgH = maxY - minY;

	// Pan handlers
	const onMouseDown = useCallback(
		(e: React.MouseEvent) => {
			setIsPanning(true);
			panStart.current = {
				x: e.clientX,
				y: e.clientY,
				ox: offset.x,
				oy: offset.y,
			};
		},
		[offset],
	);

	const onMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isPanning) return;
			setOffset({
				x: panStart.current.ox + (e.clientX - panStart.current.x),
				y: panStart.current.oy + (e.clientY - panStart.current.y),
			});
		},
		[isPanning],
	);

	const onMouseUp = useCallback(() => setIsPanning(false), []);

	const onWheel = useCallback((e: React.WheelEvent) => {
		e.preventDefault();
		setScale((s) => Math.max(0.3, Math.min(2, s - e.deltaY * 0.001)));
	}, []);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: pan/zoom canvas requires mouse events
		<div
			ref={containerRef}
			role="application"
			aria-label="Org chart — drag to pan, scroll to zoom"
			className="relative overflow-hidden rounded-xl border border-border/40 bg-bg-primary/50"
			style={{
				height: Math.min(svgH * scale + 40, 500),
				cursor: isPanning ? "grabbing" : "grab",
			}}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
			onMouseLeave={onMouseUp}
			onWheel={onWheel}
		>
			<div
				style={{
					transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
					transformOrigin: "center top",
					width: svgW,
					height: svgH,
					position: "relative",
				}}
			>
				{/* SVG edges */}
				<svg
					className="absolute inset-0 pointer-events-none"
					width={svgW}
					height={svgH}
					viewBox={`${minX} ${minY} ${svgW} ${svgH}`}
					aria-hidden="true"
				>
					<title>Org chart edges</title>
					{edges.map((edge, i) => {
						const midY = (edge.y1 + edge.y2) / 2;
						return (
							<path
								// biome-ignore lint/suspicious/noArrayIndexKey: stable layout
								key={i}
								d={`M ${edge.x1} ${edge.y1} C ${edge.x1} ${midY}, ${edge.x2} ${midY}, ${edge.x2} ${edge.y2}`}
								fill="none"
								stroke="oklch(0.45 0.02 260)"
								strokeWidth={1.5}
								className="transition-all duration-300"
							/>
						);
					})}
				</svg>

				{/* Node cards */}
				{allNodes.map((layoutNode) => {
					const { node, x, y } = layoutNode;
					const Icon = ROLE_ICON[node.role] ?? Bot;
					const isHovered = hoveredNode === node.id;

					return (
						// biome-ignore lint/a11y/noStaticElementInteractions: hover-only visual highlight, not keyboard action
						<div
							key={node.id}
							className={cn(
								"absolute rounded-xl border bg-bg-elevated/80 backdrop-blur-sm p-3",
								"transition-all duration-200 select-none",
								isHovered
									? "border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-[1.03] z-10"
									: "border-border/40",
							)}
							style={{
								insetInlineStart: x - minX, // rtl-ok
								top: y - minY,
								width: NODE_W,
								height: NODE_H,
							}}
							onMouseEnter={() => setHoveredNode(node.id)}
							onMouseLeave={() => setHoveredNode(null)}
						>
							<div className="flex items-center gap-2 h-full">
								<div className="flex size-9 items-center justify-center rounded-lg bg-bg-primary/60 shrink-0">
									<Icon size={18} className="text-accent-blue" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-1.5">
										<span
											className={cn(
												"size-2.5 rounded-full shrink-0",
												STATUS_DOT[node.status] ?? "bg-gray-500",
											)}
										/>
										<span className="text-xs font-semibold text-text-primary truncate">
											{node.name}
										</span>
									</div>
									<p className="text-[10px] text-text-muted truncate mt-0.5">
										{node.title ?? node.role}
									</p>
									{node.department && (
										<p className="text-[10px] text-accent-blue/70 truncate">
											{node.department}
										</p>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
