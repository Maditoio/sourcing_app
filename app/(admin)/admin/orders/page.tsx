import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, users } from "@/drizzle/schema";
import { CATEGORIES, type CategoryKey, type OrderStatus } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function AdminOrdersPage() {
  const rows = await db.select({ order: orders, user: users }).from(orders).leftJoin(users, eq(orders.userId, users.id)).orderBy(desc(orders.createdAt));
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl font-black">All Orders</h1><p className="text-muted-foreground">Search and filters can be expanded on this table.</p></div>
      <div className="overflow-x-auto rounded-[2rem] bg-card p-2 card-shadow">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-muted-foreground"><tr><th className="p-4">Order #</th><th>User</th><th>Country</th><th>Category</th><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{rows.map(({ order, user }) => <tr key={order.id} className="border-t border-border"><td className="p-4 font-bold">{order.orderNumber}</td><td>{user?.fullName}</td><td>{user?.country}</td><td>{CATEGORIES[(order.category as CategoryKey) || "other"]?.label}</td><td className="max-w-[220px] truncate">{order.title}</td><td><StatusBadge status={order.status as OrderStatus} /></td><td>{formatDate(order.createdAt)}</td><td><Link href={`/admin/orders/${order.id}`} className="font-bold text-primary">View</Link></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
