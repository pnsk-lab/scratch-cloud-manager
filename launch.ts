/**
 * @module
 * @example
 * ```ts
 * import { inject } from '@pnsk-lab/scratch-cloud-manager'
 *
 * inject()
 * ```
 */

async function getCSS() {
	const res = await fetch(
		import.meta.resolve("./dist/scratch-cloud-manager.css"),
	).catch(() =>
		fetch(import.meta.resolve("../dist/scratch-cloud-manager.css")),
	); // for esm.sh
	return await res.text();
}
export async function inject() {
	const css = await getCSS();
	const style = document.createElement("style");
	style.innerHTML = css;
	style.dataset.viteDevId = "prod";
	document.head.appendChild(style);

	const { default: renderManager } = await import(
		"./dist/scratch-cloud-manager.js"
	);
	renderManager();
}
