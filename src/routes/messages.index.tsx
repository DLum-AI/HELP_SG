import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, buttonClass } from "@/components/ui-kit";
import { category, useStore } from "@/lib/store";

export const Route = createFileRoute("/messages/")({
  head: () => ({
    meta: [
      { title: "Messages — HelpSG" },
      {
        name: "description",
        content: "Chat with requesters and volunteers to confirm details before you meet.",
      },
      { property: "og:title", content: "Messages — HelpSG" },
      {
        property: "og:description",
        content: "Your conversations with neighbours on HelpSG.",
      },
    ],
  }),
  component: MessagesList,
});

function MessagesList() {
  const { requests, messages } = useStore();
  const threadIds = [
    ...new Set([
      ...messages.map((m) => m.requestId),
      ...requests.filter((r) => r.offers.includes("You") || r.mine).map((r) => r.id),
    ]),
  ];
  const threads = threadIds
    .map((id) => requests.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <Section className="max-w-3xl">
      <h1 className="text-3xl sm:text-4xl">Messages</h1>
      {threads.length === 0 ? (
        <div className="card-soft mt-6 p-6 text-center">
          <p className="text-muted-foreground">
            No conversations yet. Offer to help with a request to start one.
          </p>
          <Link to="/requests" className={buttonClass("primary", "md", "mt-4")}>
            Browse requests
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {threads.map((r) => {
            const last = [...messages].reverse().find((m) => m.requestId === r.id);
            return (
              <Link
                key={r.id}
                to="/messages/$id"
                params={{ id: r.id }}
                className="card-soft flex items-center gap-3 p-4 transition hover:shadow-[var(--shadow-lift)]"
              >
                <span aria-hidden className="text-2xl">
                  {category(r.category).emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{r.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {last ? last.text : `${r.requesterName} · ${r.neighbourhood}`}
                  </p>
                </div>
                <span className="text-muted-foreground">›</span>
              </Link>
            );
          })}
        </div>
      )}
    </Section>
  );
}
