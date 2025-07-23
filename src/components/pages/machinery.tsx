"use client";

import Image from "next/legacy/image";
import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { BACKEND_DOMAIN } from '@/api/config';
import useSWR from "swr";

interface Machine {
  id: string;
  name: string;
  description: string;
  image: string;
  images: Array<{
    url: string;
    alt: string;
    order: number;
  }>;
  imageAlt: string;
  order: number;
  isActive: boolean;
}

interface Stage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  machines: Machine[];
  order: number;
  isActive: boolean;
}

interface MachineryData {
  pageTitle: string;
  pageDescription: string;
  stages: Stage[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Image Slider Component for machines
interface MachineImageSliderProps {
  images: Array<{
    url: string;
    alt: string;
    order: number;
  }>;
  alt: string;
  containerHeight: number;
}

function MachineImageSlider({ images, alt, containerHeight }: MachineImageSliderProps) {
  // Slider settings for machine images
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: images.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  // If only one image, display without slider
  if (images.length === 1) {
    return (
      <Image
        src={`${BACKEND_DOMAIN}${images[0].url}`}
        alt={images[0].alt || alt}
        className="img-fluid"
        width={1500}
        height={900}
        style={{ 
          width: '100%', 
          height: containerHeight > 0 ? `${containerHeight}px` : '100%', 
          objectFit: 'cover',
          objectPosition: 'center',
          borderRadius: 16
        }}
      />
    );
  }

  // Multiple images - use slider
  return (
    <div className="machine-image-slider" style={{ height: containerHeight > 0 ? `${containerHeight}px` : 'auto' }}>
      <Slider {...sliderSettings}>
        {images.map((image, index) => (
          <div key={index} className="slider-item">
            <Image
              src={`${BACKEND_DOMAIN}${image.url}`}
              alt={image.alt || `${alt} - ${index + 1}`}
              className="slider-img-full"
              width={1200}
              height={900}
              style={{ 
                width: '100%', 
                height: containerHeight > 0 ? `${containerHeight}px` : '100%', 
                objectFit: 'cover', 
                objectPosition: 'center',
                borderRadius: 16 
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

interface MachineryProps {
  machineryData: MachineryData | null;
}

export default function Machinery({ machineryData }: MachineryProps) {
  // Không dùng SWR, chỉ nhận machineryData từ props
  const data = machineryData;

  // Hooks luôn phải khai báo trước khi return
  const [activeStage, setActiveStage] = useState(1);
  const [activeMachine, setActiveMachine] = useState<string>("");
  const [stagesHeight, setStagesHeight] = useState(0);
  const stagesContainerRef = useRef<HTMLDivElement>(null);
  const machinesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && data.stages && data.stages.length > 0 && data.stages[0].machines.length > 0) {
      setActiveMachine(
        data.stages[0].machines[0].name.toLowerCase().replace(/\s+/g, "")
      );
    }
  }, [data]);

  useEffect(() => {
    const updateHeight = () => {
      if (stagesContainerRef.current) {
        const height = stagesContainerRef.current.clientHeight - 80;
        setStagesHeight(height);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    const timer = setTimeout(updateHeight, 100);
    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timer);
    };
  }, [data]);

  // Kiểm tra error/data sau khi đã gọi hết hook
  if (!data) {
    return (
      <section className="machinery-section py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="text-info">Đang tải dữ liệu machinery...</h2>
          </div>
        </div>
      </section>
    );
  }

  // Helper function to process images
  const processMachineImages = (machine: Machine) => {
    // Use images array from API, fallback to single image if needed
    if (machine.images && machine.images.length > 0) {
      return machine.images;
    }
    // Fallback to single image as object structure
    return [{ url: machine.image, alt: machine.imageAlt, order: 0 }];
  };

  // const testImages = [
  //   "http://222.255.214.144:3007/uploads/images/facilities-page/section_1-outdoor.jpg",
  //   "http://222.255.214.144:3007/uploads/images/facilities-page/section_2-office.jpg",
  //   "http://222.255.214.144:3007/uploads/images/facilities-page/section_3-facilities.jpg",
  // ];

  // Handle stage selection
  const handleStageClick = (stageNumber: number) => {
    setActiveStage(stageNumber);

    // Set first machine of selected stage as active
    if (data) {
      const selectedStage = data.stages.find(
        (stage) => stage.stageNumber === stageNumber
      );
      if (selectedStage && selectedStage.machines.length > 0) {
        setActiveMachine(
          selectedStage.machines[0].name.toLowerCase().replace(/\s+/g, "")
        );
      }
    }
  };

  // Handle machine tab click
  const handleMachineClick = (machineName: string) => {
    setActiveMachine(machineName.toLowerCase().replace(/\s+/g, ""));
  };

  // Handle machine overlay toggle
  const handleMachineOverlayClick = (event: React.MouseEvent) => {
    const overlay = event.currentTarget.querySelector(
      ".machine-overlay"
    ) as HTMLElement;
    if (overlay) {
      if (overlay.style.opacity === "1") {
        overlay.style.opacity = "0";
      } else {
        overlay.style.opacity = "1";
      }
    }
  };

  const currentStage = data!.stages.find(
    (stage) => stage.stageNumber === activeStage
  );
  const currentMachine = currentStage?.machines.find(
    (machine) =>
      machine.name.toLowerCase().replace(/\s+/g, "") === activeMachine
  );

  return (
    <>
      <section className="machinery-section py-5">
        <div className="container">
          {/* <h2 className="section-title mt-5">{machineryData.pageTitle}</h2> */}

          <div className="row">
            {/* Stages Column */}
            <div className="col-md-5">
              <div className="stages-container" ref={stagesContainerRef}>
                {data.stages.map((stage, idx) => (
                  <div
                    key={stage.id || idx}
                    className={`stage-item ${activeStage === stage.stageNumber ? "active" : ""}`}
                    data-stage={stage.stageNumber}
                    onClick={() => handleStageClick(stage.stageNumber)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3>{stage.title}</h3>
                    <p>{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Machines Column */}
            <div className="col-md-7">
              <div className="machines-container" ref={machinesContainerRef}>
                {/* Current Stage Machines */}
                <div className="machines-wrapper active">
                  {/* Machine Tabs */}
                  {currentStage && currentStage.machines.length > 0 && (
                    <>
                      <ul className="nav nav-tabs machine-tabs" role="tablist">
                        {currentStage.machines.map((machine, idx) => (
                          <li
                            key={machine.id || idx}
                            className="nav-item"
                            role="presentation"
                          >
                            <button
                              className={`nav-link ${
                                activeMachine ===
                                machine.name.toLowerCase().replace(/\s+/g, "")
                                  ? "active"
                                  : ""
                              }`}
                              type="button"
                              role="tab"
                              onClick={() => handleMachineClick(machine.name)}
                            >
                              {machine.name}
                            </button>
                          </li>
                        ))}
                      </ul>

                      {/* Machine Content */}
                      <div className="tab-content machine-tab-content">
                        {currentMachine && (
                          <div
                            className="tab-pane fade show active"
                            role="tabpanel"
                          >
                            <div
                              className="machine-item"
                              onClick={handleMachineOverlayClick}
                            >
                              <div className="machine-image-container">
                                <MachineImageSlider
                                  images={processMachineImages(currentMachine)}
                                  alt={currentMachine.imageAlt}
                                  containerHeight={stagesHeight}
                                />
                                {/* <div
                                  className="machine-overlay"
                                  style={{ opacity: 0 }}
                                >
                                  <div className="machine-description">
                                    <h5>DESCRIPTION</h5>
                                    <p>{currentMachine.description}</p>
                                  </div>
                                </div> */}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .machine-image-container,
          .machine-image-slider,
          .machine-image-slider .slick-slider,
          .machine-image-slider .slick-list,
          .machine-image-slider .slick-track {
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 16px;
            overflow: hidden;
            background: transparent;
            box-sizing: border-box;
          }
          .machine-image-slider .slick-track {
            display: block !important;
          }
          .machine-image-slider .slick-slide,
          .machine-image-slider .slider-item,
          .machine-image-slider [class*='slick-slide'] {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            float: none !important;
            display: block !important;
            box-sizing: border-box;
          }
          .machine-image-slider .slider-item img,
          .slider-img-full {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 16/9;
            object-fit: cover !important;
            object-position: center !important;
            border-radius: 16px;
            display: block;
            box-sizing: border-box;
          }
          .stages-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            margin-bottom: 0;
          }
          .stage-item {
            padding: 20px;
            margin-bottom: 15px;
            border-left: 3px solid #e0e0e0;
            transition: all 0.3s ease;
          }
          .stage-item:last-child {
            margin-bottom: 0;
          }
          .stage-item.active {
            border-left: 3px solid #0d6efd;
            background-color: rgba(13, 110, 253, 0.05);
          }
          .machine-tabs {
            margin-bottom: 15px;
          }
          .machines-container {
            width: 100%;
            height: 100%;
          }
          .machines-wrapper {
            width: 100%;
            height: 100%;
          }
          .machine-tab-content {
            width: 100%;
          }
          .machine-item {
            width: 100%;
          }
        `}</style>
      </section>
    </>
  );
}
