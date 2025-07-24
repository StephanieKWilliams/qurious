"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, History, Trash2, User, Loader2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface QueryHistory {
  id: string
  query: string
  response: string
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [backendUrl, setBackendUrl] = useState(() => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) {
    console.warn("⚠️ NEXT_PUBLIC_API_URL is not set. Backend URL will be undefined.");
  }
  return envUrl || "";
});

  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load query history from localStorage safely
    try {
      const savedHistory = localStorage.getItem("queryHistory")
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        // Validate the parsed data
        if (Array.isArray(parsedHistory)) {
          setQueryHistory(
            parsedHistory.map((item) => ({
              ...item,
              timestamp: new Date(item.timestamp),
            })),
          )
        }
      }
    } catch (error) {
      console.error("Error loading query history:", error)
      localStorage.removeItem("queryHistory") // Clear corrupted data
    }

    // Set backend URL from environment or default
    const envBackendUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!envBackendUrl) {
        throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
      }
    setBackendUrl(envBackendUrl)
  }, [])

  const saveToHistory = (query: string, response: string) => {
    try {
      const newHistoryItem: QueryHistory = {
        id: Date.now().toString(),
        query,
        response,
        timestamp: new Date(),
      }
      const updatedHistory = [newHistoryItem, ...queryHistory].slice(0, 50) // Keep last 50 queries
      setQueryHistory(updatedHistory)
      localStorage.setItem("queryHistory", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error saving to history:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call FastAPI backend directly
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }))
        throw new Error(errorData.detail || "Failed to get response from backend")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "No response received",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      saveToHistory(userMessage.content, assistantMessage.content)

      // Show success toast with model info
      if (toast) {
        toast({
          title: "Response Generated",
          description: `Model: ${data.model || "Unknown"} | Tokens: ${data.tokens_used || "N/A"}`,
        })
      }
    }  catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Chat error:", error);

    // Handle specific error cases
    let errorMessage = "Failed to get response. Please try again.";

    if (error.message?.includes("fetch") || error.name === "TypeError") {
      errorMessage = `Cannot connect to backend server. Please ensure the FastAPI server is running on ${backendUrl}`;
    } else if (error.message?.includes("API key")) {
      errorMessage = "API key not configured. Please check your backend environment variables.";
    } else if (error.message?.includes("Rate limit")) {
      errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
    }

    // Optionally show error toast
    toast?.({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  } else {
    console.error("Unknown error type:", error);
  }


    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = () => {
    try {
      setQueryHistory([])
      localStorage.removeItem("queryHistory")
      if (toast) {
        toast({
          title: "History Cleared",
          description: "Query history has been cleared.",
        })
      }
    } catch (error) {
      console.error("Error clearing history:", error)
    }
  }

  const loadHistoryItem = (item: QueryHistory) => {
    try {
      setInput(item.query)
      setShowHistory(false)
    } catch (error) {
      console.error("Error loading history item:", error)
    }
  }

  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${backendUrl}/health`)
      if (response.ok) {
        const data = await response.json()
        if (toast) {
          toast({
            title: "Backend Connected",
            description: `Status: ${data.status || "Unknown"} | Model: ${data.model || "Unknown"}`,
          })
        }
      } else {
        throw new Error("Backend not responding")
      }
    } catch (error) {
      console.error("Backend connection test failed:", error)
      if (toast) {
        toast({
          title: "Backend Connection Failed",
          description: `Cannot connect to ${backendUrl}. Please ensure FastAPI server is running.`,
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Qurious</h1>
                <p className="text-sm text-blue-200">Lightning-Fast AI Inference</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={testBackendConnection}
                className="text-green-400 hover:bg-green-500/10"
              >
                Test Backend
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-white hover:bg-white/10"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to Qurious</h2>
                    <p className="text-blue-200 mb-4">
                      Experience ultra-fast AI inference with Groq&apos;s LPU technology
                    </p>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>• Lightning-fast response times</p>
                      <p>• Powered by Llama 3.1 models</p>
                      <p>• FastAPI backend integration</p>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">Backend: {backendUrl}</div>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-[80%] ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      } items-start space-x-3`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 ml-3"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 mr-3"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Zap className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <Card
                        className={`p-4 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-500/20"
                            : "bg-black/40 text-white border-white/10"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp?.toLocaleTimeString?.() || "Unknown time"}
                        </p>
                      </Card>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <Card className="p-4 bg-black/40 border-white/10">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                          <span className="text-blue-200">FastAPI backend processing...</span>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/20 backdrop-blur-lg border-t border-white/10 p-4"
        >
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Groq anything..."
                  className="min-h-[60px] bg-black/40 border-white/20 text-white placeholder:text-gray-400 resize-none focus:border-blue-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            key="history-sidebar"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 bg-black/40 backdrop-blur-lg border-l border-white/10"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Query History</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-4 space-y-3">
                {queryHistory.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No history yet</p>
                ) : (
                  queryHistory.map((item) => (
                    <Card
                      key={item.id}
                      className="p-3 bg-black/20 border-white/10 cursor-pointer hover:bg-black/30 transition-colors"
                      onClick={() => loadHistoryItem(item)}
                    >
                      <p className="text-sm text-white font-medium truncate mb-1">{item.query}</p>
                      <p className="text-xs text-gray-400 truncate mb-2">{item.response}</p>
                      <p className="text-xs text-blue-300">
                        {item.timestamp instanceof Date
                          ? item.timestamp.toLocaleDateString()
                          : new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
