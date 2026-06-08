import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orderAttachments, orders, users } from "@/drizzle/schema";
import { CATEGORIES, type CategoryKey, type OrderStatus } from "@/lib/constants";
import { formatDate, formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AdminActionPanel } from "@/components/admin/AdminActionPanel";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db.select({ order: orders, user: users }).from(orders).leftJoin(users, eq(orders.userId, users.id)).where(eq(orders.id, id)).limit(1);
  if (!row) return <p>Order not found.</p>;
  const attachments = await db.select().from(orderAttachments).where(eq(orderAttachments.orderId, id));
  const category = CATEGORIES[(row.order.category as CategoryKey) || "other"] ?? CATEGORIES.other;

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="font-bold text-primary">← Back to admin orders</Link>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-[2rem] bg-card p-6 card-shadow"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold text-muted-foreground">{row.order.orderNumber}</p><h1 className="font-display text-4xl font-black">{row.order.title}</h1><p className="text-muted-foreground">{category.label} · {formatDate(row.order.createdAt)}</p></div><StatusBadge status={row.order.status as OrderStatus} /></div><p className="mt-5 whitespace-pre-wrap text-lg leading-8">{row.order.description}</p></section>
          <section className="grid gap-4 md:grid-cols-2"><div className="rounded-[2rem] bg-card p-5 card-shadow"><h2 className="font-display text-xl font-bold">Customer</h2><p className="mt-3 font-bold">{row.user?.fullName}</p><p>{row.user?.email}</p><p className="text-muted-foreground">{row.user?.country}, {row.user?.city}</p></div><div className="rounded-[2rem] bg-card p-5 card-shadow"><h2 className="font-display text-xl font-bold">Quote</h2><p className="mt-3 font-display text-3xl font-black">{row.order.quotedPrice ? formatMoney(row.order.quotedPrice, row.order.quotedCurrency || "USD") : "No quote yet"}</p><p className="text-muted-foreground">{row.order.adminNotes}</p></div></section>
          <section className="rounded-[2rem] bg-card p-5 card-shadow"><h2 className="font-display text-xl font-bold">Attachments</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{attachments.map((file) => <a key={file.id} href={file.fileUrl} target="_blank" className="truncate rounded-2xl bg-muted px-4 py-3 font-semibold text-primary">{file.fileType?.replaceAll("_", " ") || "file"}</a>)}{!attachments.length ? <p className="text-muted-foreground">No attachments.</p> : null}</div></section>
        </div>
        <AdminActionPanel orderId={row.order.id} currentStatus={row.order.status as OrderStatus} />
      </div>
    </div>
  );
}
