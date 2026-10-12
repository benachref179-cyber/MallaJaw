import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Page } from "@/components/mallajaw/ui";
import { AGENCIES, countryName } from "@/lib/mallajaw/catalog";
import { useMj } from "@/lib/mallajaw/store";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/rooms/")({ component: RoomsPage });

function RoomsPage() {
  const [tab, setTab] = useState<"agency" | "private">("agency");
  const rooms = useMj((state) => state.rooms);
  const createRoom = useMj((state) => state.createRoom);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [lock, setLock] = useState("");
  const [error, setError] = useState("");

  function onCreate() {
    const name = title.trim();
    if (name.length < 2) {
      setError("اكتب اسماً للغرفة.");
      return;
    }
    if (lock && !/^\d{4}$/.test(lock)) {
      setError("الرمز أربعة أرقام، أو اتركه فارغاً.");
      return;
    }
    const id = createRoom(name, lock || undefined);
    navigate({ to: "/rooms/$roomId", params: { roomId: id } });
  }

  const privateRooms = rooms.filter((room) => room.kind === "private");

  return (
    <Page title="الغرف">
      <div className="mb-4 grid grid-cols-2 rounded-xl bg-panel p-1">
        {(
          [
            ["agency", "وكالات"],
            ["private", "خاصة"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "min-h-11 rounded-lg text-sm font-bold",
              tab === id ? "bg-panel-2 text-ink" : "text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "agency" ? (
        <ul className="flex flex-col gap-3">
          {AGENCIES.map((agency) => (
            <li key={agency.id}>
              <Link reloadDocument
                to="/rooms/$roomId"
                params={{ roomId: agency.roomId }}
                className="block rounded-card border border-line bg-panel p-4"
              >
                <p className="font-extrabold">{agency.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {agency.city} · {countryName(agency.country)}
                </p>
                <p className="mt-2 text-sm text-muted">{agency.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-4">
          <form
            className="rounded-card border border-line bg-panel p-4"
            onSubmit={(event) => {
              event.preventDefault();
              onCreate();
            }}
          >
            <h2 className="font-extrabold">غرفة خاصة جديدة</h2>
            <p className="mt-1 text-sm text-muted">افتح قاعة لك. الرمز اختياري ومن أربعة أرقام.</p>
            <label className="mt-3 block text-sm font-bold" htmlFor="room-title">
              الاسم
            </label>
            <input
              id="room-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={40}
              className="mt-1 w-full rounded-xl border border-line bg-panel-2 px-3 py-3 text-ink outline-none focus-visible:border-accent"
              placeholder="مثلاً: سهرة الجمعة"
            />
            <label className="mt-3 block text-sm font-bold" htmlFor="room-lock">
              رمز الدخول
            </label>
            <input
              id="room-lock"
              value={lock}
              onChange={(event) => setLock(event.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-line bg-panel-2 px-3 py-3 text-ink outline-none focus-visible:border-accent"
              placeholder="فارغ يعني مفتوحة"
            />
            {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
            <Button type="submit" className="mt-4 w-full">
              افتح الغرفة
            </Button>
          </form>
          <ul className="flex flex-col gap-3">
            {privateRooms.map((room) => (
              <li key={room.id}>
                <Link reloadDocument
                  to="/rooms/$roomId"
                  params={{ roomId: room.id }}
                  className="flex items-center justify-between rounded-card border border-line bg-panel px-4 py-3"
                >
                  <span>
                    <span className="block font-extrabold">{room.title}</span>
                    <span className="text-xs text-muted">{room.lock ? "مقفلة" : "مفتوحة"}</span>
                  </span>
                  <span className="text-xs text-muted tabular-nums">{room.listeners} يسمع</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Page>
  );
}
