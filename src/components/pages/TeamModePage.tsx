import {
	Bot,
	CheckCircle2,
	Clock,
	Network,
	RefreshCw,
	XCircle,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useTeamStatus } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

// Mock data until API is connected
const MOCK_TEAMS = [
	{
		task_id: "auth-jwt-rls",
		total_subtasks: 4,
		completed_subtasks: 2,
		status: "in_progress",
		subtasks: [
			{
				id: "auth-research",
				role: "research",
				title: "Research JWT patterns",
				provider_hint: "gemini",
				depends_on: [] as string[],
				status: "completed",
			},
			{
				id: "auth-schema",
				role: "plan",
				title: "Design auth schema",
				provider_hint: "codex",
				depends_on: ["auth-research"],
				status: "completed",
			},
			{
				id: "auth-impl",
				role: "implement",
				title: "Implement JWT middleware",
				provider_hint: "codex",
				depends_on: ["auth-schema"],
				status: "in_progress",
			},
			{
				id: "auth-tests",
				role: "test",
				title: "Write auth tests",
				provider_hint: "minimax",
				depends_on: ["auth-impl"],
				status: "pending",
			},
		],
	},
];

const ROLE_STYLES: Record<string, string> = {
	research: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
	plan: "bg-blue-500/10 text-blue-400 border-blue-500/20",
	implement: "bg-green-500/10 text-green-400 border-green-500/20",
	test: "bg-purple-500/10 text-purple-400 border-purple-500/20",
	review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
	analyze: "bg-pink-500/10 text-pink-400 border-pink-500/20",
	docs: "bg-gray-500/10 text-gray-400 border-gray-500/20",
	security: "bg-red-500/10 text-red-400 border-red-500/20",
};

const ROLE_LABELS: Record<string, string> = {
	research: "מחקר",
	plan: "תכנון",
	implement: "מימוש",
	test: "בדיקות",
	review: "סקירה",
	analyze: "ניתוח",
	docs: "תיעוד",
	security: "אבטחה",
};

const STATUS_LABELS: Record<string, string> = {
	completed: "הושלם",
	in_progress: "בתהליך",
	pending: "ממתין",
	failed: "נכשל",
};

function StatusIcon({ status }: { status?: string }) {
	switch (status) {
		case "completed":
			return (
				<CheckCircle2 size={16} className="text-status-healthy shrink-0" />
			);
		case "in_progress":
			return (
				<RefreshCw
					size={16}
					className="text-accent-blue shrink-0 animate-spin"
				/>
			);
		case "failed":
			return <XCircle size={16} className="text-status-critical shrink-0" />;
		default:
			return <Clock size={16} className="text-text-muted shrink-0" />;
	}
}

