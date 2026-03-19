import { Sidebar, BottomNav } from "@/components/ui/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-vortt-mist">
      <Sidebar />
      <main className="md:ml-64 min-h-screen">
        <div className="px-4 py-6 md:px-8 pb-24 md:pb-6 max-w-screen-xl">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
