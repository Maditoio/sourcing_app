import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications, orders, users } from "@/drizzle/schema";
import { notifyUser } from "@/lib/email";
import { formatMoney } from "@/lib/utils";
import type { OrderStatus } from "@/lib/constants";

const statusMessages: Partial<Record<OrderStatus, { type: "order_approved" | "payment_confirmed" | "order_shipped" | "order_delivered" | "general"; message: (orderNumber: string) => string }>> = {
  approved: { type: "order_approved", message: (n) => `Your order #${n} has been approved! We're reviewing pricing.` },
  paid: { type: "payment_confirmed", message: (n) => `Your payment for order #${n} has been confirmed. We're now sourcing your items.` },
  sourcing: { type: "general", message: (n) => `We're now sourcing the items for order #${n}.` },
  shipped: { type: "order_shipped", message: (n) => `Great news! Order #${n} has been shipped.` },
  delivered: { type: "order_delivered", message: (n) => `Order #${n} has been marked as delivered.` },
};

export async function createUserNotification(userId: string | null | undefined, orderId: string | null | undefined, message: string, type: "order_approved" | "quote_received" | "payment_confirmed" | "order_shipped" | "order_delivered" | "general") {
  if (!userId) return;
  await db.insert(notifications).values({ userId, orderId, message, type });
}

export async function createAdminNotification(orderId: string, message: string) {
  const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, "admin")).limit(10);
  if (!admins.length) return;
  await db.insert(notifications).values(admins.map((admin) => ({ userId: admin.id, orderId, message, type: "general" as const })));
}

export async function notifyOrderStatus(orderId: string, status: OrderStatus) {
  const [row] = await db.select({
    orderNumber: orders.orderNumber,
    userId: orders.userId,
    email: users.email,
  }).from(orders).leftJoin(users, eq(orders.userId, users.id)).where(eq(orders.id, orderId)).limit(1);

  const config = statusMessages[status];
  if (!row || !config) return;
  const message = config.message(row.orderNumber);
  await createUserNotification(row.userId, orderId, message, config.type);
  await notifyUser(row.email, `Order ${row.orderNumber} update`, message);
}

export async function notifyQuoteAdded(orderId: string, price: number, currency: string) {
  const [row] = await db.select({
    orderNumber: orders.orderNumber,
    userId: orders.userId,
    email: users.email,
  }).from(orders).leftJoin(users, eq(orders.userId, users.id)).where(eq(orders.id, orderId)).limit(1);
  if (!row) return;
  const message = `Your order #${row.orderNumber} has been quoted at ${formatMoney(price, currency)}. Please review and upload proof of payment.`;
  await createUserNotification(row.userId, orderId, message, "quote_received");
  await notifyUser(row.email, `Quote for order ${row.orderNumber}`, message);
}
