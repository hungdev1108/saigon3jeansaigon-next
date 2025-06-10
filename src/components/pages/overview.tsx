"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";

export default function Overview() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const animateElementsRef = useRef<(HTMLElement | null)[]>([]);
  const sliderRef = useRef<Slider>(null);

  // Milestones data
  const milestones = [
    {
      year: "2019",
      title: "Beginning",
      description:
        "Established the company with a vision to produce high-quality denim for both domestic and international markets",
      image: "/images/overview-page/overview_1.jpg",
    },
    {
      year: "2020",
      title: "Expansion",
      description:
        "Expanded production capacity and modernized technology to meet increasing demand",
      image: "/images/overview-page/overview_2.jpg",
    },
    {
      year: "2021",
      title: "Innovation",
      description:
        "Applied new technology and sustainable production processes, ensuring environmental friendliness",
      image: "/images/overview-page/overview_3.jpg",
    },
    {
      year: "2022",
      title: "Globalization",
      description:
        "Expanded export markets and established strategic partnerships globally",
      image: "/images/overview-page/overview_4.jpg",
    },
    {
      year: "2023",
      title: "60 Hectares",
      description:
        "Expanded factory area to 60 hectares with modern production capacity",
      image: "/images/overview-page/overview_5.jpg",
    },
    {
      year: "2024",
      title: "Expansion",
      description:
        "Expanded production capacity and modernized technology to meet increasing demand",
      image: "/images/overview-page/overview_6.jpg",
    },
  ];

  // Slick settings
  const slickSettings = {
    centerMode: true,
    centerPadding: "40px",
    slidesToShow: 5,
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
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "60px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "40px",
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
              <h2>SAIGON 3 JEAN GROUP</h2>
              <p>
                Saigon 3 Jean Group is a leading manufacturer in Vietnam&apos;s
                textile and garment industry. We specialize in producing
                high-quality denim products, including jeans, jackets, and other
                garment items for both domestic and international markets. With
                modern facilities and skilled workforce, we are committed to
                delivering excellence in every product we create. Our company
                values sustainability, innovation, and customer satisfaction as
                we continue to grow and expand our presence in the global
                textile industry.
              </p>
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
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="timeline-slide-wrapper">
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
                            src={milestone.image}
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
          <div className="container">
            <h2 className="section-title mt-5">MESSAGE</h2>
            <div className="message-content">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <p>
                    &quot;Saigon 3 will always be associated with the core value
                    of &quot;Quality creates the difference&quot;. We aim to
                    optimize our production system to deliver high-quality
                    products that meet global standards in the denim garment
                    supplier industry.&quot;
                  </p>
                  <p>
                    &quot;Saigon 3 also positions itself as a pioneer in
                    applying modern, sustainable, and eco-friendly technologies.
                    This approach reflects our social and environmental
                    responsibility, as well as our intention to follow fashion
                    trends in the sustainable garment production sector.&quot;
                  </p>
                  <p>
                    &quot;Our culture is demonstrated through the talent,
                    ethics, and passion of our leaders. We are constantly
                    seeking benefits for our workers. This culture is also
                    reflected in our commitment to sharing, caring, and a
                    sincere work attitude.&quot;
                  </p>
                </div>
                <div className="col-md-4">
                  <div className="ceo-image">
                    <Image
                      src="/images/overview-page/CEO.jpg"
                      alt="CEO"
                      className="ceo-photo"
                      width={300}
                      height={300}
                      objectFit="cover"
                    />
                    <div
                      className="ceo-placeholder"
                      style={{ display: "none" }}
                    >
                      CEO IMAGE
                    </div>
                    <div className="ceo-title">CEO</div>
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
                  <i className="fas fa-eye"></i>
                  <h3>VISION</h3>
                  <p>
                    To assert our position as a pioneer in sustainable garment
                    production, driving innovation and environmental
                    responsibility within the industry. Saigon 3 will continue
                    to lead in denim garment supplier services and champion
                    eco-friendly.
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mission-box">
                  <i className="fas fa-bullseye"></i>
                  <h3>MISSION</h3>
                  <p>
                    To provide the highest quality denim garments and denim
                    washing services, ensuring excellence in every product.
                    Saigon 3 aims to be a second home for all of our employees,
                    fostering a supportive and thriving work environment.
                  </p>
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
              {[1, 2, 3, 4, 5].map((value, index) => (
                <div
                  key={value}
                  className={`${value <= 3 ? "col-md-4" : "col-md-6"} mb-4`}
                  ref={(el) => {
                    if (el) animateElementsRef.current[5 + index] = el;
                  }}
                >
                  <div className="value-box">
                    <i
                      className={`fas fa-${
                        value === 1
                          ? "handshake"
                          : value === 2
                          ? "lightbulb"
                          : value === 3
                          ? "leaf"
                          : value === 4
                          ? "users"
                          : "chart-line"
                      }`}
                    ></i>
                    <h4>CORE VALUE {value}</h4>
                    <p>
                      A talented and ethical workforce committed to excellence.
                      Sustainable development and environmental{" "}
                      {value <= 3 ? "f riendliness are" : "friendliness are"}
                      at the heart of our operations, ensuring we contribute
                      positively to the garment finishing process and
                      sustainable garment production.
                    </p>
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
