"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInit() {
	const pathname = usePathname();

	useEffect(() => {
		// initialize with default settings, you can customize options here
		AOS.init({
			// once: true ensures animation happens only once when scrolling down
			once: true,
			// you can add other default options if you wish
		});
	}, []);

	// refresh AOS on navigation so new elements animate properly
	useEffect(() => {
		AOS.refresh();
	}, [pathname]);

	return null;
}
