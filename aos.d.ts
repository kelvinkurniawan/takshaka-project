declare module "aos" {
	interface AOSOptions {
		duration?: number;
		delay?: number;
		once?: boolean;
		offset?: number;
		easing?: string;
		[key: string]: any;
	}

	interface AOS {
		init(options?: AOSOptions): void;
		refresh(): void;
		refreshHard(): void;
	}

	const aos: AOS;
	export default aos;
}

declare module "aos/dist/aos.css" {
	export {};
}
