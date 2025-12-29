export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 animate-fade-in">
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
      
      <div className="bg-chat-ai-bubble px-4 py-3 rounded-2xl rounded-bl-md shadow-message">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 bg-chat-typing rounded-full animate-typing-dot"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-chat-typing rounded-full animate-typing-dot"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="w-2 h-2 bg-chat-typing rounded-full animate-typing-dot"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      </div>
    </div>
  );
}
