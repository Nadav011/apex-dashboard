import {
	Activity,
	Bot,
	Building2,
	CheckCircle2,
	DollarSign,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { AgentProfileCard } from "@/components/company/AgentProfileCard";
import { BudgetIncidentCard } from "@/components/company/BudgetIncidentCard";
import { ClaudeSessionCard } from "@/components/company/ClaudeSessionCard";
import { DepartmentCard } from "@/components/company/DepartmentCard";
import { GoalTree } from "@/components/company/GoalTree";
import { LiveRunIndicator } from "@/components/company/LiveRunIndicator";
import { OrgChartTree } from "@/components/company/OrgChartTree";
import { PaperclipDispatchStatsCard } from "@/components/company/PaperclipDispatchStatsCard";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { usePaperclipCompany } from "@/hooks/use-api";
import { cn } from "@/lib/cn";

const ACTIVITY_TYPE_BADGE: Record<
	string,
	{
		variant: "info" | "success" | "warning" | "purple" | "default";
		label: string;
	}
> = {
	dispatch: { variant: "info", label: "שליחה" },
	watcher: { variant: "default", label: "אירוע" },
	deploy: { variant: "success", label: "פריסה" },
	ci: { variant: "warning", label: "CI" },
	cost: { variant: "purple", label: "עלות" },
};

type ActivityFilter = "הכל" | "שליחה" | "אירוע" | "עלות" | "פריסה" | "CI";

const ACTIVITY_FILTER_TO_TYPE: Record<ActivityFilter, string | null> = {
	הכל: null,
	שליחה: "dispatch",
	אירוע: "watcher",
	עלות: "cost",
	פריסה: "deploy",
	CI: "ci",
};

export function PaperclipPage() {
	const { data, isFetching, isLoading, isError, refetch } =
		usePaperclipCompany();
	const [activityFilter, setActivityFilter] = useState<ActivityFilter>("הכל");

	if (isLoading) {
		return (
			<div dir="rtl" className="space-y-6">
				<PageHeader
					icon={Building2}
					title="APEX — חברה וירטואלית"
					description="טוען נתונים..."
				/>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="glass-card h-24 animate-pulse" />
					))}
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div dir="rtl" className="space-y-6">
				<PageHeader
					icon={Building2}
					title="APEX — חברה וירטואלית"
					description="לא ניתן לטעון את נתוני החברה מה־backend החי"
				/>
				<GlassCard
					title="שגיאה בטעינת החברה הווירטואלית"
					icon={<Building2 size={16} />}
					className="border border-accent-red/30"
				>
					<div className="flex flex-col gap-3 text-sm text-accent-red">
						<p>
							המערכת לא הצליחה למשוך את נתוני החברה מה־API הפעיל, ולכן לא מוצגים
							נתוני fallback מקומיים.
						</p>
						<div>
							<button
								type="button"
								onClick={() => void refetch()}
								disabled={isFetching}
								className="rounded-full border border-accent-blue/40 bg-accent-blue/12 px-4 py-2 text-sm font-medium text-accent-blue transition-colors hover:bg-accent-blue/18 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isFetching ? "טוען מחדש..." : "נסה שוב"}
							</button>
						</div>
					</div>
				</GlassCard>
			</div>
		);
	}

	if (!data) {
		return (
			<div dir="rtl" className="space-y-6">
				<PageHeader
					icon={Building2}
					title="APEX — חברה וירטואלית"
					description="אין נתונים זמינים כרגע"
				/>
				<GlassCard title="אין נתוני חברה" icon={<Building2 size={16} />}>
					<p className="text-sm text-text-muted">
						השרת לא החזיר נתוני Paperclip להצגה.
					</p>
				</GlassCard>
			</div>
		);
	}

	const activeCount = data.agents.filter((a) => a.status === "running").length;
	const totalBudget = data.company.budget_monthly_usd;
	const ds = data.dispatch_stats;
	const filteredActivity =
		activityFilter === "הכל"
			? data.recent_activity
			: data.recent_activity.filter(
					(e) => e.type === ACTIVITY_FILTER_TO_TYPE[activityFilter],
				);

	return (
		<div dir="rtl" className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<PageHeader
					icon={Building2}
					title={`${data.company.name} — חברה וירטואלית`}
					description={data.company.mission}
				/>
				<LiveRunIndicator count={activeCount} />
			</div>

			{/* Company stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-grid">
				<StatCard label="סוכנים" value={data.agent_count} icon={Users} />
				<StatCard label="פעילים" value={activeCount} icon={CheckCircle2} />
				<StatCard label="שיגורים" value={ds?.total_runs ?? 0} icon={Zap} />
				<StatCard
					label="תקציב חודשי"
					value={`$${totalBudget}`}
					icon={DollarSign}
				/>
			</div>

			{/* Dispatch Stats — Paperclip-style run analytics */}
			{ds && <PaperclipDispatchStatsCard stats={ds} />}

			{/* Org Chart */}
			<div>
				<h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
					<Building2 size={16} className="text-accent-blue" />
					מבנה ארגוני
				</h2>
				<OrgChartTree root={data.org_tree} />
			</div>

			{/* Claude Session + Company Info */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<ClaudeSessionCard session={data.claude_session} />
				<GlassCard
					title="פרטי חברה"
					icon={<Building2 size={16} />}
					className="card-alive"
				>
					<div className="space-y-2 text-sm">
						<Row label="שם" value={data.company.name} />
						<Row label="משימה" value={data.company.mission} />
						<Row label="נוסדה" value={data.company.founded} dir="ltr" />
						<Row
							label="סטטוס"
							value={
								data.company.status === "active" ? "פעילה" : data.company.status
							}
						/>
						<Row label="גרסה" value={data.version} dir="ltr" />
					</div>
				</GlassCard>
			</div>

			{/* Departments Grid */}
			<div>
				<h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
					<Users size={16} className="text-accent-blue" />
					מחלקות
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{data.departments.map((dept) => (
						<DepartmentCard
							key={dept.id}
							department={dept}
							agents={data.agents}
						/>
					))}
				</div>
			</div>

			{/* Goals */}
			{data.goals.length > 0 && <GoalTree goals={data.goals} />}

			{/* Pending Approvals */}
			<GlassCard title="אישורים ממתינים" icon={<CheckCircle2 size={16} />}>
				<p className="text-xs text-text-muted text-center py-4">
					אין אישורים ממתינים
				</p>
			</GlassCard>

			{/* Budget */}
			<BudgetIncidentCard
				agents={data.agents}
				totalBudget={totalBudget}
				incidents={data.budget_incidents}
			/>

			{/* Agent Profiles Grid */}
			<div>
				<h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
					<Bot size={16} className="text-accent-blue" />
					כרטיסי סוכנים
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
					{data.agents.map((agent) => (
						<AgentProfileCard key={agent.id} agent={agent} />
					))}
				</div>
			</div>

			{/* Activity Feed */}
			{data.recent_activity.length > 0 && (
				<GlassCard
					title="פעילות אחרונה"
					subtitle={`${filteredActivity.length} אירועים`}
					icon={<Activity size={16} />}
					className="card-alive"
				>
					{/* Filter buttons */}
					<div className="flex gap-2 flex-wrap mb-3">
						{(
							[
								"הכל",
								"שליחה",
								"אירוע",
								"עלות",
								"פריסה",
								"CI",
							] as ActivityFilter[]
						).map((f) => (
							<button
								key={f}
								type="button"
								onClick={() => setActivityFilter(f)}
								className={cn(
									"rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
									activityFilter === f
										? "bg-accent-blue/20 text-accent-blue border border-accent-blue/40"
										: "bg-bg-elevated/40 text-text-muted border border-border/30 hover:text-text-primary",
								)}
							>
								{f}
							</button>
						))}
					</div>
					<div className="space-y-2 max-h-[300px] overflow-y-auto">
						{filteredActivity.length === 0 ? (
							<p className="text-xs text-text-muted text-center py-4">
								אין אירועים מסוג זה
							</p>
						) : (
							filteredActivity.map((event, i) => {
								const badge =
									ACTIVITY_TYPE_BADGE[event.type] ??
									ACTIVITY_TYPE_BADGE.watcher;
								const borderColor =
									event.type === "deploy"
										? "#22c55e"
										: event.type === "cost"
											? "#a855f7"
											: event.type === "ci"
												? "#f59e0b"
												: "#6b7280";
								return (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: stable order
										key={`${event.ts}-${i}`}
										className={cn(
											"flex items-start gap-3 rounded-lg p-2 activity-row-enter",
											"bg-bg-elevated/30 border border-border/20",
											event.type === "dispatch" &&
												"border-s-[3px] border-s-[#3b82f6]",
										)}
										style={
											event.type === "dispatch"
												? undefined
												: {
														borderInlineStartColor: borderColor,
														borderInlineStartWidth: 3,
													}
										}
									>
										<Badge
											variant={badge.variant}
											className="text-[10px] shrink-0 mt-0.5"
										>
											{badge.label}
										</Badge>
										<div className="flex-1 min-w-0">
											<p className="text-xs text-text-primary truncate">
												{event.action}
											</p>
											<p className="text-[10px] text-text-muted">
												{event.agent}
											</p>
										</div>
										<span
											className="text-[10px] text-text-muted font-mono shrink-0"
											dir="ltr"
										>
											{event.ts
												? new Date(event.ts).toLocaleTimeString("he-IL", {
														hour: "2-digit",
														minute: "2-digit",
													})
												: "—"}
										</span>
									</div>
								);
							})
						)}
					</div>
				</GlassCard>
			)}
		</div>
	);
}

function Row({
	label,
	value,
	dir,
}: {
	label: string;
	value: string;
	dir?: string;
}) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-text-muted">{label}</span>
			<span className="text-text-primary font-medium" dir={dir}>
				{value}
			</span>
		</div>
	);
}
