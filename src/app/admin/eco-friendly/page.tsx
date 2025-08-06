"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ecoFriendlyAdminService from '@/services/ecoFriendlyService-admin';
import { BACKEND_DOMAIN } from '@/api/config';
import AdminSectionCard from '@/components/admin/AdminSectionCard';
import Toast from '@/components/admin/Toast';

const FormItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="form-item">
    <label className="form-item-label">{label}</label>
    {children}
  </div>
);

interface Feature {
  _id: string;
  title: string;
  points: string[];
}
interface Section {
  _id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}
interface EcoFriendlyData {
  features: Feature[];
  sections: Section[];
  mainImage: string;
  mainImageAlt: string;
}

export default function AdminEcoFriendlyPage() {
  const [data, setData] = useState<EcoFriendlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | boolean>(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [toastMsg, setToastMsg] = useState('');
  const [sectionFiles, setSectionFiles] = useState<{ [id: string]: File }>({});
  const [featuresEdit, setFeaturesEdit] = useState<Feature[]>([]);
  const [sectionsEdit, setSectionsEdit] = useState<Section[]>([]);
  const [featuresChanged, setFeaturesChanged] = useState(false);
  const [sectionsChanged, setSectionsChanged] = useState(false);
  // Thêm state lưu blobUrl cho từng section
  const [sectionBlobUrls, setSectionBlobUrls] = useState<{ [id: string]: string }>({});
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [mainImageAlt, setMainImageAlt] = useState<string>('');

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    if (data) {
      setFeaturesEdit(JSON.parse(JSON.stringify(data.features)));
      setSectionsEdit(JSON.parse(JSON.stringify(data.sections)));
      setFeaturesChanged(false);
      setSectionsChanged(false);
      setMainImageAlt(data.mainImageAlt || '');
      setMainImagePreview(null);
      setMainImageFile(null);
    }
  }, [data]);
  const loadData = async () => {
    setLoading(true);
    const result = await ecoFriendlyAdminService.getCompleteData();
    if (result.success) {
      setData(result.data);
    } else {
      showMessage("Lỗi tải dữ liệu: " + result.message, 'error');
    }
    setLoading(false);
  };
  const showMessage = (msg: string, type: 'success'|'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setToastOpen(true);
  };

  // --- Features ---
  const handleFeatureInput = (idx: number, field: 'title'|'points', value: string|string[]) => {
    const newFeatures = [...featuresEdit];
    if (field === 'points') newFeatures[idx].points = value as string[];
    else newFeatures[idx].title = value as string;
    setFeaturesEdit(newFeatures);
    setFeaturesChanged(JSON.stringify(newFeatures) !== JSON.stringify(data?.features));
  };

  // Thêm feature mới (tối đa 5)
  const handleAddFeature = () => {
    if (featuresEdit.length >= 5) return;
    setFeaturesEdit([
      ...featuresEdit,
      { _id: '', title: '', points: [] }
    ]);
    setFeaturesChanged(true);
  };
  const handleSaveFeatures = async () => {
    setSaving('features');
    let ok = true;
    for (const feature of featuresEdit) {
      let result;
      if (feature._id) {
        result = await ecoFriendlyAdminService.updateFeature(feature._id, { title: feature.title, points: feature.points });
      } else {
        result = await ecoFriendlyAdminService.addFeature({ title: feature.title, points: feature.points });
      }
      if (!result.success) ok = false;
    }
    if (ok) {
      showMessage('Đã lưu Features!', 'success');
      await loadData();
    } else {
      showMessage('Lỗi lưu Features!', 'error');
    }
    setSaving(false);
  };

  // --- Sections ---
  const handleSectionInput = (idx: number, field: keyof Section, value: string) => {
    const newSections = [...sectionsEdit];
    (newSections[idx] as unknown as Record<string, string>)[field] = value;
    setSectionsEdit(newSections);
    setSectionsChanged(JSON.stringify(newSections) !== JSON.stringify(data?.sections));
  };
  // Sửa handleSectionImage để lưu lại blobUrl
  const handleSectionImage = (idx: number, file: File) => {
    setSectionFiles(prev => ({ ...prev, [sectionsEdit[idx]._id]: file }));
    // Tạo blobUrl và lưu lại cho preview
    const blobUrl = URL.createObjectURL(file);
    setSectionBlobUrls(prev => ({ ...prev, [sectionsEdit[idx]._id]: blobUrl }));
    // KHÔNG gán newSections[idx].image = blobUrl nữa!
    setSectionsChanged(true);
  };
  const handleSaveSections = async () => {
    setSaving('sections');
    // upload images nếu có
    const uploadImagePromises = Object.entries(sectionFiles).map(async ([id, file]) => {
      const formData = new FormData();
      formData.append('image', file);
      const idx = sectionsEdit.findIndex(s => s._id === id);
      if (idx !== -1) {
        formData.append('title', sectionsEdit[idx].title);
        formData.append('description', sectionsEdit[idx].description);
        formData.append('imageAlt', sectionsEdit[idx].imageAlt);
        return ecoFriendlyAdminService.updateSection(id, formData);
      }
      return { success: true };
    });
    await Promise.all(uploadImagePromises);
    // update or add all sections (không ảnh)
    const sectionPromises = sectionsEdit.map(async (section) => {
      let result;
      if (section._id) {
        const formData = new FormData();
        formData.append('title', section.title);
        formData.append('description', section.description);
        formData.append('imageAlt', section.imageAlt);
        result = await ecoFriendlyAdminService.updateSection(section._id, formData);
      } else {
        const formData = new FormData();
        formData.append('title', section.title);
        formData.append('description', section.description);
        formData.append('imageAlt', section.imageAlt);
        if (sectionFiles[section._id]) {
          formData.append('image', sectionFiles[section._id]);
        }
        result = await ecoFriendlyAdminService.addSection(formData);
      }
      return { ...result, sectionTitle: section.title };
    });
    const results = await Promise.all(sectionPromises);
    const failed = results.filter(r => !r.success);
    if (failed.length === 0) {
      // Revoke all blob URLs đã tạo để tránh memory leak và lỗi preview
      Object.values(sectionBlobUrls).forEach(blobUrl => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      });
      setSectionBlobUrls({});
      showMessage('Đã lưu Sections!', 'success');
      setSectionFiles({});
      await loadData();
    } else {
      showMessage('Lỗi lưu Sections: ' + failed.map(f => f.sectionTitle).join(', '), 'error');
    }
    setSaving(false);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveMainImage = async () => {
    if (!mainImageFile && mainImageAlt === data?.mainImageAlt) return;
    setSaving('mainImage');
    const formData = new FormData();
    if (mainImageFile) formData.append('mainImage', mainImageFile);
    formData.append('mainImageAlt', mainImageAlt);
    const result = await ecoFriendlyAdminService.updateMainImage(formData);
    if (result.success) {
      showMessage('Đã lưu ảnh quả địa cầu!', 'success');
      setMainImageFile(null);
      setMainImagePreview(null);
      await loadData();
    } else {
      showMessage('Lỗi lưu ảnh quả địa cầu: ' + result.message, 'error');
    }
    setSaving(false);
  };

  if (loading) return <div className="admin-loading">Đang tải...</div>;
  if (!data) return <div className="admin-loading">Không thể tải dữ liệu.</div>;

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Quản lý Trang Eco-Friendly</h1>
      {/* Card upload ảnh quả địa cầu */}
      <AdminSectionCard
        title="Ảnh Quả Địa Cầu (Earth Image)"
        onSave={handleSaveMainImage}
        isSaving={saving === 'mainImage'}
        hasChanges={!!mainImageFile || mainImageAlt !== data?.mainImageAlt}
      >
        <FormItem label="Ảnh quả địa cầu">
          <div className="image-preview-container">
            {mainImagePreview ? (
              <img src={mainImagePreview} alt={mainImageAlt} width={300} height={300} style={{objectFit:'cover',borderRadius:8}} />
            ) : (
              data?.mainImage && (
                <Image src={`${BACKEND_DOMAIN}${data.mainImage}`} alt={data.mainImageAlt} width={300} height={300} style={{objectFit:'cover',borderRadius:8}} />
              )
            )}
          </div>
          <input type="file" onChange={handleMainImageChange} accept="image/*" className="form-file-input" />
        </FormItem>
        <FormItem label="Alt Text cho ảnh">
          <input type="text" value={mainImageAlt} onChange={e => setMainImageAlt(e.target.value)} className="form-input" />
        </FormItem>
      </AdminSectionCard>
      <AdminSectionCard title="Features" onSave={handleSaveFeatures} isSaving={saving === 'features'} hasChanges={featuresChanged}>
        {featuresEdit.map((feature, idx) => (
          <div key={feature._id || idx} className="feature-card">
            <FormItem label="Tiêu đề Feature">
              <input type="text" value={feature.title} onChange={e => handleFeatureInput(idx, 'title', e.target.value)} className="form-input" />
            </FormItem>
            <FormItem label="Danh sách điểm (mỗi dòng 1 điểm)">
              <textarea value={feature.points.join('\n')} onChange={e => handleFeatureInput(idx, 'points', e.target.value.split('\n'))} className="form-textarea" rows={3} />
            </FormItem>
          </div>
        ))}
        {/* Nút thêm feature, chỉ hiển thị khi < 5 features */}
        {featuresEdit.length < 5 && (
          <button type="button" className="add-feature-btn" onClick={handleAddFeature} style={{marginTop: 16}}>
            + Thêm Feature
          </button>
        )}
      </AdminSectionCard>
      <AdminSectionCard title="Sections" onSave={handleSaveSections} isSaving={saving === 'sections'} hasChanges={sectionsChanged}>
        {sectionsEdit.map((section, idx) => (
          <div key={section._id || idx} className="section-card">
            <FormItem label="Tiêu đề Section">
              <input type="text" value={section.title} onChange={e => handleSectionInput(idx, 'title', e.target.value)} className="form-input" />
            </FormItem>
            <FormItem label="Mô tả Section">
              <textarea value={section.description} onChange={e => handleSectionInput(idx, 'description', e.target.value)} className="form-textarea" rows={3} />
            </FormItem>
            <FormItem label="Ảnh Section">
              <div className="image-preview-container">
                {sectionFiles[section._id] && sectionFiles[section._id] instanceof File ? (
                  <img
                    src={sectionBlobUrls[section._id]}
                    alt={section.imageAlt}
                    width={300}
                    height={150}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                ) : (
                  <Image
                    src={`${BACKEND_DOMAIN}${section.image}`}
                    alt={section.imageAlt}
                    width={300}
                    height={150}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
              </div>
              <input type="file" onChange={e => e.target.files && handleSectionImage(idx, e.target.files[0])} accept="image/*" className="form-file-input" />
            </FormItem>
            <FormItem label="Alt Text cho ảnh">
              <input type="text" value={section.imageAlt} onChange={e => handleSectionInput(idx, 'imageAlt', e.target.value)} className="form-input" />
            </FormItem>
          </div>
        ))}
      </AdminSectionCard>
      <Toast open={toastOpen} type={toastType} message={toastMsg} onClose={() => setToastOpen(false)} />
    </div>
  );
}
