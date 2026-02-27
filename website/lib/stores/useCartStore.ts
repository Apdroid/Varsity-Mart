import { useCartStore } from "./cart-store";
import useStore from "./useStore";

// Next.js safe hooks for cart store
export const useCartItems = () =>
	useStore(useCartStore, (state) => state.items);
export const useCartTotalItems = () =>
	useStore(useCartStore, (state) => state.totalItems);
export const useCartSubtotal = () =>
	useStore(useCartStore, (state) => state.subtotal);

// Actions - access them directly without wrapper since they're stable functions
export const useCartActions = () => useCartStore.getState();
