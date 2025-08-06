"use client";

import Image from "next/image";
import Slider from "react-slick";
import { BACKEND_DOMAIN } from '@/api/config';
import { getOptimizedImageUrls } from "../../shared/imageUtils";
import { useIntersectionObserver } from "../../app/hooks/useCounterAnimation";
import AnimatedMetric from "../AnimatedMetric";

interface KeyMetric {
  id: string;
  icon: string;
  value: string;
  unit: string;
  label: string;
  order: number;
}

interface ImageData {
  url: string;
  alt: string;
  order: number;
  _id: string;
}

interface FacilityFeature {
  _id: string;
  title: string;
  description: string;
  image: string; // Legacy field
  imageAlt: string;
  images: ImageData[]; // New images array field
  order: number;
  layout: string;
}

interface LegacyFacilityFeature {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  order: number;
  layout: string;
}

interface FacilitiesData {
  pageTitle: string;
  pageDescription: string;
  keyMetrics: KeyMetric[];
  facilityFeatures: (FacilityFeature | LegacyFacilityFeature)[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Image Slider Component for facilities
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

interface FacilityImageSliderProps {
  images: ImageData[];
  fallbackAlt: string;
}

function FacilityImageSlider({
  images,
  fallbackAlt,
}: FacilityImageSliderProps) {
  console.log("[DEBUG] FacilityImageSlider received images:", images);
  console.log("[DEBUG] Images count:", images.length);

  // Slider settings for facility images
  const sliderSettings = {
    dots: true,
    arrows: false, // Explicitly disable arrows
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: images.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    fade: false,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  console.log("[DEBUG] Sorted images:", sortedImages);

  // If only one image, display without slider
  if (sortedImages.length === 1) {
    console.log("[DEBUG] Only one image, showing without slider");
    const image = sortedImages[0];
    return (
      <div className="facility-image-slider single-image">
        <ResponsiveImg
          srcs={getOptimizedImageUrls(image.url)}
          alt={image.alt || fallbackAlt}
          width={600}
          height={400}
          className="img-fluid rounded facility-image"
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  // Multiple images - use slider
  console.log(
    "[DEBUG] Multiple images, showing slider with",
    sortedImages.length,
    "images"
  );
  return (
    <div className="facility-image-slider">
      <Slider {...sliderSettings}>
        {sortedImages.map((image, index) => (
          <div key={image._id || index} className="slider-item">
            <ResponsiveImg
              srcs={getOptimizedImageUrls(image.url)}
              alt={image.alt || `${fallbackAlt} - ${index + 1}`}
              width={600}
              height={400}
              className="img-fluid facility-image"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

interface FacilitiesProps {
  facilitiesData: FacilitiesData;
}

export default function Facilities({ facilitiesData }: FacilitiesProps) {
  // Không dùng SWR, chỉ nhận facilitiesData từ props
  const data = facilitiesData;

  // Intersection Observer để trigger animation khi metrics section vào viewport
  const [metricsRef, shouldStartAnimation] = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: "-50px",
  });

  if (!data) {
    return (
      <section className="facilities-overview py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="text-info">Đang tải dữ liệu facilities...</h2>
          </div>
        </div>
      </section>
    );
  }

  // Type guard to check if feature is new format
  const isNewFeatureFormat = (
    feature: FacilityFeature | LegacyFacilityFeature
  ): feature is FacilityFeature => {
    return "_id" in feature && "images" in feature;
  };

  // Helper function to process images
  const processFeatureImages = (
    feature: FacilityFeature | LegacyFacilityFeature
  ): ImageData[] => {
    console.log("[DEBUG] Processing feature:", feature);

    // Handle new format with images array
    if (
      isNewFeatureFormat(feature) &&
      feature.images &&
      Array.isArray(feature.images) &&
      feature.images.length > 0
    ) {
      console.log(
        "[DEBUG] Using new images array format, count:",
        feature.images.length
      );
      console.log("[DEBUG] Images data:", feature.images);
      return feature.images;
    }

    // Fallback to legacy image field if images array is empty or missing
    if (feature.image) {
      console.log("[DEBUG] Using legacy image field:", feature.image);
      const featureId = isNewFeatureFormat(feature) ? feature._id : feature.id;
      return [
        {
          url: feature.image,
          alt: feature.imageAlt || feature.title,
          order: 1,
          _id: `fallback-${featureId || "unknown"}`,
        },
      ];
    }

    // Return empty array if no images found
    console.log("[DEBUG] No images found for feature");
    return [];
  };

  return (
    <>
      {/* Facilities Overview */}
      <section className="facilities-overview py-5">
        <div className="container">
          <h2 className="section-title mt-5">{data.pageTitle}</h2>

          {/* Key Metrics */}
          <div className="key-metrics text-center mb-5" ref={metricsRef}>
            <div className="row justify-content-center">
              {data.keyMetrics.map((metric, index) => (
                <div key={metric.id || `metric-${index}`} className="col-md-4">
                  <AnimatedMetric
                    value={metric.value}
                    unit={metric.unit}
                    label={metric.label}
                    icon={metric.icon}
                    startAnimation={shouldStartAnimation}
                    duration={2500}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Facility Features */}
          <div className="facility-features">
            {data.facilityFeatures.map((feature) => {
              const images = processFeatureImages(feature);
              if (images.length === 0) return null;
              const featureKey = isNewFeatureFormat(feature)
                ? feature._id
                : feature.id;
              return (
                <div
                  key={featureKey}
                  className={`feature-item row mb-5 ${
                    feature.layout === "right" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="col-lg-6 feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                  <div className="col-lg-6 feature-image">
                    <FacilityImageSlider
                      images={images}
                      fallbackAlt={feature.imageAlt}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
