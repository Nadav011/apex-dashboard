import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "danger" | "warning" | "success";

interface ActionButtonProps {
	label: string;
	icon: LucideIcon;
	onClick: () => void;
	variant?: ButtonVariant;
	isPending?: boolean;
	disabled?: boolean;
	className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary: [
		"bg-[var(--color-accent-blue)] text-white",
		"hover:bg-[oklch(0.68_0.18_250)]",
		"focus-visible:ring-[var(--color-accent-blue)]",
		"disabled:bg-[oklch(0.65_0.18_250_/_0.4)]",
	].join(" "),
	danger: [
		"bg-[var(--color-status-critical)] text-white",
		"hover:bg-[oklch(0.65_0.22_25)]",
		"focus-visible:ring-[var(--color-status-critical)]",
		"disabled:bg-[oklch(0.62_0.22_25_/_0.4)]",
	].join(" "),
	warning: [
		"bg-[var(--color-status-degraded)] text-[oklch(0.15_0.01_260)]",
		"hover:bg-[oklch(0.81_0.16_75)]",
		"focus-visible:ring-[var(--color-status-degraded)]",
		"disabled:bg-[oklch(0.78_0.16_75_/_0.4)]",
	].join(" "),
	success: [
		"bg-[var(--color-status-healthy)] text-[oklch(0.15_0.01_260)]",
		"hover:bg-[oklch(0.75_0.19_155)]",
		"focus-visible:ring-[var(--color-status-healthy)]",
		"disabled:bg-[oklch(0.72_0.19_155_/_0.4)]",
	].join(" "),
};

export function ActionButton({
	label,
	icon: Icon,
	onClick,
	variant = "primary",
	isPending = false,
	disabled = false,
	className,
}: ActionButtonProps) {
	const isDisabled = disabled || isPending;

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			aria-busy={isPending}
			className={cn(
				// Base
				"inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4",
				"text-sm font-semibold transition-all duration-150",
				// Focus ring
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
				"focus-visible:ring-offset-[var(--color-bg-primary)]",
				// Disabled
				"disabled:cursor-not-allowed disabled:opacity-60",
				// Active press effect
				"active:scale-[0.97]",
				VARIANT_CLASSES[variant],
				className,
			)}
		>
			{isPending ? (
				<Loader2
					size={16}
					strokeWidth={2}
					className="animate-spin"
					aria-hidden="true"
				/>
			) : (
				<Icon size={16} strokeWidth={1.75} aria-hidden="true" />
			)}
			{label}
		</button>
	);
}
