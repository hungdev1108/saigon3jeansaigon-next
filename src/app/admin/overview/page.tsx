"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { FiSave, FiImage, FiType, FiFileText, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import { toast, ToastOptions } from "react-toastify";
import overviewAdminService from "@/services/overviewService-admin";
import { BACKEND_DOMAIN } from '@/api/config';

// Toast config
const toastOptions: ToastOptions = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

interface Banner {
  _id: string;
  title: string;
  description: string;
  backgroundImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Milestone {
  _id: string;
  year: string;
  title: string;
  description: string;
  image?: string;
  order: number;
}

interface Message {
  _id: string;
  ceoName: string;
  content: Array<{ paragraph: string; order: number }>;
  ceoImage: string;
  isActive: boolean;
}

interface VisionMission {
  _id: string;
  vision: { title: string; content: string; icon: string };
  mission: { title: string; content: string; icon: string };
  isActive: boolean;
}

interface CoreValue {
  _id: string;
  title: string;
  content: string;
  icon: string;
  order: number;
}

interface OverviewData {
  banner: Banner;
  milestones: Milestone[];
  message: Message;
  visionMission: VisionMission;
  coreValues: CoreValue[];
}

// Thêm type cho từng đoạn message
interface MessageContent {
  paragraph: string;
  type: 'header' | 'normal' | 'highlight' | 'ceo' | 'ceoTitle';
  order: number;
}

// FormItem component
const FormItem = ({ label, icon, children }: { label: string; icon?: React.ReactNode, children: React.ReactNode }) => (
  <div className="form-item">
    <label className="form-item-label">
      {icon}
      <span>{label}</span>
    </label>
    {children}
  </div>
);

// AdminSectionCard component
const AdminSectionCard = ({ title, children, onSave, isSaving, hasChanges }: { title: string, children: React.ReactNode, onSave?: () => void, isSaving?: boolean, hasChanges?: boolean }) => (
  <div className="admin-section-card">
    <div className="card-header">
      <h3 className="card-title">{title}</h3>
      {onSave && (
        <button onClick={onSave} className="btn-save" disabled={isSaving || !hasChanges}>
          <FiSave />
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      )}
    </div>
    <div className="card-content">
      {children}
    </div>
  </div>
);

// Helper: Render mô tả có danh sách thụt vào nếu có dấu '-'
function renderMilestoneDescription(text: string) {
  if (!text) return null;
  const blocks = text.trim().split(/\n\s*\n/);
  return blocks.map((block, idx) => {
    const lines = block.split('\n');
    if (lines.every(line => line.trim().startsWith('-'))) {
      return (
        <ul key={idx} style={{ marginLeft: 40, marginTop: 8, marginBottom: 8 }}>
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^(\s*)-/, '$1')}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={idx} style={{ marginBottom: 8, whiteSpace: 'pre-line' }}>{block}</p>
    );
  });
}

