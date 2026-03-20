"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(20);
    const t1 = window.setTimeout(() => setProgress(60), 100);
    const t2 = window.setTimeout(() => setProgress(90), 200);
    const t3 = window.setTimeout(() => setProgress(100), 300);
    const t4 = window.setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [pathname]);

  return (
    <div className="min-h-screen" style={{ background: "#080809" }}>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            zIndex: 9999,
            background: "transparent",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, var(--orange), #FF8C5A)",
              width: `${progress}%`,
              transition: "width 0.12s ease",
              boxShadow: "0 0 12px rgba(255,107,43,0.8), 0 0 4px rgba(255,107,43,1)",
              borderRadius: "0 2px 2px 0",
            }}
          />
        </div>
      )}
      <Sidebar />
      <div className="md:ml-[220px] flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 w-full min-w-0 px-5 py-6 md:px-8 pb-24 md:pb-8">
          <div key={pathname} className="page-enter" style={{ width: "100%", minHeight: "100%" }}>
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
