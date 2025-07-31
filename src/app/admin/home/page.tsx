"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import homeService from "@/services/homeService";
import { BACKEND_DOMAIN } from "@/api/config";
import { FiSave, FiImage, FiVideo, FiLink, FiType, FiFileText, FiTrash2, FiPlusCircle, FiCheck, FiAlertTriangle, FiInfo, FiEdit, FiArrowRight, FiX, FiCalendar, FiEye } from 'react-icons/fi';
import { toast, ToastOptions } from "react-toastify";

// Toast config
const toastOptions: ToastOptions = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}
interface HeroData {
  title: string;
  subtitle: string;
  backgroundImage: string;
  videoUrl: string;
  isActive: boolean;
  aiBannerImage?: string;
}
interface SectionData {
  title: string;
  content: string;
  mediaType: string;
  mediaUrl: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  order: number;
}
interface CustomerData {
  _id: string;
  name: string;
  logo: string;
  website: string;
  order: number;
}
interface CustomersData {
  denimWoven: CustomerData[];
  knit: CustomerData[];
  [key: string]: CustomerData[];
}
interface NewsData {
  _id: string;
  title: string;
  excerpt: string;
  content: string; // Thêm field content
  image: string;
  isPublished: boolean;
  isFeatured: boolean;
  id: string;
  publishDate: string;
  slug: string;
  tags: string[];
  author: string;
  onHome: boolean; // Thêm field onHome
  views: number; // Thêm field views
}
interface HomeData {
  hero: HeroData;
  sections: SectionData[];
  customers: CustomersData;
  featuredNews: NewsData[];
}

// Preview states
type PreviewMap = { [key: string]: string };

// FormItem và AdminSectionCard giữ nguyên như cũ
const FormItem = ({ label, icon, children }: { label: string; icon?: React.ReactNode, children: React.ReactNode }) => (
  <div className="form-item">
    <label className="form-item-label">
      {icon}
      <span>{label}</span>
    </label>
    {children}
  </div>
);

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

