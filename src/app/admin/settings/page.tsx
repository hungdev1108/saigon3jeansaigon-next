'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import { toast } from 'react-toastify';
import { FiLock, FiUser, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

export default function SettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Show/hide password
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    setChangingPassword(true);
    
    try {
      const result = await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (result.success) {
        toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới.');
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          authService.logout();
          router.push('/admin/login');
        }, 2000);
      } else {
        toast.error(result.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="admin-loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Cài đặt tài khoản</h1>
      
      <div className="admin-content">
        {/* User Info Section */}
        <div className="settings-section">
          <h2 className="section-title">
            <FiUser /> Thông tin tài khoản
          </h2>
          <div className="user-info-card">
            <div className="info-row">
              <span className="info-label">Tên đăng nhập:</span>
              <span className="info-value">{currentUser?.username || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Vai trò:</span>
              <span className="info-value role-badge">
                {currentUser?.role === 'admin' ? 'Quản trị viên' : 
                 currentUser?.role === 'editor' ? 'Biên tập viên' : 
                 currentUser?.role || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="settings-section">
          <h2 className="section-title">
            <FiLock /> Đổi mật khẩu
          </h2>
          <div className="password-form-wrapper">
            <form onSubmit={handleChangePassword} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Mật khẩu hiện tại *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  required
                  minLength={6}
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  minLength={6}
                  disabled={changingPassword}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <span className="spinner"></span> Đang xử lý...
                  </>
                ) : (
                  <>
                    <FiSave /> Đổi mật khẩu
                  </>
                )}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page-container {
          padding: 32px 0;
          max-width: 900px;
          margin: 0 auto;
        }
        .admin-page-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: #1e4f7a;
        }
        .admin-content {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .settings-section {
          margin-bottom: 32px;
        }
        .settings-section:last-child {
          margin-bottom: 0;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1e4f7a;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .user-info-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e9ecef;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 500;
          color: #666;
        }
        .info-value {
          color: #333;
          font-weight: 500;
        }
        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          background: #1e4f7a;
          color: #fff;
          font-size: 0.9rem;
        }
        .password-form-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .password-form {
          max-width: 500px;
          width: 100%;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        .password-input-wrapper {
          position: relative;
        }
        .form-input {
          width: 100%;
          padding: 10px 45px 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #1e4f7a;
        }
        .form-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .password-toggle:hover {
          color: #1e4f7a;
        }
        .form-actions {
          margin-top: 24px;
          display: flex;
          justify-content: center;
        }
        .btn-primary {
          padding: 12px 24px;
          background: #1e4f7a;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          background: #153d5e;
        }
        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid #fff;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .admin-loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
}

