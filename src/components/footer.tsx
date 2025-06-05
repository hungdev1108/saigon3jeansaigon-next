import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white footer-mobile-responsive py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-12 footer-mobile-logo">
            <Image
              src="/images/sg3jeans_logo.png"
              alt="Saigon 3 Logo"
              className="mb-3"
              width={100}
              height={100}
              style={{ height: "50px" }}
            />
            <div className="social-icons footer-mobile-social">
              <Link href="#" className="me-2">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link href="#" className="me-2">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link href="#" className="me-2">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link href="#" className="me-2">
                <i className="fab fa-youtube"></i>
              </Link>
            </div>
          </div>
          <div className="col-md-3 col-12 footer-mobile-section">
            <h5>WHO WE ARE</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/about">Overview</Link>
              </li>
              <li>
                <Link href="/factory">Factory</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3 col-12 footer-mobile-section">
            <h5>TECHNOLOGY</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/technology">Machinery</Link>
              </li>
              <li>
                <Link href="/production">Production</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3 col-12 footer-mobile-section">
            <h5>SUSTAINABILITY</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/sustainability">Eco-friendly infrastructure</Link>
              </li>
              <li>
                <Link href="/automation">Automation</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 footer-mobile-copyright text-center">
            <p className="mb-0">© 2025 Saigon 3 Jean. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
