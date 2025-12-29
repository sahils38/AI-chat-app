import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Store knowledge for the chatbot
const STORE_KNOWLEDGE = `
You are a helpful and friendly customer support agent for "Cozy Cart" - a small online home goods and lifestyle store.

## Store Information
- Store Name: Cozy Cart
- Website: cozy-cart.store (fictional)
- Business Hours: Monday-Friday 9 AM - 6 PM EST
- Customer Support Email: support@cozy-cart.store

## Shipping Policy
- Free standard shipping on orders over $50
- Standard shipping (5-7 business days): $5.99
- Express shipping (2-3 business days): $12.99
- Overnight shipping (next business day): $24.99
- We ship to all 50 US states
- International shipping available to Canada, UK, and EU countries (+$15 flat rate)
- Orders placed before 2 PM EST ship the same business day

## Return & Refund Policy
- 30-day hassle-free return policy
- Items must be unused and in original packaging
- Free returns on defective items
- Return shipping is $5.99 (deducted from refund) for non-defective returns
- Refunds processed within 5-7 business days after receiving the return
- Store credit available as an alternative (bonus 10% added)

## Product Categories
- Home Decor (candles, throw pillows, wall art)
- Kitchen & Dining (mugs, utensils, cutting boards)
- Bedding & Bath (towels, sheets, blankets)
- Outdoor Living (planters, garden tools)

## Current Promotions
- New customer: 15% off first order with code WELCOME15
- Free gift with orders over $100

## Payment Methods
- All major credit cards (Visa, Mastercard, Amex, Discover)
- PayPal
- Shop Pay / Apple Pay / Google Pay
- Afterpay (buy now, pay later in 4 installments)

## Guidelines for Responses
- Be warm, friendly, and helpful
- Keep answers concise but complete
- If you don't know something specific, acknowledge it and offer to help find the answer
- Always offer to help with anything else at the end
- Never make up information not in this knowledge base
- For complex issues, suggest contacting support@cozy-cart.store
`;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build conversation history for context
    const chatHistory = [];

    // Add system context as first user message (Gemini doesn't have system role)
    chatHistory.push({
      role: "user",
      parts: [{ text: `Context: ${STORE_KNOWLEDGE}\n\nPlease respond as this customer support agent.` }],
    });
    chatHistory.push({
      role: "model",
      parts: [{ text: "Understood! I'm ready to help as a Cozy Cart customer support agent." }],
    });

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        chatHistory.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    }

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
    });

    // Send the new message
    const result = await chat.sendMessage(message.slice(0, 2000));
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);

    if (error.message?.includes("API key")) {
      return res.status(500).json({ error: "Invalid API key configuration" });
    }

    res.status(500).json({
      error: "Failed to get response from AI. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
