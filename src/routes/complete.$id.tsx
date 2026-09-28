import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Section, buttonClass, inputClass } from "@/components/ui-kit";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/complete/$id")({
  head: () => ({
    meta: [
      { title: "Helping hand complete — HelpSG" },
      {
        name: "description",
        content: "Share how the help went and send a thank-you note to your neighbour.",
      },
      { property: "og:title", content: "Helping hand complete — HelpSG" },
      {
        property: "og:description",
        content: "Appreciation, not star ratings — send a thank-you note.",
      },
    ],
  }),
  component: Complete,
});

const moods = [
  { emoji: "😊", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Could be better" },
];

function Complete() {
  const { id } = Route.useParams();
  const { requests } = useStore();
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <Section>
        <h1 className="text-2xl">Nothing to complete here</h1>
        <Link to="/dashboard" className={buttonClass("primary", "md", "mt-4")}>
          Go to dashboard
        </Link>
      </Section>
    );
  }

  if (sent) {
    return (
      <Section className="max-w-xl text-center">
        <span className="text-5xl" aria-hidden>
          ❤️
        </span>
        <h1 className="mt-4 text-3xl">Thank you sent</h1>
        <p className="mt-2 text-muted-foreground">
          Your kind words have been shared. That's one more helping hand in the neighbourhood.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/requests" className={buttonClass("primary", "md")}>
            Browse more requests
          </Link>
          <Link to="/dashboard" className={buttonClass("outline", "md")}>
            Back to dashboard
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <Section className="max-w-xl">
      <div className="card-soft p-6 text-center sm:p-8">
        <h1 className="text-3xl">Helping hand complete ❤️</h1>
        <p className="mt-2 text-muted-foreground">“{request.title}”</p>

        <h2 className="mt-7 text-xl">How did it go?</h2>
        <div className="mt-3 flex justify-center gap-3">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setMood(m.emoji)}
              className={cn(
                "flex w-28 flex-col items-center gap-1 rounded-2xl border p-4 text-sm transition",
                mood === m.emoji
                  ? "border-primary bg-primary-soft/60"
                  : "border-border hover:bg-muted",
              )}
            >
              <span className="text-2xl" aria-hidden>
                {m.emoji}
              </span>
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-6 text-left">
          <p className="text-sm font-semibold">Leave a thank-you message</p>
          <textarea
            className={cn(inputClass, "mt-2 min-h-24")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thank you for taking the time — it really made my week easier."
          />
        </div>

        <Button
          size="lg"
          className="mt-5"
          disabled={!mood}
          onClick={() => {
            actions.complete(request.id, mood, note);
            setSent(true);
          }}
        >
          Send Thank You
        </Button>
      </div>
    </Section>
  );
}
