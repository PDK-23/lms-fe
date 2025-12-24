import type { Conversation, ChatMessage } from "@/types";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    participantIds: ["user1", "instructor1"],
    participantNames: ["John Doe", "Dr. Sarah Wilson"],
    participantAvatars: [undefined, "https://i.pravatar.cc/150?img=5"],
    lastMessage: "Thank you for your help!",
    lastMessageTime: new Date("2025-12-22T14:30:00"),
    unreadCount: 0,
  },
  {
    id: "conv2",
    participantIds: ["user1", "instructor2"],
    participantNames: ["John Doe", "Prof. Michael Chen"],
    participantAvatars: [undefined, "https://i.pravatar.cc/150?img=12"],
    lastMessage: "Can you clarify the assignment requirements?",
    lastMessageTime: new Date("2025-12-22T10:15:00"),
    unreadCount: 2,
  },
  {
    id: "conv3",
    participantIds: ["user1", "support"],
    participantNames: ["John Doe", "Support Team"],
    participantAvatars: [undefined, undefined],
    lastMessage: "We'll look into this issue right away",
    lastMessageTime: new Date("2025-12-21T16:45:00"),
    unreadCount: 1,
  },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "msg1",
    conversationId: "conv1",
    senderId: "user1",
    senderName: "John Doe",
    content: "Hi Dr. Wilson, I have a question about the latest lesson.",
    timestamp: new Date("2025-12-22T14:00:00"),
    isRead: true,
  },
  {
    id: "msg2",
    conversationId: "conv1",
    senderId: "instructor1",
    senderName: "Dr. Sarah Wilson",
    senderAvatar: "https://i.pravatar.cc/150?img=5",
    content: "Hello John! I'd be happy to help. What's your question?",
    timestamp: new Date("2025-12-22T14:05:00"),
    isRead: true,
  },
  {
    id: "msg3",
    conversationId: "conv1",
    senderId: "user1",
    senderName: "John Doe",
    content:
      "I'm having trouble understanding the concept of state management in React. Could you explain it again?",
    timestamp: new Date("2025-12-22T14:10:00"),
    isRead: true,
  },
  {
    id: "msg4",
    conversationId: "conv1",
    senderId: "instructor1",
    senderName: "Dr. Sarah Wilson",
    senderAvatar: "https://i.pravatar.cc/150?img=5",
    content:
      "Of course! State management in React is about controlling data flow. Think of it as a way to manage and update data across your components. Would you like me to share some additional resources?",
    timestamp: new Date("2025-12-22T14:20:00"),
    isRead: true,
  },
  {
    id: "msg5",
    conversationId: "conv1",
    senderId: "user1",
    senderName: "John Doe",
    content: "Thank you for your help!",
    timestamp: new Date("2025-12-22T14:30:00"),
    isRead: true,
  },
  {
    id: "msg6",
    conversationId: "conv2",
    senderId: "user1",
    senderName: "John Doe",
    content: "Hi Prof. Chen, I have a question about Assignment 3.",
    timestamp: new Date("2025-12-22T09:00:00"),
    isRead: true,
  },
  {
    id: "msg7",
    conversationId: "conv2",
    senderId: "instructor2",
    senderName: "Prof. Michael Chen",
    senderAvatar: "https://i.pravatar.cc/150?img=12",
    content: "Sure, what would you like to know?",
    timestamp: new Date("2025-12-22T09:30:00"),
    isRead: true,
  },
  {
    id: "msg8",
    conversationId: "conv2",
    senderId: "user1",
    senderName: "John Doe",
    content: "Can you clarify the assignment requirements?",
    timestamp: new Date("2025-12-22T10:15:00"),
    isRead: false,
  },
];

export default { MOCK_CONVERSATIONS, MOCK_MESSAGES };
