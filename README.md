# AI Chat Application - FastAPI Backend Only

A modern, responsive AI chat application built with Next.js 15 frontend and FastAPI backend, featuring real-time conversations with Groq's ultra-fast AI inference.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with Framer Motion animations
- **FastAPI Backend**: Pure Python backend with Groq integration
- **Real-time Chat**: Instant AI responses with typing indicators
- **Query History**: Persistent chat history with localStorage
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Error Handling**: Comprehensive error handling and user feedback
- **Backend Testing**: Built-in backend connection testing

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible UI components

### Backend
- **FastAPI** - Modern Python web framework
- **Groq API** - Ultra-fast AI inference
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **HTTPX** - Async HTTP client

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Groq API key

### 1. Clone and Setup Frontend

\`\`\`bash
git clone <repository-url>
cd ai-chat-app

# Install frontend dependencies
npm install
\`\`\`

### 2. Setup FastAPI Backend

\`\`\`bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
\`\`\`

### 3. Configure Environment Variables

#### Frontend (.env.local):
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

#### Backend (backend/.env):
\`\`\`env
GROQ_API_KEY=gsk_your_groq_api_key_here
DEBUG=True
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:3000
\`\`\`

### 4. Get Your Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key (starts with \`gsk_\`)

## 🚀 Running the Application

### Option 1: Run Both Services Separately

#### Terminal 1 - FastAPI Backend:
\`\`\`bash
cd backend
source venv/bin/activate  # or venv\\Scripts\\activate on Windows
python main.py
\`\`\`

#### Terminal 2 - Next.js Frontend:
\`\`\`bash
npm run dev
\`\`\`

### Option 2: Run Both Services Concurrently

\`\`\`bash
# Install concurrently first
npm install -g concurrently

# Run both services
npm run dev:full
\`\`\`

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## 🏗 Project Structure

\`\`\`
ai-chat-app/
├── app/                          # Next.js app directory
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── chat-interface.tsx        # Main chat interface
│   ├── splash-screen.tsx         # Animated splash screen
│   └── toaster.tsx              # Toast notifications
├── backend/                      # FastAPI backend
│   ├── main.py                   # FastAPI application
│   ├── requirements.txt          # Python dependencies
│   └── .env.example             # Environment template
├── hooks/
│   └── use-toast.ts             # Toast hook
└── README.md
\`\`\`

## 🔧 API Endpoints

### FastAPI Backend Endpoints:

#### GET /
- **Description**: Health check
- **Response**: Status and version info

#### GET /health
- **Description**: Detailed health check
- **Response**: System status and model info

#### POST /api/chat
- **Description**: Send message to AI
- **Request Body**:
  \`\`\`json
  {
    "message": "Hello, how are you?",
    "history": [
      {
        "role": "user",
        "content": "Previous message",
        "timestamp": "2024-01-01T00:00:00Z"
      }
    ]
  }
  \`\`\`
- **Response**:
  \`\`\`json
  {
    "response": "Hello! I'm doing well, thank you for asking.",
    "timestamp": "2024-01-01T00:00:00Z",
    "model": "llama-3.1-8b-instant",
    "tokens_used": 25
  }
  \`\`\`

#### GET /api/models
- **Description**: Get available models
- **Response**: List of supported Groq models

## 🎯 Key Features Explained

### Backend-Only Architecture
- **Single Source of Truth**: All AI logic in FastAPI backend
- **Better Separation**: Clear separation between frontend and AI processing
- **Scalability**: Easy to scale backend independently
- **Flexibility**: Can easily switch AI providers or add features

### Real-time Communication
- **Direct API Calls**: Frontend calls FastAPI directly
- **Error Handling**: Comprehensive error handling for network issues
- **Connection Testing**: Built-in backend connectivity testing
- **Status Feedback**: Real-time status updates and notifications

### Development Experience
- **Hot Reload**: Both frontend and backend support hot reload
- **API Documentation**: Automatic Swagger/OpenAPI documentation
- **Type Safety**: Full TypeScript support with Pydantic validation
- **Logging**: Comprehensive logging for debugging

## 🔒 Security Considerations

- **API Key Protection**: Groq API key stored securely in backend
- **CORS Configuration**: Proper CORS setup for frontend-backend communication
- **Input Validation**: Pydantic models for request validation
- **Error Handling**: Secure error messages without exposing internals

## 🧪 Testing

### Test Backend Connection:
\`\`\`bash
curl http://localhost:8000/health
\`\`\`

### Test Chat Endpoint:
\`\`\`bash
curl -X POST "http://localhost:8000/api/chat" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello!", "history": []}'
\`\`\`

### Frontend Testing:
- Use the "Test Backend" button in the UI
- Check browser console for any errors
- Verify API calls in Network tab

## 🚀 Deployment

### Backend Deployment (Railway/Heroku):
1. Create new project on your platform
2. Connect your repository
3. Set environment variables:
   - \`GROQ_API_KEY\`
   - \`ALLOWED_ORIGINS\` (your frontend URL)
4. Deploy the \`backend\` directory

### Frontend Deployment (Vercel):
1. Connect repository to Vercel
2. Set environment variables:
   - \`NEXT_PUBLIC_API_URL\` (your backend URL)
3. Deploy automatically

## 📚 Available Models

- **llama-3.1-8b-instant** (Default) - Ultra-fast general chat
- **llama-3.1-70b-versatile** - Complex reasoning tasks
- **mixtral-8x7b-32768** - Long context (32K tokens)
- **gemma2-9b-it** - Instruction following

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
\`\`\`
\`\`\`

```python file="backend/requirements.txt"
fastapi==0.104.1
uvicorn[standard]==0.24.0
httpx==0.25.2
python-dotenv==1.0.0
pydantic==2.5.0
python-multipart==0.0.6
