import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
	id: number;
	name: string;
	price: string;
	image: string;
	quantity: number;
	size?: string;
	addOns?: string[];
	specialInstructions?: string;
	totalPrice: number;
	restaurantId: string;
	restaurantName: string;
}

interface CartStore {
	items: CartItem[];
	addItem: (item: CartItem) => void;
	removeItem: (itemId: number, size?: string, addOns?: string[]) => void;
	updateQuantity: (
		itemId: number,
		quantity: number,
		size?: string,
		addOns?: string[],
	) => void;
	clearCart: () => void;
	totalItems: number;
	totalPrice: number;
}

export const useCart = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],

			addItem: (newItem) => {
				set((state) => {
					// Check if same item with same customizations exists
					const existingIndex = state.items.findIndex(
						(item) =>
							item.id === newItem.id &&
							item.size === newItem.size &&
							JSON.stringify(item.addOns) === JSON.stringify(newItem.addOns),
					);

					if (existingIndex >= 0) {
						const updated = [...state.items];
						updated[existingIndex].quantity += newItem.quantity;
						updated[existingIndex].totalPrice += newItem.totalPrice;
						return { items: updated };
					}

					return { items: [...state.items, newItem] };
				});
			},

			removeItem: (itemId, size, addOns) => {
				set((state) => ({
					items: state.items.filter(
						(item) =>
							!(
								item.id === itemId &&
								item.size === size &&
								JSON.stringify(item.addOns) === JSON.stringify(addOns)
							),
					),
				}));
			},

			updateQuantity: (itemId, quantity, size, addOns) => {
				if (quantity <= 0) {
					get().removeItem(itemId, size, addOns);
					return;
				}

				set((state) => ({
					items: state.items.map((item) => {
						if (
							item.id === itemId &&
							item.size === size &&
							JSON.stringify(item.addOns) === JSON.stringify(addOns)
						) {
							const unitPrice = item.totalPrice / item.quantity;
							return { ...item, quantity, totalPrice: unitPrice * quantity };
						}
						return item;
					}),
				}));
			},

			clearCart: () => {
				set({ items: [] });
			},

			get totalItems() {
				return get().items.reduce((sum, item) => sum + item.quantity, 0);
			},

			get totalPrice() {
				return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
			},
		}),
		{
			name: "cart-storage", // name for localStorage key
			partialize: (state) => ({ items: state.items }), // only persist items
		},
	),
);
