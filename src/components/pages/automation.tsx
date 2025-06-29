"use client";

import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import automationService from "@/services/automationService";
import Image from "next/image";
import { BACKEND_DOMAIN } from "@/api/config";

interface Automation {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  order: number;
  isActive: boolean;
}

export default function Automation() {
  const [AutomationData, setAutomation] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);

  const slider1 = useRef<Slider>(null);
  const slider2 = useRef<Slider>(null);

  const slidesToShow = Math.min(3, AutomationData.length);
  const enableInfinite = AutomationData.length > 3;
  const enableCenterMode = AutomationData.length > 3;

  const imageSettings = {
    centerMode: enableCenterMode,
    slidesToShow,
    arrows: false,
    asNavFor: nav2!,
    focusOnSelect: true,
    infinite: enableInfinite,
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
  };

  const contentSettings = {
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    asNavFor: nav1!,
    adaptiveHeight: true,
    infinite: true,
    centerPadding: "50px",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          swipe: false,
          draggable: false,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Thử new API format trước
        try {
          const completeData = await automationService.getCompleteAutomationData();
          const typedData = completeData as { items: Automation[] };
          if (typedData && typedData.items) {
            setAutomation(typedData.items);
            setError(null);
            return;
          }
        } catch {
          console.log("New API not available, falling back to legacy API");
        }
        
        // Fallback to legacy API
        const res = await automationService.Load();
        
        if (res.success && Array.isArray(res.data)) {
          // Sử dụng direct image paths từ BE - không cần fixImagePath
          const data = res.data.map((item: Partial<Automation> & { _id?: string }) => ({
            id: item._id || item.id || "",
            title: item.title || "",
            description: item.description || "",
            image: item.image || "",
            imageAlt: item.imageAlt || item.title,
            order: item.order || 0,
            isActive: item.isActive !== false,
          }));
          setAutomation(data);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Failed to load automation data:", error);
        setError("Failed to load automation data");
        // Sử dụng dữ liệu mặc định khi có lỗi
        const defaultData = automationService.getDefaultItems();
        setAutomation(defaultData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (slider1.current && slider2.current) {
      setNav1(slider1.current);
      setNav2(slider2.current);
    }
  }, [AutomationData]);

  if (loading) {
    return (
      <section id="automation" className="page-content">
        <h2 className="section-title mt-5 pt-4">AUTOMATION</h2>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading automation data...</p>
        </div>
      </section>
    );
  }

  if (error && AutomationData.length === 0) {
    return (
      <section id="automation" className="page-content">
        <h2 className="section-title mt-5 pt-4">AUTOMATION</h2>
        <div className="text-center py-5">
          <h3 className="text-danger">Error loading automation data</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="automation" className="page-content">
        <h2 className="section-title mt-5 pt-4">AUTOMATION</h2>
        <div className="slider-wrapper">
          <Slider {...imageSettings} ref={slider1} className="slider-image">
            {AutomationData?.map((item, index) => (
              <div className="image-box" key={item.id || index}>
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
            <Slider
              {...contentSettings}
              ref={slider2}
              className="slider-content"
            >
              {AutomationData?.map((item, index) => (
                <div className="content-item" key={item.id || index}>
                  <h3>{item.title}</h3>
                  <div className="dash"></div>
                  <p>{item.description}</p>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
}
