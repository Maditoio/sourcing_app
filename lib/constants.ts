import { Box, Car, Drill, Home, LucideIcon, MonitorSmartphone, ShoppingBasket } from "lucide-react";

export const COUNTRIES = ["DRC", "Congo-Brazzaville", "Nigeria", "Other"] as const;
export const ORDER_STATUSES = [
  "pending",
  "approved",
  "quoted",
  "payment_pending",
  "paid",
  "sourcing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type CategoryKey = "auto_parts" | "appliances" | "electronics" | "mining" | "food" | "other";

export const CATEGORIES: Record<CategoryKey, { label: string; icon: LucideIcon; color: string }> = {
  auto_parts: { label: "Auto Parts", icon: Car, color: "text-amber-700 bg-amber-50" },
  appliances: { label: "Home Appliances", icon: Home, color: "text-emerald-700 bg-emerald-50" },
  electronics: { label: "Electronics", icon: MonitorSmartphone, color: "text-blue-700 bg-blue-50" },
  mining: { label: "Mining Equipment", icon: Drill, color: "text-stone-700 bg-stone-100" },
  food: { label: "Food & Groceries", icon: ShoppingBasket, color: "text-rose-700 bg-rose-50" },
  other: { label: "Other", icon: Box, color: "text-slate-700 bg-slate-100" },
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  quoted: "Quoted",
  payment_pending: "Payment Pending",
  paid: "Paid",
  sourcing: "Sourcing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const IN_PROGRESS_STATUSES: OrderStatus[] = ["quoted", "payment_pending", "paid", "sourcing", "shipped"];
export const TIMELINE_STATUSES: OrderStatus[] = ["pending", "approved", "quoted", "paid", "sourcing", "shipped", "delivered"];
export const ALLOWED_UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
