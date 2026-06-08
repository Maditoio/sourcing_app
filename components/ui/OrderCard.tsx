import Link from "next/link";
import { CATEGORIES, type CategoryKey, type OrderStatus } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function OrderCard({ order, href }: { order: { id: string; orderNumber: string; category: string; title: string; createdAt?: Date | string | null; status: OrderStatus }; href?: string }) {
  const category = CATEGORIES[(order.category as CategoryKey) || "other"] ?? CATEGORIES.other;
  const Icon = category.icon;
  const content = (
    <div className="flex items-center gap-4 rounded-3xl bg-card p-4 card-shadow transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${category.color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-bold text-foreground">{order.title}</p>
        <p className="text-sm text-muted-foreground">{order.orderNumber} · {formatDate(order.createdAt)}</p>
      </div>
      <StatusBadge status={order.status} />
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
