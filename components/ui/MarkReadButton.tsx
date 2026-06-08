"use client";

import { useRouter } from "next/navigation";

export function MarkReadButton() {
  const router = useRouter();
  return (
    <button onClick={async () => { await fetch("/api/notifications", { method: "PATCH" }); router.refresh(); }} className="rounded-2xl border border-border bg-white px-4 py-2 font-bold text-primary">
      Mark all as read
    </button>
  );
}
