"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/lib/constants";

export function ProfileForm({ user }: { user: { fullName: string; phone?: string | null; country: string; city?: string | null; deliveryAddress?: string | null } }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setMessage(res.ok ? "Profile updated." : "Could not update profile.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] bg-card p-6 card-shadow">
      <input name="fullName" defaultValue={user.fullName} className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
      <input name="phone" defaultValue={user.phone || ""} placeholder="Phone" className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
      <select name="country" defaultValue={user.country} className="w-full rounded-2xl border border-border bg-white px-4 py-3">
        {COUNTRIES.map((country) => <option key={country}>{country}</option>)}
      </select>
      <input name="city" defaultValue={user.city || ""} placeholder="City" className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
      <textarea name="deliveryAddress" defaultValue={user.deliveryAddress || ""} rows={4} placeholder="Default delivery address" className="w-full rounded-2xl border border-border bg-white px-4 py-3" />
      <button className="w-full rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground">Save profile</button>
      {message ? <p className="text-sm font-semibold text-primary">{message}</p> : null}
    </form>
  );
}
