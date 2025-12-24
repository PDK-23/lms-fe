import { useState, useEffect, useRef } from "react";
import { Card, Button, Input } from "@/components/ui";
import { Send, Search, MoreVertical, ArrowLeft } from "lucide-react";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/mocks/chat";
import type { Conversation, ChatMessage } from "@/types";

export default function ChatPage() {
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(conversations[0]?.id || null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConversations, setShowConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation
  );
  const currentMessages = messages.filter(
    (m) => m.conversationId === selectedConversation
  );

  const filteredConversations = conversations.filter((c) =>
    c.participantNames.some((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: ChatMessage = {
      id: `msg${Date.now()}`,
      conversationId: selectedConversation,
      senderId: "user1",
      senderName: "John Doe",
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Conversations Sidebar */}
        <div
          className={`lg:col-span-4 p-0 overflow-hidden ${
            showConversations ? "block" : "hidden lg:block"
          }`}
        >
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConversation;
              const otherParticipant = conv.participantNames[1] || "Unknown";
              const avatar = conv.participantAvatars?.[1];

              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv.id);
                    setShowConversations(false);
                  }}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-neutral-50 border-b transition-colors ${
                    isSelected ? "bg-indigo-50" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={otherParticipant}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                        {otherParticipant.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-sm truncate">
                        {otherParticipant}
                      </div>
                      <div className="text-xs text-neutral-500 flex-shrink-0 ml-2">
                        {conv.lastMessageTime &&
                          formatTime(conv.lastMessageTime)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-600 truncate">
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`lg:col-span-8 p-0 flex flex-col overflow-hidden border-l ${
            !showConversations ? "block" : "hidden lg:flex"
          }`}
        >
          {selectedConversation && currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowConversations(true)}
                    className="lg:hidden"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {currentConversation.participantAvatars?.[1] ? (
                    <img
                      src={currentConversation.participantAvatars[1]}
                      alt={currentConversation.participantNames[1]}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                      {currentConversation.participantNames[1]?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">
                      {currentConversation.participantNames[1]}
                    </div>
                    <div className="text-xs text-neutral-500">Online</div>
                  </div>
                </div>
                <button className="p-2 hover:bg-neutral-100 rounded">
                  <MoreVertical className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((msg) => {
                  const isOwnMessage = msg.senderId === "user1";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          isOwnMessage ? "order-2" : "order-1"
                        }`}
                      >
                        {!isOwnMessage && (
                          <div className="flex items-center gap-2 mb-1">
                            {msg.senderAvatar ? (
                              <img
                                src={msg.senderAvatar}
                                alt={msg.senderName}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-neutral-300 flex items-center justify-center text-xs">
                                {msg.senderName.charAt(0)}
                              </div>
                            )}
                            <span className="text-xs text-neutral-600">
                              {msg.senderName}
                            </span>
                          </div>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            isOwnMessage
                              ? "bg-indigo-600 text-white"
                              : "bg-neutral-100 text-neutral-900"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <div
                          className={`text-xs text-neutral-500 mt-1 ${
                            isOwnMessage ? "text-right" : "text-left"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 text-sm"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
