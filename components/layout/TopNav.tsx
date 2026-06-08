import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { NotificationBell } from "@/components/ui/NotificationBell";

export async function TopNav() {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 hidden border-b border-border/70 bg-card/85 backdrop-blur md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={user ? "/dashboard" : "/"} className="font-display text-xl font-bold text-primary">
          SA Sourcing Hub
        </Link>
        <nav className="flex items-center gap-5 text-sm font-semibold text-muted-foreground">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
              <Link href="/orders" className="hover:text-primary">Orders</Link>
              <Link href="/orders/new" className="hover:text-primary">New Order</Link>
              {user.role === "admin" ? <Link href="/admin" className="hover:text-primary">Admin</Link> : null}
              <NotificationBell />
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                <button className="rounded-full border border-border px-4 py-2 text-foreground hover:border-primary">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary">Login</Link>
              <Link href="/register" className="rounded-full bg-primary px-5 py-3 text-primary-foreground hover:bg-primary/90">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
