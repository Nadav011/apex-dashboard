import { Users } from "lucide-react";
import type { PaperclipAgent, PaperclipDepartment } from "@/lib/api";
import { AgentProfileCard } from "./AgentProfileCard";

interface DepartmentCardProps {
	department: PaperclipDepartment;
	agents: PaperclipAgent[];
}

export function DepartmentCard({ department, agents }: DepartmentCardProps) {
	const deptAgents = agents.filter((a) => department.agents.includes(a.id));
	const activeCount = deptAgents.filter((a) => a.status === "running").length;

	return (
		<div className="glass-card card-alive overflow-hidden">
			{/* Department header with color strip */}
			<div
				className="flex items-center gap-3 px-4 py-3 border-b border-border/40"
				style={{
					borderTopColor: department.color,
					borderTopWidth: 3,
					borderTopStyle: "solid",
				}}
			>
				<span
					className="flex size-8 items-center justify-center rounded-lg bg-bg-elevated"
					style={{ color: department.color }}
				>
					<Users size={16} />
				</span>
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-semibold text-text-primary">
						{department.name}
					</h3>
					<p className="text-xs text-text-muted">
						{department.name_en} · {deptAgents.length} סוכנים · {activeCount}{" "}
						פעילים
					</p>
				</div>
			</div>

			{/* Agent list */}
			<div className="p-3 space-y-1.5">
				{deptAgents.map((agent) => (
					<AgentProfileCard key={agent.id} agent={agent} compact />
				))}
			</div>
		</div>
	);
}
