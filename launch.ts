/**
 * @module
 * @example
 * ```ts
 * import { inject } from '@pnsk-lab/scratch-cloud-manager'
 *
 * inject()
 * ```
 */

export async function inject() {
	const css = await fetch("./dist/scratch-cloud-manager.css").then((res) =>
		res.text(),
	);
	const style = document.createElement("style");
	style.innerHTML = css;
	style.dataset.viteDevId = "prod";
	document.head.appendChild(style);

	const { default: renderManager } = await import(
		"./dist/scratch-cloud-manager.js"
	);
	renderManager();
}
