"use client";

import { useRouter } from "next/navigation";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  return (
    <button onClick={async () => { await fetch(`/api/orders/${orderId}`, { method: "PATCH" }); router.push("/orders"); router.refresh(); }} className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 font-bold text-red-700">
      Cancel order
    </button>
  );
}
