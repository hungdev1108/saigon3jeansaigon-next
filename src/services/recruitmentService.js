import recruitmentApi from '@/api/recruitmentApi';

class RecruitmentService {
    /**
     * Lấy và xử lý tất cả dữ liệu recruitment
     * @returns {Promise<Object>} Dữ liệu đã được xử lý
     */
    async getCompleteRecruitmentData() {
        try {
            const response = await recruitmentApi.getRecruitmentData();

            if (!response.success) {
                throw new Error("Failed to fetch recruitment data");
            }

            const { data } = response;

            return {
                jobs: this.processJobsData(data.jobs),
                pagination: data.pagination,
                companyInfo: this.processCompanyInfo(data.companyInfo),
                contactHR: this.processContactHR(data.contactHR),
            };
        } catch (error) {
            console.error('RecruitmentService - Error getting complete recruitment data:', error);
            // Fallback to individual API calls
            return this.getFallbackData();
        }
    }

    /**
     * Xử lý dữ liệu jobs
     * @param {Array} jobsData - Dữ liệu jobs từ API
     * @returns {Array} Dữ liệu jobs đã xử lý
     */
    processJobsData(jobsData) {
        if (!Array.isArray(jobsData)) return [];

        return jobsData.map((job) => ({
            _id: job.id || job._id || "",
            title: job.title || "",
            slug: job.slug || "",
            type: job.type || "",
            location: job.location || "",
            isFeatured: job.isFeatured || false,
            applicationCount: job.applicationCount || 0,
            createdAt: job.createdAt || new Date().toISOString(),
            description: job.description || "",
            requirements: job.requirements || [],
            benefits: job.benefits || [],
        }));
    }

    /**
     * Xử lý dữ liệu company info
     * @param {Object} companyData - Dữ liệu company từ API
     * @returns {Object} Dữ liệu company đã xử lý
     */
    processCompanyInfo(companyData) {
        if (!companyData) return this.getDefaultCompanyInfo();

        return {
            logo: companyData.logo || "/uploads/images/sg3jeans_logo.png",
            title: companyData.title || "ABOUT SAIGON 3 JEAN",
            description: Array.isArray(companyData.description) 
                ? companyData.description 
                : ["Join our team and be part of our success story."],
            stats: companyData.stats || this.getDefaultStats(),
            isActive: companyData.isActive !== false,
        };
    }

    /**
     * Xử lý dữ liệu contact HR
     * @param {Object} contactData - Dữ liệu contact HR từ API
     * @returns {Object} Dữ liệu contact HR đã xử lý
     */
    processContactHR(contactData) {
        if (!contactData) return this.getDefaultContactHR();

        return {
            title: contactData.title || "CONTACT HR DEPARTMENT",
            description: contactData.description || "Have questions about opportunities? Reach out – we're happy to help!",
            email: contactData.email || "recruitment@saigon3jean.com",
            phone: contactData.phone || "(+84) 28 3940 1234",
            submitResumeText: contactData.submitResumeText || "Submit Your Resume",
            isActive: contactData.isActive !== false,
        };
    }

    /**
     * Fallback data khi main API fail
     */
    async getFallbackData() {
        try {
            const [jobsResponse, companyResponse, contactResponse] = await Promise.allSettled([
                this.load(),
                this.loadCompanyInfo(),
                this.loadContactHr()
            ]);

            return {
                jobs: jobsResponse.status === 'fulfilled' ? jobsResponse.value.data || [] : [],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalJobs: 0,
                    hasNext: false,
                    hasPrev: false,
                },
                companyInfo: companyResponse.status === 'fulfilled' 
                    ? this.processCompanyInfo(companyResponse.value.data)
                    : this.getDefaultCompanyInfo(),
                contactHR: contactResponse.status === 'fulfilled'
                    ? this.processContactHR(contactResponse.value.data)
                    : this.getDefaultContactHR(),
            };
        } catch (error) {
            console.error('RecruitmentService - Error in fallback:', error);
            return {
                jobs: [],
                pagination: { currentPage: 1, totalPages: 1, totalJobs: 0 },
                companyInfo: this.getDefaultCompanyInfo(),
                contactHR: this.getDefaultContactHR(),
            };
        }
    }

    async load() {
        try {
            return await recruitmentApi.load();
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    }

    async loadContactHr() {
        try {
            return await recruitmentApi.loadContactHr();
        } catch (error) {
            console.error('Error fetching contact-hr:', error);
            throw error;
        }
    }

    async loadCompanyInfo() {
        try {
            return await recruitmentApi.loadCompanyInfo();
        } catch (error) {
            console.error('Error fetching company-info:', error);
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

            return await recruitmentApi.ApplyJob(jobId, formData);

        } catch (error) {
            console.error('Error Apply jobs:', error);
            throw error;
        }
    }

    // Default data methods
    getDefaultCompanyInfo() {
        return {
            logo: "/uploads/images/sg3jeans_logo.png",
            title: "ABOUT SAIGON 3 JEAN",
            description: [
                "Saigon 3 Jean was established with a vision of sustainable development, harnessing internal strengths and advanced technologies to adapt flexibly to economic fluctuations.",
                "As an industry-leading garment-finishing company, we constantly innovate, improve quality, and optimize technology for sustainable production.",
                "We believe people are the heart of our success, so we invest heavily in up-skilling and creating a green, friendly work environment."
            ],
            stats: this.getDefaultStats(),
            isActive: true,
        };
    }

    getDefaultStats() {
        return {
            employees: {
                number: "1,500+",
                label: "Employees"
            },
            experience: {
                number: "20+",
                label: "Years Experience"
            },
            partners: {
                number: "100+",
                label: "Global Partners"
            }
        };
    }

    getDefaultContactHR() {
        return {
            title: "CONTACT HR DEPARTMENT",
            description: "Have questions about opportunities at Saigon 3 Jean? Reach out – we're happy to help!",
            email: "recruitment@saigon3jean.com",
            phone: "(+84) 28 3940 1234",
            submitResumeText: "Submit Your Resume",
            isActive: true,
        };
    }
};

const recruitmentService = new RecruitmentService();
export default recruitmentService;