import { STATUS_LABELS, type OrderStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

const variants: Record<OrderStatus, string> = {
  pending: "bg-zinc-100 text-zinc-700",
  approved: "bg-blue-100 text-blue-700",
  quoted: "bg-amber-100 text-amber-800",
  payment_pending: "bg-orange-100 text-orange-700",
  paid: "bg-teal-100 text-teal-700",
  sourcing: "bg-emerald-100 text-emerald-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", variants[status], className)}>{STATUS_LABELS[status]}</span>;
}
