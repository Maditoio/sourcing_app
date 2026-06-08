import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { COUNTRIES } from "@/lib/constants";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const country = COUNTRIES.includes(body.country) ? body.country : "Other";
  const [user] = await db.update(users).set({
    fullName: String(body.fullName || "").trim(),
    phone: body.phone || null,
    country,
    city: body.city || null,
    deliveryAddress: body.deliveryAddress || null,
  }).where(eq(users.id, session.user.id)).returning();
  return NextResponse.json({ user });
}
