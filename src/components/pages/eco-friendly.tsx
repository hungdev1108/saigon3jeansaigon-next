"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ecoFriendlyService } from "../../services";
import { BACKEND_DOMAIN } from "../../api/config";

// Interfaces for TypeScript
interface Hero {
  image: string;
  imageAlt: string;
}

interface Feature {
  id: string;
  title: string;
  points: string[];
  order: number;
  isActive: boolean;
}

interface Stat {
  id: string;
  value: string;
  label: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  order: number;
  stats: Stat[];
  isActive: boolean;
}

interface EcoFriendlyData {
  pageTitle: string;
  pageDescription: string;
  hero: Hero;
  mainImage: string;
  mainImageAlt: string;
  features: Feature[];
  sections: Section[];
}

export default function EcoFriendly() {
  const [ecoFriendlyData, setEcoFriendlyData] = useState<EcoFriendlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchEcoFriendlyData = async () => {
      try {
        setLoading(true);
        const data = await ecoFriendlyService.getCompleteEcoFriendlyData();
        setEcoFriendlyData(data as EcoFriendlyData);
        setError(null);
      } catch (err) {
        console.error("Error fetching eco-friendly data:", err);
        setError("Failed to load eco-friendly data");
        // Sử dụng dữ liệu mặc định khi có lỗi
        const defaultData = ecoFriendlyService.getDefaultEcoFriendlyData();
        setEcoFriendlyData(defaultData as EcoFriendlyData);
      } finally {
        setLoading(false);
      }
    };

    fetchEcoFriendlyData();
  }, []);

  useEffect(() => {
    const dots = document.querySelectorAll(
      "#eco-friendly .left-select-item .dot"
    );
    const items = document.querySelectorAll(
      "#eco-friendly .features-right .right-item"
    );
    const itemsline = document.querySelectorAll(
      "#eco-friendly .features-right .right-item .line"
    );

    const handleDotClick = (index: number) => {
      dots.forEach((d) => d.classList.remove("active"));
      items.forEach((i) => i.classList.remove("active"));
      itemsline.forEach((i) => i.classList.remove("active"));

      dots[index].classList.add("active");
      if (items[index]) {
        items[index].classList.add("active");
        itemsline[index].classList.add("active");
      }
    };

    const handleItemClick = (index: number) => {
      dots.forEach((d) => d.classList.remove("active"));
      items.forEach((i) => i.classList.remove("active"));
      itemsline.forEach((i) => i.classList.remove("active"));

      items[index].classList.add("active");
      if (dots[index]) {
        dots[index].classList.add("active");
        itemsline[index].classList.add("active");
      }
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => handleDotClick(index));
    });

    items.forEach((item, index) => {
      item.addEventListener("click", () => handleItemClick(index));
    });

    // Cleanup event listeners
    return () => {
      dots.forEach((dot, index) => {
        dot.removeEventListener("click", () => handleDotClick(index));
      });
      items.forEach((item, index) => {
        item.removeEventListener("click", () => handleItemClick(index));
      });
    };
  }, [ecoFriendlyData]);

  if (loading) {
    return (
      <main id="eco-friendly">
        <section className="hero d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading eco-friendly data...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!ecoFriendlyData) {
    return (
      <main id="eco-friendly">
        <section className="hero d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <h2 className="text-danger">Error loading eco-friendly data</h2>
            <p>{error}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <main id="eco-friendly">
        {/* Eco-friendly Overview */}
        <section className="hero">
          <Image
            src={`${BACKEND_DOMAIN}${ecoFriendlyData.hero.image}`}
            alt={ecoFriendlyData.hero.imageAlt}
            width={1920}
            height={1080}
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </section>

        <section className="features">
          <div className="circle-layout">
            <div className="features-left">
              <div className="left-select-item">
                {ecoFriendlyData.features.slice(0, 5).map((_, index) => (
                  <div key={index} className={`dot dot-${index + 1}`}></div>
                ))}
              </div>
              <div className="left-item">
                <Image
                  src={`${BACKEND_DOMAIN}${ecoFriendlyData.mainImage}`}
                  alt={ecoFriendlyData.mainImageAlt}
                  width={800}
                  height={600}
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="features-right">
              {ecoFriendlyData.features.map((feature) => (
                <div key={feature.id} className="right-item">
                  <p>{feature.title}</p>
                  <div className="line"></div>
                  <ul>
                    {feature.points.map((point, pointIndex) => (
                      <li key={pointIndex}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Sections từ API */}
        {ecoFriendlyData.sections.map((section, index) => {
          if (index === 0) {
            // Section đầu tiên - Solar System với stats
            return (
              <section key={section.id} className="solar-system">
                <Image
                  src={`${BACKEND_DOMAIN}${section.image}`}
                  alt={section.imageAlt}
                  width={1200}
                  height={800}
                  objectFit="cover"
                />
                <div className="content-animate">
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
                {section.stats.length > 0 && (
                  <div className="stats">
                    {section.stats.map((stat, statIndex) => (
                      <React.Fragment key={stat.id}>
                        {statIndex === 0 ? (
                          <div className="d-flex align-items-center content-animate">
                            <strong>{stat.value}</strong>
                            <p dangerouslySetInnerHTML={{ __html: stat.label.replace(/\s/g, '<br />') }}></p>
                          </div>
                        ) : (
                          <>
                            <div className="line"></div>
                            <div className="stats-item content-animate">
                              <p>CAPACITY UP TO</p>
                              <div>
                                <strong>{stat.value}</strong>
                                <span>{stat.label}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </section>
            );
          } else {
            // Các sections khác
            return (
              <section key={section.id} className={index === 1 ? "ai-revolution content-animate" : "biomass-boiler content-animate"}>
                <Image
                  src={`${BACKEND_DOMAIN}${section.image}`}
                  alt={section.imageAlt}
                  width={1200}
                  height={800}
                  objectFit="cover"
                />
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </section>
            );
          }
        })}
      </main>
    </>
  );
}
