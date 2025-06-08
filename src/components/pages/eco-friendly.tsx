"use client";

import React, { useRef, useState, useEffect } from "react";
import automationService from "@/services/automationService";

export default function EcoFriendly() {
//   const [AutomationData, setAutomation] = useState<Automation[]>([]);
    useEffect(() => {
        const dots = document.querySelectorAll("#eco-friendly .left-select-item .dot");
        const items = document.querySelectorAll("#eco-friendly .features-right .right-item");
        const itemsline = document.querySelectorAll("#eco-friendly .features-right .right-item .line");

        const handleDotClick = (index: number) => {
            dots.forEach(d => d.classList.remove("active"));
            items.forEach(i => i.classList.remove("active"));
            itemsline.forEach(i => i.classList.remove("active"));

            dots[index].classList.add("active");
            if (items[index]) {
                items[index].classList.add("active");
                itemsline[index].classList.add("active");
            }
        };

        const handleItemClick = (index: number) => {
            dots.forEach(d => d.classList.remove("active"));
            items.forEach(i => i.classList.remove("active"));
            itemsline.forEach(i => i.classList.remove("active"));

            items[index].classList.add("active");
            if (dots[index]) {
                dots[index].classList.add("active");
                itemsline[index].classList.add("active");
            }
        };

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => handleDotClick(index));
        });

        items.forEach((item, index) => {
            item.addEventListener("click", () => handleItemClick(index));
        });

        // Cleanup event listeners
        return () => {
            dots.forEach((dot, index) => {
                dot.removeEventListener("click", () => handleDotClick(index));
            });
            items.forEach((item, index) => {
                item.removeEventListener("click", () => handleItemClick(index));
            });
        };
    }, []);
    return (
        <>
            <main id="eco-friendly">
                {/* Eco-friendly Overview */}
                <section className="hero">
                    <img src="./images/eco-friendly/home_banner-section3.png" alt="Factory overview" />
                </section>

                <section className="features">
                    <div className="circle-layout">
                        <div className="features-left">
                            <div className="left-select-item">
                                <div className="dot dot-1"></div>
                                <div className="dot dot-2"></div>
                                <div className="dot dot-3"></div>
                                <div className="dot dot-4"></div>
                                <div className="dot dot-5"></div>
                            </div>
                            <div className="left-item">
                                <img src="../images/eco-friendly/800af685d5f926cfad56985faf8a5f783d53086c.png" alt="Factory overview" />
                            </div>
                        </div>
                        <div className="features-right">
                            <div className="right-item">
                                <p>SOLAR ENERGY</p>
                                <div className="line"></div>
                                <ul>
                                    <li>Use solar panel systems to provide clean energy for production activities.</li>
                                    <li>Reduce dependence on fossil fuel energy sources, contributing to the reduction of CO2 emissions.</li>
                                </ul>
                            </div>
                            <div className="right-item">
                                <p>SOLAR ENERGY</p>
                                <div className="line"></div>
                                <ul>
                                    <li>Use solar panel systems to provide clean energy for production activities.</li>
                                    <li>Reduce dependence on fossil fuel energy sources, contributing to the reduction of CO2 emissions.</li>
                                </ul>
                                </div>
                            <div className="right-item">
                                <p>AUTOMATED DATA FEEDING AND MONITORING SYSTEM</p>
                                <div className="line"></div>
                                <ul>
                                    <li>Use Eliar Automation technology to automate the feeding process, chemical adjustment, and dyeing process management.</li>
                                    <li>Monitor production and environmental parameters in real-time to ensure maximum efficiency.</li>
                                </ul>
                            </div>
                            <div className="right-item">
                                <p>GREEN AREA</p>
                                <div className="line"></div>
                                <ul>
                                    <li>Develop green spaces around the factory to create a green environment and improve air quality.</li>
                                    <li>Enhance sustainability and the company's eco-friendly image.</li>
                                </ul>
                            </div>
                            <div className="right-item">
                                <p>ENVIRONMENTALLY FRIENDLY</p>
                                <div className="line"></div>
                                <ul>
                                    <li>Áp dụng các công nghệ tiên tiến trong quản lý chất thải, nước thải và khí thải.</li>
                                    <li>Đảm bảo các quy trình sản xuất tuân thủ nghiêm ngặt các tiêu chuẩn quốc tế về bảo vệ môi trường.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="solar-system">
                    <img src="../images/eco-friendly/anh 5 1.png" alt="Factory overview" />
                    <div className="content-animate">
                        <h2>SOLAR CELL SYSTEM</h2>
                        <p>Pioneering the application of solar energy in production, adhering to strict standards to optimize performance and reduce pressure on traditional power sources.</p>
                    </div>
                    <div className="stats">
                        <div className="d-flex align-items-center content-animate">
                            <strong>70%</strong>
                            <p>WATER <br /> RECYCLING</p>
                        </div>
                        <div className="line"></div>
                        <div className="stats-item content-animate">
                            <p>CAPACITY UP TO</p>
                            <div>
                            <strong>2,500</strong>
                            <span>m³/day</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ai-revolution content-animate">
                    <img src="../images/eco-friendly/anh 6 1.png" alt="Factory overview" />
                    <h2>LEADING THE AI REVOLUTION</h2>
                    <p>Applying AI and automation in the production process to optimize performance, enhance quality, and minimize waste. The auto-dosing system and smart dyeing washing control chemicals precisely, saving water and energy, aiming for sustainable production.</p>
                </section>

                <section className="biomass-boiler content-animate">
                    <img src="../images/eco-friendly/z6630648807114_da113af033725688c7e146b20f93957f 1.png" alt="Factory overview" />
                    <h2>Biomass Boiler</h2>
                    <p>By using renewable fuel from organic materials, this system reduces carbon emissions and conserves energy. It’s an eco-friendly solution that promotes green and sustainable manufacturing</p>
                </section>
            </main>
        </>
    )
}