"use client";

// hooks/useClientScript.js
import { useEffect } from "react";

export default function useClientScript() {
  useEffect(() => {
    // Scroll header effect
    const initScrollHeader = () => {
      const header = document.querySelector("header");
      const scrollWatcher = () => {
        if (header) {
          if (window.scrollY > 50) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }
        }
      };

      window.addEventListener("scroll", scrollWatcher);
      scrollWatcher();

      return () => window.removeEventListener("scroll", scrollWatcher);
    };

    // Scroll to top button
    const initScrollToTop = () => {
      const scrollTopBtn = document.createElement("button");
      scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
      scrollTopBtn.className = "scroll-to-top";
      document.body.appendChild(scrollTopBtn);

      const handleScroll = () => {
        if (window.scrollY > 300) {
          scrollTopBtn.classList.add("show");
        } else {
          scrollTopBtn.classList.remove("show");
        }
      };

      const handleClick = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      };

      window.addEventListener("scroll", handleScroll);
      scrollTopBtn.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        scrollTopBtn.removeEventListener("click", handleClick);
        scrollTopBtn.remove();
      };
    };

    // Smooth scroll for nav links
    const initSmoothScroll = () => {
      const handleNavClick = (e) => {
        const href = e.target.getAttribute("href");
        if (href && href.startsWith("#") && href.length > 1) {
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: "smooth",
            });
          }
        }
      };

      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("nav-link")) {
          handleNavClick(e);
        }
      });

      return () => {
        document.removeEventListener("click", handleNavClick);
      };
    };

    // Animate on scroll
    const initAnimateOnScroll = () => {
      const animateElements = document.querySelectorAll(
        ".card, .section-title, .news-item, .news-list, .contact-box, .work-with-us-box, #automation"
      );

      const checkVisible = () => {
        animateElements.forEach((element) => {
          const elementPosition = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (elementPosition.top < windowHeight * 0.9) {
            element.classList.add("animate");
          }
        });
      };

      window.addEventListener("scroll", checkVisible);
      checkVisible();

      return () => window.removeEventListener("scroll", checkVisible);
    };

    // Mobile menu handler
    const initMobileMenu = () => {
      const handleNavClick = (e) => {
        if (e.target.classList.contains("nav-link")) {
          const navbarCollapse = document.querySelector(".navbar-collapse");
          const navbarToggler = document.querySelector(".navbar-toggler");

          if (
            window.innerWidth < 992 &&
            navbarCollapse &&
            navbarCollapse.classList.contains("show") &&
            navbarToggler
          ) {
            navbarToggler.click();
          }
        }
      };

      document.addEventListener("click", handleNavClick);
      return () => document.removeEventListener("click", handleNavClick);
    };

    // Counter animation
    const initCounters = () => {
      const startCounter = (el) => {
        const target = parseInt(el.getAttribute("data-target"));
        const duration = 2000;
        const step = (target / duration) * 10;
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            clearInterval(timer);
            current = target;
          }
          el.textContent = Math.floor(current);
        }, 10);
      };

      const counters = document.querySelectorAll(".counter");
      if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                startCounter(entry.target);
                counterObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );

        counters.forEach((counter) => {
          counterObserver.observe(counter);
        });

        return () => {
          counters.forEach((counter) => {
            counterObserver.unobserve(counter);
          });
        };
      }
    };

    // Video modal
    const initVideoModal = () => {
      const videoModal = document.getElementById("videoModal");
      const watchVideoBtn = document.getElementById("watchVideoBtn");
      const closeVideoModal = document.getElementById("closeVideoModal");
      const videoPlayer = document.getElementById("videoPlayer");

      if (!videoModal || !watchVideoBtn || !closeVideoModal || !videoPlayer) {
        return;
      }

      const openModal = (e) => {
        e.preventDefault();
        videoModal.classList.add("show");
        setTimeout(() => {
          videoPlayer.play();
        }, 300);
      };

      const closeModal = () => {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        videoModal.classList.remove("show");
      };

      const handleOutsideClick = (e) => {
        if (e.target === videoModal) {
          closeModal();
        }
      };

      const handleEscapeKey = (e) => {
        if (e.key === "Escape" && videoModal.classList.contains("show")) {
          closeModal();
        }
      };

      watchVideoBtn.addEventListener("click", openModal);
      closeVideoModal.addEventListener("click", closeModal);
      window.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleEscapeKey);

      return () => {
        watchVideoBtn.removeEventListener("click", openModal);
        closeVideoModal.removeEventListener("click", closeModal);
        window.removeEventListener("click", handleOutsideClick);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    };

    // Contact form
    const initContactForm = () => {
      const contactForm = document.getElementById("contactForm");
      if (!contactForm) return;

      const validateField = (field) => {
        const value = field.value.trim();
        const isRequired = field.hasAttribute("required");

        field.classList.remove("error", "success");

        if (isRequired && !value) {
          field.classList.add("error");
          return false;
        }

        if (field.type === "email" && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            field.classList.add("error");
            return false;
          }
        }

        if (field.type === "tel" && value) {
          const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
          if (!phoneRegex.test(value)) {
            field.classList.add("error");
            return false;
          }
        }

        if (value) {
          field.classList.add("success");
        }

        return true;
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get("name");
        const company = formData.get("company");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const subject = formData.get("subject");
        const message = formData.get("message");

        if (!name || !company || !email || !phone || !subject || !message) {
          alert("Please fill in all required fields.");
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address.");
          return;
        }

        const submitBtn = contactForm.querySelector(".submit-btn");
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = "SENDING...";
        submitBtn.style.opacity = "0.7";

        // Replace with actual API call
        setTimeout(() => {
          alert(`Thank you ${name}! Your message has been sent successfully.`);
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = "1";
        }, 2000);
      };

      const handleFieldValidation = (e) => {
        if (e.type === "blur") {
          validateField(e.target);
        } else if (e.type === "input" && e.target.classList.contains("error")) {
          validateField(e.target);
        }
      };

      contactForm.addEventListener("submit", handleSubmit);
      contactForm.addEventListener("blur", handleFieldValidation, true);
      contactForm.addEventListener("input", handleFieldValidation, true);

      return () => {
        contactForm.removeEventListener("submit", handleSubmit);
        contactForm.removeEventListener("blur", handleFieldValidation, true);
        contactForm.removeEventListener("input", handleFieldValidation, true);
      };
    };

    // Product cards
    const initProductCards = () => {
      const handleCardClick = (e) => {
        if (
          e.target.closest(".carousel-indicators") ||
          e.target.closest(".carousel-control-prev") ||
          e.target.closest(".carousel-control-next")
        ) {
          return;
        }

        const card = e.target.closest(".product-card");
        if (card) {
          const productType = card.dataset.product;
          if (productType) {
            window.location.href = `product_details.html?product=${productType}`;
          }
        }
      };

      document.addEventListener("click", handleCardClick);
      return () => document.removeEventListener("click", handleCardClick);
    };

    // Accordion animation
    const initAccordion = () => {
      const handleAccordionClick = (e) => {
        if (e.target.classList.contains("accordion-button")) {
          const icon = e.target.querySelector(".accordion-icon");
          const isCollapsed = e.target.classList.contains("collapsed");

          if (icon) {
            icon.style.transform = isCollapsed
              ? "rotate(0deg)"
              : "rotate(45deg)";
          }
        }
      };

      document.addEventListener("click", handleAccordionClick);

      // Initialize first accordion icon
      const firstIcon = document.querySelector(
        ".accordion-button:not(.collapsed) .accordion-icon"
      );
      if (firstIcon) {
        firstIcon.style.transform = "rotate(45deg)";
      }

      return () => document.removeEventListener("click", handleAccordionClick);
    };

    // Add dynamic styles
    const addStyles = () => {
      if (document.getElementById("client-script-styles")) return;

      const style = document.createElement("style");
      style.id = "client-script-styles";
      style.textContent = `
        .scroll-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--primary-color, #007bff);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s, transform 0.3s;
          transform: translateY(20px);
          z-index: 999;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        
        .scroll-to-top.show {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-to-top:hover {
          background-color: var(--secondary-color, #6c757d);
        }
        
        .scrolled {
          background-color: white !important;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .animate {
          animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        #contactPage input.error,
        #contactPage textarea.error {
          border-color: #dc3545 !important;
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
        }
        
        #contactPage input.success,
        #contactPage textarea.success {
          border-color: #28a745 !important;
          box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1) !important;
        }
        
        #contactPage .submit-btn:disabled {
          cursor: not-allowed;
          transform: none !important;
        }

        .product-card {
          cursor: pointer;
        }
      `;
      document.head.appendChild(style);
    };

    // Initialize all features
    addStyles();
    const cleanupFunctions = [
      initScrollHeader(),
      initScrollToTop(),
      initSmoothScroll(),
      initAnimateOnScroll(),
      initMobileMenu(),
      initCounters(),
      initVideoModal(),
      initContactForm(),
      initProductCards(),
      initAccordion(),
    ].filter(Boolean);

    // Cleanup function
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup && cleanup());
      const styles = document.getElementById("client-script-styles");
      if (styles) styles.remove();
    };
  }, []);
}
