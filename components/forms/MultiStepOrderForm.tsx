"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, COUNTRIES, type CategoryKey } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { FileUploadZone, type UploadedFile } from "@/components/forms/FileUploadZone";

export function MultiStepOrderForm({ defaults }: { defaults?: { country?: string; city?: string; deliveryAddress?: string | null } }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [category, setCategory] = useState<CategoryKey>("auto_parts");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    setError("");
    const payload = Object.fromEntries(form.entries());
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, category, attachments }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not submit order.");
      return;
    }
    const data = await res.json();
    router.push(`/orders/${data.order.id}?created=1`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-3xl bg-card p-4 card-shadow">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((item) => <div key={item} className={cn("h-2 flex-1 rounded-full", step >= item ? "bg-primary" : "bg-muted")} />)}
        </div>
        <p className="mt-3 text-sm font-bold text-muted-foreground">Step {step} of 3</p>
      </div>

      {step === 1 ? (
        <section className="space-y-4 rounded-[2rem] bg-card p-5 card-shadow">
          <h2 className="font-display text-2xl font-bold">Item Details</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(CATEGORIES).map(([key, item]) => {
              const Icon = item.icon;
              return (
                <button key={key} type="button" onClick={() => setCategory(key as CategoryKey)} className={cn("rounded-3xl border p-4 text-left transition", category === key ? "border-primary bg-primary/10" : "border-border bg-white")}>
                  <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}><Icon className="h-6 w-6" /></span>
                  <span className="font-bold">{item.label}</span>
                </button>
              );
            })}
          </div>
          <input name="title" required placeholder="Item title" className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <textarea name="description" required rows={5} placeholder="Describe the item precisely: brand, model, color, size, specs" className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <input name="referenceUrl" type="url" placeholder="Reference URL (optional)" className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <input name="quantity" type="number" min="1" defaultValue="1" required className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4 rounded-[2rem] bg-card p-5 card-shadow">
          <h2 className="font-display text-2xl font-bold">Images & Attachments</h2>
          <FileUploadZone value={attachments} onChange={setAttachments} />
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-4 rounded-[2rem] bg-card p-5 card-shadow">
          <h2 className="font-display text-2xl font-bold">Delivery Details</h2>
          <select name="deliveryCountry" defaultValue={defaults?.country || "DRC"} required className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring">
            {COUNTRIES.map((country) => <option key={country}>{country}</option>)}
          </select>
          <input name="deliveryCity" defaultValue={defaults?.city || ""} required placeholder="City" className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <textarea name="deliveryAddress" defaultValue={defaults?.deliveryAddress || ""} required rows={4} placeholder="Full delivery address" className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <textarea name="specialInstructions" rows={3} placeholder="Special instructions (optional)" className="w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
          <div className="rounded-2xl bg-primary/10 p-4 text-sm font-semibold text-primary">Review your order details and submit. An agent will approve and quote your request.</div>
        </section>
      ) : null}

      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <div className="flex gap-3">
        {step > 1 ? <button type="button" onClick={() => setStep(step - 1)} className="flex-1 rounded-2xl border border-border bg-white px-5 py-3 font-bold">Back</button> : null}
        <button disabled={loading} className="flex-1 rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-60">{step === 3 ? (loading ? "Submitting..." : "Submit Order") : "Next"}</button>
      </div>
    </form>
  );
}
