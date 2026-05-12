import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { conversationsApi } from "@/lib/api/conversations"
import type { SendMessageRequest, StartConversationRequest } from "@/lib/api/types"

export function useConversations(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["conversations", page, limit],
    queryFn: () => conversationsApi.list(page, limit),
  })
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => conversationsApi.get(conversationId),
    enabled: !!conversationId,
  })
}

export function useMessages(conversationId: string, page = 1, limit = 50) {
  return useQuery({
    queryKey: ["messages", conversationId, page, limit],
    queryFn: () => conversationsApi.messages(conversationId, page, limit),
    enabled: !!conversationId,
    refetchInterval: 10000,
  })
}

export function useStartConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: StartConversationRequest) => conversationsApi.start(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SendMessageRequest) => conversationsApi.send(conversationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

export function useMarkConversationAsRead(conversationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => conversationsApi.markRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] })
    },
  })
}

export function useReportMessage() {
  return useMutation({
    mutationFn: ({ messageId, reason }: { messageId: string; reason: string }) =>
      conversationsApi.report(messageId, reason),
  })
}
