"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Menu items based on role
  const getNavItems = () => {
    if (user?.role === "super_admin") {
      return [
        { href: "/super_admin", label: "Dashboard", icon: LayoutDashboard },
        {
          href: "/super_admin/institutes",
          label: "Institutes",
          icon: Building2,
        },
        {
          href: "/super_admin/institute_admins",
          label: "Institute Admins",
          icon: Users,
        },
        { href: "/super_admin/analytics", label: "Analytics", icon: BarChart3 },
      ];
    } else if (user?.role === "institute_admin") {
      return [
        { href: "/institute_admin", label: "Dashboard", icon: LayoutDashboard },
        {
          href: "/institute_admin/instructors",
          label: "Instructors",
          icon: Users,
        },
        { href: "/institute_admin/courses", label: "Courses", icon: BookOpen },
        { href: "/institute_admin/students", label: "Students", icon: Users },
        {
          href: "/institute_admin/analytics",
          label: "Analytics",
          icon: BarChart3,
        },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === "/super_admin" || href === "/institute_admin") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
          "lg:relative lg:w-64 lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-2xl font-bold text-sidebar-primary">
              Edu Nova
            </h1>
            <p className="text-xs text-sidebar-foreground/60 mt-1 capitalize">
              {user?.role === "super_admin" ? "Super Admin" : "Institute Admin"}
            </p>
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
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
