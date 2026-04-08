import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRightLeft, Pause, Play, Square } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/GlassCard";
import {
	usePauseAgent,
	useResumeAgent,
	useTerminateAgent,
} from "@/hooks/use-api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";

export interface BoardAction {
	type: "pause" | "resume" | "terminate" | "reassign";
	agent_id: string;
	new_provider?: string;
}

export interface BoardControlAgent {
	agent_id: string;
	status: string;
	provider?: string;
	task_id?: string;
	activeTaskId?: string;
	session?: string;
	display_name?: string;
	name?: string;
	available_providers?: string[];
}

interface Props {
	agents: BoardControlAgent[];
	onAction: (action: BoardAction) => void | Promise<void>;
}

function getAgentName(agent: BoardControlAgent): string {
	return agent.display_name ?? agent.name ?? agent.agent_id;
}

function getTaskId(agent: BoardControlAgent): string | undefined {
	return agent.task_id ?? agent.activeTaskId;
}

function getStatusLabel(status: string): string {
	const normalized = status.trim().toLowerCase();
	if (normalized.includes("pause")) return "מושהה";
	if (normalized === "running") return "רץ";
	if (normalized === "done") return "הושלם";
	if (normalized === "failed") return "נכשל";
	if (normalized === "dead") return "מנותק";
	return status;
}

function getStatusClassName(status: string): string {
	const normalized = status.trim().toLowerCase();
	if (normalized.includes("pause")) {
		return "border-[oklch(0.78_0.16_75_/_0.25)] bg-[oklch(0.78_0.16_75_/_0.12)] text-[oklch(0.78_0.16_75)]";
	}
	if (normalized === "running") {
		return "border-[oklch(0.65_0.18_250_/_0.25)] bg-[oklch(0.65_0.18_250_/_0.12)] text-[var(--color-status-running)]";
	}
	if (normalized === "done") {
		return "border-[oklch(0.72_0.19_155_/_0.25)] bg-[oklch(0.72_0.19_155_/_0.12)] text-[var(--color-status-healthy)]";
	}
	if (normalized === "failed" || normalized.includes("term")) {
		return "border-[oklch(0.62_0.22_25_/_0.25)] bg-[oklch(0.62_0.22_25_/_0.12)] text-[var(--color-status-critical)]";
	}
	return "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]";
}

function canPause(status: string): boolean {
	const normalized = status.trim().toLowerCase();
	return (
		!normalized.includes("pause") &&
		normalized !== "done" &&
		normalized !== "dead"
	);
}

function canResume(status: string): boolean {
	return status.trim().toLowerCase().includes("pause");
}

function canTerminate(status: string): boolean {
	const normalized = status.trim().toLowerCase();
	return (
		normalized !== "done" &&
		normalized !== "dead" &&
		!normalized.includes("term")
	);
}

async function postReassignTask(
	taskId: string,
	newProvider: string,
): Promise<void> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 3000);

	try {
		const response = await fetch(
			`/api/hydra/tasks/${encodeURIComponent(taskId)}/reassign`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ new_provider: newProvider }),
				signal: controller.signal,
			},
		);

		if (!response.ok) {
			throw new Error("REASSIGN_FAILED");
		}
	} finally {
		clearTimeout(timer);
	}
}

function ConfirmTerminateDialog({
	agentName,
	agentId,
	isPending,
	onCancel,
	onConfirm,
}: {
	agentName: string;
	agentId: string;
	isPending: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-labelledby="terminate-agent-title"
		>
			<div
				className="absolute inset-0 bg-[var(--color-bg-primary)]/80 backdrop-blur-sm"
				onClick={onCancel}
				aria-hidden="true"
			/>
			<div className="relative mx-4 flex w-full max-w-md flex-col gap-5 rounded-3xl border border-[oklch(0.62_0.22_25_/_0.3)] bg-[var(--color-bg-primary)]/95 p-6 shadow-2xl">
				<div className="flex items-start gap-3">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[oklch(0.62_0.22_25_/_0.14)] text-[oklch(0.62_0.22_25)]">
						<Square size={18} aria-hidden="true" />
					</div>
					<div className="min-w-0 flex-1">
						<h3
							id="terminate-agent-title"
							className="text-base font-semibold text-[var(--color-text-primary)]"
						>
							האם לסיים את הסוכן?
						</h3>
						<p className="mt-1 text-sm text-[var(--color-text-secondary)]">
							הסוכן <span className="font-semibold">{agentName}</span> ייעצר
							מיידית. אם קיימת משימה פעילה, היא תופסק.
						</p>
						<p
							className="mt-3 text-xs font-mono text-[var(--color-text-muted)]"
							dir="ltr"
						>
							{agentId}
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-end gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="min-h-11 rounded-2xl border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
					>
						ביטול
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isPending}
						className="min-h-11 rounded-2xl border border-[oklch(0.62_0.22_25_/_0.35)] bg-[oklch(0.62_0.22_25_/_0.18)] px-4 text-sm font-semibold text-[oklch(0.62_0.22_25)] transition-colors hover:bg-[oklch(0.62_0.22_25_/_0.24)] disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isPending ? "מסיים..." : "כן, לסיים"}
					</button>
				</div>
			</div>
		</div>
	);
}

