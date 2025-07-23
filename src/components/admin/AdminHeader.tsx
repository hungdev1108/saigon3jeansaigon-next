// src/components/admin/AdminHeader.tsx
"use client";

import Image from "next/image"
import { useRouter } from 'next/navigation'

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    // Xóa token hoặc session
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  return (
    <header className="admin-header">
      <div className="header-left">
        <Image
          src="/images/sg3jeans_logo.png"
          alt="Saigon 3 Jeans"
          width={120}
          height={40}
          className="admin-logo"
        />
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="header-right">
        <div className="admin-user">
          <span className="user-icon">👤</span>
          <span className="user-name">Admin</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="logout-btn"
          title="Đăng xuất"
        >
          🚪 Logout
        </button>
      </div>
    </header>
  )
}