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
    // Kiểm tra authentication
    if (!authService.isAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    // Lấy thông tin user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>🎉 Chào mừng đến với Admin Panel</h1>
          <p>
            Xin chào, <strong>{user?.username || "Admin"}</strong>! Quản lý nội
            dung website Saigon3Jeans của bạn.
          </p>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          🚪 Đăng xuất
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Trang chủ */}
        <Link href="/admin/home" className="dashboard-card">
          <div className="card-icon">🏠</div>
          <h3>Trang Chủ</h3>
          <p>
            Quản lý nội dung trang chủ, hero section, sections và featured news
          </p>
          <div className="card-arrow">→</div>
        </Link>

        {/* Sản phẩm */}
        <Link href="/admin/products" className="dashboard-card">
          <div className="card-icon">👕</div>
          <h3>Sản Phẩm</h3>
          <p>Quản lý danh mục sản phẩm, thêm/sửa/xóa sản phẩm</p>
          <div className="card-arrow">→</div>
        </Link>

        {/* Máy móc */}
        <Link href="/admin/machinery" className="dashboard-card">
          <div className="card-icon">⚙️</div>
          <h3>Máy Móc</h3>
          <p>Quản lý thông tin máy móc, thiết bị sản xuất</p>
          <div className="card-arrow">→</div>
        </Link>

        {/* Cơ sở vật chất */}
        <Link href="/admin/facilities" className="dashboard-card">
          <div className="card-icon">🏭</div>
          <h3>Cơ Sở Vật Chất</h3>
          <p>Quản lý thông tin nhà xưởng, cơ sở vật chất</p>
          <div className="card-arrow">→</div>
        </Link>

        {/* Tự động hóa */}
        <Link href="/admin/automation" className="dashboard-card">
          <div className="card-icon">🤖</div>
          <h3>Tự Động Hóa</h3>
          <p>Quản lý thông tin về hệ thống tự động hóa</p>
          <div className="card-arrow">→</div>
        </Link>

        {/* Thân thiện môi trường */}
        <Link href="/admin/eco-friendly" className="dashboard-card">
          <div className="card-icon">🌱</div>
          <h3>Thân Thiện Môi Trường</h3>
          <p>Quản lý nội dung về các sáng kiến xanh</p>
          <div className="card-arrow">→</div>
        </Link>

        {/* Tuyển dụng */}
        <Link href="/admin/recruitment" className="dashboard-card">
          <div className="card-icon">👥</div>
          <h3>Tuyển Dụng</h3>
          <p>Quản lý tin tuyển dụng và ứng viên</p>
          <div className="card-arrow">→</div>
        </Link>

        {/* Liên hệ */}
        <Link href="/admin/contact" className="dashboard-card">
          <div className="card-icon">📞</div>
          <h3>Liên Hệ</h3>
          <p>Quản lý thông tin liên hệ và tin nhắn</p>
          <div className="card-arrow">→</div>
        </Link>

        {/* Tổng quan */}
        <Link href="/admin/overview" className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Tổng Quan</h3>
          <p>Quản lý nội dung trang tổng quan về công ty</p>
          <div className="card-arrow">→</div>
        </Link>

        {/* Cài đặt */}
        <Link href="/admin/settings" className="dashboard-card">
          <div className="card-icon">⚙️</div>
          <h3>Cài Đặt</h3>
          <p>Cài đặt hệ thống và cấu hình website</p>
          <div className="card-arrow">→</div>
        </Link>
      </div>

      <div className="dashboard-stats">
        <h2>📈 Thống Kê Nhanh</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <h3>Content</h3>
              <p>Quản lý nội dung</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🖼️</div>
            <div className="stat-info">
              <h3>Media</h3>
              <p>Quản lý hình ảnh</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🎨</div>
            <div className="stat-info">
              <h3>Design</h3>
              <p>Tùy chỉnh giao diện</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🔧</div>
            <div className="stat-info">
              <h3>Settings</h3>
              <p>Cấu hình hệ thống</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          color: white;
        }

        .welcome-section h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
        }

        .welcome-section p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .dashboard-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
          border: 1px solid #e1e5e9;
        }

        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          border-color: #667eea;
        }

        .card-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .dashboard-card h3 {
          margin: 0 0 10px 0;
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }

        .dashboard-card p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .card-arrow {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 20px;
          color: #667eea;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .dashboard-card:hover .card-arrow {
          opacity: 1;
          transform: translateX(5px);
        }

        .dashboard-stats {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .dashboard-stats h2 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .stat-icon {
          font-size: 32px;
          margin-right: 15px;
        }

        .stat-info h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: #333;
        }

        .stat-info p {
          margin: 0;
          color: #666;
          font-size: 12px;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
