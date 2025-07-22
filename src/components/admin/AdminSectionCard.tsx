import React from "react";

interface AdminSectionCardProps {
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

const AdminSectionCard: React.FC<AdminSectionCardProps> = ({ title, children, onSave, isSaving, hasChanges }) => (
  <div className="admin-section-card">
    <div className="card-header">
      <h3 className="card-title">{title}</h3>
      {onSave && (
        <button onClick={onSave} className="btn-save" disabled={isSaving || !hasChanges}>
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      )}
    </div>
    <div className="card-content">{children}</div>
    <style jsx>{`
      .admin-section-card {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        margin-bottom: 32px;
        padding: 24px 28px 20px 28px;
      }
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
      }
      .card-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
      }
      .btn-save {
        background: #2ecc40;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 8px 18px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-save:disabled {
        background: #b5e7c4;
        cursor: not-allowed;
      }
      .card-content {
        margin-top: 8px;
      }
    `}</style>
  </div>
);

export default AdminSectionCard; 