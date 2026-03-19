"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",  emoji: "⚡" },
  { href: "/dispatch",   label: "Dispatch",   emoji: "🗺️" },
  { href: "/jobs",       label: "Jobs",       emoji: "🔧" },
  { href: "/customers",  label: "Customers",  emoji: "👥" },
  { href: "/contracts",  label: "Contracts",  emoji: "📋" },
  { href: "/inventory",  label: "Inventory",  emoji: "📦" },
  { href: "/invoices",   label: "Invoices",   emoji: "💰" },
  { href: "/techs",      label: "Techs",      emoji: "🧑‍🔧" },
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
    <aside
      className="hidden md:flex flex-col w-[220px] h-screen fixed left-0 top-0 z-30"
      style={{
        background: "#0D0D10",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#FF6B2B" }}
        >
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <span
          className="font-heading font-bold text-lg tracking-tight"
          style={{ color: "#F8F8FA" }}
        >
          VORTT
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, emoji }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[10px] transition-all duration-150 min-h-[40px] group",
                active
                  ? "nav-active"
                  : "hover:bg-white/[0.04]"
              )}
            >
              <span className="text-base leading-none w-5 flex-shrink-0 text-center">
                {emoji}
              </span>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  active
                    ? "text-[#F8F8FA]"
                    : "text-[rgba(248,248,250,0.5)] group-hover:text-[rgba(248,248,250,0.8)]"
                )}
              >
                {label}
              </span>
              {active && (
                <div
                  className="ml-auto w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: "#FF6B2B" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "12px" }}>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-white/[0.04] transition-all min-h-[40px] group"
        >
          <Settings className="w-4 h-4 flex-shrink-0 text-[rgba(248,248,250,0.38)] group-hover:text-[rgba(248,248,250,0.65)]" />
          <span className="text-sm font-medium text-[rgba(248,248,250,0.5)] group-hover:text-[rgba(248,248,250,0.8)]">
            Settings
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-[10px] hover:bg-white/[0.04] transition-all min-h-[40px] group"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-[rgba(248,248,250,0.38)] group-hover:text-[rgba(248,248,250,0.65)]" />
          <span className="text-sm font-medium text-[rgba(248,248,250,0.5)] group-hover:text-[rgba(248,248,250,0.8)]">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}

/* Mobile bottom nav */
const mobileNavItems = [
  { href: "/dispatch",  label: "Dispatch",  emoji: "🗺️" },
  { href: "/jobs",      label: "Jobs",      emoji: "🔧" },
  { href: "/customers", label: "Customers", emoji: "👥" },
  { href: "/dashboard", label: "More",      emoji: "⚡" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 pb-safe"
      style={{
        background: "#0D0D10",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-stretch">
        {mobileNavItems.map(({ href, label, emoji }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 min-h-[60px] transition-colors"
            >
              <span className="text-xl leading-none">{emoji}</span>
              <span
                className={cn(
                  "text-[10px] font-medium font-mono-label transition-colors",
                  active ? "text-[#FF6B2B]" : "text-[rgba(248,248,250,0.38)]"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
