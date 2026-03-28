import { Component, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className="flex items-center justify-center min-h-[300px] p-8">
						<div className="text-center space-y-3">
							<div className="text-4xl">⚠️</div>
							<h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
								שגיאה בטעינת הדף
							</h2>
							<p className="text-sm text-[var(--color-text-muted)]">
								{this.state.error?.message}
							</p>
							<button
								type="button"
								onClick={() =>
									this.setState({ hasError: false, error: undefined })
								}
								className="px-4 py-2 text-sm rounded-lg bg-[var(--color-accent-blue)] text-white hover:opacity-90 transition-opacity"
							>
								נסה שוב
							</button>
						</div>
					</div>
				)
			);
		}
		return this.props.children;
	}
}
