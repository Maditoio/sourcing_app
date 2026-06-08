import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, users } from "@/drizzle/schema";
import { IN_PROGRESS_STATUSES, type OrderStatus } from "@/lib/constants";
import { OrderCard } from "@/components/ui/OrderCard";
import { NotificationBell } from "@/components/ui/NotificationBell";

export default async function DashboardPage() {
  const session = await auth();
  const userOrders = await db.select().from(orders).where(eq(orders.userId, session!.user.id)).orderBy(desc(orders.createdAt));
  const [user] = await db.select().from(users).where(eq(users.id, session!.user.id)).limit(1);
  const stats = {
    total: userOrders.length,
    pending: userOrders.filter((order) => order.status === "pending").length,
    approved: userOrders.filter((order) => order.status === "approved").length,
    progress: userOrders.filter((order) => IN_PROGRESS_STATUSES.includes(order.status as OrderStatus)).length,
    delivered: userOrders.filter((order) => order.status === "delivered").length,
  };

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted-foreground">Good morning,</p>
          <h1 className="font-display text-4xl font-black">{user?.fullName || session?.user.name}</h1>
        </div>
        <NotificationBell />
      </header>
      <section className="rounded-[2rem] bg-primary p-6 text-primary-foreground card-shadow">
        <p className="text-primary-foreground/75">{user?.country || session?.user.country} — {user?.city || "Your city"}</p>
        <h2 className="mt-2 font-display text-3xl font-bold">Your orders from South Africa</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[ [stats.total, "Total"], [stats.pending, "Pending"], [stats.approved, "Approved"], [stats.progress, "In Progress"], [stats.delivered, "Delivered"] ].map(([value, label]) => <div key={String(label)} className="rounded-3xl bg-white/15 p-4 text-center"><p className="font-display text-3xl font-bold">{value}</p><p className="text-sm">{label}</p></div>)}
        </div>
      </section>
      <section className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold uppercase tracking-[0.18em] text-muted-foreground">Recent Orders</h2>
        <Link href="/orders/new" className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 font-bold text-secondary-foreground"><Plus className="h-5 w-5" /> New</Link>
      </section>
      <div className="space-y-3">
        {userOrders.slice(0, 5).map((order) => <OrderCard key={order.id} order={{ ...order, status: order.status as OrderStatus }} href={`/orders/${order.id}`} />)}
        {!userOrders.length ? <div className="rounded-[2rem] bg-card p-8 text-center card-shadow"><Bell className="mx-auto h-8 w-8 text-primary" /><p className="mt-3 font-bold">No orders yet.</p><Link href="/orders/new" className="mt-4 inline-flex rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground">Place New Order</Link></div> : null}
      </div>
    </div>
  );
}
