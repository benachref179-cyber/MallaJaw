import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Crown, Flower2, Gem, Coffee, Mic, MicOff, Sparkles, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Button, displayName, Franc } from "@/components/mallajaw/ui";
import { AGENCIES, clock, GIFTS, personById } from "@/lib/mallajaw/catalog";
import { cn } from "@/lib/cn";
import { balanceOf, useMj } from "@/lib/mallajaw/store";

export const Route = createFileRoute("/rooms/$roomId")({ component: RoomPage });

const GIFT_ICON = {
  rose: Flower2,
  coffee: Coffee,
  gem: Gem,
  crown: Crown,
  flare: Sparkles,
} as const;

function RoomPage() {
  const { roomId } = Route.useParams();
  const room = useMj((state) => state.rooms.find((item) => item.id === roomId));
  const lines = useMj((state) => state.roomLines.filter((item) => item.roomId === roomId));
  const profile = useMj((state) => state.profile);
  const balance = useMj((state) => balanceOf(state.ledger));
  const sit = useMj((state) => state.sit);
  const leaveSeat = useMj((state) => state.leaveSeat);
  const sayInRoom = useMj((state) => state.sayInRoom);
  const giveGift = useMj((state) => state.giveGift);
  const ensureThread = useMj((state) => state.ensureThread);
  const navigate = useNavigate();

  const [unlocked, setUnlocked] = useState(!room?.lock);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [target, setTarget] = useState<string | null>(null);
  const [giftsOpen, setGiftsOpen] = useState(false);
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [micNote, setMicNote] = useState("");
  const [tick, setTick] = useState(0);
  const stream = useRef<MediaStream | null>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUnlocked(!room?.lock);
  }, [room?.id, room?.lock]);

  useEffect(() => {
    const id = window.setInterval(() => setTick((value) => value + 1), 1600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [lines.length]);

  useEffect(
    () => () => {
      stream.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  const occupied = useMemo(() => (room ? room.seats.filter((seat): seat is string => Boolean(seat)) : []), [room]);
  const speaker = occupied.length ? occupied[tick % occupied.length] : null;

  if (!room) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-8">
        <p className="text-muted">الغرفة ما لقيناهاش.</p>
        <Link reloadDocument to="/rooms" className="mt-3 inline-block font-bold text-accent">
          ارجع للغرف
        </Link>
      </div>
    );
  }

  if (room.lock && !unlocked) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 py-4">
        <Link reloadDocument to="/rooms" className="inline-flex size-11 items-center justify-center" aria-label="رجوع">
          <ChevronRight className="size-5" />
        </Link>
        <div className="m-auto w-full rounded-card border border-line bg-panel p-5">
          <h1 className="text-2xl font-extrabold">{room.title}</h1>
          <p className="mt-1 text-sm text-muted">غرفة خاصة. اكتب الرمز من أربعة أرقام.</p>
          {room.lock === "2244" ? (
            <p className="mt-2 text-sm text-muted">
              رمز التجربة: <bdi dir="ltr" className="font-bold text-ink">2244</bdi>
            </p>
          ) : null}
          <form
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (pin === room.lock) {
                setUnlocked(true);
                setPinError("");
              } else setPinError("الرمز غلط.");
            }}
          >
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
              aria-label="رمز الغرفة"
              className="w-full rounded-xl border border-line bg-panel-2 px-3 py-3 text-center text-2xl tracking-widest text-ink outline-none focus-visible:border-accent"
            />
            {pinError ? <p className="mt-2 text-sm text-accent">{pinError}</p> : null}
            <Button type="submit" className="mt-4 w-full">
              ادخل
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const agency = AGENCIES.find((item) => item.id === room.agencyId);
  const seated = room.seats.includes("me");
  const targetId = target && room.seats.includes(target) ? target : (room.seats.find((seat) => seat && seat !== "me") ?? room.hostId);
  const targetName = displayName(targetId, profile.name);

  async function toggleMic() {
    if (micOn) {
      stream.current?.getTracks().forEach((track) => track.stop());
      stream.current = null;
      setMicOn(false);
      setMicNote("");
      return;
    }
    if (!seated) {
      const index = room?.seats.findIndex((seat) => seat === null) ?? -1;
      if (room && index >= 0) sit(room.id, index);
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      setMicOn(true);
      setMicNote("المايك مفتوح عندك. البث لبقية الناس يجي في نسخة لاحقة.");
    } catch {
      setMicOn(true);
      setMicNote("المتصفح منع المايك. المقعد يتكلم بصرياً فقط.");
    }
  }

  function sendGift(giftId: string) {
    const gift = GIFTS.find((item) => item.id === giftId);
    if (!gift || !room) return;
    const reason = giveGift(room.id, gift.name, gift.cost, targetName);
    if (reason) {
      setNote(reason);
      return;
    }
    setNote(`وصلت ${gift.name} إلى ${targetName}`);
    setGiftsOpen(false);
  }

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <header className="flex items-center gap-2 border-b border-line px-3 py-2">
        <Link reloadDocument to="/rooms" className="inline-flex size-11 items-center justify-center" aria-label="رجوع">
          <ChevronRight className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-extrabold">{room.title}</h1>
          <p className="truncate text-xs text-muted">
            {room.kind === "agency" ? "قاعة وكالة" : "غرفة خاصة"} · {room.listeners + (seated ? 1 : 0)} يسمع
          </p>
        </div>
        <Franc value={balance} className="text-sm font-bold" />
      </header>

      <div className="grid flex-1 md:grid-cols-2">
        <section className="px-4 py-4">
          {agency ? <p className="mb-4 text-sm text-muted">{agency.blurb}</p> : null}
          <ul className="grid grid-cols-4 gap-3">
            {room.seats.map((seat, index) => {
              const name = seat ? displayName(seat, profile.name) : "مقعد";
              const speaking = Boolean(seat) && (seat === speaker || (seat === "me" && micOn));
              return (
                <li key={index}>
                  <button
                    type="button"
                    className="flex w-full flex-col items-center gap-1"
                    onClick={() => {
                      if (!seat) {
                        sit(room.id, index);
                        return;
                      }
                      setTarget(seat);
                      setGiftsOpen(false);
                    }}
                  >
                    <Avatar personId={seat} speaking={speaking} />
                    <span className="w-full truncate text-center text-xs font-bold">{name.split(" ")[0]}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {target ? (
            <div className="mt-4 rounded-card border border-line bg-panel p-3">
              <p className="font-extrabold">{displayName(target, profile.name)}</p>
              <p className="text-xs text-muted">{target === "me" ? "هذا مقعدك" : (personById(target)?.role ?? "")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {target !== "me" ? (
                  <>
                    <Button
                      variant="line"
                      onClick={() => {
                        const threadId = ensureThread(target);
                        navigate({ to: "/chats/$threadId", params: { threadId } });
                      }}
                    >
                      راسل
                    </Button>
                    <Button
                      onClick={() => {
                        setGiftsOpen(true);
                        setNote("");
                      }}
                    >
                      أهدِ
                    </Button>
                  </>
                ) : (
                  <Button variant="line" onClick={() => leaveSeat(room.id)}>
                    غادر المقعد
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">اضغط مقعداً فاضياً لتجلس، أو مضيفاً لتهدي وتراسل.</p>
          )}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void toggleMic()}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold",
                micOn ? "bg-accent text-ink" : "border border-line bg-panel text-ink",
              )}
            >
              {micOn ? <Mic className="size-4" aria-hidden="true" /> : <MicOff className="size-4" aria-hidden="true" />}
              {micOn ? "المايك مفتوح" : "افتح المايك"}
            </button>
            <Button variant="line" onClick={() => setGiftsOpen((value) => !value)}>
              هدايا
            </Button>
          </div>
          {micNote ? <p className="mt-2 text-xs text-muted">{micNote}</p> : null}
          {room.kind === "agency" ? (
            <p className="mt-2 text-xs text-muted">في قاعة الوكالة: 30% للمكتب و70% لصاحب المقعد.</p>
          ) : null}
        </section>

        <section className="flex min-h-72 flex-col border-t border-line md:border-s md:border-t-0">
          <div ref={log} className="flex max-h-80 flex-1 flex-col gap-2 overflow-y-auto px-4 py-3 md:max-h-none">
            {lines.map((line) => (
              <p key={line.id} className={cn("text-sm", line.kind === "gift" ? "font-bold text-accent" : "text-ink")}>
                <span className="text-muted">{clock(line.at)} · </span>
                {line.kind === "chat" ? `${displayName(line.authorId, profile.name).split(" ")[0]}: ` : ""}
                {line.text}
              </p>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-line px-3 py-3"
            onSubmit={(event) => {
              event.preventDefault();
              sayInRoom(room.id, draft);
              setDraft("");
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={180}
              placeholder="اكتب في القاعة"
              className="min-h-11 w-full rounded-xl border border-line bg-panel px-3 text-sm outline-none focus-visible:border-accent"
            />
            <button type="submit" className="inline-flex size-11 items-center justify-center rounded-xl bg-panel-2" aria-label="إرسال">
              <Send className="size-4" />
            </button>
          </form>
        </section>
      </div>

      {giftsOpen ? (
        <div className="border-t border-line bg-panel px-4 py-4">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
            <p className="text-sm font-bold">
              هدية إلى {targetName} · الرصيد <Franc value={balance} />
            </p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {GIFTS.map((gift) => {
                const Icon = GIFT_ICON[gift.id as keyof typeof GIFT_ICON];
                return (
                  <li key={gift.id}>
                    <button
                      type="button"
                      disabled={balance < gift.cost || targetId === "me"}
                      onClick={() => sendGift(gift.id)}
                      className="flex min-h-20 w-full flex-col items-center justify-center gap-1 rounded-xl border border-line bg-panel-2 text-sm font-bold disabled:opacity-40"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {gift.name}
                      <Franc value={gift.cost} className="text-xs text-muted" />
                    </button>
                  </li>
                );
              })}
            </ul>
            {note ? <p className="text-sm text-accent">{note}</p> : null}
          </div>
        </div>
      ) : note ? (
        <p className="px-4 pb-4 text-sm text-accent">{note}</p>
      ) : null}
    </div>
  );
}
