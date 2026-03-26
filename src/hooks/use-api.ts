import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ControlResponse } from "@/lib/api";
import { api } from "@/lib/api";

// ── Live data (2s refresh) ─────────────────────────────────────────
export function useAgents() {
	return useQuery({
		queryKey: ["agents"],
		queryFn: api.agents,
		refetchInterval: 5_000,
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

export function useMsiStatus() {
	return useQuery({
		queryKey: ["msi", "status"],
		queryFn: api.msiStatus,
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
	return useControlMutation(api.syncMsi);
}
