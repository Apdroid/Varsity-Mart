export interface ConversationData {
  id: string;
  user: { name: string; avatar: string; isOnline: boolean };
  lastMessage: string;
  time: string;
  unread: number;
  product?: { title: string; image: string };
}

export const mockConversations: ConversationData[] = [
  {
    id: "1",
    user: { name: "John M.", avatar: "/male-student-portrait.png", isOnline: true },
    lastMessage: "Is the MacBook still available?",
    time: "2m ago",
    unread: 2,
    product: { title: 'MacBook Pro 13" M2', image: "/silver-macbook-on-desk.png" },
  },
  {
    id: "2",
    user: { name: "Sarah L.", avatar: "", isOnline: false },
    lastMessage: "Thank you! I received the order",
    time: "1h ago",
    unread: 0,
  },
  {
    id: "3",
    user: { name: "Mike J.", avatar: "", isOnline: true },
    lastMessage: "Can you do GH₵600 for the earbuds?",
    time: "3h ago",
    unread: 1,
    product: { title: "Sony WF-1000XM4", image: "/wireless-earbuds-sony.jpg" },
  },
];

