import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { buttonClass } from "./ui-kit";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/requests", label: "Find Help" },
  { to: "/volunteer", label: "Volunteer" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/safety", label: "Safety" },
] as const;

const mobileTabs = [
  { to: "/", label: "Home", icon: "🏡" },
  { to: "/requests", label: "Requests", icon: "🔎" },
  { to: "/volunteer", label: "Volunteer", icon: "🤝" },
  { to: "/messages", label: "Messages", icon: "💬" },
  { to: "/dashboard", label: "Profile", icon: "🙂" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              ❤
            </span>
            <span className="font-display text-xl font-semibold">HelpSG</span>
          </Link>
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-muted text-foreground" }}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/messages"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground md:inline-flex"
            >
              Messages
            </Link>
            <Link
              to="/dashboard"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground md:inline-flex"
            >
              Profile
            </Link>
            <Link to="/new-request" className={buttonClass("accent", "sm")}>
              Ask for Help
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      <footer className="hidden border-t border-border bg-card/60 py-8 md:block">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 text-sm text-muted-foreground">
          <p>HelpSG · Sometimes, a little help goes a long way.</p>
          <div className="flex gap-4">
            <Link to="/safety" className="hover:text-foreground">
              Safety guidelines
            </Link>
            <Link to="/how-it-works" className="hover:text-foreground">
              How it works
            </Link>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {mobileTabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: t.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-muted-foreground"
            >
              <span aria-hidden className="text-lg">
                {t.icon}
              </span>
              {t.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
