import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/drizzle/schema";
import { formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderStatus } from "@/lib/constants";

export default async function AdminDashboardPage() {
  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const [weekly] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(sql`${orders.createdAt} > now() - interval '7 days'`);
  const thisWeek = weekly?.count ?? 0;
  const revenue = allOrders.reduce((sum, order) => sum + Number(order.quotedPrice || 0), 0);
  const statuses = ["pending", "approved", "quoted", "payment_pending", "paid", "sourcing", "shipped", "delivered"] as OrderStatus[];

  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl font-black">Admin Dashboard</h1><p className="text-muted-foreground">Manage every sourcing request from quote to delivery.</p></div>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[2rem] bg-card p-6 card-shadow"><p className="text-sm font-bold text-muted-foreground">Total orders</p><p className="font-display text-4xl font-black">{allOrders.length}</p></div>
        <div className="rounded-[2rem] bg-card p-6 card-shadow"><p className="text-sm font-bold text-muted-foreground">Orders this week</p><p className="font-display text-4xl font-black">{thisWeek}</p></div>
        <div className="rounded-[2rem] bg-card p-6 card-shadow"><p className="text-sm font-bold text-muted-foreground">Revenue quoted</p><p className="font-display text-4xl font-black">{formatMoney(revenue, "USD")}</p></div>
      </section>
      <section className="grid gap-3 sm:grid-cols-4">{statuses.map((status) => <div key={status} className="rounded-3xl bg-card p-4 card-shadow"><StatusBadge status={status} /><p className="mt-3 font-display text-3xl font-bold">{allOrders.filter((order) => order.status === status).length}</p></div>)}</section>
      <section className="rounded-[2rem] bg-card p-5 card-shadow"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Latest orders</h2><Link href="/admin/orders" className="font-bold text-primary">View all</Link></div><div className="mt-4 space-y-3">{allOrders.slice(0, 6).map((order) => <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between rounded-2xl bg-muted p-4"><span className="font-bold">{order.orderNumber}</span><StatusBadge status={order.status as OrderStatus} /></Link>)}</div></section>
    </div>
  );
}
