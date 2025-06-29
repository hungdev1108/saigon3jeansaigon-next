"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Gallery from "react-photo-gallery";
import { productsService } from "../../services";
import { BACKEND_DOMAIN } from "../../api/config";

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
  params?: {
    id?: string;
  };
}

export default function ProductDetails({ params }: ProductDetailsProps = {}) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy productId hoặc slug từ URL params hoặc props
  const productParam = params?.id;

  useEffect(() => {
    const fetchProductDetails = async () => {
      // Nếu không có productParam, sử dụng default 'denim'
      const paramToUse = productParam || "denim";

      try {
        setLoading(true);
        setError(null);

        let productData: ProductDetails;

        // Kiểm tra xem paramToUse là ID hay slug
        if (typeof paramToUse === "string") {
          // Nếu là MongoDB ObjectId (24 ký tự hex) thì dùng getProductDetails
          // Ngược lại dùng getProductDetailsBySlug
          if (
            paramToUse.length === 24 &&
            /^[0-9a-fA-F]{24}$/.test(paramToUse)
          ) {
            productData = (await productsService.getProductDetails(
              paramToUse
            )) as ProductDetails;
          } else {
            productData = (await productsService.getProductDetailsBySlug(
              paramToUse
            )) as ProductDetails;
          }
        } else {
          // Fallback cho trường hợp mặc định
          productData = (await productsService.getProductDetailsBySlug(
            "denim"
          )) as ProductDetails;
        }

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");

        // Fallback to default data
        const defaultProduct =
          (await productsService.getDefaultProductDetails()) as ProductDetails;
        setProduct(defaultProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productParam]);

  // Helper function to prepare images for react-photo-gallery
  const prepareGalleryImages = (images: ApplicationImage[], applicationId: string) => {
    return images
      .sort((a, b) => a.order - b.order)
      .map((img, index) => ({
        src: `${BACKEND_DOMAIN}${img.url}?v=${index}`,
        width: 4,
        height: 3,
        alt: img.alt,
        key: `${applicationId}-${img.url}-${index}`,
      }));
  };

  // Loading state
  if (loading) {
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
  if (error && !product) {
    return (
      <section className="product-details-section py-5">
        <div className="container">
          <div className="alert alert-danger text-center" role="alert">
            <h4 className="alert-heading">Lỗi!</h4>
            <p>{error}</p>
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
            <h1 className="product-title mt-5">{product.name}</h1>
            <p className="product-description">{product.description}</p>
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
          {productsService.hasFeatures(product) && (
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
          {productsService.hasApplications(product) && (
            <div className="applications-section mb-5">
              {/* <h3 className="section-title text-center mb-4">Applications</h3> */}
              <div className="accordion" id="applicationsAccordion">
                {product.applications.map((application) => {
                  const galleryImages = application.content.images 
                    ? prepareGalleryImages(application.content.images, application.id)
                    : [];

                  return (
                    <div key={application.id} className="accordion-item mb-3">
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
                              {galleryImages.length > 0 ? (
                                <div className="application-gallery">
                                  <Gallery 
                                    photos={galleryImages}
                                    direction="row"
                                    columns={(containerWidth: number) => {
                                      if (containerWidth >= 500) return 2;
                                      return 1;
                                    }}
                                    margin={5}
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
      `}</style>
    </>
  );
}
