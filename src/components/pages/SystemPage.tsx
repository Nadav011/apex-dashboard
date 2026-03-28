import {
	Activity,
	Clock,
	Cpu,
	Database,
	HardDrive,
	MemoryStick,
	Monitor,
	RefreshCw,
	Server,
	Wifi,
	WifiOff,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
	useLenovoStatus,
	useMcp,
	useSyncStatus,
	useSystem,
} from "@/hooks/use-api";
import { cn } from "@/lib/cn";

// ── Circular gauge ─────────────────────────────────────────────────────
interface GaugeProps {
	label: string;
	value: number;
	max?: number;
	unit?: string;
	color: string;
	icon: React.ReactNode;
	detail?: string;
}

function Gauge({ label, value, color, icon, detail, unit = "%" }: GaugeProps) {
	const clamped = Math.min(100, Math.max(0, value));
	const radius = 44;
	const circumference = 2 * Math.PI * radius;
	const dashOffset = circumference - (clamped / 100) * circumference;

	const colorClass =
		clamped >= 90
			? "stroke-[oklch(0.62_0.22_25)]"
			: clamped >= 75
				? "stroke-[oklch(0.78_0.16_75)]"
				: `stroke-[${color}]`;

	return (
		<div className="glass-card flex flex-col items-center gap-3 p-5">
			<div className="relative w-28 h-28 flex items-center justify-center">
				<svg
					className="absolute inset-0 w-full h-full -rotate-90"
					viewBox="0 0 100 100"
					aria-hidden="true"
				>
					{/* Background ring */}
					<circle
						cx="50"
						cy="50"
						r={radius}
						fill="none"
						stroke="oklch(0.22 0.02 260)"
						strokeWidth="8"
					/>
					{/* Progress ring */}
					<circle
						cx="50"
						cy="50"
						r={radius}
						fill="none"
						strokeWidth="8"
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={dashOffset}
						className={cn("transition-all duration-700", colorClass)}
						style={{ stroke: color }}
					/>
				</svg>
				{/* Center content */}
				<div className="relative flex flex-col items-center justify-center">
					<span className="text-2xl font-bold tabular-nums" style={{ color }}>
						{Math.round(clamped)}
						<span className="text-sm font-normal text-text-muted">{unit}</span>
					</span>
				</div>
			</div>

			<div className="flex flex-col items-center gap-1 text-center">
				<div className="flex items-center gap-1.5 text-text-secondary">
					<span
						className="w-4 h-4 flex items-center justify-center"
						aria-hidden="true"
					>
						{icon}
					</span>
					<span className="text-sm font-medium">{label}</span>
				</div>
				{detail && <span className="text-xs text-text-muted">{detail}</span>}
			</div>
		</div>
	);
}

// ── Info row ────────────────────────────────────────────────────────────
function InfoRow({
	label,
	value,
	mono = false,
}: {
	label: string;
	value: string;
	mono?: boolean;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
			<span className="text-sm text-text-muted shrink-0">{label}</span>
			<span
				className={cn(
					"text-sm text-text-primary text-start truncate",
					mono && "font-mono text-xs",
				)}
			>
				{value}
			</span>
		</div>
	);
}

// ── Section card ────────────────────────────────────────────────────────
function SectionCard({
	title,
	icon,
	children,
	className,
}: {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("glass-card p-5", className)}>
			<div className="flex items-center gap-2 mb-4">
				<span className="text-accent-blue" aria-hidden="true">
					{icon}
				</span>
				<h2 className="text-sm font-semibold text-text-primary">{title}</h2>
			</div>
			{children}
		</div>
	);
}

// ── MCP Server item ─────────────────────────────────────────────────────
function McpServerRow({ name, enabled }: { name: string; enabled: boolean }) {
	return (
		<div className="flex items-center justify-between gap-3 py-1.5">
			<div className="flex items-center gap-2 min-w-0">
				<span
					className={cn(
						"w-2 h-2 rounded-full shrink-0",
						enabled
							? "bg-[oklch(0.72_0.19_155)] animate-pulse-status"
							: "bg-[oklch(0.55_0.02_260)]",
					)}
					aria-hidden="true"
				/>
				<span className="text-sm text-text-secondary truncate font-mono">
					{name}
				</span>
			</div>
			<StatusBadge status={enabled ? "healthy" : "degraded"} size="sm" />
		</div>
	);
}

