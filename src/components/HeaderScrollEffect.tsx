"use client";

import { useEffect } from "react";

export default function HeaderScrollEffect() {
  useEffect(() => {
    const scrollWatcher = () => {
      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    };

    // Set initial state
    scrollWatcher();

    // Add scroll event listener
    window.addEventListener("scroll", scrollWatcher);

    // Retry finding header after components load
    const timeout = setTimeout(() => {
      const headerAfterLoad = document.querySelector("header");
      if (headerAfterLoad) {
        scrollWatcher();
      }
    }, 500);

    return () => {
      window.removeEventListener("scroll", scrollWatcher);
      clearTimeout(timeout);
    };
  }, []);

  return null; // This component doesn't render anything
}
