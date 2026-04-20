"use client"

import { queryKeys } from "@/lib/api/query-keys"
import { chatService } from "@/lib/api/services/chat.service"
import type { SendMessageRequest, StartConversationRequest } from "@/types/api"
import type { Message, User } from "@/types/models"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useConversations() {
	return useQuery({
		queryKey: queryKeys.chat.conversations(),
		queryFn: () => chatService.getConversations(),
		retry: 2,
	})
}

export function useConversation(id: string) {
	return useQuery({
		queryKey: queryKeys.chat.conversation(id),
		queryFn: () => chatService.getConversation(id),
		enabled: !!id,
		retry: 2,
	})
}

export function useMessages(conversationId: string) {
	return useInfiniteQuery({
		queryKey: queryKeys.chat.messages(conversationId),
		queryFn: ({ pageParam = 1 }) =>
			chatService.getMessages(conversationId, pageParam as number),
		getNextPageParam: (lastPage) => {
			if (lastPage.page < lastPage.totalPages) return lastPage.page + 1
			return undefined
		},
		initialPageParam: 1,
		enabled: !!conversationId,
	})
}

export function useSendMessage() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ conversationId, data }: { conversationId: string; data: SendMessageRequest }) =>
			chatService.sendMessage(conversationId, data),

		onMutate: async ({ conversationId, data }) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.chat.messages(conversationId) })

			const currentUser = queryClient.getQueryData<User | null>(queryKeys.user.profile())

			const optimisticMessage: Message = {
				id: `temp-${Date.now()}`,
				conversationId,
				senderId: currentUser?.id ?? "me",
				sender: currentUser ?? ({ id: "me", name: "You" } as unknown as User),
				content: data.content,
				type: data.type ?? "text",
				metadata: data.metadata,
				isRead: false,
				createdAt: new Date().toISOString(),
			}

			const prevMessages = queryClient.getQueryData(queryKeys.chat.messages(conversationId))

			queryClient.setQueryData(queryKeys.chat.messages(conversationId), (old: unknown) => {
				const pages = (old as { pages: { data: Message[] }[] } | undefined)?.pages
				if (!pages?.length) {
					return {
						pages: [{ data: [optimisticMessage], page: 1, totalPages: 1 }],
						pageParams: [1],
					}
				}
				return {
					...(old as object),
					pages: (old as { pages: { data: Message[] }[] }).pages.map(
						(page: { data: Message[] }, i: number, arr: { data: Message[] }[]) =>
							i === arr.length - 1
								? { ...page, data: [...(page.data ?? []), optimisticMessage] }
								: page,
					),
				}
			})

			return { prevMessages }
		},

		onError: (_err, { conversationId }, context) => {
			if (context?.prevMessages) {
				queryClient.setQueryData(queryKeys.chat.messages(conversationId), context.prevMessages)
			}
		},

		onSuccess: (_, { conversationId }) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(conversationId) })
			queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() })
		},
	})
}

export function useStartConversation() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: StartConversationRequest) => chatService.startConversation(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() })
		},
	})
}

export function useMarkAsRead() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (conversationId: string) => chatService.markAsRead(conversationId),
		onSuccess: (_, conversationId) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversation(conversationId) })
			queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations() })
		},
	})
}
