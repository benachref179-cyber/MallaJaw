import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, Button, Franc, Page } from "@/components/mallajaw/ui";
import { AGENCIES, COUNTRIES, countryName } from "@/lib/mallajaw/catalog";
import { cn } from "@/lib/cn";
import { balanceOf, useMj } from "@/lib/mallajaw/store";

export const Route = createFileRoute("/me")({ component: MePage });

function MePage() {
  const profile = useMj((state) => state.profile);
  const setProfile = useMj((state) => state.setProfile);
  const joinAgency = useMj((state) => state.joinAgency);
  const resetCards = useMj((state) => state.resetCards);
  const giftsSent = useMj((state) => state.giftsSent);
  const balance = useMj((state) => balanceOf(state.ledger));
  const rooms = useMj((state) => state.rooms.filter((room) => room.id.startsWith("user-")));
  const agency = AGENCIES.find((item) => item.id === profile.agencyId);

  return (
    <Page title="أنا">
      <div className="mb-5 flex items-center gap-4">
        <Avatar personId="me" size="lg" />
        <div>
          <p className="text-lg font-extrabold">{profile.name}</p>
          <p className="text-sm text-muted">{countryName(profile.country)}</p>
          <p className="mt-1 text-sm">
            الرصيد <Franc value={balance} className="font-bold" />
          </p>
        </div>
      </div>

      <label htmlFor="display-name" className="text-sm font-bold">
        الاسم في المقاعد
      </label>
      <input
        id="display-name"
        value={profile.name}
        maxLength={24}
        onChange={(event) => setProfile({ name: event.target.value.slice(0, 24) || "ضيف" })}
        className="mt-1 mb-4 w-full rounded-xl border border-line bg-panel px-3 py-3 outline-none focus-visible:border-accent"
      />

      <p className="mb-2 text-sm font-bold">البلد</p>
      <div className="mb-5 grid grid-cols-3 gap-2">
        {COUNTRIES.map((country) => (
          <button
            key={country.id}
            type="button"
            onClick={() => setProfile({ country: country.id })}
            className={cn(
              "min-h-11 rounded-xl border text-sm font-bold",
              profile.country === country.id ? "border-accent bg-panel-2" : "border-line bg-panel text-muted",
            )}
          >
            {country.name}
          </button>
        ))}
      </div>

      <section className="mb-5 rounded-card border border-line bg-panel p-4">
        <h2 className="font-extrabold">الوكالة</h2>
        <p className="mt-1 text-sm text-muted">
          {agency ? `أنت مع ${agency.name}. الهدايا في قاعتها تتقسم 30% للمكتب و70% للمقعد.` : "لسا ما انضممتش. الوكالة تجمع المضيفين وتفتح قاعتها."}
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {AGENCIES.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => joinAgency(profile.agencyId === item.id ? null : item.id)}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between rounded-xl border px-3 text-sm font-bold",
                  profile.agencyId === item.id ? "border-accent bg-panel-2" : "border-line",
                )}
              >
                <span>{item.name}</span>
                <span className="text-muted">{profile.agencyId === item.id ? "مغادرة" : "انضمام"}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <dl className="mb-5 grid grid-cols-2 gap-2">
        <div className="rounded-card border border-line bg-panel p-3">
          <dt className="text-xs text-muted">هدايا بعثتها</dt>
          <dd className="text-xl font-extrabold tabular-nums">{giftsSent}</dd>
        </div>
        <div className="rounded-card border border-line bg-panel p-3">
          <dt className="text-xs text-muted">غرفك الخاصة</dt>
          <dd className="text-xl font-extrabold tabular-nums">{rooms.length}</dd>
        </div>
      </dl>

      {rooms.length > 0 ? (
        <ul className="mb-5 flex flex-col gap-2">
          {rooms.map((room) => (
            <li key={room.id}>
              <Link reloadDocument to="/rooms/$roomId" params={{ roomId: room.id }} className="block rounded-xl border border-line bg-panel px-3 py-3 font-bold">
                {room.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <section className="rounded-card border border-line bg-panel p-4">
        <h2 className="font-extrabold">الصور لاحقاً</h2>
        <p className="mt-1 text-sm text-muted">
          الأسماء تظهر بالحرف الأول، وبطاقة المشاركة تقدر تتبدل لاحقاً من غير ما يتغير الرصيد أو الغرف أو الوكالات.
        </p>
        <Button variant="line" className="mt-3" onClick={() => resetCards()}>
          إعادة تفعيل البطاقات التجريبية
        </Button>
      </section>
    </Page>
  );
}
