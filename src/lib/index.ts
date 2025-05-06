export const getProjectId = () => {
	const url = new URL(window.location.href);
	return url.pathname.split("/")[2];
};
export const getUserId = () => {
	const username = document.querySelector(
		"#navigation > div > ul > li.link.right.account-nav > div > a > span",
	)?.textContent;
	if (!username) {
		throw new Error("User not found");
	}
	return username;
};

export interface HandshakeMessage {
	method: "handshake";
	user: string;
	project_id: string;
}
export interface SetMessage {
	method: "set";
	project_id: string;
	name: string;
	value: number;
	user: string;
}
export type SendFunction = (e: SetMessage | HandshakeMessage) => void;
export const connectedWebSocketWatcher = (
	onSend: (e: SetMessage | HandshakeMessage) => void,
	onReceive: (e: SetMessage) => void,
): SendFunction => {
	const _send = WebSocket.prototype.send;
	const wses = new Set<WebSocket>();
	WebSocket.prototype.send = function (data) {
		_send.call(this, data);
		if (this.url.startsWith("wss://clouddata.scratch.mit.edu")) {
			onSend(JSON.parse(data as string));
			if (!wses.has(this)) {
				wses.add(this);
				this.addEventListener("close", () => {
					wses.delete(this);
				});
				this.addEventListener("message", (e) => {
					const data = JSON.parse(e.data);
					onReceive(data);
				});
			}
		}
	};
	return (data) => {
		for (const ws of wses) {
			ws.send(`${JSON.stringify(data)}\n`);
		}
	};
};

export interface ReactFiber {
	child: ReactFiber | null;
	sibling: ReactFiber | null;
	// biome-ignore lint/complexity/noBannedTypes:
	type: string | Function;
	// biome-ignore lint/complexity/noBannedTypes:
	elementType: Function & {
		propTypes: Record<string, unknown>;
	};
}
export function getReactRootFiber() {
	const app = document.getElementById("app");
	if (!app) {
		return null;
	}
	// biome-ignore lint/suspicious/noExplicitAny:
	const root = (app as any)._reactRootContainer._internalRoot
		.current as ReactFiber;
	if (!root) {
		return null;
	}
	return root;
}
export function getSpecifiedFiber(
	root: ReactFiber,
	cond: (fiber: ReactFiber) => boolean,
) {
	const stack = [root];
	while (true) {
		const fiber = stack.pop();
		if (!fiber) {
			return null;
		}

		if (cond(fiber)) {
			return fiber;
		}
		if (fiber.child) {
			stack.push(fiber.child);
		}
		if (fiber.sibling) {
			stack.push(fiber.sibling);
		}
	}
}

export function enableCloudEvenSeenProgram() {
	const root = getReactRootFiber();
	if (!root) {
		return;
	}
	const cloudManagerHOCFiber = getSpecifiedFiber(root, (fiber) => {
		if (typeof fiber.type === "function") {
			const propTypes = fiber.elementType.propTypes;
			if (propTypes && "canModifyCloudData" in propTypes) {
				return true;
			}
		}
		return false;
	});
	if (!cloudManagerHOCFiber) {
		return;
	}
	const cloudManagerHOC = cloudManagerHOCFiber.elementType.prototype;
	cloudManagerHOC.disconnectFromCloud = () => null;
}
