import { BACKEND_DOMAIN } from '../api/config';
const authService = {
  // Đăng nhập admin
  async login(credentials) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Lưu token vào localStorage
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        return { success: true, data: data.user };
      } else {
        return {
          success: false,
          message: data.message || "Đăng nhập thất bại",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Lỗi kết nối server" };
    }
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("adminToken");
    return !!token;
  },

  // Lấy thông tin user
  getCurrentUser() {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("adminUser");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Lấy token
  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("adminToken");
  },

  // Verify token với server
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${BACKEND_DOMAIN}/api/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  },
};

export default authService;
