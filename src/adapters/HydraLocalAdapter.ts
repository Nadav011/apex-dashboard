import { z } from "zod";

const DEFAULT_BASE_PATH = "/api/hydra";
const DEFAULT_TIMEOUT_MS = 10_000;

const startAgentInputSchema = z.object({
	provider: z.string().trim().min(1),
	workdir: z.string().trim().min(1),
	prompt: z.string().trim().min(1),
});

const approvalInputSchema = z.object({
	type: z.string().trim().min(1),
	description: z.string().trim().min(1),
	requester: z.string().trim().min(1),
});

const heartbeatSchema = z
	.object({
		provider: z.string().optional(),
		task_id: z.string().optional(),
		wave_id: z.string().optional(),
		status: z.string().optional(),
		workdir: z.string().optional(),
		pid: z.number().int().optional(),
		started_at: z.string().optional(),
		updated_at: z.string().optional(),
		heartbeat_at: z.string().optional(),
	})
	.passthrough();

const heartbeatsEnvelopeSchema = z.union([
	z.array(heartbeatSchema),
	z
		.object({
			agents: z.array(heartbeatSchema).optional(),
			heartbeats: z.array(heartbeatSchema).optional(),
			live_agents: z.array(heartbeatSchema).optional(),
		})
		.passthrough(),
]);

const dispatchResponseSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
		task_id: z.string().optional(),
		wave_id: z.string().optional(),
		provider: z.string().optional(),
	})
	.passthrough();

const budgetResponseSchema = z
	.object({
		provider: z.string().optional(),
		allowed: z.boolean().optional(),
		available: z.boolean().optional(),
		remaining: z.number().optional(),
		remaining_usd: z.number().optional(),
		limit: z.number().optional(),
		limit_usd: z.number().optional(),
		reset_at: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();

const approvalResponseSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
		approval_id: z.string().optional(),
		id: z.string().optional(),
	})
	.passthrough();

export interface AgentConfig {
	provider: string;
	workdir: string;
	prompt: string;
	task_id: string;
	wave_id: string;
	goal?: string;
	parent_goal?: string;
}

export type HydraHeartbeat = z.infer<typeof heartbeatSchema>;

export interface StartAgentResult {
	config: AgentConfig;
	status: string;
	message?: string;
	task_id: string;
	wave_id: string;
	raw: Record<string, unknown>;
}

export interface BudgetCheckResult {
	provider: string;
	allowed: boolean | null;
	remaining: number | null;
	limit: number | null;
	reset_at?: string;
	message?: string;
	raw: Record<string, unknown>;
}

export interface ApprovalRequestResult {
	status: string;
	message?: string;
	approval_id?: string;
	raw: Record<string, unknown>;
}

interface HydraLocalAdapterOptions {
	basePath?: string;
	startPath?: string;
	heartbeatsPath?: string;
	budgetPath?: string;
	approvalsPath?: string;
	timeoutMs?: number;
}

export class HydraLocalAdapter {
	private readonly basePath: string;
	private readonly startPath: string;
	private readonly heartbeatsPath: string;
	private readonly budgetPath: string;
	private readonly approvalsPath: string;
	private readonly timeoutMs: number;

	constructor(options: HydraLocalAdapterOptions = {}) {
		this.basePath = trimTrailingSlash(options.basePath ?? DEFAULT_BASE_PATH);
		this.startPath = options.startPath ?? "/agents/start";
		this.heartbeatsPath = options.heartbeatsPath ?? "/agents/live";
		this.budgetPath = options.budgetPath ?? "/budget";
		this.approvalsPath = options.approvalsPath ?? "/approvals";
		this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	}

	async startAgent(
		provider: string,
		workdir: string,
		prompt: string,
	): Promise<StartAgentResult> {
		const parsedInput = startAgentInputSchema.parse({
			provider,
			workdir,
			prompt,
		});
		const config = this.createAgentConfig(parsedInput);
		const payload = await this.requestJson(
			this.startPath,
			{
				method: "POST",
				body: JSON.stringify(config),
			},
			dispatchResponseSchema,
		);

		return {
			config,
			status: payload.status ?? "accepted",
			message: payload.message,
			task_id: payload.task_id ?? config.task_id,
			wave_id: payload.wave_id ?? config.wave_id,
			raw: payload,
		};
	}

