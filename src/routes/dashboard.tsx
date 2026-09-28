import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Button, Section, buttonClass } from "@/components/ui-kit";
import { actions, category, useStore, type HelpRequest } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — HelpSG" },
      {
        name: "description",
        content:
          "Track your help requests, volunteer offers, upcoming commitments and messages in one place.",
      },
      { property: "og:title", content: "Your dashboard — HelpSG" },
      {
        property: "og:description",
        content: "Requests, offers, upcoming help and messages at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

function Row({ request, children }: { request: HelpRequest; children?: React.ReactNode }) {
  const cat = category(request.category);
  return (
    <div className="card-soft flex flex-wrap items-center gap-3 p-4">
      <span aria-hidden className="text-2xl">
        {cat.emoji}
      </span>
      <div className="min-w-40 flex-1">
        <Link
          to="/requests/$id"
          params={{ id: request.id }}
          className="font-semibold hover:underline"
        >
          {request.title}
        </Link>
        <p className="text-sm text-muted-foreground">
          {request.neighbourhood} · {request.date} · {request.time}
        </p>
      </div>
      {children}
    </div>
  );
}

function Dashboard() {
  const { requests, messages, profile } = useStore();
  const mine = requests.filter((r) => r.mine);
  const withOffers = mine.filter((r) => r.offers.length > 0 && r.status === "open");
  const upcomingMine = mine.filter((r) => r.status === "matched");
  const myOffers = requests.filter((r) => !r.mine && r.offers.includes("You"));
  const commitments = myOffers.filter((r) => r.status !== "completed");
  const completed = requests.filter((r) => r.status === "completed");
  const recommended = requests
    .filter(
      (r) =>
        !r.mine &&
        r.status === "open" &&
        !r.offers.includes("You") &&
        (!profile || profile.categories.length === 0 || profile.categories.includes(r.category)),
    )
    .slice(0, 3);

  return (
    <Section className="max-w-5xl">
      <h1 className="text-3xl sm:text-4xl">
        Hello{profile ? `, ${profile.name}` : ""} 👋
      </h1>
      <p className="mt-2 text-muted-foreground">Here's what's happening in your corner.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl">Your requests</h2>
          {mine.length === 0 ? (
            <div className="card-soft p-5 text-sm text-muted-foreground">
              You haven't asked for help yet.{" "}
              <Link to="/new-request" className="font-semibold text-primary hover:underline">
                Create a request
              </Link>
            </div>
          ) : (
            mine.map((r) => (
              <Row key={r.id} request={r}>
                <Badge tone={r.status === "open" ? "accent" : "secondary"}>
                  {r.status === "open"
                    ? `${r.offers.length} offer${r.offers.length === 1 ? "" : "s"}`
                    : r.status === "matched"
                      ? "Matched"
                      : "Completed"}
                </Badge>
              </Row>
            ))
          )}

          <h2 className="pt-4 text-xl">Volunteer offers</h2>
          {withOffers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new offers right now.</p>
          ) : (
            withOffers.map((r) => (
              <Row key={r.id} request={r}>
                <Button size="sm" onClick={() => actions.acceptOffer(r.id, r.offers[0]!)}>
                  Accept {r.offers[0]}
                </Button>
              </Row>
            ))
          )}

          <h2 className="pt-4 text-xl">Upcoming help</h2>
          {upcomingMine.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing scheduled yet.</p>
          ) : (
            upcomingMine.map((r) => (
              <Row key={r.id} request={r}>
                <Link
                  to="/complete/$id"
                  params={{ id: r.id }}
                  className={buttonClass("outline", "sm")}
                >
                  Mark complete
                </Link>
              </Row>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl">Recommended for you</h2>
          {recommended.map((r) => (
            <Row key={r.id} request={r}>
              <Link
                to="/requests/$id"
                params={{ id: r.id }}
                className={buttonClass("primary", "sm")}
              >
                View
              </Link>
            </Row>
          ))}

          <h2 className="pt-4 text-xl">Your commitments</h2>
          {commitments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You haven't offered to help yet — {" "}
              <Link to="/requests" className="font-semibold text-primary hover:underline">
                browse requests
              </Link>
              .
            </p>
          ) : (
            commitments.map((r) => (
              <Row key={r.id} request={r}>
                <Link
                  to="/complete/$id"
                  params={{ id: r.id }}
                  className={buttonClass("outline", "sm")}
                >
                  Complete
                </Link>
              </Row>
            ))
          )}

          <h2 className="pt-4 text-xl">Completed help</h2>
          {completed.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your kindness log starts here.</p>
          ) : (
            completed.map((r) => (
              <Row key={r.id} request={r}>
                <Badge tone="secondary">{r.thanks?.mood ?? "❤"} Done</Badge>
              </Row>
            ))
          )}

          <h2 className="pt-4 text-xl">Messages</h2>
          <div className="card-soft p-5 text-sm text-muted-foreground">
            {messages.length} message{messages.length === 1 ? "" : "s"} across your chats ·{" "}
            <Link to="/messages" className="font-semibold text-primary hover:underline">
              Open messages
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