export default function AdminOverviewPage() {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [originalData, setOriginalData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [imagePreview, setImagePreview] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await overviewAdminService.getCompleteOverviewData();

      if (result.success) {
        console.log("📊 Overview data loaded:", result.data);
        console.log("🎯 Banner data:", result.data.banner);
        console.log("🖼️ Banner image path:", result.data.banner.backgroundImage);
        console.log("🌐 Full banner URL:", `${BACKEND_DOMAIN}${result.data.banner.backgroundImage}`);
        setOverviewData(result.data);
        setOriginalData(result.data);
      } else {
        toast.error("❌ Lỗi khi tải dữ liệu: " + result.message, toastOptions);
      }
    } catch (error) {
      console.error("Error loading overview data:", error);
      toast.error("❌ Lỗi khi tải dữ liệu", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = (section: string) => {
    if (!overviewData || !originalData) return false;
    if (section === 'banner') {
      const banner = overviewData.banner;
      const originalBanner = originalData.banner;
      // So sánh text
      if (
        banner.title !== originalBanner.title ||
        banner.description !== originalBanner.description
      ) return true;
      // So sánh file
      if (files['banner-backgroundImage']) return true;
      return false;
    }
    if (section === 'visionMission') {
      return JSON.stringify(overviewData.visionMission) !== JSON.stringify(originalData.visionMission);
    }
    if (section === 'coreValues') {
      return JSON.stringify(overviewData.coreValues) !== JSON.stringify(originalData.coreValues);
    }
    if (section === 'message') {
      if (JSON.stringify(overviewData.message.content) !== JSON.stringify(originalData.message.content)) return true;
      if (overviewData.message.ceoName !== originalData.message.ceoName) return true;
      if (files['message-ceoImage'] || files['message-backgroundImage']) return true;
      return false;
    }
    // milestones giữ nguyên logic cũ
    return Object.keys(files).some(key => key.startsWith(section)) || 
           Object.keys(imagePreview).some(key => key.startsWith(section));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string, index?: number) => {
    const { name, value } = e.target;
    
    setOverviewData(prev => {
      if (!prev) return prev;
      
      if (section === 'banner') {
        return {
          ...prev,
          banner: { ...prev.banner, [name]: value }
        };
      } else if (section === 'milestones' && typeof index === 'number') {
        const updatedMilestones = [...prev.milestones];
        updatedMilestones[index] = { ...updatedMilestones[index], [name]: value };
        return { ...prev, milestones: updatedMilestones };
      } else if (section === 'message') {
        return {
          ...prev,
          message: { ...prev.message, [name]: value }
        };
      }
      
      return prev;
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, [key]: file }));
      setImagePreview(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async (section: string) => {
    try {
      setSaving(section);
      if (section === 'banner') {
        // Always send FormData with all fields
        const formData = new FormData();
        formData.append('title', overviewData?.banner.title || '');
        formData.append('description', overviewData?.banner.description || '');
        if (files['banner-backgroundImage']) {
          formData.append('bannerImage', files['banner-backgroundImage']);
        }
        const result = await overviewAdminService.updateBanner(formData);
      if (result.success) {
          toast.success(" Cập nhật banner thành công!", toastOptions);
          await loadData();
      } else {
          toast.error("❌ " + result.message, toastOptions);
        }
      } else if (section === 'milestones') {
        // Handle milestones save with image uploads
        const milestonesData = [...(overviewData?.milestones || [])];
        const formData = new FormData();
        
        // Add milestones data
        formData.append('milestones', JSON.stringify(milestonesData));
        
        // Add milestone images
        Object.keys(files).forEach(key => {
          if (key.startsWith('milestones-') && key.endsWith('-image')) {
            const index = key.split('-')[1];
            const file = files[key];
            formData.append(`milestone_image_${index}`, file);
          }
        });
        
        const result = await overviewAdminService.updateMilestonesWithImages(formData);
      if (result.success) {
          toast.success(" Cập nhật milestones thành công!", toastOptions);
          // Reload data to get updated images
          await loadData();
      } else {
          toast.error("❌ " + result.message, toastOptions);
        }
      }
      else if (section === 'visionMission') {
        const result = await overviewAdminService.updateVisionMission(overviewData.visionMission);
        if (result.success) {
          toast.success("Cập nhật Vision & Mission thành công!", toastOptions);
          await loadData();
        } else {
          toast.error("❌ " + result.message, toastOptions);
        }
      }
      else if (section === 'coreValues') {
        const result = await overviewAdminService.updateCoreValues(overviewData.coreValues);
        if (result.success) {
          toast.success("Cập nhật Core Values thành công!", toastOptions);
          await loadData();
        } else {
          toast.error("❌ " + result.message, toastOptions);
        }
      }
      else if (section === 'message') {
        if (files['message-ceoImage'] || files['message-backgroundImage']) {
          const formData = new FormData();
          formData.append('ceoName', overviewData?.message.ceoName || '');
          formData.append('content', JSON.stringify(overviewData?.message.content || []));
          if (files['message-ceoImage']) {
            formData.append('ceoImage', files['message-ceoImage']);
          }
          if (files['message-backgroundImage']) {
            formData.append('backgroundImage', files['message-backgroundImage']);
          }
          const result = await overviewAdminService.updateMessage(formData, true);
          if (result.success) {
            toast.success("Cập nhật CEO Message thành công!", toastOptions);
            await loadData();
          } else {
            toast.error("❌ " + result.message, toastOptions);
          }
        } else {
          const messageData = {
            ceoName: overviewData?.message.ceoName || '',
            content: overviewData?.message.content || [],
          };
          const result = await overviewAdminService.updateMessage(messageData);
          if (result.success) {
            toast.success("Cập nhật CEO Message thành công!", toastOptions);
            await loadData();
          } else {
            toast.error("❌ " + result.message, toastOptions);
          }
        }
      }
      
      // Clear files and previews after successful save
      setFiles(prev => {
        const newFiles = { ...prev };
        Object.keys(newFiles).forEach(key => {
          if (key.startsWith(section)) {
            delete newFiles[key];
          }
        });
        return newFiles;
      });
      
      setImagePreview(prev => {
        const newPreview = { ...prev };
        Object.keys(newPreview).forEach(key => {
          if (key.startsWith(section)) {
            delete newPreview[key];
          }
        });
        return newPreview;
      });
      
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("❌ Có lỗi xảy ra khi lưu", toastOptions);
    } finally {
      setSaving(null);
    }
  };

  const handleAddMilestone = async () => {
    try {
      const newMilestone = {
        year: new Date().getFullYear().toString(),
        title: "Milestone mới",
        description: "Mô tả milestone",
        order: overviewData?.milestones?.length || 0,
      };

      const result = await overviewAdminService.addMilestone(newMilestone);
      if (result.success) {
        setOverviewData(prev => prev ? {
          ...prev,
          milestones: [...prev.milestones, result.data]
        } : null);
        await loadData();
        toast.success(" Thêm milestone thành công!", toastOptions);
      } else {
        toast.error("❌ " + result.message, toastOptions);
      }
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast.error("❌ Có lỗi xảy ra", toastOptions);
    }
  };

  const handleDeleteMilestone = async (index: number) => {
    try {
      const milestone = overviewData?.milestones[index];
      if (!milestone?._id) return;

      const result = await overviewAdminService.deleteMilestone(milestone._id);
      if (result.success) {
        setOverviewData(prev => prev ? {
          ...prev,
          milestones: prev.milestones.filter((_, i) => i !== index)
        } : null);
        toast.success(" Xóa milestone thành công!", toastOptions);
      } else {
        toast.error("❌ " + result.message, toastOptions);
      }
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error("❌ Có lỗi xảy ra", toastOptions);
    }
  };

  // Lưu 1 milestone riêng biệt
  const handleSaveMilestone = async (index: number) => {
    try {
      setSaving(`milestone-${index}`);
      // Tạo bản sao mảng milestones
      const milestonesData = [...(overviewData?.milestones || [])];
      // Kiểm tra dữ liệu hợp lệ cho toàn bộ mảng
      for (let i = 0; i < milestonesData.length; i++) {
        const m = milestonesData[i];
        if (!m.year || !m.title || !m.description || !m.image) {
          toast.error(`Milestone ${i + 1} thiếu trường bắt buộc (Năm, Tiêu đề, Mô tả, Hình ảnh)!`, toastOptions);
          setSaving(null);
          return;
        }
        if (isNaN(Number(m.year))) {
          toast.error(`Milestone ${i + 1}: Trường Năm phải là số!`, toastOptions);
          setSaving(null);
          return;
        }
      }
      // Nếu có file ảnh mới
      const formData = new FormData();
      formData.append('milestones', JSON.stringify(milestonesData));
      if (files[`milestones-${index}-image`]) {
        formData.append(`milestone_image_${index}`, files[`milestones-${index}-image`]);
      }
      const result = await overviewAdminService.updateMilestonesWithImages(formData);
      if (result.success) {
        toast.success('Cập nhật milestone thành công!', toastOptions);
        await loadData();
      } else {
        toast.error('❌ ' + result.message, toastOptions);
      }
      // Xóa file và preview của milestone này
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[`milestones-${index}-image`];
        return newFiles;
      });
      setImagePreview(prev => {
        const newPreview = { ...prev };
        delete newPreview[`milestones-${index}-image`];
        return newPreview;
      });
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast.error('❌ Có lỗi xảy ra khi lưu milestone', toastOptions);
    } finally {
      setSaving(null);
    }
  };

  // Kiểm tra milestone có thay đổi không (so với originalData)
  const hasMilestoneChanged = (index: number) => {
    if (!overviewData || !originalData) return false;
    const m = overviewData.milestones[index];
    const o = originalData.milestones[index];
    if (!m || !o) return false;
    if (m.year !== o.year || m.title !== o.title || m.description !== o.description) return true;
    if (files[`milestones-${index}-image`]) return true;
    return false;
  };

  const handleVisionMissionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: 'vision' | 'mission',
    field: string
  ) => {
    const { value } = e.target;
    setOverviewData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        visionMission: {
          ...prev.visionMission,
          [section]: {
            ...prev.visionMission[section],
            [field]: value
          }
        }
      };
    });
  };

  const handleCoreValueChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, field: string) => {
    const { value } = e.target;
    setOverviewData(prev => {
      if (!prev) return prev;
      const updated = [...prev.coreValues];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, coreValues: updated };
    });
  };

  const handleAddCoreValue = () => {
    setOverviewData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        coreValues: [
          ...prev.coreValues,
          { icon: '', title: '', content: '', order: prev.coreValues.length + 1, _id: '' }
        ]
      };
    });
  };

  const handleDeleteCoreValue = (index: number) => {
    setOverviewData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        coreValues: prev.coreValues.filter((_, i) => i !== index)
      };
    });
  };

  // Thêm UI quản lý message section
  const handleMessageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, idx: number) => {
    const value = e.target.value;
    setOverviewData(prev => {
      if (!prev) return prev;
      const updated = [...prev.message.content];
      updated[idx] = { ...updated[idx], type: value };
      return { ...prev, message: { ...prev.message, content: updated } };
    });
  };
  const handleMessageContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>, idx: number) => {
    const value = e.target.value;
    setOverviewData(prev => {
      if (!prev) return prev;
      const updated = [...prev.message.content];
      updated[idx] = { ...updated[idx], paragraph: value };
      return { ...prev, message: { ...prev.message, content: updated } };
    });
  };
  const handleDeleteMessageItem = (idx: number) => {
    setOverviewData(prev => {
      if (!prev) return prev;
      const updated = prev.message.content.filter((_, i) => i !== idx);
      return { ...prev, message: { ...prev.message, content: updated } };
    });
  };
  const handleAddMessageItem = () => {
    setOverviewData(prev => {
      if (!prev) return prev;
      const updated = [...prev.message.content, { paragraph: '', type: 'normal', order: prev.message.content.length + 1 }];
      return { ...prev, message: { ...prev.message, content: updated } };
    });
  };
  const handleMoveMessageItem = (idx: number, dir: number) => {
    setOverviewData(prev => {
      if (!prev) return prev;
      const updated = [...prev.message.content];
      const newIndex = idx + dir;
      if (newIndex < 0 || newIndex >= updated.length) return prev;
      const temp = updated[idx];
      updated[idx] = updated[newIndex];
      updated[newIndex] = temp;
      return { ...prev, message: { ...prev.message, content: updated } };
    });
  };

  const renderLoading = () => <div className="admin-loading">Đang tải dữ liệu...</div>;

  if (loading) return renderLoading();
  if (!overviewData) return <div>Không thể tải dữ liệu trang giới thiệu.</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">📄 Quản lý Trang Giới Thiệu</h1>
        <p className="admin-page-description">Chỉnh sửa banner và các cột mốc phát triển của công ty</p>
      </div>

        {/* Banner Section */}
      <AdminSectionCard 
        title="Banner Section" 
        onSave={() => handleSave('banner')} 
        isSaving={saving === 'banner'} 
        hasChanges={hasChanges('banner')}
      >
        <div className="grid-2-col">
          <div className="form-column">
            <FormItem label="Tiêu đề Banner" icon={<FiType />}>
              <input 
              type="text"
                name="title"
                value={overviewData.banner.title || ''} 
                onChange={(e) => handleInputChange(e, 'banner')} 
                className="form-input" 
              />
            </FormItem>
            <FormItem label="Mô tả Banner" icon={<FiFileText />}>
              <textarea 
                name="description"
                value={overviewData.banner.description || ''} 
                onChange={(e) => handleInputChange(e, 'banner')} 
                className="form-textarea" 
              />
            </FormItem>
            <FormItem label="Hình ảnh Banner" icon={<FiImage />}>
                <input
                  type="file"
                onChange={(e) => handleFileChange(e, 'banner-backgroundImage')} 
                  accept="image/*"
                className="form-file-input"
              />
            </FormItem>
          </div>
          <div className="form-column">
            <FormItem label="Preview" icon={<FiImage />}>
              <div className="image-preview-container">
                {overviewData.banner.backgroundImage ? (
                  <Image 
                    src={
                      imagePreview['banner-backgroundImage']
                        ? imagePreview['banner-backgroundImage']
                        : (files['banner-backgroundImage']
                          ? URL.createObjectURL(files['banner-backgroundImage'])
                          : `${BACKEND_DOMAIN}${overviewData.banner.backgroundImage}?t=${overviewData.banner.updatedAt || Date.now()}`)
                    }
                    alt={overviewData.banner.title || "Banner"} 
                    width={300} 
                    height={200} 
                    className="image-preview" 
                    onLoad={() => {
                      console.log("✅ Banner image loaded successfully");
                      console.log("📁 Image path:", overviewData.banner.backgroundImage);
                      console.log("🌐 Full URL:", `${BACKEND_DOMAIN}${overviewData.banner.backgroundImage}`);
                    }}
                    onError={(e) => {
                      console.error("❌ Banner image failed to load");
                      console.error("📁 Image path:", overviewData.banner.backgroundImage);
                      console.error("🌐 Full URL:", `${BACKEND_DOMAIN}${overviewData.banner.backgroundImage}`);
                      console.error("🔧 BACKEND_DOMAIN:", BACKEND_DOMAIN);
                      console.error("🚨 Error:", e);
                    }}
                  />
                ) : (
                  <div className="image-placeholder">
                    Chưa có ảnh banner
                  </div>
                )}
              </div>
              <div className="preview-text">
                <h3>{overviewData.banner.title || "Tiêu đề Banner"}</h3>
                <p>{overviewData.banner.description || "Mô tả banner"}</p>
            </div>
            </FormItem>
          </div>
        </div>
      </AdminSectionCard>

        {/* Milestones Section */}
      <AdminSectionCard 
        title="Cột Mốc Phát Triển" 
      >
        <div className="subsection-header">
          <p className="admin-page-description">Quản lý các cột mốc phát triển của công ty</p>
          <button className="btn-add" onClick={handleAddMilestone}>
            <FiPlusCircle /> Thêm Cột Mốc
          </button>
        </div>
        
        {overviewData.milestones.map((milestone, index) => (
          <div key={milestone._id || index} className="subsection-card">
            <div className="subsection-header" style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
              <h4>Milestone {index + 1}: {milestone.title}</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn-save"
                  onClick={() => handleSaveMilestone(index)}
                  disabled={saving === `milestone-${index}` || !hasMilestoneChanged(index)}
                >
                  <FiSave />
                  {saving === `milestone-${index}` ? 'Đang lưu...' : 'Lưu'}
                </button>
            <button
                  className="btn-delete"
                  onClick={() => handleDeleteMilestone(index)}
                  title="Xóa milestone"
                >
                  <FiTrash2 />
            </button>
              </div>
            </div>
            <div className="grid-2-col">
              <div className="form-column">
                <FormItem label="Năm" icon={<FiType />}>
                  <input 
                  type="text"
                    name="year"
                    value={milestone.year || ''} 
                    onChange={(e) => handleInputChange(e, 'milestones', index)} 
                    className="form-input" 
                  />
                </FormItem>
                <FormItem label="Tiêu đề" icon={<FiType />}>
                  <input 
                  type="text"
                    name="title"
                    value={milestone.title || ''} 
                    onChange={(e) => handleInputChange(e, 'milestones', index)} 
                    className="form-input" 
                  />
                </FormItem>
                <FormItem label="Mô tả" icon={<FiFileText />}>
                  <textarea 
                    name="description"
                    value={milestone.description || ''} 
                    onChange={(e) => handleInputChange(e, 'milestones', index)} 
                    className="form-textarea" 
                  />
                </FormItem>
                <FormItem label="Hình ảnh" icon={<FiImage />}>
                    <input
                      type="file"
                    onChange={(e) => handleFileChange(e, `milestones-${index}-image`)} 
                      accept="image/*"
                    className="form-file-input"
                  />
                </FormItem>
              </div>
              <div className="form-column">
                <FormItem label="Preview" icon={<FiImage />}>
                  <div className="image-preview-container">
                    {milestone.image ? (
                  <Image
                        src={
                          imagePreview[`milestones-${index}-image`]
                            ? imagePreview[`milestones-${index}-image`]
                            : (files[`milestones-${index}-image`]
                              ? URL.createObjectURL(files[`milestones-${index}-image`])
                              : `${BACKEND_DOMAIN}${milestone.image}`)
                        }
                        alt={milestone.title} 
                        width={300} 
                    height={200}
                        className="image-preview" 
                  />
                    ) : (
                      <div className="image-placeholder">
                        Chưa có ảnh
                </div>
              )}
                  </div>
                  <div className="preview-text">
                    <h4 style={{ color: '#43c463', fontWeight: 700 }}>{milestone.year}</h4>
                    <h3>{milestone.title}</h3>
                    <div>{renderMilestoneDescription(milestone.description)}</div>
                  </div>
                </FormItem>
              </div>
            </div>
          </div>
        ))}
      </AdminSectionCard>

      {/* Vision & Mission Section */}
      <AdminSectionCard
        title="Vision & Mission"
        onSave={() => handleSave('visionMission')}
        isSaving={saving === 'visionMission'}
        hasChanges={hasChanges('visionMission')}
      >
        <div className="grid-2-col">
          <div className="form-column">
            <FormItem label="Vision Title">
              <input
                type="text"
                value={overviewData?.visionMission?.vision.title || ''}
                onChange={e => handleVisionMissionChange(e, 'vision', 'title')}
                className="form-input"
              />
            </FormItem>
            <FormItem label="Vision Content">
              <textarea
                value={overviewData?.visionMission?.vision.content || ''}
                onChange={e => handleVisionMissionChange(e, 'vision', 'content')}
                className="form-textarea"
              />
            </FormItem>
          </div>
          <div className="form-column">
            <FormItem label="Mission Title">
              <input
                type="text"
                value={overviewData?.visionMission?.mission.title || ''}
                onChange={e => handleVisionMissionChange(e, 'mission', 'title')}
                className="form-input"
              />
            </FormItem>
            <FormItem label="Mission Content">
              <textarea
                value={overviewData?.visionMission?.mission.content || ''}
                onChange={e => handleVisionMissionChange(e, 'mission', 'content')}
                className="form-textarea"
              />
            </FormItem>
          </div>
        </div>
      </AdminSectionCard>

      {/* Core Values Section */}
      <AdminSectionCard
        title="Core Values"
        onSave={() => handleSave('coreValues')}
        isSaving={saving === 'coreValues'}
        hasChanges={hasChanges('coreValues')}
      >
        {overviewData?.coreValues.map((value, idx) => (
          <div key={value._id || idx} className="subsection-card">
            <FormItem label="Title">
              <input
                type="text"
                value={value.title}
                onChange={e => handleCoreValueChange(e, idx, 'title')}
                className="form-input"
              />
            </FormItem>
            <FormItem label="Content">
              <textarea
                value={value.content}
                onChange={e => handleCoreValueChange(e, idx, 'content')}
                className="form-textarea"
              />
            </FormItem>
            <FormItem label="Order">
              <input
                type="number"
                value={value.order}
                onChange={e => handleCoreValueChange(e, idx, 'order')}
                className="form-input"
              />
            </FormItem>
            <button className="btn-delete" onClick={() => handleDeleteCoreValue(idx)}>Xóa</button>
          </div>
        ))}
        <button className="btn-add" onClick={handleAddCoreValue}>Thêm Core Value</button>
      </AdminSectionCard>

      {/* CEO Message Section */}
      <AdminSectionCard
        title="CEO Message"
        onSave={() => handleSave('message')}
        isSaving={saving === 'message'}
        hasChanges={hasChanges('message')}
      >
        <div className="message-admin-list">
          {overviewData?.message.content.map((item, idx) => (
            <div key={idx} className="message-admin-item">
              <select
                value={item.type}
                onChange={e => handleMessageTypeChange(e, idx)}
                className="message-type-select"
              >
                <option value="header">Dòng đầu (đậm)</option>
                <option value="normal">Đoạn thường</option>
                <option value="highlight">Dòng nổi bật (xanh)</option>
              </select>
              <textarea
                value={item.paragraph}
                onChange={e => handleMessageContentChange(e, idx)}
                className="message-content-input"
              />
              <button onClick={() => handleDeleteMessageItem(idx)} className="btn-delete"><FiTrash2 /></button>
              <button onClick={() => handleMoveMessageItem(idx, -1)} disabled={idx === 0}>↑</button>
              <button onClick={() => handleMoveMessageItem(idx, 1)} disabled={idx === overviewData.message.content.length - 1}>↓</button>
            </div>
          ))}
          <button className="btn-add" onClick={handleAddMessageItem}><FiPlusCircle /> Thêm đoạn</button>
        </div>
        <FormItem label="Tên CEO">
          <input
            type="text"
            value={overviewData?.message.ceoName || ''}
            onChange={e => handleInputChange(e, 'message')}
            name="ceoName"
            className="form-input"
          />
        </FormItem>
        <FormItem label="Ảnh CEO">
          <input
            type="file"
            accept="image/*"
            onChange={e => handleFileChange(e, 'message-ceoImage')}
            className="form-file-input"
          />
          {overviewData?.message.ceoImage && (
            <Image
              src={imagePreview['message-ceoImage'] || `${BACKEND_DOMAIN}${overviewData.message.ceoImage}`}
              alt="CEO"
              width={200}
              height={200}
              className="image-preview"
            />
          )}
        </FormItem>
        <FormItem label="Ảnh background MESSAGE">
          <input
            type="file"
            accept="image/*"
            onChange={e => handleFileChange(e, 'message-backgroundImage')}
            className="form-file-input"
          />
          {overviewData?.message.backgroundImage && (
            <Image
              src={imagePreview['message-backgroundImage'] || `${BACKEND_DOMAIN}${overviewData.message.backgroundImage}`}
              alt="BG"
              width={200}
              height={120}
              className="image-preview"
            />
          )}
        </FormItem>
      </AdminSectionCard>

      <style jsx>{`
        .admin-page-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-page-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .admin-page-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .admin-page-description {
          font-size: 16px;
          color: #666;
          margin: 0;
        }

        .admin-section-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
        }

        .card-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .btn-save {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-save:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-save:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .card-content {
          padding: 24px;
        }

        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-item-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .form-input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .form-textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          min-height: 80px;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        .form-file-input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .image-preview-container {
          margin-bottom: 12px;
        }

        .image-preview {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #eee;
        }

        .image-placeholder {
          width: 100%;
          height: 200px;
          background: #f5f5f5;
          border: 2px dashed #ddd;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 14px;
        }

        .preview-text {
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .preview-text h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .preview-text h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .preview-text p {
          margin: 0;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .subsection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eee;
        }

        .subsection-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .subsection-card h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          background: #218838;
        }

        .btn-delete {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-delete:hover {
          background: #c82333;
        }

        .admin-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 16px;
          color: #666;
        }

        .message-admin-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }

        .message-admin-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f0f2f5;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          position: relative;
        }

        .message-type-select {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          background-color: #fff;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .message-type-select:focus {
          outline: none;
          border-color: #007bff;
        }

        .message-content-input {
          flex-grow: 1;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          min-height: 50px;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .message-content-input:focus {
          outline: none;
          border-color: #007bff;
        }

        @media (max-width: 768px) {
          .grid-2-col {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .admin-page-container {
            padding: 16px;
          }
          
          .card-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
