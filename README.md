# AI Chat Support Agent

A mini AI support agent for a live chat widget, built as part of the Spur Founding Full-Stack Engineer take-home assignment.

## Live Demo

**Deployed URL:** [Add your deployed URL here]

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **AI/LLM:** Groq (Llama 3.3 70B)
- **UI Components:** shadcn-ui + Tailwind CSS

## Features

- Real-time AI chat powered by Google Gemini
- Conversation persistence in PostgreSQL
- Session management with automatic history loading
- Input validation and error handling
- Responsive chat UI with typing indicators
- "Agent is typing..." indicator during AI response

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  localhost:8080                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ChatWidget.tsx                                           │    │
│  │  - Manages UI state                                      │    │
│  │  - Stores sessionId in localStorage                      │    │
│  │  - Calls backend API                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express + TypeScript)                │
│  localhost:3001                                                  │
│                                                                  │
│  server/                                                         │
│  ├── index.ts          # Express server setup                   │
│  ├── routes/                                                     │
│  │   └── chat.ts       # API endpoints (/chat/message, etc.)    │
│  ├── services/                                                   │
│  │   ├── chat.ts       # Database operations                    │
│  │   └── llm.ts        # Gemini API integration                 │
│  └── db/                                                         │
│      ├── index.ts      # PostgreSQL connection pool             │
│      └── setup.ts      # Database schema setup                  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│      PostgreSQL         │     │     Google Gemini       │
│  ┌──────────────────┐   │     │                         │
│  │ conversations    │   │     │  gemini-1.5-flash       │
│  │  - id (UUID)     │   │     │                         │
│  │  - created_at    │   │     │  System prompt with     │
│  │  - updated_at    │   │     │  store knowledge        │
│  │  - metadata      │   │     │                         │
│  └──────────────────┘   │     └─────────────────────────┘
│  ┌──────────────────┐   │
│  │ messages         │   │
│  │  - id (UUID)     │   │
│  │  - conversation_id│  │
│  │  - sender        │   │
│  │  - content       │   │
│  │  - created_at    │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

## API Endpoints

### POST /chat/message
Send a message and receive an AI response.

**Request:**
```json
{
  "message": "What's your return policy?",
  "sessionId": "optional-uuid"
}
```

**Response:**
```json
{
  "reply": "We have a 30-day hassle-free return policy...",
  "sessionId": "uuid-of-conversation"
}
```

### GET /chat/history/:sessionId
Fetch conversation history.

**Response:**
```json
{
  "sessionId": "uuid",
  "messages": [
    {
      "id": "message-uuid",
      "sender": "user",
      "content": "Hello",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /health
Health check endpoint.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (install via Homebrew: `brew install postgresql@15`)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ai-chat-app
npm install
```

### 2. Set Up PostgreSQL

```bash
# Start PostgreSQL (if using Homebrew)
brew services start postgresql@15

# Create the database
psql postgres -c "CREATE DATABASE chat_app;"
```

### 3. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values:
# - GROQ_API_KEY: Get from https://console.groq.com/keys
# - DATABASE_URL: Your PostgreSQL connection string
```

### 4. Set Up Database Tables

```bash
npm run db:setup
```

### 5. Run the Application

```bash
npm run dev
```

This starts both:
- Frontend: http://localhost:8080
- Backend: http://localhost:3001

## LLM Integration Notes

### Provider
Using **Groq** with **Llama 3.3 70B** via the `groq-sdk`.

### Why Groq?
- Generous free tier (no quota issues)
- Extremely fast inference (custom LPU hardware)
- Llama 3.3 70B provides excellent quality for support use cases

### Prompting Strategy

The AI is configured as a customer support agent for "Cozy Cart" (fictional e-commerce store). The system prompt includes:

1. **Store Information:** Name, hours, contact details
2. **Shipping Policy:** Rates, delivery times, international shipping
3. **Return Policy:** 30-day returns, conditions, refund timeline
4. **Product Categories:** Home decor, kitchen, bedding, outdoor
5. **Promotions:** Current discount codes
6. **Payment Methods:** Cards, PayPal, buy-now-pay-later

### Context Management
- Last 20 messages are included for conversation context
- Messages truncated to 2000 characters for cost control
- System prompt contains all store knowledge (FAQ, policies)

### Error Handling
- API key validation
- Timeout handling
- Rate limit handling (returns friendly error message)
- Invalid response handling

## Robustness & Input Validation

- Empty messages are rejected (400 error)
- Long messages are truncated to 2000 characters
- Invalid sessionIds create new conversations
- All errors return user-friendly messages
- Backend never crashes on bad input
- No secrets in repository (uses .env)

## Deployment

### Quick Deploy (Recommended)

1. **Database:** Get free PostgreSQL from [Neon](https://neon.tech)
2. **Backend:** Deploy to [Render](https://render.com)
   - Build: `npm install`
   - Start: `npx tsx server/index.ts`
   - Env vars: `GROQ_API_KEY`, `DATABASE_URL`
3. **Frontend:** Deploy to [Vercel](https://vercel.com)
   - Env var: `VITE_API_URL=https://your-backend.onrender.com`

### Environment Variables for Production

| Variable | Where | Value |
|----------|-------|-------|
| `GROQ_API_KEY` | Backend | From console.groq.com |
| `DATABASE_URL` | Backend | From Neon/Supabase |
| `VITE_API_URL` | Frontend | Your backend URL |

## Trade-offs & Decisions

1. **PostgreSQL over SQLite:** Chose PostgreSQL for production-readiness and UUID support
2. **Session in localStorage:** Simple solution without auth; sessionId stored client-side
3. **Groq over OpenAI:** Free tier, faster inference, no quota issues
4. **No Redis:** Not needed for this scale; could add for rate limiting later

## If I Had More Time...

- [ ] Add WebSocket support for real-time typing indicators
- [ ] Implement rate limiting with Redis
- [ ] Add user authentication
- [ ] Create admin dashboard for viewing all conversations
- [ ] Add message search functionality
- [ ] Implement conversation tagging/categorization
- [ ] Add analytics for common questions
- [ ] Support file/image attachments
- [ ] Add unit and integration tests
- [ ] Implement streaming responses for faster perceived latency

## Project Structure

```
ai-chat-app/
├── server/                    # Backend (TypeScript)
│   ├── index.ts              # Express server entry
│   ├── routes/
│   │   └── chat.ts           # Chat API routes
│   ├── services/
│   │   ├── chat.ts           # Database operations
│   │   └── llm.ts            # Gemini integration
│   └── db/
│       ├── index.ts          # PostgreSQL connection
│       └── setup.ts          # Schema setup script
├── src/                       # Frontend (React)
│   ├── components/
│   │   ├── chat/             # Chat components
│   │   └── ui/               # shadcn-ui components
│   ├── pages/
│   └── main.tsx
├── .env.example              # Example environment variables
├── package.json
└── README.md
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:client` | Start only frontend |
| `npm run dev:server` | Start only backend |
| `npm run db:setup` | Create database tables |
| `npm run build` | Build frontend for production |
| `npm run lint` | Run ESLint |
