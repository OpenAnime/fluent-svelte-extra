import path from "path";
import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-auto";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";
import prefixer from "postcss-variables-prefixer";

import a11yEmoji from "@fec/remark-a11y-emoji";
import slug from "rehype-slug";
import github from "remark-github";
import examples from "mdsvexamples";
import examplesVite from "mdsvexamples/vite";

import sveld from "vite-plugin-sveld";

import { mdsvex } from "mdsvex";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	vitePlugin: {
		experimental: {
			useVitePreprocess: true
		}
	},
	extensions: [".svelte", ".md", ".svx"],
	preprocess: [
		mdsvex({
			extensions: [".svx", ".md"],
			remarkPlugins: [
				github,
				a11yEmoji,
				[
					examples,
					{
						ExampleComponent: "/src/site/lib/Example/Example.svelte"
					}
				]
			],
			rehypePlugins: [slug]
		}),
		preprocess({
			postcss: {
				plugins: [autoprefixer(), cssnano(), prefixer({ prefix: "fds-" })]
			}
		})
	],
	kit: {
		adapter: adapter(),
		vite: {
			plugins: [sveld(), examplesVite],
			resolve: {
				extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", "svg"],
				alias: {
					$site: path.resolve("src/site"),
					"fluent-svelte-extra": path.resolve("src/lib")
				}
			}
		}
	}
};

export default config;
