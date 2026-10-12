import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  MESSAGES,
  ROOMS,
  ROOM_LINES,
  SCRATCH_CARDS,
  THREADS,
  WELCOME_LEDGER,
  type CountryId,
  type DirectMessage,
  type LedgerEntry,
  type Room,
  type RoomLine,
  type Thread,
} from "@/lib/mallajaw/catalog";

type Profile = {
  name: string;
  country: CountryId;
  agencyId: string | null;
};

type Data = {
  profile: Profile;
  rooms: Room[];
  threads: Thread[];
  messages: DirectMessage[];
  roomLines: RoomLine[];
  ledger: LedgerEntry[];
  usedCodes: string[];
  giftsSent: number;
};

type Actions = {
  setProfile: (patch: Partial<Profile>) => void;
  joinAgency: (agencyId: string | null) => void;
  markRead: (threadId: string) => void;
  ensureThread: (personId: string) => string;
  sendMessage: (threadId: string, text: string) => void;
  receiveMessage: (threadId: string, authorId: string, text: string) => void;
  createRoom: (title: string, lock?: string) => string;
  sit: (roomId: string, index: number) => void;
  leaveSeat: (roomId: string) => void;
  sayInRoom: (roomId: string, text: string) => void;
  giveGift: (roomId: string, giftName: string, cost: number, targetName: string) => string | null;
  redeem: (code: string) => { ok: true; francs: number } | { ok: false; reason: string };
  resetCards: () => void;
};

export type MjState = Data & Actions;

const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

const initial: Data = {
  profile: { name: "ضيف ملا جو", country: "TN", agencyId: null },
  rooms: ROOMS,
  threads: THREADS,
  messages: MESSAGES,
  roomLines: ROOM_LINES,
  ledger: WELCOME_LEDGER,
  usedCodes: [],
  giftsSent: 0,
};

export function balanceOf(ledger: LedgerEntry[]) {
  return ledger.reduce((sum, entry) => sum + entry.delta, 0);
}

export const useMj = create<MjState>()(
  persist(
    (set, get) => ({
      ...initial,
      setProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
      joinAgency: (agencyId) => set((state) => ({ profile: { ...state.profile, agencyId } })),
      markRead: (threadId) =>
        set((state) => ({
          threads: state.threads.map((thread) => (thread.id === threadId ? { ...thread, unread: 0 } : thread)),
        })),
      ensureThread: (personId) => {
        const found = get().threads.find((thread) => thread.personId === personId);
        if (found) return found.id;
        const id = uid("t");
        set((state) => ({ threads: [{ id, personId, unread: 0 }, ...state.threads] }));
        return id;
      },
      sendMessage: (threadId, text) => {
        const clean = text.trim();
        if (!clean) return;
        const message: DirectMessage = {
          id: uid("m"),
          threadId,
          authorId: "me",
          text: clean.slice(0, 280),
          at: Date.now(),
        };
        set((state) => ({ messages: [...state.messages, message] }));
      },
      receiveMessage: (threadId, authorId, text) => {
        const message: DirectMessage = {
          id: uid("m"),
          threadId,
          authorId,
          text,
          at: Date.now(),
        };
        set((state) => ({
          messages: [...state.messages, message],
          threads: state.threads.map((thread) =>
            thread.id === threadId ? { ...thread, unread: thread.unread + 1 } : thread,
          ),
        }));
      },
      createRoom: (title, lock) => {
        const id = uid("user");
        const room: Room = {
          id,
          kind: "private",
          title: title.slice(0, 40),
          topic: lock ? "غرفة خاصة مقفلة" : "غرفة خاصة مفتوحة",
          hostId: "me",
          seats: ["me", null, null, null, null, null, null, null],
          listeners: 1,
          lock: lock || undefined,
        };
        const line: RoomLine = {
          id: uid("rl"),
          roomId: id,
          authorId: "system",
          text: "أنت فتحت الغرفة",
          at: Date.now(),
          kind: "system",
        };
        set((state) => ({ rooms: [room, ...state.rooms], roomLines: [...state.roomLines, line] }));
        return id;
      },
      sit: (roomId, index) =>
        set((state) => ({
          rooms: state.rooms.map((room) => {
            if (room.id !== roomId) return room;
            if (room.seats[index] && room.seats[index] !== "me") return room;
            const seats = room.seats.map((seat) => (seat === "me" ? null : seat));
            seats[index] = "me";
            return { ...room, seats };
          }),
        })),
      leaveSeat: (roomId) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === roomId ? { ...room, seats: room.seats.map((seat) => (seat === "me" ? null : seat)) } : room,
          ),
        })),
      sayInRoom: (roomId, text) => {
        const clean = text.trim();
        if (!clean) return;
        const line: RoomLine = {
          id: uid("rl"),
          roomId,
          authorId: "me",
          text: clean.slice(0, 180),
          at: Date.now(),
          kind: "chat",
        };
        set((state) => ({ roomLines: [...state.roomLines, line] }));
      },
      giveGift: (roomId, giftName, cost, targetName) => {
        const francs = balanceOf(get().ledger);
        if (francs < cost) return "رصيد الفرنك ما يكفيش.";
        const line: RoomLine = {
          id: uid("rl"),
          roomId,
          authorId: "me",
          text: `أهدى ${giftName} إلى ${targetName}`,
          at: Date.now(),
          kind: "gift",
        };
        const entry: LedgerEntry = {
          id: uid("lg"),
          at: Date.now(),
          label: `${giftName} إلى ${targetName}`,
          delta: -cost,
        };
        set((state) => ({
          roomLines: [...state.roomLines, line],
          ledger: [entry, ...state.ledger],
          giftsSent: state.giftsSent + 1,
        }));
        return null;
      },
      redeem: (code) => {
        const digits = code.replace(/\D/g, "");
        const card = SCRATCH_CARDS.find((item) => item.code === digits);
        if (!card) return { ok: false as const, reason: "الرمز ما عندوش بطاقة تجريبية. اختار واحدة من القائمة." };
        if (get().usedCodes.includes(digits)) return { ok: false as const, reason: "هذه البطاقة استُعملت. فعّلها من جديد من صفحة أنا." };
        const entry: LedgerEntry = {
          id: uid("lg"),
          at: Date.now(),
          label: `شحن ${card.face}`,
          delta: card.francs,
        };
        set((state) => ({
          usedCodes: [...state.usedCodes, digits],
          ledger: [entry, ...state.ledger],
        }));
        return { ok: true as const, francs: card.francs };
      },
      resetCards: () => set({ usedCodes: [] }),
    }),
    {
      name: "mallajaw-v1",
      skipHydration: true,
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
      partialize: (state) => ({
        profile: state.profile,
        rooms: state.rooms,
        threads: state.threads,
        messages: state.messages,
        roomLines: state.roomLines,
        ledger: state.ledger,
        usedCodes: state.usedCodes,
        giftsSent: state.giftsSent,
      }),
    },
  ),
);

export function useBalance() {
  return useMj((state) => balanceOf(state.ledger));
}
