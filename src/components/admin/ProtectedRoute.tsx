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
      <div className="protected-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang xác thực...</p>
        </div>

        <style jsx>{`
          .protected-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
          }

          .loading-container {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .loading-container p {
            margin: 0;
            color: #666;
            font-size: 16px;
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router sẽ redirect
  }

  return <>{children}</>;
}
