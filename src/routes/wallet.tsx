import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button, Franc, Page } from "@/components/mallajaw/ui";
import {
  clock,
  COUNTRIES,
  OPERATORS,
  SCRATCH_CARDS,
  type CountryId,
  type OperatorId,
} from "@/lib/mallajaw/catalog";
import { cn } from "@/lib/cn";
import { balanceOf, useMj } from "@/lib/mallajaw/store";

export const Route = createFileRoute("/wallet")({ component: WalletPage });

function groupPin(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function WalletPage() {
  const profileCountry = useMj((state) => state.profile.country);
  const ledger = useMj((state) => state.ledger);
  const usedCodes = useMj((state) => state.usedCodes);
  const redeem = useMj((state) => state.redeem);
  const balance = balanceOf(ledger);
  const [country, setCountry] = useState<CountryId>(profileCountry);
  const [operator, setOperator] = useState<OperatorId>("orange");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const cards = useMemo(
    () => SCRATCH_CARDS.filter((card) => card.country === country && card.operator === operator),
    [country, operator],
  );

  function submit(code: string) {
    const result = redeem(code);
    if (result.ok) {
      setOk(true);
      setMessage(`تمت إضافة ${new Intl.NumberFormat("fr-FR").format(result.francs)} فرنك. البطاقة ما تخصمش هاتفك الحقيقي.`);
      setPin("");
    } else {
      setOk(false);
      setMessage(result.reason);
    }
  }

  return (
    <Page title="المحفظة" action={<Franc value={balance} className="text-lg font-extrabold" />}>
      <p className="mb-4 text-sm text-muted">
        الشحن تجريبي داخل ملا جو. الرمز يضيف فرنكات هنا ولا يُرسل إلى أورونج أو أوريدو أو تيليكوم، ولا يُخصم من رصيد الخط.
      </p>

      <div className="mb-3 grid grid-cols-3 gap-2">
        {COUNTRIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCountry(item.id)}
            className={cn(
              "min-h-11 rounded-xl border text-sm font-bold",
              country === item.id ? "border-accent bg-panel-2 text-ink" : "border-line bg-panel text-muted",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {OPERATORS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOperator(item.id)}
            className={cn(
              "min-h-11 rounded-xl border px-2 text-sm font-bold",
              operator === item.id ? "border-accent bg-panel-2 text-ink" : "border-line bg-panel text-muted",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>

      <ul className="mb-4 flex flex-col gap-2">
        {cards.map((card) => {
          const used = usedCodes.includes(card.code);
          return (
            <li key={card.code}>
              <button
                type="button"
                disabled={used}
                onClick={() => {
                  setPin(groupPin(card.code));
                  setMessage("");
                }}
                className="flex w-full items-center justify-between rounded-card border border-line bg-panel px-4 py-3 text-start disabled:opacity-40"
              >
                <span>
                  <span className="block font-extrabold">{card.face}</span>
                  <span className="text-xs text-muted">{used ? "استُعملت" : "بطاقة تجريبية — اضغط لتعبئة الرمز"}</span>
                </span>
                <Franc value={card.francs} className="font-bold" />
              </button>
            </li>
          );
        })}
      </ul>

      <form
        className="rounded-card border border-line bg-panel p-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit(pin);
        }}
      >
        <label htmlFor="pin" className="text-sm font-bold">
          رمز البطاقة
        </label>
        <input
          id="pin"
          value={pin}
          onChange={(event) => setPin(groupPin(event.target.value))}
          inputMode="numeric"
          autoComplete="off"
          placeholder="14 رقماً"
          className="mt-2 w-full rounded-xl border border-line bg-panel-2 px-3 py-3 text-lg tracking-wider text-ink outline-none focus-visible:border-accent"
        />
        <Button type="submit" className="mt-3 w-full">
          اشحن الفرنك
        </Button>
        {message ? <p className={cn("mt-3 text-sm", ok ? "text-ink" : "text-accent")}>{message}</p> : null}
      </form>

      <h2 className="mt-6 mb-2 text-sm font-bold text-muted">الحركة</h2>
      <ul className="flex flex-col gap-2">
        {ledger.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between rounded-xl border border-line bg-panel px-3 py-3">
            <span>
              <span className="block text-sm font-bold">{entry.label}</span>
              <span className="text-xs text-muted tabular-nums">{clock(entry.at)}</span>
            </span>
            <Franc value={entry.delta} signed className={cn("font-bold", entry.delta < 0 && "text-muted")} />
          </li>
        ))}
      </ul>
    </Page>
  );
}