// ── Main page ───────────────────────────────────────────────────────────
export function SystemPage() {
	const { data: sys, isLoading: sysLoading, error: sysError } = useSystem();
	const { data: mcp } = useMcp();
	const { data: sync } = useSyncStatus();
	const { data: lenovo } = useLenovoStatus();

	if (sysLoading || !sys) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex items-center gap-3 text-text-muted">
					<RefreshCw size={18} className="animate-spin" />
					<span>טוען נתוני מערכת...</span>
				</div>
			</div>
		);
	}

	if (sysError)
		return (
			<div className="p-8 text-center text-[var(--color-accent-red)]">
				שגיאה בטעינת נתונים
			</div>
		);

	const swapPercent = sys.swap.pct;

	const formatTimestamp = (ts?: string) => {
		if (!ts) return "—";
		try {
			return new Date(ts).toLocaleString("he-IL", {
				dateStyle: "short",
				timeStyle: "medium",
			});
		} catch {
			return ts;
		}
	};

	return (
		<div className="space-y-6" dir="rtl">
			{/* Header */}
			<div>
				<h1 className="text-xl font-bold text-text-primary">מערכת</h1>
				<p className="text-sm text-text-muted mt-0.5">
					ניטור משאבי המערכת בזמן אמת
				</p>
			</div>

			{/* Resource gauges */}
			<section aria-label="מדדי משאבים">
				<h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
					ניצול משאבים
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<Gauge
						label="זיכרון RAM"
						value={sys.ram.pct}
						color="oklch(0.72 0.19 155)"
						icon={<MemoryStick size={14} />}
						detail={`${sys.ram.used_gb.toFixed(1)} / ${sys.ram.total_gb.toFixed(0)} GB`}
					/>
					<Gauge
						label="דיסק"
						value={sys.disk.pct}
						color="oklch(0.78 0.16 75)"
						icon={<HardDrive size={14} />}
						detail={`${sys.disk.used_gb.toFixed(0)} / ${sys.disk.total_gb.toFixed(0)} GB`}
					/>
					<Gauge
						label="Swap"
						value={swapPercent}
						color="oklch(0.62 0.2 290)"
						icon={<Database size={14} />}
						detail={`${sys.swap.used_gb.toFixed(1)} / ${sys.swap.total_gb.toFixed(0)} GB`}
					/>
					<Gauge
						label="תהליכים עזובים"
						value={Math.min(100, (sys.orphan_count / 100) * 100)}
						color="oklch(0.65 0.18 250)"
						icon={<Cpu size={14} />}
						detail={`${sys.orphan_count} orphans`}
					/>
				</div>
			</section>

			{/* Details grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{/* Machine info */}
				<SectionCard title="פרטי מחשב" icon={<Monitor size={16} />}>
					<div className="space-y-0">
						<InfoRow
							label="זיכרון כולל"
							value={`${sys.ram.total_gb.toFixed(0)} GB`}
						/>
						<InfoRow
							label="זיכרון פנוי"
							value={`${sys.ram.free_gb.toFixed(1)} GB`}
						/>
						<InfoRow label="earlyoom" value={sys.earlyoom} />
						<InfoRow label="תהליכים עזובים" value={String(sys.orphan_count)} />
					</div>
				</SectionCard>

				{/* Uptime + sync */}
				<SectionCard title="זמן פעולה וסנכרון" icon={<Clock size={16} />}>
					<div className="space-y-0">
						<InfoRow label="זמן פעולה" value={sys.uptime} />
						<InfoRow label="מצב סנכרון" value={sync?.status ?? "—"} />
						<InfoRow
							label="דחיפה אחרונה"
							value={formatTimestamp(sync?.last_push)}
						/>
						<InfoRow
							label="משיכה אחרונה"
							value={formatTimestamp(sync?.last_pull)}
						/>
					</div>
				</SectionCard>

				{/* Lenovo status */}
				<SectionCard title="מחשב Lenovo" icon={<Server size={16} />}>
					<div className="flex items-center gap-3 mb-3">
						{lenovo?.reachable ? (
							<>
								<Wifi
									size={18}
									className="text-[oklch(0.72_0.19_155)]"
									aria-hidden="true"
								/>
								<StatusBadge status="healthy" size="sm" />
							</>
						) : (
							<>
								<WifiOff
									size={18}
									className="text-[oklch(0.62_0.22_25)]"
									aria-hidden="true"
								/>
								<StatusBadge status="critical" size="sm" />
							</>
						)}
					</div>
					{lenovo?.reachable ? (
						<div className="space-y-0">
							<InfoRow label="שם מארח" value={lenovo.hostname ?? "—"} mono />
							{lenovo.load_avg && (
								<InfoRow
									label="עומס (1/5/15)"
									value={lenovo.load_avg.map((v) => v.toFixed(2)).join(" / ")}
									mono
								/>
							)}
						</div>
					) : (
						<p className="text-sm text-text-muted">
							המחשב אינו מגיב ב-Tailscale
						</p>
					)}
				</SectionCard>
			</div>

			{/* MCP servers */}
			{mcp && (
				<SectionCard
					title={`שרתי MCP — ${mcp.enabled}/${mcp.total} פעילים`}
					icon={<Activity size={16} />}
					className=""
				>
					{mcp.servers.length === 0 ? (
						<p className="text-sm text-text-muted">אין שרתי MCP רשומים</p>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
							{mcp.servers.map((server) => (
								<McpServerRow
									key={server.name}
									name={server.name}
									enabled={server.enabled}
								/>
							))}
						</div>
					)}
				</SectionCard>
			)}
		</div>
	);
}
