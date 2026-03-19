"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  Map,
  Briefcase,
  Users,
  FileText,
  Package,
  Receipt,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dispatch", icon: Map, label: "Dispatch" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/contracts", icon: FileText, label: "Contracts" },
  { href: "/inventory", icon: Package, label: "Inventory" },
  { href: "/invoices", icon: Receipt, label: "Invoices" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-vortt-charcoal h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800">
        <div className="w-9 h-9 rounded-xl bg-vortt-orange flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" fill="white" />
        </div>
        <span className="font-heading font-bold text-white text-xl tracking-tight">VORTT</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150",
                "text-sm font-medium min-h-[44px]",
                active
                  ? "bg-vortt-orange text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-zinc-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all min-h-[44px]"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// Mobile bottom nav — 4 key items
const mobileNavItems = [
  { href: "/dispatch", icon: Map, label: "Dispatch" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/dashboard", icon: LayoutDashboard, label: "More" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-zinc-100 safe-area-bottom">
      <div className="flex items-stretch">
        {mobileNavItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 gap-1 min-h-[60px]",
                "text-xs font-medium transition-colors",
                active ? "text-vortt-orange" : "text-zinc-400"
              )}
            >
              <Icon className={cn("w-6 h-6", active && "text-vortt-orange")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
