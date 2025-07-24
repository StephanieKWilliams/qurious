"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ChatInterface from "@/components/chat-interface"
import SplashScreen from "@/components/splash-screen"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <ChatInterface />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
