import { useCallback, useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
	id: string;
	message: string;
	type: ToastType;
	createdAt: number;
}

const AUTO_DISMISS_MS = 4000;

// Global singleton so toast() can be called from anywhere after provider mounts
type Listener = (item: ToastItem) => void;
const listeners = new Set<Listener>();

function genId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Call this anywhere in the app to show a toast */
export function toast(message: string, type: ToastType = "info"): void {
	const item: ToastItem = { id: genId(), message, type, createdAt: Date.now() };
	for (const fn of listeners) fn(item);
}

/** Returns [toasts, dismiss] for the ToastProvider to render */
export function useToastState(): [ToastItem[], (id: string) => void] {
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
		new Map(),
	);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
		const timer = timersRef.current.get(id);
		if (timer !== undefined) {
			clearTimeout(timer);
			timersRef.current.delete(id);
		}
	}, []);

	useEffect(() => {
		const handler: Listener = (item) => {
			setToasts((prev) => [...prev, item]);

			const timer = setTimeout(() => dismiss(item.id), AUTO_DISMISS_MS);
			timersRef.current.set(item.id, timer);
		};

		listeners.add(handler);
		return () => {
			listeners.delete(handler);
			for (const timer of timersRef.current.values()) clearTimeout(timer);
		};
	}, [dismiss]);

	return [toasts, dismiss];
}
