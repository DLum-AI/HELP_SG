import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Section, buttonClass, inputClass } from "@/components/ui-kit";
import { actions, category, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages/$id")({
  head: () => ({
    meta: [
      { title: "Conversation — HelpSG" },
      {
        name: "description",
        content: "Confirm the details of a help request with your neighbour.",
      },
      { property: "og:title", content: "Conversation — HelpSG" },
      {
        property: "og:description",
        content: "Confirm the details of a help request with your neighbour.",
      },
    ],
  }),
  component: Chat,
});

function Chat() {
  const { id } = Route.useParams();
  const { requests, messages } = useStore();
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  const request = requests.find((r) => r.id === id);
  const thread = messages.filter((m) => m.requestId === id);

  if (!request) {
    return (
      <Section>
        <h1 className="text-2xl">Conversation not found</h1>
        <Link to="/messages" className={buttonClass("primary", "md", "mt-4")}>
          Back to messages
        </Link>
      </Section>
    );
  }

  return (
    <Section className="max-w-2xl">
      <div className="card-soft p-4">
        <p className="text-xs font-semibold text-muted-foreground">About this request</p>
        <div className="mt-1 flex items-center gap-2">
          <span aria-hidden>{category(request.category).emoji}</span>
          <Link
            to="/requests/$id"
            params={{ id: request.id }}
            className="font-semibold hover:underline"
          >
            {request.title}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          {request.requesterName} · {request.neighbourhood} · {request.date} ·{" "}
          {request.time}
        </p>
      </div>

      <div className="card-soft mt-4 flex min-h-72 flex-col gap-3 p-4">
        {thread.length === 0 ? (
          <p className="m-auto text-sm text-muted-foreground">
            Say hello and confirm the details.
          </p>
        ) : (
          thread.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                m.from === "me"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
            >
              {m.text}
              <span
                className={cn(
                  "mt-1 block text-[11px]",
                  m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {m.at}
              </span>
            </div>
          ))
        )}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          actions.sendMessage(request.id, text.trim());
          setText("");
        }}
      >
        <input
          className={inputClass}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
        />
        <Button type="submit">Send</Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            actions.sendMessage(
              request.id,
              `Confirming: ${request.date} at ${request.time} in ${request.neighbourhood}.`,
            );
            setNotice("Details confirmed in the chat.");
          }}
        >
          Confirm details
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNotice("This help has been cancelled and the neighbour notified.")}
        >
          Cancel
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setNotice("Thanks for reporting. Our team will review this chat.")}
        >
          Report / block
        </Button>
        <Link
          to="/complete/$id"
          params={{ id: request.id }}
          className={buttonClass("accent", "sm")}
        >
          Mark complete
        </Link>
      </div>
      {notice ? (
        <p className="mt-3 rounded-xl bg-accent-soft p-3 text-sm text-accent-foreground">
          {notice}
        </p>
      ) : null}
    </Section>
  );
}
