"use client";

import { usePathname } from "next/navigation";
import { Sidebar, BottomNav } from "@/components/ui/Sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/phases":     "Phases",
  "/dispatch":   "Dispatch",
  "/jobs":       "Jobs",
  "/customers":  "Customers",
  "/contracts":  "Contracts",
  "/inventory":  "Inventory",
  "/invoices":   "Invoices",
  "/techs":      "Technicians",
  "/settings":   "Settings",
};

function TopBar() {
  const pathname = usePathname();
  const title = Object.entries(pageTitles).find(([key]) =>
    pathname === key || pathname.startsWith(key + "/")
  )?.[1] ?? "VORTT";

  return (
    <div
      className="sticky top-0 z-20 flex items-center h-14 px-6"
      style={{
        background: "rgba(8,8,9,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <h1 className="font-heading font-bold text-base text-[#F8F8FA]">{title}</h1>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#080809" }}>
      <Sidebar />
      <div className="md:ml-[220px] flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 px-5 py-6 md:px-8 pb-24 md:pb-8 max-w-screen-xl">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
