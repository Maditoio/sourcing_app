import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/drizzle/schema";
import { IN_PROGRESS_STATUSES, type OrderStatus } from "@/lib/constants";
import { OrderCard } from "@/components/ui/OrderCard";

const tabs = ["all", "pending", "approved", "quoted", "in_progress", "delivered"];

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  const selected = params.status || "all";
  const rows = await db.select().from(orders).where(eq(orders.userId, session!.user.id)).orderBy(desc(orders.createdAt));
  const filtered = selected === "all" ? rows : selected === "in_progress" ? rows.filter((order) => IN_PROGRESS_STATUSES.includes(order.status as OrderStatus)) : rows.filter((order) => order.status === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div><h1 className="font-display text-4xl font-black">Orders</h1><p className="text-muted-foreground">Track all your requests.</p></div>
        <Link href="/orders/new" className="rounded-2xl bg-primary px-4 py-3 font-bold text-primary-foreground">New</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => <Link key={tab} href={`/orders?status=${tab}`} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${selected === tab ? "bg-primary text-primary-foreground" : "bg-white text-muted-foreground"}`}>{tab.replace("_", " ")}</Link>)}
      </div>
      <div className="space-y-3">
        {filtered.map((order) => <OrderCard key={order.id} order={{ ...order, status: order.status as OrderStatus }} href={`/orders/${order.id}`} />)}
        {!filtered.length ? <p className="rounded-[2rem] bg-card p-8 text-center font-semibold text-muted-foreground card-shadow">No orders in this filter.</p> : null}
      </div>
    </div>
  );
}
