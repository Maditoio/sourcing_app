import { clsx, type ClassValue } from "clsx";
import { desc, like } from "drizzle-orm";
import { twMerge } from "tailwind-merge";
import { db } from "@/lib/db";
import { orders } from "@/drizzle/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: Date | string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function formatMoney(value?: string | number | null, currency = "USD") {
  if (value === null || value === undefined || value === "") return "";
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(value));
}

export async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const prefix = `SASH-${year}-`;
  const latest = await db
    .select({ orderNumber: orders.orderNumber })
    .from(orders)
    .where(like(orders.orderNumber, `${prefix}%`))
    .orderBy(desc(orders.orderNumber))
    .limit(1);

  const lastSeq = latest[0]?.orderNumber ? Number(latest[0].orderNumber.split("-").at(-1)) : 0;
  return `${prefix}${String((Number.isFinite(lastSeq) ? lastSeq : 0) + 1).padStart(4, "0")}`;
}

export function initials(name?: string | null) {
  return (name || "SA")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
