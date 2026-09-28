import { createFileRoute, Link } from "@tanstack/react-router";
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

function Index() {
  return (
    <>
      <Section className="max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-secondary-soft px-3 py-1 text-xs font-semibold text-secondary-foreground">
              A community platform for Singapore
            </span>
            <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
              Sometimes, a little help goes a long way.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Connect with caring volunteers in your community for everyday tasks, errands
              and companionship.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/new-request" className={buttonClass("primary", "lg")}>
                I Need Help
              </Link>
              <Link to="/volunteer" className={buttonClass("outline", "lg")}>
                I Want to Volunteer
              </Link>
            </div>
          </div>
          <img
            src={heroImage}
            alt="Neighbours in Singapore helping each other at a void deck"
            width={1536}
            height={1024}
            className="w-full rounded-[2rem] object-cover shadow-[var(--shadow-lift)]"
          />
        </div>
      </Section>

      <Section className="max-w-6xl">
        <h2 className="text-2xl sm:text-3xl">What can neighbours help with?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/requests"
              search={{ category: c.id }}
              className="card-soft flex flex-col gap-2 p-5 transition hover:shadow-[var(--shadow-lift)]"
            >
              <span aria-hidden className="text-3xl">
                {c.emoji}
              </span>
              <h3 className="text-lg">{c.label}</h3>
              <p className="text-sm text-muted-foreground">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="max-w-6xl">
        <div className="rounded-[2rem] bg-primary-soft/60 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl">How it works</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="card-soft p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {s.n}
                </span>
                <h3 className="mt-3 text-lg">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
