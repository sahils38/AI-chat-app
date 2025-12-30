# AI Chat Support Agent

A conversational AI support agent embedded in a live chat widget.
**Live Demo:** [Add your deployed URL here]

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **LLM:** Groq (Llama 3.3 70B)

## Architecture

The system follows a straightforward client-server model with clear separation of concerns. The React frontend handles UI state and user interactions, delegating all business logic to the backend. This keeps the client thin and the API surface predictable.

The backend is structured into three layers: routes handle HTTP concerns and request validation, services encapsulate business logic and external integrations, and the database layer manages persistence through a connection pool. This separation makes the codebase easy to navigate and test in isolation.

Session management uses a simple but effective approach—the server generates a UUID for each conversation and returns it to the client, which stores it in localStorage. On subsequent requests, the client sends this ID to maintain continuity. This avoids the complexity of authentication while still providing conversation persistence across page reloads.

The database schema is minimal: a `conversations` table and a `messages` table with a foreign key relationship. Messages store the sender type (`user` or `ai`) and content, enabling the server to reconstruct conversation history for LLM context. UUIDs are used as primary keys for portability and to avoid sequential ID enumeration.

## LLM Integration

The LLM service wraps Groq's API, which provides fast inference on Llama 3.3 70B. Groq was chosen over OpenAI or Anthropic primarily for its generous free tier and low latency—their custom LPU hardware delivers responses noticeably faster than GPU-based alternatives.

The system prompt establishes the AI as a customer support agent for "Cozy Cart," a fictional e-commerce store. It includes structured knowledge about shipping policies, return procedures, payment methods, and current promotions. This grounding prevents hallucination on factual queries while allowing natural conversation flow.

Context management balances quality with cost: the last 20 messages are included in each request, and individual messages are truncated to 2000 characters. This keeps token usage reasonable while maintaining enough context for coherent multi-turn conversations.

## API

**POST /chat/message**
```json
// Request
{ "message": "What's your return policy?", "sessionId": "optional-uuid" }

// Response
{ "reply": "We offer a 30-day hassle-free return policy...", "sessionId": "uuid" }
```

**GET /chat/history/:sessionId** — Returns all messages for a conversation.

**GET /health** — Health check endpoint.

## Running Locally

**Prerequisites:** Node.js 18+, PostgreSQL 14+

```bash
# Install dependencies
npm install

# Start PostgreSQL and create database
brew services start postgresql@15
psql postgres -c "CREATE DATABASE chat_app;"

# Configure environment
cp .env.example .env
# Edit .env: add GROQ_API_KEY from console.groq.com

# Create tables
npm run db:setup

# Start development servers
npm run dev
```

Frontend runs at `localhost:8080`, backend at `localhost:3001`.

## Deployment

The app deploys cleanly to any Node.js hosting platform. Recommended setup:

1. **Database:** Neon (free PostgreSQL)
2. **Backend:** Render — build with `npm install`, start with `npx tsx server/index.ts`
3. **Frontend:** Vercel — set `VITE_API_URL` to your backend URL

## Design Decisions

**PostgreSQL over SQLite:** While SQLite would simplify local development, PostgreSQL's UUID support and production-readiness made it the better choice. The schema can scale to millions of messages without modification.

**Stateless sessions without auth:** For a support chat, full authentication adds friction without clear benefit. The UUID-based session approach provides conversation continuity while keeping the implementation simple. Adding auth later would be straightforward—the session ID could become a user ID foreign key.

**Groq over OpenAI:** Cost and speed. Groq's free tier is generous enough for development and demos, and their inference speed creates a noticeably better user experience. The trade-off is a smaller model ecosystem, but Llama 3.3 70B handles support queries well.

**No WebSockets:** HTTP polling would add complexity without meaningful UX improvement for a support chat. The typing indicator is client-side only. WebSockets would make sense if we needed real-time features like agent handoff or live typing visibility.

## Project Structure

```
server/
├── index.ts           # Express setup, middleware
├── routes/chat.ts     # API endpoints
├── services/
│   ├── chat.ts        # Database operations
│   └── llm.ts         # Groq integration
└── db/
    ├── index.ts       # Connection pool
    └── setup.ts       # Schema migrations

src/
├── components/chat/   # Chat UI components
├── pages/             # Page components
└── index.css          # Global styles
```
