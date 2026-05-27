"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  BarChart3,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/institutes", label: "Institutes", icon: Building2 },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg hover:bg-sidebar-accent"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300",
          isOpen ? "w-64" : "w-0 overflow-hidden",
          "lg:w-64",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-2xl font-bold text-sidebar-primary">
              Edu Nova
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive(href)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <button className="w-full px-4 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground hover:opacity-90 transition-opacity">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile spacing for toggle button */}
      <style>{`
        @media (max-width: 1024px) {
          body {
            padding-top: 3rem;
          }
        }
      `}</style>
    </>
  );
}
