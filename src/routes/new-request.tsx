import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Field, Section, inputClass } from "@/components/ui-kit";
import { CATEGORIES, NEIGHBOURHOODS, actions, type CategoryId } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/new-request")({
  head: () => ({
    meta: [
      { title: "Ask for help — HelpSG" },
      {
        name: "description",
        content:
          "Post a help request in three simple steps: pick a category, tell us more, then say when and where.",
      },
      { property: "og:title", content: "Ask for help — HelpSG" },
      {
        property: "og:description",
        content: "Post a request and let caring neighbours offer a hand.",
      },
    ],
  }),
  component: NewRequest,
});

function NewRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState<CategoryId | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    date: "",
    time: "",
    duration: "About 1 hour",
    neighbourhood: NEIGHBOURHOODS[0]!,
    recurring: false,
  });

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!cat) return;
    const id = actions.createRequest({ ...form, category: cat });
    navigate({ to: "/requests/$id", params: { id } });
  };

  return (
    <Section className="max-w-2xl">
      <p className="text-sm font-semibold text-primary">Step {step} of 3</p>
      <div className="mt-2 flex gap-1.5">
        {[1, 2, 3].map((s) => (
          <span
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              s <= step ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>

      <div className="card-soft mt-6 space-y-5 p-6 sm:p-8">
        {step === 1 && (
          <>
            <h1 className="text-2xl">What do you need help with?</h1>
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    cat === c.id
                      ? "border-primary bg-primary-soft/60"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <span aria-hidden className="text-2xl">
                    {c.emoji}
                  </span>
                  <p className="mt-1 font-semibold">{c.label}</p>
                  <p className="text-sm text-muted-foreground">{c.blurb}</p>
                </button>
              ))}
            </div>
            <Button disabled={!cat} onClick={() => setStep(2)} size="lg">
              Continue
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl">Tell us more</h1>
            <Field label="Request title">
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Accompany me to the polyclinic"
              />
            </Field>
            <Field label="Description">
              <textarea
                className={cn(inputClass, "min-h-28")}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="A short note about what you need."
              />
            </Field>
            <Field label="Specific instructions" hint="Optional — meeting point, access, anything helpful.">
              <textarea
                className={cn(inputClass, "min-h-20")}
                value={form.instructions}
                onChange={(e) => update("instructions", e.target.value)}
              />
            </Field>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!form.title || !form.description} onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl">When & where?</h1>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date">
                <input
                  className={inputClass}
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  placeholder="Friday, 2 Oct"
                />
              </Field>
              <Field label="Time">
                <input
                  className={inputClass}
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  placeholder="2:00 PM"
                />
              </Field>
              <Field label="Estimated duration">
                <select
                  className={inputClass}
                  value={form.duration}
                  onChange={(e) => update("duration", e.target.value)}
                >
                  {["About 30 minutes", "About 1 hour", "About 2 hours", "Half a day"].map(
                    (d) => (
                      <option key={d}>{d}</option>
                    ),
                  )}
                </select>
              </Field>
              <Field label="Neighbourhood" hint="Your exact address is never shown publicly.">
                <select
                  className={inputClass}
                  value={form.neighbourhood}
                  onChange={(e) => update("neighbourhood", e.target.value)}
                >
                  {NEIGHBOURHOODS.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </Field>
            </div>
            <label className="flex items-center gap-3 rounded-2xl bg-muted p-4 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
                checked={form.recurring}
                onChange={(e) => update("recurring", e.target.checked)}
              />
              This is a recurring request
            </label>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button disabled={!form.date || !form.time} onClick={submit} size="lg">
                Post Request
              </Button>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
