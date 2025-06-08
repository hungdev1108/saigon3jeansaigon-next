"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { facilitiesService } from "../../services";

interface KeyMetric {
  id: string;
  icon: string;
  value: string;
  unit: string;
  label: string;
  order: number;
}

interface FacilityFeature {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  order: number;
  layout: string;
}

interface FacilitiesData {
  pageTitle: string;
  pageDescription: string;
  keyMetrics: KeyMetric[];
  facilityFeatures: FacilityFeature[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export default function Facilities() {
  const [facilitiesData, setFacilitiesData] = useState<FacilitiesData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilitiesData = async () => {
      try {
        setLoading(true);
        const data = await facilitiesService.getCompleteFacilitiesData();
        setFacilitiesData(data as FacilitiesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching facilities data:", err);
        setError("Failed to load facilities data");
        // Sử dụng dữ liệu mặc định khi có lỗi
        const defaultData = facilitiesService.getDefaultFacilitiesData();
        setFacilitiesData(defaultData as FacilitiesData);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilitiesData();
  }, []);

  if (loading) {
    return (
      <section className="facilities-overview py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading facilities data...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!facilitiesData) {
    return (
      <section className="facilities-overview py-5">
        <div className="container">
          <div className="text-center">
            <h2 className="text-danger">Error loading facilities data</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    //  Facilities Overview
    <section className="facilities-overview py-5">
      <div className="container">
        <h2 className="section-title mt-5">{facilitiesData.pageTitle}</h2>

        {/* <!-- Key Metrics --> */}
        <div className="key-metrics text-center mb-5">
          <div className="row justify-content-center">
            {facilitiesData.keyMetrics.map((metric) => (
              <div key={metric.id} className="col-md-4 metric-item">
                <div className="metric-icon">
                  <i className={metric.icon}></i>
                </div>
                <div className="metric-value">
                  {metric.value}{" "}
                  {metric.unit && (
                    <span className="metric-unit">
                      {metric.unit.includes("²") ? (
                        <>
                          {metric.unit.replace("²", "")}
                          <sup>2</sup>
                        </>
                      ) : (
                        metric.unit
                      )}
                    </span>
                  )}
                </div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* <!-- Facility Features --> */}
        <div className="facility-features">
          {facilitiesData.facilityFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`feature-item row mb-5 ${
                feature.layout === "right" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="col-lg-6 feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              <div className="col-lg-6 feature-image">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  width={600}
                  height={400}
                  className="img-fluid rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
