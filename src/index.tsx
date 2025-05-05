/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App.tsx";

export default function renderManager() {
	const root = document.createElement("div");
	document.body.appendChild(root);
	const shadow = root.attachShadow({ mode: "open" });
	const app = document.createElement("div");
	shadow.appendChild(app);

	const css = document.querySelector(
		"style[data-vite-dev-id]",
	) as HTMLStyleElement;
	shadow.appendChild(css);

	render(() => <App />, app);
}
