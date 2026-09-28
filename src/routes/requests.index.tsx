import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RequestCard, Section, inputClass } from "@/components/ui-kit";
import { DatePicker } from "@/components/date-time";
import { CATEGORIES, NEIGHBOURHOODS, useStore, type CategoryId } from "@/lib/store";

type Search = { category?: CategoryId };

export const Route = createFileRoute("/requests/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: (search["category"] as CategoryId) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse requests — HelpSG" },
      {
        name: "description",
        content:
          "Find a way to lend a hand near you. Browse help requests by category, area and date across Singapore.",
      },
      { property: "og:title", content: "Find a way to lend a hand — HelpSG" },
      {
        property: "og:description",
        content: "Browse neighbours' help requests by category, area and date.",
      },
    ],
  }),
  component: BrowseRequests,
});

function BrowseRequests() {
  const search = Route.useSearch();
  const { requests } = useStore();
  const [cat, setCat] = useState<string>(search.category ?? "all");
  const [area, setArea] = useState("all");
  const [date, setDate] = useState("");

  // Match a request's display date ("Friday, 2 Oct") against the picked
  // day or range ("Fri, 2 Oct" / "2 Oct – 5 Oct") by day-of-month.
  const dateMatches = (requestDate: string) => {
    if (!date) return true;
    const days = [...date.matchAll(/(\d{1,2}) (\w{3})/g)].map((m) => m[1]!);
    if (days.length === 0) return true;
    const [lo, hi] = [Math.min(...days.map(Number)), Math.max(...days.map(Number))];
    const reqDay = Number(requestDate.match(/(\d{1,2}) \w{3}/)?.[1]);
    return !Number.isNaN(reqDay) && reqDay >= lo && reqDay <= hi;
  };

  const visible = requests.filter(
    (r) =>
      r.status !== "completed" &&
      (cat === "all" || r.category === cat) &&
      (area === "all" || r.neighbourhood === area) &&
      dateMatches(r.date),
  );

  return (
    <Section className="max-w-6xl">
      <h1 className="text-3xl sm:text-4xl">Find a way to lend a hand</h1>
      <p className="mt-2 text-muted-foreground">
        Every request here comes from a neighbour nearby.
      </p>

      <div className="card-soft mt-6 grid gap-3 p-4 sm:grid-cols-3">
        <select
          className={inputClass}
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          aria-label="Category"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
        <select
          className={inputClass}
          value={area}
          onChange={(e) => setArea(e.target.value)}
          aria-label="Area"
        >
          <option value="all">All areas</option>
          {NEIGHBOURHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <DatePicker
          range
          value={date}
          onChange={setDate}
          placeholder="Any date or range"
        />
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">
          No requests match those filters yet — try widening your search.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </Section>
  );
}
