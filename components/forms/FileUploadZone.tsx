"use client";

import { ChangeEvent, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud, X } from "lucide-react";
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_SIZE } from "@/lib/constants";

export type UploadedFile = { fileUrl: string; fileType: "reference_image" | "proof_of_payment" | "document"; name?: string };

export function FileUploadZone({ value, onChange, fileType = "reference_image", maxFiles = 5 }: { value: UploadedFile[]; onChange: (files: UploadedFile[]) => void; fileType?: UploadedFile["fileType"]; maxFiles?: number }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function upload(files: FileList | File[]) {
    setError("");
    const incoming = Array.from(files).slice(0, maxFiles - value.length);
    if (!incoming.length) return;

    const uploaded: UploadedFile[] = [];
    for (const file of incoming) {
      if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
        setError("Only JPG, PNG, WEBP, HEIC, and PDF files are accepted.");
        continue;
      }
      if (file.size > MAX_UPLOAD_SIZE) {
        setError("Each file must be 10MB or smaller.");
        continue;
      }

      const uploadFile = file.type.startsWith("image/") && file.type !== "image/heic"
        ? await imageCompression(file, { maxSizeMB: 1.5, maxWidthOrHeight: 1600, useWebWorker: true })
        : file;
      const formData = new FormData();
      formData.append("file", uploadFile, file.name);
      formData.append("fileType", fileType);
      setProgress(20);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      setProgress(80);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Upload failed.");
        continue;
      }
      const data = await res.json();
      uploaded.push({ fileUrl: data.url, fileType, name: file.name });
      setProgress(100);
    }
    onChange([...value, ...uploaded]);
    setTimeout(() => setProgress(0), 600);
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) upload(event.target.files);
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); upload(event.dataTransfer.files); }} className="flex w-full flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-primary/30 bg-primary/5 px-5 py-10 text-center hover:border-primary">
        <UploadCloud className="mb-3 h-9 w-9 text-primary" />
        <span className="font-display text-lg font-bold">Upload images or documents</span>
        <span className="mt-1 text-sm text-muted-foreground">Drag and drop, or tap to select from your phone camera/files.</span>
      </button>
      <input ref={inputRef} onChange={onInputChange} type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,application/pdf" capture="environment" className="hidden" />
      {progress > 0 ? <div className="h-2 overflow-hidden rounded-full bg-muted"><div style={{ width: `${progress}%` }} className="h-full bg-primary transition-all" /></div> : null}
      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {value.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((file, index) => (
            <div key={file.fileUrl} className="relative rounded-2xl border border-border bg-white p-3 text-sm">
              <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow"><X className="h-4 w-4" /></button>
              <p className="truncate pr-8 font-semibold">{file.name || file.fileUrl.split("/").pop()}</p>
              <p className="mt-1 text-xs text-muted-foreground">{file.fileType.replaceAll("_", " ")}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
