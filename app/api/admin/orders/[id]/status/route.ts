import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/drizzle/schema";
import { notifyOrderStatus } from "@/lib/notifications";
import { statusSchema } from "@/lib/validations";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const [order] = await db.update(orders).set({ status: parsed.data.status, adminNotes: parsed.data.adminNotes, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
  await notifyOrderStatus(id, parsed.data.status);
  return NextResponse.json({ order });
}
