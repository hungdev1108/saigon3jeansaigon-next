"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// COMMENTED FOR DEVELOPMENT - Tạm comment ProtectedRoute để không cần đăng nhập
// import ProtectedRoute from "@/components/admin/ProtectedRoute";
import EditableSection from "@/components/admin/EditableSection";
import facilitiesAdminService from "@/services/facilitiesService-admin";

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

export default function AdminFacilitiesPage() {
  const [facilitiesData, setFacilitiesData] = useState<FacilitiesData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("page-info");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await facilitiesAdminService.getCompleteFacilitiesData();

      if (result.success) {
        setFacilitiesData(result.data);
      } else {
        setMessage("❌ Lỗi khi tải dữ liệu: " + result.message);
      }
    } catch (error) {
      console.error("Error loading facilities data:", error);
      setMessage("❌ Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string, isSuccess = true) => {
    setMessage(isSuccess ? `✅ ${msg}` : `❌ ${msg}`);
    setTimeout(() => setMessage(""), 3000);
  };

  // Cập nhật page info
  const handleUpdatePageInfo = async (field: string, value: string) => {
    try {
      setSaving(true);
      const pageInfo = {
        pageTitle: field === "pageTitle" ? value : facilitiesData?.pageTitle,
        pageDescription:
          field === "pageDescription" ? value : facilitiesData?.pageDescription,
      };

      const result = await facilitiesAdminService.updatePageInfo(pageInfo);

      if (result.success) {
        setFacilitiesData((prev) =>
          prev ? { ...prev, [field]: value } : null
        );
        showMessage("Đã cập nhật thành công!");
      } else {
        showMessage(result.message || "Cập nhật thất bại", false);
      }
    } catch (error) {
      console.error("Error updating page info:", error);
      showMessage("Có lỗi xảy ra", false);
    } finally {
      setSaving(false);
    }
  };

  // Cập nhật key metric
  const handleUpdateKeyMetric = async (
    index: number,
    field: string,
    value: string
  ) => {
    try {
      setSaving(true);
      const updatedMetrics = [...(facilitiesData?.keyMetrics || [])];
      updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };

      const result = await facilitiesAdminService.updateKeyMetrics(
        updatedMetrics
      );

      if (result.success) {
        setFacilitiesData((prev) =>
          prev ? { ...prev, keyMetrics: updatedMetrics } : null
        );
        showMessage("Đã cập nhật key metric!");
      } else {
        showMessage(result.message || "Cập nhật thất bại", false);
      }
    } catch (error) {
      console.error("Error updating key metric:", error);
      showMessage("Có lỗi xảy ra", false);
    } finally {
      setSaving(false);
    }
  };

  // Thêm key metric mới
  const handleAddKeyMetric = async () => {
    try {
      setSaving(true);
      const newMetric = {
        icon: "fas fa-chart-bar",
        value: "0",
        unit: "",
        label: "New Metric",
        order: facilitiesData?.keyMetrics?.length || 0,
      };

      const result = await facilitiesAdminService.addKeyMetric(newMetric);

      if (result.success) {
        await loadData(); // Reload để lấy ID mới từ server
        showMessage("Đã thêm key metric mới!");
      } else {
        showMessage(result.message || "Thêm thất bại", false);
      }
    } catch (error) {
      console.error("Error adding key metric:", error);
      showMessage("Có lỗi xảy ra", false);
    } finally {
      setSaving(false);
    }
  };

  // Xóa key metric
  const handleDeleteKeyMetric = async (index: number) => {
    if (!confirm("Bạn có chắc muốn xóa key metric này?")) return;

    try {
      setSaving(true);
      const metric = facilitiesData?.keyMetrics?.[index];
      if (!metric?.id) return;

      const result = await facilitiesAdminService.deleteKeyMetric(metric.id);

      if (result.success) {
        const updatedMetrics =
          facilitiesData?.keyMetrics?.filter((_, i) => i !== index) || [];
        setFacilitiesData((prev) =>
          prev ? { ...prev, keyMetrics: updatedMetrics } : null
        );
        showMessage("Đã xóa key metric!");
      } else {
        showMessage(result.message || "Xóa thất bại", false);
      }
    } catch (error) {
      console.error("Error deleting key metric:", error);
      showMessage("Có lỗi xảy ra", false);
    } finally {
      setSaving(false);
    }
  };

  // Cập nhật facility feature
  const handleUpdateFacilityFeature = async (
    index: number,
    field: string,
    value: string
  ) => {
    try {
      setSaving(true);
      const updatedFeatures = [...(facilitiesData?.facilityFeatures || [])];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };

      const result = await facilitiesAdminService.updateFacilityFeatures(
        updatedFeatures
      );

      if (result.success) {
        setFacilitiesData((prev) =>
          prev ? { ...prev, facilityFeatures: updatedFeatures } : null
        );
        showMessage("Đã cập nhật facility feature!");
      } else {
        showMessage(result.message || "Cập nhật thất bại", false);
      }
    } catch (error) {
      console.error("Error updating facility feature:", error);
      showMessage("Có lỗi xảy ra", false);
    } finally {
      setSaving(false);
    }
  };

  // Upload hình ảnh cho facility feature
  const handleUploadFeatureImage = async (index: number, file: File) => {
    try {
      setSaving(true);
      const feature = facilitiesData?.facilityFeatures?.[index];
      if (!feature?.id) return;

      const result = await facilitiesAdminService.uploadFeatureImage(
        feature.id,
        file
      );

      if (result.success) {
        const updatedFeatures = [...(facilitiesData?.facilityFeatures || [])];
        updatedFeatures[index] = {
          ...updatedFeatures[index],
          image: result.data.imageUrl,
        };
        setFacilitiesData((prev) =>
          prev ? { ...prev, facilityFeatures: updatedFeatures } : null
        );
        showMessage("Đã tải lên hình ảnh!");
      } else {
        showMessage(result.message || "Tải lên thất bại", false);
      }
    } catch (error) {
      console.error("Error uploading feature image:", error);
      showMessage("Có lỗi xảy ra", false);
    } finally {
      setSaving(false);
    }
  };

  // Thêm facility feature mới
  const handleAddFacilityFeature = async () => {
    try {
      setSaving(true);
      const newFeature = {
        title: "New Facility Feature",
        description: "Feature description...",
        image: "/images/placeholder-facility.jpg",
        imageAlt: "New Facility Feature",
        order: facilitiesData?.facilityFeatures?.length || 0,
        layout: "left",
      };

      const result = await facilitiesAdminService.addFacilityFeature(
        newFeature
      );

      if (result.success) {
        await loadData(); // Reload để lấy ID mới từ server
        showMessage("Đã thêm facility feature mới!");
      } else {
        showMessage(result.message || "Thêm thất bại", false);
      }
    } catch (error) {
      console.error("Error adding facility feature:", error);
      showMessage("Có lỗi xảy ra", false);
    } finally {
      setSaving(false);
    }
  };

  // Xóa facility feature
  const handleDeleteFacilityFeature = async (index: number) => {
    if (!confirm("Bạn có chắc muốn xóa facility feature này?")) return;

    try {
      setSaving(true);
      const feature = facilitiesData?.facilityFeatures?.[index];
      if (!feature?.id) return;

      const result = await facilitiesAdminService.deleteFacilityFeature(
        feature.id
      );

      if (result.success) {
        const updatedFeatures =
          facilitiesData?.facilityFeatures?.filter((_, i) => i !== index) || [];
        setFacilitiesData((prev) =>
          prev ? { ...prev, facilityFeatures: updatedFeatures } : null
        );
        showMessage("Đã xóa facility feature!");
      } else {
        showMessage(result.message || "Xóa thất bại", false);
      }
    } catch (error) {
      console.error("Error deleting facility feature:", error);
      showMessage("Có lỗi xảy ra", false);
    } finally {
      setSaving(false);
    }
  };

  // Cập nhật SEO data
  const handleUpdateSeo = async (field: string, value: string | string[]) => {
    try {
      setSaving(true);
      const currentSeo = facilitiesData?.seo || {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      };
      const seoData = {
        metaTitle: currentSeo.metaTitle,
        metaDescription: currentSeo.metaDescription,
        keywords: currentSeo.keywords,
        [field]: value,
      };

      const result = await facilitiesAdminService.updateSeoData(seoData);

      if (result.success) {
        setFacilitiesData((prev) => (prev ? { ...prev, seo: seoData } : null));
        showMessage("Đã cập nhật SEO!");
      } else {
        showMessage(result.message || "Cập nhật thất bại", false);
      }
    } catch (error) {
      console.error("Error updating SEO:", error);
      showMessage("Có lỗi xảy ra", false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      // COMMENTED FOR DEVELOPMENT - Tạm comment ProtectedRoute để không cần đăng nhập
      // <ProtectedRoute>
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu facilities...</p>
      </div>
      // </ProtectedRoute>
    );
  }

  return (
    // COMMENTED FOR DEVELOPMENT - Tạm comment ProtectedRoute để không cần đăng nhập
    // <ProtectedRoute>
    <div className="admin-page">
      <div className="page-header">
        <h1>🏭 Quản lý Trang Facilities</h1>
        <p>Chỉnh sửa nội dung trang cơ sở vật chất của website</p>

        {message && (
          <div
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "page-info" ? "active" : ""}`}
          onClick={() => setActiveTab("page-info")}
        >
          📄 Page Info
        </button>
        <button
          className={`tab-btn ${activeTab === "key-metrics" ? "active" : ""}`}
          onClick={() => setActiveTab("key-metrics")}
        >
          📊 Key Metrics
        </button>
        <button
          className={`tab-btn ${activeTab === "features" ? "active" : ""}`}
          onClick={() => setActiveTab("features")}
        >
          🏭 Facility Features
        </button>
        <button
          className={`tab-btn ${activeTab === "seo" ? "active" : ""}`}
          onClick={() => setActiveTab("seo")}
        >
          🔍 SEO
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "page-info" && (
          <div className="page-info-section">
            <h2>📄 Thông tin trang</h2>

            <EditableSection
              title="Page Title"
              content={facilitiesData?.pageTitle || ""}
              type="text"
              onSave={(content) => handleUpdatePageInfo("pageTitle", content)}
            />

            <EditableSection
              title="Page Description"
              content={facilitiesData?.pageDescription || ""}
              type="textarea"
              onSave={(content) =>
                handleUpdatePageInfo("pageDescription", content)
              }
            />
          </div>
        )}

        {activeTab === "key-metrics" && (
          <div className="key-metrics-section">
            <div className="section-header">
              <h2>📊 Key Metrics</h2>
              <button
                onClick={handleAddKeyMetric}
                className="add-btn"
                disabled={saving}
              >
                ➕ Thêm Key Metric
              </button>
            </div>

            {facilitiesData?.keyMetrics?.map((metric, index) => (
              <div key={metric.id || index} className="metric-item">
                <div className="metric-item-header">
                  <h3>Key Metric {index + 1}</h3>
                  <button
                    onClick={() => handleDeleteKeyMetric(index)}
                    className="delete-btn"
                    disabled={saving}
                  >
                    🗑️ Xóa
                  </button>
                </div>

                <EditableSection
                  title="Icon (CSS class)"
                  content={metric.icon}
                  type="text"
                  onSave={(content) =>
                    handleUpdateKeyMetric(index, "icon", content)
                  }
                />

                <EditableSection
                  title="Value"
                  content={metric.value}
                  type="text"
                  onSave={(content) =>
                    handleUpdateKeyMetric(index, "value", content)
                  }
                />

                <EditableSection
                  title="Unit"
                  content={metric.unit}
                  type="text"
                  onSave={(content) =>
                    handleUpdateKeyMetric(index, "unit", content)
                  }
                />

                <EditableSection
                  title="Label"
                  content={metric.label}
                  type="text"
                  onSave={(content) =>
                    handleUpdateKeyMetric(index, "label", content)
                  }
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "features" && (
          <div className="features-section">
            <div className="section-header">
              <h2>🏭 Facility Features</h2>
              <button
                onClick={handleAddFacilityFeature}
                className="add-btn"
                disabled={saving}
              >
                ➕ Thêm Feature
              </button>
            </div>

            {facilitiesData?.facilityFeatures?.map((feature, index) => (
              <div key={feature.id || index} className="feature-item">
                <div className="feature-item-header">
                  <h3>Feature {index + 1}</h3>
                  <button
                    onClick={() => handleDeleteFacilityFeature(index)}
                    className="delete-btn"
                    disabled={saving}
                  >
                    🗑️ Xóa
                  </button>
                </div>

                <EditableSection
                  title="Title"
                  content={feature.title}
                  type="text"
                  onSave={(content) =>
                    handleUpdateFacilityFeature(index, "title", content)
                  }
                />

                <EditableSection
                  title="Description"
                  content={feature.description}
                  type="textarea"
                  onSave={(content) =>
                    handleUpdateFacilityFeature(index, "description", content)
                  }
                />

                <EditableSection
                  title="Image"
                  content={feature.image}
                  type="image"
                  imagePreview={feature.image}
                  onImageUpload={(file) =>
                    handleUploadFeatureImage(index, file)
                  }
                  onSave={(content) =>
                    handleUpdateFacilityFeature(index, "image", content)
                  }
                />

                <EditableSection
                  title="Image Alt Text"
                  content={feature.imageAlt}
                  type="text"
                  onSave={(content) =>
                    handleUpdateFacilityFeature(index, "imageAlt", content)
                  }
                />

                <EditableSection
                  title="Layout (left/right)"
                  content={feature.layout}
                  type="text"
                  onSave={(content) =>
                    handleUpdateFacilityFeature(index, "layout", content)
                  }
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "seo" && (
          <div className="seo-section">
            <h2>🔍 SEO Settings</h2>

            <EditableSection
              title="Meta Title"
              content={facilitiesData?.seo?.metaTitle || ""}
              type="text"
              onSave={(content) => handleUpdateSeo("metaTitle", content)}
            />

            <EditableSection
              title="Meta Description"
              content={facilitiesData?.seo?.metaDescription || ""}
              type="textarea"
              onSave={(content) => handleUpdateSeo("metaDescription", content)}
            />

            <EditableSection
              title="Keywords (comma separated)"
              content={facilitiesData?.seo?.keywords?.join(", ") || ""}
              type="textarea"
              onSave={(content) =>
                handleUpdateSeo(
                  "keywords",
                  content.split(",").map((k) => k.trim())
                )
              }
            />
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="preview-section">
        <h3>🔍 Preview</h3>
        <div className="facilities-preview">
          <h2>{facilitiesData?.pageTitle}</h2>
          <p>{facilitiesData?.pageDescription}</p>

          <div className="metrics-preview">
            {facilitiesData?.keyMetrics?.map((metric, index) => (
              <div key={index} className="metric-preview">
                <div className="metric-value">
                  {metric.value} {metric.unit}
                </div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="features-preview">
            {facilitiesData?.facilityFeatures?.map((feature, index) => (
              <div key={index} className="feature-preview">
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
                {feature.image && (
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    width={200}
                    height={150}
                    className="preview-image"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
