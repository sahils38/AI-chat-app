import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChatMessageProps {
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
  isAnimated?: boolean;
}

export function ChatMessage({ sender, content, timestamp, isAnimated = true }: ChatMessageProps) {
  const isUser = sender === "user";
  
  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start",
        isAnimated && "animate-message-in"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <svg
            className="w-4 h-4 text-primary-foreground"
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
      )}
      
      <div className={cn("max-w-[75%] flex flex-col", isUser && "items-end")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-message",
            isUser
              ? "bg-chat-user-bubble text-chat-user-text rounded-br-md"
              : "bg-chat-ai-bubble text-chat-ai-text rounded-bl-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>
        <span className="text-xs text-chat-timestamp mt-1.5 px-1">
          {format(timestamp, "h:mm a")}
        </span>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <svg
            className="w-4 h-4 text-secondary-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
