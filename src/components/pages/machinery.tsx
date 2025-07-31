"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { BACKEND_DOMAIN } from '@/api/config';

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

  // Format image URL correctly
  const getImageUrl = (url: string) => {
    if (!url) return '/images/placeholder.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${BACKEND_DOMAIN}${url}`;
    return `${BACKEND_DOMAIN}/${url}`;
  };

  // If only one image, display without slider
  if (images.length === 1) {
    return (
      <Image
        src={getImageUrl(images[0].url)}
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
  const [stageItemHeight, setStageItemHeight] = useState(0);
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
        // Calculate fixed container height (e.g., 600px or based on viewport)
        const containerHeight = Math.max(600, window.innerHeight * 0.7);
        
        // Calculate height for exactly 4 stages
        if (data && data.stages) {
          if (data.stages.length <= 4) {
            // If 4 or fewer stages, calculate height with margins
            // Account for margins (8px per stage except last one)
            const totalMargins = (data.stages.length - 1) * 8;
            const itemHeight = (containerHeight - totalMargins) / data.stages.length;
            setStageItemHeight(itemHeight);
            setStagesHeight(containerHeight);
          } else {
            // If more than 4 stages, calculate height for exactly 4 stages with margins
            // Account for margins (8px per stage except last one)
            const totalMargins = 3 * 8; // 3 margins for 4 stages
            const itemHeight = (containerHeight - totalMargins) / 4;
            setStageItemHeight(itemHeight);
            // Set container height to exactly fit 4 stages with margins
            // Subtract 4px to ensure no part of the 5th stage is visible
            setStagesHeight((itemHeight * 4 + totalMargins) - 4);
          }
        }
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

  console.log('Current machine:', currentMachine);
  console.log('Machine images:', currentMachine ? processMachineImages(currentMachine) : []);

  return (
    <>
      <section className="machinery-section py-5">
        <div className="container">
          {/* <h2 className="section-title mt-5">{machineryData.pageTitle}</h2> */}

          <div className="row">
            {/* Stages Column */}
            <div className="col-md-5">
              <div 
                className="stages-container" 
                ref={stagesContainerRef}
                style={{ 
                  height: `${stagesHeight}px`,
                  overflowY: data.stages.length > 4 ? 'auto' : 'hidden',
                  paddingBottom: '0' // No extra padding needed
                }}
              >
                {data.stages.map((stage, idx) => (
                  <div
                    key={stage.id || idx}
                    className={`stage-item ${activeStage === stage.stageNumber ? "active" : ""}`}
                    data-stage={stage.stageNumber}
                    onClick={() => handleStageClick(stage.stageNumber)}
                    style={{ 
                      cursor: "pointer",
                      height: `${stageItemHeight}px`,
                      minHeight: `${stageItemHeight}px`,
                      maxHeight: `${stageItemHeight}px`,
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    <h3>{stage.title}</h3>
                    <p>{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Machines Column */}
            <div className="col-md-7">
              <div 
                className="machines-container" 
                ref={machinesContainerRef}
                style={{ height: `${stagesHeight}px` }}
              >
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
            scrollbar-width: thin;
            scrollbar-color: #1a4b8c #f0f0f0;
            padding-right: 10px; /* Add padding to prevent content from being hidden by scrollbar */
            overflow-x: hidden; /* Prevent horizontal scrolling */
            box-sizing: border-box; /* Ensure padding is included in the height */
            clip-path: inset(0 0 0 0); /* Clip any overflow content */
            /* Remove the mask image that was causing the fade effect */
          }
          .stages-container::-webkit-scrollbar {
            width: 6px;
          }
          .stages-container::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 10px;
          }
          .stages-container::-webkit-scrollbar-thumb {
            background-color: #1a4b8c;
            border-radius: 10px;
          }
          .stage-item {
            padding: 20px;
            margin-bottom: 8px; /* Restore margin between items */
            border-left: 3px solid #e0e0e0;
            transition: all 0.3s ease;
            flex-shrink: 0; /* Prevent stage items from shrinking */
            box-sizing: border-box; /* Ensure padding is included in the height */
          }
          .stage-item:nth-child(4) {
            margin-bottom: 8px; /* Add margin to the 4th item to match other items */
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
            height: calc(100% - 50px); /* Subtract tabs height */
          }
          .machine-item {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </section>
    </>
  );
}
