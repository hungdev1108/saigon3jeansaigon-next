"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import useClientScript from "../../app/hooks/useClientScript";
import { BACKEND_DOMAIN } from "../../api/config";
import ClientOnly from "../ClientOnly";
import { getOptimizedImageUrls } from "../../shared/imageUtils";
import Link from "next/link";

// Type definitions
interface HeroData {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  videoUrl: string;
  isActive: boolean;
  aiBannerImage?: string;
}

interface SectionData {
  title: string;
  content: string;
  mediaType: string;
  mediaUrl: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  order: number;
}

interface CustomerData {
  name: string;
  logo: string;
  website: string;
  order: number;
}

interface CertificationData {
  name: string;
  description: string;
  image: string;
  category: string;
  order: number;
  issuedDate?: string | null;
}

interface NewsData {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  publishDate: string;
  slug: string;
  tags: string[];
  author: string;
}

interface HomeData {
  hero: HeroData;
  sections: SectionData[];
  customers: {
    denimWoven: CustomerData[];
    knit: CustomerData[];
  };
  certifications: CertificationData[];
  featuredNews: NewsData[];
  regularNews: NewsData[];
}

interface HomeProps {
  homeData: HomeData | null;
}

interface ResponsiveImgProps {
  srcs: {
    origin?: string;
    webp?: string;
    medium?: string;
    thumbnail?: string;
  };
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  style?: React.CSSProperties;
}

// Helper để render ảnh tối ưu responsive (dùng <img> thường nếu cần srcSet)
/**
 * ResponsiveImg - Component để hiển thị hình ảnh tối ưu cho từng kích thước màn hình
 * 
 * Cách sử dụng:
 * <ResponsiveImg 
 *   srcs={getOptimizedImageUrls(image)} 
 *   alt="Mô tả hình ảnh" 
 *   width={400} 
 *   height={300} 
 *   className="your-class" 
 * />
 */
