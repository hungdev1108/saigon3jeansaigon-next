"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { BACKEND_DOMAIN } from "../../api/config";
import useSWR from "swr";

// Interfaces for TypeScript
interface Banner {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  isActive: boolean;
  updatedAt?: string;
}

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
  order: number;
}

interface MessageContent {
  _id: string;
  paragraph: string;
  order: number;
}

interface Message {
  id: string;
  ceoName: string;
  ceoImage: string;
  content: MessageContent[];
  isActive: boolean;
}

interface VisionMission {
  id: string;
  vision: {
    icon: string;
    title: string;
    content: string;
  };
  mission: {
    icon: string;
    title: string;
    content: string;
  };
  isActive: boolean;
}

interface CoreValue {
  id: string;
  title: string;
  content: string;
  icon: string;
  order: number;
}

interface OverviewData {
  banner: Banner;
  milestones: Milestone[];
  message: Message;
  visionMission: VisionMission;
  coreValues: CoreValue[];
}

interface OverviewProps {
  overviewData: OverviewData;
}

export default function Overview({ overviewData }: OverviewProps) {
  const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "http://localhost:5001";
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) throw new Error("Failed to fetch overview data");
    return data.data;
  };

  const { data: swrData, error } = useSWR(
    `${BACKEND_DOMAIN}/api/overview/data`,
    fetcher,
    {
      fallbackData: overviewData,
      revalidateOnFocus: true,
    }
  );

  // Hooks luôn phải khai báo trước khi return
  const [currentSlide, setCurrentSlide] = useState(0);
  const animateElementsRef = useRef<(HTMLElement | null)[]>([]);
  const sliderRef = useRef<Slider>(null);

  if (error) {
    return (
      <section className="hero-section" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <h2 className="text-danger">Error loading overview data</h2>
        </div>
      </section>
    );
  }
  if (!swrData) {
    return (
      <section className="hero-section" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  overviewData = swrData;

  // Slick settings
  const slickSettings = {
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 3,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    infinite: true,
    focusOnSelect: true,
    arrows: false,
    // dots: true,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          centerPadding: "80px",
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "60px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "80px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "60px",
        },
      },
    ],
  };

  // Animate on scroll functionality
  useEffect(() => {
    const checkVisible = () => {
      animateElementsRef.current.forEach((element) => {
        if (element) {
          const elementPosition = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (elementPosition.top < windowHeight * 0.9) {
            element.classList.add("animate");
          }
        }
      });
    };

    const handleScroll = () => {
      checkVisible();
    };

    window.addEventListener("scroll", handleScroll);
    checkVisible(); // Check initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smooth scroll for navigation links
  useEffect(() => {
    const handleNavLinkClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute("href");

      if (href?.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          window.scrollTo({
            top:
              targetElement.getBoundingClientRect().top +
              window.pageYOffset -
              100,
            behavior: "smooth",
          });
        }
      }
    };

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavLinkClick);
    });

    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleNavLinkClick);
      });
    };
  }, []);

  // Touch/swipe handlers for mobile - handled by Slick

  // Debug logging
  useEffect(() => {
    console.log("Current slide:", currentSlide);
  }, [currentSlide]);

  // Helper: Render mô tả có danh sách thụt vào nếu có dấu '-'
  function renderBannerDescription(text: string) {
    if (!text) return null;
    // Tách block theo 2 dòng xuống
    const blocks = text.trim().split(/\n\s*\n/);
    return blocks.map((block, idx) => {
      const lines = block.split('\n');
      // Nếu tất cả dòng đều bắt đầu bằng '-'
      if (lines.every(line => line.trim().startsWith('-'))) {
        return (
          <ul
            key={idx}
            style={{
              marginLeft: 40,
              marginTop: 8,
              marginBottom: 8,
              fontFamily: "'DejaVu Serif', serif"
            }}
          >
            {lines.map((line, i) => (
              <li key={i} style={{ fontFamily: "'DejaVu Serif', serif" }}>
                {line.replace(/^(\s*)-/, '$1')}
              </li>
            ))}
          </ul>
        );
      }
      // Đoạn văn thường
      return (
        <p key={idx} style={{ marginBottom: 8, whiteSpace: 'pre-line' }}>{block}</p>
      );
    });
  }

  if (!overviewData || !overviewData.banner.backgroundImage) {
    return (
      <section className="hero-section" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  // Thêm biến timestamp cho banner
  const bannerTimestamp = overviewData?.banner?.updatedAt || Date.now();

  // Thêm biến để dễ chỉnh khoảng cách box message với bên trái
  const messageBoxMarginLeft = 250; // Đẩy box sát trái hơn nữa

  return (
    <>
      <section className="page-content py-5">
        {/* <!-- Hero Section with Overlay --> */}
        <div
          className="hero-section"
          ref={(el) => {
            if (el) animateElementsRef.current[0] = el;
          }}
          style={{
            backgroundImage: `url('${BACKEND_DOMAIN}${overviewData.banner.backgroundImage}?t=${overviewData.banner.updatedAt || Date.now()}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: `100vh`,
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            marginTop: '-13px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            className="hero-content"
            style={{
              color: '#222',
              textShadow: 'none',
              textAlign: 'left',
              fontWeight: 400,
              width: '100%',
              maxWidth: 1200,
              margin: '0 auto',
              paddingBottom: 35,
              paddingTop: 70,
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <h2
              style={{
                color: '#111',
                textShadow: 'none',
                textAlign: 'left',
                fontWeight: 700,
                fontSize: 28,
                marginBottom: 18,
                fontFamily: 'DejaVu Serif',
              }}
            >
              {overviewData.banner.title}
            </h2>
            <div
              style={{
                fontFamily: 'DejaVu Serif, serif',
                fontSize: 17,
                lineHeight: 1.6,
                color: '#222',
                textAlign: 'left',
                fontWeight: 400,
                margin: 0
              }}
            >
              {renderBannerDescription(overviewData.banner.description)}
            </div>
          </div>
        </div>

        {/* Tiêu đề MILESTONES tách riêng */}
        <div className="container">
          <h2 className="section-title mt-5">
            MILESTONES 
          </h2>
        </div>

        {/* Modern MILESTONES Section with Interactive Carousel */}
        <div
          className="milestones-section"
          ref={(el) => {
            if (el) animateElementsRef.current[1] = el;
          }}
        >
          <div className="container-fluid px-0">
            <div className="milestones-carousel">
              <Slider {...slickSettings} ref={sliderRef}>
                {overviewData.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="timeline-slide-wrapper">
                    <div
                      className={`timeline-slide ${
                        index === currentSlide ? "slick-center" : ""
                      }`}
                    >
                      <div className="timeline-year">{milestone.year}</div>
                      <div className="timeline-item" data-year={milestone.year}>
                        <div className="timeline-date">{milestone.year}</div>
                        <div className="timeline-content">
                          <Image
                            src={`${BACKEND_DOMAIN}${milestone.image}?t=${bannerTimestamp}`}
                            alt={`Milestone ${milestone.year}`}
                            width={300}
                            height={200}
                            objectFit="cover"
                          />
                          <div className="milestone-description">
                            <h5>{milestone.title}</h5>
                            <p>{milestone.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>

        {/* MESSAGE Section */}
        <div
          className="message-section"
          style={{
            width: '100%',
            minHeight: '640px',
            paddingTop: 80, // giả sử header cao 80px, chỉnh lại nếu header cao khác
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: `url('/images/overview-page/CEO-Banner.jpg') top center/contain no-repeat`,
            backgroundColor: '#f1f5f7',
            position: 'relative',
          }}
        >
          {/* Box MESSAGE */}
          <div
            className="message-content modern-scroll"
            style={{
              background: 'rgba(255,255,255,0.3)',
              borderRadius: 24,
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              padding: 40,
              maxWidth: 550,
              margin: `0 0 0 ${messageBoxMarginLeft}px`,
              flex: '0 0 760px',
              zIndex: 2,
              fontSize: 18,
              lineHeight: 1.7,
              maxHeight: '70vh',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(44,62,80,0.15) transparent',
            }}
          >
            <div className="message-text-wrapper">
              <h2 className="section-title ">MESSAGE</h2>
              <div className="message-text">
                <p>Dear Valued Shareholders, Partners, Customers, and All Employees of Saigon3 Jean,</p>
                <p>Over the years, Saigon3 Jean has continually strived to affirm its position in the fashion wash industry, especially in the denim sector—where creativity, quality, and sustainability are our core values. We take pride in being a trusted partner of many international and regional fashion brands.</p>
                <p>The year 2024 was filled with challenges—marked by global economic fluctuations, rapidly shifting consumer trends, and growing demands for social and environmental responsibility. In response, Saigon3 Jean took a proactive approach by: Restructuring into a leaner organization, Applying technology in production and management, and Reinforcing our commitment to green manufacturing and sustainable development.</p>
                <p>We believe that long-term growth cannot rely solely on production capacity or cost competitiveness. True sustainability must be rooted in corporate culture, people, and the ability to adapt. With that vision, Saigon3 Jean is transforming from a traditional OEM manufacturer into a &ldquo;comprehensive strategic partner in the denim fashion industry&rdquo;, offering end-to-end solutions&mdash;from design and product development to sustainable manufacturing.</p>
                <p>I would like to express my deepest gratitude to all our employees&mdash;those who have dedicated their expertise, passion, and belief in the company&rsquo;s future. I also sincerely thank our customers, partners, and shareholders for your continued support and trust in our journey.</p>
                <p>Looking ahead, Saigon3 Jean remains steadfast in its vision:</p>
                <blockquote style={{ fontWeight: 600, fontSize: 20, color: '#1e4e7d', margin: '16px 0' }}>
                  To become Southeast Asia&rsquo;s leading denim enterprise in quality, creativity, and sustainability.
                </blockquote>
                <p>We will continue to invest heavily in human resources, automation, digital transformation, and ESG initiatives, building a business that is not only efficient, but also responsible to the community and the environment.</p>
              </div>
              <div className="ceo-signature" style={{ marginTop: 32 }}>
                <div className="ceo-name" style={{ fontWeight: 600, color: '#1e4e7d', fontSize: 20 }}>CEO</div>
                <div className="ceo-position" style={{ fontStyle: 'italic', color: '#444' }}>Chief Executive Officer</div>
              </div>
            </div>
          </div>
        </div>

        {/* VISION & MISSION Section */}
        <div
          className="vision-mission-section"
          ref={(el) => {
            if (el) animateElementsRef.current[3] = el;
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="vision-box">
                  <i className={overviewData.visionMission.vision.icon}></i>
                  <h2 className="section-title ">VISION</h2>
                  <p>{overviewData.visionMission.vision.content}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mission-box">
                  <i className={overviewData.visionMission.mission.icon}></i>
                  <h2 className="section-title ">MISSION</h2>
                  <p>{overviewData.visionMission.mission.content}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORE VALUES Section */}
        <div
          className="core-values-section"
          ref={(el) => {
            if (el) animateElementsRef.current[4] = el;
          }}
        >
          <div className="container">
            <h2 className="section-title ">CORE VALUES</h2>
            <div className="row">
              {overviewData.coreValues.map((value, index) => (
                <div
                  key={value.id || `core-value-${index}`}
                  className={`${index < 3 ? "col-md-4" : "col-md-6"} mb-4`}
                  ref={(el) => {
                    if (el) animateElementsRef.current[5 + index] = el;
                  }}
                >
                  <div className="value-box">
                    <i className={value.icon}></i>
                    <h4>{value.title}</h4>
                    <p>{value.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
