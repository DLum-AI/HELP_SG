import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, buttonClass } from "@/components/ui-kit";
import { CATEGORIES } from "@/lib/store";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How HelpSG works" },
      {
        name: "description",
        content:
          "Ask for help or volunteer in a few steps: post a request, connect with a neighbour, meet up and say thank you.",
      },
      { property: "og:title", content: "How HelpSG works" },
      {
        property: "og:description",
        content: "The simple path from asking for help to saying thank you.",
      },
    ],
  }),
  component: HowItWorks,
});

const requester = [
  "Choose a category that fits what you need.",
  "Describe the task, then pick a date, time and neighbourhood.",
  "Volunteers nearby offer to help — accept the one you're comfortable with.",
  "Chat to confirm details, meet up, and send a thank-you afterwards.",
];

const volunteer = [
  "Create a short profile so neighbours know who you are.",
  "Browse requests by category, area or day.",
  "Tap “I Can Help” and message the requester.",
  "Show up, lend a hand, and mark the help complete.",
];

function HowItWorks() {
  return (
    <Section className="max-w-4xl">
      <h1 className="text-3xl sm:text-4xl">How HelpSG works</h1>
      <p className="mt-2 text-muted-foreground">
        No fees, no ratings race — just neighbours helping neighbours.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="card-soft p-6">
          <h2 className="text-xl">If you need help</h2>
          <ol className="mt-3 space-y-3 text-sm text-foreground/85">
            {requester.map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
          <Link to="/new-request" className={buttonClass("primary", "sm", "mt-5")}>
            Ask for Help
          </Link>
        </div>
        <div className="card-soft p-6">
          <h2 className="text-xl">If you want to volunteer</h2>
          <ol className="mt-3 space-y-3 text-sm text-foreground/85">
            {volunteer.map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary-soft text-xs font-semibold text-secondary-foreground">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
          <Link to="/volunteer" className={buttonClass("outline", "sm", "mt-5")}>
            Create a profile
          </Link>
        </div>
      </div>

      <h2 className="mt-12 text-2xl">The four things we cover</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="card-soft p-5">
            <span aria-hidden className="text-2xl">
              {c.emoji}
            </span>
            <h3 className="mt-1 text-lg">{c.label}</h3>
            <p className="text-sm text-muted-foreground">{c.blurb}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
