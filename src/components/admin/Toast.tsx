import React, { useEffect } from "react";

interface ToastProps {
  open: boolean;
  type?: "success" | "error";
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ open, type = "success", message, onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={`toast ${type}`}>{message}
      <button className="toast-close" onClick={onClose} aria-label="Đóng">×</button>
      <style jsx>{`
        .toast {
          position: fixed;
          top: 32px;
          right: 32px;
          min-width: 220px;
          max-width: 90vw;
          padding: 16px 32px 16px 20px;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          z-index: 2000;
          display: flex;
          align-items: center;
          animation: toastIn 0.2s;
        }
        .toast.success { background: #2ecc40; }
        .toast.error { background: #e74c3c; }
        .toast-close {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          margin-left: 16px;
          cursor: pointer;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default Toast; 