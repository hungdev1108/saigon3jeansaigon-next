"use client";

import React, { useRef, useState, useEffect } from "react";
import Slider, { CustomArrowProps } from "react-slick";
import { getOptimizedImageUrls } from "../../shared/imageUtils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BACKEND_DOMAIN } from '@/api/config';

interface ContentItem {
  _id: string;
  title: string;
  description: string;
  order: number;
}

interface Automation {
  id: string;
  _id?: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  order: number;
  isActive: boolean;
  contentItems?: ContentItem[];
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

interface AutomationProps {
  automationItems: Automation[];
}

export default function Automation({ automationItems }: AutomationProps) {
  // Không dùng SWR, chỉ nhận automationItems từ props
  const data = automationItems;

  // Hooks luôn phải khai báo trước khi return
  const isExactly3 = data && data.length === 3;
  // Khởi tạo activeItemIndex là 1 nếu có đúng 3 hình, ngược lại là 0
  // Nếu có nhiều hơn 3 hình, vẫn bắt đầu từ hình đầu tiên (index 0)
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const imageSliderRef = useRef<Slider>(null);
  const contentSliderRef = useRef<Slider>(null);

  // Reset content slider về bước 1 khi đổi automation item
  useEffect(() => {
    if (contentSliderRef.current) {
      contentSliderRef.current.slickGoTo(0);
    }
  }, [activeItemIndex]);

  // Kiểm tra error/data sau khi đã gọi hết hook
  if (!data || data.length === 0) return null;

  // Lấy contentItems của automationItem đang active
  const getActiveItemContentItems = (): ContentItem[] => {
    if (!data || !data[activeItemIndex]) return [];
    
    const activeItem = data[activeItemIndex];
    return activeItem.contentItems || [{
      _id: `default-content-${activeItem.id}`,
      title: activeItem.title,
      description: activeItem.description,
      order: 1
    }];
  };

  // Tạo mảng render cho slider
  // Trên desktop: nếu đúng 3 ảnh thì clone thành 6 ảnh
  // Trên mobile: luôn dùng mảng gốc không nhân đôi
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);
  
