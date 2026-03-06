/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				elegance: ['"Noto Serif Display"', "serif"],
			},
			colors: {
				primary: "rgb(59, 130, 246)", // Blue-500 as primary
				background: "var(--background)",
				foreground: "var(--foreground)",
				gray: {
					50: "var(--gray-50)",
					100: "var(--gray-100)",
					200: "var(--gray-200)",
					300: "var(--gray-300)",
					400: "var(--gray-400)",
					500: "var(--gray-500)",
					600: "var(--gray-600)",
					700: "var(--gray-700)",
					800: "var(--gray-800)",
					900: "var(--gray-900)",
					850: "var(--gray-850)",
					750: "var(--gray-750)",
				},
			},
		},
	},
	plugins: [],
};
