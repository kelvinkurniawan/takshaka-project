"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Top loading bar shown on every route change.
 * pathname updates once the new route commits, so this plays a short
 * "just navigated" animation as visual feedback. Uses the shared
 * .top-progress styles in globals.css.
 */
export default function RouteProgress() {
	const pathname = usePathname();
	const [progress, setProgress] = useState(0);
	const [visible, setVisible] = useState(false);
	const timers = useRef<NodeJS.Timeout[]>([]);
	const isFirstRender = useRef(true);

	useEffect(() => {
		// Skip the initial mount — only animate on actual navigations
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		timers.current.forEach(clearTimeout);
		timers.current = [];

		setVisible(true);
		setProgress(30);
		timers.current.push(
			setTimeout(() => setProgress(80), 150),
			setTimeout(() => setProgress(100), 400),
			setTimeout(() => {
				setVisible(false);
				setProgress(0);
			}, 600),
		);
	}, [pathname]);

	// Clear pending timers on unmount
	useEffect(() => () => timers.current.forEach(clearTimeout), []);

	return (
		<div className={`top-progress ${visible ? "visible" : ""}`} aria-hidden>
			<div className="top-progress-bar" style={{ width: `${progress}%` }} />
		</div>
	);
}
