import Groq from "groq-sdk";

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

export interface Message {
  sender: "user" | "ai";
  content: string;
}

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export async function generateReply(
  history: Message[],
  userMessage: string
): Promise<string> {
  const client = getGroqClient();

  // Build messages array
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    {
      role: "system",
      content: STORE_KNOWLEDGE,
    },
  ];

  // Add conversation history (limit to last 20 messages for cost control)
  const recentHistory = history.slice(-20);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    });
  }

  // Add current user message
  messages.push({
    role: "user",
    content: userMessage.slice(0, 2000),
  });

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
}
