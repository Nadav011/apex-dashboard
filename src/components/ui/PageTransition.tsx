import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";

interface PageTransitionProps {
	children: React.ReactNode;
	className?: string;
	/** Use a unique key per page so AnimatePresence triggers on route change */
	pageKey?: string;
}

const variants = {
	initial: { opacity: 0, y: 8 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -8 },
};

/**
 * Wrap each page (or major view) with this component.
 * Pass a unique `pageKey` (e.g. the route pathname) so AnimatePresence can
 * detect the transition.
 *
 * Example:
 *   <PageTransition pageKey={pathname}>
 *     <DashboardPage />
 *   </PageTransition>
 */
export function PageTransition({
	children,
	className,
	pageKey,
}: PageTransitionProps) {
	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				key={pageKey}
				variants={variants}
				initial="initial"
				animate="animate"
				exit="exit"
				transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
				className={clsx("w-full", className)}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
