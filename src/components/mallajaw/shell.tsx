import { Link, useRouterState } from "@tanstack/react-router";
import { House, MessageCircle, Mic, UserRound, Wallet } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Mark } from "@/components/mallajaw/ui";
import { balanceOf, useMj } from "@/lib/mallajaw/store";

const TABS = [
  { to: "/", label: "اكتشف", icon: House },
  { to: "/rooms", label: "الغرف", icon: Mic },
  { to: "/chats", label: "الدردشة", icon: MessageCircle },
  { to: "/wallet", label: "المحفظة", icon: Wallet },
  { to: "/me", label: "أنا", icon: UserRound },
] as const;

function isOn(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const immersive = /^\/(rooms|chats)\/[^/]+/.test(pathname);
  const unread = useMj((state) => state.threads.reduce((sum, thread) => sum + thread.unread, 0));
  const balance = useMj((state) => balanceOf(state.ledger));

  useEffect(() => {
    void useMj.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-e border-line px-4 py-6 md:flex">
          <Link reloadDocument to="/" className="mb-8 flex items-center gap-3">
            <Mark className="size-10" />
            <span>
              <span className="block text-lg font-extrabold leading-none">ملا جو</span>
              <span className="text-xs tracking-widest text-muted">MALLAJAW</span>
            </span>
          </Link>
          <nav className="flex flex-1 flex-col gap-1" aria-label="التنقل">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const on = isOn(pathname, tab.to);
              return (
                <Link reloadDocument
                  key={tab.to}
                  to={tab.to}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold",
                    on ? "bg-panel-2 text-ink" : "text-muted",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="flex-1">{tab.label}</span>
                  {tab.to === "/chats" && unread > 0 ? (
                    <span className="rounded-full bg-accent px-2 text-xs text-ink">{unread}</span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <p className="text-sm text-muted">
            الرصيد{" "}
            <bdi dir="ltr" className="font-bold text-ink tabular-nums">
              {new Intl.NumberFormat("fr-FR").format(balance)} ف
            </bdi>
          </p>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col md:border-s md:border-line">
          <div className={cn("flex flex-1 flex-col", immersive ? "" : "pb-24 md:pb-6")}>{children}</div>
          {immersive ? null : (
            <nav
              className="mj-tabbar fixed inset-x-0 bottom-0 z-20 border-t border-line bg-canvas md:hidden"
              aria-label="التنقل"
            >
              <ul className="mx-auto grid max-w-xl grid-cols-5">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const on = isOn(pathname, tab.to);
                  return (
                    <li key={tab.to}>
                      <Link reloadDocument
                        to={tab.to}
                        aria-current={on ? "page" : undefined}
                        className={cn(
                          "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-bold",
                          on ? "text-ink" : "text-muted",
                        )}
                      >
                        <span className="relative">
                          <Icon className="size-5" aria-hidden="true" />
                          {tab.to === "/chats" && unread > 0 ? (
                            <span className="absolute -top-1 -start-1 size-2 rounded-full bg-accent" />
                          ) : null}
                        </span>
                        {tab.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