interface EditNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsData | null;
  onSave: (newsData: NewsData, file?: File) => Promise<void>;
  isSaving: boolean;
}
const EditNewsModal = ({ isOpen, onClose, news, onSave, isSaving }: EditNewsModalProps) => {
  const [formData, setFormData] = useState<NewsData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (news) {
      setFormData({ ...news });
      setImagePreview(news.image ? `${BACKEND_DOMAIN}${news.image}` : null);
    } else {
      setFormData({
        _id: '',
        title: '',
        excerpt: '',
        content: '',
        image: '',
        isPublished: true,
        isFeatured: false,
        publishDate: new Date().toISOString().split('T')[0],
        id: '',
        slug: '',
        tags: [],
        author: 'Saigon 3 Jean',
        onHome: false, // Thêm onHome mặc định
        views: 0 // Thêm views mặc định
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [news]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const newValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    console.log(`Changing ${name} to:`, newValue);
    
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, [name]: newValue };
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    await onSave(formData, imageFile || undefined);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="modal-container">
        <div className="modal-header">
          <h3>{news?._id ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}</h3>
          <button className="btn-close" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Tiêu đề</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                className="form-input" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Tóm tắt</label>
              <textarea 
                name="excerpt" 
                value={formData.excerpt} 
                onChange={handleInputChange} 
                className="form-textarea" 
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Nội dung</label>
              <textarea 
                name="content" 
                value={formData.content} 
                onChange={handleInputChange} 
                className="form-textarea" 
                rows={5}
                required
              />
            </div>
            <div className="form-group">
              <label>Tags (tối đa 3 tags)</label>
              <div className="tags-input-container">
                <div className="tags-display">
                  {formData.tags && Array.isArray(formData.tags) && formData.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <button 
                        type="button" 
                        className="tag-remove-btn" 
                        onClick={() => {
                          console.log(`Removing tag at index ${index}:`, formData.tags[index]);
                          
                          // Ensure tags is an array before splicing
                          if (Array.isArray(formData.tags)) {
                            const newTags = [...formData.tags];
                            newTags.splice(index, 1);
                            console.log("New tags after removal:", newTags);
                            
                            setFormData(prev => {
                              if (!prev) return null;
                              return { ...prev, tags: newTags };
                            });
                          }
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  className="tag-input" 
                  placeholder={formData.tags && Array.isArray(formData.tags) && formData.tags.length >= 3 ? "Đã đạt giới hạn tags" : "Nhập tag và nhấn Enter"}
                  disabled={formData.tags && Array.isArray(formData.tags) && formData.tags.length >= 3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      const tag = input.value.trim();
                      
                      if (tag) {
                        console.log("Adding tag:", tag);
                        
                        // Ensure tags is an array
                        const currentTags = Array.isArray(formData.tags) ? [...formData.tags] : [];
                        
                        // Check if we're under the limit
                        if (currentTags.length < 3) {
                          // Check for duplicates
                          if (!currentTags.includes(tag)) {
                            const newTags = [...currentTags, tag];
                            console.log("New tags array:", newTags);
                            
                            setFormData(prev => {
                              if (!prev) return null;
                              return { ...prev, tags: newTags };
                            });
                            
                            input.value = '';
                          } else {
                            console.log("Tag already exists:", tag);
                          }
                        } else {
                          console.log("Tag limit reached (3)");
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Hình ảnh</label>
              {imagePreview && (
                <div className="image-preview-container">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    width={200} 
                    height={120} 
                    className="image-preview" 
                  />
                </div>
              )}
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="form-file-input" 
                accept="image/*" 
              />
            </div>
            <div className="form-group form-inline">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="isPublished" 
                  name="isPublished" 
                  checked={formData.isPublished} 
                  onChange={handleInputChange} 
                  className="form-checkbox" 
                />
                <label htmlFor="isPublished">Đăng ngay</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="isFeatured" 
                  name="isFeatured" 
                  checked={formData.isFeatured} 
                  onChange={handleInputChange} 
                  className="form-checkbox" 
                />
                <label htmlFor="isFeatured">Tin nổi bật</label>
              </div>
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="onHome" 
                  name="onHome" 
                  checked={formData.onHome} 
                  onChange={handleInputChange} 
                  className="form-checkbox" 
                />
                <label htmlFor="onHome">Trang chủ</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu tin tức'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === Main component ===
export default function AdminHomePage() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [initialHomeData, setInitialHomeData] = useState<HomeData | null>(null);
  const [homepageNews, setHomepageNews] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | boolean>(false);

  // Files for upload, preview for UI
  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [logoPreview, setLogoPreview] = useState<PreviewMap>({});
  const [mediaPreview, setMediaPreview] = useState<PreviewMap>({});
  const [heroPreview, setHeroPreview] = useState<PreviewMap>({});

  // Modal news
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditNews, setCurrentEditNews] = useState<NewsData | null>(null);

  useEffect(() => {
    loadHomepageData();
  }, []);

  const loadHomepageData = async () => {
    try {
      setLoading(true);
      const [homeDataResult, homepageNewsResult] = await Promise.all([
          homeService.getCompleteHomeData(),
          homeService.getHomepageNews()
      ]);
      setHomeData(homeDataResult as HomeData);
      setInitialHomeData(JSON.parse(JSON.stringify(homeDataResult)) as HomeData);
      setHomepageNews(homepageNewsResult as NewsData[]);
    } catch (error) {
      handleError(error, "tải dữ liệu trang");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = (section: keyof Omit<HomeData, 'featuredNews'>) => {
    if (!initialHomeData || !homeData) return false;
    return JSON.stringify(initialHomeData[section]) !== JSON.stringify(homeData[section]) ||
      Object.keys(files).some(key => key.startsWith(section.toString()));
  };

  // --- Handlers ---
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: string,
    index?: number,
    subSection?: string
  ) => {
    const { name, value, type } = e.target;
    let inputValue: any = value;
    if (type === 'checkbox' && 'checked' in e.target) {
      inputValue = (e.target as HTMLInputElement).checked;
    }
    setHomeData(prevData => {
      if (!prevData) return null;
      const newData = JSON.parse(JSON.stringify(prevData));
      if (subSection && index === undefined) {
        const nameParts = name.split('_');
        if (nameParts.length >= 2) {
          const fieldName = nameParts[0];
          const customerId = nameParts.slice(1).join('_');
          const customerIndex = newData.customers[subSection].findIndex(
            (c: CustomerData) => String(c._id) === String(customerId)
          );
          if (customerIndex !== -1) {
            newData.customers[subSection][customerIndex][fieldName] = inputValue;
          } else {
            console.error(`Không tìm thấy khách hàng với ID: ${customerId}`);
          }
        }
      } else if (index !== undefined) {
        newData[section][index][name] = inputValue;
      } else {
        newData[section][name] = inputValue;
      }
      return newData;
    });
  };

  const handleCheckboxChange = async (newsId: string, field: 'isFeatured' | 'isPublished' | 'onHome', checked: boolean) => {
      const newsItem = homepageNews.find(n => n._id === newsId);
      if (!newsItem) return;
      
      // Log trạng thái trước khi thay đổi
      console.log(`Changing ${field} for news "${newsItem.title}" from ${newsItem[field]} to ${checked}`);
      
      // Mô tả trạng thái cho người dùng
      let statusMessage = "";
      if (field === 'isPublished') {
        statusMessage = checked ? "Đã đăng tin tức" : "Đã hủy đăng tin tức";
      } else if (field === 'isFeatured') {
        statusMessage = checked ? "Đã đặt làm tin nổi bật" : "Đã bỏ tin nổi bật";
      } else if (field === 'onHome') {
        statusMessage = checked ? "Đã hiển thị trên trang chủ" : "Đã bỏ hiển thị trên trang chủ";
      }
      
      const updatedNewsItem = { ...newsItem, [field]: checked };
      setSaving(newsId);
      try {
          const result = await homeService.updateNews(newsId, updatedNewsItem, undefined);
          if (result.success) {
              toast.success(statusMessage, { ...toastOptions, icon: <FiCheck /> });
              setHomepageNews(prevNews =>
                prevNews.map(n => (n._id === newsId ? updatedNewsItem : n))
              );
              
              // Log kết quả thành công
              console.log(`Successfully updated news status:`, {
                id: newsId,
                field,
                newValue: checked,
                result: result.success
              });
          } else {
              throw new Error(result.message || "Cập nhật thất bại");
          }
      } catch (error) {
          handleError(error, `cập nhật trạng thái tin tức`);
      } finally {
          setSaving(false);
      }
  };

  // ==================== ĐÂY LÀ CHỖ ĐÃ SỬA ==================== 
  // Xử lý file và preview cho UI (KHÔNG ghi base64 vào homeData)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Log thông tin file để debug
      console.log('File selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
        key: key
      });
      
      setFiles(prevFiles => ({ ...prevFiles, [key]: file }));
      // Preview cho từng loại:
      if (key === 'hero-aiBannerImage') {
        const reader = new FileReader();
        reader.onload = (event) => setHeroPreview(prev => ({ ...prev, [key]: event.target?.result as string }));
        reader.readAsDataURL(file);
      } else if (key.startsWith('customers')) {
        const reader = new FileReader();
        reader.onload = (event) => setLogoPreview(prev => ({ ...prev, [key]: event.target?.result as string }));
        reader.readAsDataURL(file);
      } else if (key.startsWith('sections')) {
        const reader = new FileReader();
        reader.onload = (event) => setMediaPreview(prev => ({ ...prev, [key]: event.target?.result as string }));
        reader.readAsDataURL(file);
      } else if (key.startsWith('hero') && key !== 'hero-aiBannerImage') {
        const reader = new FileReader();
        reader.onload = (event) => setHeroPreview(prev => ({ ...prev, [key]: event.target?.result as string }));
        reader.readAsDataURL(file);
      }
      e.target.value = '';
    }
  };
  // ==================== HẾT CHỖ SỬA ==================== 

  const handleError = (error: any, action: string) => {
    console.error(`Lỗi khi ${action}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
    toast.error(`Lỗi khi ${action}: ${errorMessage}`, {
      ...toastOptions,
      icon: <FiAlertTriangle />
    });
  };

  const handleSave = async (section: "hero" | "sections" | "customers") => {
    if (!homeData || !hasChanges(section)) return;
    setSaving(section);

    try {
        let result: ApiResponse;
        const dataToSave = homeData[section];
        // Chỉ gửi file (không gửi base64)
        const filesToSave = Object.keys(files)
          .filter(key => key.startsWith(section))
          .reduce((obj, key) => {
            if (section === 'customers') {
              const parts = key.split('-');
              if (parts.length >= 2) {
                const categoryAndId = parts[1];
                const underscoreIndex = categoryAndId.indexOf('_');
                if (underscoreIndex !== -1) {
                  const category = categoryAndId.substring(0, underscoreIndex);
                  const id = categoryAndId.substring(underscoreIndex + 1);
                  const newKey = `${category}_${id}_logo`;
                  obj[newKey] = files[key];
                  return obj;
                }
              }
            }
            const fileKey = key.substring(section.length + 1);
            obj[fileKey] = files[key];
            return obj;
          }, {} as Record<string, File>);
        
        // Đảm bảo truyền đúng key cho AI Banner
        if (files['hero-aiBannerImage']) {
          filesToSave['aiBannerImage'] = files['hero-aiBannerImage'];
        }
        
        // Log thông tin trước khi gửi lên server
        console.log(`Saving ${section} with files:`, Object.keys(filesToSave).map(key => ({
          key,
          fileName: filesToSave[key].name,
          fileType: filesToSave[key].type,
          fileSize: filesToSave[key].size
        })));
        
        switch(section) {
          case 'hero':
              result = await homeService.updateHero(dataToSave as HeroData, filesToSave);
              break;
          case 'sections':
              result = await homeService.updateHomeSections(dataToSave as SectionData[], filesToSave);
              break;
          case 'customers':
              result = await homeService.updateCustomers(dataToSave as CustomersData, filesToSave);
              break;
          default:
              throw new Error("Section chưa được hỗ trợ lưu.");
        }
        
        console.log(`Save ${section} result:`, result);
        
        if (result.success) {
          toast.success("Đã lưu thành công!", { ...toastOptions, icon: <FiCheck /> });
          setFiles({});
          setLogoPreview({});
          setMediaPreview({});
          setHeroPreview({});
          await loadHomepageData();
        } else {
          throw new Error(result.message || "Lưu thất bại");
        }
    } catch (error) {
      handleError(error, `lưu ${section}`);
    } finally {
      setSaving(false);
    }
  }

  const handleDeleteCustomer = async (subSection: string, id: string) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
          setSaving(`delete-${subSection}-${id}`);
          try {
              const deleteCustomerMethod = (homeService as any).deleteCustomer;
              const result = await deleteCustomerMethod(subSection, id);
              if (result.success) {
                  toast.success("Đã xóa khách hàng thành công!", { ...toastOptions, icon: <FiCheck /> });
                  setHomeData(prevData => {
                      if (!prevData) return null;
                      const newData = JSON.parse(JSON.stringify(prevData));
                      newData.customers[subSection] = newData.customers[subSection].filter(
                          (c: CustomerData) => c._id !== id
                      );
                      return newData;
                  });
              } else {
                  throw new Error(result.message || "Xóa thất bại");
              }
          } catch (error) {
              handleError(error, `xóa khách hàng`);
          } finally {
              setSaving(false);
          }
      }
  };

  const handleAddCustomer = (subSection: 'denimWoven' | 'knit') => {
    const newCustomer: CustomerData = {
        _id: `temp_${Date.now()}_${Math.random()}`,
        name: 'Tên khách hàng mới',
        logo: "/images/310x300.png",
        website: '',
        order: homeData?.customers[subSection]?.length || 0
    };
    setHomeData(prevData => {
        if (!prevData) return null;
        const newData = JSON.parse(JSON.stringify(prevData));
        newData.customers[subSection] = [...newData.customers[subSection], newCustomer];
        return newData;
    });
    toast.info("Đã thêm khách hàng mới. Vui lòng cập nhật thông tin và lưu lại.", { ...toastOptions, icon: <FiInfo /> });
  };

  const handleVideoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const videoFile = e.target.files[0];
      if (videoFile.size > 100 * 1024 * 1024) {
        toast.error("Video quá lớn. Kích thước tối đa là 100MB.", { ...toastOptions, icon: <FiAlertTriangle /> });
        return;
      }
      setSaving('hero-video');
      toast.info("Đang tải video lên, vui lòng đợi...", { ...toastOptions, icon: <FiInfo /> });
      try {
        const formData = new FormData();
        formData.append('heroVideo', videoFile);
        const response = await fetch(`${BACKEND_DOMAIN}/api/home/hero/video`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: formData
        });
        if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
        const result = await response.json();
        if (result.success) {
          toast.success("Upload video thành công!", { ...toastOptions, icon: <FiCheck /> });
          setHomeData(prevData => {
            if (!prevData) return null;
            const newData = JSON.parse(JSON.stringify(prevData));
            newData.hero.videoUrl = result.data.videoUrl;
            return newData;
          });
          e.target.value = '';
        } else {
          throw new Error(result.message || "Upload thất bại");
        }
      } catch (error) {
        handleError(error, "upload video");
      } finally {
        setSaving(false);
      }
    }
  };

  // News modal, news add/edit/delete như cũ
  const handleAddNews = () => {
    setCurrentEditNews(null);
    setIsEditModalOpen(true);
  };
  const handleEditNews = (news: NewsData) => {
    setCurrentEditNews(news);
    setIsEditModalOpen(true);
  };
  const handleSaveNews = async (newsData: NewsData, file?: File) => {
    setSaving('news');
    try {
      let result;
      if (newsData._id) {
        console.log("Updating existing news:", newsData._id);
        result = await homeService.updateNews(newsData._id, newsData, file);
      } else {
        console.log("Creating new news with data:", {
          title: newsData.title,
          excerpt: newsData.excerpt?.substring(0, 30) + "...",
          hasImage: !!file,
          tags: newsData.tags
        });
        
        const formData = new FormData();
        Object.entries(newsData).forEach(([key, value]) => {
          if (key !== 'image' && key !== '_id' && key !== 'id') {
            if (key === 'tags' && Array.isArray(value)) {
              // Xử lý đúng cách cho tags
              formData.append(key, value.join(','));
              console.log(`Adding tags: ${value.join(',')}`);
            } else {
              formData.append(key, String(value));
            }
          }
        });
        
        if (file) {
          console.log(`Adding image file: ${file.name} (${file.type}, ${file.size} bytes)`);
          formData.append('newsImage', file);
        }
        
        result = await homeService.createNews(formData);
      }
      
      console.log("API result:", result);
      
      if (result.success) {
        toast.success(newsData._id ? "Đã cập nhật tin tức!" : "Đã thêm tin tức mới!", { ...toastOptions, icon: <FiCheck /> });
        const updatedNews = await homeService.getHomepageNews();
        setHomepageNews(updatedNews as NewsData[]);
        setIsEditModalOpen(false);
      } else {
        throw new Error(result.message || "Lưu tin tức thất bại");
      }
    } catch (error) {
      handleError(error, newsData._id ? "cập nhật tin tức" : "thêm tin tức mới");
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteNews = async (newsId: string) => {
    setSaving(`delete-news-${newsId}`);
    try {
      const result = await homeService.deleteNews(newsId);
      if (result.success) {
        toast.success("Đã xóa tin tức thành công!", { ...toastOptions, icon: <FiCheck /> });
        setHomepageNews(prevNews => prevNews.filter(news => news._id !== newsId));
      } else {
        throw new Error(result.message || "Xóa tin tức thất bại");
      }
    } catch (error) {
      handleError(error, "xóa tin tức");
    } finally {
      setSaving(false);
    }
  };

  // --- Render Functions ---
  const renderLoading = () => <div className="admin-loading">Đang tải dữ liệu...</div>;

  if (loading) return renderLoading();
  if (!homeData) return <div>Không thể tải dữ liệu trang chủ.</div>;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý trang chủ</h1>
        <p className="admin-page-description">Chỉnh sửa nội dung sẽ được hiển thị trên trang chủ của website.</p>
      </div>
      
      {/* Hero Section */}
      <AdminSectionCard title="Hero Section" onSave={() => handleSave('hero')} isSaving={saving === 'hero'} hasChanges={hasChanges('hero')}>
        <div className="grid-2-col">
            <div className="form-column">
                <FormItem label="Tiêu đề chính" icon={<FiType />}>
                    <input type="text" value={homeData.hero.title || ''} name="title" onChange={(e) => handleInputChange(e, 'hero')} className="form-input" />
                </FormItem>
                 <FormItem label="Phụ đề" icon={<FiFileText />}>
                    <textarea value={homeData.hero.subtitle || ''} name="subtitle" onChange={(e) => handleInputChange(e, 'hero')} className="form-textarea" />
                </FormItem>
                 <FormItem label="Video URL" icon={<FiLink />}>
                    <input type="text" placeholder="Dán link Youtube vào đây" value={homeData.hero.videoUrl || ''} name="videoUrl" onChange={(e) => handleInputChange(e, 'hero')} className="form-input" />
                </FormItem>
                 <FormItem label="Hoặc Upload video mới" icon={<FiVideo />}>
                     <input type="file" onChange={handleVideoUpload} accept="video/*" className="form-file-input"/>
                 </FormItem>
            </div>
            <div className="form-column">
                <FormItem label="Ảnh nền" icon={<FiImage />}>
                    <div className="image-preview-container">
                       {homeData.hero.videoUrl ? (
                           <video 
                               src={`${BACKEND_DOMAIN}${homeData.hero.videoUrl}`} 
                               width="300" 
                               height="150" 
                               controls 
                               className="image-preview" 
                           />
                       ) : (
                           <Image 
                               src={
                                  heroPreview['hero-backgroundImage']
                                  ? heroPreview['hero-backgroundImage']
                                  : (files['hero-backgroundImage']
                                    ? URL.createObjectURL(files['hero-backgroundImage'])
                                    : `${BACKEND_DOMAIN}${homeData.hero.backgroundImage}`)
                               }
                               alt="Ảnh nền" width={300} height={150} className="image-preview" 
                           />
                       )}
                    </div>
                    <input type="file" onChange={(e) => handleFileChange(e, 'hero-backgroundImage')} accept="image/*" className="form-file-input"/>
                </FormItem>
                <FormItem label="Ảnh AI Banner" icon={<FiImage />}>
                  <div className="image-preview-container">
                    {heroPreview['hero-aiBannerImage']
                      ? <Image src={heroPreview['hero-aiBannerImage']} alt="AI Banner" width={300} height={150} className="image-preview" />
                      : (files['hero-aiBannerImage']
                        ? <Image src={URL.createObjectURL(files['hero-aiBannerImage'])} alt="AI Banner" width={300} height={150} className="image-preview" />
                        : (homeData.hero.aiBannerImage
                          ? <Image src={`${BACKEND_DOMAIN}${homeData.hero.aiBannerImage}`} alt="AI Banner" width={300} height={150} className="image-preview" />
                          : null
                        )
                      )
                    }
                  </div>
                  <input type="file" onChange={(e) => handleFileChange(e, 'hero-aiBannerImage')} accept="image/*" className="form-file-input"/>
                </FormItem>
            </div>
        </div>
      </AdminSectionCard>

      {/* Content Sections */}
      <AdminSectionCard title="Content Sections" onSave={() => handleSave('sections')} isSaving={saving === 'sections'} hasChanges={hasChanges('sections')}>
        {homeData.sections.map((section, index) => (
          <div key={index} className="subsection-card">
              <h4>Section {index + 1}: {section.title}</h4>
              <div className="grid-2-col">
                  <div className="form-column">
                      <FormItem label="Tiêu đề Section" icon={<FiType />}>
                        <input type="text" value={section.title} name="title" onChange={(e) => handleInputChange(e, 'sections', index)} className="form-input"/>
                      </FormItem>
                      <FormItem label="Nội dung" icon={<FiFileText />}>
                        <textarea value={section.content} name="content" onChange={(e) => handleInputChange(e, 'sections', index)} className="form-textarea"/>
                      </FormItem>
                      <FormItem label="Chữ trên nút" icon={<FiLink />}>
                        <input type="text" value={section.buttonText} name="buttonText" onChange={(e) => handleInputChange(e, 'sections', index)} className="form-input"/>
                      </FormItem>
                      <FormItem label="Link cho nút" icon={<FiLink />}>
                        <input type="text" value={section.buttonLink} name="buttonLink" onChange={(e) => handleInputChange(e, 'sections', index)} className="form-input"/>
                      </FormItem>
                  </div>
                  <div className="form-column">
                    <FormItem label="Media (Ảnh/Video)" icon={<FiImage />}>
                      <div className="image-preview-container">
                        {section.mediaType === 'image' ? (
                            <Image 
                                src={
                                  mediaPreview[`sections-${index}-mediaUrl`]
                                    ? mediaPreview[`sections-${index}-mediaUrl`]
                                    : (files[`sections-${index}-mediaUrl`]
                                      ? URL.createObjectURL(files[`sections-${index}-mediaUrl`])
                                      : `${BACKEND_DOMAIN}${section.mediaUrl}`)
                                }
                                alt={section.title} width={300} height={150} className="image-preview" 
                            />
                        ) : (
                            <video 
                              src={
                                mediaPreview[`sections-${index}-mediaUrl`]
                                  ? mediaPreview[`sections-${index}-mediaUrl`]
                                  : (files[`sections-${index}-mediaUrl`]
                                    ? URL.createObjectURL(files[`sections-${index}-mediaUrl`])
                                    : `${BACKEND_DOMAIN}${section.mediaUrl}`)
                              }
                              width="300" height="150" controls className="image-preview" />
                        )}
                      </div>
                       <input 
                          type="file" 
                          onChange={(e) => handleFileChange(e, `sections-${index}-mediaUrl`)} 
                          accept="image/*,video/*" 
                          className="form-file-input"
                       />
                    </FormItem>
                  </div>
              </div>
          </div>
        ))}
      </AdminSectionCard>
      
      {/* Customers Section */}
      <AdminSectionCard title="Đối tác & Khách hàng" onSave={() => handleSave('customers')} isSaving={saving === 'customers'} hasChanges={hasChanges('customers')}>
         {Object.keys(homeData.customers).map(subSectionKey => (
             <div key={subSectionKey} className="subsection-card">
                 <div className="subsection-header">
                     <h4>{subSectionKey === 'denimWoven' ? 'Denim / Woven' : 'Knit'}</h4>
                      <button className="btn-add" onClick={() => handleAddCustomer(subSectionKey as 'denimWoven' | 'knit')}><FiPlusCircle /> Thêm mới</button>
                 </div>
                 <div className="customer-grid">
                     {homeData.customers[subSectionKey].map((customer, idx) => (
                         <div key={customer._id || idx} className="customer-card">
                            <div className="image-preview-container">
                               <Image 
                                   src={
                                    logoPreview[`customers-${subSectionKey}_${customer._id}-logo`]
                                    ? logoPreview[`customers-${subSectionKey}_${customer._id}-logo`]
                                    : (files[`customers-${subSectionKey}_${customer._id}-logo`]
                                      ? URL.createObjectURL(files[`customers-${subSectionKey}_${customer._id}-logo`])
                                      : customer.logo.startsWith('/images/')
                                        ? customer.logo
                                      : `${BACKEND_DOMAIN}${customer.logo}`)
                                   }
                                   alt={customer.name} 
                                   width={100} 
                                   height={50} 
                                   className="image-preview-customer"
                               />
                            </div>
                             <input 
                                type="file" 
                                onChange={(e) => handleFileChange(e, `customers-${subSectionKey}_${customer._id}-logo`)} 
                                accept="image/*" 
                                className="form-file-input small"
                                id={`file-${subSectionKey}-${customer._id}`}
                            />
                            <input 
                                type="text" 
                                value={customer.name || ""} 
                                name={`name_${customer._id}`} 
                                onChange={(e) => handleInputChange(e, 'customers', undefined, subSectionKey)} 
                                placeholder="Tên khách hàng" 
                                className="form-input small"
                            />
                            <input 
                                type="text" 
                                value={customer.website || ""} 
                                name={`website_${customer._id}`} 
                                onChange={(e) => handleInputChange(e, 'customers', undefined, subSectionKey)} 
                                placeholder="Website" 
                                className="form-input small"
                            />
                             <button className="btn-delete" onClick={() => handleDeleteCustomer(subSectionKey, customer._id)}><FiTrash2 /></button>
                         </div>
                     ))}
                 </div>
             </div>
         ))}
      </AdminSectionCard>

      {/* Featured News Section */}
      <AdminSectionCard title="Tin tức hiển thị trên trang chủ">
          <div className="card-content">
              <div className="subsection-header">
                  <p className="admin-page-description">Quản lý tin tức hiển thị trên trang chủ website.</p>
                  <button className="btn-add" onClick={handleAddNews}><FiPlusCircle /> Thêm tin tức mới</button>
              </div>
              {homepageNews.length > 0 ? (
                <div className="news-grid">
                  {homepageNews.map(news => (
                      <div key={news._id} className="news-card">
                        <div className="news-image-container">
                          <Image 
                            src={`${BACKEND_DOMAIN}${news.image}`} 
                            alt={news.title} 
                            width={200} 
                            height={120} 
                            className="news-thumbnail"
                          />
                          <div className="news-actions">
                            <button 
                              className="btn-icon btn-edit" 
                              onClick={() => handleEditNews(news)}
                              title="Chỉnh sửa tin tức"
                            >
                              <FiEdit />
                            </button>
                            <button 
                              className="btn-icon btn-delete" 
                              onClick={() => {
                                if(window.confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
                                  handleDeleteNews(news._id);
                                }
                              }}
                              title="Xóa tin tức"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        <div className="news-content">
                          <h4 className="news-title">{news.title}</h4>
                          <p className="news-date">{new Date(news.publishDate).toLocaleDateString()}</p>
                          <p className="news-excerpt">{news.excerpt}</p>
                          {news.isFeatured && <span className="news-featured-badge">Tin nổi bật</span>}
                        </div>
                        <div className="news-status-badges">
                          {news.isPublished && <span className="status-badge published">Đã đăng</span>}
                          {news.isFeatured && <span className="status-badge featured">Nổi bật</span>}
                          {news.onHome && <span className="status-badge on-home">Trang chủ</span>}
                        </div>
                      </div>
                  ))}
                </div>
              ) : (
                <div className="empty-news">
                  <p>Không có tin tức nào để hiển thị.</p>
                  <button className="btn-add" onClick={handleAddNews}>
                    <FiPlusCircle /> Tạo tin tức đầu tiên
                  </button>
                </div>
              )}
          </div>
      </AdminSectionCard>
      
      {/* Modal chỉnh sửa tin tức */}
      <EditNewsModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        news={currentEditNews}
        onSave={handleSaveNews}
        isSaving={saving === 'news'}
      />
    </div>
  );
}
