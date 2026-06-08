import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-10">{children}</main>
      <BottomNav />
    </div>
  );
}
