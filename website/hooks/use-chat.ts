"use client"

import { queryKeys } from "@/lib/api/query-keys"
import { chatService } from "@/lib/api/services/chat.service"
import type { SendMessageRequest, StartConversationRequest } from "@/types/api"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.chat.conversations(),
    queryFn: () => chatService.getConversations(),
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.chat.conversation(id),
    queryFn: () => chatService.getConversation(id),
    enabled: !!id,
  })
}

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.chat.messages(conversationId),
    queryFn: ({ pageParam = 1 }) => chatService.getMessages(conversationId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1
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
