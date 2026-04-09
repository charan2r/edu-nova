"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Loader2,
  Code,
  Database,
  Cloud,
  Shield,
  Smartphone,
  Cpu
} from "lucide-react"
import { cn } from "@/lib/utils"

const suggestedQuestions = [
  {
    icon: Code,
    text: "I want to learn web development from scratch",
    category: "Web Dev",
  },
  {
    icon: Database,
    text: "What courses do you recommend for data science?",
    category: "Data Science",
  },
  {
    icon: Cloud,
    text: "Help me prepare for AWS certification",
    category: "Cloud",
  },
  {
    icon: Shield,
    text: "I'm interested in cybersecurity careers",
    category: "Security",
  },
  {
    icon: Smartphone,
    text: "Best path to become a mobile developer?",
    category: "Mobile",
  },
  {
    icon: Cpu,
    text: "I want to learn machine learning and AI",
    category: "ML/AI",
  },
]

export default function AIAssistantPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!isAuthenticated) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    sendMessage({ text: inputValue })
    setInputValue("")
  }

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return
    sendMessage({ text })
  }

  const getMessageText = (message: typeof messages[0]) => {
    return message.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") || ""
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">AI Course Advisor</h1>
          <p className="text-muted-foreground">
            Get personalized course recommendations based on your goals
          </p>
        </div>

        {/* Chat Area */}
        <Card className="flex flex-1 flex-col border-border bg-card">
          <CardContent className="flex flex-1 flex-col p-4">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-8">
                  <Bot className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="mb-6 text-center text-muted-foreground">
                    Ask me anything about courses, learning paths, or career guidance in IT!
                  </p>
                  
                  {/* Suggestions */}
                  <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                    {suggestedQuestions.map((suggestion) => (
                      <button
                        key={suggestion.text}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        disabled={isLoading}
                        className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4 text-left transition-colors hover:border-primary/50 hover:bg-secondary/50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <div className="rounded-lg bg-primary/10 p-2">
                          <suggestion.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-medium text-primary">{suggestion.category}</span>
                          <p className="text-sm">{suggestion.text}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const text = getMessageText(message)
                    const isUser = message.role === "user"
                    
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          isUser ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                            isUser ? "bg-primary/20" : "bg-secondary"
                          )}
                        >
                          {isUser ? (
                            <User className="h-4 w-4 text-primary" />
                          ) : (
                            <Bot className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3",
                            isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          )}
                        >
                          <div className="whitespace-pre-wrap text-sm">{text}</div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about courses, learning paths, or career advice..."
                disabled={isLoading}
                className="flex-1 bg-input"
              />
              <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
