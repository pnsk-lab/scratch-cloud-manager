import tailwind from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import solid from "vite-plugin-solid";
import colors from "picocolors";

function forScratch(): Plugin {
	return {
		name: "for-scratch",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				res.setHeader("Access-Control-Allow-Origin", "https://scratch.mit.edu");
				if (req.url === "/") {
					try {
						const transformedResult = await server.transformRequest(
							"/src/index.tsx",
						);
						const code = transformedResult?.code || "";
						res.setHeader("Content-Type", "application/javascript");
						res.setHeader(
							"Cache-Control",
							"no-cache, no-store, must-revalidate",
						);
						res.statusCode = 200;
						res.end(code);
					} catch (e) {
						console.error("Error transforming file:", e);
						res.statusCode = 500;
						res.end(`Error processing /src/index.tsx: ${e}`);
					}
				} else {
					next();
				}
			});
			// https://github.com/vitejs/vite/blob/fd38d076fe2455aac1e00a7b15cd51159bf12bb5/packages/vite/src/node/logger.ts#L173
			const colorUrl = (url: string) =>
				colors.cyan(
					url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`),
				);
			const _printUrls = server.printUrls.bind(server);
			server.printUrls = () => {
				const res = _printUrls();
				process.stdout.write(
					`  ${colors.green("➜")}  ${colors.bold("Scratch")}: ${
						colorUrl("https://scratch.mit.edu/projects/1169595651/")
					}\n`,
				);
				const code = `${
					colors.magenta('import')
				}${colors.green('(')}${colors.cyan(`"http://localhost:${server.config.server.port}"`)}${colors.green(')')}`;
				process.stdout.write(
					`  ${colors.green("➜")}  ${colors.bold("Inject")}:  ${
						code
					}\n`,
				);
				return res;
			};
		},
	};
}
export default defineConfig({
	plugins: [solid(), tailwind(), forScratch()],
	server: {
		cors: true,
	},
	build: {
		lib: {
			entry: "./src/index.tsx",
			name: "ScratchCloudManager",
			fileName: "scratch-cloud-manager",
			formats: ["es"],
		}
	}
});
