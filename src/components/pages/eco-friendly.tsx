"use client";

import React, { useEffect } from "react";
import { getOptimizedImageUrls } from "../../shared/imageUtils";
import Image from "next/image";
import { BACKEND_DOMAIN } from '@/api/config';
import 'bootstrap-icons/font/bootstrap-icons.css';

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

interface ResponsiveImgProps {
  srcs: {
    origin?: string;
    webp?: string;
    medium?: string;
    thumbnail?: string;
    low?: string;
  };
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  style?: React.CSSProperties;
}

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
        return srcs.thumbnail || srcs.medium || srcs.low || srcs.webp || srcs.origin;
      } else if (width && width <= 800) {
        // Ưu tiên medium cho kích thước trung bình
        return srcs.medium || srcs.low || srcs.webp || srcs.origin;
      } else if (width && width <= 1200) {
        // Ưu tiên low cho kích thước lớn (nhưng không quá lớn)
        return srcs.low || srcs.webp || srcs.origin;
      } else {
        // Ưu tiên webp cho kích thước rất lớn
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
      if (srcs.thumbnail && srcs.medium && srcs.low && srcs.webp) {
        return `${srcs.thumbnail} 300w, ${srcs.medium} 800w, ${srcs.low} 1200w, ${srcs.webp} 1920w`;
      }
      // Nếu chỉ có một số phiên bản
      const sets = [];
      if (srcs.thumbnail) sets.push(`${srcs.thumbnail} 300w`);
      if (srcs.medium) sets.push(`${srcs.medium} 800w`);
      if (srcs.low) sets.push(`${srcs.low} 1200w`);
      if (srcs.webp) sets.push(`${srcs.webp} 1920w`);
      
      return sets.length > 0 ? sets.join(', ') : undefined;
    })();
    
    // Chuẩn bị sizes attribute nếu không được cung cấp
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

interface EcoFriendlyProps {
  ecoFriendlyData: EcoFriendlyData | null;
}

