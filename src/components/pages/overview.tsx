"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { BACKEND_DOMAIN } from '@/api/config';
import { getOptimizedImageUrls } from '../../shared/imageUtils';

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

  // Force uniform font-weight for hero section with intensive debugging
  useEffect(() => {
    const forceUniformTypography = () => {
      console.log('🎨 Force typography running...');
      console.log('📊 Banner description data:', overviewData?.banner?.description);
      
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        const allElements = heroContent.querySelectorAll('*');
        console.log(`🔍 Found ${allElements.length} elements in hero-content`);
        
        allElements.forEach((element, index) => {
          const el = element as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          const currentWeight = window.getComputedStyle(el).fontWeight;
          const currentColor = window.getComputedStyle(el).color;
          
          console.log(`Element ${index}: ${tagName}, current weight: ${currentWeight}, current color: ${currentColor}`);
          
          // Determine appropriate styling based on element type
          const isListElement = tagName === 'li' || tagName === 'ul' || el.classList.contains('uniform-typography-li') || el.classList.contains('uniform-typography-ul');
          const fontWeight = isListElement ? '500' : '400';
          const letterSpacing = isListElement ? '0.2px' : '0.3px';
          const textShadow = isListElement ? '0 0 0.5px rgba(51, 51, 51, 0.1)' : 'none';
          
          console.log(`Element ${index} (${tagName}) - isListElement: ${isListElement}, setting weight: ${fontWeight}, shadow: ${textShadow}`);
          
          // Force styles with highest priority
          el.style.setProperty('font-weight', fontWeight, 'important');
          el.style.setProperty('color', '#333', 'important');
          el.style.setProperty('font-family', '"Inter", sans-serif', 'important');
          el.style.setProperty('font-style', 'normal', 'important');
          el.style.setProperty('font-variant', 'normal', 'important');
          el.style.setProperty('font-stretch', 'normal', 'important');
          el.style.setProperty('letter-spacing', letterSpacing, 'important');
          el.style.setProperty('text-shadow', textShadow, 'important');
          
          // Remove any inherited styling
          el.style.removeProperty('font-weight');
          el.style.setProperty('font-weight', fontWeight, 'important');
          
          const newWeight = window.getComputedStyle(el).fontWeight;
          const newColor = window.getComputedStyle(el).color;
          console.log(`After change: weight: ${newWeight}, color: ${newColor}`);
        });
        
        // Special handling for specific elements
        const heroTitle = document.getElementById('hero-title');
        const heroContentText = document.getElementById('hero-content-text');
        
        if (heroTitle) {
          heroTitle.style.setProperty('font-weight', '400', 'important');
          heroTitle.style.setProperty('color', '#333', 'important');
          heroTitle.style.setProperty('font-family', '"Inter", sans-serif', 'important');
          heroTitle.style.setProperty('font-variation-settings', '"wght" 400', 'important');
          console.log('🎯 Hero title forced');
        }
        
        if (heroContentText) {
          heroContentText.style.setProperty('font-weight', '400', 'important');
          heroContentText.style.setProperty('color', '#333', 'important');
          heroContentText.style.setProperty('font-family', '"Inter", sans-serif', 'important');
          
          // Force all children with setAttribute for maximum override
          const children = heroContentText.querySelectorAll('*');
          children.forEach((child, childIndex) => {
            const childEl = child as HTMLElement;
            const childTag = childEl.tagName.toLowerCase();
            
            // Determine appropriate styling for child elements
            const isChildListElement = childTag === 'li' || childTag === 'ul' || childEl.classList.contains('uniform-typography-li') || childEl.classList.contains('uniform-typography-ul');
            const childFontWeight = isChildListElement ? '500' : '400';
            const childLetterSpacing = isChildListElement ? '0.2px' : '0.3px';
            const childTextShadow = isChildListElement ? '0 0 0.5px rgba(51, 51, 51, 0.1)' : 'none';
            
            childEl.style.setProperty('font-weight', childFontWeight, 'important');
            childEl.style.setProperty('color', '#333', 'important');  
            childEl.style.setProperty('font-family', '"Inter", sans-serif', 'important');
            childEl.style.setProperty('letter-spacing', childLetterSpacing, 'important');
            childEl.style.setProperty('text-shadow', childTextShadow, 'important');
            
            // Try setting attributes too
            childEl.setAttribute('style', 
              childEl.getAttribute('style') + `; font-weight: ${childFontWeight} !important; color: #333 !important; font-family: "Inter", sans-serif !important; letter-spacing: ${childLetterSpacing} !important; text-shadow: ${childTextShadow} !important;`
            );
            
            console.log(`🔧 Child ${childIndex} (${childTag}) - isListElement: ${isChildListElement}, weight: ${childFontWeight}, shadow: ${childTextShadow}`);
          });
          
          console.log('📝 Hero content text and children forced');
        }
      }
    };

    // Apply multiple times with different delays
    forceUniformTypography();
    const timer1 = setTimeout(forceUniformTypography, 50);
    const timer2 = setTimeout(forceUniformTypography, 200);
    const timer3 = setTimeout(forceUniformTypography, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [overviewData]);

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
    
    console.log('🔍 Raw banner description:', text);
    console.log('🔍 Text length:', text.length);
    console.log('🔍 Text encoded:', JSON.stringify(text));
    
    // Tách block theo 2 dòng xuống
    const blocks = text.trim().split(/\n\s*\n/);
    console.log('📦 Number of blocks:', blocks.length);
    
    // Shared styles object to ensure consistency
    const baseParagraphStyles = {
      fontFamily: '"Inter", sans-serif',
      fontSize: 26,
      fontWeight: 400,
      color: '#333',
      lineHeight: 1.5,
      letterSpacing: '0.3px',
      fontStyle: 'normal',
      fontVariant: 'normal',
      fontStretch: 'normal'
    };
    
    // List items need visual compensation to match paragraph appearance
    const baseListStyles = {
      fontFamily: '"Inter", sans-serif',
      fontSize: 26,
      fontWeight: 500, // Use 500 instead of 450 for better browser support
      color: '#333',
      lineHeight: 1.5,
      letterSpacing: '0.2px', // Slightly tighter letter spacing
      fontStyle: 'normal',
      fontVariant: 'normal',
      fontStretch: 'normal',
      textShadow: '0 0 0.5px rgba(51, 51, 51, 0.1)' // Very subtle text shadow for visual weight
    };
    
    return blocks.map((block, idx) => {
      const lines = block.split('\n');
      console.log(`📄 Block ${idx}:`, lines);
      
      // Nếu tất cả dòng đều bắt đầu bằng '-'
      if (lines.every(line => line.trim().startsWith('-'))) {
        console.log(`📋 Block ${idx} is a list`);
        return (
          <ul
            key={idx}
            className="uniform-typography-ul"
            style={{
              marginLeft: 40,
              marginTop: 8,
              marginBottom: 8,
              ...baseListStyles,
              listStyle: 'disc',
              paddingLeft: 0
            }}
          >
            {lines.map((line, i) => (
              <li 
                key={i} 
                className="uniform-typography-li"
                style={{
                  ...baseListStyles,
                  marginBottom: 8,
                  display: 'list-item'
                }}
              >
                {line.replace(/^(\s*)-/, '$1')}
              </li>
            ))}
          </ul>
        );
      }
      
      // Đoạn văn thường
      console.log(`📄 Block ${idx} is a paragraph`);
      return (
        <p 
          key={idx} 
          className="uniform-typography-p"
          style={{ 
            ...baseParagraphStyles,
            marginBottom: 12, 
            whiteSpace: 'pre-line' 
          }}
        >
          {block}
        </p>
      );
    });
  }

  // Hàm nối domain và path đúng chuẩn
  const joinUrl = (domain: string, path: string) =>
    domain.replace(/\/$/, '') + '/' + path.replace(/^\//, '');

  // Tính toán bgUrl tối ưu cho background: ưu tiên ảnh gốc nếu có
  const bgUrl = overviewData.message.backgroundImage
    ? joinUrl(BACKEND_DOMAIN, overviewData.message.backgroundImage)
    : overviewData.message.backgroundImageVersions?.medium
      ? joinUrl(BACKEND_DOMAIN, overviewData.message.backgroundImageVersions.medium)
      : '/images/overview-page/BgrCEO.jpg';
  console.log('bgUrl', bgUrl);

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
      <section className="page-content" style={{ padding: 0 }}>
        {/* <!-- Hero Section with Overlay --> */}
        <div className="hero-section" style={{
          minHeight: `100vh`,
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-70px',
          paddingTop: '80px',
          position: 'relative',
          zIndex: 2,
        }}>
          <ResponsiveImg
            srcs={getOptimizedImageUrls(overviewData.banner.backgroundImage)}
            alt={overviewData.banner.title || 'Banner'}
            width={1920}
            height={800}
            className="overview-banner-img"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
              opacity: 0.85
            }}
          />
          <div className="hero-content uniform-text" style={{ 
            position: 'relative', 
            zIndex: 2, 
            width: '100%', 
            maxWidth: 1600, 
            margin: '0 auto', 
            marginTop: 120, 
            paddingBottom: 0, 
            paddingTop: 0, 
            paddingLeft: 60, 
            paddingRight: 60, 
            background: 'rgba(255,255,255,0.02)' 
          }}>
            <h2 id="hero-title" style={{ 
              color: '#333', 
              textShadow: 'none', 
              textAlign: 'left', 
              fontWeight: 400, 
              fontSize: 48, 
              marginBottom: 24, 
              fontFamily: '"Inter", sans-serif', 
              letterSpacing: '0.5px' 
            }}>{overviewData.banner.title}</h2>
            <div id="hero-content-text" style={{ 
              fontFamily: '"Inter", sans-serif', 
              fontSize: 26, 
              lineHeight: 1.5, 
              color: '#333', 
              textAlign: 'justify', 
              fontWeight: 400, 
              margin: 0, 
              letterSpacing: '0.3px' 
            }}>
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
                          <ResponsiveImg
                            srcs={getOptimizedImageUrls(milestone.image)}
                            alt={`Milestone ${milestone.year}`}
                            width={300}
                            height={200}
                            className="timeline-img"
                            style={{ objectFit: 'cover', borderRadius: 12, width: '100%', height: 200, marginBottom: 12 }}
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
          className={`message-section${(overviewData.message.backgroundImage || overviewData.message.backgroundImageVersions?.medium) ? ' bg-dynamic' : ''}`}
          style={(overviewData.message.backgroundImage || overviewData.message.backgroundImageVersions?.medium)
            ? { ['--bg-url' as any]: `url(${bgUrl})` }
            : undefined
          }
          ref={(el) => {
            if (el) animateElementsRef.current[2] = el;
          }}
        >
          {/* Box MESSAGE */}
          <div className="message-content">
            <div className="message-gradient-overlay"></div>
            <h2 className="section-title text-center">
              MESSAGE
              <span></span>
            </h2>
            <div className="message-text">
              {overviewData.message.content.map((item, idx) => {
                if (item.type === 'header') return <p key={idx} className="header">{item.paragraph}</p>;
                if (item.type === 'highlight') return <blockquote key={idx}>{item.paragraph}</blockquote>;
                return <p key={idx}>{item.paragraph}</p>;
              })}
              <div className="ceo-signature text-end mt-3">
                <div className="ceo-name">{overviewData.message.ceoName}</div>
                <div className="ceo-position">Chief Executive Officer</div>
              </div>
            </div>
          </div>
          {/* CEO Image */}
          <div className="ceo-image-container">
            <img
              className="ceo-image"
              src={overviewData.message.ceoImageVersions?.medium
                ? joinUrl(BACKEND_DOMAIN, overviewData.message.ceoImageVersions.medium)
                : overviewData.message.ceoImageVersions?.webp
                  ? joinUrl(BACKEND_DOMAIN, overviewData.message.ceoImageVersions.webp)
                  : overviewData.message.ceoImageVersions?.thumbnail
                    ? joinUrl(BACKEND_DOMAIN, overviewData.message.ceoImageVersions.thumbnail)
                    : overviewData.message.ceoImage
                      ? (overviewData.message.ceoImage.startsWith('/uploads')
                        ? joinUrl(BACKEND_DOMAIN, overviewData.message.ceoImage)
                        : overviewData.message.ceoImage)
                      : '/images/overview-page/CEOrvbg.jpg'}
              alt={overviewData.message.ceoName}
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
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            position: relative;
            color: #1e4e7d;
            font-weight: 500;
            font-family: "Inter", sans-serif;
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
            background-repeat: no-repeat;
            padding: 40px 0;
            overflow: hidden;
            width: 100%;
            box-sizing: border-box;
          }
          .message-section.bg-dynamic {
            background-image: var(--bg-url) !important;
          }
          
          .message-content {
            background: rgba(255,255,255,0.05);
            border-radius: 18px;
            box-shadow: 0 8px 32px 0 rgba(31,38,135,0.2);
            backdrop-filter: blur(8px) saturate(150%);
            -webkit-backdrop-filter: blur(8px) saturate(150%);
            border: 1px solid rgba(255,255,255,0.08);
            padding: 22px 24px;
            max-width: 60%;
            width: 100%;
            margin-left: 2vw;
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
            box-sizing: border-box;
            min-height: 400px;
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
            font-weight: 500;
            font-size: 1.1rem; /* Tăng size bằng với message content */
            color: #0d6efd;
            margin: 10px 0;
            padding: 10px 16px;
            border-left: 4px solid #0d6efd;
            background: rgba(13, 110, 253, 0.07);
            border-radius: 6px;
            letter-spacing: 0.2px;
          }
          
          .ceo-signature .ceo-name {
            font-weight: 500;
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
            height: 100%;
            z-index: 3;
            display: flex;
            align-items: flex-end;
            transform: translateY(-5%);
          }
          
          .ceo-image {
            height: 100%;
            max-height: 900px;
            max-width: 100%;
            width: auto;
            object-fit: contain;
            filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2));
          }
          
          .scroll-down-indicator {
            position: absolute;
            right: 2vw;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
            opacity: 0.7;
            transition: all 0.3s ease;
          }
          
          .scroll-down-indicator svg {
            width: 32px;
            height: 48px;
            transition: all 0.3s ease;
          }
          
          /* Responsive styles - NO OVERLAP EVER */
          @media (max-width: 1660px) {
            .message-section {
              min-height: 800px;
            }
            
            .message-content {
              max-width: 55%;
              width: 55%;
              padding: 20px 22px;
              font-size: 0.78rem;
              min-height: 360px;
            }
            
            .message-text p {
              font-size: 0.85rem;
            }
            
            .message-text blockquote {
              font-size: 0.95rem;
            }
            
            .ceo-signature .ceo-name {
              font-size: 1.05rem;
            }
            
            .ceo-signature .ceo-position {
              font-size: 0.9rem;
            }
            
            
            .ceo-image-container {
              height: 100%;
              right: 4vw;
              width: 35%;
              max-width: 35%;
            }
            
            .scroll-down-indicator {
              right: 1.5vw;
            }
            
            .scroll-down-indicator svg {
              width: 28px;
              height: 42px;
            }
          }
          @media (max-width: 1400px) {
            .message-section {
              min-height: 700px;
            }
            
            .message-content {
              max-width: 60%;
              width: 60%;
              padding: 20px 22px;
              font-size: 0.75rem;
              min-height: 450px;
            }
            
            .message-text p {
              font-size: 0.9rem;
              line-height: 1.3;
            }
            
            .message-text blockquote {
              font-size: 1rem;
            }
            
            .ceo-signature .ceo-name {
              font-size: 1.1rem;
            }
            
            .ceo-signature .ceo-position {
              font-size: 0.9rem;
            }
            
            .ceo-image {
              max-height: 800px;
              max-width: 450px;
            }
            
            .ceo-image-container {
              position: absolute;
              right: 2vw;
              bottom: 0;
              height: 100%;
              display: flex;
              transform: translateY(-5%);
            }
            
            .scroll-down-indicator {
              right: 1.2vw;
            }
            
            .scroll-down-indicator svg {
              width: 24px;
              height: 36px;
            }
          }
          
          @media (max-width: 1200px) {
            .message-section {
              min-height: 650px;
            }
            
            .message-content {
              max-width: 55%;
              width: 55%;
              padding: 18px 20px;
              font-size: 0.7rem;
              min-height: 320px;
            }
            
            .message-text p {
              font-size: 0.7rem;
              line-height: 1.3;
            }
            
            .message-text blockquote {
              font-size: 0.8rem;
            }
            
            .ceo-signature .ceo-name {
              font-size: 0.85rem;
            }
            
            .ceo-signature .ceo-position {
              font-size: 0.75rem;
            }
            
            .ceo-image {
              max-height: 800px;
              max-width: 430px;
            }
            
            .ceo-image-container {
              height: 100%;
              right: 5vw;
              width: 35%;
            }
            
            .scroll-down-indicator {
              right: 1vw;
            }
            
            .scroll-down-indicator svg {
              width: 20px;
              height: 30px;
            }
          }
          
          @media (max-width: 1024px) {
            .message-section {
              min-height: 650px;
              padding: 30px 15px;
              display: flex;
              align-items: center;
              justify-content: flex-start;
            }
            
            .message-content {
              max-width: 55%;
              width: 55%;
              margin-left: 2vw;
              padding: 20px 18px;
              font-size: 0.7rem;
              background: rgba(255,255,255,0.1);
              backdrop-filter: blur(12px) saturate(160%);
              -webkit-backdrop-filter: blur(12px) saturate(160%);
              border: 1px solid rgba(255,255,255,0.15);
              border-radius: 15px;
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
              max-height: 450px; /* Giảm chiều cao */
              overflow-y: auto;
              padding-right: 8px;
              text-align: justify;
              font-size: 0.85rem;
            }
            
            /* Custom scrollbar for message text */
            .message-text::-webkit-scrollbar {
              width: 2px;
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
              right: 3vw;
              top: 47%;
              transform: translateY(-50%);
              height: 110%;
              width: 60%;
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1;
            }
            
            .scroll-down-indicator {
              right: 0.5vw;
            }
            
            .scroll-down-indicator svg {
              width: 16px;
              height: 24px;
            }
            
            .ceo-image {
              max-height: 120%;
              max-width: 110%;
              width: auto;
              object-fit: contain;
              object-position: center;
            }
            
            .section-title {
              font-size: 1.5rem;
              margin-bottom: 1rem;
              padding-bottom: 1rem;
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
              font-size: 0.7rem;
            }
            
            .message-text blockquote {
              font-size: 0.8rem;
              padding: 8px 10px;
              margin: 8px 0;
              color: #0d6efd;
            }
            
            .ceo-signature .ceo-name {
              font-size: 0.8rem;
            }
            
            .ceo-signature .ceo-position {
              font-size: 0.65rem;
            }
          }
          
          @media (max-width: 768px) {
            .message-section {
              min-height: 500px;
              padding: 30px 15px;
              display: flex;
              align-items: center;
              justify-content: flex-start;
            }
            
            .message-content {
              max-width: 60%;
              width: 65%;
              margin-left: 2vw;
              padding: 10px 8px;
              font-size: 0.7rem;
              background: rgba(255,255,255,0.1);
              backdrop-filter: blur(12px) saturate(160%);
              -webkit-backdrop-filter: blur(12px) saturate(160%);
              border: 1px solid rgba(255,255,255,0.15);
              border-radius: 15px;
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
              max-height: 350px; /* Giảm chiều cao */
              overflow-y: auto;
              padding-right: 8px;
              text-align: left;
              font-size: 0.45rem;
              line-height: 1.4;
              letter-spacing: normal;
              word-spacing: normal;
              overflow-wrap: break-word;
              word-break: break-word;
              hyphens: auto;
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
              right: 3vw;
              top: 47%;
              transform: translateY(-50%);
              height: 80%;
              width: 40%;
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1;
            }
            
            .scroll-down-indicator {
              right: 0.5vw;
            }
            
            .scroll-down-indicator svg {
              width: 16px;
              height: 24px;
            }
            
            .ceo-image {
              max-height: 100%;
              max-width: 100%;
              width: auto;
              object-fit: contain;
              object-position: center;
            }
            
            .section-title {
              font-size: 1rem !important;
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
              line-height: 1.35;
              text-align: left;
              font-size: 0.65rem;
              letter-spacing: normal;
              word-spacing: normal;
              overflow-wrap: break-word;
              word-break: break-word;
              hyphens: auto;
            }
            
            .message-text blockquote {
              font-size: 0.65rem;
              padding: 5px 8px;
              margin: 5px 0;
              color: #0d6efd;
              text-align: left;
              letter-spacing: normal;
              word-spacing: normal;
              overflow-wrap: break-word;
              word-break: break-word;
              border-left: 2px solid #0d6efd;
              hyphens: auto;
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
              min-height: 350px;
              padding: 20px 10px;
              display: flex;
              align-items: center;
            }
            
            .message-content {
              width: 55%;
              max-width: 60%;
              margin-left: 2vw;
              padding: 10px 8px;
              font-size: 0.6rem;
              background: rgba(255,255,255,0.08);
              backdrop-filter: blur(5px) saturate(150%);
              -webkit-backdrop-filter: blur(5px) saturate(150%);
              border: 1px solid rgba(255,255,255,0.12);
              border-radius: 12px;
              box-sizing: border-box;
              min-height: 280px;
              z-index: 10;
            }
            
            .message-text {
              max-height: 200px;
              overflow-y: auto;
              line-height: 1.3;
              text-align: left;
              font-size: 0.62rem;
              letter-spacing: normal;
              word-spacing: normal;
              hyphens: auto;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            
            .ceo-image-container {
              right: 2vw;
              width: 55%;
              height: 90%;
              max-width: 42%;
              z-index: 1;
            }
            
            .scroll-down-indicator {
              right: 0.3vw;
            }
            
            .scroll-down-indicator svg {
              width: 14px;
              height: 21px;
            }
            
            .ceo-image {
              max-height: 100%;
              max-width: 100%;
              object-fit: contain;
              object-position: center;
            }
            
            .section-title {
              font-size: 0.65rem !important;
              margin-bottom: 0.1rem;
              padding-bottom: 0.1rem;
            }
            
            .section-title span {
              width: 25px;
              height: 2px;
            }
            
            .message-text p {
              margin-bottom: 0.2rem;
              line-height: 1.25;
              font-size: 0.5rem;
              text-align: left;
              letter-spacing: normal;
              word-spacing: normal;
              hyphens: auto;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            
            .message-text blockquote {
              font-size: 0.4rem;
              padding: 4px 6px;
              margin: 8px 0;
              text-align: left;
              letter-spacing: normal;
              word-spacing: normal;
              hyphens: auto;
              overflow-wrap: break-word;
              word-break: break-word;
              border-left: 2px solid #0d6efd;
              background: rgba(13, 110, 253, 0.05);
            }
            
            .ceo-signature .ceo-name {
              font-size: 0.48rem;
            }
            
            .ceo-signature .ceo-position {
              font-size: 0.38rem;
            }
          }
          
          @media (max-width: 480px) {
            .message-section {
              min-height: 300px;
              padding: 15px 8px;
              display: flex;
              align-items: center;
            }
            
            .message-content {
              width: 55%;
              max-width: 60%;
              margin-left: 2vw;
              padding: 8px 6px;
              font-size: 0.5rem;
              background: rgba(255,255,255,0.08);
              backdrop-filter: blur(5px) saturate(150%);
              -webkit-backdrop-filter: blur(5px) saturate(150%);
              border: 1px solid rgba(255,255,255,0.12);
              border-radius: 12px;
              box-sizing: border-box;
              min-height: 280px;
              z-index: 10;
            }
            
            .message-text {
              max-height: 200px;
              overflow-y: auto;
              line-height: 1.2;
              text-align: left;
              font-size: 0.52rem;
              letter-spacing: normal;
              word-spacing: normal;
              hyphens: auto;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            
            .ceo-image-container {
              right: 3vw;
              width: 55%;
              height: 90%;
              max-width: 40%;
              z-index: 1;
            }
            
            .scroll-down-indicator {
              right: 0.3vw;
            }
            
            .scroll-down-indicator svg {
              width: 12px;
              height: 18px;
            }
            
            .ceo-image {
              max-height: 100%;
              max-width: 100%;
              object-fit: contain;
              object-position: center;
            }
            
            .section-title {
              font-size: 0.6rem !important;
              margin-bottom: 0.2rem;
              padding-bottom: 0.15rem;
            }
            
            .section-title span {
              width: 25px;
              height: 2px;
            }
            
            .message-text p {
              margin-bottom: 0.2rem;
              line-height: 1.2;
              font-size: 0.45rem;
              text-align: left;
              letter-spacing: normal;
              word-spacing: normal;
              hyphens: auto;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            
            .message-text blockquote {
              font-size: 0.35rem;
              padding: 4px 6px;
              margin: 6px 0;
              text-align: left;
              letter-spacing: normal;
              word-spacing: normal;
              hyphens: auto;
              overflow-wrap: break-word;
              word-break: break-word;
              border-left: 2px solid #0d6efd;
              background: rgba(13, 110, 253, 0.05);
            }
            
            .ceo-signature .ceo-name {
              font-size: 0.45rem;
            }
            
            .ceo-signature .ceo-position {
              font-size: 0.35rem;
            }
          }
          
          @media (max-width: 350px) {
            .message-section {
              min-height: 150px;
              padding: 10px 10px;
              display: flex;
              align-items: center;
            }
            
            .message-content {
              width: 55%;
              max-width: 60%;
              margin-left: 1vw;
              padding: 5px 5px;
              font-size: 0.42rem;
              background: rgba(255,255,255,0.08);
              backdrop-filter: blur(5px) saturate(150%);
              -webkit-backdrop-filter: blur(5px) saturate(150%);
              border: 1px solid rgba(255,255,255,0.12);
              border-radius: 12px;
              box-sizing: border-box;
              min-height: 200px;
              z-index: 10;
            }
            
            .message-text {
              max-height: 150px;
              overflow-y: auto;
              line-height: 1;
              text-align: justify;
              font-size: 0.35rem;
            }
            
            .ceo-image-container {
              right: 1vw;
              width: 60%;
              height: 90%;
              max-width: 41%;
              z-index: 1;
            }
            
            .scroll-down-indicator {
              right: 0.2vw;
            }
            
            .scroll-down-indicator svg {
              width: 8px;
              height: 14px;
            }
            
            .ceo-image {
              max-height: 100%;
              max-width: 100%;
              object-fit: contain;
              object-position: center;
            }
            
            .section-title {
              font-size: 0.60rem;
              margin-bottom: 0.3rem;
              padding-bottom: 0.2rem;
            }
            /* Smaller title only for message section */
            .message-section .section-title {
              font-size: 0.40rem !important;
            }
            
            .section-title span {
              width: 25px;
              height: 2px;
            }
            
            .message-text p {
              margin-bottom: 0.2rem;
              line-height: 1.2;
              font-size: 0.35rem;
              text-align: justify;
            }
            
            .message-text blockquote {
              font-size: 0.25rem;
              padding: 4px 6px;
              margin: 4px 0;
              text-align: justify;
              border-left: 1px solid #0d6efd;
              background: rgba(13, 110, 253, 0.05);
            }
            
            .ceo-signature .ceo-name {
              font-size: 0.42rem;
            }
            
            .ceo-signature .ceo-position {
              font-size: 0.32rem;
            }
          }
        `}</style>
        <style jsx global>{`
          /* Ultimate font weight fix using IDs - highest specificity */
          #hero-title {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          #hero-content-text,
          #hero-content-text * {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          #hero-content-text p,
          #hero-content-text ul,
          #hero-content-text li {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            font-style: normal !important;
            font-stretch: normal !important;
            font-variant: normal !important;
            font-synthesis: none !important;
          }
          
          /* Force override any external CSS */
          body #hero-title,
          html body #hero-title {
            font-weight: 400 !important;
          }
          
          body #hero-content-text *,
          html body #hero-content-text * {
            font-weight: 400 !important;
          }
          
          /* Backup with class selectors */
          .hero-section div.hero-content.uniform-text ul li {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          .hero-section div.hero-content.uniform-text p {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          .hero-section div.hero-content.uniform-text h2 {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          /* Ensure header stays fixed on top */
          header {
            position: fixed !important;
            top: 0 !important;
            z-index: 1000 !important;
          }
          
          /* Fix mobile menu position */
          .navbar-toggler {
            position: relative !important;
            z-index: 1001 !important;
          }
          
          .mobile-menu-drawer {
            position: fixed !important;
            top: 0 !important;
            right: -100% !important;
            z-index: 1002 !important;
          }
          
          .mobile-menu-drawer.active {
            right: 0 !important;
          }
          
          /* Ensure body has proper top padding */
          body {
            padding-top: 80px !important;
          }
          
          @media (max-width: 768px) {
            body {
              padding-top: 70px !important;
            }
          }
          
          /* Force uniform font weight and color for hero content - All lighter */
          .hero-section .hero-content * {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          .hero-section .hero-content h2,
          .hero-section .hero-content p,
          .hero-section .hero-content li,
          .hero-section .hero-content ul,
          .hero-section .hero-content div {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          /* Extra specific rules to ensure bullet points have same weight */
          .hero-section .hero-content ul li {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          .hero-section .hero-content ul {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          /* Override any browser defaults */
          .hero-section .hero-content li::marker {
            color: #333 !important;
            font-weight: 400 !important;
          }
          
          /* Uniform text styling class - Most specific rules - All lighter */
          .hero-section .uniform-text,
          .hero-section .uniform-text *,
          .hero-section .uniform-text p,
          .hero-section .uniform-text li,
          .hero-section .uniform-text ul,
          .hero-section .uniform-text div,
          .hero-section .uniform-text h1,
          .hero-section .uniform-text h2,
          .hero-section .uniform-text h3,
          .hero-section .uniform-text h4,
          .hero-section .uniform-text h5,
          .hero-section .uniform-text h6 {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
          }
          
          /* Force consistency on all text elements - All lighter */
          .hero-section .uniform-text ul li,
          .hero-section .uniform-text p {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            font-style: normal !important;
            text-decoration: none !important;
          }
          
          /* Nuclear option - Force all text to have same lighter weight */
          .hero-section .hero-content *,
          .hero-section .hero-content *:before,
          .hero-section .hero-content *:after {
            font-weight: 400 !important;
          }
          
          .hero-section .hero-content ul,
          .hero-section .hero-content ul *,
          .hero-section .hero-content li,
          .hero-section .hero-content li *,
          .hero-section .hero-content p,
          .hero-section .hero-content p *,
          .hero-section .hero-content h1,
          .hero-section .hero-content h2,
          .hero-section .hero-content h3,
          .hero-section .hero-content h4,
          .hero-section .hero-content h5,
          .hero-section .hero-content h6,
          .hero-section .hero-content div {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          /* ULTIMATE OVERRIDE - Triệt để cho tất cả media queries */
          @media screen {
            .hero-section .hero-content *,
            .hero-section .hero-content h1,
            .hero-section .hero-content h2,
            .hero-section .hero-content h3,
            .hero-section .hero-content h4,
            .hero-section .hero-content h5,
            .hero-section .hero-content h6,
            .hero-section .hero-content p,
            .hero-section .hero-content li,
            .hero-section .hero-content ul,
            .hero-section .hero-content div,
            .hero-section .hero-content span {
              font-weight: 400 !important;
              color: #333 !important;
              font-family: "Inter", sans-serif !important;
            }
          }
          
          /* ULTRA NUCLEAR OPTION - Force with highest specificity possible */
          html body .hero-section .hero-content *,
          html body .hero-section .hero-content h1,
          html body .hero-section .hero-content h2,
          html body .hero-section .hero-content h3,
          html body .hero-section .hero-content h4,
          html body .hero-section .hero-content h5,
          html body .hero-section .hero-content h6,
          html body .hero-section .hero-content p,
          html body .hero-section .hero-content li,
          html body .hero-section .hero-content ul,
          html body .hero-section .hero-content ol,
          html body .hero-section .hero-content div,
          html body .hero-section .hero-content span,
          html body .hero-section .hero-content strong,
          html body .hero-section .hero-content b,
          html body .hero-section .hero-content em,
          html body .hero-section .hero-content i {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            font-style: normal !important;
            font-variation-settings: "wght" 400 !important;
          }
          
          /* Force override even on pseudo elements */
          html body .hero-section .hero-content *::before,
          html body .hero-section .hero-content *::after {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          /* Target specific typography classes for visual consistency */
          .uniform-typography-ul,
          .uniform-typography-ul * {
            font-weight: 500 !important; /* Medium weight for lists */
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            font-style: normal !important;
            font-variant: normal !important;
            font-stretch: normal !important;
            letter-spacing: 0.2px !important;
            text-shadow: 0 0 0.5px rgba(51, 51, 51, 0.1) !important;
          }
          
          .uniform-typography-li,
          .uniform-typography-li * {
            font-weight: 500 !important; /* Medium weight for list items */
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            font-style: normal !important;
            font-variant: normal !important;
            font-stretch: normal !important;
            letter-spacing: 0.2px !important;
            text-shadow: 0 0 0.5px rgba(51, 51, 51, 0.1) !important;
          }
          
          .uniform-typography-p,
          .uniform-typography-p * {
            font-weight: 400 !important; /* Normal weight for paragraphs */
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            font-style: normal !important;
            font-variant: normal !important;
            font-stretch: normal !important;
            font-variation-settings: "wght" 400 !important;
          }
          
          /* Force list elements specifically - medium weight with visual enhancements */
          html body .hero-section .hero-content ul.uniform-typography-ul li.uniform-typography-li {
            font-weight: 500 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            letter-spacing: 0.2px !important;
            text-shadow: 0 0 0.5px rgba(51, 51, 51, 0.1) !important;
          }
          
          /* Force paragraph elements specifically - normal weight */
          html body .hero-section .hero-content p.uniform-typography-p {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            font-variation-settings: "wght" 400 !important;
          }
          
          /* Override browser user agent styles */
          .hero-section .hero-content ul li {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            font-variation-settings: "wght" 400 !important;
          }
          
          .hero-section .hero-content p {
            font-weight: 400 !important;
            color: #333 !important;
            font-family: "Inter", sans-serif !important;
            font-variation-settings: "wght" 400 !important;
          }
          
          /* Adjust hero section positioning for mobile */
          @media (max-width: 768px) {
            .hero-section {
              margin-top: -70px !important;
              padding-top: 70px !important;
            }
          }
          
          /* Fix milestones section font consistency */
          .milestones-section .milestone-description h5,
          .milestones-section .milestone-description p,
          .timeline-year {
            font-family: "Inter", sans-serif !important;
          }
          
          .milestone-description h5 {
            font-weight: 500 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          .slick-center .milestone-description h5 {
            font-weight: 500 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          .milestone-description p {
            font-weight: 400 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          .slick-center .milestone-description p {
            font-weight: 500 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          .timeline-year {
            font-weight: 500 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          /* Fix message section font consistency */
          .message-section .message-text p,
          .message-section .message-text blockquote {
            font-family: "Inter", sans-serif !important;
          }
          
          .message-text p {
            font-weight: 400 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          .message-text blockquote {
            font-weight: 500 !important;
            font-family: "Inter", sans-serif !important;
          }
          
          /* Keep CEO name and position as original styling */
          .ceo-signature .ceo-name {
            /* Keep original font-weight and styling */
          }
          
          .ceo-signature .ceo-position {
            /* Keep original font-weight and styling */
          }

          /* Van Large Desktop - 2000x600 */
          @media (max-width: 2000px) {
            .hero-section .hero-content {
              max-width: 90% !important;
              margin-top: 200px !important;
              padding-left: 10px !important;
              padding-right: 10px !important;
            }
            .hero-section .hero-content h2 {
              font-size: 80px !important;
              margin-bottom: 25px !important;
              font-weight: 400 !important;
              line-height: 1.3 !important;
              letter-spacing: 0.5px !important;
            }
            .hero-section .hero-content p {
              font-size: 26px !important;
              line-height: 1.3 !important;
              margin-bottom: 16px !important;
              font-weight: 400 !important;
            }
            .hero-section .hero-content ul li {
              font-size: 26px !important;
              line-height: 1.3 !important;
              margin-bottom: 12px !important;
              font-weight: 400 !important;
            }
          }

          /* Van Desktop - 1535x600 */
          @media (max-width: 1535px) {
            .hero-section .hero-content {
              max-width: 1300px !important;
              margin-top: 200px !important;
              padding-left: 50px !important;
              padding-right: 50px !important;
            }
            .hero-section .hero-content h2 {
              font-size: 52px !important;
              margin-bottom: 26px !important;
              font-weight: 400 !important;
              line-height: 1.3 !important;
              letter-spacing: 0.4px !important;
            }
            .hero-section .hero-content p {
              font-size: 23px !important;
              line-height: 1.3 !important;
              margin-bottom: 15px !important;
              font-weight: 400 !important;
            }
            .hero-section .hero-content ul li {
              font-size: 23px !important;
              line-height: 1.3 !important;
              margin-bottom: 11px !important;
              font-weight: 400 !important;
            }
          }

          /* Van Desktop small - 1279x600 */
          @media (max-width: 1279px) {
            .hero-section .hero-content {
              max-width: 1200px !important;
              margin-top: 170px !important;
              padding-left: 50px !important;
              padding-right: 50px !important;
            }
            .hero-section .hero-content h2 {
              font-size: 48px !important;
              margin-bottom: 24px !important;
              font-weight: 400 !important;
              line-height: 1.3 !important;
              letter-spacing: 0.3px !important;
            }
            .hero-section .hero-content p {
              font-size: 20px !important;
              line-height: 1.3 !important;
              margin-bottom: 14px !important;
              font-weight: 400 !important;
            }
            .hero-section .hero-content ul li {
              font-size: 20px !important;
              line-height: 1.3 !important;
              margin-bottom: 10px !important;
              font-weight: 400 !important;
            }
          }

          @media (max-width: 1024px) {
            .hero-section .hero-content {
              max-width: 1200px !important;
              margin-top: 80px !important;
              padding-left: 30px !important;
              padding-right: 30px !important;
            }
            .hero-section .hero-content h2 {
              font-size: 42px !important;
              margin-bottom: 20px !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
            .hero-section .hero-content div {
              font-size: 20px !important;
              line-height: 1.3 !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
            .hero-section .hero-content ul li {
              font-size: 18px !important;
              line-height: 1.3 !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
            .hero-section .hero-content p {
              font-size: 18px !important;
              line-height: 1.3 !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
          }
          
          @media (max-width: 768px) {
            .hero-section .hero-content {
              max-width: 90% !important;
              margin-top: 120px !important;
              padding-left: 20px !important;
              padding-right: 20px !important;
            }
            .hero-section .hero-content h2 {
              font-size: 26px !important;
              margin-bottom: 12px !important;
              letter-spacing: 0.2px !important;
              font-weight: 500 !important;
              color: #333 !important;
              line-height: 1.3 !important;
            }
            .hero-section .hero-content div {
              font-size: 17px !important;
              line-height: 1.4 !important;
              font-weight: 500 !important;
              color: #333 !important;
              letter-spacing: 0.1px !important;
            }
            .hero-section .hero-content ul li {
              font-size: 17px !important;
              font-weight: 500 !important;
              color: #333 !important;
              margin-bottom: 5px !important;
              letter-spacing: 0.1px !important;
              line-height: 1.3 !important;
            }
            .hero-section .hero-content p {
              font-size: 17px !important;
              font-weight: 500 !important;
              color: #333 !important;
              line-height: 1.4 !important;
              margin-bottom: 8px !important;
              letter-spacing: 0.1px !important;
            }
            .section-title {
              font-size: 2rem !important;
            }
          }
          
          @media (max-width: 639px) {
            .hero-section .hero-content {
              max-width: 90% !important;
              margin-top: 120px !important;
              padding-left: 20px !important;
              padding-right: 20px !important;
            }
            .hero-section .hero-content h2 {
              font-size: 22px !important;
              margin-bottom: 10px !important;
              letter-spacing: normal !important;
              font-weight: 500 !important;
              color: #333 !important;
              line-height: 1.2 !important;
            }
            .hero-section .hero-content div {
              font-size: 16px !important;
              line-height: 1.3 !important;
              font-weight: 500 !important;
              color: #333 !important;
              letter-spacing: normal !important;
            }
            .hero-section .hero-content ul li {
              font-size: 15px !important;
              font-weight: 500 !important;
              color: #333 !important;
              margin-bottom: 5px !important;
              letter-spacing: 0.1px !important;
              line-height: 1.3 !important;
            }
            .hero-section .hero-content p {
              font-size: 15px !important;
              font-weight: 500 !important;
              color: #333 !important;
              line-height: 1.4 !important;
              margin-bottom: 8px !important;
              letter-spacing: 0.1px !important;
            }
            .section-title {
              font-size: 1.7rem !important;
            }
            .hero-section .hero-content ul {
              margin-bottom: 10px !important;
            }
            .hero-section .hero-content ul li:last-child {
              margin-bottom: 10px !important;
            }
          }

          /* Mobile nhỏ 481px-600px */
          @media (max-width: 480px) {
            .hero-section .hero-content {
              margin-top: 100px !important;
              padding-left: 22px !important;
              padding-right: 22px !important;
            }
            .hero-section .hero-content h2 {
              font-size: 20px !important;
              margin-bottom: 8px !important;
              line-height: 1.2 !important;
              font-weight: 500 !important;
              color: #333 !important;
              letter-spacing: 0.1px !important;
            }
            .hero-section .hero-content div {
              font-size: 15px !important;
              line-height: 1.3 !important;
              font-weight: 500 !important;
              color: #333 !important;
              letter-spacing: 0.1px !important;
            }
            .hero-section .hero-content ul li {
              font-size: 13px !important;
              line-height: 1.3 !important;
              margin-bottom: 5px !important;
              font-weight: 500 !important;
              color: #333 !important;
              letter-spacing: 0.1px !important;
            }
            .hero-section .hero-content p {
              font-size: 13px !important;
              line-height: 1.3 !important;
              margin-bottom: 6px !important;
              font-weight: 500 !important;
              color: #333 !important;
              letter-spacing: 0.1px !important;
            }
            .section-title {
              font-size: 1.5rem !important;
            }
          }

          @media (max-width: 350px) {
            .hero-section .hero-content {
              margin-top: 80px !important;
              padding-left: 20px !important;
              padding-right: 20px !important;
            }
            .hero-section .hero-content h2 {
              font-size: 20px !important;
              margin-bottom: 20px !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
            .hero-section .hero-content div {
              font-size: 10px !important;
              line-height: 1.5 !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
            .hero-section .hero-content ul li {
              font-size: 10px !important;
              line-height: 1.3 !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
            .hero-section .hero-content p {
              font-size: 11px !important;
              line-height: 1.3 !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
          }

          @media (max-width: 320px) {
            .hero-section .hero-content {
              margin-top: 70px !important;
              padding-left: 20px !important;
              padding-right: 20px !important;
            }
            .hero-section .hero-content h2 {
              font-size: 42px !important;
              margin-bottom: 20px !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
            .hero-section .hero-content div {
              font-size: 20px !important;
              line-height: 1.5 !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
            .hero-section .hero-content ul li {
              font-size: 9px !important;
              line-height: 1.3 !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
            .hero-section .hero-content p {
              font-size: 10px !important;
              line-height: 1.3 !important;
              font-weight: 400 !important;
              color: #333 !important;
            }
          }

          /* Responsive Background Styles */
          /* Hero Section Background Responsive */
          @media (max-width: 2000px) {
            .hero-section .overview-banner-img {
              object-fit: cover !important;
              object-position: center center !important;
            }
            .message-section {
              background-size: cover !important;
              background-position: center center !important;
              background-attachment: scroll !important;
            }
          }

          @media (max-width: 1600px) {
            .hero-section .overview-banner-img {
              object-fit: cover !important;
              object-position: center center !important;
            }
            .message-section {
              background-size: cover !important;
              background-position: center center !important;
              background-attachment: scroll !important;
            }
          }

          @media (max-width: 1200px) {
            .hero-section .overview-banner-img {
              object-fit: cover !important;
              object-position: center center !important;
            }
            .message-section {
              background-size: cover !important;
              background-position: center center !important;
              background-attachment: scroll !important;
              min-height: 700px !important;
            }
          }

          @media (max-width: 992px) {
            .hero-section .overview-banner-img {
              object-fit: cover !important;
              object-position: center center !important;
            }
            .message-section {
              background-size: cover !important;
              background-position: center center !important;
              background-attachment: scroll !important;
              min-height: 600px !important;
            }
          }

          @media (max-width: 768px) {
            .hero-section .overview-banner-img {
              object-fit: cover !important;
              object-position: center center !important;
            }
            .message-section {
              background-size: cover !important;
              background-position: center center !important;
              background-attachment: scroll !important;
              min-height: 500px !important;
            }
          }

          @media (max-width: 600px) {
            .hero-section .overview-banner-img {
              object-fit: cover !important;
              object-position: center center !important;
            }
            .message-section {
              background-size: cover !important;
              background-position: center center !important;
              background-attachment: scroll !important;
              min-height: 400px !important;
            }
          }

          @media (max-width: 480px) {
            .hero-section .overview-banner-img {
              object-fit: cover !important;
              object-position: center center !important;
            }
            .message-section {
              background-size: cover !important;
              background-position: center center !important;
              background-attachment: scroll !important;
              min-height: 350px !important;
            }
          }

          @media (max-width: 350px) {
            .hero-section .overview-banner-img {
              object-fit: cover !important;
              object-position: center center !important;
            }
            .message-section {
              background-size: cover !important;
              background-position: center center !important;
              background-attachment: scroll !important;
              min-height: 300px !important;
            }
          }

          @media (max-width: 320px) {
            .hero-section .overview-banner-img {
              object-fit: cover !important;
              object-position: center center !important;
            }
            .message-section {
              background-size: cover !important;
              background-position: center center !important;
              background-attachment: scroll !important;
              min-height: 250px !important;
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
                  <h2 className="section-title ">{overviewData.visionMission.vision.title}</h2>
                  <p>{overviewData.visionMission.vision.content}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mission-box">
                  <i className={overviewData.visionMission.mission.icon}></i>
                  <h2 className="section-title ">{overviewData.visionMission.mission.title}</h2>
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
            font-weight: 500;
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
            font-weight: 500;
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

interface ResponsiveImgProps {
  srcs: any;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  style?: React.CSSProperties;
}

function ResponsiveImg({ srcs, alt, className, width, height, sizes, style }: ResponsiveImgProps) {
  if (!srcs) {
    console.warn(`No image sources provided for: ${alt}`);
    return null;
  }
  try {
    const getBestImageUrl = () => {
      if (width && width <= 300) {
        return srcs.thumbnail || srcs.medium || srcs.low || srcs.webp || srcs.origin;
      } else if (width && width <= 800) {
        return srcs.medium || srcs.low || srcs.webp || srcs.origin;
      } else if (width && width <= 1200) {
        return srcs.low || srcs.webp || srcs.origin;
      } else {
        return srcs.webp || srcs.origin;
      }
    };
    const imgSrc = getBestImageUrl() || '';
    const isValidUrl = imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('/'));
    if (!isValidUrl) {
      console.error(`Invalid image URL for ${alt}:`, imgSrc);
      return null;
    }
    const srcSet = (() => {
      const sets = [];
      if (srcs.thumbnail) sets.push(`${srcs.thumbnail} 300w`);
      if (srcs.medium) sets.push(`${srcs.medium} 800w`);
      if (srcs.low) sets.push(`${srcs.low} 1200w`);
      if (srcs.webp) sets.push(`${srcs.webp} 1920w`);
      return sets.length > 0 ? sets.join(', ') : undefined;
    })();
    const defaultSizes = "(max-width: 300px) 300px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1920px";
    return (
      <img
        src={imgSrc}
        srcSet={srcSet}
        sizes={sizes || defaultSizes}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        style={style}
        onError={(e) => {
          if (srcs.origin && srcs.origin !== imgSrc) {
            (e.target as HTMLImageElement).src = srcs.origin;
          }
        }}
      />
    );
  } catch (error) {
    console.error(`Error rendering image ${alt}:`, error);
    return null;
  }
}
