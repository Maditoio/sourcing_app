"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(search.get("callbackUrl") || "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] bg-card p-6 card-shadow">
      <div>
        <label className="text-sm font-bold">Email</label>
        <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label className="text-sm font-bold">Password</label>
        <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </div>
      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button disabled={loading} className="w-full rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-60">{loading ? "Signing in..." : "Login"}</button>
      <p className="text-center text-sm text-muted-foreground">New here? <Link href="/register" className="font-bold text-primary">Create an account</Link></p>
    </form>
  );
}
