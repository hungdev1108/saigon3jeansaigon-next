"use client";

import Image from "next/image";
import Slider from "react-slick";
import { BACKEND_DOMAIN } from "../../api/config";
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
        <Image
          src={`${BACKEND_DOMAIN}${image.url}`}
          alt={image.alt || fallbackAlt}
          width={600}
          height={400}
          className="img-fluid rounded"
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
            <Image
              src={`${BACKEND_DOMAIN}${image.url}`}
              alt={image.alt || `${fallbackAlt} - ${index + 1}`}
              width={600}
              height={400}
              className="img-fluid"
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
  // Intersection Observer để trigger animation khi metrics section vào viewport
  const [metricsRef, shouldStartAnimation] = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: "-50px",
  });

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

  if (!facilitiesData) {
    return (
      <section className="facilities-overview py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="text-danger">Error loading facilities data</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Facilities Overview */}
      <section className="facilities-overview py-5">
        <div className="container">
          <h2 className="section-title mt-5">{facilitiesData.pageTitle}</h2>

          {/* Key Metrics */}
          <div className="key-metrics text-center mb-5" ref={metricsRef}>
            <div className="row justify-content-center">
              {facilitiesData.keyMetrics.map((metric) => (
                <div key={metric.id} className="col-md-4">
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
            {facilitiesData.facilityFeatures.map((feature) => {
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
