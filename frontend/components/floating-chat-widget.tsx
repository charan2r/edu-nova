"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useChat as useChatContext } from "@/lib/chat-context";
import { getCourseRecommendations } from "@/lib/chat-api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingChatWidget() {
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuth();
  const { isOpen, closeChat, toggleChat } = useChatContext();
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const shouldHide =
    pathname === "/login" || pathname === "/register" || !isAuthenticated;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (shouldHide) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();

    if (!trimmedInput || isLoading) return;

    // Validate input length
    if (trimmedInput.length > 1000) {
      setError("Message is too long (max 1000 characters)");
      toast({
        title: "Error",
        description: "Message is too long (max 1000 characters)",
        variant: "destructive",
      });
      return;
    }

    setError(null);

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: trimmedInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Get recommendations
    setIsLoading(true);
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await getCourseRecommendations(trimmedInput, token);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content:
          response.message ||
          (response.recommendations.length > 0
            ? `Found ${response.recommendations.length} courses: ${response.recommendations.map((c) => c.name).join(", ")}`
            : "I'm an AI Course Advisor. Ask me about courses!"),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to get recommendations";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 max-h-[600px] shadow-lg border-border">
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
              onClick={closeChat}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col p-4 h-96 bg-background">
            {/* Error Alert */}
            {error && (
              <div className="mb-2 flex items-start gap-2 rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Error</p>
                  <p className="text-xs">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="h-4 w-4 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

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
                            "max-w-[70%] rounded-lg px-3 py-1.5 text-xs whitespace-pre-wrap break-words",
                            isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground",
                          )}
                        >
                          {message.content}
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
                maxLength={1000}
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
        onClick={toggleChat}
        size="lg"
        className="rounded-full w-14 h-14 shadow-lg"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </Button>
    </div>
  );
}
