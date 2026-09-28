import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Field, Section, buttonClass, inputClass } from "@/components/ui-kit";
import { CATEGORIES, NEIGHBOURHOODS, actions, useStore, type CategoryId } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Become a volunteer — HelpSG" },
      {
        name: "description",
        content:
          "Create a volunteer profile and start helping neighbours with chores, errands, pets or companionship.",
      },
      { property: "og:title", content: "Become a volunteer — HelpSG" },
      {
        property: "og:description",
        content: "Share what you can help with and when you're free.",
      },
    ],
  }),
  component: VolunteerPage,
});

const EMOJIS = ["🙂", "😀", "🧑", "👩", "👳", "🧕", "👨‍🦳"];

function VolunteerPage() {
  const { profile } = useStore();
  const [name, setName] = useState(profile?.name ?? "");
  const [neighbourhood, setNeighbourhood] = useState(
    profile?.neighbourhood ?? NEIGHBOURHOODS[0]!,
  );
  const [intro, setIntro] = useState(profile?.intro ?? "");
  const [photo, setPhoto] = useState(profile?.photo ?? EMOJIS[0]!);
  const [availability, setAvailability] = useState(profile?.availability ?? "Weekends");
  const [cats, setCats] = useState<CategoryId[]>(profile?.categories ?? []);
  const [saved, setSaved] = useState(false);

  const toggle = (id: CategoryId) =>
    setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  if (saved && profile) {
    return (
      <Section className="max-w-2xl">
        <div className="card-soft p-6 sm:p-8">
          <span className="text-5xl" aria-hidden>
            {profile.photo}
          </span>
          <h1 className="mt-3 text-3xl">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.neighbourhood}</p>
          <p className="mt-4 text-foreground/85">“{profile.intro}”</p>
          <p className="mt-6 text-sm font-semibold">I can help with:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.categories.map((c) => {
              const cat = CATEGORIES.find((x) => x.id === c)!;
              return (
                <Badge key={c} tone="secondary">
                  {cat.emoji} {cat.label}
                </Badge>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Available: {profile.availability}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/requests" className={buttonClass("primary", "md")}>
              Browse requests
            </Link>
            <Button variant="outline" onClick={() => setSaved(false)}>
              Edit profile
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="max-w-2xl">
      <h1 className="text-3xl sm:text-4xl">Create your volunteer profile</h1>
      <p className="mt-2 text-muted-foreground">
        A friendly introduction helps neighbours feel comfortable asking for help.
      </p>

      <div className="card-soft mt-6 space-y-5 p-6 sm:p-8">
        <Field label="First name">
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Daniel"
          />
        </Field>
        <Field label="Photo" hint="Pick an avatar for now.">
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setPhoto(e)}
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full border text-2xl transition",
                  photo === e ? "border-primary bg-primary-soft" : "border-border",
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Neighbourhood">
          <select
            className={inputClass}
            value={neighbourhood}
            onChange={(e) => setNeighbourhood(e.target.value)}
          >
            {NEIGHBOURHOODS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </Field>
        <Field label="Short introduction">
          <textarea
            className={cn(inputClass, "min-h-24")}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="I enjoy helping older people with errands and companionship."
          />
        </Field>
        <Field label="Categories I can help with">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  cats.includes(c.id)
                    ? "border-secondary bg-secondary-soft text-secondary-foreground"
                    : "border-border hover:bg-muted",
                )}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Availability">
          <select
            className={inputClass}
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            {["Weekday mornings", "Weekday evenings", "Weekends", "Flexible"].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>
        <Button
          size="lg"
          disabled={!name || !intro || cats.length === 0}
          onClick={() => {
            actions.saveProfile({
              name,
              neighbourhood,
              intro,
              categories: cats,
              availability,
              photo,
            });
            setSaved(true);
          }}
        >
          Create Profile
        </Button>
      </div>
    </Section>
  );
}
