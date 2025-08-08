'use client';
import { useEffect, useState } from 'react';
import { BACKEND_DOMAIN } from '@/api/config';
import { FiTrash, FiCheck, FiEye, FiEyeOff, FiMessageCircle, FiMapPin, FiMail, FiFacebook, FiInstagram, FiYoutube, FiSave } from 'react-icons/fi';
import React from 'react';
import contactService from '@/services/contactService';

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status?: string;
  isSpam?: boolean;
}

interface ContactInfo {
  _id: string;
  bannerImage: string;
  address1: string;
  address2: string;
  email: string;
  phone: string;
  workingHours: string;
  mapEmbedUrl: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  isActive: boolean;
}

interface EmailConfig {
  _id?: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  cskhEmail: string;
  hrEmail: string;
  companyName: string;
  isActive: boolean;
  notes?: string;
}



export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSpam, setShowSpam] = useState(false);
  const [showMessage, setShowMessage] = useState<{ open: boolean, message: string, name: string } | null>(null);
  
  // Contact Info states
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSaving, setContactSaving] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  
  // Email Config states
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    smtpUser: '',
    smtpPass: '',
    cskhEmail: '',
    hrEmail: '',
    companyName: 'Saigon 3 Jean',
    isActive: true,
    notes: ''
  });
  const [emailConfigLoading, setEmailConfigLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  


  // Load email config
  const fetchEmailConfig = async () => {
    setEmailConfigLoading(true);
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/email-config`);
      const result = await response.json();
      if (result.success) {
        setEmailConfig(result.data);
      }
    } catch (error) {
      console.error('Error fetching email config:', error);
      setError('Failed to load email configuration');
    } finally {
      setEmailConfigLoading(false);
    }
  };

  // Update email config
  const updateEmailConfig = async () => {
    setEmailConfigLoading(true);
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/email-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailConfig)
      });
      
      const result = await response.json();
      if (result.success) {
        setEmailConfig(result.data);
        alert('Email configuration updated successfully!');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error updating email config:', error);
      alert('Failed to update email configuration');
    } finally {
      setEmailConfigLoading(false);
    }
  };

  // Test email config
  const testEmailConfig = async () => {
    if (!testEmail) {
      alert('Please enter test email address');
      return;
    }
    
    setEmailConfigLoading(true);
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/email-config/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(`Test email sent successfully to ${testEmail}!`);
        setTestEmail('');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error testing email config:', error);
      alert('Failed to send test email: ' + error);
    } finally {
      setEmailConfigLoading(false);
    }
  };

  // Load contact info
  const fetchContactInfo = async () => {
    setContactLoading(true);
    try {
      const result = await contactService.getContactInfo();
      setContactInfo(result);
      if (result.bannerImage) {
        setBannerPreview(`${BACKEND_DOMAIN}${result.bannerImage}`);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      setError('Failed to load contact info');
    } finally {
      setContactLoading(false);
    }
  };

  // Update contact info
  const updateContactInfo = async () => {
    if (!contactInfo) return;
    
    setContactSaving(true);
    try {
      console.log('Frontend - sending contactInfo:', contactInfo);
      console.log('Frontend - socialLinks object:', contactInfo.socialLinks);
      const result = await contactService.updateContactInfo(contactInfo, bannerFile);
      if (result.success) {
        setContactInfo(result.data);
        setBannerFile(null);
        if (result.data.bannerImage) {
          setBannerPreview(`${BACKEND_DOMAIN}${result.data.bannerImage}`);
        }
        alert('Contact info updated successfully!');
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      alert('Failed to update contact info');
    } finally {
      setContactSaving(false);
    }
  };

  // Handle input changes for contact info
  const handleContactInputChange = (field: keyof ContactInfo, value: string) => {
    if (!contactInfo) return;
    setContactInfo({
      ...contactInfo,
      [field]: value
    });
  };

  // Handle social links changes
  const handleSocialLinksChange = (platform: 'facebook' | 'instagram' | 'youtube', value: string) => {
    if (!contactInfo) return;
    setContactInfo({
      ...contactInfo,
      socialLinks: {
        ...contactInfo.socialLinks,
        [platform]: value
      }
    });
  };

  // Handle banner file change
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  // Fetch data khi component mount
  useEffect(() => {
    fetchSubmissions();
    fetchContactInfo(); // 🔥 Load contact info để preview data
    fetchEmailConfig(); // 🔥 Load email config
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('limit', '100');
      if (search) params.set('search', search);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (showSpam) params.set('includeSpam', 'true');
      const res = await fetch(`${BACKEND_DOMAIN}/api/contact/submissions?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data && data.data.submissions) {
        setSubmissions(data.data.submissions);
      } else {
        setError('Failed to load contact submissions');
      }
    } catch {
      setError('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchContactInfo();
    // eslint-disable-next-line
  }, []);

  // Khi thay đổi filter, fetch lại
  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line
  }, [search, startDate, endDate, showSpam]);

  // Hàm cập nhật trạng thái đã liên hệ
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_DOMAIN}/api/contact/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'replied' })
      });
      const data = await res.json();
      if (data.success) fetchSubmissions();
      else alert('Cập nhật trạng thái thất bại!');
    } catch {
      alert('Có lỗi khi cập nhật trạng thái!');
    }
  };
  // Hàm xóa record
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa record này?')) return;
    try {
      const res = await fetch(`${BACKEND_DOMAIN}/api/contact/submissions/${id}?permanent=true`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) fetchSubmissions();
      else alert('Xóa thất bại!');
    } catch {
      alert('Có lỗi khi xóa!');
    }
  };

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Quản lý trang Contact</h1>
      
      {/* Contact Submissions Section */}
      <div className="admin-section-card" style={{ marginBottom: '2rem' }}>
        <div className="subsection-header">
          <h2 className="admin-section-title">Danh sách khách hàng liên hệ</h2>
          <p className="admin-page-description">Quản lý và theo dõi các yêu cầu liên hệ từ khách hàng.</p>
        </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Tìm kiếm tên, email, công ty, chủ đề..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 8, minWidth: 220, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          Từ ngày:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ padding: 6, border: '1px solid #ccc', borderRadius: 6 }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          Đến ngày:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ padding: 6, border: '1px solid #ccc', borderRadius: 6 }}
          />
        </label>
        <button onClick={fetchSubmissions} style={{ padding: '8px 16px', borderRadius: 6, background: '#1e4f7a', color: '#fff', border: 'none' }}>Lọc</button>
        <button onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); setShowSpam(false); }} style={{ padding: '8px 16px', borderRadius: 6, background: '#eee', color: '#333', border: 'none' }}>Xóa lọc</button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <span
            onClick={() => setShowSpam(s => !s)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none', fontSize: '0.98rem', color: showSpam ? '#1e4f7a' : '#666', fontWeight: 500 }}
            title={showSpam ? 'Ẩn spam' : 'Hiện spam'}
          >
            {showSpam ? <FiEyeOff size={18} style={{ marginRight: 4 }} /> : <FiEye size={18} style={{ marginRight: 4 }} />}
            {showSpam ? 'Ẩn spam' : 'Hiện spam'}
          </span>
        </div>
      </div>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>TÊN</th>
                <th>EMAIL</th>
                <th>CÔNG TY</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th>CHỦ ĐỀ</th>
                <th>NGÀY GỬI</th>
                <th className="status-col">TRẠNG THÁI</th>
                <th className="view-col">XEM</th>
                <th className="action-col">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.company}</td>
                  <td>{s.phone}</td>
                  <td>{s.subject}</td>
                  <td>{new Date(s.createdAt).toLocaleString('vi-VN')}</td>
                  <td className="status-col">
                    {s.isSpam ? (
                      <span className="status-badge inactive">SPAM</span>
                    ) : s.status === 'replied' ? (
                      <span className="status-badge active">Đã liên hệ</span>
                    ) : (() => {
                      const today = new Date();
                      const submissionDate = new Date(s.createdAt);
                      const isToday = today.toDateString() === submissionDate.toDateString();
                      return (
                        <span className={
                          'status-badge ' + (isToday ? 'active' : 'inactive')
                        }>
                          {isToday ? 'Mới' : 'Chưa liên hệ'}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="view-col">
                    <button
                      title="Xem nội dung message"
                      className="admin-btn small"
                      onClick={() => setShowMessage({ open: true, message: s.message, name: s.name })}
                    >
                      <FiMessageCircle size={16} />
                    </button>
                  </td>
                  <td className="action-col">
                    <button
                      title="Đã liên hệ"
                      className="admin-btn small"
                      onClick={() => handleApprove(s._id)}
                      disabled={s.status === 'replied' || s.isSpam}
                      style={{ marginRight: 6 }}
                    >
                      <FiCheck size={14} />
                    </button>
                    <button
                      title="Xóa"
                      className="admin-btn small danger"
                      onClick={() => handleDelete(s._id)}
                    >
                      <FiTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
      
      {/* Contact Info Management Card */}
      <div className="admin-section-card">
        <div className="subsection-header">
          <h2 className="admin-section-title">
            <FiMapPin style={{ marginRight: '0.5rem' }} />
            Cập nhật thông tin liên hệ
          </h2>
          <p className="admin-page-description">
            Quản lý địa chỉ, thông tin liên hệ và Google Maps hiển thị trên trang web.
          </p>
        </div>
        
        {contactLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span>Đang tải thông tin liên hệ...</span>
          </div>
        ) : contactInfo ? (
          <div className="contact-info-form">

            
            {/* Addresses Section */}
            <div className="form-section">
              <div className="form-section-header">
                <FiMapPin />
                <h3>Địa chỉ</h3>
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label className="form-label">
                    <FiMapPin />
                    Địa chỉ 1 
                  </label>
                  <textarea
                    value={contactInfo.address1 || ''}
                    onChange={(e) => handleContactInputChange('address1', e.target.value)}
                    className="form-textarea"
                    rows={3}
                    placeholder={contactInfo.address1 ? '' : "Nhập địa chỉ văn phòng HCM..."}
                  />
                </div>
                <div className="form-column">
                  <label className="form-label">
                    <FiMapPin />
                    Địa chỉ 2 
                  </label>
                  <textarea
                    value={contactInfo.address2 || ''}
                    onChange={(e) => handleContactInputChange('address2', e.target.value)}
                    className="form-textarea"
                    rows={3}
                    placeholder={contactInfo.address2 ? '' : "Nhập địa chỉ nhà máy Đồng Nai..."}
                  />
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="form-section">
              <div className="form-section-header">
                <FiMail />
                <h3>Thông tin liên hệ</h3>
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label className="form-label">
                    <FiMail />
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email || ''}
                    onChange={(e) => handleContactInputChange('email', e.target.value)}
                    className="form-input"
                    placeholder={contactInfo.email ? '' : "example@company.com"}
                  />
                </div>
                {/* Removed phone and working hours fields */}
              </div>
              <div className="form-row">
                {/* Adjusted form row structure after removing fields */}
                <div className="form-column">
                  <label className="form-label">
                    <FiMapPin />
                    Google Maps Embed URL
                    <small style={{ color: '#6b7280', fontWeight: 'normal', marginLeft: '0.5rem' }}>
                      (Vào Google Maps → Chia sẻ → Nhúng bản đồ → Copy URL trong src=)
                    </small>
                  </label>
                  <textarea
                    value={contactInfo.mapEmbedUrl || ''}
                    onChange={(e) => handleContactInputChange('mapEmbedUrl', e.target.value)}
                    className="form-textarea"
                    rows={3}
                    placeholder="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!..."
                  />
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="form-section">
              <div className="form-section-header">
                <FiFacebook />
                <h3>Liên kết mạng xã hội</h3>
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label className="form-label">
                    <FiFacebook />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={contactInfo.socialLinks?.facebook || ''}
                    onChange={(e) => handleSocialLinksChange('facebook', e.target.value)}
                    className="form-input"
                    placeholder="https://facebook.com/saigon3jeans"
                  />
                </div>
                <div className="form-column">
                  <label className="form-label">
                    <FiInstagram />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={contactInfo.socialLinks?.instagram || ''}
                    onChange={(e) => handleSocialLinksChange('instagram', e.target.value)}
                    className="form-input"
                    placeholder="https://instagram.com/saigon3jeans"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label className="form-label">
                    <FiYoutube />
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={contactInfo.socialLinks?.youtube || ''}
                    onChange={(e) => handleSocialLinksChange('youtube', e.target.value)}
                    className="form-input"
                    placeholder="https://youtube.com/@saigon3jeans"
                  />
                </div>
                <div className="form-column">
                  {/* Empty column for alignment */}
                </div>
              </div>
            </div>



            {/* Save Button */}
            <div className="form-actions">
              <button
                onClick={updateContactInfo}
                disabled={contactSaving || !contactInfo}
                className="btn btn-primary save-btn"
              >
                <FiSave />
                {contactSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <FiMapPin size={48} />
            <h3>❌ Không tìm thấy thông tin liên hệ</h3>
            <p>ContactInfo is null - Database có thể chưa có data.</p>
            <button onClick={fetchContactInfo} style={{ padding: '8px 16px', marginTop: '10px', background: '#1e4f7a', color: 'white', border: 'none', borderRadius: '4px' }}>
              🔄 Reload Contact Info
            </button>
          </div>
        )}
      </div>
      
      {/* Email Settings Card */}
      <div className="admin-section-card">
        <div className="subsection-header">
          <h2 className="admin-section-title">
            <FiMail style={{ marginRight: '0.5rem' }} />
            Cấu hình Email System
          </h2>
        </div>
        
        <div className="email-config-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">SMTP Host</label>
              <input
                type="text"
                className="form-input"
                value={emailConfig.smtpHost}
                onChange={(e) => setEmailConfig({...emailConfig, smtpHost: e.target.value})}
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">SMTP Port</label>
              <input
                type="number"
                className="form-input"
                value={emailConfig.smtpPort}
                onChange={(e) => setEmailConfig({...emailConfig, smtpPort: parseInt(e.target.value)})}
                placeholder="465"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">SMTP User (Email gửi)</label>
              <input
                type="email"
                className="form-input"
                value={emailConfig.smtpUser}
                onChange={(e) => setEmailConfig({...emailConfig, smtpUser: e.target.value})}
                placeholder="your-email@gmail.com"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">SMTP Password (App Password)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={emailConfig.smtpPass}
                  onChange={(e) => setEmailConfig({...emailConfig, smtpPass: e.target.value})}
                  placeholder="App password"
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email CSKH (nhận contact form)</label>
              <input
                type="email"
                className="form-input"
                value={emailConfig.cskhEmail}
                onChange={(e) => setEmailConfig({...emailConfig, cskhEmail: e.target.value})}
                placeholder="customercare@saigon3jean.com"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email HR (nhận CV)</label>
              <input
                type="email"
                className="form-input"
                value={emailConfig.hrEmail}
                onChange={(e) => setEmailConfig({...emailConfig, hrEmail: e.target.value})}
                placeholder="hr@saigon3jean.com"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên công ty</label>
              <input
                type="text"
                className="form-input"
                value={emailConfig.companyName}
                onChange={(e) => setEmailConfig({...emailConfig, companyName: e.target.value})}
                placeholder="Saigon 3 Jean"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Test Email (để test gửi)</label>
              <input
                type="email"
                className="form-input"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea
              className="form-textarea"
              value={emailConfig.notes || ''}
              onChange={(e) => setEmailConfig({...emailConfig, notes: e.target.value})}
              placeholder="Ghi chú về cấu hình email..."
              rows={3}
            />
          </div>
          
          <div className="form-actions">
            <button
              onClick={updateEmailConfig}
              disabled={emailConfigLoading}
              className="btn btn-primary save-btn"
              style={{ marginRight: '10px' }}
            >
              <FiSave />
              {emailConfigLoading ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
            
            <button
              onClick={testEmailConfig}
              disabled={emailConfigLoading || !testEmail}
              className="btn btn-secondary"
            >
              <FiMail />
              {emailConfigLoading ? 'Đang gửi...' : 'Test Email'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal hiển thị message */}
      {showMessage?.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,79,122,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
          onClick={() => setShowMessage(null)}
        >
          <div style={{ minWidth: 320, maxWidth: 480, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(30,79,122,0.18)', padding: 28, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12, color: '#1e4f7a' }}>Nội dung liên hệ từ: {showMessage.name}</div>
            <div style={{ whiteSpace: 'pre-line', fontSize: '1.05rem', color: '#222', marginBottom: 18 }}>{showMessage.message}</div>
            <button onClick={() => setShowMessage(null)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, color: '#1e4f7a', cursor: 'pointer' }}>&times;</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .admin-page-container {
          padding: 32px 0;
          max-width: 1200px;
          margin: 0 auto;
        }
        .admin-page-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: #1e4f7a;
          letter-spacing: 1px;
        }
        .admin-table-container {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .admin-table th,
        .admin-table td {
          padding: 12px 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .admin-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }
        .admin-table td {
          color: #222;
          vertical-align: middle;
        }
        .admin-table tr {
          transition: background 0.2s;
        }
        .admin-table tbody tr:hover {
          background: #f2f7fb;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
        }
        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }
        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }
        .admin-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .admin-btn.small {
          display: inline-block;
          vertical-align: middle;
          margin: 0 2px;
          padding: 4px 8px;
          font-size: 0.8rem;
        }
        .admin-btn.small svg {
          vertical-align: middle;
          height: 18px;
          width: 18px;
        }
        .admin-btn.danger {
          background: #dc3545;
          color: #fff;
          border-color: #dc3545;
        }
        .admin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        input[type="checkbox"] {
          accent-color: #1e4f7a;
          cursor: pointer;
        }
        input[type="checkbox"]:checked {
          background-color: #1e4f7a;
        }
        .admin-table th.status-col, .admin-table th.action-col, .admin-table th.view-col,
        .admin-table td.status-col, .admin-table td.action-col, .admin-table td.view-col {
          text-align: center;
        }
        .admin-table td.action-col {
          text-align: center;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .admin-table {
            font-size: 0.97rem;
          }
          .admin-page-title {
            font-size: 1.4rem;
          }
        }
        @media (max-width: 600px) {
          .admin-page-container {
            padding: 12px 0;
          }
          .admin-table {
            font-size: 0.92rem;
          }
          .admin-page-title {
            font-size: 1.1rem;
          }
          .admin-table th, .admin-table td {
            padding: 7px 4px;
          }
        }
      `}</style>
    </div>
  );
}