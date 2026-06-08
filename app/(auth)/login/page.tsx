import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <Link href="/" className="mb-8 font-display text-2xl font-bold text-primary">SA Sourcing Hub</Link>
      <h1 className="font-display text-4xl font-bold">Welcome back</h1>
      <p className="mb-6 mt-2 text-muted-foreground">Track your orders from South Africa to your city.</p>
      <Suspense><LoginForm /></Suspense>
    </main>
  );
}
