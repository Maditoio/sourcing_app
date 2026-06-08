import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, Truck } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { TopNav } from "@/components/layout/TopNav";

export default function Home() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-secondary/15 px-4 py-2 text-sm font-bold text-secondary">South Africa sourcing concierge</p>
            <h1 className="font-display text-5xl font-black tracking-tight text-foreground md:text-7xl">Order goods from South Africa, delivered across Africa.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">SA Sourcing Hub helps buyers in the DRC, Congo-Brazzaville and Nigeria request products, receive quotes, upload proof of payment and track every fulfillment step.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-bold text-primary-foreground">Place your first order <ArrowRight className="h-5 w-5" /></Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-border bg-white px-6 py-4 font-bold text-primary">Login</Link>
            </div>
          </div>
          <div className="rounded-[2.5rem] bg-card p-5 card-shadow">
            <div className="rounded-[2rem] bg-primary p-6 text-primary-foreground">
              <p className="text-primary-foreground/75">DRC — Kinshasa</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Your orders from South Africa</h2>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[ ["12", "Total"], ["3", "In Progress"], ["8", "Delivered"] ].map(([value, label]) => <div key={label} className="rounded-3xl bg-white/15 p-4 text-center"><p className="font-display text-3xl font-bold">{value}</p><p className="text-sm">{label}</p></div>)}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {Object.entries(CATEGORIES).slice(0, 4).map(([key, item]) => { const Icon = item.icon; return <div key={key} className="rounded-3xl bg-white p-5"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}><Icon /></span><p className="mt-4 font-bold">{item.label}</p></div>; })}
            </div>
          </div>
        </section>
        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[ [Globe2, "Tell us what you need", "Add details, links and reference photos."], [ShieldCheck, "Receive a verified quote", "Your sourcing agent reviews availability and pricing."], [Truck, "Track fulfillment", "Follow payment, sourcing, shipping and delivery." ] ].map(([Icon, title, copy]) => <div key={String(title)} className="rounded-[2rem] bg-card p-6 card-shadow"><Icon className="h-8 w-8 text-primary" /><h3 className="mt-5 font-display text-2xl font-bold">{String(title)}</h3><p className="mt-2 text-muted-foreground">{String(copy)}</p></div>)}
        </section>
        <section className="mt-16 rounded-[2rem] bg-secondary/10 p-6">
          <div className="flex flex-wrap items-center gap-3 font-bold text-secondary-foreground">
            <CheckCircle2 className="text-secondary" /> Countries served: DRC, Congo-Brazzaville, Nigeria and custom destinations by request.
          </div>
        </section>
      </main>
    </div>
  );
}
