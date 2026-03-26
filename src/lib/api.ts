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
	openclawDetails: () => fetchApi<OpenclawDetailsResponse>("/openclaw/details"),
	sync: () => fetchApi<SyncResponse>("/sync"),
	lenovoStatus: () => fetchApi<LenovoStatusResponse>("/lenovo/status"),
	syncStatus: () => fetchApi<SyncStatusResponse>("/sync/status"),
	crossSync: () => fetchApi<CrossSyncResponse>("/cross-sync"),
	watcherAll: () => fetchApi<WatcherResponse>("/watcher/all"),
	notificationsConfig: () =>
		fetchApi<NotificationConfig>("/notifications/config"),
	notificationsLog: () => fetchApi<NotificationEvent[]>("/notifications/log"),
	ciStatus: () => fetchApi<CiStatusResponse>("/ci/status"),
	ciSummary: () => fetchApi<CiSummaryResponse>("/ci/summary"),
	ciTemplates: () => fetchApi<CiTemplatesResponse>("/ci/templates"),
	ciDeep: () => fetchApi<CiDeepResponse>("/ci/deep"),

	deploysStatus: () => fetchApi<DeploysStatusResponse>("/deploys/status"),
	projects: () => fetchApi<ProjectsResponse>("/projects"),

	// ── POST control actions ───────────────────────────────────────────────────
	startHydra: () => postApi<ControlResponse>("/control/start-hydra"),
	stopHydra: () => postApi<ControlResponse>("/control/stop-hydra"),
	healthCheck: () => postApi<ControlResponse>("/control/health-check"),
	backup: () => postApi<ControlResponse>("/control/backup"),
	cleanOrphans: () => postApi<ControlResponse>("/control/clean-orphans"),
	syncLenovo: () => postApi<ControlResponse>("/control/sync-lenovo"),
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
	machine: "pop-os" | "Lenovo";
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
