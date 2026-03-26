import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
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
