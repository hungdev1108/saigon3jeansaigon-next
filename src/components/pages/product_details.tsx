"use client";

import { useState, useEffect } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { BACKEND_DOMAIN } from '@/api/config';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/plugins/counter.css';
import useSWR from "swr";
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

interface ProductDetailsProps {
  product: ProductDetails | null;
  error: string | null;
  id: string;
}

export default function ProductDetails({ product, error, id }: ProductDetailsProps) {
  // Tạo state riêng cho từng application lightbox
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<Array<{src: string, alt: string, key: string}>>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
          
          return {
            src: `${BACKEND_DOMAIN}${imgUrl}?v=${index}`,
            width: 4,
            height: 3,
            alt: img.alt || `Image ${index + 1}`,
            key: `${applicationId}-${imgUrl}-${index}`,
          };
        });
    } catch (error) {
      console.error(`Error preparing gallery images for ${applicationId}:`, error);
      return [];
    }
  };

  // Function to open lightbox with specific images
  const openLightbox = (applicationId: string, images: Array<{src: string, alt: string, key: string}>, index: number) => {
    if (!images || images.length === 0) {
      console.error("No images provided to lightbox", { applicationId, index });
      return;
    }
    
    // Set active lightbox ID
    setActiveLightbox(applicationId);
    setLightboxImages(images);
    setLightboxIndex(index);
    
    // Log để debug chi tiết hơn
    console.log("Opening lightbox with details:", { 
      applicationId, 
      imagesCount: images.length, 
      index,
      firstImage: images[0]
    });
  };

  // Function to close lightbox
  const closeLightbox = () => {
    console.log("Closing lightbox for application:", activeLightbox);
    setActiveLightbox(null);
  };

  // Đảm bảo lightbox hoạt động cho tất cả sản phẩm
  useEffect(() => {
    if (activeLightbox && lightboxImages.length === 0) {
      console.warn('Lightbox opened but no images available');
      closeLightbox();
    }
  }, [activeLightbox, lightboxImages]);

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
                                      if (galleryImages.length === 3) {
                                        // 2 ảnh trên, 1 ảnh lớn dưới
                                        return (
                                          <div style={{ display: 'grid', gridTemplateRows: '160px 200px', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            <img
                                              src={galleryImages[0].src}
                                              alt={galleryImages[0].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, gridRow: 1, gridColumn: 1 }}
                                              onClick={() => { openLightbox(application.id, galleryImages, 0); }}
                                            />
                                            <img
                                              src={galleryImages[1].src}
                                              alt={galleryImages[1].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, gridRow: 1, gridColumn: 2 }}
                                              onClick={() => { openLightbox(application.id, galleryImages, 1); }}
                                            />
                                            <img
                                              src={galleryImages[2].src}
                                              alt={galleryImages[2].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, gridRow: 2, gridColumn: '1 / span 2' }}
                                              onClick={() => { openLightbox(application.id, galleryImages, 2); }}
                                            />
                                          </div>
                                        );
                                      } else if (galleryImages.length === 4) {
                                        // 2x2 grid
                                        return (
                                          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            {galleryImages.map((img, idx) => (
                                              <img
                                                key={idx}
                                                src={img.src}
                                                alt={img.alt}
                                                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }}
                                                onClick={() => { openLightbox(application.id, galleryImages, idx); }}
                                              />
                                            ))}
                                          </div>
                                        );
                                      } else if (galleryImages.length === 5) {
                                        // 2 trên, 3 dưới
                                        return (
                                          <div style={{ display: 'grid', gridTemplateRows: '120px 120px', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                            <img
                                              src={galleryImages[0].src}
                                              alt={galleryImages[0].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, gridRow: 1, gridColumn: '1 / span 2' }}
                                              onClick={() => { openLightbox(application.id, galleryImages, 0); }}
                                            />
                                            <img
                                              src={galleryImages[1].src}
                                              alt={galleryImages[1].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, gridRow: 1, gridColumn: 3 }}
                                              onClick={() => { openLightbox(application.id, galleryImages, 1); }}
                                            />
                                            <img
                                              src={galleryImages[2].src}
                                              alt={galleryImages[2].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, gridRow: 2, gridColumn: 1 }}
                                              onClick={() => { openLightbox(application.id, galleryImages, 2); }}
                                            />
                                            <img
                                              src={galleryImages[3].src}
                                              alt={galleryImages[3].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, gridRow: 2, gridColumn: 2 }}
                                              onClick={() => { openLightbox(application.id, galleryImages, 3); }}
                                            />
                                            <img
                                              src={galleryImages[4].src}
                                              alt={galleryImages[4].alt}
                                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, gridRow: 2, gridColumn: 3 }}
                                              onClick={() => { openLightbox(application.id, galleryImages, 4); }}
                                            />
                                          </div>
                                        );
                                      } else if (galleryImages.length === 6) {
                                        // 3x2 grid
                                        return (
                                          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                            {galleryImages.map((img, idx) => (
                                              <img
                                                key={idx}
                                                src={img.src}
                                                alt={img.alt}
                                                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                                                onClick={() => { openLightbox(application.id, galleryImages, idx); }}
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
                                              <img
                                                key={idx}
                                                src={img.src}
                                                alt={img.alt}
                                                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                                                onClick={() => { openLightbox(application.id, galleryImages, idx); }}
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
                                              onClick={() => { openLightbox(application.id, galleryImages, 0); }}
                                            />
                                          </div>
                                        );
                                      } else if (galleryImages.length === 2) {
                                        // 2 ảnh
                                        return (
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            {galleryImages.map((img, idx) => (
                                              <img
                                                key={idx}
                                                src={img.src}
                                                alt={img.alt}
                                                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }}
                                                onClick={() => { openLightbox(application.id, galleryImages, idx); }}
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
                                  <Lightbox
                                    open={activeLightbox === application.id}
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
        }
        .gallery-img {
          cursor: zoom-in;
          transition: transform 0.3s;
        }
        .gallery-img:hover {
          transform: scale(1.08);
          z-index: 2;
        }
        .gallery-img-wrapper img, .application-gallery img {
          cursor: zoom-in;
          transition: transform 0.3s;
        }
        .gallery-img-wrapper img:hover, .application-gallery img:hover {
          transform: scale(1.08);
          z-index: 2;
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
