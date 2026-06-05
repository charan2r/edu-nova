"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Page() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!token || !user) {
      // Not authenticated, redirect to login
      router.push("/login");
    } else {
      // Authenticated, redirect based on role
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        // Invalid role, redirect to login
        router.push("/login");
      }
    }
  }, [token, user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-muted-foreground mb-6">Initializing...</p>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}
