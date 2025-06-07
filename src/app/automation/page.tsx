"use client";

import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function AutomationPage() {
    const [nav1, setNav1] = useState<Slider | null>(null);
    const [nav2, setNav2] = useState<Slider | null>(null);

    const slider1 = useRef<Slider>(null);
    const slider2 = useRef<Slider>(null);

    const imageSettings = {
        centerMode: true,
        slidesToShow: 3,
        arrows: false,
        asNavFor: nav2!,
        focusOnSelect: true,
        centerPadding: "50px",
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
        if (slider1.current && slider2.current) {
            setNav1(slider1.current);
            setNav2(slider2.current);
        }
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
                        
                        <div className="image-box">
                            <img src="../images/automation/automation_3.png" />
                        </div>
                        <div className="image-box">
                            <img src="../images/automation/automation_2.jpg" />
                        </div>
                        <div className="image-box">
                            <img src="../images/automation/automation_1.png" />
                        </div>
                        <div className="image-box">
                            <img src="../images/automation/automation_2.jpg" />
                        </div>
                    </Slider>

                    <div className="content-container">
                        <div className="arrow"></div>
                        <Slider
                            {...contentSettings}
                            ref={slider2}
                            className="slider-content"
                        >
                            
                            <div className="content-item">
                                <h3>AUTOMATIC CHEMICAL QUANTIFICATION</h3>
                                <div className="dash"></div>
                                <p>The system automatically calculates and precisely distributes the required amount of chemicals for each
                                    production process, enabling real-time monitoring of energy consumption.</p>
                            </div>
                            <div className="content-item">
                                <h3>CONTINUOUS MONITORING AND ADJUSTMENT</h3>
                                <div className="dash"></div>
                                <p>Sensors continuously record data on chemical levels, temperature, pressure, and flow rate. The system integrates
                                    remote management and control through a digital interface, processing data to optimize chemical ratios and make
                                    automatic adjustments</p>
                            </div>
                            <div className="content-item">
                                <h3>DATA STORAGE AND ANALYSIS</h3>
                                <div className="dash"></div>
                                <p>The system provides reports on chemical usage performance, compares it with desired standards, and suggests
                                    improvements when necessary.</p>
                            </div>
                            <div className="content-item">
                                <h3>DATA STORAGE AND ANALYSIS</h3>
                                <div className="dash"></div>
                                <p>The system provides reports on chemical usage performance, compares it with desired standards, and suggests improvements when necessary.</p>
                            </div>
                        </Slider>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}