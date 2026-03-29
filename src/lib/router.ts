import { useCallback, useEffect, useSyncExternalStore } from "react";

interface HashRoute {
	category: string;
	page: string;
	path: string;
}

const DEFAULT_ROUTE: HashRoute = {
	category: "dashboard",
	page: "overview",
	path: "#/",
};

function parseHash(hash: string): HashRoute {
	const clean = hash.replace(/^#\/?/, "").replace(/\/$/, "");
	if (!clean) return DEFAULT_ROUTE;
	const parts = clean.split("/");
	if (parts.length === 1) {
		// e.g. #/overview → category=dashboard, page=overview
		return { category: "dashboard", page: parts[0]!, path: `#/${clean}` };
	}
	if (parts.length >= 2) {
		return {
			category: parts[0]!,
			page: parts[1]!,
			path: `#/${parts[0]}/${parts[1]}`,
		};
	}
	return DEFAULT_ROUTE;
}

// External store for hash state — supports useSyncExternalStore
let currentHash = typeof window !== "undefined" ? window.location.hash : "#/";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot() {
	return currentHash;
}

function onHashChange() {
	const next = window.location.hash;
	if (next === currentHash) return; // deduplicate — navigate() already notified
	currentHash = next;
	for (const l of listeners) l();
}

if (typeof window !== "undefined") {
	window.addEventListener("hashchange", onHashChange);
	window.addEventListener("popstate", onHashChange);
}

export function useHashRouter() {
	const hash = useSyncExternalStore(subscribe, getSnapshot, () => "#/");
	const route = parseHash(hash);

	const navigate = useCallback((path: string) => {
		const normalized = path.startsWith("#") ? path : `#/${path}`;
		if (normalized === currentHash) return;

		// View Transitions API for smooth page transitions
		const update = () => {
			window.location.hash = normalized;
			currentHash = normalized;
			for (const l of listeners) l();
		};

		if ("startViewTransition" in document) {
			(
				document as unknown as { startViewTransition: (cb: () => void) => void }
			).startViewTransition(update);
		} else {
			update();
		}
	}, []);

	// Track recent pages in localStorage
	useEffect(() => {
		if (route.path === "#/" || route.path === DEFAULT_ROUTE.path) return;
		try {
			const key = "apex-recent-pages";
			const stored = JSON.parse(localStorage.getItem(key) || "[]") as string[];
			const updated = [
				route.path,
				...stored.filter((p) => p !== route.path),
			].slice(0, 5);
			localStorage.setItem(key, JSON.stringify(updated));
		} catch {
			// localStorage unavailable
		}
	}, [route.path]);

	return { ...route, navigate };
}

export function getRecentPages(): string[] {
	try {
		return JSON.parse(
			localStorage.getItem("apex-recent-pages") || "[]",
		) as string[];
	} catch {
		return [];
	}
}