export function BoardControls({ agents, onAction }: Props) {
	const [selectedProviders, setSelectedProviders] = useState<
		Record<string, string>
	>({});
	const [terminateTarget, setTerminateTarget] =
		useState<BoardControlAgent | null>(null);
	const queryClient = useQueryClient();
	const pauseMutation = usePauseAgent();
	const resumeMutation = useResumeAgent();
	const terminateMutation = useTerminateAgent();
	const reassignMutation = useMutation({
		mutationFn: ({
			taskId,
			newProvider,
		}: {
			taskId: string;
			newProvider: string;
		}) => postReassignTask(taskId, newProvider),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["agents"] }),
				queryClient.invalidateQueries({ queryKey: ["agents", "live"] }),
				queryClient.invalidateQueries({ queryKey: ["hydra", "tasks"] }),
				queryClient.invalidateQueries({
					queryKey: ["hydra", "agents", "heartbeats"],
				}),
			]);
		},
	});

	const providerOptions = useMemo(() => {
		const globalProviders = Array.from(
			new Set(
				agents.flatMap((agent) =>
					[agent.provider, ...(agent.available_providers ?? [])].filter(
						(provider): provider is string => Boolean(provider),
					),
				),
			),
		);

		return agents.reduce<Record<string, string[]>>((acc, agent) => {
			const providers = Array.from(
				new Set(
					[...(agent.available_providers ?? []), agent.provider].filter(
						(provider): provider is string => Boolean(provider),
					),
				),
			);
			acc[agent.agent_id] = providers.length > 0 ? providers : globalProviders;
			return acc;
		}, {});
	}, [agents]);

	async function notifyParent(action: BoardAction, successMessage: string) {
		try {
			await Promise.resolve(onAction(action));
			toast(successMessage, "success");
		} catch {
			toast(`${successMessage} אך רענון הלוח נכשל.`, "warning");
		}
	}

	async function handlePause(agentId: string) {
		try {
			await pauseMutation.mutateAsync({ agentId });
			await notifyParent({ type: "pause", agent_id: agentId }, "הסוכן הושהה.");
		} catch {
			toast("השהיית הסוכן נכשלה.", "error");
		}
	}

	async function handleResume(agentId: string) {
		try {
			await resumeMutation.mutateAsync({ agentId });
			await notifyParent({ type: "resume", agent_id: agentId }, "הסוכן חודש.");
		} catch {
			toast("חידוש הסוכן נכשל.", "error");
		}
	}

	async function handleTerminate(agent: BoardControlAgent) {
		try {
			await terminateMutation.mutateAsync({ agentId: agent.agent_id });
			await notifyParent(
				{ type: "terminate", agent_id: agent.agent_id },
				"הסוכן הסתיים.",
			);
			setTerminateTarget(null);
		} catch {
			toast("סיום הסוכן נכשל.", "error");
		}
	}

	async function handleReassign(agent: BoardControlAgent, newProvider: string) {
		const taskId = getTaskId(agent);
		if (!taskId || newProvider.length === 0) return;

		try {
			await reassignMutation.mutateAsync({ taskId, newProvider });
			await notifyParent(
				{
					type: "reassign",
					agent_id: agent.agent_id,
					new_provider: newProvider,
				},
				"המשימה הועברה לספק החדש.",
			);
		} catch {
			toast("העברת המשימה נכשלה.", "error");
		}
	}

	return (
		<>
			<GlassCard
				title="בקרת סוכנים"
				subtitle="השהיה, חידוש, סיום והעברת משימות לספק אחר"
				icon={<Pause size={18} aria-hidden="true" />}
			>
				{agents.length === 0 ? (
					<EmptyState
						icon={Pause}
						title="אין סוכנים זמינים"
						description="כאשר heartbeat יגיע מהמערכת, פעולות הניהול יופיעו כאן."
						className="py-10"
					/>
				) : (
					<div className="space-y-3">
						{agents.map((agent) => {
							const taskId = getTaskId(agent);
							const options = providerOptions[agent.agent_id] ?? [];
							const selectedProvider =
								selectedProviders[agent.agent_id] ??
								agent.provider ??
								options[0] ??
								"";

							return (
								<div
									key={agent.agent_id}
									className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/35 p-4"
								>
									<div className="flex flex-col gap-4">
										<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
											<div className="min-w-0 flex-1">
												<div className="flex flex-wrap items-center gap-2">
													<h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
														{getAgentName(agent)}
													</h3>
													<span
														className={cn(
															"rounded-full border px-2.5 py-1 text-[11px] font-semibold",
															getStatusClassName(agent.status),
														)}
													>
														{getStatusLabel(agent.status)}
													</span>
												</div>
												<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
													<span className="font-mono" dir="ltr">
														{agent.agent_id}
													</span>
													{agent.session && (
														<span dir="ltr">סשן: {agent.session}</span>
													)}
													{agent.provider && (
														<span dir="ltr">ספק: {agent.provider}</span>
													)}
													{taskId && <span dir="ltr">משימה: {taskId}</span>}
												</div>
											</div>

											<div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
												<ActionButton
													label="השהיה"
													icon={Pause}
													onClick={() => void handlePause(agent.agent_id)}
													variant="warning"
													isPending={
														pauseMutation.isPending &&
														pauseMutation.variables?.agentId === agent.agent_id
													}
													disabled={!canPause(agent.status)}
												/>
												<ActionButton
													label="חידוש"
													icon={Play}
													onClick={() => void handleResume(agent.agent_id)}
													variant="success"
													isPending={
														resumeMutation.isPending &&
														resumeMutation.variables?.agentId === agent.agent_id
													}
													disabled={!canResume(agent.status)}
												/>
												<ActionButton
													label="סיום"
													icon={Square}
													onClick={() => setTerminateTarget(agent)}
													variant="danger"
													isPending={false}
													disabled={!canTerminate(agent.status)}
												/>
												<ActionButton
													label="העברה"
													icon={ArrowRightLeft}
													onClick={() =>
														void handleReassign(agent, selectedProvider)
													}
													variant="primary"
													isPending={
														reassignMutation.isPending &&
														reassignMutation.variables?.taskId === taskId
													}
													disabled={!taskId || selectedProvider.length === 0}
												/>
											</div>
										</div>

										<div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
											<label
												className="flex flex-col gap-1 text-xs text-[var(--color-text-muted)]"
												htmlFor={`provider-${agent.agent_id}`}
											>
												<span>בחירת ספק להעברת המשימה</span>
												<select
													id={`provider-${agent.agent_id}`}
													value={selectedProvider}
													onChange={(event) =>
														setSelectedProviders((current) => ({
															...current,
															[agent.agent_id]: event.target.value,
														}))
													}
													disabled={options.length === 0}
													className="min-h-11 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent-blue)] disabled:cursor-not-allowed disabled:opacity-50"
													dir="ltr"
												>
													{options.length === 0 ? (
														<option value="">אין ספקים זמינים</option>
													) : (
														options.map((provider) => (
															<option key={provider} value={provider}>
																{provider}
															</option>
														))
													)}
												</select>
											</label>

											<p className="text-xs text-[var(--color-text-muted)] md:text-end">
												{taskId
													? "הכפתור ישלח בקשת POST להעברת המשימה לספק שנבחר."
													: "אין מזהה משימה פעיל להעברה."}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</GlassCard>

			{terminateTarget && (
				<ConfirmTerminateDialog
					agentName={getAgentName(terminateTarget)}
					agentId={terminateTarget.agent_id}
					isPending={
						terminateMutation.isPending &&
						terminateMutation.variables?.agentId === terminateTarget.agent_id
					}
					onCancel={() => {
						if (!terminateMutation.isPending) {
							setTerminateTarget(null);
						}
					}}
					onConfirm={() => void handleTerminate(terminateTarget)}
				/>
			)}
		</>
	);
}
