import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-10">
      <Link href="/" className="mb-8 font-display text-2xl font-bold text-primary">SA Sourcing Hub</Link>
      <h1 className="font-display text-4xl font-bold">Create your account</h1>
      <p className="mb-6 mt-2 text-muted-foreground">Order auto parts, electronics, appliances, mining equipment and groceries without travelling.</p>
      <RegisterForm />
    </main>
  );
}