function ResponsiveImg({ srcs, alt, className, width, height, sizes, style }: ResponsiveImgProps) {
  // Kiểm tra nếu không có srcs
  if (!srcs) {
    console.warn(`No image sources provided for: ${alt}`);
    return null;
  }
  
  try {
    // Chọn ảnh phù hợp nhất dựa trên kích thước và độ phân giải
    const getBestImageUrl = () => {
      // Nếu có kích thước cụ thể, chọn ảnh phù hợp
      if (width && width <= 300) {
        // Ưu tiên thumbnail cho kích thước nhỏ
        return srcs.thumbnail || srcs.medium || srcs.webp || srcs.origin;
      } else if (width && width <= 800) {
        // Ưu tiên medium cho kích thước trung bình
        return srcs.medium || srcs.webp || srcs.origin;
      } else {
        // Ưu tiên webp cho kích thước lớn
        return srcs.webp || srcs.origin;
      }
    };
    
    // Lấy URL ảnh tốt nhất
    const imgSrc = getBestImageUrl() || '';
    
    // Kiểm tra xem URL có hợp lệ không
    const isValidUrl = imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('/'));
    
    if (!isValidUrl) {
      console.error(`Invalid image URL for ${alt}:`, imgSrc);
      return null;
    }
    
    // Tạo srcSet chỉ khi có đủ các phiên bản
    const srcSet = (() => {
      // Nếu có đủ các phiên bản, tạo srcSet
      if (srcs.thumbnail && srcs.medium && srcs.webp) {
        return `${srcs.thumbnail} 300w, ${srcs.medium} 800w, ${srcs.webp} 1920w`;
      }
      // Nếu chỉ có một số phiên bản
      const sets = [];
      if (srcs.thumbnail) sets.push(`${srcs.thumbnail} 300w`);
      if (srcs.medium) sets.push(`${srcs.medium} 800w`);
      if (srcs.webp) sets.push(`${srcs.webp} 1920w`);
      
      return sets.length > 0 ? sets.join(', ') : undefined;
    })();
    
    // Chuẩn bị sizes attribute nếu không được cung cấp
    const defaultSizes = "(max-width: 300px) 300px, (max-width: 800px) 800px, 1920px";
    
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
          console.error(`Failed to load image: ${imgSrc}`);
          // Fallback to origin if available and different from current src
          if (srcs.origin && srcs.origin !== imgSrc) {
            console.log(`Falling back to origin: ${srcs.origin}`);
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

export default function Home({ homeData }: HomeProps) {
  useClientScript();
  
  // Sử dụng useState để lưu trữ dữ liệu
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch dữ liệu từ API nếu không có homeData từ props
  useEffect(() => {
    if (homeData) {
      setData(homeData);
      setLoading(false);
    } else {
      const fetchData = async () => {
        try {
          // Gọi API để lấy dữ liệu trang chủ
          const response = await fetch(`${BACKEND_DOMAIN}/api/home/data`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          if (result.success) {
            setData(result.data);
          } else {
            setError("Không thể tải dữ liệu trang chủ");
          }
        } catch (err) {
          console.error("Error fetching home data:", err);
          setError("Lỗi khi tải dữ liệu trang chủ");
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
    
    // Thêm class loaded vào body
    if (typeof window !== "undefined") {
      document.body.classList.add("loaded");
    }
    return () => {
      document.body.classList.remove("loaded");
    };
  }, [homeData]);

  // Nếu đang tải dữ liệu
  if (loading) {
    return (
      <div className="alert alert-info m-3" role="alert">
        Đang tải dữ liệu trang chủ...
      </div>
    );
  }
  
  // Nếu có lỗi
  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }
  
  // Nếu không có dữ liệu
  if (!data) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        Không có dữ liệu trang chủ
      </div>
    );
  }

  const { hero, sections, customers, certifications, featuredNews, regularNews } = data;

  // Function to get customer slider settings
  const getCustomerSliderSettings = () => ({
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerMode: false,
    centerPadding: "0px",
    variableWidth: false,
    swipeToSlide: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          centerMode: false,
          centerPadding: "0px",
          autoplay: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          arrows: false,
          centerMode: false,
          centerPadding: "0px",
          autoplay: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          infinite: true,
          centerMode: false,
          centerPadding: "0px",
          autoplay: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          infinite: true,
          centerMode: false,
          centerPadding: "0px",
          autoplay: true,
        },
      },
    ],
  });

  return (
    <ClientOnly>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="video-container">
          {hero?.videoUrl ? (
            <video 
              src={`${BACKEND_DOMAIN}${hero.videoUrl}`}
              autoPlay
              muted
              loop
              playsInline
              className="w-100 h-100 object-fit-cover"
            />
          ) : (
            // fallback giữ nguyên
            <ResponsiveImg
              srcs={getOptimizedImageUrls(hero?.backgroundImage || "/images/home_banner-section2.jpg")}
              alt="Factory Aerial View"
              className="img-fluid w-100"
              width={1920}
              height={1080}
              sizes="100vw"
            />
          )}
          <div className="overlay"></div>
        </div>
        <div className="text-overlay">
          <h1>{hero?.title || "WELCOME TO SAIGON 3 JEAN"}</h1>
          {hero?.subtitle && (
            <p className="hero-subtitle mt-3">{hero.subtitle}</p>
          )}
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <div className="arrow-down"></div>
        </div>
      </section>
      {/* Info Cards Section */}
      <section className="info-cards py-5">
        <div className="container">
          <div className="row">
            {sections &&
              sections.map((section: SectionData, index: number) => (
                <div
                  key={index}
                  className={`${index === 0 ? "col-md-6" : "col-md-3"} mb-4`}
                >
                  <div className="card h-100">
                    <div className="card-img-top video-container">
                      {section.mediaType === "video" ? (
                        <video className="w-100" muted loop controls autoPlay>
                          <source
                            src={
                              section.mediaUrl
                                ? `${BACKEND_DOMAIN}${section.mediaUrl}`
                                : "/videos/STORY_SG3J.mp4"
                            }
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        (() => {
                          const img = getOptimizedImageUrls(section.mediaUrl || "");
                          return (
                            <ResponsiveImg
                              srcs={img}
                              alt={section.title}
                              className="img-fluid w-100"
                              width={800}
                              height={600}
                              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          );
                        })()
                      )}
                    </div>
                    <div
                      className="card-body text-white"
                      style={{
                        backgroundColor:
                          index === 0
                            ? "#1e4f7a"
                            : index === 1
                            ? "#0e441c"
                            : index === 2
                            ? "#935b19"
                            : "",
                      }}
                    >
                      <h5 className="card-title">{section.title}</h5>
                      <p className="card-text">{section.content}</p>
                      <a
                        href={section.buttonLink}
                        className="btn btn-outline-light"
                        id={
                          section.buttonText === "WATCH VIDEO"
                            ? "watchVideoBtn"
                            : undefined
                        }
                      >
                        {section.buttonText}
                        {section.buttonText === "WATCH VIDEO" && (
                          <span style={{ marginLeft: 8 }}>
                            <i className="fas fa-play-circle"></i>
                          </span>
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      {/* Video Modal Popup */}
      <div className="video-modal" id="videoModal">
        <div className="video-modal-content">
          <div className="video-modal-body">
            <button className="video-modal-close" id="closeVideoModal">
              <i className="fas fa-times"></i>
            </button>
            <video id="videoPlayer" controls>
              <source src="/videos/STORY_SG3J.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      {/* AI Integration Section */}
      <section className="ai-integration">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-12 position-relative ai-integration-banner">
              {(() => {
                // Sử dụng homeData.aiBannerImage đúng chuẩn
                const aiBannerImage = data?.hero?.aiBannerImage || null;
                
                // Sử dụng đúng đường dẫn cho ảnh AI Banner
                const aiImg = getOptimizedImageUrls(aiBannerImage || "/images/SectionAI.jpg");
                return (
                  <ResponsiveImg
                    srcs={aiImg}
                    alt="AI Banner"
                    className="img-fluid w-100"
                    width={1920}
                    height={1080}
                    sizes="(max-width: 600px) 100vw, 1920px"
                  />
                );
              })()}
              <div className="overlay"></div>
              <div className="ai-content text-center text-white">
                <h2 className="fw-bold">
                SMARTER FUTURE 
                WITH AI AND AUTOMATION
                </h2>
                <a
                  href="/automation"
                  className="btn btn-outline-light px-4 mt-3"
                >
                  LEARN MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Divider Line Section */}
      <section className="divider-section pb-4">
        <div className="container">
          <hr
            className="divider"
            style={{
              borderTop: "2px solid rgba(0, 0, 0, 0.3)",
              margin: "2rem auto",
            }}
          />
        </div>
      </section>
      {/* Factory View Section */}
      <section className="factory-view mb-4">
        <div className="container-fluid p-0">
          <video
            src="/videos/STORY_SG3J.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="img-fluid w-100"
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        </div>
      </section>
      {/* Our Customers Section */}
      <section className="customers py-5">
        <div className="container-fluid">
          <div className="customers-wrapper position-relative">
            {/* Background Image */}
            <div className="customers-background">
              <ResponsiveImg
                srcs={getOptimizedImageUrls("/images/branding_our_customer/back_ground.png")}
                alt="World Map"
                className="world-map-bg"
                width={1920}
                height={1080}
                sizes="100vw"
              />
            </div>

            {/* Content Overlay */}
            <div className="customers-content">
              <div className="container">
                <h2 className="section-title text-center mb-5">OUR CUSTOMER</h2>

                {/* DENIM & WOVEN Section */}
                <div className="customer-category mb-5">
                  <h4 className="text-center mb-4">DENIM & WOVEN</h4>
                  <div className="customer-slider-container">
                    {customers?.denimWoven &&
                    customers.denimWoven.length > 0 ? (
                      <Slider
                        {...getCustomerSliderSettings()}
                        className="customer-slider"
                      >
                        {customers.denimWoven.map(
                          (customer: CustomerData, index: number) => {
                            const logoImg = getOptimizedImageUrls(customer.logo || "");
                            return (
                              <div key={`denim-${index}`} className="px-2">
                                <div className="customer-logo-item">
                                  <ResponsiveImg
                                    srcs={logoImg}
                                    alt={customer.name}
                                    className="img-fluid customer-logo"
                                    width={200}
                                    height={120}
                                    sizes="(max-width: 600px) 100vw, 200px"
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      </Slider>
                    ) : (
                      <div className="text-center">
                        <p>No DENIM & WOVEN customers data available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* KNIT Section */}
                <div className="customer-category">
                  <h4 className="text-center mb-4">KNIT</h4>
                  <div className="customer-slider-container">
                    {customers?.knit && customers.knit.length > 0 ? (
                      <Slider
                        {...getCustomerSliderSettings()}
                        className="customer-slider"
                      >
                        {customers.knit.map(
                          (customer: CustomerData, index: number) => {
                            const logoImg = getOptimizedImageUrls(customer.logo || "");
                            return (
                              <div key={`knit-${index}`} className="px-2">
                                <div className="customer-logo-item">
                                  <ResponsiveImg
                                    srcs={logoImg}
                                    alt={customer.name}
                                    className="img-fluid customer-logo"
                                    width={200}
                                    height={120}
                                    sizes="(max-width: 600px) 100vw, 200px"
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      </Slider>
                    ) : (
                      <div className="text-center">
                        <p>No KNIT customers data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Certification Section */}
      <section className="certification py-5">
        <div className="container">
          <h2 className="section-title text-center mb-5">CERTIFICATION</h2>
          <div className="row">
            {/* Hiển thị LEED GOLD và ISO certifications từ API */}
            {certifications &&
              certifications.map((cert: CertificationData, index: number) => {
                const certImg = getOptimizedImageUrls(cert.image || "");
                // Xử lý hiển thị theo category
                if (cert.name === "LEED GOLD") {
                  return (
                    <div key={index} className="col-lg-4 mb-4">
                      <div className="cert-item leed-cert">
                        <ResponsiveImg
                          srcs={certImg}
                          alt={cert.name}
                          className="cert-image"
                          width={800}
                          height={600}
                          sizes="(max-width: 600px) 100vw, 800px"
                        />
                        <div className="leed-text-container">
                          <div className="leed-text-row">
                            <span className="leed-letter">L</span>EADERSHIP IN
                          </div>
                          <div className="leed-text-row">
                            <span className="leed-letter">E</span>NERGY &
                          </div>
                          <div className="leed-text-row">
                            <span className="leed-letter">E</span>NVIRONMENTAL
                          </div>
                          <div className="leed-text-row">
                            <span className="leed-letter">D</span>ESIGN
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (cert.name.includes("ISO")) {
                  return (
                    <div key={index} className="col-lg-4 mb-4">
                      <div className="cert-item iso-cert">
                        <ResponsiveImg
                          srcs={certImg}
                          alt={cert.name}
                          className="cert-image"
                          width={800}
                          height={600}
                          sizes="(max-width: 600px) 100vw, 800px"
                        />
                        <div className="iso-text-container">
                          <div className="iso-text-item">
                            {cert.name}
                            <br />
                            {cert.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

            {/* Hiển thị các certifications khác từ API */}
            <div className="col-lg-4 mb-4">
              <div className="cert-item">
                <div className="certifications-list">
                  {certifications &&
                    certifications
                      .filter(
                        (cert) =>
                          !cert.name.includes("LEED") &&
                          !cert.name.includes("ISO")
                      )
                      .map((cert: CertificationData, index: number) => {
                        const certImg = getOptimizedImageUrls(cert.image || "");
                        return (
                          <div key={index} className="cert-row">
                            <div
                              className={`cert-row-content ${cert.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}-cert`}
                            >
                              <div className="cert-icon">
                                <ResponsiveImg
                                  srcs={certImg}
                                  alt={cert.name}
                                  className="cert-small-image"
                                  width={800}
                                  height={600}
                                  sizes="(max-width: 600px) 100vw, 800px"
                                />
                              </div>
                              <div className="cert-text">
                                <div className="cert-title">{cert.description}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* News Section */}
      <section className="news py-5">
        <div className="container">
          <h2 className="section-title text-center">NEWS</h2>
          <div className="row mt-4 news-flex-row" style={{ display: 'flex', alignItems: 'stretch' }}>
            {/* Featured News - Hiển thị tin đầu tiên */}
            {featuredNews && featuredNews.length > 0 && (
              <div className="col-md-5 mb-4 news-item-container" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, height: '100%' }}>
                  <div className="news-item position-relative" style={{ height: '100%' }}>
                    <Link href={`/news/${featuredNews[0].slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {(() => {
                        const newsImg = getOptimizedImageUrls(featuredNews[0].image || "");
                        return (
                          <ResponsiveImg
                            srcs={newsImg}
                            alt={featuredNews[0].title}
                            className="img-fluid w-100"
                            width={800}
                            height={600}
                            sizes="(max-width: 600px) 100vw, 800px"
                          />
                        );
                      })()}
                      <div className="news-overlay">
                        <h5 className="text-white">{featuredNews[0].title}</h5>
                        <p className="text-white text-justify mb-3">
                          {featuredNews[0].excerpt}
                        </p>
                        <span className="btn btn-primary">
                          READ MORE
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {/* News List - Hiển thị các tin thường */}
            <div className="col-md-7 mb-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <div className="news-list" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '16px' }}>
                {regularNews && regularNews.length > 0 && regularNews.map((news: NewsData, index: number) => {
                  const newsImg = getOptimizedImageUrls(news.image || "");
                  return (
                    <div key={news.id || index} className="news-list-item" style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
                      <Link href={`/news/${news.slug}`} className="news-item-link" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                        <div className="news-item-content" style={{ display: 'flex', height: '100%' }}>
                          <div className="news-thumbnail">
                            <ResponsiveImg
                              srcs={newsImg}
                              alt={news.title}
                              className="img-fluid"
                              width={800}
                              height={600}
                              sizes="(max-width: 600px) 100vw, 800px"
                            />
                          </div>
                          <div className="news-info">
                            <h6 className="news-title">{news.title}</h6>
                            <p className="news-excerpt">{news.excerpt}</p>
                            <span className="news-date">
                              {new Date(news.publishDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
                {/* Fallback news nếu không có dữ liệu từ API giữ nguyên */}
                {(!regularNews || regularNews.length === 0) && (
                  <>
                    <div className="news-list-item mb-3">
                      <Link href="/news/saigon-3-jean-achieves-leed-gold-certification" className="news-item-link">
                        <div className="news-item-content">
                          <div className="news-thumbnail">
                            <Image
                              src="/images/news/post_1.jpg"
                              alt="News Thumbnail"
                              className="img-fluid"
                              width={1920}
                              height={1080}
                            />
                          </div>
                          <div className="news-info">
                            <h6 className="news-title">
                              SAIGON 3 JEAN ACHIEVES LEED GOLD CERTIFICATION FOR
                              GREEN MANUFACTURING
                            </h6>
                            <p className="news-excerpt">
                              Our state-of-the-art denim manufacturing facility
                              officially receives LEED Gold certification,
                              reinforcing our commitment to sustainable
                              development and environmental responsibility....
                            </p>
                            <span className="news-date">05/08/2025</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="news-list-item mb-3">
                      <Link href="/news/launching-eco-friendly-denim-collection" className="news-item-link">
                        <div className="news-item-content">
                          <div className="news-thumbnail">
                            <Image
                              src="/images/news/post_5.png"
                              alt="News Thumbnail"
                              className="img-fluid"
                              width={1920}
                              height={1080}
                            />
                          </div>
                          <div className="news-info">
                            <h6 className="news-title">
                              LAUNCHING ECO-FRIENDLY DENIM COLLECTION FALL 2025
                            </h6>
                            <p className="news-excerpt">
                              Our new denim collection features 100% organic
                              cotton and non-toxic dyeing technology, delivering
                              sustainable fashion choices for modern consumers
                              worldwide....
                            </p>
                            <span className="news-date">03/15/2025</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="news-list-item mb-3">
                      <Link href="/news/sg3-jean-wins-best-sustainable-factory-award" className="news-item-link">
                        <div className="news-item-content">
                          <div className="news-thumbnail">
                            <Image
                              src="/images/news/post_6.png"
                              alt="News Thumbnail"
                              className="img-fluid"
                              width={1920}
                              height={1080}
                            />
                          </div>
                          <div className="news-info">
                            <h6 className="news-title">
                              SG3 JEAN WINS &quot;BEST SUSTAINABLE FACTORY&quot;
                              AWARD 2025
                            </h6>
                            <p className="news-excerpt">
                              SG3 Jean has been honored with the &quot;Best
                              Sustainable Factory&quot; award for 2025,
                              recognizing our leadership in eco-friendly
                              manufacturing and innovation in the denim
                              industry....
                            </p>
                            <span className="news-date">03/15/2025</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12 text-center">
              <Link href="/news" className="btn btn-outline-primary btn-lg px-4">
                View all news
              </Link>
            </div>
          </div>
        </div>
        <style jsx>{`
          .news-list .news-title,
          .news-list .news-excerpt,
          .news-list .news-item-link,
          .news-list .news-item-link:hover,
          .news-list .news-item-link:focus {
            text-decoration: none !important;
            border-bottom: none !important;
            color: inherit !important;
            box-shadow: none !important;
          }
          .news-list-item {
            background: #f7f9fa;
            border-radius: 12px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.04);
            transition: box-shadow 0.2s, background 0.2s;
            border-bottom: 2px solid #e3eaf2;
          }
          .news-list-item:hover {
            background: linear-gradient(90deg, #e6f0fa 0%, #eaf6fd 100%);
            box-shadow: 0 4px 16px rgba(13, 110, 253, 0.10);
          }
        `}</style>
      </section>
      {/* Contact Section */}
      <section className="contact-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="contact-box">
                <h4>CONTACT</h4>
                <p className="contact-description">
                Seeking us and you&apos;ll get someone who can deliver consistent, high-quality products while minimizing their ecological footprint
                </p>
                <a href="/contact" className="btn btn-dark">
                  CONTACT US
                </a>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="work-with-us-box">
                <h4>WORK WITH US</h4>
                <p className="work-description">
                  We are looking for intelligent, passionate individuals who are
                  ready to join us in building and growing the company
                </p>
                <a href="/recruitment" className="btn btn-dark">
                  LEARN MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>
  );
}
