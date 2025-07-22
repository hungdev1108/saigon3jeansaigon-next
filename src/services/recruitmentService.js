import { BACKEND_DOMAIN } from '../api/config';

class RecruitmentService {
  // ==================== JOBS ====================
  
  async getAllJobs(includeInactive = false) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/jobs?includeInactive=${includeInactive}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  async createJob(jobData) {
    try {
      console.log('Sending job creation request with data:', jobData);
      console.log('API endpoint:', `${BACKEND_DOMAIN}/api/careers/jobs`);
      
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      
      console.log('Job creation response status:', response.status);
      const data = await response.json();
      console.log('Job creation response data:', data);
      
      return data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  async updateJob(jobId, jobData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  async deleteJob(jobId) {
    try {
      console.log('Deleting job:', jobId);
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/jobs/${jobId}`, {
        method: 'DELETE',
      });
      console.log('Delete response status:', response.status);
      const data = await response.json();
      console.log('Delete response data:', data);
      return data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // ==================== APPLICATIONS ====================
  
  async getAllApplications() {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/applications`);
      const data = await response.json();
      console.log('Raw applications response:', data);
      
      // Handle nested structure: data.applications
      if (data.success && data.data && data.data.applications) {
        return {
          success: true,
          data: data.data.applications
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async updateApplicationStatus(applicationId, status) {
    try {
      console.log('Updating application status:', applicationId, status);
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      console.log('Update status response status:', response.status);
      const data = await response.json();
      console.log('Update status response data:', data);
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  async deleteApplication(applicationId) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/applications/${applicationId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }

  // ==================== COMPANY INFO ====================
  
  async getCompanyInfo() {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/company-info`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }
  }

  async updateCompanyInfo(companyData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/company-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  }

  // ==================== CONTACT HR ====================
  
  async getContactHR() {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/contact-hr`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contact HR:', error);
      throw error;
    }
  }

  async updateContactHR(contactData) {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/contact-hr`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating contact HR:', error);
      throw error;
    }
  }

  // ==================== FRONTEND SPECIFIC ====================
  
  async getCompleteRecruitmentData() {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/data`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching complete recruitment data:', error);
      throw error;
    }
  }

  async ApplyJob(jobId, fullName, email, phone, address, cvFile) {
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('cv', cvFile);

      const response = await fetch(`${BACKEND_DOMAIN}/api/careers/jobs/${jobId}/apply`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async load() {
    return this.getAllJobs();
  }

  async loadContactHr() {
    return this.getContactHR();
  }

  async loadCompanyInfo() {
    return this.getCompanyInfo();
  }
}

const recruitmentService = new RecruitmentService();
export default recruitmentService;