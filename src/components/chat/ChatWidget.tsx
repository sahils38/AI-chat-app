import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  sender: "ai",
  content: "Hi there! Welcome to Cozy Cart support. I'm here to help with any questions about our products, shipping, returns, or anything else. How can I assist you today?",
  timestamp: new Date(),
};

const SESSION_KEY = "chat_session_id";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load session and history from server
  useEffect(() => {
    const storedSessionId = localStorage.getItem(SESSION_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadConversationHistory(storedSessionId);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const loadConversationHistory = async (sid: string) => {
    try {
      const response = await fetch(`${API_BASE}/chat/history/${sid}`);

      if (!response.ok) {
        // Session not found, clear it
        if (response.status === 404) {
          localStorage.removeItem(SESSION_KEY);
          setSessionId(null);
        }
        return;
      }

      const data = await response.json();

      if (data.messages && data.messages.length > 0) {
        const loadedMessages: Message[] = data.messages.map((msg: {
          id: string;
          sender: "user" | "ai";
          content: string;
          timestamp: string;
        }) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages([WELCOME_MESSAGE, ...loadedMessages]);
      }
    } catch (error) {
      console.error("Failed to load conversation history:", error);
    }
  };

  const handleSend = useCallback(async (content: string) => {
    if (!content.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (content.length > 2000) {
      toast.warning("Message truncated to 2000 characters");
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: content.slice(0, 2000),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content.slice(0, 2000),
          sessionId: sessionId || undefined,
        }),
      });

      const data = await response.json();

      // Save session ID
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem(SESSION_KEY, data.sessionId);
      }

      if (!response.ok) {
        toast.error(data.error || "Something went wrong. Please try again.");

        const errorMessage: Message = {
          id: `ai-error-${Date.now()}`,
          sender: "ai",
          content: data.error || "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Network error. Please check your connection and try again.");

      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        sender: "ai",
        content: "I'm sorry, I couldn't connect to the server. Please make sure the server is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const handleNewChat = () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    toast.success("Started a new conversation");
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-widget overflow-hidden border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-widget-header text-widget-header-text">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg">Cozy Cart Support</h2>
            <div className="flex items-center gap-1.5 text-sm opacity-90">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft" />
              <span>Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          className="p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors"
          title="Start new conversation"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar bg-background"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            sender={message.sender}
            content={message.content}
            timestamp={message.timestamp}
            isAnimated={message.id.startsWith("user-") || message.id.startsWith("ai-")}
          />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder={isLoading ? "Agent is typing..." : "Type your message..."}
      />
    </div>
  );
}
