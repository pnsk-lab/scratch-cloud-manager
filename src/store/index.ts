import { createContext } from "solid-js";
import type { SetStoreFunction, Store } from "solid-js/store";
import type { SendFunction } from "../lib";

export interface ManagerStore {
	websocketState: {
		connecting: boolean;
		send?: SendFunction;
	};
	cloudData: {
		[key: string]: {
			value: number;
			updatedAt: number;
			updatedBy: string;
		};
	};
}
export const StoreContext =
	createContext<[Store<ManagerStore>, SetStoreFunction<ManagerStore>]>();
