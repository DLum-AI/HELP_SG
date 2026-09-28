import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Badge, Button, Section, buttonClass } from "@/components/ui-kit";
import { actions, category, useStore } from "@/lib/store";

export const Route = createFileRoute("/requests/$id")({
  head: () => ({
    meta: [
      { title: "Request details — HelpSG" },
      {
        name: "description",
        content: "See what a neighbour needs help with and offer to lend a hand.",
      },
      { property: "og:title", content: "Request details — HelpSG" },
      {
        property: "og:description",
        content: "See what a neighbour needs help with and offer to lend a hand.",
      },
    ],
  }),
  component: RequestDetail,
});

function RequestDetail() {
  const { id } = Route.useParams();
  const { requests } = useStore();
  const navigate = useNavigate();
  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <Section>
        <h1 className="text-2xl">This request is no longer available</h1>
        <Link to="/requests" className={buttonClass("primary", "md", "mt-4")}>
          Browse other requests
        </Link>
      </Section>
    );
  }

  const cat = category(request.category);
  const offered = request.offers.includes("You");

  return (
    <Section className="max-w-3xl">
      <Link to="/requests" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to requests
      </Link>

      <div className="card-soft mt-4 p-6 sm:p-8">
        <Badge tone="primary">
          <span aria-hidden>{cat.emoji}</span> {cat.label}
        </Badge>
        <h1 className="mt-3 text-3xl">{request.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {request.neighbourhood} · {request.date} · {request.time} · {request.duration}
          {request.recurring ? " · Recurring" : ""}
        </p>

        <h2 className="mt-7 text-xl">What you'll be helping with</h2>
        <p className="mt-2 text-foreground/85">{request.description}</p>
        <p className="mt-3 text-sm text-muted-foreground">{request.instructions}</p>

        <div className="mt-7 flex items-center gap-3 rounded-2xl bg-muted p-4">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-lg">
            {request.requesterName.charAt(0)}
          </span>
          <div>
            <p className="font-semibold">
              {request.requesterName} · {request.neighbourhood}
            </p>
            {request.verified ? (
              <span className="text-sm text-secondary-foreground">✓ Verified neighbour</span>
            ) : (
              <span className="text-sm text-muted-foreground">New member</span>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            disabled={offered || request.status !== "open"}
            onClick={() => {
              actions.offerHelp(request.id);
              navigate({ to: "/messages/$id", params: { id: request.id } });
            }}
            size="lg"
          >
            {offered ? "Offer sent ❤" : "I Can Help"}
          </Button>
          <Link
            to="/messages/$id"
            params={{ id: request.id }}
            className={buttonClass("outline", "lg")}
          >
            Message
          </Link>
        </div>

        <p className="mt-6 rounded-2xl bg-accent-soft p-4 text-sm text-accent-foreground">
          Safety reminder: meet in a public place first, keep chats inside HelpSG, and never
          share bank details. Companionship volunteers are not medical professionals.
        </p>
      </div>
    </Section>
  );
}
