import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/drizzle/schema";
import { notifyQuoteAdded } from "@/lib/notifications";
import { quoteSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = quoteSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid quote." }, { status: 400 });
  const [order] = await db.update(orders).set({
    quotedPrice: String(parsed.data.price),
    quotedCurrency: parsed.data.currency,
    adminNotes: parsed.data.notes,
    status: "quoted",
    updatedAt: new Date(),
  }).where(eq(orders.id, parsed.data.orderId)).returning();
  await notifyQuoteAdded(parsed.data.orderId, parsed.data.price, parsed.data.currency);
  return NextResponse.json({ order });
}
