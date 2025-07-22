import { BACKEND_DOMAIN } from '../api/config';


class CareersAdminService {
  getAuthHeaders(contentType = "application/json") {
    const headers = {};
    if (contentType) headers["Content-Type"] = contentType;
    return headers;
  }

  async _apiCall(endpoint, method = "GET", body = null, contentType = "application/json") {
    const options = {
      method,
      headers: this.getAuthHeaders(contentType),
    };
    if (body) {
      options.body = contentType === 'application/json' ? JSON.stringify(body) : body;
    }

    try {
      const response = await fetch(`${BACKEND_DOMAIN}${endpoint}`, options);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `${method} request failed`);
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // ==================== COMPANY INFO ====================
  getCompanyInfo() {
    return this._apiCall('/api/careers/admin/company-info');
  }

  updateCompanyInfo(data) {
    return this._apiCall('/api/careers/admin/company-info', 'PUT', data);
  }

  // ==================== CONTACT HR ====================
  getContactHR() {
    return this._apiCall('/api/careers/admin/contact-hr');
  }
  
  updateContactHR(data) {
    return this._apiCall('/api/careers/admin/contact-hr', 'PUT', data);
  }

  // ==================== JOBS ====================
  getAllJobs(includeInactive = true) {
    return this._apiCall(`/api/careers/admin/jobs?includeInactive=${includeInactive}`);
  }

  getJobById(jobId) {
    return this._apiCall(`/api/careers/admin/jobs/${jobId}`);
  }

  createJob(jobData) {
    return this._apiCall('/api/careers/admin/jobs', 'POST', jobData);
  }

  updateJob(jobId, jobData) {
    return this._apiCall(`/api/careers/admin/jobs/${jobId}`, 'PUT', jobData);
  }

  deleteJob(jobId) {
    return this._apiCall(`/api/careers/admin/jobs/${jobId}`, 'DELETE');
  }

  toggleJobStatus(jobId) {
      return this._apiCall(`/api/careers/admin/jobs/${jobId}/toggle-status`, 'PATCH');
  }

  // ==================== APPLICATIONS ====================
  getApplicationsByJob(jobId) {
    return this._apiCall(`/api/careers/admin/jobs/${jobId}/applications`);
  }

  getApplicationById(appId) {
    return this._apiCall(`/api/careers/admin/applications/${appId}`);
  }

  updateApplicationStatus(appId, status) {
    return this._apiCall(`/api/careers/admin/applications/${appId}/status`, 'PATCH', { status });
  }

  deleteApplication(appId) {
      return this._apiCall(`/api/careers/admin/applications/${appId}`, 'DELETE');
  }
}

const careersAdminService = new CareersAdminService();
export default careersAdminService; 