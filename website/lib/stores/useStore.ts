// useStore.ts - Next.js safe store hook using useSyncExternalStore
import { useEffect, useState } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import type { StoreApi } from "zustand";

const useStore = <T, F>(store: StoreApi<T>, callback: (state: T) => F) => {
	const result = useSyncExternalStore(
		store.subscribe,
		() => callback(store.getState()),
		() => callback(store.getInitialState?.() ?? store.getState()),
	);

	const [data, setData] = useState<F>();

	useEffect(() => {
		setData(result);
	}, [result]);

	return data;
};

export default useStore;
