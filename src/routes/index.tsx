import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, House, PawPrint, ShoppingBasket } from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";
import { buttonClass, Section } from "@/components/ui-kit";
import { CATEGORIES } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HelpSG — Sometimes, a little help goes a long way" },
      {
        name: "description",
        content:
          "Ask for help with chores, errands, pets or companionship — or volunteer an hour in your Singapore neighbourhood.",
      },
      { property: "og:title", content: "HelpSG — A little help goes a long way" },
      {
        property: "og:description",
        content:
          "Connect with caring volunteers in your Singapore community for everyday tasks and companionship.",
      },
    ],
  }),
  component: Index,
});

const steps = [
  { n: "1", title: "Ask for help", text: "Tell us what you need, when and where." },
  { n: "2", title: "Connect with a volunteer", text: "Neighbours offer to lend a hand." },
  { n: "3", title: "Get it done", text: "Meet up, help out, and say thank you." },
];
const categoryIcons = { home: House, groceries: ShoppingBasket, pets: PawPrint, companionship: Heart };

function Index() {
  return (
    <>
      <section className="relative isolate min-h-[460px] overflow-hidden bg-primary sm:min-h-[530px] lg:min-h-[580px]">
        <img
          src={heroImage}
          alt="Neighbours in Singapore helping each other at a void deck"
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--foreground)_82%,transparent),color-mix(in_oklab,var(--foreground)_35%,transparent)_58%,transparent)]" />
        <div className="relative mx-auto flex min-h-[460px] w-full max-w-7xl flex-col justify-end px-5 pb-10 pt-12 sm:min-h-[530px] sm:pb-14 lg:min-h-[580px] lg:pb-16">
          <span className="mb-5 w-fit bg-accent px-3 py-1.5 text-xs font-bold uppercase text-accent-foreground">
            Neighbours helping neighbours
          </span>
          <h1 className="font-display text-6xl font-extrabold leading-none text-primary-foreground sm:text-7xl lg:text-8xl">
            HelpSG
          </h1>
          <p className="mt-4 max-w-xl font-display text-2xl font-medium leading-tight text-primary-foreground sm:text-3xl">
            Sometimes, a little help goes a long way.
          </p>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-primary-foreground/90">
            Connect with caring volunteers in your community for everyday tasks, errands and companionship.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/new-request" className={buttonClass("accent", "lg")}>
              I Need Help <span aria-hidden>↗</span>
            </Link>
            <Link to="/volunteer" className={buttonClass("outline", "lg", "border-primary-foreground bg-background/95 text-primary hover:bg-background")}>
              I Want to Volunteer <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <Section className="max-w-7xl py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-primary">Everyday help, close to home</p>
            <h2 className="text-3xl text-primary sm:text-4xl">What can neighbours help with?</h2>
          </div>
          <Link to="/requests" className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-foreground">
            Browse requests ↗
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 border-y border-border lg:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            const Icon = categoryIcons[c.id];
            return (
            <Link
              key={c.id}
              to="/requests"
              search={{ category: c.id }}
              className="group flex min-h-56 flex-col border-b border-border p-5 transition-colors hover:bg-primary-soft/50 sm:p-7 lg:border-b-0 lg:border-r last:lg:border-r-0"
            >
              <span className="font-display text-2xl font-semibold text-primary/65">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon aria-hidden="true" size={28} strokeWidth={1.7} className="mt-6 text-primary" />
              <h3 className="mt-3 text-xl font-semibold text-primary sm:text-2xl">{c.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
              <span aria-hidden className="mt-auto pt-4 text-lg text-primary transition-transform group-hover:translate-x-1">↗</span>
            </Link>
            );
          })}
        </div>
      </Section>

      <section className="bg-primary-soft/65">
        <Section className="max-w-7xl py-14 sm:py-20">
          <p className="mb-2 text-xs font-bold uppercase text-primary">A little help, a big difference</p>
          <h2 className="text-3xl text-primary sm:text-4xl">How it works</h2>
          <div className="mt-8 grid gap-8 border-t border-primary/25 pt-7 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="font-display text-5xl font-semibold text-primary/55">0{s.n}</span>
                <h3 className="mt-4 text-xl text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>
    </>
  );
}
