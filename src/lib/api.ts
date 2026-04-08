import { STATIC } from "./static-data";

// Always use relative /api — CF Pages Functions proxy handles production routing
const API_BASE = import.meta.env.VITE_API_URL || "/api";

// Slow endpoints that need longer timeout (health checks, CI, projects scan GitHub)
const SLOW_PATHS = new Set([
	"/hydra/health",
	"/hydra/agents/live",
	"/ci/status",
	"/ci/summary",
	"/projects",
	"/agents/live",
]);

async function fetchApi<T>(path: string, fallback?: T): Promise<T> {
	try {
		const ctrl = new AbortController();
		const timeout = SLOW_PATHS.has(path) ? 10000 : 3000;
		const timer = setTimeout(() => ctrl.abort(), timeout);
		const res = await fetch(`${API_BASE}${path}`, {
			signal: ctrl.signal,
			credentials: "include",
		});
		clearTimeout(timer);
		if (!res.ok) throw new Error(`${res.status}`);
		return res.json() as Promise<T>;
	} catch {
		if (fallback !== undefined) return fallback;
		throw new Error(`API unavailable: ${path}`);
	}
}

async function postApi<TResponse, TBody = undefined>(
	path: string,
	options?: {
		body?: TBody;
		fallback?: TResponse;
	},
): Promise<TResponse> {
	try {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 3000);
		const hasBody = options?.body !== undefined;
		const res = await fetch(`${API_BASE}${path}`, {
			method: "POST",
			signal: ctrl.signal,
			credentials: "include",
			headers: hasBody ? { "Content-Type": "application/json" } : undefined,
			body: hasBody ? JSON.stringify(options.body) : undefined,
		});
		clearTimeout(timer);
		if (!res.ok) throw new Error(`${res.status}`);
		return res.json() as Promise<TResponse>;
	} catch {
		if (options?.fallback !== undefined) return options.fallback;
		throw new Error(`API unavailable: ${path}`);
	}
}

export type ApprovalResolutionAction = "approve" | "reject" | (string & {});

export const fetchAgentHeartbeats = () =>
	fetchApi<AgentHeartbeat[]>("/hydra/agents/live");

export const fetchBudgetStatus = () =>
	fetchApi<BudgetStatus[]>("/hydra/budget");

export const fetchWaveHistory = () => fetchApi<WaveEntry[]>("/hydra/waves");

export const fetchApprovals = () =>
	fetchApi<ApprovalRequest[]>("/hydra/approvals?status=pending");

export const postHeartbeat = (data: AgentHeartbeat) =>
	postApi<ControlResponse, AgentHeartbeat>("/hydra/heartbeat", {
		body: data,
	});

export const resolveApproval = (id: string, action: ApprovalResolutionAction) =>
	postApi<ControlResponse, { action: ApprovalResolutionAction }>(
		`/hydra/approvals/${encodeURIComponent(id)}/resolve`,
		{
			body: { action },
		},
	);

export const pauseAgent = (id: string) =>
	postApi<ControlResponse>(`/hydra/agents/${encodeURIComponent(id)}/pause`);

export const resumeAgent = (id: string) =>
	postApi<ControlResponse>(`/hydra/agents/${encodeURIComponent(id)}/resume`);

export const terminateAgent = (id: string) =>
	postApi<ControlResponse>(`/hydra/agents/${encodeURIComponent(id)}/terminate`);

// /api/obsidian
export interface ObsidianResponse {
	installed: boolean;
	vault_path: string;
	total_files: number;
	categories: Record<string, number>;
	dashboards: string[];
	plugins: string[];
	running: boolean;
	templates: string[];
	wikilinks: number;
	tagged_files: number;
	sync_active: boolean;
	recent_changes: Array<{ name: string; folder: string; modified: string }>;
}

