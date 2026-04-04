import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ControlResponse } from "@/lib/api";
import { api } from "@/lib/api";

export function useProjects() {
	return useQuery({
		queryKey: ["projects"],
		queryFn: api.projects,
		refetchInterval: 60_000,
	});
}

// ── Live data (2s refresh) ─────────────────────────────────────────
export function useAgents() {
	return useQuery({
		queryKey: ["agents"],
		queryFn: api.agents,
		refetchInterval: 5_000,
	});
}

export function useAgentsLive() {
	return useQuery({
		queryKey: ["agents", "live"],
		queryFn: api.agentsLive,
		refetchInterval: 3_000,
	});
}

export function useHydraTasks() {
	return useQuery({
		queryKey: ["hydra", "tasks"],
		queryFn: api.hydraTasks,
		refetchInterval: 3_000,
	});
}

export function useHydraScores() {
	return useQuery({
		queryKey: ["hydra", "scores"],
		queryFn: api.hydraScores,
		refetchInterval: 10_000,
	});
}

export function useHydraWatcher() {
	return useQuery({
		queryKey: ["hydra", "watcher"],
		queryFn: api.hydraWatcher,
		refetchInterval: 3_000,
	});
}

export function useHydraHealth() {
	return useQuery({
		queryKey: ["hydra", "health"],
		queryFn: api.hydraHealth,
		refetchInterval: 15_000,
	});
}

export function useSystem() {
	return useQuery({
		queryKey: ["system"],
		queryFn: api.system,
		refetchInterval: 5_000,
	});
}

export function useMetrics() {
	return useQuery({
		queryKey: ["metrics"],
		queryFn: api.metrics,
		refetchInterval: 5_000,
	});
}

// ── Config data (30s refresh) ──────────────────────────────────────
export function useHooks() {
	return useQuery({
		queryKey: ["hooks"],
		queryFn: api.hooks,
		refetchInterval: 30_000,
	});
}

export function useMemory() {
	return useQuery({
		queryKey: ["memory"],
		queryFn: api.memory,
		refetchInterval: 30_000,
	});
}

export function useRules() {
	return useQuery({
		queryKey: ["rules"],
		queryFn: api.rules,
		refetchInterval: 30_000,
	});
}

export function useSkills() {
	return useQuery({
		queryKey: ["skills"],
		queryFn: api.skills,
		refetchInterval: 30_000,
	});
}

export function useMcp() {
	return useQuery({
		queryKey: ["mcp"],
		queryFn: api.mcp,
		refetchInterval: 30_000,
	});
}

export function useOpenclaw() {
	return useQuery({
		queryKey: ["openclaw"],
		queryFn: api.openclaw,
		refetchInterval: 60_000,
	});
}

export function useOpenclawDetails() {
	return useQuery({
		queryKey: ["openclaw", "details"],
		queryFn: api.openclawDetails,
		refetchInterval: 60_000,
	});
}

export function useExternalAgents() {
	return useQuery({
		queryKey: ["agents", "external"],
		queryFn: api.agentsExternal,
		refetchInterval: 30_000,
	});
}

export function useSyncStatus() {
	return useQuery({
		queryKey: ["sync", "status"],
		queryFn: api.syncStatus,
		refetchInterval: 30_000,
	});
}

export function useLenovoStatus() {
	return useQuery({
		queryKey: ["lenovo", "status"],
		queryFn: api.lenovoStatus,
		refetchInterval: 15_000,
	});
}

export function useCrossSync() {
	return useQuery({
		queryKey: ["cross-sync"],
		queryFn: api.crossSync,
		refetchInterval: 30_000,
	});
}

export function useWatcherAll() {
	return useQuery({
		queryKey: ["watcher", "all"],
		queryFn: api.watcherAll,
		refetchInterval: 5_000,
	});
}

// ── CI/CD data (60s refresh) ───────────────────────────────────────
export function useCiStatus() {
	return useQuery({
		queryKey: ["ci", "status"],
		queryFn: api.ciStatus,
		refetchInterval: 60_000,
	});
}

export function useCiSummary() {
	return useQuery({
		queryKey: ["ci", "summary"],
		queryFn: api.ciSummary,
		refetchInterval: 60_000,
	});
}

export function useCiTemplates() {
	return useQuery({
		queryKey: ["ci", "templates"],
		queryFn: api.ciTemplates,
		refetchInterval: 120_000,
		staleTime: 60_000,
	});
}

export function useCiDeep() {
	return useQuery({
		queryKey: ["ci", "deep"],
		queryFn: api.ciDeep,
		refetchInterval: 120_000,
		staleTime: 60_000,
	});
}

export function useDeploysStatus() {
	return useQuery({
		queryKey: ["deploys", "status"],
		queryFn: api.deploysStatus,
		refetchInterval: 30_000,
	});
}

export function useCosts() {
	return useQuery({
		queryKey: ["costs"],
		queryFn: api.costs,
		refetchInterval: 30_000,
	});
}

export function useObsidian() {
	return useQuery({
		queryKey: ["obsidian"],
		queryFn: api.obsidian,
		refetchInterval: 30_000,
	});
}

export function useTeamStatus() {
	return useQuery({
		queryKey: ["team", "status"],
		queryFn: api.teamStatus,
		refetchInterval: 3_000,
	});
}

// ── Control mutations ──────────────────────────────────────────────
function useControlMutation(actionFn: () => Promise<ControlResponse>) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: actionFn,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["hydra"] });
			qc.invalidateQueries({ queryKey: ["system"] });
		},
	});
}

export function useStartHydra() {
	return useControlMutation(api.startHydra);
}

export function useStopHydra() {
	return useControlMutation(api.stopHydra);
}

export function useRunHealthCheck() {
	return useControlMutation(api.healthCheck);
}

export function useBackup() {
	return useControlMutation(api.backup);
}

export function useCleanOrphans() {
	return useControlMutation(api.cleanOrphans);
}

export function useSyncMsi() {
	return useControlMutation(api.syncLenovo);
}

// ── Notification hooks ─────────────────────────────────────────────
export function useNotificationsConfig() {
	return useQuery({
		queryKey: ["notifications", "config"],
		queryFn: api.notificationsConfig,
		refetchInterval: 30_000,
	});
}

export function useNotificationsLog() {
	return useQuery({
		queryKey: ["notifications", "log"],
		queryFn: api.notificationsLog,
		refetchInterval: 10_000,
	});
}

export function useSendTestNotification() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.sendTestNotification,
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
}

export function useConfigureNotifications() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: api.configureNotifications,
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
}
