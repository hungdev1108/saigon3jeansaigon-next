"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import { machineryService } from "../../services";
import { BACKEND_DOMAIN } from "../../api/config";

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
}

function MachineImageSlider({ images, alt }: MachineImageSliderProps) {
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
        width={500}
        height={500}
      />
    );
  }

  // Multiple images - use slider
  return (
    <div className="machine-image-slider">
      <Slider {...sliderSettings}>
        {images.map((image, index) => (
          <div key={index} className="slider-item">
            <Image
              src={`${BACKEND_DOMAIN}${image.url}`}
              alt={image.alt || `${alt} - ${index + 1}`}
              className="img-fluid"
              width={500}
              height={500}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default function Machinery() {
  const [machineryData, setMachineryData] = useState<MachineryData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState(1);
  const [activeMachine, setActiveMachine] = useState<string>("");

  useEffect(() => {
    const fetchMachineryData = async () => {
      try {
        setLoading(true);
        const data = await machineryService.getCompleteMachineryData();
        const typedData = data as MachineryData;
        setMachineryData(typedData);
        setError(null);

        // Set default active machine for first stage
        if (
          typedData.stages &&
          typedData.stages.length > 0 &&
          typedData.stages[0].machines.length > 0
        ) {
          setActiveMachine(
            typedData.stages[0].machines[0].name
              .toLowerCase()
              .replace(/\s+/g, "")
          );
        }
      } catch (err) {
        console.error("Error fetching machinery data:", err);
        setError("Failed to load machinery data");
        // Sử dụng dữ liệu mặc định khi có lỗi
        const defaultData = machineryService.getDefaultMachineryData();
        const typedDefaultData = defaultData as MachineryData;
        setMachineryData(typedDefaultData);
        if (
          typedDefaultData.stages &&
          typedDefaultData.stages.length > 0 &&
          typedDefaultData.stages[0].machines.length > 0
        ) {
          setActiveMachine(
            typedDefaultData.stages[0].machines[0].name
              .toLowerCase()
              .replace(/\s+/g, "")
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMachineryData();
  }, []);

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
    if (machineryData) {
      const selectedStage = machineryData.stages.find(
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

  if (loading) {
    return (
      <section className="machinery-section py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading machinery data...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!machineryData) {
    return (
      <section className="machinery-section py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="text-danger">Error loading machinery data</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const currentStage = machineryData.stages.find(
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
              <div className="stages-container">
                {machineryData.stages.map((stage) => (
                  <div
                    key={stage.id}
                    className={`stage-item ${
                      activeStage === stage.stageNumber ? "active" : ""
                    }`}
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
              <div className="machines-container">
                {/* Current Stage Machines */}
                <div className="machines-wrapper active">
                  {/* Machine Tabs */}
                  {currentStage && currentStage.machines.length > 0 && (
                    <>
                      <ul className="nav nav-tabs machine-tabs" role="tablist">
                        {currentStage.machines.map((machine) => (
                          <li
                            key={machine.id}
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
      </section>
    </>
  );
}