// ── GET endpoints ──────────────────────────────────────────────────────────────
export const api = {
	agents: () => fetchApi<AgentInfo[]>("/agents", STATIC.agents),
	agentsLive: () => fetchApi<LiveAgentsResponse>("/agents/live"),
	agentsExternal: () =>
		fetchApi<ExternalAgentsResponse>("/agents/external", STATIC.agentsExternal),
	hydraTasks: () => fetchApi<HydraTask[]>("/hydra/tasks", STATIC.hydraTasks),
	hydraScores: () =>
		fetchApi<HydraScoresResponse>("/hydra/scores", STATIC.hydraScores),
	hydraWatcher: () =>
		fetchApi<WatcherResponse>("/hydra/watcher", STATIC.hydraWatcher),
	hydraHealth: () =>
		fetchApi<HealthResponse>("/hydra/health", STATIC.hydraHealth),
	fetchAgentHeartbeats,
	fetchBudgetStatus,
	fetchWaveHistory,
	fetchApprovals,
	hooks: () => fetchApi<HooksResponse>("/hooks", STATIC.hooks),
	system: () => fetchApi<SystemResponse>("/system", STATIC.system),
	metrics: () => fetchApi<MetricsResponse>("/metrics", STATIC.metrics),
	memory: () => fetchApi<MemoryResponse>("/memory", STATIC.memory),
	rules: () => fetchApi<RuleInfo[]>("/rules", STATIC.rules),
	skills: () => fetchApi<SkillsResponse>("/skills", STATIC.skills),
	mcp: () => fetchApi<McpResponse>("/mcp", STATIC.mcp),
	openclaw: () => fetchApi<OpenclawResponse>("/openclaw", STATIC.openclaw),
	openclawDetails: () =>
		fetchApi<OpenclawDetailsResponse>(
			"/openclaw/details",
			STATIC.openclawDetails,
		),
	sync: () => fetchApi<SyncResponse>("/sync", STATIC.sync),
	lenovoStatus: () =>
		fetchApi<LenovoStatusResponse>("/lenovo/status", STATIC.lenovoStatus),
	syncStatus: () =>
		fetchApi<SyncStatusResponse>("/sync/status", STATIC.syncStatus),
	crossSync: () => fetchApi<CrossSyncResponse>("/cross-sync", STATIC.crossSync),
	watcherAll: () =>
		fetchApi<WatcherResponse>("/watcher/all", STATIC.watcherAll),
	notificationsConfig: () =>
		fetchApi<NotificationConfig>(
			"/notifications/config",
			STATIC.notificationsConfig,
		),
	notificationsLog: () =>
		fetchApi<NotificationEvent[]>(
			"/notifications/log",
			STATIC.notificationsLog,
		),
	ciStatus: () => fetchApi<CiStatusResponse>("/ci/status", STATIC.ciStatus),
	ciSummary: () => fetchApi<CiSummaryResponse>("/ci/summary", STATIC.ciSummary),
	ciTemplates: () =>
		fetchApi<CiTemplatesResponse>("/ci/templates", STATIC.ciTemplates),
	ciDeep: () => fetchApi<CiDeepResponse>("/ci/deep", STATIC.ciDeep),

	teamStatus: () =>
		fetchApi<{
			active_teams: Array<{
				task_id: string;
				total_subtasks: number;
				completed_subtasks: number;
				subtasks: Array<{
					id: string;
					role: string;
					title: string;
					provider_hint: string;
					depends_on: string[];
					status?: string;
				}>;
				status: string;
			}>;
			recent_events: Array<Record<string, unknown>>;
			team_mode_available: boolean;
		}>("/team-status", {
			active_teams: [],
			recent_events: [],
			team_mode_available: false,
		}),
	obsidian: () =>
		fetchApi<ObsidianResponse>("/obsidian", {
			installed: false,
			vault_path: "",
			total_files: 0,
			categories: {},
			dashboards: [],
			plugins: [],
			running: false,
			templates: [],
			wikilinks: 0,
			tagged_files: 0,
			sync_active: false,
			recent_changes: [],
		}),
	deploysStatus: () =>
		fetchApi<DeploysStatusResponse>("/deploys/status", STATIC.deploysStatus),
	projects: () => fetchApi<ProjectsResponse>("/projects", STATIC.projects),
	costs: () =>
		fetchApi<CostsResponse>("/costs", {
			today_usd: 0,
			week_usd: 0,
			month_usd: 0,
			per_provider: {},
			per_model: {},
			daily_history: [],
			budget_remaining_usd: 50,
			daily_budget_usd: 50,
		}),

	// ── POST control actions ───────────────────────────────────────────────────
	startHydra: () => postApi<ControlResponse>("/control/start-hydra"),
	stopHydra: () => postApi<ControlResponse>("/control/stop-hydra"),
	healthCheck: () => postApi<ControlResponse>("/control/health-check"),
	backup: () => postApi<ControlResponse>("/control/backup"),
	cleanOrphans: () => postApi<ControlResponse>("/control/clean-orphans"),
	syncLenovo: () => postApi<ControlResponse>("/control/sync-lenovo"),
	postHeartbeat,
	resolveApproval,
	pauseAgent,
	resumeAgent,
	terminateAgent,
	sendTestNotification: () => postApi<ControlResponse>("/notifications/test"),
	configureNotifications: (rules: Partial<NotificationRules>) =>
		fetch("/api/notifications/configure", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(rules),
		}).then((r) => r.json() as Promise<ControlResponse>),
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

