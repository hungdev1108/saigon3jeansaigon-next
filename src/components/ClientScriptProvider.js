"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ClientScriptProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Load Bootstrap JavaScript
    const loadBootstrap = async () => {
      if (typeof window !== "undefined" && !window.bootstrap) {
        const { default: bootstrap } = await import(
          "bootstrap/dist/js/bootstrap.bundle.min.js"
        );
        window.bootstrap = bootstrap;
      }
    };
    loadBootstrap();
  }, []);

  // NProgress: Hiệu ứng loading khi chuyển trang
  useEffect(() => {
    NProgress.start();
    NProgress.set(0.4);
    const timer = setTimeout(() => {
      NProgress.done();
    }, 400); // Tối ưu UX, tránh loading quá nhanh
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
