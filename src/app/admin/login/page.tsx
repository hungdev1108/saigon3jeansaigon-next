"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authService from "@/services/authService";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push("/admin/home");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa error khi user bắt đầu nhập
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authService.login(formData);

      if (result.success) {
        // Đăng nhập thành công, chuyển hướng
        router.push("/admin/home");
      } else {
        setError(result.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo */}
        <div className="login-header">
          <div className="login-logo">
            <Image
              src="/images/sg3jeans_logo.png"
              alt="Saigon3Jeans"
              width={200}
              height={80}
              className="logo-image"
            />
          </div>
          {/* <h1>Admin Panel</h1> */}
          <p>Đăng nhập để quản lý website</p>
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              <span className="form-icon">👤</span>
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Nhập tên đăng nhập"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="form-icon">🔒</span>
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              <>
                <span className="login-icon">🚀</span>
                Đăng nhập
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2025 Saigon3Jean. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url("/images/home_banner-section3.png") center/cover
            no-repeat;
          position: relative;
          padding: 20px;
        }

        .login-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1;
        }

        .login-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          padding: 40px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          position: relative;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-header {
          margin-bottom: 30px;
        }

        .login-logo {
          margin-bottom: 20px;
        }

        .logo-image {
          border-radius: 10px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .login-header h1 {
          color: #333;
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
        }

        .login-header p {
          color: #666;
          margin: 0;
          font-size: 16px;
        }

        .login-form {
          text-align: left;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          color: #333;
          font-weight: 600;
          font-size: 14px;
        }

        .form-icon {
          margin-right: 8px;
          font-size: 16px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid rgba(225, 229, 233, 0.8);
          border-radius: 10px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: rgba(248, 249, 250, 0.9);
          backdrop-filter: blur(5px);
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          font-size: 14px;
        }

        .error-icon {
          margin-right: 8px;
        }

        .login-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .login-icon {
          margin-right: 8px;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .login-footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e1e5e9;
        }

        .login-footer p {
          color: #999;
          font-size: 12px;
          margin: 0;
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 30px 20px;
          }

          .login-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
