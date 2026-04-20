import apiClient, { type ApiResponse } from "../client"
import { ENDPOINTS } from "../endpoints"
import type { SendMessageRequest, StartConversationRequest, PaginatedResponse } from "@/types/api"
import type { Conversation, Message } from "@/types/models"

export const chatService = {
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    const response = await apiClient.get(ENDPOINTS.CHAT.CONVERSATIONS)
    return response.data
  },

  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    const response = await apiClient.get(ENDPOINTS.CHAT.CONVERSATION(id))
    return response.data
  },

  async getMessages(conversationId: string, page = 1): Promise<PaginatedResponse<Message>> {
    const response = await apiClient.get(ENDPOINTS.CHAT.MESSAGES(conversationId), {
      params: { page },
    })
    return response.data
  },

  async sendMessage(conversationId: string, data: SendMessageRequest): Promise<ApiResponse<Message>> {
    const response = await apiClient.post(ENDPOINTS.CHAT.SEND_MESSAGE(conversationId), data)
    return response.data
  },

  async markAsRead(conversationId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post(ENDPOINTS.CHAT.MARK_READ(conversationId))
    return response.data
  },

  async startConversation(data: StartConversationRequest): Promise<ApiResponse<Conversation>> {
    const response = await apiClient.post(ENDPOINTS.CHAT.START_CONVERSATION, data)
    return response.data
  },
}
