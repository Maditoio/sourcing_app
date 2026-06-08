import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const unreadOnly = url.searchParams.get("unread") === "1";
  const where = unreadOnly ? and(eq(notifications.userId, session.user.id), eq(notifications.isRead, false)) : eq(notifications.userId, session.user.id);
  const rows = await db.select().from(notifications).where(where).orderBy(desc(notifications.createdAt)).limit(unreadOnly ? 100 : 50);
  return NextResponse.json({ notifications: rows, unreadCount: rows.filter((item) => !item.isRead).length });
}

export async function PATCH() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, session.user.id));
  return NextResponse.json({ ok: true });
}
