import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { MultiStepOrderForm } from "@/components/forms/MultiStepOrderForm";

export default async function NewOrderPage() {
  const session = await auth();
  const [user] = await db.select().from(users).where(eq(users.id, session!.user.id)).limit(1);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div><h1 className="font-display text-4xl font-black">Place New Order</h1><p className="text-muted-foreground">Give us the clearest details possible so we can quote quickly.</p></div>
      <MultiStepOrderForm defaults={{ country: user?.country, city: user?.city || "", deliveryAddress: user?.deliveryAddress }} />
    </div>
  );
}
