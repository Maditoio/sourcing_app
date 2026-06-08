"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/notifications?unread=1");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setCount(data.unreadCount ?? 0);
      } catch {}
    };
    load();
    const interval = window.setInterval(load, 30000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <Link href="/notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
      <Bell className="h-5 w-5 text-foreground" />
      {count > 0 ? <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{count}</span> : null}
    </Link>
  );
}
