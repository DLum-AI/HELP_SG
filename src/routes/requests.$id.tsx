import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Section, VolunteerCredentials, buttonClass } from "@/components/ui-kit";
import { actions, canHelpWith, category, findVolunteer, useStore } from "@/lib/store";

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
  const store = useStore();
  const { requests } = store;
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState(false);
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
  const allowed = canHelpWith(store.profile, request.category);

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

        {request.mine && request.offers.length > 0 ? (
          <div className="mt-6 space-y-3">
            <h2 className="text-xl">Volunteers who offered</h2>
            {request.offers.map((name) => {
              const v = findVolunteer(store, name);
              return (
                <div key={name} className="flex items-start gap-3 rounded-md border border-border p-4">
                  {v?.photo?.startsWith("data:image") ? (
                    <img
                      src={v.photo}
                      alt={`Photo of ${v.name}`}
                      className="h-9 w-9 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span className="text-2xl" aria-hidden>{v?.photo ?? "🙂"}</span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{name}</p>
                    {v ? <VolunteerCredentials volunteer={v} /> : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {!request.mine ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={offered || request.status !== "open"}
              onClick={() => {
                if (!allowed) {
                  setBlocked(true);
                  return;
                }
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
        ) : null}

        {blocked ? (
          <div role="alert" className="mt-4 rounded-md border border-primary bg-primary-soft/60 p-4 text-sm">
            <p className="font-semibold">Verification needed for this request</p>
            <p className="mt-1">
              To protect vulnerable neighbours, Companionship &amp; Home Help require an approved
              volunteer profile. You can still help with Groceries &amp; Meals or Pet Care.
            </p>
            <Link to="/volunteer" className={buttonClass("primary", "sm", "mt-3")}>
              {store.profile ? "View my verification status" : "Create volunteer profile"}
            </Link>
          </div>
        ) : null}

        <p className="mt-6 rounded-2xl bg-accent-soft p-4 text-sm text-accent-foreground">
          Safety reminder: meet in a public place first, keep chats inside HelpSG, and never
          share bank details. Companionship volunteers are not medical professionals.
        </p>
      </div>
    </Section>
  );
}
