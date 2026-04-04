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
					{[
						{
							time: "14:30:15",
							icon: <CheckCircle2 size={14} className="text-status-healthy" />,
							text: 'משימה auth-schema הושלמה בהצלחה ע"י codex',
						},
						{
							time: "14:28:10",
							icon: <RefreshCw size={14} className="text-accent-blue" />,
							text: "התחלת ביצוע auth-schema — codex (Wave 1)",
						},
						{
							time: "14:25:00",
							icon: <CheckCircle2 size={14} className="text-status-healthy" />,
							text: 'משימה auth-research הושלמה בהצלחה ע"י gemini',
						},
						{
							time: "14:20:00",
							icon: <Zap size={14} className="text-accent-amber" />,
							text: "פירוק אוטומטי: 4 משימות, 3 waves — complexity score: 0.72",
						},
					].map((ev, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: stable mock list
							key={i}
							className="flex items-center gap-3 text-sm py-1.5"
						>
							<span
								className="text-text-muted font-mono text-xs tabular-nums shrink-0"
								dir="ltr"
							>
								{ev.time}
							</span>
							<span className="shrink-0" aria-hidden="true">
								{ev.icon}
							</span>
							<span className="text-text-secondary">{ev.text}</span>
						</div>
					))}
				</div>
			</GlassCard>

			{/* Empty state when no teams */}
			{teams.length === 0 && (
				<div className="glass-card p-12 text-center flex flex-col items-center gap-4">
					<Network size={40} className="text-text-muted" aria-hidden="true" />
					<p className="text-sm text-text-muted">
						אין צוותים פעילים — הרץ שיגור עם team: true בפרונטמטר
					</p>
				</div>
			)}
		</div>
	);
}
