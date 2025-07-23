"use client";

import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import productsAdminService from "@/services/productsService-admin";
import { FiEdit, FiPlusCircle, FiTrash2, FiSave } from 'react-icons/fi';
import AdminSectionCard from '@/components/admin/AdminSectionCard';
import Toast from '@/components/admin/Toast';
import { BACKEND_DOMAIN } from '@/api/config';

// Interface
interface Product {
  _id: string;
  name: string;
  mainImage: {
      url: string;
      alt: string;
  };
  active: boolean;
  featured: boolean;
  order: number;
  description?: string;
  galleryImages?: { _id: string; url: string; alt: string }[];
  applications?: { _id: string; title: string; content?: { heading: string; description: string; features?: string[]; images?: { url: string; alt: string }[] } }[];
}

// Main Component
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [toastMsg, setToastMsg] = useState('');
  // const router = useRouter();

  // State cho sản phẩm đang chọn
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [localDescription, setLocalDescription] = React.useState('');

  // Modal state for quick edit
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalOrder, setModalOrder] = useState(1);
  const [modalGallery, setModalGallery] = useState<{ _id?: string; url: string; alt: string }[]>([]);
  const [modalNewImages, setModalNewImages] = useState<File[]>([]);
  const [modalSaving, setModalSaving] = useState(false);

  // New application state
  const [addingApp, setAddingApp] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  // Khi chọn sản phẩm, load chi tiết
  useEffect(() => {
    if (!selectedProductId) {
      setSelectedProduct(null);
      return;
    }
    const fetchDetail = async () => {
      setLoading(true);
      const result = await productsAdminService.getProductById(selectedProductId);
      if (result.success) {
        setSelectedProduct(result.data);
      } else {
        showMessage("Lỗi tải chi tiết sản phẩm: " + result.message);
        setSelectedProduct(null);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [selectedProductId]);

  useEffect(() => {
    setLocalDescription(selectedProduct?.description || '');
  }, [selectedProduct]);

  const loadProducts = async () => {
    setLoading(true);
    const result = await productsAdminService.getAllProducts(true);
    if (result.success) {
      setProducts(result.data.sort((a: Product, b: Product) => a.order - b.order));
    } else {
      showMessage("Lỗi tải danh sách sản phẩm: " + result.message);
    }
    setLoading(false);
  };
  
  const showMessage = (msg: string, type: 'success'|'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setToastOpen(true);
  };

  // Khi tạo mới, tự động chọn sản phẩm mới
  const handleCreateProduct = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('name', 'Sản phẩm mới (chưa có tên)');
    formData.append('description', 'Mô tả mặc định cho sản phẩm mới.');
    const result = await productsAdminService.createProduct(formData);
    if(result.success) {
      showMessage("Tạo sản phẩm mới thành công!");
      setSelectedProductId(result.data._id);
      loadProducts();
    } else {
      showMessage("Tạo sản phẩm thất bại: " + result.message);
    }
    setSaving(false);
  };

  // Xử lý cập nhật tên, mô tả
  const handleUpdateBasic = async (field: string, value: string, productIdOverride?: string) => {
    const pid = productIdOverride || selectedProductId;
    if (!pid) return;
    const formData = new FormData();
    formData.append(field, value);
    setSaving(true);
    const result = await productsAdminService.updateProduct(pid, formData);
    if(result.success) {
      if (selectedProduct && pid === selectedProduct._id) setSelectedProduct({ ...selectedProduct, [field]: value });
      loadProducts();
    }
    setSaving(false);
  };

  // Load chi tiết sản phẩm (dùng lại cho gallery update)
  const loadProductDetail = async (productId: string) => {
    setLoading(true);
    const result = await productsAdminService.getProductById(productId);
    if (result.success) {
      setSelectedProduct(result.data);
    }
    setLoading(false);
  };

  // Open modal for quick edit (sidebar)
  const openQuickEditModal = (product: Product) => {
    setModalProduct(product);
    setModalName(product.name);
    setModalOrder(product.order);
    setModalGallery(product.galleryImages ? [...product.galleryImages] : []);
    setModalNewImages([]);
    setModalOpen(true);
  };

  // Remove image from gallery (existing)
  const handleRemoveGalleryImage = (idx: number) => {
    setModalGallery(prev => prev.filter((_, i) => i !== idx));
  };
  // Remove new image (not uploaded yet)
  const handleRemoveNewImage = (idx: number) => {
    setModalNewImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Handle quick update (name, order, galleryImages)
  const handleQuickUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalProduct) return;
    setModalSaving(true);
    try {
      // 1. Update name & order
      const formData = new FormData();
      formData.append('name', modalName);
      formData.append('order', String(modalOrder));
      // 2. Remove images (if any removed)
      const removedIds = (modalProduct.galleryImages || [])
        .filter((img, idx) => !modalGallery.some(g => g._id === img._id))
        .map(img => img._id)
        .filter(Boolean);
      if (removedIds.length > 0) {
        formData.append('removeGalleryImageIds', JSON.stringify(removedIds));
      }
      // 3. Upload new images
      modalNewImages.forEach(file => formData.append('galleryImages', file));
      // 4. Call update API
      const result = await productsAdminService.updateProduct(modalProduct._id, formData);
      if (result.success) {
        showMessage('Cập nhật sản phẩm thành công!');
        setModalOpen(false);
        loadProducts();
        if (selectedProductId === modalProduct._id) loadProductDetail(modalProduct._id);
      } else {
        showMessage('Cập nhật thất bại: ' + result.message, 'error');
      }
    } finally {
      setModalSaving(false);
    }
  };

  // New application functions
  const handleAddApplication = () => {
    setAddingApp(true);
  };

  const handleEditApplication = (app: { _id: string }) => {
    setEditingAppId(app._id);
  };

  const handleDeleteApplication = async (appId: string) => {
    setSaving(true);
    if (!selectedProductId) {
      showMessage("Không tìm thấy sản phẩm được chọn", 'error');
      setSaving(false);
      return;
    }
    console.log(`Attempting to delete application: productId=${selectedProductId}, appId=${appId}`);
    const result = await productsAdminService.deleteApplication(selectedProductId, appId);
    if (result.success) {
      showMessage("Xóa application thành công!");
      loadProductDetail(selectedProductId);  // Tải lại chi tiết sản phẩm thay vì tất cả sản phẩm
    } else {
      showMessage("Xóa application thất bại: " + result.message, 'error');
      console.error("Delete application error:", result);
    }
    setSaving(false);
  };

  const handleSaveApplication = async (app: { _id?: string; title: string; content?: { heading: string; description: string; features?: string[]; images?: { url: string; alt: string }[] } }) => {
    setSaving(true);
    if (!selectedProductId) {
      showMessage("Không tìm thấy sản phẩm được chọn", 'error');
      setSaving(false);
      return;
    }
    
    if (app._id) {
      // Update existing application
      const result = await productsAdminService.updateApplication(selectedProductId, app._id, app);
      if (result.success) {
        showMessage("Cập nhật application thành công!");
        loadProductDetail(selectedProductId);
        // Đóng modal và reset state
        setAddingApp(false);
        setEditingAppId(null);
      } else {
        showMessage("Cập nhật application thất bại: " + result.message, 'error');
      }
    } else {
      // Add new application
      const result = await productsAdminService.addApplication(selectedProductId, app);
      if (result.success) {
        showMessage("Thêm application thành công!");
        loadProductDetail(selectedProductId);
        // Đóng modal và reset state
        setAddingApp(false);
        setEditingAppId(null);
      } else {
        showMessage("Thêm application thất bại: " + result.message, 'error');
      }
    }
    setSaving(false);
  };

  // Helper to get backend image URL
  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return BACKEND_DOMAIN + url;
    return url;
  };

  if (loading) return <div className="admin-loading"><div className="loading-spinner"></div><p>Đang tải danh sách sản phẩm...</p></div>;

  return (
    <div className="admin-page">
      <Toast open={toastOpen} type={toastType} message={toastMsg} onClose={()=>setToastOpen(false)} />
      <div className="admin-page-header">
        <h1 className="admin-page-title">🛍️ Quản lý Sản phẩm</h1>
        <p className="admin-page-description">Quản lý danh sách và chi tiết sản phẩm</p>
      </div>
      <div className="admin-products-grid">
      <div className="admin-products-sidebar">
          <AdminSectionCard title="Danh sách sản phẩm">
            <button onClick={handleCreateProduct} disabled={saving} className="btn-add"><FiPlusCircle /> Thêm sản phẩm mới</button>
            <div className="features-grid">
          {products.map((product) => {
                const gallery = (product.galleryImages || []).slice(0, 6);
            return (
              <div
                key={product._id}
                className={`feature-card${selectedProductId === product._id ? ' active' : ''}`}
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={e => {
                  if ((e.target as HTMLElement).closest('.feature-card-actions')) return;
                  setSelectedProductId(product._id);
                  loadProductDetail(product._id);
                }}
              >
                <div className="feature-card-actions">
                      <button className="edit-btn" title="Chỉnh sửa" onClick={ev => {ev.stopPropagation(); openQuickEditModal(product);}}><FiEdit /></button>
                </div>
                <div className="feature-content">
                  <h4>{product.name}</h4>
                  <div><b>Mô tả:</b> {product.description ? product.description.slice(0, 80) + (product.description.length > 80 ? '...' : '') : 'Chưa có mô tả'}</div>
                  <div><b>Thứ tự:</b> {product.order || 1}</div>
                  <div style={{marginTop:8}}>
                    <b>Hình ảnh:</b>
                    <div className="feature-images-grid">
                      {gallery.length === 0 ? (
                        <div className="feature-image-thumb" style={{background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',color:'#aaa',height:70,width:100}}>No image</div>
                      ) : (
                        gallery.map(img => {
                          let imgUrl = img.url;
                          if (imgUrl.startsWith('/')) imgUrl = BACKEND_DOMAIN + imgUrl;
                          return (
                            <div key={img._id} className="feature-image-thumb">
                              <Image src={imgUrl} alt={img.alt || product.name} width={100} height={70} />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          </AdminSectionCard>
      </div>
      <div className="admin-products-detail-panel">
          <AdminSectionCard title="Chi tiết sản phẩm">
        {!selectedProduct ? (
          <div className="empty-detail">Chọn một sản phẩm để xem chi tiết</div>
        ) : (
          <div className="product-detail-form">
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={localDescription}
                onChange={e => setLocalDescription(e.target.value)}
                disabled={saving}
                rows={4}
                className="form-textarea"
              />
              <button
                type="button"
                className={
                  localDescription !== (selectedProduct?.description || '')
                    ? 'btn btn-primary'
                    : 'btn-save'
                }
                onClick={() => handleUpdateBasic('description', localDescription)}
                disabled={saving || localDescription === (selectedProduct?.description || '')}
                style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <FiSave style={{ marginRight: 6 }} />
                {saving ? 'Đang lưu...' : 'Lưu mô tả'}
              </button>
            </div>
                {selectedProduct && (
                  <div className="admin-applications-section">
                    <h3>Quản lý Applications</h3>
                    <button className="btn-add" onClick={handleAddApplication}>+ Thêm application mới</button>
                    <div className="applications-list">
                      {selectedProduct.applications && selectedProduct.applications.length > 0 ? (
                        selectedProduct.applications.map((app, idx) => (
                          <div key={app._id || idx} className="application-card">
                            <div className="application-card-actions">
                              <button className="edit-btn" title="Sửa" onClick={() => handleEditApplication(app)}><FiEdit /></button>
                              <button className="delete-btn" title="Xóa" onClick={() => {
                                console.log("Deleting application with ID:", app._id);
                                handleDeleteApplication(app._id);
                              }}><FiTrash2 /></button>
                            </div>
                            <div className="application-header">{app.title}</div>
                            <div className="application-content">
                              <div><b>Heading:</b> {app.content?.heading}</div>
                              <div><b>Description:</b> {app.content?.description}</div>
                              <div><b>Features:</b> {app.content?.features?.join(', ')}</div>
                              <div className="application-images">
                                {app.content?.images?.map((img, i) => {
                                  let imgUrl = img.url;
                                  if (imgUrl.startsWith('/')) imgUrl = BACKEND_DOMAIN + imgUrl;
                                  return (
                                    <img key={i} src={imgUrl} alt={img.alt} />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>Chưa có application nào.</div>
                      )}
                    </div>
                    {(addingApp || editingAppId) && (
                      <ApplicationEditForm
                        application={addingApp ? undefined : selectedProduct.applications?.find(a => a._id === editingAppId)}
                        onSave={handleSaveApplication}
                        onCancel={() => { setAddingApp(false); setEditingAppId(null); }}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </AdminSectionCard>
        </div>
      </div>
      {/* Modal popup quick edit sidebar */}
      {modalOpen && (
        <div className="modal-overlay active">
          <div className="modal-container compact">
            <div className="modal-header">
              <h3>Chỉnh sửa nhanh sản phẩm</h3>
              <button className="btn-close" onClick={()=>setModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleQuickUpdate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input type="text" value={modalName} onChange={e => setModalName(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Thứ tự</label>
                  <input type="number" value={modalOrder} onChange={e => setModalOrder(Number(e.target.value))} className="form-input" min={1} required />
                </div>
                <div className="form-group">
                  <label>Hình ảnh</label>
                  <div className="feature-images-grid compact">
                    {modalGallery.map((img, idx) => {
                      const imgUrl = getImageUrl(img.url);
                      return (
                        <div key={img._id || idx} className="feature-image-thumb compact">
                          <Image src={imgUrl} alt={img.alt || modalName} width={70} height={50} />
                          <button type="button" className="btn-delete-img compact" onClick={() => handleRemoveGalleryImage(idx)} title="Xóa"><FiTrash2 /></button>
                        </div>
                      );
                    })}
                    {modalNewImages.map((file, idx) => (
                      <div key={"new-"+idx} className="feature-image-thumb compact">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.png';
                          }}
                        />
                        <button type="button" className="btn-delete-img compact" onClick={() => handleRemoveNewImage(idx)} title="Xóa"><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                  <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/jpg" onChange={e => { const files = e.target.files; if (files && files.length > 0) { setModalNewImages(prev => [...prev, ...Array.from(files)]); }}} style={{marginTop:8}} />
                  <small className="form-help">Chọn nhiều hình ảnh. Hình ảnh sẽ chỉ được lưu khi bạn bấm Lưu.</small>
                </div>
              </div>
              <div className="modal-footer compact">
                <button className="btn btn-secondary compact" type="button" onClick={()=>setModalOpen(false)} disabled={modalSaving}>Hủy</button>
                <button className="btn btn-primary compact" type="submit" disabled={modalSaving}>{modalSaving ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </form>
          </div>
          </div>
        )}
      <style jsx>{`
        .admin-page {
          padding: 32px 24px;
        }
        .admin-page-header {
          margin-bottom: 32px;
        }
        .admin-page-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 8px 0;
        }
        .admin-page-description {
          font-size: 1.1rem;
          color: #666;
        }
        .admin-products-grid {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: 32px;
        }
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
        .feature-card.active {
          border: 2px solid #2ecc40;
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
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .edit-btn {
          color: #3b82f6;
        }
        .delete-btn {
          color: #ff4444;
        }
        .edit-btn:hover {
          background: #e3f2fd;
        }
        .delete-btn:hover {
          background: #ffebee;
        }
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
        .admin-products-sidebar {
          min-width: 340px;
        }
        .admin-products-detail-panel {
          min-width: 400px;
        }
        .btn-add {
          background: #2ecc40;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-add:disabled {
          background: #b5e7c4;
          cursor: not-allowed;
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-group label {
          font-weight: 500;
          margin-bottom: 6px;
          display: block;
        }
        .form-group input[type="text"],
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        .form-group input[type="file"] {
          margin-top: 8px;
        }
        .empty-detail {
          color: #aaa;
          font-size: 1.1rem;
          text-align: center;
          padding: 32px 0;
        }
        .modal-overlay.active {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.18);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-container.compact {
          min-width: 350px;
          max-width: 500px;
          padding: 18px 18px 10px 18px;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .btn-close {
          background: none;
          border: none;
          color: #333;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .modal-body {
          margin-bottom: 10px;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn.btn-secondary {
          background: #eee;
          color: #333;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-size: 1rem;
          cursor: pointer;
        }
        .btn.btn-primary {
          background: #2ecc40;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-size: 1rem;
          cursor: pointer;
        }
        .btn.btn-primary:disabled {
          background: #b5e7c4;
          cursor: not-allowed;
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
        .form-group {
          margin-bottom: 12px;
        }
        .form-group label {
          font-size: 0.98rem;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .form-input {
          font-size: 1rem;
          padding: 6px 10px;
          border-radius: 5px;
        }
        .feature-images-grid.compact {
          gap: 8px;
          margin-bottom: 8px;
        }
        .feature-image-thumb.compact {
          width: 70px;
          height: 50px;
          border-radius: 6px;
        }
        .feature-image-thumb.compact img,
        .feature-image-thumb.compact :global(img) {
          border-radius: 6px;
        }
        .btn-delete-img.compact {
          top: 2px;
          right: 2px;
          width: 22px;
          height: 22px;
          font-size: 0.95rem;
          border-width: 1px;
          padding: 0;
        }
        .modal-footer.compact {
          gap: 8px;
          padding-top: 4px;
        }
        .btn.compact {
          padding: 6px 16px;
          font-size: 0.98rem;
          border-radius: 5px;
        }
        @media (max-width: 900px) {
          .admin-products-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .admin-products-sidebar,
          .admin-products-detail-panel {
            min-width: 0;
            width: 100%;
          }
        }
        @media (max-width: 600px) {
          .admin-page {
            padding: 12px 2vw;
          }
          .admin-page-header {
            margin-bottom: 18px;
          }
          .features-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .feature-card {
            padding: 10px 8px 8px 8px;
          }
          .form-group input,
          .form-group textarea {
            font-size: 0.98rem;
            padding: 6px 8px;
          }
        }
        .admin-applications-section {
          margin-top: 18px;
        }
        .application-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          padding: 18px 18px 14px 18px;
          margin-bottom: 18px;
          position: relative;
        }
        .application-card-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-bottom: 8px;
        }
        .edit-btn, .delete-btn {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 5px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .edit-btn {
          color: #3b82f6;
        }
        .delete-btn {
          color: #ff4444;
        }
        .edit-btn:hover {
          background: #e3f2fd;
        }
        .delete-btn:hover {
          background: #ffebee;
        }
        .application-header {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .application-images {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .application-images img {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          background: #eee;
        }
        .modal-overlay.active {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.18);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-container.large {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.18);
          padding: 32px 32px 18px 32px;
          min-width: 420px;
          max-width: 96vw;
          max-height: 85vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .form-group {
          margin-bottom: 18px;
        }
        .form-group label {
          font-weight: 500;
          margin-bottom: 6px;
          display: block;
        }
        .form-group input[type="text"],
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        .form-group input[type="file"] {
          margin-top: 8px;
        }
        .feature-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .feature-input-row input {
          flex: 1;
        }
        .btn-delete-feature {
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 3px;
          width: 20px;
          height: 20px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-add-feature {
          background: #2ecc40;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 0.95em;
          cursor: pointer;
          margin-top: 3px;
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
        .feature-image-thumb img {
          width: 100px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
          background: #eee;
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
        .form-help {
          font-size: 0.85em;
          color: #666;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

// Add types for ApplicationEditForm props
interface ApplicationEditFormProps {
  application?: {
    _id?: string;
    title?: string;
    content?: {
      heading?: string;
      description?: string;
      features?: string[];
      images?: { url: string; alt: string }[];
    };
  };
  onSave: (app: {
    _id?: string;
    title: string;
    content: {
      heading: string;
      description: string;
      features: string[];
      images: { url: string; alt: string }[];
    };
  }) => Promise<void>;
  onCancel: () => void;
}

function ApplicationEditForm({ application, onSave, onCancel }: ApplicationEditFormProps) {
  const [title, setTitle] = React.useState(application?.title || '');
  const [heading, setHeading] = React.useState(application?.content?.heading || '');
  const [description, setDescription] = React.useState(application?.content?.description || '');
  const [features, setFeatures] = React.useState<string[]>(application?.content?.features || ['']);
  const [images, setImages] = React.useState<{ url: string; alt: string }[]>(application?.content?.images || []);
  const [newImages, setNewImages] = React.useState<File[]>([]);
  const [saving, setSaving] = React.useState(false);

  const handleFeatureChange = (idx: number, value: string) => {
    setFeatures(f => f.map((ft, i) => i === idx ? value : ft));
  };
  const handleAddFeature = () => setFeatures(f => [...f, '']);
  const handleRemoveFeature = (idx: number) => setFeatures(f => f.filter((_, i) => i !== idx));
  const handleRemoveImage = (idx: number) => setImages(imgs => imgs.filter((_, i) => i !== idx));
  const handleRemoveNewImage = (idx: number) => setNewImages(imgs => imgs.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 1. Upload ảnh mới nếu có
      let uploadedImages: { url: string; alt: string }[] = [];
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach(file => formData.append('images', file));
        
                 // Gọi API upload nhiều ảnh
         const uploadResult = await productsAdminService.uploadMultipleImages(formData);
         if (uploadResult.success && Array.isArray(uploadResult.urls)) {
           uploadedImages = uploadResult.urls.map((url: string) => ({ url, alt: '' }));
        } else {
          throw new Error(uploadResult.message || 'Upload ảnh thất bại');
        }
      }
      
      // 2. Gộp ảnh cũ và ảnh mới
      const allImages = [...images, ...uploadedImages];
      
      const appData = {
        ...(application && typeof application._id === 'string' ? { _id: application._id } : {}),
        title,
        content: {
          heading,
          description,
          features: features.filter(f => f.trim()),
          images: allImages,
        },
      };
      
      await onSave(appData);
    } catch (error) {
      console.error('Error saving application:', error);
      // Hiển thị lỗi cho user
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return BACKEND_DOMAIN + url;
    return url;
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container large">
        <div className="modal-header">
          <h3>{application ? 'Sửa ứng dụng' : 'Thêm ứng dụng'}</h3>
          <button className="btn-close" type="button" onClick={onCancel} aria-label="Đóng">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Tiêu đề</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" required />
            </div>
            <div className="form-group">
              <label>Heading</label>
              <input type="text" value={heading} onChange={e => setHeading(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-textarea" rows={3} />
            </div>
            <div className="form-group">
              <label>Features</label>
              {features.map((ft, idx) => (
                <div key={idx} className="feature-input-row">
                  <input type="text" value={ft} onChange={e => handleFeatureChange(idx, e.target.value)} className="form-input" />
                  {features.length > 1 && (
                    <button type="button" className="btn-delete-feature" onClick={() => handleRemoveFeature(idx)} title="Xóa">
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn-add" onClick={handleAddFeature} style={{ marginTop: '8px' }}>+ Thêm feature</button>
            </div>
            <div className="form-group">
              <label>Hình ảnh</label>
              <div className="feature-images-grid">
                {images.map((img, idx) => (
                  <div key={idx} className="feature-image-thumb">
                    <img src={getImageUrl(img.url)} alt={img.alt || `Image ${idx + 1}`} width={100} height={70} style={{ objectFit: 'cover', borderRadius: 8 }} />
                    <button type="button" className="btn-delete-img" onClick={() => handleRemoveImage(idx)} title="Xóa"><FiTrash2 /></button>
                  </div>
                ))}
                {newImages.map((file, idx) => (
                  <div key={"new-"+idx} className="feature-image-thumb">
                    <img src={URL.createObjectURL(file)} alt={file.name} width={100} height={70} style={{ objectFit: 'cover', borderRadius: 8 }} />
                    <button type="button" className="btn-delete-img" onClick={() => handleRemoveNewImage(idx)} title="Xóa"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
              <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/jpg" onChange={e => { const files = e.target.files; if (files && files.length > 0) { setNewImages(prev => [...prev, ...Array.from(files)]); }}} style={{ marginTop: 8 }} />
              <small className="form-help">Chọn nhiều hình ảnh. Hình ảnh sẽ chỉ được lưu khi bạn bấm Lưu.</small>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={saving}>Hủy</button>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
