import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/ui-kit";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety & trust — HelpSG" },
      {
        name: "description",
        content:
          "Verified profiles, private addresses, reporting tools and simple safety guidelines for helping neighbours in Singapore.",
      },
      { property: "og:title", content: "Safety & trust — HelpSG" },
      {
        property: "og:description",
        content: "How HelpSG keeps neighbours safe when they meet and help.",
      },
    ],
  }),
  component: SafetyPage,
});

const guidelines = [
  {
    title: "Verified profiles",
    text: "Members who confirm their identity carry a ✓ Verified badge on their profile and requests.",
  },
  {
    title: "Addresses stay private",
    text: "Only the neighbourhood is shown publicly. Share your block and unit in chat once you're comfortable.",
  },
  {
    title: "Keep chats on HelpSG",
    text: "Confirm details in the app so there's a record if something goes wrong.",
  },
  {
    title: "Report or block anyone",
    text: "Every conversation has a report and block option. We review reports quickly.",
  },
  {
    title: "Never send money",
    text: "Volunteering is free. For groceries or meals, agree on reimbursement openly and keep receipts.",
  },
];

function SafetyPage() {
  return (
    <Section className="max-w-3xl">
      <h1 className="text-3xl sm:text-4xl">Staying safe on HelpSG</h1>
      <p className="mt-2 text-muted-foreground">
        A few simple habits keep our community kind and trustworthy.
      </p>

      <div className="mt-8 space-y-4">
        {guidelines.map((g) => (
          <div key={g.title} className="card-soft p-5">
            <h2 className="text-lg">{g.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{g.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-accent-soft p-5 text-sm text-accent-foreground">
        <strong className="font-semibold">Important:</strong> Companionship volunteers are
        kind neighbours, not medical professionals. They cannot give medical advice,
        administer medication or provide nursing care. In an emergency, call 995.
      </div>
    </Section>
  );
}
