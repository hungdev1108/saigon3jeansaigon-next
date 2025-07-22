'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import recruitmentService from '@/services/recruitmentService';
import { FiArrowLeft, FiEye, FiMail, FiPhone, FiMapPin, FiCalendar, FiBriefcase, FiUsers, FiTrash } from 'react-icons/fi';

interface Job {
  _id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  createdAt: string;
  applicationCount?: number;
}

interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  cvFile: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchJobData = async () => {
    setLoading(true);
    try {
      // Fetch job details - get all jobs including inactive ones
      const jobData = await recruitmentService.getAllJobs(true);
      if (jobData.success) {
        const foundJob = jobData.data.find((j: Job) => j._id === jobId);
        if (foundJob) {
          setJob(foundJob);
        } else {
          alert('Không tìm thấy job!');
          router.push('/admin/recruitment');
          return;
        }
      }

      // Fetch applications for this job
      const appsData = await recruitmentService.getAllApplications();
      if (appsData.success) {
        const jobApplications = appsData.data.filter((app: Application) => app.jobId === jobId);
        setApplications(jobApplications);
      }
    } catch (err) {
      console.error('Error fetching job data:', err);
      alert('Có lỗi xảy ra khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const data = await recruitmentService.updateApplicationStatus(appId, status);
      if (data.success) {
        fetchJobData();
        alert('Cập nhật trạng thái thành công!');
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (err) {
      void err; // Explicitly ignore the error
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đơn ứng tuyển này?')) return;
    
    try {
      const data = await recruitmentService.deleteApplication(appId);
      if (data.success) {
        fetchJobData();
        alert('Xóa đơn ứng tuyển thành công!');
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (err) {
      void err; // Explicitly ignore the error
      alert('Có lỗi xảy ra!');
    }
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ xem xét', class: 'pending' },
      reviewed: { label: 'Đã xem xét', class: 'reviewed' },
      accepted: { label: 'Chấp nhận', class: 'accepted' },
      rejected: { label: 'Từ chối', class: 'rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="admin-page-container">Đang tải...</div>;
  }

  if (!job) {
    return <div className="admin-page-container">Không tìm thấy job!</div>;
  }

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <button onClick={() => router.push('/admin/recruitment')} className="back-btn">
          <FiArrowLeft /> Quay lại
        </button>
        <h1 className="admin-page-title">Chi tiết vị trí: {job.title}</h1>
      </div>

      {/* Job Info Card */}
      <div className="job-info-card">
        <div className="job-header">
          <h2>{job.title}</h2>
          <span className={`status-badge ${job.isActive ? 'active' : 'inactive'}`}>
            {job.isActive ? 'Đang tuyển' : 'Đã đóng'}
          </span>
        </div>
        
        <div className="job-meta">
          <div className="meta-item">
            <FiBriefcase />
            <span>{job.type}</span>
          </div>
          <div className="meta-item">
            <FiMapPin />
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <FiCalendar />
            <span>Đăng ngày: {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="meta-item">
            <FiUsers />
            <span>{applications.length} ứng viên</span>
          </div>
        </div>

        <div className="job-description">
          <h4>Mô tả công việc:</h4>
          <p>{job.description}</p>
        </div>

        {job.requirements.length > 0 && (
          <div className="job-section">
            <h4>Yêu cầu:</h4>
            <ul>
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits.length > 0 && (
          <div className="job-section">
            <h4>Phúc lợi:</h4>
            <ul>
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Applications Section */}
      <div className="applications-section">
        <div className="section-header">
          <h3>Danh sách ứng viên ({applications.length})</h3>
          <div className="filters">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xem xét</option>
              <option value="reviewed">Đã xem xét</option>
              <option value="accepted">Chấp nhận</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="no-applications">
            <p>Chưa có ứng viên nào ứng tuyển cho vị trí này.</p>
          </div>
        ) : (
          <div className="applications-grid">
            {filteredApplications.map(app => (
              <div key={app._id} className="application-card">
                <div className="app-header">
                  <h4>{app.fullName}</h4>
                  {getStatusBadge(app.status)}
                </div>
                
                <div className="app-info">
                  <div className="info-item">
                    <FiMail />
                    <span>{app.email}</span>
                  </div>
                  <div className="info-item">
                    <FiPhone />
                    <span>{app.phone}</span>
                  </div>
                  {app.address && (
                    <div className="info-item">
                      <FiMapPin />
                      <span>{app.address}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <FiCalendar />
                    <span>Nộp: {new Date(app.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className="app-actions">
                  <select 
                    value={app.status} 
                    onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Chờ xem xét</option>
                    <option value="reviewed">Đã xem xét</option>
                    <option value="accepted">Chấp nhận</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                  
                  <a 
                    href={`/api/careers/applications/${app._id}/cv`} 
                    target="_blank" 
                    className="action-btn view"
                  >
                    <FiEye /> Xem CV
                  </a>
                  
                  <button 
                    onClick={() => handleDeleteApplication(app._id)}
                    className="action-btn delete"
                  >
                    <FiTrash /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-page-container {
          padding: 32px 0;
          max-width: 1200px;
          margin: 0 auto;
        }
        .admin-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .back-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
        }
        .admin-page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e4f7a;
          margin: 0;
        }
        .job-info-card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .job-header h2 {
          margin: 0;
          color: #1e4f7a;
          font-size: 1.5rem;
        }
        .job-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 0.9rem;
        }
        .job-description {
          margin-bottom: 20px;
        }
        .job-description h4 {
          color: #333;
          margin-bottom: 8px;
        }
        .job-section {
          margin-bottom: 16px;
        }
        .job-section h4 {
          color: #333;
          margin-bottom: 8px;
        }
        .job-section ul {
          margin: 0;
          padding-left: 20px;
        }
        .job-section li {
          margin-bottom: 4px;
          color: #666;
        }
        .applications-section {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .section-header h3 {
          margin: 0;
          color: #1e4f7a;
        }
        .status-filter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        .no-applications {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }
        .application-card {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 16px;
          background: #fafafa;
        }
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .app-header h4 {
          margin: 0;
          color: #333;
          font-size: 1.1rem;
        }
        .app-info {
          margin-bottom: 16px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 0.9rem;
          color: #666;
        }
        .app-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .status-select {
          padding: 6px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
        }
        .action-btn.view {
          background: #007bff;
          color: #fff;
        }
        .action-btn.delete {
          background: #dc3545;
          color: #fff;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }
        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }
        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }
        .status-badge.reviewed {
          background: #cce5ff;
          color: #004085;
        }
        .status-badge.accepted {
          background: #d4edda;
          color: #155724;
        }
        .status-badge.rejected {
          background: #f8d7da;
          color: #721c24;
        }
        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .job-meta {
            grid-template-columns: 1fr;
          }
          .applications-grid {
            grid-template-columns: 1fr;
          }
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
} 