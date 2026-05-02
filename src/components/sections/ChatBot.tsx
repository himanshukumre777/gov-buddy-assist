import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SCHEMES } from "@/data/schemes";
import { useApplications } from "@/lib/tracker";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Which schemes am I likely eligible for?",
  "What's the status of my applications?",
  "Which deadlines are coming up?",
  "What documents am I missing?",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scheme-chat`;

export function ChatBot() {
  const apps = useApplications();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Namaste! 🙏 I'm **SchemeMitra**, your AI guide to government schemes. Ask me about eligibility, deadlines, or your tracked applications." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last !== messages[messages.length - 1]) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next,
          applications: apps,
          schemes: SCHEMES.map((s) => ({ id: s.id, name: s.name, category: s.category, summary: s.summary, deadline: s.deadline })),
        }),
      });

      if (resp.status === 429) {
        toast.error("Rate limit reached. Try again in a moment.");
        setLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast.error("AI credits exhausted. Add credits in Lovable workspace.");
        setLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: rDone, value } = await reader.read();
        if (rDone) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(payload);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsert(content);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Couldn't reach the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="chat" className="container py-20">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">AI Assistant</p>
        <h2 className="mt-1 text-3xl font-bold text-foreground md:text-4xl">Talk to SchemeMitra</h2>
        <p className="mt-2 text-muted-foreground">Powered by Google Gemini. Aware of your tracked applications and deadlines.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
        <div className="flex items-center gap-3 border-b border-border bg-gradient-hero px-5 py-3 text-primary-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground animate-pulse-glow">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">SchemeMitra</div>
            <div className="text-[11px] text-primary-foreground/70 inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> Online · Gemini AI</div>
          </div>
        </div>

        <div ref={scrollRef} className="h-[420px] overflow-y-auto bg-muted/20 px-4 py-5 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft ${m.role === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-card text-foreground border border-border"}`}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-strong:text-foreground">
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border bg-card px-4 py-3 md:px-6">
          <div className="mb-3 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button key={s} onClick={() => !loading && send(s)} className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground transition-smooth hover:border-accent hover:bg-accent/10">
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); if (input.trim() && !loading) send(input.trim()); }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a scheme, eligibility, or your application status…"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-smooth focus:border-accent"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft transition-smooth hover:shadow-glow disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}