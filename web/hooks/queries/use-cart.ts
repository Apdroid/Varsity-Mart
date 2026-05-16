"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cartApi } from "@/lib/api/cart"
import type { AddToCartRequest, UpdateCartItemRequest } from "@/lib/api/types"

export const cartKeys = {
	all: ["cart"] as const,
	cart: () => [...cartKeys.all, "items"] as const,
}

type AnyRecord = Record<string, unknown>

function asRecord(value: unknown): AnyRecord {
	return typeof value === "object" && value !== null ? (value as AnyRecord) : {}
}

function asNumber(value: unknown, fallback = 0): number {
	if (typeof value === "number" && Number.isFinite(value)) return value
	if (typeof value === "string") {
		const parsed = Number(value)
		return Number.isFinite(parsed) ? parsed : fallback
	}
	return fallback
}

function asString(value: unknown, fallback = ""): string {
	return typeof value === "string" ? value : fallback
}

export type NormalizedCartItem = {
	id: string
	productId: string
	name: string
	image: string
	storeName?: string
	inStock?: boolean
	quantity: number
	unitPrice: number
	subtotal: number
}

export type NormalizedCart = {
	items: NormalizedCartItem[]
	total: number
	itemCount: number
}

export function normalizeCartData(rawCart: unknown): NormalizedCart {
	const cart = asRecord(rawCart)
	const rawItems = Array.isArray(cart.items) ? cart.items : []

	const items = rawItems
		.map((item): NormalizedCartItem | null => {
			const cartItem = asRecord(item)

			const quantity = asNumber(cartItem.quantity, 0)
			const unitPrice = asNumber(cartItem.product_price, 0)
			const subtotal = asNumber(cartItem.sub_total, unitPrice * quantity)

			return {
				id: asString(cartItem.id),
				productId: asString(cartItem.product),
				name: asString(cartItem.product_title),
				image: asString(cartItem.product_image),
				storeName: asString(cartItem.store_name || cartItem.seller_name || cartItem.store || ""),
				inStock: typeof cartItem.inStock === "boolean"
					? cartItem.inStock
					: typeof cartItem.in_stock === "boolean"
						? cartItem.in_stock
						: true,
				quantity,
				unitPrice,
				subtotal,
			}
		})
		.filter((item): item is NormalizedCartItem => !!item && item.id.length > 0)

	const derivedTotal = items.reduce((sum, item) => sum + item.subtotal, 0)
	const derivedItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

	return {
		items,
		total: asNumber(cart.total, derivedTotal),
		itemCount: asNumber(cart.itemCount ?? cart.item_count, derivedItemCount),
	}
}

function recompute(items: NormalizedCartItem[]): Pick<NormalizedCart, "total" | "itemCount"> {
	return {
		total: items.reduce((sum, item) => sum + item.subtotal, 0),
		itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
	}
}

export function useCart(options?: { enabled?: boolean }) {
	return useQuery({
		queryKey: cartKeys.cart(),
		queryFn: async () => {
			const response = await cartApi.get()
			return normalizeCartData(response.data)
		},
		enabled: options?.enabled ?? true,
		staleTime: 2 * 60 * 1000,
	})
}

export function useAddToCart() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: cartKeys.all,
		mutationFn: (data: AddToCartRequest) => cartApi.add(data),
		onSettled: () => {
			// Need real server data for newly added item (ID, stock status, etc.)
			queryClient.invalidateQueries({ queryKey: cartKeys.cart() })
		},
	})
}

export function useUpdateCartItem() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: cartKeys.all,
		mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemRequest }) =>
			cartApi.update(itemId, data),
		onMutate: async ({ itemId, data }) => {
			await queryClient.cancelQueries({ queryKey: cartKeys.cart() })
			const previousCart = queryClient.getQueryData<NormalizedCart>(cartKeys.cart())

			if (previousCart) {
				const updatedItems = previousCart.items.map((item) =>
					item.id === itemId
						? { ...item, quantity: data.quantity, subtotal: item.unitPrice * data.quantity }
						: item
				)
				queryClient.setQueryData<NormalizedCart>(cartKeys.cart(), {
					items: updatedItems,
					...recompute(updatedItems),
				})
			}

			return { previousCart }
		},
		onError: (_, __, context) => {
			if (context?.previousCart) {
				queryClient.setQueryData(cartKeys.cart(), context.previousCart)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: cartKeys.cart() })
		},
	})
}

export function useRemoveFromCart() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: cartKeys.all,
		mutationFn: (itemId: string) => cartApi.remove(itemId),
		onMutate: async (itemId) => {
			await queryClient.cancelQueries({ queryKey: cartKeys.cart() })
			const previousCart = queryClient.getQueryData<NormalizedCart>(cartKeys.cart())

			if (previousCart) {
				const updatedItems = previousCart.items.filter((item) => item.id !== itemId)
				queryClient.setQueryData<NormalizedCart>(cartKeys.cart(), {
					items: updatedItems,
					...recompute(updatedItems),
				})
			}

			return { previousCart }
		},
		onError: (_, __, context) => {
			if (context?.previousCart) {
				queryClient.setQueryData(cartKeys.cart(), context.previousCart)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: cartKeys.cart() })
		},
	})
}

export function useClearCart() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: cartKeys.all,
		mutationFn: () => cartApi.clear(),
		onSuccess: () => {
			queryClient.setQueryData<NormalizedCart>(cartKeys.cart(), {
				items: [],
				total: 0,
				itemCount: 0,
			})
		},
	})
}
