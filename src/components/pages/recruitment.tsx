"use client";

import { useEffect, useState, useRef } from "react";
import recruitmentService from "@/services/recruitmentService";
import { FormatTime } from "@/shared/format_time";
import { toast } from "react-toastify";
import Image from "next/image";


  interface Job {
    _id: string;
    title: string;
    createdAt: string;
    type: string;
    location: string;
    description: string;
    requirements: string[];
    benefits: string[];
    slug?: string;
    isFeatured?: boolean;
    applicationCount?: number;
    isActive?: boolean;
  }

  interface ApplicationForm {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  }

  interface ContactHr {
    title: string;
    description: string;
    email: string;
    phone: string;
    submitResumeText: string;
    isActive: boolean;
  }

  interface ContactInfo {
    logo: string;
    title: string;
    description: string[];
    stats: Stats;
    isActive: boolean;
  }

  interface Stats {
    [key: string]: {
      number: string;
      label: string;
    };
  }

interface RecruitmentProps {
  jobs: Job[];
  contactHr: ContactHr | null;
  contactInfo: ContactInfo | null;
}

export default function Recruitment({ jobs, contactHr, contactInfo }: RecruitmentProps) {
  // Không dùng SWR, chỉ nhận data từ props
  // Component logic with proper types - Hooks phải được gọi trước bất kỳ return nào
  const jobsPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>({
    _id: "",
    title: "",
    createdAt: "",
    type: "",
    location: "",
    description: "",
    requirements: [],
    benefits: [],
  });
  const [showJobDetails, setShowJobDetails] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [form, setForm] = useState<ApplicationForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useEffect phải được gọi trước bất kỳ return nào
  useEffect(() => {
    const recruitmentContent = document.querySelector(".recruitment-content");
    const body = document.body;

    if (showModal) {
      if (recruitmentContent) {
        recruitmentContent.classList.add("modal-open");
      }
      body.classList.add("modal-open");

      const scrollY = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";
    } else {
      if (recruitmentContent) {
        recruitmentContent.classList.remove("modal-open");
      }
      body.classList.remove("modal-open");

      const scrollY = body.style.top;
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      if (recruitmentContent) {
        recruitmentContent.classList.remove("modal-open");
      }
      body.classList.remove("modal-open");
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
    };
  }, [showModal]);

  // Error handling giống Home page
  if (!jobs.length) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Use SWR data if available, otherwise fall back to props
  const currentJobs = jobs || [];
  const currentContactHr = contactHr;
  const currentContactInfo = contactInfo;

  // Add loading state
  if (!jobs.length) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil((currentJobs?.length || 0) / jobsPerPage);

  // Pagination logic
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const pageJobs = Array.isArray(currentJobs) ? currentJobs.slice(startIndex, endIndex) : [];
  console.log('pageJobs:', pageJobs);

  // Handlers with proper typing
  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleBackToList = () => {
    setShowJobDetails(false);
    setSelectedJob(null);
  };

  const handleApplyClick = () => {
    setShowModal(true);
    setForm({ fullName: "", email: "", phone: "", address: "" });
    setCvFile(null);
    setFormError("");
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFormError("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("File size must be less than 5MB.");
      return;
    }

    setCvFile(file);
    setFormError("");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Reset previous errors
    setFormError("");

    // Comprehensive validation
    if (!form.fullName.trim()) {
      setFormError("Full name is required.");
      toast.error("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      setFormError("Email is required.");
      toast.error("Email is required.");
      return;
    }

    if (!validateEmail(form.email)) {
      setFormError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!form.phone.trim()) {
      setFormError("Phone number is required.");
      toast.error("Phone number is required.");
      return;
    }

    if (!validatePhone(form.phone)) {
      setFormError("Please enter a valid phone number.");
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (!cvFile) {
      setFormError("Please upload your CV.");
      toast.error("Please upload your CV.");
      return;
    }

    setIsSubmitting(true);

    try {
      await recruitmentService.ApplyJob(
        selectedJob?._id,
        form.fullName,
        form.email,
        form.phone,
        form.address,
        cvFile
      );
      toast.success("Application submitted successfully!");
      setShowModal(false);

      // Reset form
      setForm({ fullName: "", email: "", phone: "", address: "" });
      setCvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setFormError("Failed to submit application. Please try again.");
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      setShowModal(false);
      setFormError("");
    }
  };

  return (
    <>
      <section className="recruitment-content py-5">
        <div className="container">
          <h2 className="section-title mt-5">CAREERS</h2>
          <div className="row">
            {/* Job List */}
            <div className="col-lg-5 col-md-6 mb-4">
              <div className="job-list-card">
                <div className="card h-100">
                  <div className="card-header blue-bg text-white">
                    <h3 className="mb-0">
                      <i className="fas fa-briefcase me-2"></i>OPEN POSITIONS
                    </h3>
                    <small className="opacity-75">
                      {currentJobs?.length || 0} jobs found
                    </small>
                  </div>
                  <div className="card-body p-0">
                    <div className="job-list-container">
                      {pageJobs.map((job) => (
                        <div
                          className="job-item"
                          onClick={() => handleJobClick(job)}
                          key={job._id}
                          style={{ cursor: "pointer" }}
                        >
                          <h5>{job.title}</h5>
                          <div className="job-meta">
                            <span>
                              <i className="fas fa-clock me-1"></i>Posted{" "}
                              {FormatTime.getRelativeTime(
                                job.createdAt,
                                "en-US"
                              )}
                            </span>
                            <span>
                              <i className="fas fa-briefcase me-1"></i>
                              {job.type}
                            </span>
                          </div>
                          <div className="job-location">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {job.location}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Pagination */}
                    <div className="pagination-container">
                      <nav aria-label="Job pagination">
                        <ul className="pagination justify-content-center mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <i className="fas fa-chevron-left"></i>
                            </button>
                          </li>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <li
                              key={i + 1}
                              className={`page-item ${
                                currentPage === i + 1 ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <i className="fas fa-chevron-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                      <div className="pagination-info text-center">
                        <small className="text-muted">
                          {startIndex + 1} - {Math.min(endIndex, currentJobs?.length || 0)}{" "}
                          of {currentJobs?.length || 0} jobs
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Company Info / Job Details */}
            <div className="col-lg-7 col-md-6">
              {!showJobDetails ? (
                // Company Info
                (<div className="company-info-card">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <Image
                        src="/images/sg3jeans_logo.png"
                        alt="Saigon 3 Jean Logo"
                        className="company-logo mb-4"
                        width={160}
                        height={80}
                        style={{ objectFit: 'contain', width: 'auto', height: '80px', maxHeight: '80px' }}
                      />
                      <div className="company-description">
                        {currentContactInfo?.description.map((desc: string, index: number) => (
                          <p key={index} className="text-muted">
                            {desc}
                          </p>
                        ))}
                      </div>
                      <div className="company-stats mt-4">
                        <div className="row">
                          {contactInfo?.stats && Object.entries(contactInfo.stats).slice(0, 6).map(([key, stat]) => {
                            const statsCount = Object.keys(contactInfo.stats).length;
                            const colSize = statsCount <= 3 ? 4 : statsCount <= 4 ? 3 : 2;
                            return (
                            <div key={key} className={`col-lg-${colSize} col-md-6 col-12 mb-3`}>
                              <div className="stat-item">
                                <h5 className="stat-number">{stat.number}</h5>
                                <small className="text-muted">{stat.label}</small>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)
              ) : (
                // Job Details
                (selectedJob && (<div className="job-details-card">
                  <div className="card h-100">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h4 className="job-title mb-2">
                            {selectedJob.title}
                          </h4>
                          <div className="job-meta">
                            <span className="badge me-2">
                              {selectedJob.type}
                            </span>
                            <small className="text-muted">
                              Posted{" "}
                              {FormatTime.getRelativeTime(
                                selectedJob.createdAt,
                                "en-US"
                              )}
                            </small>
                          </div>
                        </div>
                        <div className="job-actions">
                          <button
                            className="btn btn-outline-secondary btn-sm me-2"
                            onClick={handleBackToList}
                          >
                            <i className="fas fa-arrow-left"></i> Back
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={handleApplyClick}
                          >
                            <i className="fas fa-paper-plane me-1"></i> Apply
                            Now
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="job-location mb-4">
                        <h6>
                          <i className="fas fa-map-marker-alt me-2"></i>Work
                          Location
                        </h6>
                        <p className="mb-0">{selectedJob.location}</p>
                      </div>
                      <div className="job-description">
                        <h6>
                          <i className="fas fa-file-alt me-2"></i>
                          Job Description
                        </h6>
                        <div>
                          <p>{selectedJob.description}</p>
                        </div>
                      </div>
                      <div className="job-requirements mt-4">
                        <h6>
                          <i className="fas fa-list-check me-2"></i>
                          Requirements
                        </h6>
                        <ul>
                          {selectedJob.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="job-benefits mt-4">
                        <h6>
                          <i className="fas fa-gift me-2"></i>Benefits
                        </h6>
                        <ul>
                          {selectedJob.benefits.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>))
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Modal */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0)",
              zIndex: 1040,
            }}
            onClick={handleModalClose}
          ></div>

          {/* Modal Dialog */}
          <div
            className="modal fade show"
            id="applicationModal"
            tabIndex={-1}
            aria-labelledby="applicationModalLabel"
            aria-hidden="true"
            role="dialog"
            style={{
              display: "block",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1050,
              overflow: "auto",
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="applicationModalLabel">
                    <i className="fas fa-paper-plane me-2"></i>Job Application
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="job-info-display mb-4">
                      <h6 className="mb-2" style={{ color: "rgb(33 77 136)" }}>
                        Applying for:
                      </h6>
                      <div className="selected-job-info">
                        <span className="job-title-display fw-bold">
                          {selectedJob?.title}
                        </span>
                        <span className="job-location-display">
                          {selectedJob?.location}
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 mb-4">
                        <div className="personal-info-section">
                          <h6 className="mb-3 fw-bold">Personal Information</h6>
                          <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">
                              Name *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="fullName"
                              name="fullName"
                              value={form.fullName}
                              onChange={handleFormChange}
                              disabled={isSubmitting}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                              Email *
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              value={form.email}
                              onChange={handleFormChange}
                              disabled={isSubmitting}
                              placeholder="Enter your email address"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              className="form-control"
                              id="phone"
                              name="phone"
                              value={form.phone}
                              onChange={handleFormChange}
                              disabled={isSubmitting}
                              placeholder="Enter your phone number"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                              Address
                            </label>
                            <textarea
                              className="form-control"
                              id="address"
                              name="address"
                              rows={2}
                              value={form.address}
                              onChange={handleFormChange}
                              placeholder="Enter your address"
                              disabled={isSubmitting}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="cv-upload-section">
                          <h6 className="mb-3 fw-bold">
                            Upload Your CV/Resume *
                          </h6>
                          <div className="cv-upload-area" id="cvUploadArea">
                            {!cvFile && (
                              <div className="upload-content">
                                <div className="upload-icon">
                                  <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <p className="upload-text">
                                  Drag and Drop file
                                </p>
                                <p className="upload-or">or</p>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  id="chooseFileBtn"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={isSubmitting}
                                >
                                  CHOOSE FILE
                                </button>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  style={{ display: "none" }}
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  disabled={isSubmitting}
                                />
                              </div>
                            )}
                            {cvFile && (
                              <div className="file-info" id="fileInfo">
                                <div className="file-details">
                                  <i className="fas fa-file-pdf file-icon"></i>
                                  <div className="file-text">
                                    <span className="file-name" id="fileName">
                                      {cvFile.name}
                                    </span>
                                    <span className="file-size" id="fileSize">
                                      {(cvFile.size / 1024 / 1024).toFixed(2)}{" "}
                                      MB
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    id="removeFileBtn"
                                    onClick={() => {
                                      setCvFile(null);
                                      if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                      }
                                    }}
                                    disabled={isSubmitting}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <small className="text-muted d-block mt-2">
                            Supported formats: PDF, DOC, DOCX (Max 5MB)
                          </small>
                        </div>
                      </div>
                    </div>
                    {formError && (
                      <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {formError}
                      </div>
                    )}
                  </form>
                </div>
                <div className="modal-footer flex-wrap justify-content-center">
                  <button
                    type="submit"
                    id="submitApplicationBtn"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-1"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-1"></i>
                        SUBMIT APPLICATION
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <section className="contact-hr py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-12 text-center">
              <h3 className="mb-4">{currentContactHr?.title}</h3>
              <p className="text-muted mb-4">{currentContactHr?.description}</p>
              <div className="row justify-content-center">
                <div className="col-md-6 col-sm-6 mb-3">
                  <div className="contact-info">
                    <i
                      className="fas fa-envelope"
                      style={{ color: "#205b8e" }}
                    ></i>
                    <span>{currentContactHr?.email}</span>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 mb-3">
                  <div className="contact-info">
                    <i
                      className="fas fa-phone"
                      style={{ color: "#205b8e" }}
                    ></i>
                    <span>{currentContactHr?.phone}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <a href="#" className="btn btn-primary btn-lg">
                  <i className="fas fa-paper-plane me-2"></i>
                  {currentContactHr?.submitResumeText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
