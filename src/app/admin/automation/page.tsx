"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { FiEdit, FiTrash2, FiPlusCircle, FiX } from 'react-icons/fi';
import automationService from '@/services/automationService';
import { toast } from 'react-toastify';
import { BACKEND_DOMAIN } from '@/api/config';

type ApiResponse = { success: boolean; message?: string };

// Kiểu dữ liệu step
interface Step {
  _id?: string;
  title: string;
  description: string;
}

// Kiểu dữ liệu automation item
interface AutomationItem {
  _id?: string;
  title: string;
  image: string;
  steps: Step[];
}

const getAutomationItems = async (): Promise<AutomationItem[]> => {
  const res = await fetch(`${BACKEND_DOMAIN}/api/automation/items`, { credentials: 'include' });
  const data = await res.json();
  if (data.success && Array.isArray(data.data)) {
    return data.data.map((item: Record<string, unknown>) => ({
      _id: item._id as string,
      title: item.title as string,
      image: item.image as string,
      steps: (item.contentItems as Step[] || []).map((step: Step) => ({
        _id: step._id,
        title: step.title,
        description: step.description,
      })),
    }));
  }
  return [];
};

export default function AdminAutomationPage() {
  const [items, setItems] = useState<AutomationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AutomationItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getAutomationItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setSteps([]);
    setImagePreview(null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleEdit = (item: AutomationItem) => {
    setEditingItem(item);
    setSteps(item.steps || []);
    setImagePreview(item.image ? `${BACKEND_DOMAIN}${item.image}` : null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setSteps([]);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, { title: '', description: '' }]);
  };

  const handleDeleteStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleStepChange = (idx: number, field: 'title' | 'description', value: string) => {
    setSteps(steps.map((step, i) => i === idx ? { ...step, [field]: value } : step));
  };

  const handleSave = async () => {
    // Kiểm tra tiêu đề
    if (!editingItem?.title || editingItem.title.trim() === '') {
      toast.error('Vui lòng nhập tiêu đề quy trình!');
      return;
    }

    // Nếu tạo mới mà không có ảnh, báo lỗi
    if (!editingItem?._id && !imageFile) {
      toast.error('Vui lòng chọn ảnh đại diện!');
      return;
    }

    setSaving(true);
    try {
      const itemData = {
        title: editingItem?.title || '',
        description: steps[0]?.description || editingItem?.title || '',  // Dùng tiêu đề làm mô tả nếu không có
        contentItems: steps.map(s => ({ 
          title: s.title || editingItem?.title || '',  // Đảm bảo luôn có title
          description: s.description || '' 
        })),
      };

      console.log('Saving item data:', itemData);
      
      const rawResult = editingItem?._id
        ? await automationService.updateItem(editingItem._id, itemData, imageFile || null)
        : await automationService.addItem(itemData, imageFile || null);
      
      console.log('API response:', rawResult);
      
      const result: ApiResponse = rawResult as ApiResponse;
      if (result.success) {
        toast.success('Lưu thành công!');
        handleCloseModal();
        await loadData();
      } else {
        toast.error(result.message || 'Lưu thất bại!');
      }
    } catch (error) {
      console.error('Error saving automation item:', error);
      toast.error('Có lỗi xảy ra khi lưu!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingItem?._id) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa quy trình này?')) {
      setSaving(true);
      try {
        const rawResult = await automationService.deleteItem(editingItem._id);
        const result: ApiResponse = rawResult as ApiResponse;
        if (result.success) {
          toast.success('Đã xóa thành công!');
          handleCloseModal();
          await loadData();
        } else {
          toast.error(result.message || 'Xóa thất bại!');
        }
      } catch {
        toast.error('Có lỗi xảy ra khi xóa!');
      } finally {
        setSaving(false);
      }
    }
  };

  // Hàm xóa item ngoài card
  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quy trình này?')) {
      setSaving(true);
      try {
        const rawResult = await automationService.deleteItem(itemId);
        const result: ApiResponse = rawResult as ApiResponse;
        if (result.success) {
          toast.success('Đã xóa thành công!');
          await loadData();
        } else {
          toast.error(result.message || 'Xóa thất bại!');
        }
      } catch {
        toast.error('Có lỗi xảy ra khi xóa!');
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) return <div className="admin-loading">Đang tải...</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-section-card">
        <div className="card-header">
          <h1 className="admin-page-title">Quản lý Quy trình (Automation)</h1>
          <button className="btn btn-add" onClick={handleAdd}>
            <FiPlusCircle /> Thêm mới
          </button>
        </div>
        <div className="card-content">
          {items.length === 0 ? (
            <div>Chưa có quy trình nào.</div>
          ) : (
            <div className="grid">
              {items.map(item => (
                <div className="automation-card admin-section-card" key={item._id}>
                  <div className="image-container">
                    {item.image && (
                      <Image src={`${BACKEND_DOMAIN}${item.image}`} alt={item.title} width={300} height={200} className="item-thumbnail" />
                    )}
                  </div>
                  <div className="card-content">
                    <h3 className="item-title">{item.title}</h3>
                    <ul className="steps-list">
                      {item.steps && item.steps.map((step, idx) => (
                        <li key={step._id || idx} className="step-item">
                          <span className="step-title"><strong>{step.title}</strong>:</span> <span className="step-desc">{step.description}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="card-actions">
                      <button className="btn-icon btn-edit" onClick={() => handleEdit(item)} title="Sửa"><FiEdit /></button>
                      <button className="btn-icon btn-delete" onClick={() => handleDeleteItem(item._id!)} title="Xóa"><FiTrash2 /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modal thêm/sửa quy trình */}
      {modalOpen && (
        <div className="modal-overlay active">
          <div className="modal-container large">
            <div className="modal-header">
              <h3>{editingItem ? 'Chỉnh sửa Quy trình' : 'Thêm Quy trình mới'}</h3>
              <button className="btn-close" onClick={handleCloseModal}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Ảnh đại diện</label>
                {imagePreview && (
                  <div className="image-preview-container">
                    <Image src={imagePreview} alt="Preview" width={300} height={200} />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="form-group">
                <label>Tiêu đề quy trình</label>
                <input
                  type="text"
                  value={editingItem?.title || ''}
                  onChange={e => setEditingItem({ ...(editingItem || { steps: [], image: '' }), title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Các bước (Step)</label>
                <ul className="steps-edit-list">
                  {steps.map((step, idx) => (
                    <li key={idx} className="step-edit-item">
                      <input
                        type="text"
                        placeholder="Tiêu đề step"
                        value={step.title}
                        onChange={e => handleStepChange(idx, 'title', e.target.value)}
                        className="form-input"
                        required
                      />
                      <textarea
                        placeholder="Nội dung step"
                        value={step.description}
                        onChange={e => handleStepChange(idx, 'description', e.target.value)}
                        className="form-textarea"
                        required
                      />
                      <button className="btn-icon btn-delete-step" onClick={() => handleDeleteStep(idx)} title="Xóa step"><FiTrash2 /></button>
                    </li>
                  ))}
                </ul>
                <button className="btn btn-add-step btn-primary" type="button" onClick={handleAddStep}><FiPlusCircle /> Thêm step</button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseModal} disabled={saving}>Hủy</button>
              {editingItem?._id && (
                <button className="btn btn-delete-modal" onClick={handleDelete} disabled={saving}><FiTrash2 /> Xóa</button>
              )}
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
