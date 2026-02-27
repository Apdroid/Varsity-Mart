"use client"

import { queryKeys } from "@/lib/api/query-keys"
import { chatService } from "@/lib/api/services/chat.service"
import type { SendMessageRequest, StartConversationRequest } from "@/types/api"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mockConversations } from "@/data/messages/conversations"
import { mockMessages } from "@/data/messages/messages"

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.chat.conversations(),
    queryFn: async () => {
      try {
        return await chatService.getConversations()
      } catch (error) {
        console.warn("Conversations API failed, using mock data:", error)
        return {
          success: true,
          data: mockConversations,
        }
      }
    },
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.chat.conversation(id),
    queryFn: async () => {
      try {
        return await chatService.getConversation(id)
      } catch (error) {
        console.warn(`Conversation ${id} API failed, using mock data:`, error)
        const conversation = mockConversations.find((c) => c.id === id)
        if (!conversation) throw error
        return {
          success: true,
          data: conversation,
        }
      }
    },
    enabled: !!id,
  })
}

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.chat.messages(conversationId),
    queryFn: async ({ pageParam = 1 }) => {
      try {
        return await chatService.getMessages(conversationId, pageParam)
      } catch (error) {
        console.warn(`Messages API failed for ${conversationId}, using mock data:`, error)
        return {
          success: true,
          data: mockMessages,
          page: 1,
          totalPages: 1,
        }
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
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
