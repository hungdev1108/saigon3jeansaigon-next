"use client";

import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import automationService from "@/services/automationService";
import Image from "next/image";

export default function Automation() {
  const [AutomationData, setAutomation] = useState<Automation[]>([]);

  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);

  const slider1 = useRef<Slider>(null);
  const slider2 = useRef<Slider>(null);

  interface Automation {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  }

  const imageSettings = {
    centerMode: true,
    slidesToShow: 3,
    arrows: false,
    asNavFor: nav2!,
    focusOnSelect: true,
    infinite: true,
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
        const res = await automationService.Load();
        const data = (res.data as Automation[]).map((item) => ({
          ...item,
          image: automationService.fixImagePath(item.image),
        }));
        setAutomation(data);
      } catch (error) {
        console.error("Failed to load automation data:", error);
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

  return (
    <>
      <section id="automation" className="page-content">
        <h2 className="section-title mt-5 pt-4">AUTOMATION</h2>
        <div className="slider-wrapper">
          <Slider {...imageSettings} ref={slider1} className="slider-image">
            {AutomationData?.map((item, index) => (
              <div className="image-box" key={index}>
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  width={500}
                  height={500}
                  onError={() =>
                    console.error(`Failed to load image: ${item.image}`)
                  }
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
                <div className="content-item" key={index}>
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
