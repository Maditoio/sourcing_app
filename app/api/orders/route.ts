import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderAttachments, orders, users } from "@/drizzle/schema";
import { notifyAdminNewOrder } from "@/lib/email";
import { createAdminNotification } from "@/lib/notifications";
import { generateOrderNumber } from "@/lib/utils";
import { orderSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  const where = status && status !== "all"
    ? and(eq(orders.userId, session.user.id), eq(orders.status, status as typeof orders.status.enumValues[number]))
    : eq(orders.userId, session.user.id);

  const rows = await db.select().from(orders).where(where).orderBy(desc(orders.createdAt));
  return NextResponse.json({ orders: rows });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the order form." }, { status: 400 });

  const orderNumber = await generateOrderNumber();
  const [order] = await db.insert(orders).values({
    userId: session.user.id,
    orderNumber,
    category: parsed.data.category,
    title: parsed.data.title,
    description: parsed.data.description,
    referenceUrl: parsed.data.referenceUrl || null,
    quantity: parsed.data.quantity,
    deliveryCountry: parsed.data.deliveryCountry,
    deliveryCity: parsed.data.deliveryCity,
    deliveryAddress: parsed.data.deliveryAddress,
    specialInstructions: parsed.data.specialInstructions,
  }).returning();

  if (parsed.data.attachments?.length) {
    await db.insert(orderAttachments).values(parsed.data.attachments.map((file) => ({ orderId: order.id, fileUrl: file.fileUrl, fileType: file.fileType })));
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  const message = `New order #${order.orderNumber} from ${user?.fullName || session.user.name} in ${user?.country || session.user.country}.`;
  await createAdminNotification(order.id, message);
  await notifyAdminNewOrder(order.orderNumber, user?.fullName || session.user.name || "Customer", user?.country || session.user.country || "Unknown");

  return NextResponse.json({ order }, { status: 201 });
}
