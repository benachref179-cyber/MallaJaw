import { Link } from "@tanstack/react-router";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { countryName, personById, type CountryId } from "@/lib/mallajaw/catalog";
import { useMj } from "@/lib/mallajaw/store";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-panel-2" />
      <rect x="6.5" y="12" width="3.4" height="8" rx="1.7" className="fill-accent" />
      <rect x="14.3" y="7" width="3.4" height="18" rx="1.7" className="fill-ink" />
      <rect x="22.1" y="10.5" width="3.4" height="11" rx="1.7" className="fill-accent" />
    </svg>
  );
}

export function Franc({
  value,
  signed = false,
  className,
}: {
  value: number;
  signed?: boolean;
  className?: string;
}) {
  const abs = new Intl.NumberFormat("fr-FR").format(Math.abs(value));
  const sign = !signed || value === 0 ? "" : value > 0 ? "+" : "−";
  return (
    <bdi dir="ltr" className={cn("tabular-nums", className)}>
      {sign}
      {abs} ف
    </bdi>
  );
}

export function Avatar({
  personId,
  speaking = false,
  size = "md",
}: {
  personId: string | null;
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const profile = useMj((state) => state.profile);
  const box = size === "lg" ? "size-20 text-2xl" : size === "sm" ? "size-9 text-xs" : "size-14 text-lg";
  if (!personId) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-dashed border-line text-muted",
          box,
        )}
      />
    );
  }
  const person = personId === "me" ? null : personById(personId);
  const label = personId === "me" ? profile.name : (person?.name ?? "؟");
  const letter = label.trim().slice(0, 1) || "؟";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border bg-panel-2 font-bold text-ink",
        speaking ? "border-accent mj-speak" : "border-line",
        box,
      )}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
}

export function displayName(personId: string, mine: string) {
  if (personId === "me") return mine;
  if (personId === "system") return "القاعة";
  return personById(personId)?.name ?? "مجهول";
}

export function CountryTag({ id }: { id: CountryId }) {
  return <span className="text-muted">{countryName(id)}</span>;
}

export function Button({
  variant = "solid",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "line" | "ghost" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        variant === "solid" && "bg-accent text-ink",
        variant === "line" && "border border-line bg-panel text-ink",
        variant === "ghost" && "bg-transparent text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Page({
  title,
  action,
  children,
  wide = false,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn("mx-auto flex w-full flex-1 flex-col px-4 py-4", wide ? "max-w-3xl" : "max-w-xl")}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {action}
      </header>
      {children}
    </div>
  );
}

export function BalanceLink() {
  const ledger = useMj((state) => state.ledger);
  const value = ledger.reduce((sum, entry) => sum + entry.delta, 0);
  return (
    <Link reloadDocument
      to="/wallet"
      className="inline-flex min-h-11 items-center rounded-full bg-accent px-3 text-sm font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <Franc value={value} />
    </Link>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-card border border-line bg-panel px-4 py-8 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
