import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Radio, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, BalanceLink, Mark } from "@/components/mallajaw/ui";
import { AGENCIES, countryName, type Room } from "@/lib/mallajaw/catalog";
import { useMj } from "@/lib/mallajaw/store";

export const Route = createFileRoute("/")({ component: Discover });

function Discover() {
  const rooms = useMj((state) => state.rooms);
  const [query, setQuery] = useState("");
  const needle = query.trim();
  const visible = useMemo(() => {
    if (!needle) return rooms;
    return rooms.filter((room) => `${room.title} ${room.topic}`.includes(needle));
  }, [rooms, needle]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-4">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Mark className="size-10 md:hidden" />
          <div>
            <p className="text-xs font-bold tracking-widest text-muted">MALLAJAW</p>
            <h1 className="text-2xl font-extrabold leading-none">ملا جو</h1>
          </div>
        </div>
        <BalanceLink />
      </header>

      <label className="mb-5 flex min-h-11 items-center gap-2 rounded-xl border border-line bg-panel px-3">
        <Search className="size-4 text-muted" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث عن غرفة"
          className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-muted"
        />
      </label>

      <section className="mb-6 min-w-0">
        <h2 className="mb-3 text-sm font-bold text-muted">الوكالات</h2>
        <div className="mj-scroll flex gap-3 overflow-x-auto">
          {AGENCIES.map((agency) => (
            <Link reloadDocument
              key={agency.id}
              to="/rooms/$roomId"
              params={{ roomId: agency.roomId }}
              className="w-44 shrink-0 rounded-card border border-line bg-panel p-3"
            >
              <p className="text-sm font-extrabold">{agency.name}</p>
              <p className="mt-1 text-xs text-muted">
                {agency.city} · {countryName(agency.country)}
              </p>
              <p className="mt-3 text-xs text-muted">
                <bdi dir="ltr" className="font-bold text-ink tabular-nums">
                  {new Intl.NumberFormat("fr-FR").format(agency.heat)} ف
                </bdi>{" "}
                هدايا
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted">على الهواء</h2>
        {visible.length === 0 ? (
          <p className="rounded-card border border-line bg-panel px-4 py-6 text-sm text-muted">ما لقيناش غرفة بهذا الاسم.</p>
        ) : (
          visible.map((room) => <RoomRow key={room.id} room={room} />)
        )}
      </section>
    </div>
  );
}

function RoomRow({ room }: { room: Room }) {
  const occupied = room.seats.filter((seat): seat is string => Boolean(seat)).slice(0, 3);
  return (
    <Link reloadDocument
      to="/rooms/$roomId"
      params={{ roomId: room.id }}
      className="flex items-center gap-3 rounded-card border border-line bg-panel p-3"
    >
      <span className="flex shrink-0 -space-x-2 space-x-reverse">
        {occupied.map((id) => (
          <Avatar key={id} personId={id} size="sm" />
        ))}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-extrabold">{room.title}</span>
          {room.lock ? <Lock className="size-3.5 text-muted" aria-label="مقفلة" /> : null}
        </span>
        <span className="block truncate text-xs text-muted">{room.topic}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1 text-xs font-bold">
        <span className="inline-flex items-center gap-1 text-accent">
          <Radio className="size-3.5" aria-hidden="true" />
          {room.kind === "agency" ? "وكالة" : "خاصة"}
        </span>
        <span className="text-muted tabular-nums">{room.listeners} يسمع</span>
      </span>
    </Link>
  );
}
