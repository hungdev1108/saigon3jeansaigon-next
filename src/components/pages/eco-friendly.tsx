"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import ecoFriendlyService from "@/services/ecoFriendlyService";

// Define the types based on the API response structure
interface Feature {
  _id: string;
  title: string;
  points: string[];
  order: number;
  isActive: boolean;
}

interface Stat {
  value: string;
  label: string;
}

interface Section {
  _id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  stats: Stat[];
  order: number;
  isActive: boolean;
}

interface EcoFriendlyData {
  pageTitle: string;
  pageDescription: string;
  hero: {
    image: string;
    imageAlt: string;
  };
  mainImage: string;
  mainImageAlt: string;
  features: Feature[];
  sections: Section[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export default function EcoFriendly() {
  const [data, setData] = useState<EcoFriendlyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await ecoFriendlyService.getData();
        setData(response.data);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching eco-friendly data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add click event handlers for dots and items
  useEffect(() => {
    if (!data) return;

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
  }, [data]);

  // Show loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Return null if no data
  if (!data) {
    return null;
  }

  return (
    <>
      <main id="eco-friendly">
        {/* Eco-friendly Overview */}
        <section className="hero">
          <Image
            src={data.hero.image}
            alt={data.hero.imageAlt}
            width={1920}
            height={1080}
            priority
            unoptimized={true}
            style={{ width: "100%", height: "100%" }}
          />
        </section>

        <section className="features">
          <div className="circle-layout">
            <div className="features-left">
              <div className="left-select-item">
                {data.features.map((feature, index) => (
                  <div 
                    key={feature._id} 
                    className={`dot dot-${index + 1}${index === 0 ? " active" : ""}`}
                  ></div>
                ))}
              </div>
              <div className="left-item">
                <Image
                  src={data.mainImage}
                  alt={data.mainImageAlt}
                  width={800}
                  height={600}
                  unoptimized={true}
                />
              </div>
            </div>
            <div className="features-right">
              {data.features.map((feature, index) => (
                <div 
                  key={feature._id} 
                  className={`right-item${index === 0 ? " active" : ""}`}
                >
                  <p>{feature.title}</p>
                  <div className={`line${index === 0 ? " active" : ""}`}></div>
                  <ul>
                    {feature.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {data.sections.map((section, index) => {
          // Solar system section with stats
          if (section.stats && section.stats.length > 0) {
            return (
              <section key={section._id} className="solar-system">
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  width={1200}
                  height={800}
                  unoptimized={true}
                />
                <div className="content-animate">
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
                <div className="stats">
                  {section.stats[0] && (
                    <div className="d-flex align-items-center content-animate">
                      <strong>{section.stats[0].value}</strong>
                      <p dangerouslySetInnerHTML={{ __html: section.stats[0].label.replace(/\n/g, '<br />') }} />
                    </div>
                  )}
                  {section.stats.length > 1 && (
                    <>
                      <div className="line"></div>
                      <div className="stats-item content-animate">
                        <p>CAPACITY UP TO</p>
                        <div>
                          <strong>{section.stats[1].value}</strong>
                          <span>{section.stats[1].label}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>
            );
          }
          
          // AI Revolution section
          if (index === 1) {
            return (
              <section key={section._id} className="ai-revolution content-animate">
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  width={1200}
                  height={800}
                  unoptimized={true}
                />
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </section>
            );
          }
          
          // Biomass section or any other section
          return (
            <section key={section._id} className="biomass-boiler content-animate">
              <Image
                src={section.image}
                alt={section.imageAlt}
                width={1200}
                height={800}
                unoptimized={true}
              />
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </section>
          );
        })}
      </main>
    </>
  );
}
