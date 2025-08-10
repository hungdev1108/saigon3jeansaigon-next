"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BACKEND_DOMAIN } from '@/api/config';
import { getOptimizedImageUrls } from "../../shared/imageUtils";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/counter.css';
import productsService from "@/services/productsService";

// TypeScript interfaces
interface ProductFeature {
  id: string;
  icon: string;
  text: string;
  order: number;
}

interface ApplicationImage {
  url: string;
  alt: string;
  order: number;
}

interface ApplicationContent {
  heading: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  images: ApplicationImage[];
}

interface ProductApplication {
  id: string;
  title: string;
  content: ApplicationContent;
  order: number;
  accordionId: string;
  isExpanded: boolean;
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  isActive: boolean;
}

interface CarouselSettings {
  interval: number;
  autoplay: boolean;
  showIndicators: boolean;
  showControls: boolean;
}

interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

interface ProductDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  mainImage: string;
  mainImageAlt: string;
  galleryImages: GalleryImage[];
  features: ProductFeature[];
  applications: ProductApplication[];
  carouselSettings: CarouselSettings;
  seo: ProductSEO;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string | null;
  updatedAt: string | null;
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

interface ProductDetailsProps {
  product: ProductDetails | null;
  error: string | null;
  id: string;
}

export default function ProductDetails({ product, error, id }: ProductDetailsProps) {
  // Simplified lightbox state - no need for application ID tracking
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<Array<{src: string, alt: string, key: string}>>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Gallery Image Component with hover effects
  const GalleryImage = ({ src, alt, style, onClick, index }: {
    src: string;
    alt: string;
    style: React.CSSProperties;
    onClick: () => void;
    index: number;
  }) => (
    <img
      src={src}
      alt={alt}
      style={{ 
        ...style,
        cursor: 'zoom-in',
        transition: 'all 0.3s ease'
      }}
      className="cursor-pointer gallery-img"
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.zIndex = '100';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        e.currentTarget.style.position = 'relative';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.zIndex = '1';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.position = 'static';
      }}
    />
  );

  // Không dùng SWR, chỉ nhận product từ props
  // Helper function to prepare images for react-photo-gallery
  const prepareGalleryImages = (images: ApplicationImage[] | undefined, applicationId: string) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      console.warn(`No valid images found for application ${applicationId}`);
      // Trả về mảng rỗng hoặc một ảnh mặc định nếu không có ảnh
      return [];
    }

    try {
      return images
        .sort((a, b) => a.order - b.order)
        .map((img, index) => {
          // Đảm bảo URL ảnh hợp lệ
          const imgUrl = img.url || '';
          // Sử dụng getOptimizedImageUrls để tạo các phiên bản tối ưu của ảnh
          const optimizedSrcs = getOptimizedImageUrls(imgUrl);
          
          return {
            src: optimizedSrcs.origin || `${BACKEND_DOMAIN}${imgUrl}?v=${index}`,
            width: 4,
            height: 3,
            alt: img.alt || `Image ${index + 1}`,
            key: `${applicationId}-${imgUrl}-${index}`,
            optimizedSrcs: optimizedSrcs, // Lưu các phiên bản tối ưu để sử dụng sau này
          };
        });
    } catch (error) {
      console.error(`Error preparing gallery images for ${applicationId}:`, error);
      return [];
    }
  };

  // Function to open lightbox with specific images
  const openLightbox = (images: Array<{src: string, alt: string, key: string, optimizedSrcs?: any}>, index: number) => {
    console.log("🖼️ Opening lightbox:", { index, imagesCount: images?.length });
    
    if (!images || images.length === 0) {
      console.error("❌ No images provided to lightbox", { index });
      return;
    }
    
    // Prepare images for lightbox with proper src format
    const lightboxReadyImages = images.map(img => ({
      src: img.optimizedSrcs?.medium || img.optimizedSrcs?.webp || img.src,
      alt: img.alt || 'Gallery Image',
      key: img.key
    }));
    
    console.log("✅ Lightbox images prepared:", lightboxReadyImages);
    
    // Open lightbox
    setIsLightboxOpen(true);
    setLightboxImages(lightboxReadyImages);
    setLightboxIndex(index);
  };

  // Function to close lightbox
  const closeLightbox = () => {
    console.log("Closing lightbox");
    setIsLightboxOpen(false);
    setLightboxImages([]);
  };

  // Đảm bảo lightbox hoạt động
  useEffect(() => {
    if (isLightboxOpen && lightboxImages.length === 0) {
      console.warn('Lightbox opened but no images available');
      closeLightbox();
    }
  }, [isLightboxOpen, lightboxImages]);

  // Force hover effects and click handlers on all gallery images
  useEffect(() => {
    const addEffectsAndHandlers = () => {
      const galleryImages = document.querySelectorAll('.application-gallery img, .accordion-body img');
      
      galleryImages.forEach((img, globalIndex) => {
        const imgElement = img as HTMLImageElement;
        
        // Set base styles
        imgElement.style.cursor = 'zoom-in';
        imgElement.style.transition = 'all 0.3s ease';
        imgElement.style.borderRadius = '8px';
        
        // Add hover effects
        imgElement.onmouseenter = () => {
          imgElement.style.transform = 'scale(1.08)';
          imgElement.style.zIndex = '100';
          imgElement.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          imgElement.style.position = 'relative';
        };
        
        imgElement.onmouseleave = () => {
          imgElement.style.transform = 'scale(1)';
          imgElement.style.zIndex = '1';
          imgElement.style.boxShadow = 'none';
          imgElement.style.position = 'static';
        };

        // Force click handler if it doesn't already have one
        if (!imgElement.onclick) {
          // Find the parent gallery container to get the correct images array
          const galleryContainer = imgElement.closest('.application-gallery');
          if (galleryContainer) {
            const imagesInThisGallery = galleryContainer.querySelectorAll('img');
            const imageIndex = Array.from(imagesInThisGallery).indexOf(imgElement);
            
            imgElement.onclick = () => {
              // Extract image data from DOM
              const images = Array.from(imagesInThisGallery).map((img, idx) => ({
                src: (img as HTMLImageElement).src,
                alt: (img as HTMLImageElement).alt || `Gallery Image ${idx + 1}`,
                key: `gallery-${idx}`,
                optimizedSrcs: null
              }));
              
              console.log(`🖼️ Force click handler - opening lightbox for image ${imageIndex}`, images);
              openLightbox(images, imageIndex);
            };
          }
        }
      });
    };

    // Apply effects on mount and when product changes
    const timer = setTimeout(addEffectsAndHandlers, 200);
    
    return () => {
      clearTimeout(timer);
    };
  }, [product]);

  // Loading state (không còn fetch client, chỉ check nếu product null và không có error)
  if (!product && !error) {
    return (
      <section className="product-details-section py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if ((error || !product) && !error) {
    return (
      <section className="product-details-section py-5">
        <div className="container">
          <div className="alert alert-danger text-center" role="alert">
            <h4 className="alert-heading">Lỗi!</h4>
            <p>{error || "Không thể tải dữ liệu sản phẩm."}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Không có dữ liệu
  if (!product) {
    return (
      <section className="product-details-section py-5">
        <div className="container">
          <div className="alert alert-warning text-center" role="alert">
            <h4 className="alert-heading">Không tìm thấy sản phẩm!</h4>
            <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link href="/products" className="btn btn-primary">
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="product-details-section py-5">
        <div className="container">
          {/* Product Title */}
          <div className="product-header text-center mb-5">
            <h1 className="product-title mt-5">{product!.name}</h1>
            <p className="product-description">{product!.description}</p>
          </div>

          {/* Product Main Image */}
          {/* <div className="product-image-container text-center mb-5">
            <Image
              src={`${BACKEND_DOMAIN}${product.mainImage}`}
              alt={product.mainImageAlt}
              className="product-image img-fluid rounded"
              width={600}
              height={400}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div> */}

          {/* Product Features */}
          {product!.features && product!.features.length > 0 && (
            <div className="product-features mb-5">
              {/* <h3 className="section-title text-center mb-4">Key Features</h3> */}
              {/* <div className="row justify-content-center">
                <div className="col-lg-8">
                  <ul className="features-list list-unstyled">
                    {product.features.map((feature) => (
                      <li key={feature.id} className="feature-item mb-3">
                        <span className="feature-bullet">•</span>
                        <span className="feature-text">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}
            </div>
          )}

          {/* Applications Section */}
          {product!.applications && product!.applications.length > 0 && (
            <div className="applications-section mb-5">
              {/* <h3 className="section-title text-center mb-4">Applications</h3> */}
              <div className="accordion" id="applicationsAccordion">
                {product!.applications.map((application, idx) => {
                  const galleryImages = application.content.images 
                    ? prepareGalleryImages(application.content.images, application.id)
                    : [];

                  return (
                    <div key={application.id || idx} className="accordion-item mb-3">
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${
                            !application.isExpanded ? "collapsed" : ""
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${application.accordionId}`}
                          aria-expanded={application.isExpanded}
                          aria-controls={application.accordionId}
                        >
                          <i className="fas fa-plus accordion-icon me-2"></i>
                          {application.title}
                        </button>
                      </h2>
                      <div
                        id={application.accordionId}
                        className={`accordion-collapse collapse ${
                          application.isExpanded ? "show" : ""
                        }`}
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-lg-6 mb-4">
                              <h4 className="application-heading mb-3">
                                {application.content.heading}
                              </h4>
                              <p className="application-description mb-3">
                                {application.content.description}
                              </p>
                              {application.content.features.length > 0 && (
                                <div className="application-features">
                                  <h5 className="mb-3">Features:</h5>
                                  <ul className="list-unstyled">
                                    {application.content.features.map(
                                      (feature, featureIndex) => (
                                        <li key={featureIndex} className="mb-2">
                                          {/* <span className="feature-bullet">•</span> */}
                                          <span className="ms-2">{feature}</span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <div className="col-lg-6">
                              {galleryImages && galleryImages.length > 0 ? (
                                <div className="application-gallery">
                                  {(() => {
                                    try {
                                      if (galleryImages.length === 1) {
                                        // Single image
                                        return (
                                          <GalleryImage
                                            src={galleryImages[0].optimizedSrcs?.medium || galleryImages[0].src}
                                            alt={galleryImages[0].alt}
                                            style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 8 }}
                                            onClick={() => { openLightbox(galleryImages, 0); }}
                                            index={0}
                                          />
                                        );
                                      } else if (galleryImages.length === 2) {
                                        // 2 images side by side
                                        return (
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            {galleryImages.map((img, idx) => (
                                              <GalleryImage
                                                key={idx}
                                                src={img.optimizedSrcs?.medium || img.src}
                                                alt={img.alt}
                                                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }}
                                                onClick={() => { openLightbox(galleryImages, idx); }}
                                                index={idx}
                                              />
                                            ))}
                                          </div>
                                        );
                                      } else if (galleryImages.length === 3) {
                                        // 2 ảnh trên, 1 ảnh lớn dưới
                                        return (
                                          <div style={{ display: 'grid', gridTemplateRows: '160px 200px', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            <GalleryImage
                                              src={galleryImages[0].optimizedSrcs?.medium || galleryImages[0].src}
                                              alt={galleryImages[0].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                              onClick={() => { openLightbox(galleryImages, 0); }}
                                              index={0}
                                            />
                                            <GalleryImage
                                              src={galleryImages[1].optimizedSrcs?.medium || galleryImages[1].src}
                                              alt={galleryImages[1].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                              onClick={() => { openLightbox(galleryImages, 1); }}
                                              index={1}
                                            />
                                            <GalleryImage
                                              src={galleryImages[2].optimizedSrcs?.medium || galleryImages[2].src}
                                              alt={galleryImages[2].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, gridColumn: '1 / -1' }}
                                              onClick={() => { openLightbox(galleryImages, 2); }}
                                              index={2}
                                            />
                                          </div>
                                        );
                                      } else if (galleryImages.length === 4) {
                                        // 2x2 grid
                                        return (
                                          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            {galleryImages.map((img, idx) => (
                                              <GalleryImage
                                                key={idx}
                                                src={img.optimizedSrcs?.medium || img.src}
                                                alt={img.alt}
                                                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }}
                                                onClick={() => { openLightbox(galleryImages, idx); }}
                                                index={idx}
                                              />
                                            ))}
                                          </div>
                                        );
                                      } else if (galleryImages.length === 5) {
                                        // 2 trên, 3 dưới
                                        return (
                                          <div style={{ display: 'grid', gridTemplateRows: '120px 120px', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                            <ResponsiveImg
                                              srcs={galleryImages[0].optimizedSrcs || getOptimizedImageUrls(galleryImages[0].src)}
                                              alt={galleryImages[0].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                              className="cursor-pointer gallery-img"
                                              width={800}
                                              height={400}
                                              onClick={() => { openLightbox(galleryImages, 0); }}
                                            />
                                            <ResponsiveImg
                                              srcs={galleryImages[1].optimizedSrcs || getOptimizedImageUrls(galleryImages[1].src)}
                                              alt={galleryImages[1].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                              className="cursor-pointer gallery-img"
                                              width={400}
                                              height={300}
                                              onClick={() => { openLightbox(galleryImages, 1); }}
                                            />
                                            <ResponsiveImg
                                              srcs={galleryImages[2].optimizedSrcs || getOptimizedImageUrls(galleryImages[2].src)}
                                              alt={galleryImages[2].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                              className="cursor-pointer gallery-img"
                                              width={400}
                                              height={300}
                                              onClick={() => { openLightbox(galleryImages, 2); }}
                                            />
                                            <ResponsiveImg
                                              srcs={galleryImages[3].optimizedSrcs || getOptimizedImageUrls(galleryImages[3].src)}
                                              alt={galleryImages[3].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                              className="cursor-pointer gallery-img"
                                              width={400}
                                              height={300}
                                              onClick={() => { openLightbox(galleryImages, 3); }}
                                            />
                                            <ResponsiveImg
                                              srcs={galleryImages[4].optimizedSrcs || getOptimizedImageUrls(galleryImages[4].src)}
                                              alt={galleryImages[4].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                              className="cursor-pointer gallery-img"
                                              width={400}
                                              height={300}
                                              onClick={() => { openLightbox(galleryImages, 4); }}
                                            />
                                          </div>
                                        );
                                      } else if (galleryImages.length === 6) {
                                        // 3x2 grid
                                        return (
                                          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                            {galleryImages.map((img, idx) => (
                                              <ResponsiveImg
                                                key={idx}
                                                srcs={img.optimizedSrcs || getOptimizedImageUrls(img.src)}
                                                alt={img.alt}
                                                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                                                onClick={() => { openLightbox(galleryImages, idx); }}
                                              />
                                            ))}
                                          </div>
                                        );
                                      } else if (galleryImages.length > 6) {
                                        // grid đều 3 cột, maxHeight, scroll
                                        return (
                                          <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr 1fr',
                                            gap: 8,
                                            maxHeight: 400,
                                            overflowY: 'auto',
                                          }}>
                                            {galleryImages.map((img, idx) => (
                                              <ResponsiveImg
                                                key={idx}
                                                srcs={img.optimizedSrcs || getOptimizedImageUrls(img.src)}
                                                alt={img.alt}
                                                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                                                onClick={() => { openLightbox(galleryImages, idx); }}
                                              />
                                            ))}
                                          </div>
                                        );
                                      } else if (galleryImages.length === 1) {
                                        // 1 ảnh
                                        return (
                                          <div style={{ textAlign: 'center' }}>
                                            <img
                                              src={galleryImages[0].src}
                                              alt={galleryImages[0].alt}
                                              style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, objectFit: 'cover', cursor: 'zoom-in' }}
                                              onClick={() => { openLightbox(galleryImages, 0); }}
                                            />
                                          </div>
                                        );
                                      } else if (galleryImages.length === 2) {
                                        // 2 ảnh
                                        return (
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            {galleryImages.map((img, idx) => (
                                              <ResponsiveImg
                                                key={idx}
                                                srcs={img.optimizedSrcs || getOptimizedImageUrls(img.src)}
                                                alt={img.alt}
                                                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }}
                                                onClick={() => { openLightbox(galleryImages, idx); }}
                                              />
                                            ))}
                                          </div>
                                        );
                                      } else {
                                        return null;
                                      }
                                    } catch (error) {
                                      console.error(`Error preparing gallery images for ${application.id}:`, error);
                                      return null;
                                    }
                                  })()}
                                </div>
                              ) : (
                                <div className="single-image text-center">
                                  <Image
                                    src={`${BACKEND_DOMAIN}${application.content.image}`}
                                    alt={application.content.imageAlt}
                                    className="application-image img-fluid rounded"
                                    width={400}
                                    height={300}
                                    style={{ maxWidth: "100%", height: "auto" }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Global Lightbox for all applications */}
          <Lightbox
            open={isLightboxOpen}
            close={closeLightbox}
            slides={lightboxImages.map(img => ({ 
              src: img.src, 
              alt: img.alt
            }))}
            index={lightboxIndex}
            styles={{ 
              container: { backgroundColor: 'rgba(0,0,0,0.95)' },
              toolbar: { gap: '15px', padding: '0 15px' }
            }}
            plugins={[
              Thumbnails, 
              Zoom, 
              Counter
            ]}
            thumbnails={{
              padding: 5,
              gap: 10,
              width: 80,
              height: 60
            }}
            zoom={{
              maxZoomPixelRatio: 3,
              zoomInMultiplier: 1.5
            }}
            carousel={{ finite: true }}
            animation={{ swipe: 250 }}
            controller={{ 
              closeOnBackdropClick: true, 
              closeOnPullDown: true,
              touchAction: "none"
            }}
            render={{
              iconNext: () => <span className="lightbox-nav-icon">›</span>,
              iconPrev: () => <span className="lightbox-nav-icon">‹</span>,
              iconClose: () => <span className="lightbox-close-icon">×</span>,
            }}
          />

          {/* Back to Products Button */}
          <div className="back-to-products text-center mt-5">
            <Link href="/products" className="btn btn-outline-primary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Products
            </Link>
          </div>

          {/* Error message if API failed but we have fallback data */}
          {error && (
            <div className="alert alert-warning mt-4" role="alert">
              <small>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error} Hiển thị dữ liệu mặc định.
              </small>
            </div>
          )}
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        .product-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 1rem;
        }

        .product-description {
          font-size: 1.1rem;
          color: #666;
          max-width: 800px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 3px;
          background-color: #1e4f7a;
        }

        .features-list {
          font-size: 1.1rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          padding: 0.5rem 0;
          background: transparent;
        }

        .feature-bullet {
          color: #1e4f7a;
          font-size: 1.5rem;
          font-weight: bold;
          margin-right: 1rem;
          line-height: 1.2;
        }

        .feature-text {
          flex: 1;
          line-height: 1.6;
        }

        .accordion-button {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .accordion-icon {
          transition: transform 0.3s ease;
        }

        .accordion-button:not(.collapsed) .accordion-icon {
          transform: rotate(45deg);
        }

        .application-heading {
          color: #333;
          font-weight: bold;
        }

        .application-description {
          color: #666;
          line-height: 1.6;
        }

        .application-features h5 {
          color: #333;
          font-weight: 600;
        }

        .application-gallery {
          border-radius: 8px;
          overflow: hidden;
        }

        .application-gallery img {
          border-radius: 4px;
          transition: transform 0.3s ease;
        }

        .application-gallery img:hover {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .product-title {
            font-size: 2rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .features-list {
            font-size: 1rem;
          }

          .feature-bullet {
            font-size: 1.3rem;
            margin-right: 0.8rem;
          }

          .accordion-button {
            font-size: 1rem;
            padding: 0.75rem 1rem;
          }

          .application-heading {
            font-size: 1.3rem;
          }

          .row > div {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 576px) {
          .product-title {
            font-size: 1.8rem;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .feature-item {
            padding: 0.3rem 0;
          }

          .accordion-body {
            padding: 1rem;
          }

          .application-heading {
            font-size: 1.2rem;
          }
        }

        .gallery-img-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .gallery-img {
          cursor: zoom-in;
          transition: all 0.3s ease;
          border-radius: 8px;
        }
        
        .gallery-img:hover {
          transform: scale(1.08);
          z-index: 2;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .application-gallery {
          overflow: visible;
          border-radius: 8px;
        }
        
        /* Target all images in application gallery */
        .application-gallery img,
        .application-gallery .gallery-img,
        .application-gallery .cursor-pointer {
          cursor: zoom-in !important;
          transition: all 0.3s ease !important;
          border-radius: 8px !important;
          display: block !important;
        }
        
        .application-gallery img:hover,
        .application-gallery .gallery-img:hover,
        .application-gallery .cursor-pointer:hover {
          transform: scale(1.08) !important;
          z-index: 100 !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          position: relative !important;
        }
        
        /* More specific targeting for ResponsiveImg */
        div[style*="grid"] img {
          cursor: zoom-in !important;
          transition: all 0.3s ease !important;
        }
        
        div[style*="grid"] img:hover {
          transform: scale(1.08) !important;
          z-index: 100 !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          position: relative !important;
        }
        
        /* Nuclear option - force all images in product details to have hover */
        .accordion-body img {
          cursor: zoom-in !important;
          transition: all 0.3s ease !important;
          border-radius: 8px !important;
        }
        
        .accordion-body img:hover {
          transform: scale(1.08) !important;
          z-index: 100 !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          position: relative !important;
        }
        
        /* Target all images with onclick handlers */
        img[onclick] {
          cursor: zoom-in !important;
          transition: all 0.3s ease !important;
        }
        
        img[onclick]:hover {
          transform: scale(1.08) !important;
          z-index: 100 !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          position: relative !important;
        }
        
        /* Lightbox custom styles */
        .lightbox-nav-icon {
          font-size: 40px;
          color: white;
          opacity: 0.8;
          transition: opacity 0.3s;
          cursor: pointer;
        }
        
        .lightbox-nav-icon:hover {
          opacity: 1;
        }
        
        .lightbox-close-icon {
          font-size: 36px;
          color: white;
          opacity: 0.8;
          transition: opacity 0.3s;
          cursor: pointer;
          position: static;
          top: auto;
          right: auto;
          z-index: 1000;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
        }
        
        .lightbox-close-icon:hover {
          opacity: 1;
        }
        
        /* Đảm bảo các nút điều khiển có khoảng cách đều nhau */
        :global(.yarl__toolbar) {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 20px !important;
          padding: 10px 20px !important;
          position: fixed !important;
          top: 0 !important;
          right: 0 !important;
          left: 0 !important;
          height: 60px !important;
          background: rgba(0,0,0,0.5) !important;
          z-index: 9999 !important;
        }
        
        :global(.yarl__toolbar_right) {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          height: 40px !important;
          position: static !important;
          transform: none !important;
          flex: 1 !important;
        }
        
        :global(.yarl__toolbar_item) {
          margin: 0 5px !important;
        }
        
        :global(.yarl__button) {
          margin: 0 5px !important;
          background-color: transparent !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        :global(.yarl__container) {
          --yarl__color_backdrop: rgba(0, 0, 0, 0.95) !important;
          --yarl__spacing_buttons: 20px !important;
        }
        
        /* Đảm bảo tất cả các nút có kích thước đồng nhất */
        :global(.yarl__icon) {
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 !important;
        }
        
        /* Đảm bảo nút đóng nằm trên cùng một hàng với các nút khác */
        :global(.yarl__toolbar .yarl__button) {
          position: static !important;
          transform: none !important;
          top: auto !important;
          right: auto !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 40px !important;
          height: 40px !important;
        }
        
        /* Đảm bảo các nút zoom nằm trên cùng một hàng */
        :global(.yarl__slide__button) {
          position: static !important;
          transform: none !important;
          margin: 0 5px !important;
        }
        
        /* Ensure lightbox navigation controls are visible on mobile */
        @media (max-width: 768px) {
          .lightbox-nav-icon {
            font-size: 30px;
          }
        }
      `}</style>
    </>
  );
}
