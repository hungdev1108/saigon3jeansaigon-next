"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// COMMENTED FOR DEVELOPMENT - Tạm comment ProtectedRoute để không cần đăng nhập
// import ProtectedRoute from "@/components/admin/ProtectedRoute";
// import EditableSection from "@/components/admin/EditableSection";
import facilitiesAdminService from "@/services/facilitiesService-admin";
import Toast from "@/components/admin/Toast";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import { FiTrash2, FiEdit, FiPlusCircle } from 'react-icons/fi';
import { BACKEND_DOMAIN } from '@/api/config';
import { getOptimizedImageUrls } from '@/shared/imageUtils';
import ResponsiveImg from '@/components/pages/facilities';

interface KeyMetric {
  id: string;
  icon: string;
  value: string;
  unit: string;
  label: string;
  order: number;
}

interface FacilityFeature {
  id?: string; // id có thể không có
  _id: string; // _id là trường bắt buộc từ MongoDB
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  images: { url: string; alt: string; order: number }[];
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
  const [facilitiesData, setFacilitiesData] = useState<FacilitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Bỏ activeTab, không dùng tab nữa

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'keyMetric'|'facilityFeature'|null>(null);
  const [modalMode, setModalMode] = useState<'add'|'edit'>('add');
  const [modalIndex, setModalIndex] = useState<number|null>(null);
  const [modalData, setModalData] = useState<Partial<KeyMetric & FacilityFeature>>({});

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setToastOpen(true);
    // Auto-close toast after 5 seconds (but only for success messages)
    if (type === 'success') {
      setTimeout(() => {
        setToastOpen(false);
      }, 5000);
    }
  };

  // Mở modal cho Add/Edit
  const openModal = (type: 'keyMetric'|'facilityFeature', mode: 'add'|'edit', index: number|null = null, data: Partial<KeyMetric & FacilityFeature> = {}) => {
    if (type === 'keyMetric' && mode === 'add' && (facilitiesData?.keyMetrics?.length || 0) >= 3) {
      showToast('Chỉ được tối đa 3 Key Metrics!','error');
      return;
    }
    console.log('openModal', {type, mode, index, data});
    setModalType(type);
    setModalMode(mode);
    setModalIndex(index);
    if (mode === 'add') {
      if (type === 'keyMetric') {
        setModalData({icon:'fas fa-chart-bar',value:'0',unit:'',label:'New Metric',order:facilitiesData?.keyMetrics?.length||0});
      } else {
        setModalData({title:'New Facility Feature',description:'Feature description...',image:'/images/placeholder-facility.jpg',imageAlt:'New Facility Feature',order:facilitiesData?.facilityFeatures?.length||0,layout:'left'});
      }
    } else {
      setModalData(data);
    }
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // Xử lý submit modal
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (modalType === 'keyMetric') {
        // Handle key metric save
        if (modalMode === 'add') {
          const result = await facilitiesAdminService.addKeyMetric(modalData as KeyMetric);
          if (result.success) {
            showToast('Đã thêm Key Metric!');
            
            // Reload data from server
            await loadData();
          } else {
            showToast(result.message || 'Thêm thất bại', 'error');
          }
        } else {
          // Edit existing metric
          const metrics = [...(facilitiesData?.keyMetrics || [])];
          if (modalIndex !== null && metrics[modalIndex]) {
            metrics[modalIndex] = { ...metrics[modalIndex], ...modalData };
            
            const result = await facilitiesAdminService.updateKeyMetrics(metrics);
            if (result.success) {
              showToast('Đã cập nhật Key Metric!');
              
              // Reload data from server
              await loadData();
            } else {
              showToast(result.message || 'Cập nhật thất bại', 'error');
            }
          }
        }
      } else if (modalType === 'facilityFeature') {
        // Handle facility feature save
        if (modalMode === 'add') {
          // Prepare feature data
          const featureData = { ...modalData };
          
          // Process new images if any
          if (newImages.length > 0) {
            // Upload images
            const formData = new FormData();
            newImages.forEach(file => {
              formData.append('images', file);
            });
            
            const uploadResult = await facilitiesAdminService.uploadMultipleImages(formData);
            
            if (uploadResult.success && uploadResult.urls) {
              // Create images array for feature
              featureData.images = uploadResult.urls.map((url, idx) => ({
                url,
                alt: `${featureData.title} Image ${idx + 1}`,
                order: idx
              }));
              
              // Set first image as main image
              if (uploadResult.urls.length > 0) {
                featureData.image = uploadResult.urls[0];
              }
            }
          }
          
          const result = await facilitiesAdminService.addFacilityFeature(featureData as FacilityFeature);
          if (result.success) {
            showToast('Đã thêm Facility Feature!');
            setNewImages([]);
            
            // Reload data from server
            await loadData();
          } else {
            showToast(result.message || 'Thêm thất bại', 'error');
          }
        } else {
          // Edit existing feature
          const features = [...(facilitiesData?.facilityFeatures || [])];
          if (modalIndex !== null && features[modalIndex]) {
            const updatedFeature = { ...features[modalIndex], ...modalData };
            
            // Process new images if any
            if (newImages.length > 0) {
              // Upload images
              const formData = new FormData();
              newImages.forEach(file => {
                formData.append('images', file);
              });
              
              const uploadResult = await facilitiesAdminService.uploadMultipleImages(formData);
              
              if (uploadResult.success && uploadResult.urls) {
                // Append to existing images array
                if (!updatedFeature.images) updatedFeature.images = [];
                
                const newImagesData = uploadResult.urls.map((url, idx) => ({
                  url,
                  alt: `${updatedFeature.title} Image ${updatedFeature.images.length + idx + 1}`,
                  order: updatedFeature.images.length + idx
                }));
                
                updatedFeature.images = [...updatedFeature.images, ...newImagesData];
                
                // Set first image as main image if no main image exists
                if (!updatedFeature.image && uploadResult.urls.length > 0) {
                  updatedFeature.image = uploadResult.urls[0];
                }
              }
            }
            
            features[modalIndex] = updatedFeature;
            
            // Update all features
            const result = await facilitiesAdminService.updateFacilityFeatures(features);
            if (result.success) {
              showToast('Đã cập nhật Facility Feature!');
              setNewImages([]);
              
              // Reload data from server instead of updating state
              await loadData();
            } else {
              showToast(result.message || 'Cập nhật thất bại', 'error');
            }
          }
        }
      }
      
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
      showToast('Có lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Helper để lấy URL ảnh đúng
  const getFeatureImageUrl = (img: string) => {
    if (!img) return '/images/placeholder-facility.jpg';
    if (img.startsWith('http')) return img;
    
    // Đảm bảo URL luôn có tiền tố BACKEND_DOMAIN
    const path = img.startsWith('/') ? img : `/${img}`;
    return `${BACKEND_DOMAIN}${path}`;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await facilitiesAdminService.getCompleteFacilitiesData();

      if (result.success) {
        console.log("Loaded data from server:", result.data);
        // Đặc biệt kiểm tra ID của các facility features
        if (result.data.facilityFeatures && result.data.facilityFeatures.length > 0) {
          console.log("Facility Features IDs:", result.data.facilityFeatures.map((f: FacilityFeature) => ({ 
            id: f.id,
            _id: f._id,
            title: f.title 
          })));
          
          // Đảm bảo mỗi feature đều có _id
          const missingIds = result.data.facilityFeatures.filter((f: Partial<FacilityFeature>) => !f._id);
          if (missingIds.length > 0) {
            console.error("WARNING: Some features are missing _id:", missingIds);
          }
        }
        setFacilitiesData(result.data);
      } else {
        showToast("❌ Lỗi khi tải dữ liệu: " + result.message, 'error');
      }
    } catch (error) {
      console.error("Error loading facilities data:", error);
      showToast("❌ Lỗi khi tải dữ liệu", 'error');
    } finally {
      setLoading(false);
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
        showToast('Đã xóa Key Metric!','success');
      } else {
        showToast(result.message || "Xóa thất bại", 'error');
      }
    } catch (error) {
      console.error("Error deleting key metric:", error);
      showToast('Có lỗi xảy ra','error');
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
      console.log("Feature to delete:", feature);
      
      // Sử dụng _id thay vì id
      const featureId = feature?._id || feature?.id;
      
      if (!featureId) {
        console.error("Feature ID is missing", { feature });
        showToast("Không tìm thấy ID của feature", 'error');
        setSaving(false);
        return;
      }

      console.log("Deleting facility feature with ID:", featureId);
      const result = await facilitiesAdminService.deleteFacilityFeature(
        featureId
      );
      console.log("Delete response:", result);

      if (result.success) {
        showToast('Đã xóa Facility Feature!', 'success');
        
        // Làm mới dữ liệu từ server thay vì cập nhật trạng thái
        await loadData();
      } else {
        showToast(result.message || "Xóa thất bại", 'error');
      }
    } catch (error) {
      console.error("Error deleting facility feature:", error);
      showToast('Có lỗi xảy ra khi xóa', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 1. Thêm state cho ảnh mới chọn (file)
  const [newImages, setNewImages] = useState<File[]>([]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu facilities...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Toast open={toastOpen} type={toastType} message={toastMsg} onClose={()=>setToastOpen(false)} />
      <div className="admin-page-header">
        <h1 className="admin-page-title">🏭 Quản lý Trang Facilities</h1>
        <p className="admin-page-description">Chỉnh sửa nội dung trang cơ sở vật chất của website</p>
      </div>
      <AdminSectionCard title="Key Metrics">
        {/* Remove add button if already 3 metrics */}
        {/* <button onClick={() => openModal('keyMetric','add',null,{icon:'fas fa-chart-bar',value:'0',unit:'',label:'New Metric',order:facilitiesData?.keyMetrics?.length||0})} className="btn-add" disabled={saving}>
          <FiPlusCircle /> Thêm Key Metric
        </button> */}
        <div className="metrics-grid">
            {facilitiesData?.keyMetrics?.map((metric, index) => (
            <div key={metric.id || index} className="metric-card">
              <div className="metric-card-actions">
                <button className="edit-btn" onClick={() => openModal('keyMetric','edit',index,metric)}><FiEdit /></button>
                <button className="delete-btn" onClick={() => handleDeleteKeyMetric(index)} disabled={saving} style={{ color: '#ff4444' }}><FiTrash2 /></button>
              </div>
              <div className="metric-icon"><i className={metric.icon}></i></div>
              <div className="metric-value">{metric.value} {metric.unit}</div>
              <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
      </AdminSectionCard>
      <AdminSectionCard title="Facility Features">
        <button onClick={() => openModal('facilityFeature','add',null,{title:'New Facility Feature',description:'Feature description...',image:'/images/placeholder-facility.jpg',imageAlt:'New Facility Feature',order:facilitiesData?.facilityFeatures?.length||0,layout:'left'})} className="btn-add" disabled={saving}>
          <FiPlusCircle /> Thêm Feature
              </button>
        <div className="features-grid">
            {facilitiesData?.facilityFeatures?.map((feature, index) => {
  const firstImageUrl = feature.images && feature.images.length > 0 ? feature.images[0].url : (feature.image || '/images/placeholder-facility.jpg');
  const firstImageAlt = feature.images && feature.images.length > 0 ? feature.images[0].alt : feature.imageAlt;
  return (
    <div key={feature.id || index} className="feature-card">
      <div className="feature-card-actions">
        <button className="edit-btn" onClick={() => openModal('facilityFeature','edit',index,feature)}><FiEdit /></button>
        <button className="delete-btn" onClick={() => handleDeleteFacilityFeature(index)} disabled={saving} style={{ color: '#ff4444' }}><FiTrash2 /></button>
      </div>
      <div className="feature-image-preview">
        <Image
          src={getFeatureImageUrl(firstImageUrl)}
          alt={firstImageAlt}
          width={220}
          height={140}
          className="preview-image"
        />
      </div>
      <div className="feature-content">
        <h4>{feature.title}</h4>
        <p>{feature.description}</p>
        <div className="feature-layout">Layout: {feature.layout}</div>
      </div>
    </div>
  );
})}
        </div>
      </AdminSectionCard>
      {/* Modal popup cho Add/Edit */}
      {modalOpen && (
        <div className="modal-overlay active">
          <div className="modal-container large">
            <div className="modal-header">
              <h3>{modalMode === 'edit' ? (modalType === 'keyMetric' ? 'Chỉnh sửa Key Metric' : 'Chỉnh sửa Facility Feature') : (modalType === 'keyMetric' ? 'Thêm Key Metric' : 'Thêm Facility Feature')}</h3>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleModalSubmit}>
              <div className="modal-body">
                {modalType === 'keyMetric' ? (
                  <>
                    <div className="form-group">
                      <label>
                        Icon
                        <span className="icon-tooltip" title="Chọn icon tại fontawesome.com/icons. Copy tên class, ví dụ: fas fa-globe">
                          <a href="https://fontawesome.com/icons" target="_blank" rel="noopener noreferrer" style={{marginLeft: 6, color: '#7e57c2', textDecoration: 'none'}}>
                            <i className="fas fa-info-circle"></i>
                          </a>
                        </span>
                      </label>
                      <div className="icon-input-group">
                        <input 
                          type="text" 
                          value={modalData.icon || ''} 
                          onChange={e => setModalData({ ...modalData, icon: e.target.value })} 
                          className="form-input" 
                          required 
                          placeholder="fas fa-chart-bar"
                        />
                        <div className="icon-preview">
                          <i className={modalData.icon || 'fas fa-question'}></i>
                        </div>
                      </div>
                      <small className="form-help">Ví dụ: fas fa-chart-bar, fas fa-users, fas fa-globe</small>
                    </div>
                    <div className="form-row">
                      <div className="form-group half">
                        <label>Value</label>
                        <input type="text" value={modalData.value || ''} onChange={e => setModalData({ ...modalData, value: e.target.value })} className="form-input" required />
                      </div>
                      <div className="form-group half">
                        <label>Unit <span title="Đơn vị đo lường, ví dụ: m², pcs/year, ..." style={{cursor:'help',color:'#888',fontSize:'0.95em'}}>(?)</span></label>
                        <input type="text" value={modalData.unit || ''} onChange={e => setModalData({ ...modalData, unit: e.target.value })} className="form-input" placeholder="m², pcs/year, ..." />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Label</label>
                      <input type="text" value={modalData.label || ''} onChange={e => setModalData({ ...modalData, label: e.target.value })} className="form-input" required />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Tiêu đề Feature</label>
                      <input type="text" value={modalData.title || ''} onChange={e => setModalData({ ...modalData, title: e.target.value })} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label>Mô tả</label>
                      <textarea value={modalData.description || ''} onChange={e => setModalData({ ...modalData, description: e.target.value })} className="form-textarea" required />
                    </div>
                    <div className="form-group">
                      <label>Ảnh</label>
                      <div className="feature-images-grid">
                        {/* Ảnh cũ (url từ server) */}
                        {Array.isArray(modalData.images) && modalData.images.length > 0 && (
                          modalData.images.map((imgObj: { url: string; alt: string; order: number }, idx: number) => (
                            <div key={"old-"+idx} className="feature-image-thumb">
                              <Image 
                                src={getFeatureImageUrl(imgObj.url)} 
                                alt={imgObj.alt || modalData.imageAlt || ''} 
                                width={100} 
                                height={70} 
                                style={{objectFit: 'cover', borderRadius: '8px'}}
                              />
                              <button 
                                type="button" 
                                className="btn-delete-img" 
                                onClick={() => {
                                  setModalData((prev: Partial<KeyMetric & FacilityFeature>) => {
                                    if (Array.isArray(prev.images)) {
                                      return { ...prev, images: prev.images.filter((_: unknown, i: number) => i !== idx) };
                                    }
                                    return prev;
                                  });
                                }}
                              ><FiTrash2 /></button>
                            </div>
                          ))
                        )}
                        {/* Ảnh mới chọn (file local) */}
                        {newImages.map((file, idx) => (
                          <div key={"new-"+idx} className="feature-image-thumb">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={file.name} 
                              width={100} 
                              height={70} 
                              style={{objectFit:'cover', borderRadius: '8px'}}
                            />
                            <button 
                              type="button" 
                              className="btn-delete-img" 
                              onClick={() => {
                                setNewImages(prev => prev.filter((_, i) => i !== idx));
                              }}
                            ><FiTrash2 /></button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={e => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            setNewImages(prev => [...prev, ...Array.from(files)]);
                          }
                        }}
                        style={{marginTop:8}}
                      />
                      <small className="form-help">Chọn nhiều ảnh, ảnh sẽ chỉ được lưu khi bấm Lưu</small>
                    </div>
                    <div className="form-group">
                      <label>Layout</label>
                      <select value={modalData.layout || 'left'} onChange={e => setModalData({ ...modalData, layout: e.target.value })} className="form-input">
                        <option value="left">Trái</option>
                        <option value="right">Phải</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" onClick={closeModal} disabled={saving}>Hủy</button>
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style jsx>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-top: 18px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 28px;
          margin-top: 18px;
        }
        .metric-card, .feature-card {
          background: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          padding: 18px 18px 14px 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .metric-card-actions, .feature-card-actions {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 8px;
        }
        .edit-btn, .delete-btn {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 5px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: background 0.2s;
        }
        .edit-btn:hover { background: #e3f2fd; }
        .delete-btn:hover { background: #ffebee; }
        .metric-icon {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }
        .metric-value {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .metric-label {
          color: #666;
          font-size: 1rem;
        }
        .feature-image-preview, .image-preview-container {
          margin-bottom: 10px;
          border-radius: 8px;
          overflow: hidden;
          background: #eee;
          width: 220px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-content h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 6px 0;
        }
        .feature-content p {
          font-size: 0.98rem;
          margin: 0 0 4px 0;
        }
        .feature-layout {
          font-size: 0.95rem;
          color: #888;
        }
        .btn-add {
          background: #fff;
          border: 1.5px solid #7e57c2;
          color: #7e57c2;
          border-radius: 6px;
          padding: 7px 16px;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s, color 0.2s;
        }
        .btn-add:hover {
          background: #ede7f6;
          color: #5e35b1;
        }
        .image-upload-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .feature-images-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }
        .feature-image-thumb {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .feature-image-thumb:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .btn-delete-img {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          z-index: 10;
          transition: all 0.2s ease;
        }
        .btn-delete-img:hover {
          background: #cc0000;
          transform: scale(1.1);
        }
        .dropzone {
          border: 2px dashed #aaa;
          padding: 12px;
          margin-top: 8px;
          border-radius: 8px;
          text-align: center;
          color: #888;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .dropzone:hover {
          border-color: #7e57c2;
        }
        .modal-overlay {
          z-index: 9999 !important;
        }
        .form-row {
          display: flex;
          gap: 16px;
        }
        .form-group.half {
          flex: 1 1 0;
        }
        .icon-input-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .icon-preview {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1.2rem;
          color: #666;
        }
        .form-help {
          color: #888;
          font-size: 0.9rem;
          margin-top: 4px;
        }
        .icon-tooltip {
          display: inline-block;
          margin-left: 4px;
          cursor: pointer;
          vertical-align: middle;
        }
        .icon-tooltip i {
          font-size: 1.1em;
          color: #7e57c2;
          transition: color 0.2s;
        }
        .icon-tooltip:hover i {
          color: #5e35b1;
        }
        .modern-dropzone-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 12px;
          width: 100%;
        }
        .modern-dropzone {
          width: 100%;
          min-height: 180px;
          border: 2px dashed #339af0;
          border-radius: 16px;
          background: #f8fbff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.3s ease;
          position: relative;
        }
        .modern-dropzone:hover {
          border-color: #1976d2;
          background: #f0f8ff;
        }
        .modern-dropzone.drag-active {
          border-color: #4caf50;
          background: #f1f8e9;
          transform: scale(1.02);
        }
        .modern-dropzone.drag-reject {
          border-color: #f44336;
          background: #ffebee;
        }
        .dropzone-content {
          text-align: center;
          width: 100%;
          padding: 20px;
        }
        .cloud-icon {
          font-size: 3rem;
          color: #339af0;
          margin-bottom: 12px;
          transition: transform 0.3s ease;
        }
        .modern-dropzone:hover .cloud-icon {
          transform: scale(1.1);
        }
        .dropzone-text {
          font-size: 1.2rem;
          color: #333;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .browse-link {
          color: #1976d2;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 600;
        }
        .dropzone-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #666;
          margin-top: 12px;
          width: 100%;
          max-width: 450px;
          margin-left: auto;
          margin-right: auto;
        }
        .upload-btn {
          background: #1976d2;
          color: #fff;
          border-radius: 8px;
          padding: 10px 32px;
          font-size: 1rem;
          font-weight: 500;
          border: none;
          margin-top: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .upload-btn:hover:not(:disabled) {
          background: #1565c0;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
        }
        .upload-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
