"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { productsService } from "../../services";

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

export default function Products() {
  const [productsData, setProductsData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const data = await productsService.getCompleteProductsData();
        setProductsData(data as ProductsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products data:", err);
        setError("Failed to load products data");
        // Sử dụng dữ liệu mặc định khi có lỗi
        const defaultData = productsService.getDefaultProductsData();
        setProductsData(defaultData as ProductsData);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, []);

  if (loading) {
    return (
      <section className="product-section py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!productsData) {
    return (
      <section className="product-section py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="text-danger">Error loading products</h2>
            <p>{error}</p>
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
            {productsData.products.map((product) => {
              const carouselId = productsService.generateCarouselId(
                product.slug
              );
              const carouselTarget = productsService.generateCarouselTarget(
                product.slug
              );

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
                              key={image.id}
                              className={`carousel-item ${
                                index === 0 ? "active" : ""
                              }`}
                            >
                              <Image
                                src={image.url}
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
                        {product.carouselSettings.showControls &&
                          product.galleryImages.length > 1 && (
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
