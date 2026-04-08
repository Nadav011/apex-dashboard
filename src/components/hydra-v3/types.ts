export type AgentHeartbeatStatus =
	| "online"
	| "busy"
	| "degraded"
	| "offline"
	| "error";

export type BudgetHealth = "healthy" | "warning" | "critical";

export type WaveStatus = "queued" | "running" | "completed" | "failed";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type BoardActionTone = "primary" | "success" | "warning" | "danger";

export interface AgentHeartbeat {
	id: string;
	name: string;
	provider: string;
	status: AgentHeartbeatStatus;
	lastSeenAt: string;
	summary?: string;
	activeTaskId?: string;
	cpuPercent?: number;
	memoryMb?: number;
	uptimeLabel?: string;
}

export interface BudgetStatus {
	limitUsd: number;
	usedUsd: number;
	remainingUsd: number;
	updatedAt: string;
	status: BudgetHealth;
	currency?: string;
	burnRateUsdPerHour?: number;
}

export interface WaveEntry {
	id: string;
	wave: number;
	title: string;
	status: WaveStatus;
	agentCount: number;
	taskCount: number;
	provider?: string;
	startedAt?: string;
	endedAt?: string;
	summary?: string;
}

export interface ApprovalRequest {
	id: string;
	title: string;
	requester: string;
	scope: string;
	requestedAt: string;
	status: ApprovalStatus;
	summary?: string;
	actions?: BoardAction[];
}

export interface BoardAction {
	id: string;
	label: string;
	onClick: () => void;
	description?: string;
	tone?: BoardActionTone;
	disabled?: boolean;
	pending?: boolean;
}
