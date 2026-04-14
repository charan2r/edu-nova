"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { Send, Sparkles, User, Bot, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingChatWidget() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Hide on login and register pages
  const shouldHide =
    pathname === "/login" || pathname === "/register" || !isAuthenticated;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (shouldHide) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const getMessageText = (message: (typeof messages)[0]) => {
    return (
      message.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") || ""
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 max-h-96 shadow-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between gap-2 py-3 px-4 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI Course Advisor</h3>
                <p className="text-xs text-muted-foreground">
                  Get personalized recommendations
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col p-4 h-64 bg-background">
            {/* Messages */}
            <div className="flex-1 space-y-2 overflow-y-auto mb-3">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <Bot className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    Ask me about courses and learning paths!
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const text = getMessageText(message);
                    const isUser = message.role === "user";

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          isUser ? "flex-row-reverse" : "flex-row",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                            isUser ? "bg-primary/20" : "bg-secondary",
                          )}
                        >
                          {isUser ? (
                            <User className="h-3 w-3 text-primary" />
                          ) : (
                            <Bot className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-3 py-1.5 text-xs",
                            isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground",
                          )}
                        >
                          <div className="line-clamp-3">{text}</div>
                        </div>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <Bot className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5">
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything..."
                disabled={isLoading}
                className="flex-1 h-8 text-xs bg-input"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                size="sm"
                className="h-8 w-8 p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="rounded-full w-14 h-14 shadow-lg"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </Button>
    </div>
  );
}
