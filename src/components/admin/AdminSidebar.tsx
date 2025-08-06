// src/components/admin/AdminSidebar.tsx
"use client";

import Link from 'next/link'
import Image from "next/image"
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

// SVG Icons cho menu
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ProductIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const MachineryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const AutomationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </svg>
);

const FacilitiesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="7" height="13" />
    <rect x="14" y="3" width="7" height="17" />
    <line x1="10" y1="10" x2="10" y2="10" />
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.51" />
    <line x1="17.5" y1="10.5" x2="17.5" y2="10.51" />
    <line x1="17.5" y1="14.5" x2="17.5" y2="14.51" />
  </svg>
);

const EnvironmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const RecruitmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ContactIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const OverviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// Icon cho nút thu gọn
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// Định nghĩa các nhóm menu item
const menuGroups = [
  {
    title: "Main",
    items: [
      { href: '/admin/home', label: 'Home', icon: <HomeIcon /> },
    ]
  },
  {
    title: "Content Management",
    items: [
      { href: '/admin/products', label: 'Products', icon: <ProductIcon /> },
      { href: '/admin/machinery', label: 'Machinery', icon: <MachineryIcon /> },
      { href: '/admin/automation', label: 'Automation', icon: <AutomationIcon /> },
      { href: '/admin/facilities', label: 'Facilities', icon: <FacilitiesIcon /> },
      { href: '/admin/eco-friendly', label: 'Eco-Friendly', icon: <EnvironmentIcon /> },
    ]
  },
  {
    title: "Interaction",
    items: [
      { href: '/admin/recruitment', label: 'Recruitment', icon: <RecruitmentIcon /> },
      { href: '/admin/contact', label: 'Contact', icon: <ContactIcon /> },
      { href: '/admin/overview', label: 'Overview', icon: <OverviewIcon /> },
    ]
  }
];

// Định nghĩa interface cho props của CollapseButton
interface CollapseButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
}

// Định nghĩa component nút thu gọn
const CollapseButton: React.FC<CollapseButtonProps> = ({ isCollapsed, onClick }) => (
  <button 
    className="collapse-btn" 
    onClick={onClick}
    aria-label={isCollapsed ? "Expand" : "Collapse"}
  >
    <span className="collapse-icon">
      {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </span>
  </button>
);

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo section */}
      <div className="sidebar-logo">
        <div className="logo-container">
          {isCollapsed ? (
            <Image
              src="/images/sg3_small_logo.svg"
              alt="Saigon 3 Jeans"
              width={40}
              height={40}
              className="sidebar-logo-small"
              priority
            />
          ) : (
            <Image
              src="/images/sg3jeans_logo.png"
              alt="Saigon 3 Jeans"
              width={150}
              height={40}
              className="sidebar-logo-image"
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          )}
        </div>
        <CollapseButton 
          isCollapsed={isCollapsed} 
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      
      {/* Navigation menu */}
      <nav className="sidebar-nav">
        {menuGroups.map((group, index) => (
          <div key={index} className="menu-group">
            {!isCollapsed && <h3 className="menu-group-title">{group.title}</h3>}
            
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                data-tooltip={isCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            ))}
            
            {index < menuGroups.length - 1 && !isCollapsed && (
              <div className="menu-divider"></div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer chỉ còn nút logout */}
      <div className="sidebar-footer">
        <button 
          className="nav-item logout-btn" 
          onClick={handleLogout}
          data-tooltip={isCollapsed ? "Logout" : ''}
        >
          <span className="nav-icon"><LogoutIcon /></span>
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
  )
}