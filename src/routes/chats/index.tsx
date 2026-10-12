import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, Page } from "@/components/mallajaw/ui";
import { clock, personById } from "@/lib/mallajaw/catalog";
import { useMj } from "@/lib/mallajaw/store";

export const Route = createFileRoute("/chats/")({ component: ChatsPage });

function ChatsPage() {
  const threads = useMj((state) => state.threads);
  const messages = useMj((state) => state.messages);
  const ordered = [...threads].sort((a, b) => {
    const lastA = messages.filter((message) => message.threadId === a.id).at(-1)?.at ?? 0;
    const lastB = messages.filter((message) => message.threadId === b.id).at(-1)?.at ?? 0;
    return lastB - lastA;
  });

  return (
    <Page title="الدردشة">
      <ul className="flex flex-col gap-2">
        {ordered.map((thread) => {
          const person = personById(thread.personId);
          const last = messages.filter((message) => message.threadId === thread.id).at(-1);
          if (!person) return null;
          return (
            <li key={thread.id}>
              <Link reloadDocument
                to="/chats/$threadId"
                params={{ threadId: thread.id }}
                className="flex items-center gap-3 rounded-card border border-line bg-panel p-3"
              >
                <Avatar personId={person.id} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-extrabold">{person.name}</span>
                    {last ? <span className="text-xs text-muted tabular-nums">{clock(last.at)}</span> : null}
                  </span>
                  <span className="block truncate text-sm text-muted">{last?.text ?? "ابدأ الحديث"}</span>
                </span>
                {thread.unread > 0 ? (
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-ink">
                    {thread.unread}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
