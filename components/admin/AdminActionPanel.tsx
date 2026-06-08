"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/constants";

export function AdminActionPanel({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function updateStatus(status: OrderStatus) {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMessage(res.ok ? "Status updated." : "Could not update status.");
    router.refresh();
  }

  async function addQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const res = await fetch("/api/admin/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, orderId }),
    });
    setMessage(res.ok ? "Quote sent." : "Could not add quote.");
    router.refresh();
  }

  return (
    <aside className="space-y-5 rounded-[2rem] bg-card p-5 card-shadow">
      <div>
        <p className="font-display text-xl font-bold">Admin actions</p>
        <p className="text-sm text-muted-foreground">Current status: {STATUS_LABELS[currentStatus]}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ORDER_STATUSES.filter((status) => status !== "cancelled").map((status) => (
          <button key={status} onClick={() => updateStatus(status)} className="rounded-2xl border border-border bg-white px-3 py-2 text-sm font-bold hover:border-primary">{STATUS_LABELS[status]}</button>
        ))}
      </div>
      <form onSubmit={addQuote} className="space-y-3 rounded-3xl bg-primary/5 p-4">
        <p className="font-bold">Add quote</p>
        <input name="price" type="number" step="0.01" placeholder="Price" required className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
        <select name="currency" defaultValue="USD" className="w-full rounded-2xl border border-border bg-white px-4 py-3">
          <option>USD</option>
          <option>ZAR</option>
        </select>
        <textarea name="notes" placeholder="Notes" rows={3} className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
        <button className="w-full rounded-2xl bg-secondary px-5 py-3 font-bold text-secondary-foreground">Send quote</button>
      </form>
      {message ? <p className="text-sm font-semibold text-primary">{message}</p> : null}
    </aside>
  );
}
