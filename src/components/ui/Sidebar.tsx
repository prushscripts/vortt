"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard",  label: "Dashboard",  icon: "dashboard" },
  { href: "/phases",     label: "Phases",     icon: "phases" },
  { href: "/about",      label: "About",      icon: "about" },
  { href: "/dispatch",   label: "Dispatch",   icon: "dispatch" },
  { href: "/jobs",       label: "Jobs",       icon: "jobs" },
  { href: "/customers",  label: "Customers",  icon: "customers" },
  { href: "/contracts",  label: "Contracts",  icon: "contracts" },
  { href: "/inventory",  label: "Inventory",  icon: "inventory" },
  { href: "/invoices",   label: "Invoices",   icon: "invoices" },
  { href: "/techs",      label: "Techs",      icon: "techs" },
];

function NavGlyph({ type }: { type: string }) {
  const cls = "h-5 w-5";
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, className: cls };
  switch (type) {
    case "dashboard":
      return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
    case "phases":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    case "about":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
    case "dispatch":
      return <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "jobs":
      return <svg {...props}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>;
    case "customers":
      return <svg {...props}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case "contracts":
      return <svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
    case "inventory":
      return <svg {...props}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>;
    case "invoices":
      return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>;
    case "techs":
      return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

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
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          const isHovered = hoveredPath === href && !isActive;
          
          return (
            <Link
              key={href}
              href={href}
              onMouseEnter={() => setHoveredPath(href)}
              onMouseLeave={() => setHoveredPath(null)}
              style={{
                background: isActive 
                  ? 'var(--orange-dim)' 
                  : isHovered 
                    ? 'rgba(255,107,43,0.08)' 
                    : 'transparent',
                color: isActive 
                  ? 'var(--orange)' 
                  : isHovered 
                    ? 'var(--text-primary)' 
                    : 'var(--text-secondary)',
                borderLeft: isActive ? '2px solid var(--orange)' : '2px solid transparent',
                borderRadius: 10,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                gap: 10,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textDecoration: 'none',
              }}
            >
              <span style={{ 
                flexShrink: 0,
                color: isActive ? 'var(--orange)' : isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'color 0.15s ease'
              }}>
                <NavGlyph type={icon} />
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: 1,
                  transition: 'color 0.15s ease',
                }}
              >
                {label}
              </span>
              {isActive && (
                <div
                  className="ml-auto pulse-dot"
                  style={{ 
                    background: "var(--orange)",
                    height: 6,
                    width: 6,
                    flexShrink: 0,
                    borderRadius: '50%'
                  }}
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
          className="flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-[rgba(255,107,43,0.06)] transition-all min-h-[40px] group"
        >
          <Settings className="w-4 h-4 flex-shrink-0 text-[rgba(248,248,250,0.38)] group-hover:text-[rgba(248,248,250,0.65)]" />
          <span className="text-sm font-medium text-[rgba(248,248,250,0.5)] group-hover:text-[rgba(248,248,250,0.8)]">
            Settings
          </span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-[10px] hover:bg-[rgba(255,107,43,0.06)] transition-all min-h-[40px] group"
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
  { href: "/dispatch",  label: "Dispatch",  icon: "dispatch" },
  { href: "/jobs",      label: "Jobs",      icon: "jobs" },
  { href: "/customers", label: "Customers", icon: "customers" },
  { href: "/dashboard", label: "More",      icon: "dashboard" },
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
        {mobileNavItems.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 min-h-[60px] transition-colors"
            >
              <span className={cn("leading-none", active ? "text-[var(--orange)]" : "text-[var(--text-secondary)]")}>
                <NavGlyph type={icon} />
              </span>
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
