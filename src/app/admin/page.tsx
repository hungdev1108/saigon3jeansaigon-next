"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authService from "@/services/authService";

interface User {
  username: string;
  email?: string;
  role?: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to /admin/dashboard
    router.push("/admin/dashboard");
  }, [router]);

  // Always show loading while redirecting
  return (
    <div className="admin-loading">
      <div className="loading-spinner"></div>
      <p>Đang chuyển hướng...</p>
    </div>
  );
}
