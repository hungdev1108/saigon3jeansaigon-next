import { useState, useRef } from "react";
import Image from "next/image";
import productsApi from "../../api/productsApi";

interface ApplicationImage {
  id?: string;
  url: string;
  alt: string;
  order: number;
  isActive?: boolean;
}


interface ApplicationImagesManagerProps {
  productId: string;
  applicationId: string;
  images: ApplicationImage[];
  onUpdate: (images: ApplicationImage[]) => void;
}

export default function ApplicationImagesManager({
  productId,
  applicationId,
  images = [],
  onUpdate
}: ApplicationImagesManagerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Xử lý upload hình ảnh mới
  const handleUploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API cập nhật application với hình ảnh mới
      const result = await productsApi.updateApplicationWithImages(
        productId,
        applicationId,
        {}, // Không cập nhật dữ liệu khác
        files
      );
      
      // Cập nhật UI
      if (onUpdate && result && result.data && result.data.content && result.data.content.images) {
        onUpdate(result.data.content.images as ApplicationImage[]);
      }
      
      // Reset input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Có lỗi khi tải lên hình ảnh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý xóa hình ảnh
  const handleDeleteImage = async (index: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await productsApi.deleteApplicationImage(
        productId,
        applicationId,
        index
      );
      
      // Cập nhật UI
      if (onUpdate && result && result.data) {
        onUpdate(result.data as ApplicationImage[]);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Có lỗi khi xóa hình ảnh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý thay đổi thứ tự hình ảnh
  const handleReorderImages = async (fromIndex: number, toIndex: number) => {
    // Tạo bản sao của mảng hình ảnh
    const newImages = [...images];
    
    // Di chuyển phần tử
    const [movedItem] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedItem);
    
    // Tạo mảng index mới
    const imageIndexes = newImages.map((_, index) => {
      const originalIndex = images.findIndex(img => img.url === newImages[index].url);
      return originalIndex;
    });
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await productsApi.reorderApplicationImages(
        productId,
        applicationId,
        imageIndexes
      );
      
      // Cập nhật UI
      if (onUpdate && result && result.data) {
        onUpdate(result.data as ApplicationImage[]);
      }
    } catch (err) {
      console.error('Error reordering images:', err);
      setError('Có lỗi khi sắp xếp lại hình ảnh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="application-images-manager mt-4">
      <h5>Quản lý hình ảnh</h5>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <div className="mb-3">
        <label htmlFor="applicationImages" className="form-label">
          Thêm hình ảnh mới
        </label>
        <input
          type="file"
          className="form-control"
          id="applicationImages"
          multiple
          accept="image/*"
          onChange={handleUploadImages}
          ref={fileInputRef}
          disabled={loading}
        />
        <div className="form-text">Có thể chọn nhiều hình ảnh (tối đa 10)</div>
      </div>
      
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Đang xử lý...</span>
        </div>
      )}
      
      {images.length > 0 ? (
        <div className="row g-3 mt-2">
          {images.map((image, index) => (
            <div key={index} className="col-md-4 col-sm-6">
              <div className="card h-100">
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={200}
                  height={150}
                  className="card-img-top"
                  style={{ objectFit: "cover" }}
                />
                <div className="card-body">
                  <p className="card-text small text-muted">{image.alt || 'Không có mô tả'}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteImage(index)}
                      disabled={loading}
                    >
                      <i className="fas fa-trash-alt"></i> Xóa
                    </button>
                    <div>
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary me-1"
                          onClick={() => handleReorderImages(index, index - 1)}
                          disabled={loading}
                        >
                          <i className="fas fa-arrow-up"></i>
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleReorderImages(index, index + 1)}
                          disabled={loading}
                        >
                          <i className="fas fa-arrow-down"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          Chưa có hình ảnh nào. Hãy thêm hình ảnh mới.
        </div>
      )}
    </div>
  );
} 