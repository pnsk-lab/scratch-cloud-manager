import { Show, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { Manager } from "./features/manager";
import { enableCloudEvenSeenProgram } from "./lib";
import { type ManagerStore, StoreContext } from "./store";

function App() {
	const [getIsOpen, setIsOpen] = createSignal(false);

	const _store = createStore<ManagerStore>({
		websocketState: {
			connecting: false,
			send: undefined,
		},
		cloudData: {},
	});
	const [store, setStore] = _store;

	onMount(() => {
		enableCloudEvenSeenProgram();
	});

	return (
		<StoreContext.Provider value={_store}>
			<div class="fixed right-0 bottom-0 p-4">
				<div
					class="bg-slate-50 drop-shadow-sm transition-all"
					classList={{
						"rounded-full flex justify-center items-center w-10 h-10 p-2 hover:bg-slate-100":
							!getIsOpen(),
						"rounded-md w-50 h-80 flex flex-col gap-2 p-4": getIsOpen(),
					}}
				>
					<div
						class="flex items-center w-full gap-2"
						classList={{
							"justify-start": getIsOpen(),
							"justify-center h-full": !getIsOpen(),
						}}
					>
						<button
							type="button"
							onClick={() => setIsOpen(true)}
							title="Cloud Manager"
							class="bg-slate-900 w-6 h-6 i-tabler-cloud"
						/>
						<Show when={getIsOpen()}>
							<div>Cloud Manager</div>
							<div class="flex flex-1 justify-end">
								<button
									type="button"
									onClick={() => setIsOpen(false)}
									class="bg-slate-900 w-4 h-4 i-tabler-chevron-down"
								/>
							</div>
						</Show>
					</div>
					<Show when={getIsOpen()}>
						<div class="h-px w-full bg-slate-200" />
						<Manager />
					</Show>
				</div>
			</div>
		</StoreContext.Provider>
	);
}

export default App;