export function TeamModePage() {
	const { data: teamData } = useTeamStatus();
	const teams = teamData?.active_teams?.length
		? teamData.active_teams
		: MOCK_TEAMS;
	const events = (teamData?.recent_events ?? []).slice(-10).reverse();
	const totalSubtasks = teams.reduce((s, t) => s + t.total_subtasks, 0);
	const completedSubtasks = teams.reduce((s, t) => s + t.completed_subtasks, 0);
	const successRate =
		totalSubtasks > 0
			? Math.round((completedSubtasks / totalSubtasks) * 100)
			: 0;

	return (
		<div dir="rtl" className="space-y-6">
			<PageHeader
				icon={Network}
				title="מצב צוות"
				description="ניטור Team Mode — פירוק אוטומטי, DAG execution, quality gates"
			/>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-grid">
				<StatCard label="צוותים פעילים" value={teams.length} icon={Network} />
				<StatCard label="סה״כ משימות" value={totalSubtasks} icon={Bot} />
				<StatCard
					label="הושלמו"
					value={completedSubtasks}
					icon={CheckCircle2}
				/>
				<StatCard label="אחוז הצלחה" value={`${successRate}%`} icon={Zap} />
			</div>

			{/* Active Teams */}
			{teams.map((team) => {
				const pct =
					team.total_subtasks > 0
						? Math.round((team.completed_subtasks / team.total_subtasks) * 100)
						: 0;

				return (
					<GlassCard
						key={team.task_id}
						title={team.task_id}
						subtitle={`${team.completed_subtasks}/${team.total_subtasks} משימות הושלמו`}
						icon={<Network size={16} />}
					>
						{/* Progress bar */}
						<div className="mb-4">
							<div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
								<span>התקדמות</span>
								<span dir="ltr" className="tabular-nums">
									{pct}%
								</span>
							</div>
							<div className="w-full h-2 rounded-full bg-bg-tertiary overflow-hidden">
								<div
									className={cn(
										"h-full rounded-full transition-all duration-500",
										pct === 100 ? "bg-status-healthy" : "bg-accent-blue",
									)}
									style={{ width: `${pct}%` }}
								/>
							</div>
						</div>

						{/* Subtask list */}
						<div className="space-y-2">
							{team.subtasks.map(
								(subtask: {
									id: string;
									role: string;
									title: string;
									provider_hint: string;
									depends_on: string[];
									status?: string;
								}) => (
									<div
										key={subtask.id}
										className={cn(
											"flex items-center justify-between gap-3 p-3 rounded-lg",
											"bg-bg-elevated/50 border border-border/40",
											"transition-colors duration-150",
											subtask.status === "in_progress" &&
												"border-accent-blue/30",
										)}
									>
										<div className="flex items-center gap-3 min-w-0">
											<StatusIcon status={subtask.status} />
											<div className="min-w-0">
												<div className="text-sm font-medium text-text-primary truncate">
													{subtask.title}
												</div>
												<div className="text-xs text-text-muted">
													{STATUS_LABELS[subtask.status ?? "pending"] ??
														subtask.status ??
														"pending"}
													{subtask.depends_on.length > 0 && (
														<span className="text-text-muted/60">
															{" "}
															← {subtask.depends_on.join(", ")}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2 shrink-0">
											<Badge
												variant="default"
												className={cn(
													"text-[10px] border",
													ROLE_STYLES[subtask.role] ??
														"bg-gray-500/10 text-gray-400 border-gray-500/20",
												)}
											>
												{ROLE_LABELS[subtask.role] ?? subtask.role}
											</Badge>
											<Badge
												variant="default"
												className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
											>
												{subtask.provider_hint}
											</Badge>
										</div>
									</div>
								),
							)}
						</div>
					</GlassCard>
				);
			})}

			{/* Event Log */}
			<GlassCard title="יומן אירועים אחרונים" icon={<Clock size={16} />}>
				<div className="space-y-2">
					{events.length > 0 ? (
						events.map((ev: any, i: number) => (
							<div
								key={String(i)}
								className="flex items-center gap-3 text-sm py-1.5"
							>
								<span
									className="text-text-muted font-mono text-xs tabular-nums shrink-0"
									dir="ltr"
								>
									{String(ev.ts ?? "").slice(11, 19)}
								</span>
								<span className="text-text-secondary">
									{String(ev.message ?? JSON.stringify(ev).slice(0, 80))}
								</span>
							</div>
						))
					) : (
						<div className="text-sm text-text-muted text-center py-4">
							אין אירועים אחרונים
						</div>
					)}
				</div>
			</GlassCard>

			{/* Routing Modes */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<GlassCard title="מצבי ניתוב אוטומטי" icon={<Zap size={16} />}>
					<div className="space-y-3">
						{Object.entries(
							(teamData as any)?.routing_modes ?? {
								direct: "תשובה ישירה — סוכן בודד",
								debate: "3 ספקים דנים — שאלות ארכיטקטורה",
								arena: "4 ספקים מתחרים — הערכה",
								team: "פירוק ל-DAG — פיצ'רים מורכבים",
							},
						).map(([mode, desc]) => (
							<div
								key={mode}
								className="flex items-center justify-between p-2 rounded-lg bg-bg-elevated/30"
							>
								<Badge
									variant="default"
									className="text-xs bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
								>
									{mode}
								</Badge>
								<span className="text-xs text-text-secondary">
									{String(desc)}
								</span>
							</div>
						))}
					</div>
				</GlassCard>

				<GlassCard title="ספקים ותפקידים" icon={<Bot size={16} />}>
					<div className="space-y-3">
						{Object.entries(
							(teamData as any)?.provider_roles ?? {
								gemini: "research, security",
								codex: "plan, implement",
								minimax: "test, docs",
								kimi: "analyze",
								claude: "review",
							},
						).map(([prov, roles]) => (
							<div
								key={prov}
								className="flex items-center justify-between p-2 rounded-lg bg-bg-elevated/30"
							>
								<Badge
									variant="default"
									className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
								>
									{prov}
								</Badge>
								<span className="text-xs text-text-muted font-mono">
									{String(roles)}
								</span>
							</div>
						))}
					</div>
				</GlassCard>
			</div>

			{/* Empty state when no teams */}
			{teams.length === 0 && (
				<div className="glass-card p-12 text-center flex flex-col items-center gap-4">
					<Network size={40} className="text-text-muted" aria-hidden="true" />
					<p className="text-sm text-text-muted">
						אין צוותים פעילים — הניתוב האוטומטי יפעיל team mode כשצריך
					</p>
				</div>
			)}
		</div>
	);
}
