"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { overviewService } from "../../services";
import { BACKEND_DOMAIN } from "../../api/config";

// Interfaces for TypeScript
interface Banner {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  isActive: boolean;
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
  id: string;
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

export default function Overview() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animateElementsRef = useRef<(HTMLElement | null)[]>([]);
  const sliderRef = useRef<Slider>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const data = await overviewService.getCompleteOverviewData();
        const typedData = data as OverviewData;
        setOverviewData(typedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching overview data:", err);
        setError("Failed to load overview data");
        // Sử dụng dữ liệu mặc định khi có lỗi
        const defaultData = overviewService.getDefaultOverviewData();
        const typedDefaultData = defaultData as OverviewData;
        setOverviewData(typedDefaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // Slick settings
  const slickSettings = {
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 4,
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

  // Handle slide navigation
  const goToSlide = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
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

  if (loading) {
    return (
      <section className="page-content py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading overview data...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!overviewData) {
    return (
      <section className="page-content py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="text-danger">Error loading overview data</h2>
            <p>{error}</p>
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
        >
          <div className="container">
            <div className="hero-content">
              <h2>{overviewData.banner.title}</h2>
              <p>{overviewData.banner.description}</p>
            </div>
          </div>
        </div>

        {/* Modern MILESTONES Section with Interactive Carousel */}
        <div
          className="milestones-section"
          ref={(el) => {
            if (el) animateElementsRef.current[1] = el;
          }}
        >
          <div className="container-fluid px-0">
            <div className="container">
              <h2 className="section-title mt-5">
                MILESTONES IN ESTABLISHMENT
              </h2>
            </div>

            <div className="milestones-carousel">
              <Slider {...slickSettings} ref={sliderRef}>
                {overviewData.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="timeline-slide-wrapper">
                    <div
                      className={`timeline-slide ${
                        index === currentSlide ? "slick-center" : ""
                      }`}
                      onClick={() => goToSlide(index)}
                    >
                      <div className="timeline-year">{milestone.year}</div>
                      <div className="timeline-item" data-year={milestone.year}>
                        <div className="timeline-date">{milestone.year}</div>
                        <div className="timeline-content">
                          <Image
                            src={`${BACKEND_DOMAIN}${milestone.image}`}
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
          <div className="message-banner-wrapper">
            {/* Background Image */}
            <div className="message-background">
              <Image
                src="/images/overview-page/CEO-Banner.jpg"
                alt="CEO Message Banner"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center center' }}
                priority
              />
            </div>
            
            {/* Content Overlay */}
            <div className="message-overlay">
              <div className="container">
                <div className="message-content">
                  <div className="message-text-wrapper">
                    <h2 className="message-title">MESSAGE</h2>
                    <div className="message-text">
                      {overviewData.message.content.map((content) => (
                        <p key={content.id}>{content.paragraph}</p>
                      ))}
                    </div>
                    <div className="ceo-signature">
                      <div className="ceo-name">{overviewData.message.ceoName}</div>
                      <div className="ceo-position">Chief Executive Officer</div>
                    </div>
                  </div>
                </div>
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
                  <h2 className="section-title">{overviewData.visionMission.vision.title}</h2>
                  <p>{overviewData.visionMission.vision.content}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mission-box">
                  <i className={overviewData.visionMission.mission.icon}></i>
                  <h2 className="section-title">{overviewData.visionMission.mission.title}</h2>
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
            <h2 className="section-title mt-5">CORE VALUES</h2>
            <div className="row">
              {overviewData.coreValues.map((value, index) => (
                <div
                  key={value.id}
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
