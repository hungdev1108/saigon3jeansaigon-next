"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import useClientScript from "../../app/hooks/useClientScript";
import homeService from "../../services/homeService";
import { BACKEND_DOMAIN } from "../../api/config";
import ClientOnly from "../ClientOnly";

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

  // Function to get customer slider settings based on item count
  const getCustomerSliderSettings = (itemCount: number) => ({
    dots: false,
    arrows: false,
    infinite: itemCount > 4,
    speed: 500,
    slidesToShow: Math.min(4, itemCount),
    slidesToScroll: 1,
    autoplay: itemCount > 4,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerMode: false,
    centerPadding: "0px",
    variableWidth: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, itemCount),
          slidesToScroll: 1,
          infinite: itemCount > 3,
          arrows: false,
          centerMode: false,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(2, itemCount),
          slidesToScroll: 1,
          infinite: itemCount > 2,
          arrows: false,
          centerMode: false,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, itemCount),
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          infinite: itemCount > 2,
          centerMode: false,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          infinite: itemCount > 1,
          centerMode: itemCount === 1,
          centerPadding: itemCount === 1 ? "30px" : "0px",
        },
      },
    ],
  });

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
      <ClientOnly>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </ClientOnly>
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

  return (
    <ClientOnly>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="video-container">
          <Image
            src={
              hero?.backgroundImage
                ? `${BACKEND_DOMAIN}${hero.backgroundImage}`
                : "/images/home_banner-section2.jpg"
            }
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
                          <source
                            src={
                              section.mediaUrl
                                ? `${BACKEND_DOMAIN}${section.mediaUrl}`
                                : "/videos/SAIGON_3_JEAN.mp4"
                            }
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          src={
                            section.mediaUrl
                              ? `${BACKEND_DOMAIN}${section.mediaUrl}`
                              : "/images/home_banner-section2.jpg"
                          }
                          alt={section.title}
                          className="img-fluid w-100"
                          width={1920}
                          height={1080}
                        />
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
                <div className="customer-category mb-5">
                  <h4 className="text-center mb-4">DENIM & WOVEN</h4>
                  <div className="customer-slider-container">
                    {customers?.denimWoven &&
                    customers.denimWoven.length > 0 ? (
                      <Slider
                        {...getCustomerSliderSettings(
                          customers.denimWoven.length
                        )}
                        className="customer-slider"
                      >
                        {customers.denimWoven.map(
                          (customer: CustomerData, index: number) => (
                            <div key={`denim-${index}`} className="px-2">
                              <div className="customer-logo-item">
                                <Image
                                  src={
                                    customer.logo
                                      ? `${BACKEND_DOMAIN}${customer.logo}`
                                      : "/images/placeholder-logo.png"
                                  }
                                  alt={customer.name}
                                  className="img-fluid customer-logo"
                                  width={200}
                                  height={120}
                                />
                              </div>
                            </div>
                          )
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
                        {...getCustomerSliderSettings(customers.knit.length)}
                        className="customer-slider"
                      >
                        {customers.knit.map(
                          (customer: CustomerData, index: number) => (
                            <div key={`knit-${index}`} className="px-2">
                              <div className="customer-logo-item">
                                <Image
                                  src={
                                    customer.logo
                                      ? `${BACKEND_DOMAIN}${customer.logo}`
                                      : "/images/placeholder-logo.png"
                                  }
                                  alt={customer.name}
                                  className="img-fluid customer-logo"
                                  width={200}
                                  height={120}
                                />
                              </div>
                            </div>
                          )
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
                // Xử lý hiển thị theo category
                if (cert.name === "LEED GOLD") {
                  return (
                    <div key={index} className="col-lg-4 mb-4">
                      <div className="cert-item leed-cert">
                        <Image
                          src={
                            cert.image
                              ? `${BACKEND_DOMAIN}${cert.image}`
                              : "/images/certification/leed_gold.png"
                          }
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
                          src={
                            cert.image
                              ? `${BACKEND_DOMAIN}${cert.image}`
                              : "/images/certification/certificate.png"
                          }
                          alt={cert.name}
                          className="cert-image"
                          width={1920}
                          height={1080}
                          objectFit="cover"
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
              <div className="certifications-list">
                {certifications &&
                  certifications
                    .filter(
                      (cert) =>
                        !cert.name.includes("LEED") &&
                        !cert.name.includes("ISO")
                    )
                    .map((cert, index) => (
                      <div key={index} className="cert-row mb-3">
                        <div
                          className={`cert-row-content ${cert.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}-cert`}
                        >
                          <div className="cert-icon">
                            <Image
                              src={
                                cert.image
                                  ? `${BACKEND_DOMAIN}${cert.image}`
                                  : "/images/placeholder-cert.png"
                              }
                              alt={cert.name}
                              className="cert-small-image"
                              width={1920}
                              height={1080}
                            />
                          </div>
                          <div className="cert-text">
                            <div className="cert-title">{cert.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
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
              <div className="col-md-5 mb-4 news-item-container">
                <div className="news-item position-relative">
                  <Image
                    src={
                      featuredNews[0].image
                        ? `${BACKEND_DOMAIN}${featuredNews[0].image}`
                        : "/images/news/post_1.jpg"
                    }
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
                            src={
                              news.image
                                ? `${BACKEND_DOMAIN}${news.image}`
                                : "/images/news/post_1.jpg"
                            }
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
                    </div>
                    <div className="news-list-item mb-3">
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
                    </div>
                    <div className="news-list-item mb-3">
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
