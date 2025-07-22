"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = authService.isAuthenticated();

        if (authenticated) {
          // Verify token với server
          const isValid = await authService.verifyToken();
          if (isValid) {
            setIsAuthenticated(true);
          } else {
            // Token không hợp lệ, xóa và chuyển đến login
            authService.logout();
            router.push("/admin/login");
          }
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang xác thực...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router sẽ redirect
  }

  return <>{children}</>;
}
