"use client";

import { useEffect } from "react";

export default function ClientScriptProvider() {
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

  return null;
}
