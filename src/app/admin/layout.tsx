// src/app/admin/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "@/styles/admin.css";
import { useEffect, useState } from "react";
import authService from "@/services/authService";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Không chạy xác thực với trang login
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Kiểm tra authentication cho các trang khác
    const checkAuth = async () => {
      const isAuthenticated = authService.isAuthenticated();
      if (!isAuthenticated) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

      // Nếu là trang login thì chỉ hiển thị content, không có sidebar
    if (isLoginPage) {
      return <>{children}</>;
    }

  // Hiển thị loading khi đang kiểm tra xác thực
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  // Layout chính cho trang admin
  return (
    <div className="admin-layout">
      {/* Sidebar trái */}
      <AdminSidebar />

      {/* Main content */}
      <div className="admin-main">
        {/* Content area */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
