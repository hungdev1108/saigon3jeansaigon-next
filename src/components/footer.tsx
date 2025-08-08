"use client";

import Image from "next/image";
import Link from "next/link";
import ClientOnly from "./ClientOnly";
import { useEffect, useState } from "react";
import { BACKEND_DOMAIN } from "@/api/config";

interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: "https://facebook.com/saigon3jeans",
    instagram: "https://instagram.com/saigon3jeans", 
    youtube: "https://youtube.com/@saigon3jeans"
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`${BACKEND_DOMAIN}/api/contact/info`, { cache: 'no-store' });
        const data = await response.json();
        if (data.success && data.data?.socialLinks) {
          setSocialLinks(data.data.socialLinks);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);
  return (
    <ClientOnly>
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
              style={{ height: "50px", width: "auto" }}
            />
            <div className="social-icons footer-mobile-social">
              <Link href={socialLinks.facebook || "https://facebook.com/saigon3jeans"} target="_blank" rel="noopener noreferrer" className="me-2">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link href={socialLinks.instagram || "https://instagram.com/saigon3jeans"} target="_blank" rel="noopener noreferrer" className="me-2">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link href={socialLinks.youtube || "https://youtube.com/@saigon3jeans"} target="_blank" rel="noopener noreferrer" className="me-2">
                <i className="fab fa-youtube"></i>
              </Link>
            </div>
          </div>
          <div className="col-md-3 col-12 footer-mobile-section">
            <h5>WHO WE ARE</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/overview">Overview</Link>
              </li>
              <li>
                <Link href="/facilities">Facilities</Link>
              </li>
              <li>
                <Link href="/recruitment">Careers</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3 col-12 footer-mobile-section">
            <h5>TECHNOLOGY</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/machinery">Machinery</Link>
              </li>
              <li>
                <Link href="/products">Production</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3 col-12 footer-mobile-section">
            <h5>SUSTAINABILITY</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/eco-friendly">Eco-friendly infrastructure</Link>
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
    </ClientOnly>
  );
}
