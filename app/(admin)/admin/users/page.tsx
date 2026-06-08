import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, users } from "@/drizzle/schema";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
  const allOrders = await db.select({ userId: orders.userId }).from(orders);
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl font-black">Users</h1><p className="text-muted-foreground">Registered buyers and admins.</p></div>
      <div className="overflow-x-auto rounded-[2rem] bg-card p-2 card-shadow"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-muted-foreground"><tr><th className="p-4">Name</th><th>Email</th><th>Country</th><th>City</th><th>Orders</th><th>Registered</th></tr></thead><tbody>{allUsers.map((user) => <tr key={user.id} className="border-t border-border"><td className="p-4 font-bold">{user.fullName}</td><td>{user.email}</td><td>{user.country}</td><td>{user.city}</td><td>{allOrders.filter((order) => order.userId === user.id).length}</td><td>{formatDate(user.createdAt)}</td></tr>)}</tbody></table></div>
    </div>
  );
}
