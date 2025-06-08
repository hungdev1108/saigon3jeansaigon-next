"use client";

import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { AutomationService } from "@/services/automation.service";

export default function AutomationPage() {
  const [AutomationData, setAutomation] = useState<Automation[]>([]);

    const [nav1, setNav1] = useState<Slider | null>(null);
    const [nav2, setNav2] = useState<Slider | null>(null);

    const slider1 = useRef<Slider>(null);
    const slider2 = useRef<Slider>(null);

    interface Automation {
        title: string,
        description: string,
        image: string,
        imageAlt: string,
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
                const res = await AutomationService.Load();
                setAutomation(res.data);
                console.log("AutomationData:", res.data);
            } catch (error) {
                console.error("Failed to load automation data:", error);
            }

            if (slider1.current && slider2.current) {
                setNav1(slider1.current);
                setNav2(slider2.current);
            }
        };
        fetchData();

    }, []);
    return (
        <>
            <Header />

            <section id="automation" className="page-content">
                <h2 className="section-title mt-5">AUTOMATION</h2>
                <div className="slider-wrapper">
                    <Slider
                        {...imageSettings}
                        ref={slider1}
                        className="slider-image"
                    >
                        {AutomationData?.map((item, index) => (
                            <div className="image-box" key={index}>
                                <img src={item.image} alt={item.imageAlt} />
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
            <Footer />
        </>
    )
}