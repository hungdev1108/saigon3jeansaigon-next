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
  // Tìm index của milestone mới nhất (năm lớn nhất)
  const latestMilestoneIndex = overviewData.milestones && overviewData.milestones.length > 0
    ? overviewData.milestones.reduce((maxIdx, m, idx, arr) => {
        return Number(m.year) > Number(arr[maxIdx].year) ? idx : maxIdx;
      }, 0)
    : 0;
  const [currentSlide, setCurrentSlide] = useState(latestMilestoneIndex);
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
    initialSlide: latestMilestoneIndex,
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
            backgroundImage: `url('${BACKEND_DOMAIN}${overviewData.banner.backgroundImage}${overviewData.banner.updatedAt ? `?t=${overviewData.banner.updatedAt}` : ''}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: `100vh`,
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center', // căn giữa dọc
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
              marginTop: 80, // Đẩy xuống dưới một chút
              paddingBottom: 0, // giảm padding dưới
              paddingTop: 0,    // giảm padding trên
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
                textAlign: 'justify', // căn đều hai bên
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
                            src={`${BACKEND_DOMAIN}${milestone.image}?t=${overviewData.banner.updatedAt}`}
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
        >
          {/* Box MESSAGE */}
          <div
            className="message-content"
          >
            <div className="message-gradient-overlay"></div>
            <h2 className="section-title text-center">
              MESSAGE
              <span></span>
            </h2>
            <div className="message-text">
              <p>Dear Valued Shareholders, Partners, Customers, and All Employees of Saigon3 Jean,</p>
              <p>Over the years, Saigon3 Jean has continually strived to affirm its position in the fashion wash industry, especially in the denim sector—where creativity, quality, and sustainability are our core values. We take pride in being a trusted partner of many international and regional fashion brands.</p>
              <p>The year 2024 was filled with challenges—marked by global economic fluctuations, rapidly shifting consumer trends, and growing demands for social and environmental responsibility. In response, Saigon3 Jean took a proactive approach by: Restructuring into a leaner organization, Applying technology in production and management, and Reinforcing our commitment to green manufacturing and sustainable development.</p>
              <p>We believe that long-term growth cannot rely solely on production capacity or cost competitiveness. True sustainability must be rooted in corporate culture, people, and the ability to adapt. With that vision, Saigon3 Jean is transforming from a traditional OEM manufacturer into a &ldquo;comprehensive strategic partner in the denim fashion industry&rdquo;, offering end-to-end solutions&mdash;from design and product development to sustainable manufacturing.</p>
              <p>I would like to express my deepest gratitude to all our employees&mdash;those who have dedicated their expertise, passion, and belief in the company&rsquo;s future. I also sincerely thank our customers, partners, and shareholders for your continued support and trust in our journey.</p>
              <p>Looking ahead, Saigon3 Jean remains steadfast in its vision:</p>
              <blockquote>
                To become Southeast Asia&rsquo;s leading denim enterprise in quality, creativity, and sustainability.
              </blockquote>
              <p>We will continue to invest heavily in human resources, automation, digital transformation, and ESG initiatives, building a business that is not only efficient, but also responsible to the community and the environment.</p>
              <div className="ceo-signature text-end mt-3">
                <div className="ceo-name">Nguyễn Khánh Linh</div>
                <div className="ceo-position">Chief Executive Officer</div>
              </div>
            </div>
          </div>
          {/* CEO Image */}
          <div className="ceo-image-container">
            <img
              className="ceo-image"
              src="/images/overview-page/CEOrvbg.jpg"
              alt="CEO Nguyễn Khánh Linh"
              draggable={false}
            />
          </div>
          {/* Scroll Down Icon */}
          <div className="scroll-down-indicator">
            <svg width="32" height="48" viewBox="0 0 32 48" fill="none">
              <rect x="8" y="8" width="16" height="32" rx="8" stroke="#fff" strokeWidth="2"/>
              <rect x="15" y="16" width="2" height="8" rx="1" fill="#fff"/>
              <polygon points="16,40 12,36 20,36" fill="#fff"/>
            </svg>
          </div>
        </div>
        <style jsx>{`
          /* Fix for title underline */
          .section-title {
            text-decoration: none !important;
            border-bottom: none !important;
            font-size: 1.8rem;
            margin-bottom: 1.2rem;
            padding-bottom: 0.8rem;
            position: relative;
            color: #1e4e7d;
            font-weight: 600;
          }
          
          .section-title::after,
          .section-title::before {
            display: none !important;
          }
          
          .section-title span {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: #1e4e7d;
            display: block;
          }
          
          /* Message section styles */
          .message-section {
            position: relative;
            display: flex;
            align-items: center;
            min-height: 820px;
            background-image: url('/images/overview-page/BgrCEO.jpg');
            background-size: cover;
            background-position: center;
            padding: 40px 0;
            overflow: hidden;
            width: 100%;
          }
          
          .message-content {
            background: rgba(255,255,255,0.05);
            border-radius: 18px;
            box-shadow: 0 8px 32px 0 rgba(31,38,135,0.2);
            backdrop-filter: blur(8px) saturate(150%);
            -webkit-backdrop-filter: blur(8px) saturate(150%);
            border: 1px solid rgba(255,255,255,0.08);
            padding: 22px 24px;
            max-width: 60%; /* Tăng chiều rộng */
            width: 100%;
            margin-left: 2vw; /* Sát trái hơn */
            font-size: 0.85rem;
            line-height: 1.4;
            text-align: justify;
            color: #000;
            text-shadow: 0 1px 3px rgba(255,255,255,0.15);
            z-index: 2;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .message-gradient-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40%;
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
            z-index: -1;
            pointer-events: none;
          }
          
          .message-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40%;
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
            z-index: -1;
            pointer-events: none;
          }
          
          .message-content:hover {
            box-shadow: 0 12px 32px 0 rgba(31,38,135,0.25);
            transform: translateY(-3px);
            background: rgba(255,255,255,0.08);
          }
          
          .message-text p {
            margin-bottom: 0.6rem; /* Giảm margin */
          }
          
          .message-text blockquote {
            font-weight: 700;
            font-size: 1rem; /* Giảm font size */
            color: #0d6efd;
            margin: 10px 0;
            padding: 10px 16px;
            border-left: 4px solid #0d6efd;
            background: rgba(13, 110, 253, 0.07);
            border-radius: 6px;
            letter-spacing: 0.2px;
          }
          
          .ceo-signature .ceo-name {
            font-weight: 600;
            color: #1e4e7d;
            font-size: 1.1rem;
          }
          
          .ceo-signature .ceo-position {
            font-style: italic;
            color: #444;
            font-size: 0.9rem;
          }
          
          .ceo-image-container {
            position: absolute;
            right: 5vw;
            bottom: 0;
            height: 105%;
            z-index: 3;
            display: flex;
            align-items: flex-end;
            transform: translateY(-5%); /* Đẩy lên cao hơn */
          }
          
          .ceo-image {
            height: 100%;
            max-height: 900px; /* Tăng kích thước tối đa */
            width: auto;
            object-fit: contain;
            filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2));
          }
          
          /* Responsive styles */
          @media (max-width: 1400px) {
            .message-content {
              max-width: 60%;
              padding: 20px 22px;
            }
            
            .ceo-image {
              max-height: 850px;
            }
            
            .ceo-image-container {
              height: 100%;
              right: 4vw;
            }
          }
          
          @media (max-width: 1200px) {
            .message-section {
              min-height: 700px;
            }
            
            .message-content {
              max-width: 65%;
              font-size: 0.8rem;
            }
            
            .ceo-image {
              max-height: 800px;
            }
            
            .ceo-image-container {
              height: 95%;
              right: 3vw;
            }
          }
          
          @media (max-width: 992px) {
            .message-section {
              flex-direction: column;
              align-items: center;
              min-height: auto;
              padding: 40px 20px;
            }
            
            .message-content {
              max-width: 95%; /* Tăng từ 85% */
              margin: 0 auto 390px;
              order: 1;
            }
            
            .ceo-image-container {
              position: relative;
              right: auto;
              bottom: auto;
              height: auto;
              order: 2;
              margin-top: -370px;
              align-self: flex-end;
              margin-right: 5vw;
              transform: none;
            }
            
            .ceo-image {
              max-height: 550px;
            }
          }
          
          @media (max-width: 768px) {
            .message-section {
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
              min-height: auto;
              height: auto;
              max-height: 400px;
              padding: 0;
              background-position: center;
              background-size: cover;
              position: relative;
            }
            
            .message-content {
              position: relative;
              top: 0;
              left: 0;
              max-width: 80%; /* Tăng chiều rộng */
              width: 80%; /* Tăng chiều rộng */
              height: auto;
              max-height: 320px; /* Giảm chiều cao */
              margin: 0;
              padding: 18px 15px;
              font-size: 0.65rem;
              order: 1;
              border-radius: 12px;
              overflow: hidden;
              background: rgba(255,255,255,0.08);
              backdrop-filter: blur(10px) saturate(180%);
              -webkit-backdrop-filter: blur(10px) saturate(180%);
              border: 1px solid rgba(255,255,255,0.12);
              z-index: 2;
              box-sizing: border-box;
            }
            
            .message-content::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 40%;
              background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
              z-index: -1;
              pointer-events: none;
            }
            
            .message-text {
              max-height: 240px; /* Giảm chiều cao */
              overflow-y: auto;
              padding-right: 8px;
              text-align: justify;
              font-size: 0.65rem;
            }
            
            /* Custom scrollbar for message text */
            .message-text::-webkit-scrollbar {
              width: 3px;
            }
            
            .message-text::-webkit-scrollbar-track {
              background: rgba(255,255,255,0.1);
              border-radius: 10px;
            }
            
            .message-text::-webkit-scrollbar-thumb {
              background: rgba(30,78,125,0.3);
              border-radius: 10px;
            }
            
            .message-text::-webkit-scrollbar-thumb:hover {
              background: rgba(30,78,125,0.5);
            }
            
            .ceo-image-container {
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              margin: 0;
              height: 100%;
              width: 45%;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              z-index: 1;
            }
            
            .ceo-image {
              max-height: 100%;
              max-width: 100%;
              width: auto;
              object-fit: contain;
              object-position: right center;
            }
            
            .section-title {
              font-size: 0.9rem;
              margin-bottom: 0.4rem;
              padding-bottom: 0.3rem;
              color: #1e4e7d;
            }
            
            .section-title span {
              width: 40px;
              height: 2px;
            }
            
            .message-text p {
              margin-bottom: 0.4rem;
              line-height: 1.3;
              text-align: justify;
              font-size: 0.65rem;
            }
            
            .message-text blockquote {
              font-size: 0.65rem;
              padding: 5px 8px;
              margin: 5px 0;
              color: #0d6efd;
            }
            
            .ceo-signature .ceo-name {
              font-size: 0.65rem;
            }
            
            .ceo-signature .ceo-position {
              font-size: 0.5rem;
            }
          }
          
          @media (max-width: 576px) {
            .message-section {
              min-height: auto;
              max-height: 360px;
              padding: 10px 0;
              overflow: hidden;
              align-items: center;
            }
            
            .message-content {
              width: 62%;
              max-width: 62%;
              height: auto;
              max-height: 320px;
              padding: 15px;
              margin: 0;
              font-size: 0.6rem;
              background: rgba(255,255,255,0.05);
              backdrop-filter: blur(8px) saturate(150%);
              -webkit-backdrop-filter: blur(8px) saturate(150%);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 12px;
              box-shadow: 0 4px 15px rgba(31,38,135,0.15);
            }
            
            .message-text {
              max-height: 240px;
              overflow-y: auto;
              line-height: 1.2;
              text-align: justify;
              font-size: 0.55rem;
            }
            
            .ceo-image-container {
              width: 45%;
            }
            
            .ceo-image {
              max-height: 100%;
              object-fit: contain;
              object-position: right center;
            }
            
            .section-title {
              font-size: 0.75rem;
              margin-bottom: 0.3rem;
              padding-bottom: 0.2rem;
            }
            
            .section-title span {
              width: 25px;
              height: 2px;
            }
            
            .message-text p {
              margin-bottom: 0.3rem;
              line-height: 1.2;
              font-size: 0.55rem;
              text-align: justify;
            }
            
            .message-text blockquote {
              font-size: 0.5rem;
              padding: 4px 6px;
              margin: 4px 0;
              text-align: justify;
              border-left: 3px solid #0d6efd;
              background: rgba(13, 110, 253, 0.05);
            }
            
            .ceo-signature .ceo-name {
              font-size: 0.55rem;
            }
            
            .ceo-signature .ceo-position {
              font-size: 0.45rem;
            }
          }
        `}</style>
        <style jsx global>{`
          @media (max-width: 600px) {
            .hero-section .hero-content ul,
            .hero-section .hero-content li {
              margin-left: 10px !important;
              font-size: 15px !important;
              line-height: 1.3 !important;
              word-spacing: 0 !important;
              letter-spacing: 0 !important;
              font-family: Arial, Helvetica, sans-serif !important;
              margin-bottom: 1px !important;
              white-space: normal !important;
              overflow: visible !important;
              text-overflow: unset !important;
              word-break: break-word !important;
            }
            .hero-section .hero-content ul {
              margin-bottom: 10px !important;
            }
            .hero-section .hero-content ul li:last-child {
              margin-bottom: 10px !important;
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
        
        {/* Add CSS for the news section */}
        <style jsx>{`
          .featured-news-section {
            padding: 60px 0;
            background-color: #f8f9fa;
          }
          
          .section-title {
            margin-bottom: 30px;
          }
          
          .news-card {
            transition: transform 0.3s, box-shadow 0.3s;
            overflow: hidden;
            border: none;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          }
          
          .news-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          
          .news-card .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }
          
          .news-card .card-title a {
            color: #333;
            transition: color 0.2s;
          }
          
          .news-card .card-title a:hover {
            color: #0d6efd;
          }
          
          .news-date-badge {
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            font-size: 0.8rem;
          }
          
          .featured-tag {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1;
            background-color: #ffc107;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 0.8rem;
            font-weight: 600;
          }
          
          @media (max-width: 768px) {
            .news-card .card-title {
              font-size: 1.1rem;
            }
          }
        `}</style>
      </section>
    </>
  );
}