export interface LiveAgent {
	type: string;
	category?: string;
	description?: string;
	pid: number;
	cpu: number;
	mem: number;
	cmd: string;
	started: string;
	uptime?: string;
	status?: string;
}

export interface BackgroundTask {
	task_id: string;
	output_size: number;
	age_seconds: number;
	status: string;
}

export interface LiveAgentsResponse {
	live_agents: LiveAgent[];
	live_count: number;
	background_tasks: BackgroundTask[];
	background_count: number;
	timestamp: string;
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
	display_name?: string;
	description_he?: string;
	provider?: string;
	rc?: number;
	node?: string;
	message?: string;
}

// API returns array directly, not wrapped in {events}
export type WatcherResponse = WatcherEvent[];

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

// /api/openclaw/details
export interface OpenclawSkill {
	name: string;
	slug: string;
	description: string;
	version: string;
	tags: string[];
	file: string;
	size_kb: number;
}

export interface OpenclawSubagent {
	name: string;
	path: string;
}

export interface OpenclawDetailsResponse {
	skills: OpenclawSkill[];
	skills_count: number;
	subagents: OpenclawSubagent[];
	subagents_count: number;
	version: string;
	path: string;
}

export interface SyncResponse {
	synced: boolean;
	last_sync?: string;
	drift?: string[];
}

export interface LenovoStatusResponse {
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
	lenovo: Record<string, unknown>;
	diff?: string[];
}

// ── CI/CD types ────────────────────────────────────────────────────────────────

export interface CiRun {
	status: string;
	conclusion: string | null;
	name: string;
	createdAt: string;
	headBranch: string;
	url: string;
}

export interface CiRepo {
	name: string;
	full_name: string;
	runs: CiRun[];
	error?: string;
}

export interface CiStatusResponse {
	repos: CiRepo[];
	updated_at: string;
}

export interface CiSummaryResponse {
	total: number;
	passing: number;
	failing: number;
	unknown: number;
	last_check: string;
	// Also returned by current API
	runs?: Array<Record<string, unknown>>;
	success?: number;
	failure?: number;
	in_progress?: number;
	repos?: CiRepo[];
}

export interface CiTemplate {
	file: string;
	name: string;
	size_kb: number;
	lines: number;
}

export interface CiTemplatesResponse {
	templates: CiTemplate[];
	count: number;
	path: string;
}
// /api/ci/deep
export interface CiPipelineStage {
	name: string;
	jobs: string[];
	duration_estimate?: string;
}

export interface CiTool {
	name: string;
	version?: string;
	category: string;
	command: string;
	purpose: string;
	blocking: boolean;
	docs_url?: string;
}

export interface CiReusableWorkflow {
	file: string;
	name: string;
	description: string;
	triggers: string[];
	jobs: string[];
	secrets_required: string[];
	repos_using: number;
}

export interface CiGithubApp {
	name: string;
	purpose: string;
	installed_on: string[];
	auto_pr: boolean;
	webhook_events: string[];
}

export interface CiSecurityGate {
	name: string;
	tool: string;
	blocking: boolean;
	severity_threshold?: string;
	notes?: string;
}

export interface CiRunner {
	label: string;
	machine: string;
	ip: string;
	cores: number;
	ram_gb: number;
	count: number;
	status: string;
	total?: number;
}

export interface CiProjectEntry {
	name: string;
	stack: string;
	machine: string;
	has_ci: boolean;
	test_shards: number;
	bundle_check: boolean;
	security_scan: boolean;
	deploy_gate: boolean;
	branch: string;
}

