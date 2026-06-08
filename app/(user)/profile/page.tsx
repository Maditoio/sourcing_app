import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { ProfileForm } from "@/components/forms/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const [user] = await db.select().from(users).where(eq(users.id, session!.user.id)).limit(1);
  if (!user) return <p>Profile not found.</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><h1 className="font-display text-4xl font-black">Profile</h1><p className="text-muted-foreground">Update your contact and delivery defaults.</p></div>
      <ProfileForm user={user} />
      <section className="rounded-[2rem] bg-card p-6 card-shadow"><h2 className="font-display text-xl font-bold">Change password</h2><p className="mt-2 text-muted-foreground">Password change UI is reserved for the next security pass.</p></section>
    </div>
  );
}
