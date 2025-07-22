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
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, [router]);

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
        <h1>🎉 Chào mừng đến với Admin Panel</h1>
        <p>
          Xin chào, <strong>{user?.username || "Admin"}</strong>! Quản lý nội dung website Saigon3Jeans của bạn.
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ backgroundColor: 'rgba(92, 124, 250, 0.1)', color: '#5C7CFA' }}>
              🏠
            </div>
            <div>
              <p className="stat-card-title">Trang chủ</p>
            </div>
          </div>
          <div className="stat-card-value">5</div>
          <div className="stat-card-description">
            <span className="stat-trend-up">↑ 20%</span>
            <span>so với tuần trước</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ backgroundColor: 'rgba(64, 192, 87, 0.1)', color: '#40C057' }}>
              👕
            </div>
            <div>
              <p className="stat-card-title">Sản phẩm</p>
            </div>
          </div>
          <div className="stat-card-value">24</div>
          <div className="stat-card-description">
            <span className="stat-trend-up">↑ 12%</span>
            <span>so với tuần trước</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon" style={{ backgroundColor: 'rgba(22, 177, 255, 0.1)', color: '#16B1FF' }}>
              📞
            </div>
            <div>
              <p className="stat-card-title">Liên hệ</p>
            </div>
          </div>
          <div className="stat-card-value">18</div>
          <div className="stat-card-description">
            <span className="stat-trend-up">↑ 8%</span>
            <span>so với tuần trước</span>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Các trang quản lý</h2>
          <Link href="/admin/settings" className="btn btn-secondary">Xem tất cả</Link>
        </div>

        <div className="dashboard-grid">
          {/* Trang chủ */}
          <Link href="/admin/home" className="info-card" style={{cursor: 'pointer'}}>
            <div className="info-card-icon" style={{ backgroundColor: 'rgba(92, 124, 250, 0.1)', color: '#5C7CFA' }}>
              🏠
            </div>
            <div className="info-card-content">
              <h3>Trang Chủ</h3>
              <p>Quản lý nội dung trang chủ</p>
            </div>
          </Link>

          {/* Sản phẩm */}
          <Link href="/admin/products" className="info-card" style={{cursor: 'pointer'}}>
            <div className="info-card-icon" style={{ backgroundColor: 'rgba(64, 192, 87, 0.1)', color: '#40C057' }}>
              👕
            </div>
            <div className="info-card-content">
              <h3>Sản Phẩm</h3>
              <p>Quản lý danh mục sản phẩm</p>
            </div>
          </Link>

          {/* Máy móc */}
          <Link href="/admin/machinery" className="info-card" style={{cursor: 'pointer'}}>
            <div className="info-card-icon" style={{ backgroundColor: 'rgba(250, 82, 82, 0.1)', color: '#FA5252' }}>
              ⚙️
            </div>
            <div className="info-card-content">
              <h3>Máy Móc</h3>
              <p>Quản lý thông tin máy móc</p>
            </div>
          </Link>

          {/* Cơ sở vật chất */}
          <Link href="/admin/facilities" className="info-card" style={{cursor: 'pointer'}}>
            <div className="info-card-icon" style={{ backgroundColor: 'rgba(255, 171, 0, 0.1)', color: '#FFAB00' }}>
              🏭
            </div>
            <div className="info-card-content">
              <h3>Cơ Sở Vật Chất</h3>
              <p>Quản lý thông tin nhà xưởng</p>
            </div>
          </Link>

          {/* Tự động hóa */}
          <Link href="/admin/automation" className="info-card" style={{cursor: 'pointer'}}>
            <div className="info-card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
              🤖
            </div>
            <div className="info-card-content">
              <h3>Tự Động Hóa</h3>
              <p>Quản lý thông tin tự động hóa</p>
            </div>
          </Link>

          {/* Thân thiện môi trường */}
          <Link href="/admin/eco-friendly" className="info-card" style={{cursor: 'pointer'}}>
            <div className="info-card-icon" style={{ backgroundColor: 'rgba(64, 192, 87, 0.1)', color: '#40C057' }}>
              🌱
            </div>
            <div className="info-card-content">
              <h3>Thân Thiện Môi Trường</h3>
              <p>Quản lý nội dung xanh</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Hoạt động gần đây</h2>
          <button className="btn btn-secondary">Làm mới</button>
        </div>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Người dùng</th>
              <th>Hoạt động</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hôm nay, 10:30</td>
              <td>{user?.username || "Admin"}</td>
              <td>Đăng nhập vào hệ thống</td>
              <td><span className="badge badge-success">Thành công</span></td>
            </tr>
            <tr>
              <td>Hôm nay, 10:35</td>
              <td>{user?.username || "Admin"}</td>
              <td>Truy cập trang quản trị</td>
              <td><span className="badge badge-success">Thành công</span></td>
            </tr>
            <tr>
              <td>Hôm qua, 15:42</td>
              <td>{user?.username || "Admin"}</td>
              <td>Cập nhật nội dung trang chủ</td>
              <td><span className="badge badge-success">Thành công</span></td>
            </tr>
            <tr>
              <td>Hôm qua, 14:20</td>
              <td>{user?.username || "Admin"}</td>
              <td>Thêm sản phẩm mới</td>
              <td><span className="badge badge-info">Hoàn tất</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
