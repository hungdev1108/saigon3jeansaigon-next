"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
    <>
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
                <li className="nav-item">
                  <Link className="nav-link" href="/">
                    WHO WE ARE
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/machinery">
                    TECHNOLOGY
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/eco-friendly">
                    SUSTAINABILITY
                  </Link>
                </li>
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
          {/* <Image
            src="/images/sg3jeans_logo.png"
            alt="Saigon 3 Logo"
            width={60}
            height={60}
          /> */}
          <button className="mobile-menu-close" onClick={closeMenu}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <ul className="mobile-menu-nav">
          <li className="mobile-nav-item">
            <Link className="mobile-nav-link" href="/" onClick={closeMenu}>
              <i className="fas fa-building"></i>
              WHO WE ARE
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link
              className="mobile-nav-link"
              href="/machinery"
              onClick={closeMenu}
            >
              <i className="fas fa-cogs"></i>
              TECHNOLOGY
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link
              className="mobile-nav-link"
              href="/eco-friendly"
              onClick={closeMenu}
            >
              <i className="fas fa-leaf"></i>
              SUSTAINABILITY
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link
              className="mobile-nav-link"
              href="/contact"
              onClick={closeMenu}
            >
              <i className="fas fa-envelope"></i>
              CONTACT
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
