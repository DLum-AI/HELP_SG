import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { category, type HelpRequest } from "@/lib/store";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-base font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-primary text-primary-foreground hover:brightness-110 shadow-[var(--shadow-soft)]",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-105",
  accent: "bg-accent text-accent-foreground hover:brightness-105",
  outline: "border border-border bg-card text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
} as const;

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5",
  lg: "px-7 py-3.5 text-lg",
} as const;

export function buttonClass(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-input bg-card px-4 py-3 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25 placeholder:text-muted-foreground";

export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "secondary" | "accent";
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary-soft text-primary",
    secondary: "bg-secondary-soft text-secondary-foreground",
    accent: "bg-accent-soft text-accent-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto w-full max-w-5xl px-5 py-10 sm:py-14", className)}>
      {children}
    </section>
  );
}

export function RequestCard({ request }: { request: HelpRequest }) {
  const cat = category(request.category);
  return (
    <div className="card-soft flex h-full flex-col gap-3 p-5 transition hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-center justify-between gap-2">
        <Badge tone="primary">
          <span aria-hidden>{cat.emoji}</span> {cat.label}
        </Badge>
        {request.status !== "open" ? (
          <Badge tone="secondary">
            {request.status === "matched" ? "Volunteer matched" : "Completed"}
          </Badge>
        ) : null}
      </div>
      <h3 className="text-lg leading-snug">{request.title}</h3>
      <p className="text-sm text-muted-foreground">
        {request.neighbourhood} · {request.date} · {request.time}
      </p>
      <p className="text-sm text-muted-foreground">{request.duration}</p>
      <p className="line-clamp-2 text-sm text-foreground/80">{request.description}</p>
      <div className="mt-auto pt-2">
        <Link
          to="/requests/$id"
          params={{ id: request.id }}
          className={buttonClass("primary", "sm", "w-full sm:w-auto")}
        >
          I Can Help
        </Link>
      </div>
    </div>
  );
}
