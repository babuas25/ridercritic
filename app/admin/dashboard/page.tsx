"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for admin_token in localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.replace("/admin");
      }
    }
  }, [router]);

  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Superadmin Dashboard</h1>
      <p className="text-lg text-muted-foreground">Welcome, Superadmin!</p>
    </div>
  );
} 