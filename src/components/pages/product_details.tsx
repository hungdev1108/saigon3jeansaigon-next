"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { productsService } from "../../services";

// TypeScript interfaces
interface ProductFeature {
  id: string;
  icon: string;
  text: string;
  order: number;
}

interface ApplicationContent {
  heading: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
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
          <div className="product-header text-center">
            <h1 className="product-title mt-5">{product.name}</h1>
            <p className="product-description">{product.description}</p>
          </div>

          {/* Product Main Image */}
          <div className="product-image-container">
            <Image
              src={product.mainImage}
              alt={product.mainImageAlt}
              className="product-image"
              width={500}
              height={500}
            />
          </div>

          {/* Product Features */}
          {productsService.hasFeatures(product) && (
            <div className="product-features">
              <ul className="features-list">
                {product.features.map((feature) => (
                  <li key={feature.id}>
                    <i className={`${feature.icon} feature-icon`}></i>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Applications Section */}
          {productsService.hasApplications(product) && (
            <div className="applications-section">
              <div className="accordion" id="applicationsAccordion">
                {product.applications.map((application) => (
                  <div key={application.id} className="accordion-item">
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
                        <i className="fas fa-plus accordion-icon"></i>
                        {application.title}
                      </button>
                    </h2>
                    <div
                      id={application.accordionId}
                      className={`accordion-collapse collapse ${
                        application.isExpanded ? "show" : ""
                      }`}
                      data-bs-parent="#applicationsAccordion"
                    >
                      <div className="accordion-body">
                        <div className="row align-items-center">
                          <div className="col-lg-6">
                            <h4>{application.content.heading}</h4>
                            <p>{application.content.description}</p>
                            {application.content.features.length > 0 && (
                              <ul>
                                {application.content.features.map(
                                  (feature, featureIndex) => (
                                    <li key={featureIndex}>{feature}</li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                          <div className="col-lg-6">
                            <Image
                              src={application.content.image}
                              alt={application.content.imageAlt}
                              className="application-image"
                              width={500}
                              height={500}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to Products Button */}
          <div className="back-to-products text-center">
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
    </>
  );
}
