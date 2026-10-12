import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/mallajaw/ui";
import { clock, personById, replyFor } from "@/lib/mallajaw/catalog";
import { cn } from "@/lib/cn";
import { useMj } from "@/lib/mallajaw/store";

export const Route = createFileRoute("/chats/$threadId")({ component: ThreadPage });

function ThreadPage() {
  const { threadId } = Route.useParams();
  const thread = useMj((state) => state.threads.find((item) => item.id === threadId));
  const messages = useMj((state) => state.messages.filter((item) => item.threadId === threadId));
  const profileName = useMj((state) => state.profile.name);
  const markRead = useMj((state) => state.markRead);
  const sendMessage = useMj((state) => state.sendMessage);
  const receiveMessage = useMj((state) => state.receiveMessage);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const person = thread ? personById(thread.personId) : undefined;

  useEffect(() => {
    markRead(threadId);
  }, [markRead, threadId]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages.length]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  if (!thread || !person) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8">
        <p className="text-muted">هذا الحديث ما لقيناهش.</p>
        <Link reloadDocument to="/chats" className="mt-3 font-bold text-accent">
          ارجع للدردشة
        </Link>
      </div>
    );
  }

  function send() {
    const text = draft.trim();
    if (!text || !person) return;
    setDraft("");
    sendMessage(threadId, text);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      receiveMessage(threadId, person.id, replyFor(person.id, text));
      markRead(threadId);
    }, 700);
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-xl flex-col md:h-dvh">
      <header className="flex items-center gap-2 border-b border-line px-3 py-2">
        <Link reloadDocument to="/chats" className="inline-flex size-11 items-center justify-center" aria-label="رجوع">
          <ChevronRight className="size-5" />
        </Link>
        <Avatar personId={person.id} size="sm" />
        <div className="min-w-0">
          <h1 className="truncate text-base font-extrabold">{person.name}</h1>
          <p className="truncate text-xs text-muted">
            {person.city} · {person.role}
          </p>
        </div>
      </header>
      <div ref={scroller} className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
        {messages.map((message) => {
          const mine = message.authorId === "me";
          return (
            <div key={message.id} className={cn("flex w-10/12 flex-col", mine ? "self-end" : "self-start")}>
              <p className={cn("rounded-2xl px-3 py-2 text-sm", mine ? "bg-accent text-ink" : "bg-panel-2 text-ink")}>
                {message.text}
              </p>
              <span className="mt-1 text-xs text-muted tabular-nums">
                {mine ? profileName : person.name.split(" ")[0]} · {clock(message.at)}
              </span>
            </div>
          );
        })}
      </div>
      <form
        className="flex items-center gap-2 border-t border-line px-3 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={280}
          placeholder="اكتب رسالة"
          className="min-h-11 w-full rounded-xl border border-line bg-panel px-3 text-sm text-ink outline-none focus-visible:border-accent"
        />
        <button
          type="submit"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-ink disabled:opacity-40"
          disabled={!draft.trim()}
          aria-label="إرسال"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
