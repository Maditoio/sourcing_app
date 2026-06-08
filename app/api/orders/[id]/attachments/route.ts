import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderAttachments, orders } from "@/drizzle/schema";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const [order] = await db.select({ id: orders.id }).from(orders).where(and(eq(orders.id, id), eq(orders.userId, session.user.id))).limit(1);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  const [attachment] = await db.insert(orderAttachments).values({ orderId: id, fileUrl: body.fileUrl, fileType: body.fileType || "proof_of_payment" }).returning();
  await db.update(orders).set({ status: "payment_pending", updatedAt: new Date() }).where(eq(orders.id, id));
  return NextResponse.json({ attachment });
}
