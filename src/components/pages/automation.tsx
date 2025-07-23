"use client";

import React, { useRef, useState, useEffect } from "react";
import Slider, { CustomArrowProps } from "react-slick";
import Image from "next/legacy/image";
import { BACKEND_DOMAIN } from "@/api/config";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useSWR from "swr";

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

interface AutomationProps {
  automationItems: Automation[];
}

export default function Automation({ automationItems }: AutomationProps) {
  // Không dùng SWR, chỉ nhận automationItems từ props
  const data = automationItems;

  // Hooks luôn phải khai báo trước khi return
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

  const isExactly3 = data.length === 3;
  // Mảng render cho slider: nếu đúng 3 ảnh thì clone thành 6 ảnh
  const renderItems = isExactly3 ? [...data, ...data] : data;
  const imageSettings = {
    centerMode: true,
    slidesToShow: 3,
    arrows: true,
    focusOnSelect: true,
    infinite: data.length >= 3,
    initialSlide: isExactly3 ? 1 : 0,
    afterChange: (index: number) => setActiveItemIndex(isExactly3 ? index % 3 : index),
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
    beforeChange: (oldIndex: number, newIndex: number) => setActiveItemIndex(isExactly3 ? newIndex % 3 : newIndex),
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
      <section id="automation" className="page-content">
        {/* ĐÃ XÓA TIÊU ĐỀ AUTOMATION */}
        <div className="slider-wrapper">
          {/* Slider hình ảnh - automation items */}
          <Slider {...imageSettings} ref={imageSliderRef} className="slider-image">
            {renderItems.map((item, index) => (
              <div className={`image-box${(index % 3) === activeItemIndex ? ' active' : ' inactive'}`} key={item.id + '-' + index}>
                <Image
                  src={`${BACKEND_DOMAIN}${item.image}`}
                  alt={item.imageAlt || "automation image"}
                  width={500}
                  height={500}
                />
              </div>
            ))}
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
        /* Ẩn nút prev/next ở slider ảnh (trên) */
        :global(.slider-image .slick-arrow) {
          display: none !important;
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
      `}</style>
    </>
  );
}
