"use client";

import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { getOptimizedImageUrls } from '../../shared/imageUtils';

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

  // Nếu chỉ có 1 ảnh, hiển thị không slider
  if (images.length === 1) {
    return (
      <ResponsiveImg
        srcs={getOptimizedImageUrls(String(images[0].url)) as OptimizedImageUrls}
        alt={images[0].alt || alt}
        width={1500}
        height={900}
        className="img-fluid machinery-single-image"
        style={{
          width: '100%',
          height: containerHeight > 0 ? `${containerHeight}px` : '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          borderRadius: 16,
        }}
      />
    );
  }

  // Nhiều ảnh - dùng slider
  return (
    <div className="machine-image-slider" style={{ height: containerHeight > 0 ? `${containerHeight}px` : 'auto' }}>
      <Slider {...sliderSettings}>
        {images.map((image, index) => (
          <div key={index} className="slider-item">
            <ResponsiveImg
              srcs={getOptimizedImageUrls(String(image.url)) as OptimizedImageUrls}
              alt={image.alt || `${alt} - ${index + 1}`}
              width={1200}
              height={900}
              className="slider-img-full"
              style={{
                width: '100%',
                height: containerHeight > 0 ? `${containerHeight}px` : '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 16,
                maxWidth: '100%',
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
          .slider-img-full,
          .machinery-single-image {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 16/9;
            object-fit: cover !important;
            object-position: center !important;
            border-radius: 16px;
            display: block;
            box-sizing: border-box;
          }
          
          /* Desktop - restore original behavior with fixed height */
          @media (min-width: 769px) {
            .machine-image-container,
            .machine-image-slider,
            .machine-image-slider .slick-slider,
            .machine-image-slider .slick-list,
            .machine-image-slider .slick-track {
              height: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
              border-radius: 16px;
              overflow: hidden;
              background: transparent;
              box-sizing: border-box;
            }
            
            .machine-image-slider .slider-item img,
            .slider-img-full,
            .machinery-single-image {
              width: 100% !important;
              height: 100% !important;
              aspect-ratio: 16/9;
              object-fit: cover !important;
              object-position: center !important;
            }
          }
          
          /* Mobile optimizations - Consistent with desktop */
          @media (max-width: 768px) {
            .machine-image-container,
            .machine-image-slider {
              height: auto !important;
              min-height: 250px !important;
              max-height: 350px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              background: transparent;
              border-radius: 16px;
              padding: 0;
              overflow: hidden;
            }
            
            .machine-image-slider .slider-item img,
            .slider-img-full,
            .machinery-single-image {
              aspect-ratio: 16/9 !important;
              object-fit: cover !important;
              width: 100% !important;
              height: 100% !important;
              max-width: 100% !important;
              max-height: 100% !important;
              background: transparent;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .machine-image-slider .slick-slider,
            .machine-image-slider .slick-list,
            .machine-image-slider .slick-track {
              height: 250px !important;
              display: block !important;
              align-items: stretch !important;
            }
            
            .machine-image-slider .slick-slide {
              display: block !important;
              height: 250px !important;
            }
            
            .machine-image-slider .slider-item {
              display: block !important;
              height: 250px !important;
              width: 100% !important;
            }
            
            /* Responsive landscape orientation */
            @media (max-width: 768px) and (orientation: landscape) {
              .machine-image-container,
              .machine-image-slider {
                max-height: 280px !important;
                min-height: 200px !important;
              }
              
              .machine-image-slider .slick-slider,
              .machine-image-slider .slick-list,
              .machine-image-slider .slick-track {
                height: 200px !important;
              }
              
              .machine-image-slider .slick-slide,
              .machine-image-slider .slider-item {
                height: 200px !important;
              }
            }
          }
          
          @media (max-width: 480px) {
            .machine-image-container,
            .machine-image-slider {
              min-height: 200px !important;
              max-height: 280px !important;
              padding: 0;
            }
            
            .machine-image-slider .slick-slider,
            .machine-image-slider .slick-list,
            .machine-image-slider .slick-track {
              height: 200px !important;
            }
            
            .machine-image-slider .slick-slide,
            .machine-image-slider .slider-item {
              height: 200px !important;
            }
            
            .machine-image-slider .slider-item img,
            .slider-img-full,
            .machinery-single-image {
              aspect-ratio: 16/9 !important;
              object-fit: cover !important;
              width: 100% !important;
              height: 100% !important;
            }
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

interface OptimizedImageUrls {
  origin: string;
  webp: string;
  medium: string;
  thumbnail: string;
  low: string;
}

interface ResponsiveImgProps {
  srcs: OptimizedImageUrls;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  style?: React.CSSProperties;
}

function ResponsiveImg({ srcs, alt, className, width, height, sizes, style }: ResponsiveImgProps) {
  if (!srcs) {
    console.warn(`No image sources provided for: ${alt}`);
    return null;
  }
  try {
    const getBestImageUrl = () => {
      if (width && width <= 300) {
        return srcs.thumbnail || srcs.medium || srcs.low || srcs.webp || srcs.origin;
      } else if (width && width <= 800) {
        return srcs.medium || srcs.low || srcs.webp || srcs.origin;
      } else if (width && width <= 1200) {
        return srcs.low || srcs.webp || srcs.origin;
      } else {
        return srcs.webp || srcs.origin;
      }
    };
    const imgSrc = getBestImageUrl() || '';
    const isValidUrl = imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('/'));
    if (!isValidUrl) {
      console.error(`Invalid image URL for ${alt}:`, imgSrc);
      return null;
    }
    const srcSet = (() => {
      const sets = [];
      if (srcs.thumbnail) sets.push(`${srcs.thumbnail} 300w`);
      if (srcs.medium) sets.push(`${srcs.medium} 800w`);
      if (srcs.low) sets.push(`${srcs.low} 1200w`);
      if (srcs.webp) sets.push(`${srcs.webp} 1920w`);
      return sets.length > 0 ? sets.join(', ') : undefined;
    })();
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
          if (srcs.origin && srcs.origin !== imgSrc) {
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
