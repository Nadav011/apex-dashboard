import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { api } from "./lib/api";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
			staleTime: 60_000,
			gcTime: 300_000,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
	},
});

// Prefetch ALL critical data on app startup — pages load instantly
void Promise.allSettled([
	queryClient.prefetchQuery({ queryKey: ["agents"], queryFn: api.agents }),
	queryClient.prefetchQuery({ queryKey: ["projects"], queryFn: api.projects }),
	queryClient.prefetchQuery({
		queryKey: ["hydra", "tasks"],
		queryFn: api.hydraTasks,
	}),
	queryClient.prefetchQuery({
		queryKey: ["hydra", "scores"],
		queryFn: api.hydraScores,
	}),
	queryClient.prefetchQuery({
		queryKey: ["hydra", "health"],
		queryFn: api.hydraHealth,
	}),
	queryClient.prefetchQuery({ queryKey: ["system"], queryFn: api.system }),
	queryClient.prefetchQuery({ queryKey: ["hooks"], queryFn: api.hooks }),
	queryClient.prefetchQuery({ queryKey: ["metrics"], queryFn: api.metrics }),
	queryClient.prefetchQuery({
		queryKey: ["deploys", "status"],
		queryFn: api.deploysStatus,
	}),
	queryClient.prefetchQuery({
		queryKey: ["ci", "status"],
		queryFn: api.ciStatus,
	}),
	queryClient.prefetchQuery({ queryKey: ["openclaw"], queryFn: api.openclaw }),
	queryClient.prefetchQuery({ queryKey: ["rules"], queryFn: api.rules }),
	queryClient.prefetchQuery({ queryKey: ["skills"], queryFn: api.skills }),
	queryClient.prefetchQuery({ queryKey: ["mcp"], queryFn: api.mcp }),
]);

// Stale chunk recovery — reload once on dynamic import failure after deploy
function handleChunkError(message: string) {
	if (
		message.includes("dynamically imported module") ||
		message.includes("Failed to fetch") ||
		message.includes("ChunkLoadError") ||
		message.includes("Loading chunk")
	) {
		const key = "apex-chunk-reload";
		const last = sessionStorage.getItem(key);
		if (!last || Date.now() - Number(last) > 30_000) {
			sessionStorage.setItem(key, String(Date.now()));
			window.location.reload();
		}
	}
}

// Catches sync errors (script load failures)
window.addEventListener("error", (e) => handleChunkError(e.message ?? ""));

// Catches async errors (dynamic import() rejections — the actual failure mode)
window.addEventListener("unhandledrejection", (e) => {
	const msg = e.reason?.message ?? String(e.reason ?? "");
	handleChunkError(msg);
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found in DOM");

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</StrictMode>,
);