	async getHeartbeats(): Promise<HydraHeartbeat[]> {
		const payload = await this.requestJson(
			this.heartbeatsPath,
			{ method: "GET" },
			heartbeatsEnvelopeSchema,
		);

		if (Array.isArray(payload)) {
			return payload;
		}

		return payload.heartbeats ?? payload.agents ?? payload.live_agents ?? [];
	}

	async checkBudget(provider: string): Promise<BudgetCheckResult> {
		const parsedInput = startAgentInputSchema.pick({ provider: true }).parse({
			provider,
		});
		const query = new URLSearchParams({ provider: parsedInput.provider });
		const payload = await this.requestJson(
			`${this.budgetPath}?${query.toString()}`,
			{ method: "GET" },
			budgetResponseSchema,
		);

		return {
			provider: payload.provider ?? parsedInput.provider,
			allowed: payload.allowed ?? payload.available ?? null,
			remaining: payload.remaining ?? payload.remaining_usd ?? null,
			limit: payload.limit ?? payload.limit_usd ?? null,
			reset_at: payload.reset_at,
			message: payload.message,
			raw: payload,
		};
	}

	async requestApproval(
		type: string,
		description: string,
		requester: string,
	): Promise<ApprovalRequestResult> {
		const payload = approvalInputSchema.parse({
			type,
			description,
			requester,
		});
		const result = await this.requestJson(
			this.approvalsPath,
			{
				method: "POST",
				body: JSON.stringify(payload),
			},
			approvalResponseSchema,
		);

		return {
			status: result.status ?? "pending",
			message: result.message,
			approval_id: result.approval_id ?? result.id,
			raw: result,
		};
	}

	private async requestJson<T>(
		path: string,
		init: RequestInit,
		schema: z.ZodType<T>,
	): Promise<T> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

		try {
			const response = await fetch(this.toUrl(path), {
				...init,
				signal: controller.signal,
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					...(init.headers ?? {}),
				},
			});
			const payload = await parseJson(response);

			if (!response.ok) {
				throw new Error(getErrorMessage(payload, response.status));
			}

			return schema.parse(payload);
		} catch (error: unknown) {
			if (error instanceof z.ZodError) {
				throw new Error("Hydra החזיר תשובה שלא עומדת בחוזה המצופה.");
			}

			if (error instanceof DOMException && error.name === "AbortError") {
				throw new Error("הבקשה ל-Hydra חרגה מזמן ההמתנה.");
			}

			if (error instanceof Error) {
				throw error;
			}

			throw new Error("אירעה שגיאה לא צפויה מול Hydra.");
		} finally {
			clearTimeout(timeoutId);
		}
	}

	private createAgentConfig(
		input: z.infer<typeof startAgentInputSchema>,
	): AgentConfig {
		const slug = slugify(input.provider);
		const token = createToken();

		return {
			provider: input.provider,
			workdir: input.workdir,
			prompt: input.prompt,
			task_id: `${slug}-${token}`,
			wave_id: `wave-${token}`,
		};
	}

	private toUrl(path: string): string {
		if (path.startsWith("http://") || path.startsWith("https://")) {
			return path;
		}

		if (path.startsWith("/")) {
			return `${this.basePath}${path}`;
		}

		return `${this.basePath}/${path}`;
	}
}

async function parseJson(response: Response): Promise<unknown> {
	const text = await response.text();

	if (text.trim().length === 0) {
		return {};
	}

	try {
		return JSON.parse(text) as unknown;
	} catch {
		throw new Error("Hydra החזיר JSON לא תקין.");
	}
}

function getErrorMessage(payload: unknown, status: number): string {
	const record = asRecord(payload);

	if (record) {
		const message = pickString(record.message);
		const error = pickString(record.error);
		const detail = pickString(record.detail);

		return message ?? error ?? detail ?? `בקשת Hydra נכשלה (${status}).`;
	}

	return `בקשת Hydra נכשלה (${status}).`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return null;
	}

	return value as Record<string, unknown>;
}

function pickString(value: unknown): string | undefined {
	return typeof value === "string" && value.trim().length > 0
		? value
		: undefined;
}

function createToken(): string {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID();
	}

	return `fallback-${Date.now().toString(36)}-${Math.random()
		.toString(36)
		.slice(2, 10)}`;
}

function slugify(value: string): string {
	const slug = value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return slug.length > 0 ? slug : "hydra";
}

function trimTrailingSlash(value: string): string {
	return value.endsWith("/") ? value.slice(0, -1) : value;
}
