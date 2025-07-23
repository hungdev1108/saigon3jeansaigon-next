"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { BACKEND_DOMAIN } from '@/api/config';
import useSWR from "swr";

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
                              <Image
                                src={`${BACKEND_DOMAIN}${image.url}`}
                                alt={image.alt}
                                className="img-fluid w-100"
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
