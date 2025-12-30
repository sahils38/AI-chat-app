import { Router, Request, Response } from "express";
import {
  createConversation,
  getConversation,
  saveMessage,
  getConversationHistory,
  getMessages,
} from "../services/chat.js";
import { generateReply } from "../services/llm.js";

const router = Router();

interface ChatMessageRequest {
  message: string;
  sessionId?: string;
}

interface ChatMessageResponse {
  reply: string;
  sessionId: string;
}

interface ErrorResponse {
  error: string;
  sessionId?: string;
}

// POST /chat/message - Send a message and get AI reply
router.post(
  "/message",
  async (
    req: Request<object, ChatMessageResponse | ErrorResponse, ChatMessageRequest>,
    res: Response<ChatMessageResponse | ErrorResponse>
  ) => {
    try {
      const { message, sessionId } = req.body;

      // Validate input
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required and must be a string" });
      }

      const trimmedMessage = message.trim();
      if (trimmedMessage.length === 0) {
        return res.status(400).json({ error: "Message cannot be empty" });
      }

      // Truncate very long messages
      const finalMessage = trimmedMessage.slice(0, 2000);

      // Get or create conversation
      let conversationId = sessionId;

      if (conversationId) {
        // Verify conversation exists
        const conversation = await getConversation(conversationId);
        if (!conversation) {
          // Create new if invalid sessionId
          conversationId = await createConversation();
        }
      } else {
        // Create new conversation
        conversationId = await createConversation();
      }

      // Save user message
      await saveMessage(conversationId, "user", finalMessage);

      // Get conversation history for context
      const history = await getConversationHistory(conversationId);

      // Generate AI reply
      let reply: string;
      try {
        reply = await generateReply(history.slice(0, -1), finalMessage); // Exclude the just-added message
      } catch (llmError) {
        console.error("LLM Error:", llmError);

        const errorMessage =
          llmError instanceof Error && llmError.message.includes("API key")
            ? "AI service is not properly configured. Please check the API key."
            : "I'm having trouble connecting to the AI service right now. Please try again in a moment.";

        // Save error response as AI message
        await saveMessage(conversationId, "ai", errorMessage);

        return res.status(500).json({
          error: errorMessage,
          sessionId: conversationId,
        });
      }

      // Save AI reply
      await saveMessage(conversationId, "ai", reply);

      return res.json({
        reply,
        sessionId: conversationId,
      });
    } catch (error) {
      console.error("Chat error:", error);
      return res.status(500).json({
        error: "An unexpected error occurred. Please try again.",
      });
    }
  }
);

// GET /chat/history/:sessionId - Get conversation history
router.get(
  "/history/:sessionId",
  async (req: Request<{ sessionId: string }>, res: Response) => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      const conversation = await getConversation(sessionId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const messages = await getMessages(sessionId);

      return res.json({
        sessionId,
        messages: messages.map((m) => ({
          id: m.id,
          sender: m.sender,
          content: m.content,
          timestamp: m.created_at,
        })),
      });
    } catch (error) {
      console.error("History error:", error);
      return res.status(500).json({
        error: "Failed to fetch conversation history",
      });
    }
  }
);

export default router;
