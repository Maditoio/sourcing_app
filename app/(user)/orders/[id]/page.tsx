import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications, orderAttachments, orders } from "@/drizzle/schema";
import { CATEGORIES, type CategoryKey, type OrderStatus } from "@/lib/constants";
import { formatDate, formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StepperProgress } from "@/components/ui/StepperProgress";
import { PaymentProofUploader } from "@/components/forms/PaymentProofUploader";
import { CancelOrderButton } from "@/components/forms/CancelOrderButton";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const [order] = await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.userId, session!.user.id))).limit(1);
  if (!order) return <p>Order not found.</p>;
  const attachments = await db.select().from(orderAttachments).where(eq(orderAttachments.orderId, id));
  const notes = await db.select().from(notifications).where(and(eq(notifications.userId, session!.user.id), eq(notifications.orderId, id))).orderBy(desc(notifications.createdAt));
  const category = CATEGORIES[(order.category as CategoryKey) || "other"] ?? CATEGORIES.other;

  return (
    <div className="space-y-6">
      <Link href="/orders" className="font-bold text-primary">← Back to orders</Link>
      <section className="rounded-[2rem] bg-card p-6 card-shadow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-sm font-bold text-muted-foreground">{order.orderNumber}</p><h1 className="font-display text-4xl font-black">{order.title}</h1><p className="mt-1 text-muted-foreground">{category.label} · {formatDate(order.createdAt)}</p></div>
          <StatusBadge status={order.status as OrderStatus} />
        </div>
        <p className="mt-5 whitespace-pre-wrap text-lg leading-8">{order.description}</p>
      </section>
      <StepperProgress status={order.status as OrderStatus} />
      {order.status === "quoted" || order.status === "payment_pending" ? (
        <section className="rounded-[2rem] bg-secondary/15 p-6 card-shadow">
          <p className="text-sm font-bold text-secondary">Quote received</p>
          <h2 className="font-display text-4xl font-black">{formatMoney(order.quotedPrice, order.quotedCurrency || "USD")}</h2>
          <p className="mt-2 text-muted-foreground">Pay externally via bank transfer or mobile money, then upload proof of payment below.</p>
        </section>
      ) : null}
      {order.status === "quoted" || order.status === "payment_pending" ? <PaymentProofUploader orderId={order.id} /> : null}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[2rem] bg-card p-5 card-shadow"><h2 className="font-display text-xl font-bold">Delivery</h2><p className="mt-3 text-muted-foreground">{order.deliveryCountry}, {order.deliveryCity}</p><p className="whitespace-pre-wrap">{order.deliveryAddress}</p>{order.specialInstructions ? <p className="mt-3 text-sm text-muted-foreground">{order.specialInstructions}</p> : null}</div>
        <div className="rounded-[2rem] bg-card p-5 card-shadow"><h2 className="font-display text-xl font-bold">Attachments</h2><div className="mt-3 space-y-2">{attachments.map((file) => <a key={file.id} href={file.fileUrl} target="_blank" className="block truncate rounded-2xl bg-muted px-4 py-3 font-semibold text-primary">{file.fileType?.replaceAll("_", " ") || "file"}</a>)}{!attachments.length ? <p className="text-muted-foreground">No attachments uploaded.</p> : null}</div></div>
      </section>
      <section className="rounded-[2rem] bg-card p-5 card-shadow"><h2 className="font-display text-xl font-bold">Messages</h2><div className="mt-3 space-y-3">{notes.map((note) => <div key={note.id} className="rounded-2xl bg-muted p-4"><p className="font-semibold">{note.message}</p><p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p></div>)}{!notes.length ? <p className="text-muted-foreground">Updates from your agent will appear here.</p> : null}</div></section>
      {order.status === "pending" ? <CancelOrderButton orderId={order.id} /> : null}
    </div>
  );
}
