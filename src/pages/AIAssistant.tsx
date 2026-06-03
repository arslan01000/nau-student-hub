import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT =
  "You are the NAU AI Assistant, embedded in NAU Threads — a student community platform for North American University (NAU) in Houston, TX. NAU is a private non-profit institution offering bachelor's and master's degrees. You help students with questions about courses, professors, campus life, academic requirements, and university policies. NAU Threads features professor reviews, course guides, student discussions, and playbooks written by students.\nYou have knowledge of NAU courses including: ACCT 2311 (Fundamentals of Financial Accounting, 3 credits), ACCT 2312 (Fundamentals of Managerial Accounting, 3 credits), and many others. When students ask about specific courses, answer based on NAU's actual course catalog.\nAlways be helpful and concise. For critical decisions, remind users to verify with official NAU advisors at na.edu.";

const OPENAI_MODEL = "gpt-4o-mini";

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const conversationHistory = [...messages, userMessage];
    setMessages(conversationHistory);
    setInput("");
    setLoading(true);

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      setMessages([
        ...conversationHistory,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "API key is not configured. Please set VITE_OPENAI_API_KEY in your environment.",
          timestamp: new Date(),
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            max_tokens: 1024,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...conversationHistory.map(({ role, content }) => ({
                role,
                content,
              })),
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const detail =
          (errorBody as { error?: { message?: string } })?.error?.message ??
          `Request failed (${response.status})`;
        throw new Error(detail);
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = data.choices?.[0]?.message?.content ?? "";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: text || "No response received.",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            err instanceof Error
              ? `Sorry, something went wrong: ${err.message}`
              : "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 grid-pattern">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-serif mb-2">NAU AI Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Ask questions about North American University
          </p>
        </div>

        <Alert className="mb-6 bg-card border-border">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <AlertTitle className="text-sm">Experimental Feature</AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            NAU AI Assistant is experimental. In the future it will use information from the official North American University (NAU) website. 
            Always verify important information with official NAU advisors or na.edu.
          </AlertDescription>
        </Alert>

        <Card className="flex flex-col h-[600px] border-border bg-card/50">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'bg-muted border border-border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted border border-border">
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSend} className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about NAU..."
                disabled={loading}
                className="flex-1 bg-background border-border"
              />
              <Button type="submit" disabled={loading || !input.trim()} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
