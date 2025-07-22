'use client';
import { useEffect, useState } from 'react';
import { BACKEND_DOMAIN } from '@/api/config';
import { FiTrash, FiCheck, FiEye, FiEyeOff, FiMessageCircle } from 'react-icons/fi';
import React from 'react';

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



export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSpam, setShowSpam] = useState(false);
  const [showMessage, setShowMessage] = useState<{ open: boolean, message: string, name: string } | null>(null);

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
      <h1 className="admin-page-title">Danh sách khách hàng liên hệ</h1>
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