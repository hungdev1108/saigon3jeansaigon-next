// src/app/admin/layout.tsx
"use client";

import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import '@/styles/admin.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-container">
      {/* Sidebar trái */}
      <AdminSidebar />
      
      {/* Main content */}
      <div className="admin-main">
        {/* Header trên với logo Saigon3Jeans */}
        <AdminHeader />
        
        {/* Content area - hiển thị như trang web nhưng có thể edit */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}