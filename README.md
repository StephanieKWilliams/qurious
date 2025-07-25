💬 Qurious – Frontend for LLM-Powered Conversations

A sleek, modern frontend for real-time AI chat — built with Next.js 15 App Router, Tailwind CSS, and Framer Motion. Connects to a FastAPI backend that delivers responses via Groq's ultra-fast inference API.
✨ Features

    🧠 Real-Time Chat — Typing indicators and instant LLM responses

    🎨 Animated UI — Smooth transitions with Framer Motion

    💾 Chat History — Stored in localStorage, session-based memory

    🌐 Backend Configurable — Environment-based API URL

    📱 Responsive Design — Works seamlessly on all devices

    ✅ Error Feedback — Built-in toasts for success/failure

🔧 Tech Stack

    Next.js 15 — App Router + Server Actions

    React 19

    TypeScript

    Tailwind CSS

    Framer Motion

    Radix UI (for accessible components)

    Lucide Icons

    Zustand (for global state management)

🚀 Getting Started
1. Clone & Install

git clone <frontend-repo-url>
cd qurious

# Install dependencies
npm install

2. Set Up Environment

Create a .env.local file at the root:

NEXT_PUBLIC_API_URL=https://your-backend-service-url.com

    Use your deployed FastAPI backend URL (e.g. Railway, Fly.io, or Render).

3. Run Locally

npm run dev

Then open:

http://localhost:3000
