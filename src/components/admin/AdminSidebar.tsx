// src/components/admin/AdminSidebar.tsx
"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/home', label: 'Trang chủ', icon: '🏠' },
  { href: '/admin/machinery', label: 'Technology', icon: '⚙️' },
  { href: '/admin/eco-friendly', label: 'Sustainability', icon: '🌱' },
  { href: '/admin/contact', label: 'Contact', icon: '📞' },
  { href: '/admin/automation', label: 'Automation', icon: '🤖' },
  { href: '/admin/facilities', label: 'Facilities', icon: '🏭' },
  { href: '/admin/products', label: 'Products', icon: '👕' },
  { href: '/admin/recruitment', label: 'Recruitment', icon: '👥' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}