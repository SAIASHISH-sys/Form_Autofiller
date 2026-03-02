"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, UserCircle, Users, Settings, LogOut, Sparkles, Menu, X } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "Personas", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 10);
      if (current > lastScroll && current > 80) {
        setVisible(false);
        setMobileOpen(false);
      } else {
        setVisible(true);
      }
      setLastScroll(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        scrolled
          ? "glass border-b border-white/4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
              <Sparkles className="text-white" size={14} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white">FormFlow</span>
              <span className="text-indigo-400"> AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/8 text-white shadow-sm shadow-indigo-500/10 border border-white/6"
                      : "text-slate-400 hover:text-white hover:bg-white/4"
                  }`}
                >
                  <item.icon size={15} className={isActive ? "text-indigo-400" : ""} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all">
              <LogOut size={15} />
              <span className="font-medium">Sign out</span>
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/4">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/6 text-white"
                      : "text-slate-400 hover:bg-white/3 hover:text-white"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-indigo-400" : ""} />
                  {item.name}
                </Link>
              );
            })}
            <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
              <LogOut size={18} />
              Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
