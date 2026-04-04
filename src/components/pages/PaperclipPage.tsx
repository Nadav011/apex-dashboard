import {
	Bot,
	Building2,
	CheckCircle2,
	DollarSign,
	Network,
	Users,
	XCircle,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/cn";

interface PaperclipAgent {
	name: string;
	role: string;
	status: string;
}

interface PaperclipData {
	running: boolean;
	version: string | null;
	company: { name: string; budgetMonthlyCents: number; status: string } | null;
	agents: PaperclipAgent[];
	agent_count: number;
}

const STATUS_COLORS: Record<string, string> = {
	idle: "bg-green-500/10 text-green-400 border-green-500/20",
	running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
	error: "bg-red-500/10 text-red-400 border-red-500/20",
	offline: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const STATUS_HE: Record<string, string> = {
	idle: "מוכן",
	running: "פעיל",
	error: "שגיאה",
	offline: "לא מחובר",
};

const ROLE_HE: Record<string, string> = {
	ceo: 'מנכ"ל',
	engineer: "מהנדס",
	designer: "מעצב",
	qa: "QA",
};

// Fetch from Dashboard API
async function fetchPaperclip(): Promise<PaperclipData> {
	try {
		const API =
			typeof window !== "undefined" && window.location.hostname === "localhost"
				? "/api"
				: "https://api.nadavc.ai/api";
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 2000);
		const res = await fetch(`${API}/paperclip`, { signal: ctrl.signal });
		clearTimeout(timer);
		if (!res.ok) throw new Error("fail");
		return res.json();
	} catch {
		return {
			running: false,
			version: null,
			company: null,
			agents: [],
			agent_count: 0,
		};
	}
}

import { useQuery } from "@tanstack/react-query";

export function PaperclipPage() {
	const { data } = useQuery({
		queryKey: ["paperclip"],
		queryFn: fetchPaperclip,
		refetchInterval: 5_000,
	});

	const pc = data ?? {
		running: false,
		version: null,
		company: null,
		agents: [],
		agent_count: 0,
	};
	const budget = pc.company
		? Math.round(pc.company.budgetMonthlyCents / 100)
		: 0;
	const idleCount = pc.agents.filter((a) => a.status === "idle").length;
	const errorCount = pc.agents.filter((a) => a.status === "error").length;

	return (
		<div dir="rtl" className="space-y-6">
			<PageHeader
				icon={Building2}
				title="Paperclip — חברה וירטואלית"
				description="ניהול סוכנים כחברת סטארטאפ — CEO, מהנדסים, תקציב, משימות"
			/>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-grid">
				<StatCard label="סוכנים" value={pc.agent_count} icon={Users} />
				<StatCard label="מוכנים" value={idleCount} icon={CheckCircle2} />
				<StatCard label="שגיאות" value={errorCount} icon={XCircle} />
				<StatCard label="תקציב חודשי" value={`$${budget}`} icon={DollarSign} />
			</div>

			{/* Server Status */}
			<GlassCard title="שרת Paperclip" icon={<Network size={16} />}>
				<div className="space-y-2 text-sm">
					<div className="flex items-center justify-between">
						<span className="text-text-muted">סטטוס</span>
						<Badge
							variant="default"
							className={cn(
								"text-xs border",
								pc.running ? STATUS_COLORS.idle : STATUS_COLORS.error,
							)}
						>
							{pc.running ? "פעיל" : "כבוי"}
						</Badge>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-text-muted">גרסה</span>
						<span className="text-text-secondary font-mono" dir="ltr">
							{pc.version ?? "—"}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-text-muted">חברה</span>
						<span className="text-text-primary font-medium">
							{pc.company?.name ?? "—"}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-text-muted">כתובת</span>
						<span className="text-text-secondary font-mono text-xs" dir="ltr">
							http://127.0.0.1:3100
						</span>
					</div>
				</div>
			</GlassCard>

			{/* Agents */}
			<GlassCard
				title="צי סוכנים"
				subtitle={`${pc.agent_count} סוכנים רשומים`}
				icon={<Bot size={16} />}
			>
				<div className="space-y-2">
					{pc.agents.map((agent) => (
						<div
							key={agent.name}
							className={cn(
								"flex items-center justify-between p-3 rounded-lg",
								"bg-bg-elevated/50 border border-border/40",
								agent.status === "error" && "border-red-500/30",
							)}
						>
							<div className="flex items-center gap-3">
								{agent.role === "ceo" ? (
									<Building2 size={16} className="text-accent-amber shrink-0" />
								) : (
									<Bot size={16} className="text-accent-blue shrink-0" />
								)}
								<div>
									<div className="text-sm font-medium text-text-primary">
										{agent.name}
									</div>
									<div className="text-xs text-text-muted">
										{ROLE_HE[agent.role] ?? agent.role}
									</div>
								</div>
							</div>
							<Badge
								variant="default"
								className={cn(
									"text-xs border",
									STATUS_COLORS[agent.status] ?? STATUS_COLORS.offline,
								)}
							>
								{STATUS_HE[agent.status] ?? agent.status}
							</Badge>
						</div>
					))}
				</div>
			</GlassCard>

			{/* How it connects to APEX */}
			<GlassCard title="חיבור ל-APEX Hydra" icon={<Zap size={16} />}>
				<div className="space-y-3 text-sm text-text-secondary">
					<p>
						<strong className="text-text-primary">Paperclip</strong> מנהל את
						הסוכנים כחברה — CEO מתכנן, מהנדסים מבצעים.
					</p>
					<p>
						<strong className="text-text-primary">Hydra v3</strong> מנתב משימות
						לספק הנכון — Gemini למחקר, Codex למימוש, MiniMax לבדיקות.
					</p>
					<p>
						<strong className="text-text-primary">ביחד:</strong> Paperclip מחליט{" "}
						<em>מה</em> לעשות, Hydra מחליט <em>איך</em> ו<em>מי</em>.
					</p>
				</div>
			</GlassCard>
		</div>
	);
}
