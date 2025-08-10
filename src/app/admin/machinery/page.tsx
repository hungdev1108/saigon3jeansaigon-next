"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import machineryAdminService from "@/services/machineryService-admin";
import Toast from "@/components/admin/Toast";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import { FiTrash2, FiEdit, FiPlusCircle } from 'react-icons/fi';
import { BACKEND_DOMAIN } from '@/api/config';

interface MachineImage {
  _id?: string;
  url: string;
  alt: string;
}

interface Machine {
  _id?: string;
  name: string;
  model: string;
  description: string;
  images: MachineImage[];
  order: number;
  isActive: boolean;
}

interface Stage {
  _id?: string;
  title: string;
  description: string;
  order: number;
  machines: Machine[];
  stageNumber: number;
  isActive: boolean;
}

interface MachineryData {
  stages: Stage[];
}

export default function AdminMachineryPage() {
  const [data, setData] = useState<MachineryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [toastMsg, setToastMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'stage'|'machine'|null>(null);
  const [modalMode, setModalMode] = useState<'add'|'edit'>('add');
  const [modalStageIndex, setModalStageIndex] = useState<number|null>(null);
  const [modalMachineIndex, setModalMachineIndex] = useState<number|null>(null);
  const [modalData, setModalData] = useState<Partial<Stage & Machine>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [originalImages, setOriginalImages] = useState<MachineImage[]>([]);

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setToastOpen(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
      setLoading(true);
      const result = await machineryAdminService.getCompleteMachineryData();
    if (result && Array.isArray(result.stages)) setData(result);
    else if (Array.isArray(result)) setData({ stages: result });
    else if (result && result.data && Array.isArray(result.data.stages)) setData(result.data);
    else if (result && Array.isArray(result.result)) setData({ stages: result.result });
    else if (result && result.success === true && Array.isArray(result.data)) setData({ stages: result.data });
    else if (result && result.success === false) showToast("Lỗi tải dữ liệu: " + result.message, 'error');
    else showToast("Lỗi tải dữ liệu: Không xác định dữ liệu trả về", 'error');
      setLoading(false);
  };

  // Stage CRUD
  const openStageModal = (mode: 'add'|'edit', index: number|null = null, data: Partial<Stage> = {}) => {
    setModalType('stage');
    setModalMode(mode);
    setModalStageIndex(index);
    setModalData(data);
    setModalOpen(true);
  };
  const handleStageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modalMode === 'add') {
        const stageNumber = (data?.stages?.length || 0) + 1;
        const result = await machineryAdminService.addStage({
          stageNumber,
          title: modalData.title,
          description: modalData.description,
          order: modalData.order,
          isActive: modalData.isActive !== false,
        });
        if (result.success) {
          await loadData(); // Đảm bảo load lại danh sách stage mới nhất
          showToast('Added Stage successfully!', 'success');
          setModalOpen(false); // Đóng modal sau khi loadData xong
          return;
        } else showToast(result.message || 'Add failed', 'error');
      } else if (modalMode === 'edit' && modalStageIndex !== null) {
        const stage = data?.stages?.[modalStageIndex];
        if (!stage) {
          showToast('Stage not found', 'error');
          setSaving(false);
          return;
        }
        const result = await machineryAdminService.updateStage(stage._id, modalData);
        if (result.success) {
          await loadData();
          showToast('Updated Stage successfully!', 'success');
        } else showToast(result.message || 'Update failed', 'error');
        setModalOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteStage = async (index: number) => {
    if (!confirm("Are you sure to delete this Stage and all its Machines?")) return;
    setSaving(true);
    const stage = data?.stages?.[index];
    if (!stage) {
      showToast('Stage not found', 'error');
      setSaving(false);
      return;
    }
    const result = await machineryAdminService.deleteStage(stage._id);
    if (result.success) {
      await loadData();
      showToast('Deleted Stage!', 'success');
    } else showToast(result.message || 'Delete failed', 'error');
    setSaving(false);
  };
  
  // Machine CRUD
  const openMachineModal = (mode: 'add'|'edit', stageIndex: number, machineIndex: number|null = null) => {
    setModalType('machine');
    setModalMode(mode);
    setModalStageIndex(stageIndex);
    setModalMachineIndex(machineIndex);
    setNewImages([]);
    if (mode === 'edit' && stageIndex !== null && machineIndex !== null) {
      const latestMachine = data?.stages?.[stageIndex]?.machines?.[machineIndex];
      setModalData(latestMachine || {});
      setOriginalImages(latestMachine?.images || []);
    } else {
      setModalData({});
      setOriginalImages([]);
    }
    setModalOpen(true);
  };
  const handleMachineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const stage = modalStageIndex !== null ? data?.stages?.[modalStageIndex] : undefined;
      if (!stage) {
        showToast('Stage not found', 'error');
        setSaving(false);
        return;
      }

      let machineId = modalData._id;
      let result;

      // 1. Thêm hoặc cập nhật máy (KHÔNG gửi images)
      if (modalMode === 'add') {
        result = await machineryAdminService.addMachine(stage._id, {
          name: modalData.name,
          description: modalData.description,
          order: modalData.order,
          isActive: modalData.isActive !== false,
        }, newImages);
        if (result.success) {
          const createdStage = (result.data as Stage[]).find((s: Stage) => s._id === stage._id);
          const newMachine = createdStage?.machines?.[createdStage.machines.length - 1];
          machineId = newMachine?._id;
        }
      } else if (modalMode === 'edit' && modalMachineIndex !== null) {
        const machine = stage.machines[modalMachineIndex];
        if (!machine) {
          showToast('Không tìm thấy máy', 'error');
          setSaving(false);
          return;
        }
        result = await machineryAdminService.updateMachine(stage._id, machine._id, {
          name: modalData.name,
          description: modalData.description,
          order: modalData.order,
          isActive: modalData.isActive !== false,
        });
        machineId = machine._id;
      }

      if (result?.success && machineId) {
        // 2. Xử lý xóa ảnh cũ (chỉ khi edit)
        if (modalMode === 'edit') {
          const newImagesList = modalData.images || [];
          // Tìm các ảnh cũ bị xóa (dựa vào _id)
          const imagesToDelete = originalImages
            .filter((img) => img._id && !newImagesList.some((nimg) => nimg._id === img._id));
          for (const img of imagesToDelete) {
            await machineryAdminService.deleteMachineImageById(stage._id, machineId, img._id);
          }
        }

        // 3. Upload ảnh mới (chỉ khi edit)
        if (modalMode === 'edit' && newImages.length > 0) {
          const uploadRes = await machineryAdminService.uploadMultipleImages(stage._id, machineId, newImages);
          if (!uploadRes.success) {
            showToast(uploadRes.message || 'Upload ảnh thất bại', 'error');
            setSaving(false);
            return;
          }
        }
        await loadData();
        showToast('Cập nhật máy thành công!', 'success');
        setModalOpen(false);
        setNewImages([]);
      } else {
        showToast(result?.message || 'Thao tác thất bại', 'error');
      }
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteMachine = async (stageIndex: number, machineIndex: number) => {
    if (!confirm("Are you sure to delete this Machine?")) return;
      setSaving(true);
    const stage = data?.stages?.[stageIndex];
    if (!stage) {
      showToast('Stage not found', 'error');
      setSaving(false);
      return;
    }
    const machine = stage.machines[machineIndex];
    if (!machine) {
      showToast('Machine not found', 'error');
      setSaving(false);
      return;
    }
    const result = await machineryAdminService.deleteMachine(stage._id, machine._id);
    if (result.success) {
      await loadData();
      showToast('Deleted Machine!', 'success');
    } else showToast(result.message || 'Delete failed', 'error');
    setSaving(false);
  };

  // Image preview/delete for Machine modal
  const handleRemoveOldImage = (idx: number) => {
    setModalData((prev) => {
      if (Array.isArray(prev.images)) {
        return { ...prev, images: prev.images.filter((_, i) => i !== idx) };
      }
      return prev;
    });
  };
  const handleRemoveNewImage = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
  };

  if (loading) return <div className="admin-loading"><div className="loading-spinner"></div><p>Loading machinery data...</p></div>;

  return (
    <div className="admin-page">
      <Toast open={toastOpen} type={toastType} message={toastMsg} onClose={()=>setToastOpen(false)} />
      <div className="admin-page-header">
        <h1 className="admin-page-title">🛠️ Quản lý Máy móc</h1>
        <p className="admin-page-description">Quản lý các giai đoạn và máy móc cho trang máy móc</p>
      </div>
      <AdminSectionCard title="Stage">
        <button onClick={() => openStageModal('add', null, { title: '', description: '', order: (data?.stages?.length||0)+1, isActive: true })} className="btn-add" disabled={saving}>
          <FiPlusCircle /> Thêm giai đoạn
        </button>
        <div className="features-grid">
          {data?.stages?.length ? (
            <div className="stage-list-admin">
              {data.stages.map((stage, stageIdx) => (
                <div key={stage._id || stageIdx} className={`feature-card${activeStageIndex === stageIdx ? ' active' : ''}`} onClick={() => setActiveStageIndex(stageIdx)} style={{cursor:'pointer'}}>
                  <div className="feature-card-actions">
                    <button className="edit-btn" onClick={e => {e.stopPropagation(); openStageModal('edit', stageIdx, stage);}} title="Sửa"><FiEdit /></button>
                    <button className="delete-btn" onClick={e => {e.stopPropagation(); handleDeleteStage(stageIdx);}} disabled={saving} style={{ color: '#ff4444' }} title="Xóa"><FiTrash2 /></button>
                  </div>
                  <div className="feature-content">
                    <h4>{stage.title}</h4>
                    <div><b>Mô tả:</b> {stage.description}</div>
                    <div><b>Thứ tự:</b> {stage.order}</div>
                    <div><b>Trạng thái:</b> {stage.isActive !== false ? 'Đang sử dụng' : 'Ẩn'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Chưa có giai đoạn nào. Hãy thêm giai đoạn mới.</div>
          )}
        </div>
      </AdminSectionCard>
      {/* Image Size Notice for Machinery */}
      <div className="global-machinery-notice">
        <div className="notice-icon">🏭</div>
        <div className="notice-content">
          <strong>Lưu ý kích thước ảnh máy móc:</strong> Để hiển thị nhất quán trên cả desktop và mobile, vui lòng sử dụng ảnh có tỷ lệ <strong>16:9</strong> với kích thước tối ưu <strong>1920x1080 pixels</strong> và dung lượng tối đa <strong>2MB</strong>.
        </div>
      </div>

      {/* Machines of active stage */}
      {data?.stages?.[activeStageIndex] && (
        <AdminSectionCard title={`Machines of ${data.stages[activeStageIndex].title}`}> 
          <button onClick={() => openMachineModal('add', activeStageIndex, null)} className="btn-add" disabled={saving}><FiPlusCircle /> Thêm máy</button>
          <div className="features-grid">
            {data.stages[activeStageIndex].machines?.length ? (
              data.stages[activeStageIndex].machines.map((machine, machineIdx) => (
                <div key={machine._id || machineIdx} className="feature-card">
                  <div className="feature-card-actions">
                    <button className="edit-btn" onClick={() => openMachineModal('edit', activeStageIndex, machineIdx)} title="Sửa"><FiEdit /></button>
                    <button className="delete-btn" onClick={() => handleDeleteMachine(activeStageIndex, machineIdx)} disabled={saving} style={{ color: '#ff4444' }} title="Xóa"><FiTrash2 /></button>
                  </div>
                  <div className="feature-content">
                    <h4>{machine.name}</h4>
                    <div><b>Mô tả:</b> {machine.description}</div>
                    <div><b>Thứ tự:</b> {machine.order}</div>
                    <div><b>Trạng thái:</b> {machine.isActive !== false ? 'Đang sử dụng' : 'Ẩn'}</div>
                    <div style={{marginTop:8}}>
                      <b>Hình ảnh:</b>
                      <div className="feature-images-grid">
                        {Array.isArray(machine.images) && machine.images.length > 0 && (
                          machine.images.map((imgObj: MachineImage, idx: number) => {
                            let imgUrl = imgObj.url;
                            if (imgUrl && imgUrl.startsWith('/uploads')) imgUrl = `${BACKEND_DOMAIN}${imgUrl}`;
                            return (
                              <div key={imgObj._id || idx} className="feature-image-thumb">
                                <Image src={imgUrl} alt={imgObj.alt || ''} width={100} height={70} />
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>Chưa có máy nào cho giai đoạn này.</div>
            )}
          </div>
        </AdminSectionCard>
      )}
      {/* Modal popup cho Thêm/Sửa Stage/Machine */}
      {modalOpen && (
        <div className="modal-overlay active">
          <div className="modal-container large">
            <div className="modal-header">
              <h3>{modalMode === 'edit' ? (modalType === 'stage' ? 'Sửa giai đoạn' : 'Sửa máy') : (modalType === 'stage' ? 'Thêm giai đoạn' : 'Thêm máy')}</h3>
              <button className="btn-close" onClick={()=>setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={modalType === 'stage' ? handleStageSubmit : handleMachineSubmit}>
              <div className="modal-body">
                {modalType === 'stage' ? (
                  <>
                    <div className="form-group">
                      <label>Tên giai đoạn</label>
                      <input type="text" value={modalData.title || ''} onChange={e => setModalData({ ...modalData, title: e.target.value })} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label>Mô tả</label>
                      <textarea value={modalData.description || ''} onChange={e => setModalData({ ...modalData, description: e.target.value })} className="form-textarea" required />
                    </div>
                    <div className="form-group">
                      <label>Thứ tự</label>
                      <input type="number" value={modalData.order || 1} onChange={e => setModalData({ ...modalData, order: Number(e.target.value) })} className="form-input" min={1} required />
                    </div>
                    <div className="form-group">
                      <label>Trạng thái</label>
                      <input type="checkbox" checked={modalData.isActive !== false} onChange={e => setModalData({ ...modalData, isActive: e.target.checked })} />
                      <span style={{marginLeft:8}}>{modalData.isActive !== false ? 'Đang sử dụng' : 'Ẩn'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Tên máy</label>
                      <input type="text" value={modalData.name || ''} onChange={e => setModalData({ ...modalData, name: e.target.value })} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label>Mô tả</label>
                      <textarea value={modalData.description || ''} onChange={e => setModalData({ ...modalData, description: e.target.value })} className="form-textarea" required />
                    </div>
                    <div className="form-group">
                      <label>Thứ tự</label>
                      <input type="number" value={modalData.order || 1} onChange={e => setModalData({ ...modalData, order: Number(e.target.value) })} className="form-input" min={1} required />
                    </div>
                    <div className="form-group">
                      <label>Trạng thái</label>
                      <input type="checkbox" checked={modalData.isActive !== false} onChange={e => setModalData({ ...modalData, isActive: e.target.checked })} />
                      <span style={{marginLeft:8}}>{modalData.isActive !== false ? 'Đang sử dụng' : 'Ẩn'}</span>
                                </div>
                    <div className="form-group">
                      <label>Hình ảnh</label>
                      <div className="machinery-image-notice">
                        <div className="notice-icon">🏭</div>
                        <div className="notice-text">
                          <strong>Lưu ý kích thước ảnh máy móc:</strong>
                          <ul>
                            <li>Tỷ lệ tối ưu: <strong>16:9</strong> (1920x1080 pixels)</li>
                            <li>Kích thước tối thiểu: <strong>1280x720 pixels</strong></li>
                            <li>Định dạng: JPG, PNG, WEBP</li>
                            <li>Dung lượng tối đa: <strong>2MB</strong></li>
                            <li>Ảnh sẽ hiển thị nhất quán trên desktop và mobile</li>
                          </ul>
                        </div>
                      </div>
                      <div className="feature-images-grid">
                        {modalMode === 'edit' && Array.isArray(modalData.images) && modalData.images.length > 0 && (
                          modalData.images.map((imgObj: MachineImage, idx: number) => {
                            let imgUrl = imgObj.url;
                            if (imgUrl && imgUrl.startsWith('/uploads')) imgUrl = `${BACKEND_DOMAIN}${imgUrl}`;
                            return (
                              <div key={imgObj._id || idx} className="feature-image-thumb">
                                <Image src={imgUrl} alt={imgObj.alt || ''} width={100} height={70} />
                                <button type="button" className="btn-delete-img" style={{ color: '#ff4444', background: 'white', border: '1.5px solid #ff4444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={() => handleRemoveOldImage(idx)}><FiTrash2 /></button>
                            </div>
                            );
                          })
                        )}
                        {newImages.map((file, idx) => (
                          <div key={"new-"+idx} className="feature-image-thumb">
                            <img src={URL.createObjectURL(file)} alt={file.name} width={100} height={70} style={{objectFit:'cover',borderRadius:8}} />
                            <button type="button" className="btn-delete-img" style={{ color: '#ff4444', background: 'white', border: '1.5px solid #ff4444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} onClick={() => handleRemoveNewImage(idx)}><FiTrash2 /></button>
                        </div>
                    ))}
                </div>
                      <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/jpg" onChange={e => { const files = e.target.files; if (files && files.length > 0) { setNewImages(Array.from(files)); }}} style={{marginTop:8}} />
                      <small className="form-help">Chọn nhiều hình ảnh. Hình ảnh sẽ chỉ được lưu khi bạn bấm Lưu.</small>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" onClick={()=>setModalOpen(false)} disabled={saving}>Hủy</button>
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </form>
          </div>
          </div>
        )}
      <style jsx>{`
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 28px;
          margin-top: 18px;
        }
        .feature-card {
          background: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          padding: 18px 18px 14px 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .feature-card-actions {
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
        .feature-content h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 6px 0;
        }
        .feature-content div {
          font-size: 0.98rem;
          margin: 0 0 4px 0;
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
          background: #fff;
          color: #ff4444;
          border: 1.5px solid #ff4444;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: bold;
          z-index: 10;
          transition: all 0.2s ease;
        }
        .btn-delete-img:hover {
          background: #ffebee;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