export interface CiDeepStats {
	total_repos: number;
	repos_with_ci: number;
	total_workflow_files: number;
	total_tools: number;
	total_security_gates: number;
	total_runners: number;
	total_reusable_workflows: number;
	github_apps: number;
	projects_with_ci: number;
	projects_total: number;
}

export interface CiReusableWorkflowsWrapper {
	workflows: CiReusableWorkflow[];
	repo: string;
}

export interface CiDeepResponse {
	pipeline: CiPipelineStage[];
	tools: CiTool[];
	reusable_workflows: CiReusableWorkflowsWrapper;
	github_apps: CiGithubApp[];
	security_gates: CiSecurityGate[];
	runners: CiRunner[];
	per_project: CiProjectEntry[];
	stats: CiDeepStats;
}

// /api/deploys/status
export interface DeploySite {
	name: string;
	url: string;
	platform: "cloudflare" | "netlify";
	status: "up" | "down";
	http_status: number | null;
	response_ms: number;
	checked_at: string;
	error: string | null;
}

export interface DeploysStatusResponse {
	sites: DeploySite[];
	total: number;
	up_count: number;
	down_count: number;
	checked_at: string;
}

// /api/notifications/config
export interface NotificationRules {
	task_failed: boolean;
	health_critical: boolean;
	ram_high: boolean;
	lenovo_unreachable: boolean;
}

export interface NotificationConfig {
	token_set: boolean;
	chat_id_set: boolean;
	rules: NotificationRules;
}

// /api/notifications/log
export interface NotificationEvent {
	ts: string;
	event: string;
	message: string;
	sent: boolean;
}

// /api/projects
export interface ProjectLastCommit {
	sha: string;
	message: string;
	date: string;
}

export interface ProjectTesting {
	framework: string;
	e2e?: string;
	mutation?: string;
	coverage_target?: number;
}

export interface ProjectSecurity {
	rls?: boolean;
	csp?: boolean;
	trivy: boolean;
	semgrep: boolean;
	gitleaks: boolean;
}

export interface ProjectScale {
	pages?: number;
	components?: number;
	hooks?: number;
	lib?: number;
	migrations?: number;
	edge_functions?: number;
	tables?: number;
}

export interface ProjectInfo {
	name: string;
	display_name: string;
	path: string;
	machine: string;
	stack: string[];
	github_repo: string;
	github_url: string;
	domain: string;
	deploy_platform: string;
	status: "active" | "archived" | "development";
	description_he: string;
	description_en: string;
	default_branch: string;
	package_manager: string;
	ci_workflows: string[];
	features: string[];
	testing: ProjectTesting;
	bundle_limit_kb?: number;
	security: ProjectSecurity;
	connections: string[];
	supabase_project?: string;
	related_projects: string[];
	notes: string;
	scale?: ProjectScale;
	last_commit: ProjectLastCommit | null;
	// Legacy fields (kept for compat)
	github?: string;
	platform?: string;
	description?: string;
}

export interface ProjectsResponse {
	projects: ProjectInfo[];
	total: number;
	active: number;
	archived: number;
	development: number;
	by_machine: Record<string, number>;
	by_platform: Record<string, number>;
	by_stack_type: Record<string, number>;
	with_github: number;
	with_ci: number;
	with_supabase: number;
}

// /api/costs
export interface CostsResponse {
	today_usd: number;
	week_usd: number;
	month_usd: number;
	per_provider: Record<string, number>;
	per_model: Record<string, number>;
	daily_history: Array<{ date: string; usd: number }>;
	budget_remaining_usd: number;
	daily_budget_usd: number;
}

export interface AgentHeartbeat {
	agent_id: string;
	session: string;
	provider: string;
	status: string;
	last_output: string;
	runtime_seconds: number;
	task_id: string;
	wave_id: string;
	cost_cents: number;
}

export interface BudgetStatus {
	provider: string;
	daily_spent_cents: number;
	daily_limit_cents: number;
	monthly_spent_cents: number;
	monthly_limit_cents: number;
}

export interface WaveEntry {
	wave_id: string;
	wave_name: string;
	total_tasks: number;
	completed: number;
	failed: number;
	running: number;
	total_cost_cents: number;
	duration_seconds: number;
	started_at: string;
}

export interface ApprovalRequest {
	id: string;
	type: string;
	description: string;
	requested_by: string;
	status: string;
	created_at: string;
}
