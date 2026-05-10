export interface MessageData {
  id: string;
  senderId: "me" | "other";
  content: string;
  time: string;
}

export const mockMessages: MessageData[] = [
  { id: "1", senderId: "other", content: "Hi! Is the MacBook still available?", time: "10:30 AM" },
  { id: "2", senderId: "me", content: "Yes, it is! Are you interested?", time: "10:32 AM" },
  { id: "3", senderId: "other", content: "Yes! What's the battery health?", time: "10:33 AM" },
  {
    id: "4",
    senderId: "me",
    content: "Battery health is at 98%. Only 45 cycles. Been very careful with it.",
    time: "10:35 AM",
  },
  { id: "5", senderId: "other", content: "That's great! Can I see it tomorrow on campus?", time: "10:36 AM" },
  { id: "6", senderId: "me", content: "I'm usually at the library. We can meet there around 2pm?", time: "10:38 AM" },
  { id: "7", senderId: "other", content: "Is the MacBook still available?", time: "Just now" },
];

