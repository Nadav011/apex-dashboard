const API_BASE = "/api";

async function fetchApi<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`);
	if (!res.ok) {
		throw new Error(`API error ${res.status}: ${path}`);
	}
	return res.json() as Promise<T>;
}

async function postApi<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, { method: "POST" });
	if (!res.ok) {
		throw new Error(`API error ${res.status}: ${path}`);
	}
	return res.json() as Promise<T>;
}

// ── GET endpoints ──────────────────────────────────────────────────────────────
export const api = {
	agents: () => fetchApi<AgentInfo[]>("/agents"),
	agentsExternal: () => fetchApi<ExternalAgentsResponse>("/agents/external"),
	hydraTasks: () => fetchApi<HydraTask[]>("/hydra/tasks"),
	hydraScores: () => fetchApi<HydraScoresResponse>("/hydra/scores"),
	hydraWatcher: () => fetchApi<WatcherResponse>("/hydra/watcher"),
	hydraHealth: () => fetchApi<HealthResponse>("/hydra/health"),
	hooks: () => fetchApi<HooksResponse>("/hooks"),
	system: () => fetchApi<SystemResponse>("/system"),
	metrics: () => fetchApi<MetricsResponse>("/metrics"),
	memory: () => fetchApi<MemoryResponse>("/memory"),
	rules: () => fetchApi<RuleInfo[]>("/rules"),
	skills: () => fetchApi<SkillsResponse>("/skills"),
	mcp: () => fetchApi<McpResponse>("/mcp"),
	openclaw: () => fetchApi<OpenclawResponse>("/openclaw"),
	sync: () => fetchApi<SyncResponse>("/sync"),
	msiStatus: () => fetchApi<MsiStatusResponse>("/msi/status"),
	syncStatus: () => fetchApi<SyncStatusResponse>("/sync/status"),
	crossSync: () => fetchApi<CrossSyncResponse>("/cross-sync"),
	watcherAll: () => fetchApi<WatcherResponse>("/watcher/all"),

	// ── POST control actions ───────────────────────────────────────────────────
	startHydra: () => postApi<ControlResponse>("/control/start-hydra"),
	stopHydra: () => postApi<ControlResponse>("/control/stop-hydra"),
	healthCheck: () => postApi<ControlResponse>("/control/health-check"),
	backup: () => postApi<ControlResponse>("/control/backup"),
	cleanOrphans: () => postApi<ControlResponse>("/control/clean-orphans"),
	syncMsi: () => postApi<ControlResponse>("/control/sync-msi"),
} as const;

// ── Response types ─────────────────────────────────────────────────────────────

export interface ControlResponse {
	status: "ok" | "warn" | "error";
	message: string;
	data?: unknown;
}

// /api/agents → AgentInfo[]
export interface AgentInfo {
	name: string;
	description?: string;
	category: string;
	tools: string[];
	file: string;
}

export interface ExternalAgentsResponse {
	providers: Record<string, unknown>;
}

// /api/hydra/tasks → HydraTask[]
export interface HydraTask {
	id: string;
	status: string;
	steps?: number;
	checkpoints?: number;
	display_name?: string;
}

// /api/hydra/scores
export interface HydraProviderScore {
	score: number;
	successes: number;
	failures: number;
	total: number;
	last_updated: string;
}

export interface HydraScoresResponse {
	providers: Record<string, HydraProviderScore>;
	version?: string;
	created_at?: string;
}

// /api/hydra/watcher
export interface WatcherEvent {
	ts: string;
	event: string;
	task_id?: string;
	provider?: string;
	rc?: number;
	message?: string;
}

export interface WatcherResponse {
	events: WatcherEvent[];
}

// /api/hydra/health
export interface HealthCheck {
	name: string;
	ok: boolean;
	message?: string;
	duration_ms?: number;
}

export interface HealthResponse {
	status: string;
	timestamp: string;
	checks: HealthCheck[];
}

// /api/hooks
export interface HookRecent {
	hook: string;
	duration_ms: number;
	ts: string;
}

export interface HooksResponse {
	total: number;
	by_event: Record<string, number>;
	recent: HookRecent[];
}

// /api/system
export interface SystemRam {
	total_gb: number;
	used_gb: number;
	free_gb: number;
	pct: number;
}

export interface SystemSwap {
	total_gb: number;
	used_gb: number;
	pct: number;
}

export interface SystemDisk {
	total_gb: number;
	used_gb: number;
	free_gb: number;
	pct: number;
}

export interface SystemHandoffs {
	pending: number;
	"in-progress": number;
	completed: number;
	failed: number;
	verified: number;
}

export interface SystemResponse {
	ram: SystemRam;
	swap: SystemSwap;
	disk: SystemDisk;
	uptime: string;
	uptime_sec: number;
	orphan_count: number;
	earlyoom: string;
	handoffs: SystemHandoffs;
}

// /api/metrics
export interface MetricsTopAgent {
	name: string;
	count: number;
}

export interface MetricsTopProject {
	name: string;
	count: number;
}

export interface MetricsProviderEvent {
	provider: string;
	event: string;
	count?: number;
}

export interface MetricsResponse {
	total_dispatches: number;
	top_agents: MetricsTopAgent[];
	top_projects: MetricsTopProject[];
	provider_events: MetricsProviderEvent[];
}

// /api/memory
export interface MemoryResponse {
	exists: boolean;
	line_count: number;
	last_modified: string;
	sections: string[];
	knowledge_files: number;
	rules_files?: number;
	rules_count?: number;
}

// /api/rules → RuleInfo[]
export interface RuleInfo {
	name: string;
	path: string;
	category: string;
	size_kb: number;
	last_modified: string;
}

// /api/skills
export interface SkillsResponse {
	total: number;
	categories: Record<string, number>;
	plugins_count?: number;
	plugins?: Record<string, unknown>;
}

// /api/mcp
export interface McpServer {
	name: string;
	source: string;
	enabled: boolean;
	transport: string;
}

export interface McpResponse {
	servers: McpServer[];
	total: number;
	enabled: number;
	disabled: number;
	plugins?: Record<string, unknown>;
	plugins_count?: number;
}

export interface OpenclawResponse {
	skills: number;
	version?: string;
}

export interface SyncResponse {
	synced: boolean;
	last_sync?: string;
	drift?: string[];
}

export interface MsiStatusResponse {
	reachable: boolean;
	hostname?: string;
	load_avg?: number[];
}

export interface SyncStatusResponse {
	status: string;
	last_push?: string;
	last_pull?: string;
}

export interface CrossSyncResponse {
	pop_os: Record<string, unknown>;
	msi: Record<string, unknown>;
	diff?: string[];
}
