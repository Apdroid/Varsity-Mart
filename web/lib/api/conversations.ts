import { api } from "./client"
import type {
	ApiResponse,
	Conversation,
	ConversationListResponse,
	MessageListResponse,
	Message,
	SendMessageRequest,
	StartConversationRequest,
} from "./types"

export const conversationsApi = {
	list: (page = 1, limit = 20) =>
		api.get<ConversationListResponse>(`/conversations/?page=${page}&limit=${limit}`),

	start: (data: StartConversationRequest) =>
		api.post<ApiResponse<Conversation>>("/conversations/start/", data),

	messages: (conversationId: string, page = 1, limit = 50) =>
		api.get<MessageListResponse>(`/conversations/${conversationId}/messages/?page=${page}&limit=${limit}`),

	send: (conversationId: string, data: SendMessageRequest) =>
		api.post<ApiResponse<Message>>(`/conversations/${conversationId}/send_message/`, data),

	markRead: (conversationId: string) =>
		api.post<ApiResponse<{ success: boolean }>>(`/conversations/${conversationId}/read/`),

	report: (messageId: string, reason: string) =>
		api.post<ApiResponse<{ reportId: string }>>(`/messages/${messageId}/report/`, { reason }),
}
