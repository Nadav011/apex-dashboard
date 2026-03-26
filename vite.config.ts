import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: false, // We serve our own /public/manifest.webmanifest
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
				navigateFallback: "/index.html",
				navigateFallbackDenylist: [/\/api\//],
				// Exclude sensitive API/auth paths from SW cache
				runtimeCaching: [],
				cleanupOutdatedCaches: true,
				skipWaiting: true,
				clientsClaim: true,
			},
		}),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	build: {
		rolldownOptions: {
			output: {
				codeSplitting: {
					minSize: 50000,
					groups: [
						{ name: "echarts", test: /echarts/ },
						{ name: "motion", test: /motion/ },
						{ name: "vendor", test: /node_modules/ },
					],
				},
			},
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:8743",
				changeOrigin: true,
			},
		},
	},
});
