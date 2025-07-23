"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ClientOnly from "./ClientOnly";
// import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{[key: string]: boolean}>({});
  // const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setExpandedMenus({});
  };

  const toggleSubmenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMenuOpen &&
        !target.closest(".mobile-menu-drawer") &&
        !target.closest(".navbar-toggler")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <ClientOnly>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <Link className="navbar-brand" href="/">
              <Image
                src="/images/sg3jeans_logo.png"
                alt="Saigon 3 Logo"
                className="logo"
                width={100}
                height={100}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="d-none d-lg-block">
              <ul className="navbar-nav">
                {/* WHO WE ARE Dropdown */}
                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle">
                    WHO WE ARE
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" href="/overview">
                        Overview
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/facilities">
                        Facilities
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* TECHNOLOGY Dropdown */}
                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle">
                    TECHNOLOGY
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" href="/machinery">
                        Machinery
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/products">
                        Products
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* SUSTAINABILITY Dropdown */}
                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle">
                    SUSTAINABILITY
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" href="/eco-friendly">
                        Eco Friendly
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/automation">
                        Automation
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* CONTACT */}
                <li className="nav-item">
                  <Link className="nav-link" href="/contact">
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="navbar-toggler d-lg-none"
              type="button"
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              <span
                className={`hamburger-line ${isMenuOpen ? "active" : ""}`}
              ></span>
              <span
                className={`hamburger-line ${isMenuOpen ? "active" : ""}`}
              ></span>
              <span
                className={`hamburger-line ${isMenuOpen ? "active" : ""}`}
              ></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${isMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <button className="mobile-menu-close" onClick={closeMenu}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <ul className="mobile-menu-nav">
          {/* WHO WE ARE with submenu */}
          <li className="mobile-nav-item has-submenu">
            <div 
              className="mobile-nav-link parent-link" 
              onClick={() => toggleSubmenu('who-we-are')}
            >
              <i className="fas fa-building"></i>
              WHO WE ARE
              <i className={`fas fa-chevron-down submenu-arrow ${expandedMenus['who-we-are'] ? 'expanded' : ''}`}></i>
            </div>
            <ul className={`mobile-submenu ${expandedMenus['who-we-are'] ? 'expanded' : ''}`}>
              <li>
                <Link className="mobile-nav-link submenu-item" href="/overview" onClick={closeMenu}>
                  <i className="fas fa-eye"></i>
                  Overview
                </Link>
              </li>
              <li>
                <Link className="mobile-nav-link submenu-item" href="/facilities" onClick={closeMenu}>
                  <i className="fas fa-industry"></i>
                  Facilities
                </Link>
              </li>
            </ul>
          </li>

          {/* TECHNOLOGY with submenu */}
          <li className="mobile-nav-item has-submenu">
            <div 
              className="mobile-nav-link parent-link" 
              onClick={() => toggleSubmenu('technology')}
            >
              <i className="fas fa-cogs"></i>
              TECHNOLOGY
              <i className={`fas fa-chevron-down submenu-arrow ${expandedMenus['technology'] ? 'expanded' : ''}`}></i>
            </div>
            <ul className={`mobile-submenu ${expandedMenus['technology'] ? 'expanded' : ''}`}>
              <li>
                <Link className="mobile-nav-link submenu-item" href="/machinery" onClick={closeMenu}>
                  <i className="fas fa-tools"></i>
                  Machinery
                </Link>
              </li>
              <li>
                <Link className="mobile-nav-link submenu-item" href="/products" onClick={closeMenu}>
                  <i className="fas fa-box"></i>
                  Products
                </Link>
              </li>
            </ul>
          </li>

          {/* SUSTAINABILITY with submenu */}
          <li className="mobile-nav-item has-submenu">
            <div 
              className="mobile-nav-link parent-link" 
              onClick={() => toggleSubmenu('sustainability')}
            >
              <i className="fas fa-leaf"></i>
              SUSTAINABILITY
              <i className={`fas fa-chevron-down submenu-arrow ${expandedMenus['sustainability'] ? 'expanded' : ''}`}></i>
            </div>
            <ul className={`mobile-submenu ${expandedMenus['sustainability'] ? 'expanded' : ''}`}>
              <li>
                <Link className="mobile-nav-link submenu-item" href="/eco-friendly" onClick={closeMenu}>
                  <i className="fas fa-seedling"></i>
                  Eco Friendly
                </Link>
              </li>
              <li>
                <Link className="mobile-nav-link submenu-item" href="/automation" onClick={closeMenu}>
                  <i className="fas fa-robot"></i>
                  Automation
                </Link>
              </li>
            </ul>
          </li>

          {/* CONTACT */}
          <li className="mobile-nav-item">
            <Link className="mobile-nav-link" href="/contact" onClick={closeMenu}>
              <i className="fas fa-envelope"></i>
              CONTACT
            </Link>
          </li>
        </ul>
      </div>
    </ClientOnly>
  );
}
