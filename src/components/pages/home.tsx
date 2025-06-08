"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import useClientScript from "../../app/hooks/useClientScript";
import homeService from "../../services/homeService";

// Type definitions
interface HeroData {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  videoUrl: string;
  isActive: boolean;
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
}

export default function Home() {
  // Sử dụng hook để khởi tạo tất cả JavaScript functionality
  useClientScript();

  // State để lưu dữ liệu từ API
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const data = await homeService.getCompleteHomeData();
        setHomeData(data as HomeData);
        setError(null);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("Không thể tải dữ liệu trang chủ");
        // Sử dụng dữ liệu mặc định khi có lỗi
        const defaultData = homeService.getDefaultHomeData();
        setHomeData(defaultData as HomeData);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Hiển thị loading state
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  // Hiển thị error state (nhưng vẫn có dữ liệu mặc định)
  if (error && !homeData) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  const { hero, sections, customers, certifications, featuredNews } =
    homeData || {};

  console.log("hero", hero?.backgroundImage);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="video-container">
          <Image
            src={hero?.backgroundImage || "/images/home_banner-section2.jpg"}
            alt="Factory Aerial View"
            className="img-fluid w-100"
            width={1920}
            height={1080}
          />
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
                          <source src={section.mediaUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          src={section.mediaUrl}
                          alt={section.title}
                          className="img-fluid w-100"
                          width={1920}
                          height={1080}
                        />
                      )}
                    </div>
                    <div
                      className="card-body text-white"
                      style={{ backgroundColor: section.backgroundColor }}
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
              <source src="/videos/SAIGON_3_JEAN.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      {/* AI Integration Section */}
      <section className="ai-integration">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-12 position-relative">
              <Image
                src="/images/home_banner-section2.jpg"
                alt="Conference Room"
                className="img-fluid w-100"
                width={1920}
                height={1080}
              />
              <div className="overlay"></div>
              <div className="ai-content text-center text-white">
                <h2 className="fw-bold">
                  AI INTEGRATION FOR
                  <br />
                  AUTOMATED PRODUCTION
                </h2>
                <a href="#" className="btn btn-outline-light px-4 mt-3">
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
          <Image
            src="/images/home_banner-section3.png"
            alt="Factory Aerial View"
            className="img-fluid w-100"
            width={1920}
            height={1080}
          />
        </div>
      </section>
      {/* Our Customers Section */}
      <section className="customers py-5">
        <div className="container-fluid">
          <div className="customers-wrapper position-relative">
            {/* Background Image */}
            <div className="customers-background">
              <Image
                src="/images/branding_our_customer/back_ground.png"
                alt="World Map"
                className="world-map-bg"
                width={1920}
                height={1080}
              />
            </div>

            {/* Content Overlay */}
            <div className="customers-content">
              <div className="container">
                <h2 className="section-title text-center mb-5">OUR CUSTOMER</h2>

                {/* DENIM & WOVEN Section */}
                <div className="customer-category mb-2">
                  <h4 className="text-center mb-4">DENIM & WOVEN</h4>
                  <div className="row customer-logos-row justify-content-center align-items-center">
                    {customers?.denimWoven?.map(
                      (customer: CustomerData, index: number) => (
                        <div key={index} className="col-6 col-md-3 mb-3">
                          <div className="customer-logo-item">
                            <Image
                              src={customer.logo}
                              alt={customer.name}
                              className="img-fluid customer-logo"
                              width={1920}
                              height={1080}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* KNIT Section */}
                <div className="customer-category">
                  <h4 className="text-center mb-4">KNIT</h4>
                  <div className="row customer-logos-row justify-content-center align-items-center">
                    {customers?.knit?.map(
                      (customer: CustomerData, index: number) => (
                        <div key={index} className="col-6 col-md-3 mb-3">
                          <div className="customer-logo-item">
                            <Image
                              src={customer.logo}
                              alt={customer.name}
                              className="img-fluid customer-logo"
                              width={1920}
                              height={1080}
                            />
                          </div>
                        </div>
                      )
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
            {/* Hiển thị certifications từ API */}
            {certifications &&
              certifications.map((cert: CertificationData, index: number) => {
                // Xử lý hiển thị theo category
                if (cert.name === "LEED GOLD") {
                  return (
                    <div key={index} className="col-lg-4 mb-4">
                      <div className="cert-item leed-cert">
                        <Image
                          src={cert.image}
                          alt={cert.name}
                          className="cert-image"
                          width={1920}
                          height={1080}
                        />
                        <div className="leed-text-container">
                          <div className="leed-text-item">LEADERSHIP IN</div>
                          <div className="leed-text-item">ENERGY &</div>
                          <div className="leed-text-item">ENVIRONMENTAL</div>
                          <div className="leed-text-item">DESIGN</div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (cert.name.includes("ISO")) {
                  return (
                    <div key={index} className="col-lg-4 mb-4">
                      <div className="cert-item iso-cert">
                        <Image
                          src={cert.image}
                          alt={cert.name}
                          className="cert-image"
                          width={1920}
                          height={1080}
                        />
                        <div className="iso-text-container">
                          <div className="iso-text-item">{cert.name}</div>
                          <div className="iso-text-item">
                            {cert.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

            {/* Fallback cho các certifications cố định khác */}
            <div className="col-lg-4 mb-4">
              <div className="certifications-list">
                {/* Higg Index */}
                <div className="cert-row mb-3">
                  <div className="cert-row-content higg-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/higg_index.png"
                        alt="Higg Index"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">
                        SUSTAINABLE MANUFACTURING
                      </div>
                    </div>
                  </div>
                </div>

                {/* OEKO-TEX */}
                <div className="cert-row mb-3">
                  <div className="cert-row-content oeko-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/oeko_tex.png"
                        alt="OEKO-TEX Standard 100"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">SAFE & CARING PRODUCTS</div>
                    </div>
                  </div>
                </div>

                {/* EIM Score */}
                <div className="cert-row mb-3">
                  <div className="cert-row-content eim-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/eim_score.png"
                        alt="EIM Score"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">SUSTAINABLE TECHNOLOGY</div>
                    </div>
                  </div>
                </div>

                {/* Sedex */}
                <div className="cert-row mb-3">
                  <div className="cert-row-content sedex-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/sedex.png"
                        alt="Sedex SMETA"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">SOCIAL RESPONSIBILITY</div>
                    </div>
                  </div>
                </div>

                {/* Fast Retailing */}
                <div className="cert-row">
                  <div className="cert-row-content fast-cert">
                    <div className="cert-icon">
                      <Image
                        src="/images/certification/fast_retailing.png"
                        alt="Fast Retailing"
                        className="cert-small-image"
                        width={1920}
                        height={1080}
                      />
                    </div>
                    <div className="cert-text">
                      <div className="cert-title">CERTIFIED SUB-CONTRACTOR</div>
                    </div>
                  </div>
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
          <div className="row mt-4">
            {/* Featured News - Hiển thị tin đầu tiên */}
            {featuredNews && featuredNews.length > 0 && (
              <div className="col-md-5 mb-4">
                <div className="news-item position-relative">
                  <Image
                    src={featuredNews[0].image}
                    alt={featuredNews[0].title}
                    className="img-fluid w-100"
                    width={1920}
                    height={1080}
                  />
                  <div className="news-overlay">
                    <h5 className="text-white">{featuredNews[0].title}</h5>
                    <p className="text-white text-justify mb-3">
                      {featuredNews[0].excerpt}
                    </p>
                    <a href="#" className="btn btn-primary">
                      READ MORE
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* News List - Hiển thị các tin còn lại */}
            <div className="col-md-7 mb-4">
              <div className="news-list">
                {featuredNews &&
                  featuredNews.slice(1).map((news: NewsData, index: number) => (
                    <div key={news.id || index} className="news-list-item mb-3">
                      <div className="news-item-content">
                        <div className="news-thumbnail">
                          <Image
                            src={news.image}
                            alt={news.title}
                            className="img-fluid"
                            width={1920}
                            height={1080}
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
                    </div>
                  ))}

                {/* Fallback news nếu không đủ dữ liệu từ API */}
                {(!featuredNews || featuredNews.length < 2) && (
                  <>
                    <div className="news-list-item mb-3">
                      <div className="news-item-content">
                        <div className="news-thumbnail">
                          <Image
                            src="/images/news/post_2.png"
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
                    </div>
                    <div className="news-list-item mb-3">
                      <div className="news-item-content">
                        <div className="news-thumbnail">
                          <Image
                            src="/images/news/post_3.jpg"
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
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12 text-center">
              <a href="#" className="btn btn-outline-primary btn-lg px-4">
                View all news
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section className="contact-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="contact-box">
                <h4>CONTACT</h4>
                <h5 className="contact-subtitle">Sustainable Partnership</h5>
                <p className="contact-description">
                  We seek like-minded provide high-quality manufacturing
                  services innovation, and work together sustainable growth
                </p>
                <a href="/pages/contact.html" className="btn btn-dark">
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
                <a href="/pages/recruitment.html" className="btn btn-dark">
                  LEARN MORE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
