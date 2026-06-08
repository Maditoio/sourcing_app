"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUploadZone, type UploadedFile } from "@/components/forms/FileUploadZone";

export function PaymentProofUploader({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [message, setMessage] = useState("");

  async function save(uploaded: UploadedFile[]) {
    setFiles(uploaded);
    const latest = uploaded.at(-1);
    if (!latest) return;
    const res = await fetch(`/api/orders/${orderId}/attachments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(latest),
    });
    setMessage(res.ok ? "Proof of payment uploaded." : "Upload saved, but could not attach to order.");
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-[2rem] bg-card p-5 card-shadow">
      <h2 className="font-display text-xl font-bold">Proof of payment</h2>
      <FileUploadZone value={files} onChange={save} fileType="proof_of_payment" maxFiles={3} />
      {message ? <p className="text-sm font-semibold text-primary">{message}</p> : null}
    </div>
  );
}
