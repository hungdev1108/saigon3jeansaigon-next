"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { BACKEND_DOMAIN } from '@/api/config';
import { getOptimizedImageUrls } from "../../shared/imageUtils";

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

interface Product {
  id: string;
  name: string;
  slug: string;
  galleryImages: GalleryImage[];
  carouselSettings: CarouselSettings;
  order: number;
  isActive: boolean;
}

interface ProductsData {
  products: Product[];
  totalProducts: number;
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

interface ProductsProps {
  productsData: ProductsData | null;
}

function generateCarouselId(productSlug: string) {
  return `${productSlug}Carousel`;
}

function generateCarouselTarget(productSlug: string) {
  return `#${generateCarouselId(productSlug)}`;
}

export default function Products({ productsData }: ProductsProps) {
  // Không dùng SWR, chỉ nhận productsData từ props
  const data = productsData;

  useEffect(() => {
    if (data && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        const carousels = document.querySelectorAll('.carousel') as NodeListOf<Element>;
        carousels.forEach((carousel: Element) => {
          if ((window as any).bootstrap && (window as any).bootstrap.Carousel) {
            new (window as any).bootstrap.Carousel(carousel, {
              interval: 3500,
              wrap: true
            });
          }
        });
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) {
    return (
      <section className="product-section py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="text-info">Đang tải dữ liệu sản phẩm...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="product-section py-5">
        <div className="container">
          <h2 className="section-title mt-5">PRODUCT</h2>
          <div className="row g-4 product-row">
            {data!.products.map((product) => {
              const carouselId = generateCarouselId(product.slug);
              const carouselTarget = generateCarouselTarget(product.slug);

              return (
                <div key={product.id} className="col-lg-4 col-md-6 col-sm-12">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-decoration-none"
                  >
                    <div
                      className="product-card position-relative"
                      data-product={product.slug}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        id={carouselId}
                        className="carousel slide"
                        data-bs-ride={
                          product.carouselSettings.autoplay
                            ? "carousel"
                            : "false"
                        }
                        data-bs-interval={product.carouselSettings.interval}
                      >
                        <div className="carousel-inner">
                          {product.galleryImages.map((image, index) => (
                            <div
                              key={image.id || index}
                              className={`carousel-item ${
                                index === 0 ? "active" : ""
                              }`}
                            >
                              <ResponsiveImg
                                srcs={getOptimizedImageUrls(image.url)}
                                alt={image.alt}
                                className="img-fluid w-100 product-image"
                                width={500}
                                height={500}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Product Overlay */}
                        <div className="product-overlay d-flex align-items-center justify-content-center">
                          <h2 className="text-white product-title">
                            {product.name}
                          </h2>
                        </div>

                        {/* Carousel Indicators */}
                        {product.carouselSettings.showIndicators &&
                          product.galleryImages.length > 1 && (
                            <div className="carousel-indicators product-indicators">
                              {product.galleryImages.map((_, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  data-bs-target={carouselTarget}
                                  data-bs-slide-to={index}
                                  className={index === 0 ? "active" : ""}
                                  aria-current={index === 0 ? "true" : "false"}
                                  aria-label={`Slide ${index + 1}`}
                                ></button>
                              ))}
                            </div>
                          )}

                        {/* Carousel Controls */}
                        {product.galleryImages.length > 1 && (
                          <>
                            <button
                              className="carousel-control-prev"
                              type="button"
                              data-bs-target={carouselTarget}
                              data-bs-slide="prev"
                            >
                              <span
                                className="carousel-control-prev-icon"
                                aria-hidden="true"
                              ></span>
                              <span className="visually-hidden">
                                Previous
                              </span>
                            </button>
                            <button
                              className="carousel-control-next"
                              type="button"
                              data-bs-target={carouselTarget}
                              data-bs-slide="next"
                            >
                              <span
                                className="carousel-control-next-icon"
                                aria-hidden="true"
                              ></span>
                              <span className="visually-hidden">Next</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
