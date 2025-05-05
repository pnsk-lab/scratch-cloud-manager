import { For, Show, createEffect, createSignal, useContext } from "solid-js";
import { connectedWebSocketWatcher, getProjectId, getUserId } from "../../lib";
import { StoreContext } from "../../store";

function NotConnected() {
	// biome-ignore lint/style/noNonNullAssertion: StoreContext is always provided
	const [store, setStore] = useContext(StoreContext)!;

	const onSet = (evt: {
		method: "set";
		project_id: string;
		name: string;
		value: number;
		user: string;
	}) => {
		setStore("cloudData", evt.name, {
			value: evt.value,
			updatedAt: Date.now(),
			updatedBy: evt.user,
		});
	};
	return (
		<div class="h-full flex flex-col items-center justify-center gap-2">
			<div class="text">Not connected.</div>
			<button
				disabled={store.websocketState.connecting}
				type="button"
				class="disabled:opacity-70 cursor-pointer disabled:cursor-progress bg-purple-600 hover:not-disabled:bg-purple-700 text-white h-8 px-3 rounded-full"
				onClick={async () => {
					setStore("websocketState", "connecting", true);

					const ws = new WebSocket("wss://clouddata.scratch.mit.edu");
					await new Promise((r) => ws.addEventListener("open", r));
					ws.send(
						JSON.stringify({
							method: "handshake",
							user: getUserId(),
							project_id: getProjectId(),
						}),
					);

					const send = await connectedWebSocketWatcher(
						(e) => {
							if (e.method === "set") {
								onSet(e);
							}
						},
						(e) => {
							if (e.method === "set") {
								onSet(e);
							}
						},
					);
					setStore("websocketState", {
						connecting: false,
						send,
					});
				}}
			>
				{store.websocketState.connecting ? "Connecting..." : "Handshake"}
			</button>
		</div>
	);
}

const formatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	hour12: false,
	minute: "2-digit",
	second: "2-digit",
});

function CloudData(props: {
	name: string;
	data: {
		value: number;
		updatedAt: number;
		updatedBy: string;
	};
}) {
	const [getIsOpenDetails, setIsOpenDetails] = createSignal(false);
	// biome-ignore lint/style/noNonNullAssertion: StoreContext is always provided
	const [store, setStore] = useContext(StoreContext)!;

	return (
		<div>
			<div class="flex items-center gap-2">
				<div class="text-slate-500">{props.name}</div>
				<div class="text-slate-400 font-mono flex-1 text-right">
					{props.data.value.toString().length > 20
						? `${props.data.value.toString().slice(0, 20)}...`
						: props.data.value}
				</div>
				<button
					type="button"
					title="Show details"
					class="i-tabler-dots"
					onClick={() => setIsOpenDetails((v) => !v)}
				/>
			</div>
			<Show when={getIsOpenDetails()}>
				<div
					style={{
						"border-left": "2px solid #e5e7eb",
					}}
					class="pl-2"
				>
					<div class="flex flex-col">
						<div class="flex items-center gap-2">
							<div class="i-tabler-database shrink-0" />
							<input
								value={props.data.value}
								readonly
								class="grow w-10 text-sm font-mono"
								onFocus={(e) => {
									e.target.select();
								}}
							/>
						</div>
						<div class="flex items-center">
							<div class="i-tabler-clock" />
							<div class="text-slate-500 text-sm ml-2">
								{formatter.format(new Date(props.data.updatedAt))}
							</div>
						</div>
						<div class="flex items-center">
							<div class="i-tabler-user-up" />
							<div class="text-blue-400 text-sm ml-2">
								<a
									href={`//scratch.mit.edu/users/${props.data.updatedBy}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									{props.data.updatedBy}
								</a>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<div class="i-tabler-pencil shrink-0" />
							<input
								placeholder="Enter value"
								class="grow w-10 text-sm font-mono"
								onChange={(e) => {
									const value = Number.parseInt(e.target.value);
									if (Number.isNaN(value)) {
										e.target.value = "";
										return;
									}
									store.websocketState.send?.({
										method: "set",
										user: getUserId(),
										project_id: getProjectId(),
										name: props.name,
										value: value,
									});

									e.target.value = "";
								}}
							/>
						</div>
					</div>
				</div>
			</Show>
		</div>
	);
}

export function Manager() {
	const [getCount, setCount] = createSignal(0);
	// biome-ignore lint/style/noNonNullAssertion: StoreContext is always provided
	const [store, setStore] = useContext(StoreContext)!;
	return (
		<div class="h-full">
			<Show when={store.websocketState.send} fallback={<NotConnected />}>
				<div class="flex flex-col gap-2">
					<For each={Object.entries(store.cloudData)}>
						{([name, data]) => <CloudData name={name} data={data} />}
					</For>
				</div>
			</Show>
		</div>
	);
}
