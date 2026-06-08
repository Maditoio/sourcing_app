import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { registerSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const allowed = await checkRateLimit(`register:${ip}`);
  if (!allowed) return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429 });
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  }

  try {
    const email = parsed.data.email.toLowerCase();
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await db.insert(users).values({
      fullName: parsed.data.fullName,
      email,
      passwordHash,
      phone: parsed.data.phone,
      country: parsed.data.country,
      city: parsed.data.city,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Registration database error", error);
    return NextResponse.json(
      { error: "We could not connect to the database. Please verify the DATABASE_URL environment variable." },
      { status: 503 },
    );
  }
}
