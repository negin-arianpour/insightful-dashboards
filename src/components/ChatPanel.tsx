import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataRow } from "@/lib/sample-data";
import { detectNumericColumns } from "@/lib/sample-data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function generateAnswer(question: string, data: DataRow[]): string {
  const q = question.toLowerCase();
  const numericCols = detectNumericColumns(data);

  // Simple local Q&A engine (will be replaced with AI later)
  for (const col of numericCols) {
    if (q.includes(col.toLowerCase())) {
      const values = data.map((r) => r[col] as number);
      const total = values.reduce((a, b) => a + b, 0);
      const avg = total / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);

      if (q.includes("total") || q.includes("sum"))
        return `The total **${col}** is **${total.toLocaleString()}**.`;
      if (q.includes("average") || q.includes("avg") || q.includes("mean"))
        return `The average **${col}** is **${avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}**.`;
      if (q.includes("max") || q.includes("highest") || q.includes("best"))
        return `The highest **${col}** is **${max.toLocaleString()}**.`;
      if (q.includes("min") || q.includes("lowest") || q.includes("worst"))
        return `The lowest **${col}** is **${min.toLocaleString()}**.`;

      return `Here's a summary for **${col}**:\n- Total: ${total.toLocaleString()}\n- Average: ${avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}\n- Range: ${min.toLocaleString()} – ${max.toLocaleString()}`;
    }
  }

  if (q.includes("trend") || q.includes("growing") || q.includes("growth")) {
    const col = numericCols[0];
    if (col) {
      const values = data.map((r) => r[col] as number);
      const first = values[0];
      const last = values[values.length - 1];
      const change = ((last - first) / first * 100).toFixed(1);
      return `**${col}** has ${Number(change) >= 0 ? "grown" : "declined"} by **${change}%** over the period (${first.toLocaleString()} → ${last.toLocaleString()}).`;
    }
  }

  if (q.includes("column") || q.includes("metric") || q.includes("what data")) {
    return `Your dataset has **${data.length} rows** with these columns:\n${Object.keys(data[0]).map((k) => `- ${k}`).join("\n")}`;
  }

  return `I can help you analyze your data. Try asking about specific metrics like:\n- "What's the total revenue?"\n- "Show me the average customers"\n- "Is revenue growing?"\n- "What columns do I have?"`;
}

export function ChatPanel({ data }: { data: DataRow[] }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I'm ready to help you explore your data. Ask me anything about your metrics — totals, averages, trends, or comparisons.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateAnswer(userMsg.content, data);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="bg-card rounded-xl border border-border/60 flex flex-col h-[480px]">
      <div className="px-5 py-4 border-b border-border/60">
        <h3 className="font-semibold flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          Ask about your data
        </h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "hero-gradient text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-1" : ""}>
                  {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={k}>{part.slice(2, -2)}</strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              ))}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-foreground/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-xl px-4 py-2.5 text-sm">
              <span className="animate-pulse-subtle">Thinking…</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-border/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data…"
            className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
