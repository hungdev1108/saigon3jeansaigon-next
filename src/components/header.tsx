"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
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
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" href="/">
                  HOME
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/facilities">
                  FACILITIES
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/machinery">
                  MACHINERY
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/products">
                  PRODUCTS
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
