"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/lib/constants";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Registration failed.");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email: payload.email, password: payload.password, redirect: false });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] bg-card p-6 card-shadow">
      <div>
        <label className="text-sm font-bold">Full name</label>
        <input name="fullName" required className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold">Email</label>
          <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-bold">Password</label>
          <input name="password" type="password" minLength={8} required className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold">Phone</label>
          <input name="phone" className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-bold">Country</label>
          <select name="country" required className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring">
            {COUNTRIES.map((country) => <option key={country}>{country}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-bold">City</label>
        <input name="city" className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </div>
      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button disabled={loading} className="w-full rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-60">{loading ? "Creating account..." : "Create account"}</button>
      <p className="text-center text-sm text-muted-foreground">Already registered? <Link href="/login" className="font-bold text-primary">Login</Link></p>
    </form>
  );
}
