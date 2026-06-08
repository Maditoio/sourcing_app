import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <TopNav />
      <div className="mx-auto flex max-w-7xl">
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:py-10">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
