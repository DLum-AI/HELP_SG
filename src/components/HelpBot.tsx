import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircleHeart, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { from: "bot" | "you"; text: string };

const FAQ: { keys: string[]; answer: string }[] = [
  {
    keys: ["post", "request", "ask", "need help"],
    answer:
      "To ask for help, tap “I Need Help” on the home page. It takes 3 short steps: pick a category, describe what you need, then choose a date, time and neighbourhood. Your exact address is never shown publicly.",
  },
  {
    keys: ["volunteer", "sign up", "join", "help others"],
    answer:
      "Tap “I Want to Volunteer” to create your profile. You'll add a photo, a short introduction, and verify your phone number. Once approved, you get a ✓ Verified badge and can help with all request types.",
  },
  {
    keys: ["verified", "verification", "approve", "badge", "trust"],
    answer:
      "New volunteers start as “Under review”. After verification and approval, you receive a ✓ Verified Community Volunteer badge. Companionship and Home Help requests are reserved for verified volunteers, to keep vulnerable neighbours safe.",
  },
  {
    keys: ["safe", "safety", "report", "block"],
    answer:
      "Your safety matters. Never share your exact address publicly, meet in public first when possible, and use the Report & Block option in any chat if something feels wrong. See the Safety page for full guidelines.",
  },
  {
    keys: ["message", "chat", "contact", "talk"],
    answer:
      "Once a volunteer offers help and you accept, a private chat opens so you can coordinate the details. Find all your conversations under Messages.",
  },
  {
    keys: ["cost", "pay", "fee", "money", "free"],
    answer:
      "HelpSG is completely free — it's neighbours helping neighbours, not a marketplace. No payments, no fees, just kindness.",
  },
  {
    keys: ["categor", "type", "kind"],
    answer:
      "There are four categories: 🏠 Home Help, 🛒 Groceries & Meals, 🐾 Pet Care, and ❤️ Companionship.",
  },
  {
    keys: ["rating", "review", "star", "feedback"],
    answer:
      "After a task is completed, you can leave a star rating, appreciation tags and a thank-you note. These appear on the volunteer's profile and help the whole community build trust.",
  },
];

const SUGGESTIONS = [
  "How do I ask for help?",
  "How do I become a volunteer?",
  "Is HelpSG free?",
  "How does verification work?",
];

function answerFor(input: string): string {
  const q = input.toLowerCase();
  for (const f of FAQ) if (f.keys.some((k) => q.includes(k))) return f.answer;
  return "I'm Happy, the HelpSG helper! I can explain how to post a request, become a volunteer, stay safe, or how ratings work. Try one of the suggestions below.";
}

export function HelpBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "bot",
      text: "Hi! I'm Happy, your HelpSG helper 👋 Ask me anything about getting or giving help.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "you", text: q }, { from: "bot", text: answerFor(q) }]);
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close help chat" : "Open help chat"}
        className="fixed bottom-20 right-4 z-50 grid h-13 w-13 place-items-center rounded-full bg-primary p-3.5 text-primary-foreground shadow-lg transition hover:opacity-90 md:bottom-6 md:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircleHeart className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-36 right-4 z-50 flex h-105 w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl md:bottom-24 md:right-6">
          <div className="flex items-center gap-2 bg-primary px-4 py-3 text-primary-foreground">
            <MessageCircleHeart className="h-5 w-5" />
            <div>
              <p className="text-sm font-bold">Happy · HelpSG helper</p>
              <p className="text-xs opacity-80">Answers instantly, anytime</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "you" && "justify-end")}>
                <p
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                    m.from === "you"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </p>
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
            <div ref={endRef} />
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-label="Type your question"
              className="flex-1 rounded-full border border-border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              aria-label="Send"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="border-t border-border px-3 py-1.5 text-center text-[11px] text-muted-foreground">
            Need a human? See our <Link to="/safety" className="underline" onClick={() => setOpen(false)}>Safety page</Link>.
          </p>
        </div>
      )}
    </>
  );
}
