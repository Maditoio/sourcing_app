import Link from "next/link";
import { BarChart3, Boxes, Users } from "lucide-react";

export function AdminSidebar() {
  const links = [
    { href: "/admin", label: "Overview", icon: BarChart3 },
    { href: "/admin/orders", label: "Orders", icon: Boxes },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/70 p-5 lg:block">
      <p className="font-display text-lg font-bold text-primary">Admin Console</p>
      <nav className="mt-8 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary">
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
