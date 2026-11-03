import { useSyncExternalStore } from "react"

const noopSubscribe = () => () => {}

/**
 * False during server render and hydration, true once on the client.
 * Use it instead of a `mounted` state + effect for client-only UI.
 */
export function useHydrated() {
	return useSyncExternalStore(noopSubscribe, () => true, () => false)
}