export default function EcoFriendly({ ecoFriendlyData }: EcoFriendlyProps) {
  // Không dùng SWR, chỉ nhận ecoFriendlyData từ props
  const data = ecoFriendlyData;

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
  }, [data]);

  if (!data) {
    return (
      <main id="eco-friendly">
        <section className="hero d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <h2 className="text-danger">Error loading eco-friendly data</h2>
            <p>Không thể tải dữ liệu eco-friendly.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="eco-friendly-zoom">
      {/* Font consistency override for eco-friendly page */}
      <style jsx global>{`
        /* Apply Inter font family consistently */
        .eco-section h2,
        .eco-section p,
        .features-right .right-item p,
        .features-right .right-item ul li,
        .stat-title,
        .stat-value strong,
        .stat-value span {
          font-family: "Inter", sans-serif !important;
        }
        
        /* Normalize font weights */
        .eco-section h2 {
          font-weight: 500 !important;
          font-family: "Inter", sans-serif !important;
        }
        
        .eco-section p {
          font-weight: 400 !important;
          font-family: "Inter", sans-serif !important;
        }
        
        .features-right .right-item p {
          font-weight: 700 !important;
          font-family: "Inter", sans-serif !important;
        }
        
        .features-right .right-item ul li {
          font-weight: 400 !important;
          font-family: "Inter", sans-serif !important;
        }
        
        .stat-title {
          font-weight: 400 !important;
          font-family: "Inter", sans-serif !important;
        }
        
        .stat-value strong {
          font-weight: 500 !important;
          font-family: "Inter", sans-serif !important;
        }
        
        .stat-value span {
          font-weight: 400 !important;
          font-family: "Inter", sans-serif !important;
        }
      `}</style>
      <main id="eco-friendly">

        <section className="features">
          <div className="circle-layout">
            <div className="features-left">
              <div className="left-select-item">
                {data!.features.slice(0, 5).map((_, index) => (
                  <div key={index} className={`dot dot-${index + 1}`}></div>
                ))}
              </div>
              <div className="left-item">
                <ResponsiveImg
                  srcs={getOptimizedImageUrls(data!.mainImage)}
                  alt={data!.mainImageAlt}
                  width={500}
                  height={500}
                  className="eco-friendly-image"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="features-right">
              {data!.features.map((feature, idx) => (
                <div key={feature.id || idx} className="right-item">
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
        {data!.sections.map((section, idx) => {
          if (section.title.toLowerCase().includes('solar')) {
            // Section đầu tiên - Solar System với stats
            return (
              <section key={section.id || idx} className="eco-section solar-system">
                <ResponsiveImg
                  srcs={getOptimizedImageUrls(section.image)}
                  alt={section.imageAlt}
                  width={1200}
                  height={800}
                  className="eco-section-image"
                  style={{ objectFit: "cover" }}
                />
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                <div className="stats">
                  <div className="stat-box">
                    <div className="stat-icon">
                      <i className="bi bi-building-fill-check"></i>
                    </div>
                    <div className="stat-title">EVN COLLABORATION</div>
                    <div className="stat-value">
                      <strong>STANDARD</strong>
                      <span style={{opacity: 0}}>&nbsp;</span>
                    </div>
                  </div>
                  
                  <div className="stat-box">
                    <div className="stat-icon">
                      <i className="bi bi-plug-fill"></i>
                    </div>
                    <div className="stat-title">POWER CAPACITY</div>
                    <div className="stat-value">
                      <strong>1</strong>
                      <span>Megawatt/hour</span>
                    </div>
                  </div>
                  
                  <div className="stat-box">
                    <div className="stat-icon">
                      <i className="bi bi-battery-charging"></i>
                    </div>
                    <div className="stat-title">ELECTRICITY USAGE</div>
                    <div className="stat-value">
                      <strong>50%</strong>
                      <span>coverage</span>
                    </div>
                  </div>
                </div>
              </section>
            );
          } else if (section.title.toLowerCase().includes('ai') || section.title.toLowerCase().includes('effluent')) {
            // Section thứ hai - AI Revolution với water stats
            return (
              <section key={section.id || idx} className="eco-section ai-revolution content-animate">
                <ResponsiveImg
                  srcs={getOptimizedImageUrls(section.image)}
                  alt={section.imageAlt}
                  width={1200}
                  height={800}
                  className="eco-section-image"
                  style={{ objectFit: "cover" }}
                />
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                <div className="stats">
                  <div className="stat-box">
                    <div className="stat-icon">
                      <i className="bi bi-recycle"></i>
                    </div>
                    <div className="stat-title">WATER RECYCLING</div>
                    <div className="stat-value">
                      <strong>70%</strong>
                      <span>target</span>
                    </div>
                  </div>
                  
                  <div className="stat-box">
                    <div className="stat-icon">
                      <i className="bi bi-water"></i>
                    </div>
                    <div className="stat-title">CAPACITY</div>
                    <div className="stat-value">
                      <strong>2,500</strong>
                      <span>m³/day</span>
                    </div>
                  </div>
                </div>
              </section>
            );
          } else if (section.title.toLowerCase().includes('biomass')) {
            // Luôn luôn hardcode 2 box cho Biomass Boiler
            return (
              <section key={section.id || idx} className="eco-section biomass-boiler content-animate" id="biomass-section">
                <ResponsiveImg
                  srcs={getOptimizedImageUrls(section.image)}
                  alt={section.imageAlt}
                  width={1200}
                  height={800}
                  className="eco-section-image"
                  style={{ objectFit: "cover" }}
                />
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                <div className="stats" style={{ alignItems: 'flex-end' }}>
                  <div className="stat-box" style={{ width: '340px', minWidth: '320px', margin: '0 1.8rem' }}>
                    <div className="stat-icon">
                      <i className="bi bi-fire"></i>
                    </div>
                    <div className="stat-title">BOILERS</div>
                    <div className="stat-value">
                      <strong>2</strong>
                      <span>boilers with 8-ton capacity</span>
                    </div>
                  </div>
                  <div className="stat-box" style={{ width: '340px', minWidth: '320px', margin: '0 1.8rem', alignSelf: 'flex-end' }}>
                    <div className="stat-icon">
                      <i className="bi bi-tree"></i>
                    </div>
                    <div className="stat-title">BIOMASS FUEL</div>
                    <div className="stat-value">
                      <strong>2025</strong>
                      <span>stage started</span>
                    </div>
                  </div>
                </div>
              </section>
            );
          }
          // Các section khác (nếu có)
          console.log("Rendering other section:", section.title);
          return (
            <section key={section.id || idx} className="eco-section content-animate">
              <ResponsiveImg
                srcs={getOptimizedImageUrls(section.image)}
                alt={section.imageAlt}
                width={1200}
                height={800}
                className="eco-section-image"
                style={{ objectFit: "cover" }}
              />
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </section>
          );
        })}
      </main>
    </div>
  );
}
