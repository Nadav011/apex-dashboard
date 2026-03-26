import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
	value: number;
	duration?: number;
	prefix?: string;
	suffix?: string;
	className?: string;
}

function easeOutQuart(t: number): number {
	return 1 - (1 - t) ** 4;
}

export function AnimatedNumber({
	value,
	duration = 1000,
	prefix = "",
	suffix = "",
	className,
}: AnimatedNumberProps) {
	const [displayValue, setDisplayValue] = useState(value);
	const prevValueRef = useRef(value);
	const rafRef = useRef<number | null>(null);
	const startTimeRef = useRef<number | null>(null);

	useEffect(() => {
		const from = prevValueRef.current;
		const to = value;

		if (from === to) return;

		// Cancel any in-flight animation
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);
		}

		startTimeRef.current = null;

		function step(timestamp: number) {
			if (startTimeRef.current === null) {
				startTimeRef.current = timestamp;
			}

			const elapsed = timestamp - startTimeRef.current;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easeOutQuart(progress);
			const current = from + (to - from) * eased;

			setDisplayValue(current);

			if (progress < 1) {
				rafRef.current = requestAnimationFrame(step);
			} else {
				setDisplayValue(to);
				prevValueRef.current = to;
				rafRef.current = null;
			}
		}

		rafRef.current = requestAnimationFrame(step);

		return () => {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [value, duration]);

	const formatted = Math.round(displayValue).toLocaleString("he-IL");

	return (
		<span className={className} dir="ltr">
			{prefix}
			{formatted}
			{suffix}
		</span>
	);
}