  // Nếu là mobile, chỉ render đúng số lượng ảnh, không nhân đôi, và luôn là active
  const renderItems = (isExactly3 && !isMobile) ? [...data, ...data] : data;
  const imageSettings = {
    centerMode: true,
    slidesToShow: 3,
    arrows: true,
    focusOnSelect: true,
    infinite: data.length >= 3,
    initialSlide: 0, // Luôn bắt đầu từ hình đầu tiên
    afterChange: (index: number) => {
      // Nếu có đúng 3 hình và đã clone, cần lấy phần dư khi chia cho 3
      const actualIndex = isExactly3 ? index % 3 : index;
      setActiveItemIndex(actualIndex);
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          arrows: true,
          infinite: true,
          dots: true,
        },
      },
    ],
    beforeChange: (oldIndex: number, newIndex: number) => {
      // Nếu có đúng 3 hình và đã clone, cần lấy phần dư khi chia cho 3
      const actualIndex = isExactly3 ? newIndex % 3 : newIndex;
      setActiveItemIndex(actualIndex);
    },
  };

  // Custom arrow components cho slider content
  const CustomPrevArrow = (props: CustomArrowProps) => {
    // Loại bỏ các prop không hợp lệ
    const buttonProps = { ...props };
    delete buttonProps.currentSlide;
    delete buttonProps.slideCount;
    return (
      <button {...buttonProps} type="button" aria-label="Previous" style={{background: 'transparent', border: 'none', outline: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <FaChevronLeft size={22} />
      </button>
    );
  };
  const CustomNextArrow = (props: CustomArrowProps) => {
    const buttonProps = { ...props };
    delete buttonProps.currentSlide;
    delete buttonProps.slideCount;
    return (
      <button {...buttonProps} type="button" aria-label="Next" style={{background: 'transparent', border: 'none', outline: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <FaChevronRight size={22} />
      </button>
    );
  };

  // Lấy danh sách contentItems của automation item hiện tại
  const activeContentItems = getActiveItemContentItems();
  
  // Cấu hình cho slider nội dung
  const contentSettings = {
    dots: false,
    arrows: activeContentItems.length > 1, // Chỉ hiển thị arrows khi có nhiều hơn 1 item
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: activeContentItems.length > 1, // Chỉ infinite khi có nhiều hơn 1 item
    adaptiveHeight: true,
    centerMode: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          dots: false,
          arrows: activeContentItems.length > 1, // Chỉ hiển thị arrows khi có nhiều hơn 1 item
        },
      },
    ],
  };

  return (
    <>
      {/* Font consistency override for automation page */}
      <style jsx global>{`
        /* Apply Inter font family consistently */
        .automation-title,
        .content-item p,
        .content-counter {
          font-family: "Inter", sans-serif !important;
        }
        
        /* Normalize font weights */
        .automation-title {
          font-weight: 700 !important;
          font-family: "Inter", sans-serif !important;
        }
        
        .content-item p {
          font-weight: 400 !important;
          font-family: "Inter", sans-serif !important;
        }
        
        .content-counter {
          font-weight: 400 !important;
          font-family: "Inter", sans-serif !important;
        }
      `}</style>
      <section id="automation" className="page-content">
        {/* ĐÃ XÓA TIÊU ĐỀ AUTOMATION */}
        <div className="slider-wrapper">
          {/* Slider hình ảnh - automation items */}
          <Slider {...imageSettings} ref={imageSliderRef} className="slider-image">
            {renderItems.map((item, index) => {
              // Tính toán chính xác hình ảnh nào đang active
              const itemIndex = isExactly3 ? index % 3 : index;
              // Trên mobile: luôn là active, không có inactive
              const isActive = isMobile ? true : (itemIndex === activeItemIndex);
              return (
                <div className={`image-box${isActive ? ' active' : (isMobile ? ' active' : ' inactive')}`} key={item.id + '-' + index}>
                  {item.image ? (
                    <ResponsiveImg
                      srcs={getOptimizedImageUrls(item.image)}
                      alt={item.imageAlt || "automation image"}
                      width={isMobile ? 600 : 500}
                      height={isMobile ? 350 : 500}
                      className="automation-image"
                      sizes={isMobile ? '100vw' : '(max-width: 768px) 100vw, 500px'}
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      Image not available
                    </div>
                  )}
                </div>
              );
            })}
          </Slider>

          <div className="content-container">
            <div className="arrow"></div>
            {/* Slider nội dung - contentItems của automation item đang chọn */}
            {activeContentItems.length > 0 && (
              <div className="content-slider-wrapper">
                <Slider
                  {...contentSettings}
                  ref={contentSliderRef}
                  className="slider-content"
                  prevArrow={<CustomPrevArrow />}
                  nextArrow={<CustomNextArrow />}
                >
                  {activeContentItems.map((content, index) => (
                    <div className="content-item" key={content._id || `content-${index}`}>
                      <div className="automation-title-wrap">
                        <span className="automation-title">{content.title}</span>
                        <span className="automation-underline"></span>
                      </div>
                      <p>{content.description}</p>
                      {activeContentItems.length > 1 && (
                      <div className="content-counter">
                        {index + 1} / {activeContentItems.length}
                      </div>
                      )}
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        </div>
      </section>
      <style jsx>{`
        .content-slider-wrapper {
          width: 100%;
        }
        .slider-content .content-item {
          margin: 0 auto;
          padding: 24px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center !important;
          width: 100% !important;
        }
        .slider-content .content-item h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 10px;
          text-align: center !important;
          width: 100% !important;
          display: block !important;
          justify-content: center !important;
          align-items: center !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        .automation-title-wrap {
          display: inline-block;
          text-align: left;
        }
        .automation-title {
          font-size: 1.3rem;
          font-weight: 700;
          display: block;
        }
        @media (max-width: 768px) {
          .automation-title {
            font-size: 1.1rem;
          }
        }
        .automation-underline {
          display: block;
          height: 2px;
          background: #bbb;
          border-radius: 2px;
          opacity: 0.7;
          margin-top: 4px;
          width: 100%;
        }
        .slider-content .content-item p {
          font-size: 1.05rem;
          color: #444;
          margin-bottom: 14px;
          line-height: 1.6;
          text-align: justify;
        }
        @media (max-width: 768px) {
          .slider-content .content-item p {
            text-align: justify;
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 10px;
          }
        }
        .content-counter {
          font-size: 15px;
          color: #888;
          text-align: center;
          margin-top: 8px;
          font-style: italic;
          background: transparent;
          min-width: 48px;
          display: inline-block;
          line-height: 1.5;
        }
        @media (max-width: 768px) {
          .content-counter {
            font-size: 13px;
            margin-top: 5px;
          }
        }
        /* Ẩn nút prev/next ở slider ảnh (trên) trên desktop */
        @media (min-width: 769px) {
          :global(.slider-image .slick-arrow) {
            display: none !important;
          }
        }
        
        /* Hiển thị nút prev/next ở slider ảnh trên mobile */
        @media (max-width: 768px) {
          :global(.slider-image .slick-arrow) {
            display: flex !important;
            z-index: 10;
          }
        }
        /* Nút prev/next ở slider content (dưới) dùng icon, không nền, bo tròn, hover đổi màu */
        :global(.slider-content .slick-arrow) {
          background: none !important;
          border: none !important;
          box-shadow: none;
          border-radius: 0;
          width: 40px;
          height: 40px;
          display: flex !important;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          transition: opacity 0.2s;
          z-index: 2;
          cursor: pointer;
          padding: 0;
        }
        :global(.slider-content .slick-arrow:hover) {
          opacity: 1;
        }
        :global(.slider-content .slick-prev), :global(.slider-content .slick-next) {
          top: 50%;
          transform: translateY(-50%);
        }
        :global(.slider-content .slick-prev) {
          left: 12px;
        }
        :global(.slider-content .slick-next) {
          right: 12px;
        }
        :global(.slider-content .slick-arrow svg) {
          color: #aaa;
          font-size: 32px;
          transition: color 0.2s;
        }
        :global(.slider-content .slick-arrow:hover svg) {
          color: #888;
        }
        :global(.slick-dots) {
          bottom: -30px;
        }
        .slider-image {
          margin-bottom: 32px;
        }
        .image-box {
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.3s, opacity 0.3s;
          padding: 0 12px;
        }
        .image-box img {
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          background: #fff;
          transition: transform 0.3s, opacity 0.3s;
        }
        .image-box.active img {
          width: 340px;
          height: 200px;
          object-fit: cover;
          opacity: 1;
          transform: scale(1.08);
          z-index: 2;
        }
        .image-box.inactive img {
          width: 240px;
          height: 140px;
          object-fit: cover;
          opacity: 0.45;
          filter: blur(1px);
          z-index: 1;
        }
        /* Trên mobile: mọi ảnh trong slider-image đều rõ nét, không bị mờ, không opacity thấp, không filter, không transform, không transition */
        @media (max-width: 768px) {
          .slider-image .image-box img,
          .slider-image .image-box.inactive img {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
            transition: none !important;
          }
        }
        /* Trên mobile: loại bỏ mọi hiệu ứng mờ, lớp phủ, filter, opacity, background, mask, clip-path, box-shadow... */
        @media (max-width: 768px) {
          .slider-image,
          .slider-image * {
            opacity: 1 !important;
            filter: none !important;
            background: none !important;
            box-shadow: none !important;
            mask: none !important;
            -webkit-mask: none !important;
            clip-path: none !important;
            -webkit-clip-path: none !important;
            mix-blend-mode: normal !important;
            backdrop-filter: none !important;
            transition: none !important;
            transform: none !important;
          }
          .slider-image,
          .slider-image .slick-list,
          .slider-image .slick-track,
          .slider-image .slick-slide,
          .slider-image .image-box {
            width: 100vw !important;
            max-width: 100vw !important;
            min-width: 100vw !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .slider-image .image-box img {
            width: 100vw !important;
            max-width: 100vw !important;
            min-width: 100vw !important;
            height: auto !important;
            object-fit: contain !important;
            display: block !important;
            margin: 0 auto !important;
          }
        }
        /* Chỉ áp dụng hiệu ứng mờ cho desktop */
        @media (min-width: 769px) {
          #automation .slider-image .slick-slide {
            opacity: 0.6;
            transform: scale(0.75);
            /* giữ các hiệu ứng khác nếu có */
          }
        }
        /* OVERRIDE MẠNH NHẤT: Đảm bảo mọi slick-slide trên mobile đều rõ nét, không bị mờ, không opacity thấp, không blur, không scale, không transition */
        @media (max-width: 768px) {
          #automation .slider-image .slick-slide,
          .slick-slide {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
