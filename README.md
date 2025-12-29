# AI Chat App

An AI-powered chat application built with React, TypeScript, and Google Gemini.

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Google Gemini AI (free tier)
- Express.js (API server)

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Google Gemini API key (free)

### Get Your Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### Installation

```sh
# Install dependencies
npm install

# Create .env file and add your API key
# Edit .env and replace 'your_gemini_api_key_here' with your actual key
GEMINI_API_KEY=your_actual_api_key

# Start both the frontend and backend
npm run dev
```

The app will be available at:
- Frontend: http://localhost:8080
- API Server: http://localhost:3001

## Available Scripts

- `npm run dev` - Start both frontend and backend servers
- `npm run dev:client` - Start only the Vite frontend
- `npm run dev:server` - Start only the Express API server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
ai-chat-app/
├── server/
│   └── index.js        # Express API server with Gemini integration
├── src/
│   ├── components/
│   │   ├── chat/       # Chat UI components
│   │   └── ui/         # shadcn-ui components
│   ├── pages/          # Page components
│   └── main.tsx        # App entry point
├── .env                # Environment variables (API key)
└── package.json
```

## Features

- Real-time AI chat powered by Google Gemini
- Conversation history stored in browser localStorage
- Clean, responsive UI with shadcn-ui components
- Dark/light mode support
