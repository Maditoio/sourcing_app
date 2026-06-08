import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orderAttachments, orders, users } from "@/drizzle/schema";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const isAdmin = session.user.role === "admin";

  const [order] = await db.select({ order: orders, user: users }).from(orders).leftJoin(users, eq(orders.userId, users.id)).where(isAdmin ? eq(orders.id, id) : and(eq(orders.id, id), eq(orders.userId, session.user.id))).limit(1);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const attachments = await db.select().from(orderAttachments).where(eq(orderAttachments.orderId, id));
  return NextResponse.json({ ...order, attachments });
}

export async function PATCH(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  const [updated] = await db.update(orders).set({ status: "cancelled", updatedAt: new Date() }).where(and(eq(orders.id, id), eq(orders.userId, session.user.id), eq(orders.status, "pending"))).returning();
  if (!updated) return NextResponse.json({ error: "Only pending orders can be cancelled." }, { status: 400 });
  return NextResponse.json({ order: updated });
}
