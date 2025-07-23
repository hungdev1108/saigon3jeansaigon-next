"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { BACKEND_DOMAIN } from '@/api/config';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const animateElementsRef = useRef<(HTMLElement | null)[]>([]);
  const sliderRef = useRef<Slider>(null);

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
          ref={(el) => {
            if (el) animateElementsRef.current[2] = el;
          }}
          style={{
            width: '100%',
            minHeight: '640px',
            paddingTop: 70,
            paddingBottom: 70,
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
            className="message-content"
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              padding: '15px',
              maxWidth: '900px',
              marginLeft: '50px',
              fontSize: '0.68rem',
              lineHeight: 1.2,
              backdropFilter: 'blur(2px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#333',
              textShadow: '0 1px 1px rgba(255,255,255,0.7)',
              width: 'calc(100% - 100px)',
              marginRight: '50px',
            }}
          >
            <h2 className="section-title text-center" style={{
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              position: 'relative',
              color: '#1e4e7d',
              fontWeight: 600,
              borderBottom: 'none',
            }}>
              MESSAGE
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '2px',
                background: '#1e4e7d',
                display: 'block',
              }}></span>
            </h2>
            <div className="message-text">
              <p style={{marginBottom: '0.3rem'}}>Dear Valued Shareholders, Partners, Customers, and All Employees of Saigon3 Jean,</p>
              <p style={{marginBottom: '0.3rem'}}>Over the years, Saigon3 Jean has continually strived to affirm its position in the fashion wash industry, especially in the denim sector—where creativity, quality, and sustainability are our core values. We take pride in being a trusted partner of many international and regional fashion brands.</p>
              <p style={{marginBottom: '0.3rem'}}>The year 2024 was filled with challenges—marked by global economic fluctuations, rapidly shifting consumer trends, and growing demands for social and environmental responsibility. In response, Saigon3 Jean took a proactive approach by: Restructuring into a leaner organization, Applying technology in production and management, and Reinforcing our commitment to green manufacturing and sustainable development.</p>
              <p style={{marginBottom: '0.3rem'}}>We believe that long-term growth cannot rely solely on production capacity or cost competitiveness. True sustainability must be rooted in corporate culture, people, and the ability to adapt. With that vision, Saigon3 Jean is transforming from a traditional OEM manufacturer into a &ldquo;comprehensive strategic partner in the denim fashion industry&rdquo;, offering end-to-end solutions&mdash;from design and product development to sustainable manufacturing.</p>
              <p style={{marginBottom: '0.3rem'}}>I would like to express my deepest gratitude to all our employees&mdash;those who have dedicated their expertise, passion, and belief in the company&rsquo;s future. I also sincerely thank our customers, partners, and shareholders for your continued support and trust in our journey.</p>
              <p style={{marginBottom: '0.3rem'}}>Looking ahead, Saigon3 Jean remains steadfast in its vision:</p>
              <blockquote style={{ 
                fontWeight: 600, 
                fontSize: '0.7rem', 
                color: '#1e4e7d', 
                margin: '4px 0', 
                padding: '4px 6px', 
                borderLeft: '3px solid #1e4e7d', 
                background: 'rgba(30, 78, 125, 0.05)'
              }}>
                To become Southeast Asia&rsquo;s leading denim enterprise in quality, creativity, and sustainability.
              </blockquote>
              <p style={{marginBottom: '0.3rem'}}>We will continue to invest heavily in human resources, automation, digital transformation, and ESG initiatives, building a business that is not only efficient, but also responsible to the community and the environment.</p>
              <div className="ceo-signature text-end mt-1">
                <div className="ceo-name" style={{ fontWeight: 600, color: '#1e4e7d', fontSize: '0.8rem' }}>CEO</div>
                <div className="ceo-position" style={{ fontStyle: 'italic', color: '#444', fontSize: '0.65rem' }}>Chief Executive Officer</div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          /* Fix for title underline */
          .section-title {
            text-decoration: none !important;
            border-bottom: none !important;
          }
          
          .section-title::after,
          .section-title::before {
            display: none !important;
          }
          
          /* Responsive styles */
          @media (max-width: 1200px) {
            .message-section {
              justify-content: center !important;
            }
            .message-content {
              margin-left: 0 !important;
              max-width: 80% !important;
            }
          }
          @media (max-width: 768px) {
            .message-content {
              max-width: 90% !important;
              margin-right: 0 !important;
              padding: 12px !important;
            }
          }
          @media (max-width: 576px) {
            .message-section {
              padding-top: 20px !important;
              padding-bottom: 20px !important;
              align-items: flex-start !important;
              background-position: right -50px center !important;
              background-size: auto 100% !important;
              background-image: url('/images/overview-page/CEO-Banner.jpg') !important;
              min-height: 500px !important;
              justify-content: flex-start !important;
            }
            .message-content {
              max-width: 50% !important;
              max-height: 440px !important;
              overflow-y: auto !important;
              font-size: 0.7rem !important;
              margin-top: 10px !important;
              margin-left: 10px !important;
              background: rgba(255,255,255,0.9) !important;
              color: #222 !important;
              text-shadow: none !important;
              width: auto !important;
              padding: 10px !important;
            }
            .message-text {
              max-height: 370px !important;
              overflow-y: auto !important;
              padding-right: 5px !important;
            }
            .section-title {
              font-size: 1rem !important;
              margin-bottom: 5px !important;
              padding-bottom: 5px !important;
              border-bottom: none !important;
            }
            .section-title span {
              width: 40px !important;
            }
            .blockquote {
              font-size: 0.7rem !important;
              background: rgba(30, 78, 125, 0.1) !important;
              padding: 3px 5px !important;
            }
            /* Custom scrollbar for mobile */
            .message-text::-webkit-scrollbar {
              width: 4px !important;
            }
            .message-text::-webkit-scrollbar-track {
              background: rgba(255,255,255,0.2) !important;
              border-radius: 10px !important;
            }
            .message-text::-webkit-scrollbar-thumb {
              background: rgba(30,78,125,0.3) !important;
              border-radius: 10px !important;
            }
            .message-text::-webkit-scrollbar-thumb:hover {
              background: rgba(30,78,125,0.5) !important;
            }
          }
        `}</style>

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
