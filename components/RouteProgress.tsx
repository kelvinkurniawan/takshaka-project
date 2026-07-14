"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Top loading bar shown on every route change.
 *
 * pathname only updates AFTER the new route commits, so it can't tell us when
 * navigation STARTS. Instead we start the bar on the link click (instant
 * feedback) and finish it when pathname changes (route committed).
 * Uses the shared .top-progress styles in globals.css.
 */
export default function RouteProgress() {
	const pathname = usePathname();
	const [progress, setProgress] = useState(0);
	const [visible, setVisible] = useState(false);
	const timers = useRef<NodeJS.Timeout[]>([]);
	const navigating = useRef(false);

	const clearTimers = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
	};

	// Start the bar and trickle it toward ~90%, holding until the route commits
	const start = () => {
		clearTimers();
		navigating.current = true;
		setVisible(true);
		setProgress(20);
		timers.current.push(
			setTimeout(() => setProgress(50), 100),
			setTimeout(() => setProgress(75), 300),
			setTimeout(() => setProgress(90), 700),
			// Safety: if navigation never commits (aborted), auto-hide
			setTimeout(() => finish(), 8000),
		);
	};

	// Complete the bar to 100% and hide
	const finish = () => {
		clearTimers();
		navigating.current = false;
		setProgress(100);
		timers.current.push(
			setTimeout(() => {
				setVisible(false);
				setProgress(0);
			}, 250),
		);
	};

	// Start on internal link clicks (capture phase, before Next handles it)
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (
				e.defaultPrevented ||
				e.button !== 0 ||
				e.metaKey ||
				e.ctrlKey ||
				e.shiftKey ||
				e.altKey
			)
				return;

			const link = (e.target as HTMLElement)?.closest?.("a");
			if (!link || !link.href) return;
			if (link.target === "_blank" || link.hasAttribute("download")) return;

			const url = new URL(link.href, window.location.href);
			if (url.origin !== window.location.origin) return;
			// Same page (no navigation) — skip
			if (
				url.pathname === window.location.pathname &&
				url.search === window.location.search
			)
				return;

			start();
		};

		document.addEventListener("click", onClick, { capture: true });
		return () =>
			document.removeEventListener("click", onClick, { capture: true });
	}, []);

	// Finish when the new route commits (pathname changes)
	useEffect(() => {
		if (navigating.current) finish();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	// Clear pending timers on unmount
	useEffect(() => () => clearTimers(), []);

	return (
		<div className={`top-progress ${visible ? "visible" : ""}`} aria-hidden>
			<div className="top-progress-bar" style={{ width: `${progress}%` }} />
		</div>
	);
}
