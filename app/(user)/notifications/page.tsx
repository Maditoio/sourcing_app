import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/drizzle/schema";
import { formatDate } from "@/lib/utils";
import { MarkReadButton } from "@/components/ui/MarkReadButton";

export default async function NotificationsPage() {
  const session = await auth();
  const rows = await db.select().from(notifications).where(eq(notifications.userId, session!.user.id)).orderBy(desc(notifications.createdAt));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="font-display text-4xl font-black">Notifications</h1><p className="text-muted-foreground">Recent order updates.</p></div><MarkReadButton /></div>
      <div className="space-y-3">{rows.map((item) => <Link key={item.id} href={item.orderId ? `/orders/${item.orderId}` : "/notifications"} className="block rounded-[2rem] bg-card p-5 card-shadow"><p className="font-bold">{item.message}</p><p className="mt-1 text-sm text-muted-foreground">{formatDate(item.createdAt)} · {item.isRead ? "Read" : "Unread"}</p></Link>)}{!rows.length ? <p className="rounded-[2rem] bg-card p-8 text-center text-muted-foreground card-shadow">No notifications yet.</p> : null}</div>
    </div>
  );
}
