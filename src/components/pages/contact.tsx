"use client";

import contactService from "@/services/contactService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BACKEND_DOMAIN } from "@/api/config";

interface ContactInfo {
  id: string;
  bannerImage: string;
  address: string;
  email: string;
  phone: string;
  workingHours: string;
  mapEmbedUrl: string;
  socialLinks: {
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram?: string;
    youtube?: string;
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ApplicationForm>({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        
        // Thử new API format trước
        try {
          const completeData = await contactService.getCompleteContactData();
          const typedData = completeData as { contactInfo: ContactInfo };
          if (typedData && typedData.contactInfo) {
            setContactInfo(typedData.contactInfo);
            setError(null);
            return;
          }
        } catch {
          console.log("New API not available, falling back to legacy API");
        }

        // Fallback to legacy API
        const res = await contactService.LoadContactInfo();
        if (res.success && res.data) {
          const processedData = {
            id: res.data._id || "",
            bannerImage: res.data.bannerImage || "",
            address: res.data.address || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            workingHours: res.data.workingHours || "",
            mapEmbedUrl: res.data.mapEmbedUrl || "",
            socialLinks: res.data.socialLinks || {},
            isActive: res.data.isActive !== false,
            createdAt: res.data.createdAt || "",
            updatedAt: res.data.updatedAt || "",
          };
          setContactInfo(processedData);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Failed to load contact information:", error);
        setError("Failed to load contact information");
        // Sử dụng dữ liệu mặc định khi có lỗi
        const defaultData = contactService.getDefaultContactInfo();
        setContactInfo(defaultData);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive validation
    if (!form.name.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }
    if (!form.company.trim()) {
      toast.error("Company name is required.");
      return;
    }

    if (!form.subject.trim()) {
      toast.error("Subject is required.");
      return;
    }

    if (!form.message.trim()) {
      toast.error("Message is required.");
      return;
    }

    try {
      await contactService.createSubmission(
        form.name,
        form.company,
        form.email,
        form.phone,
        form.subject,
        form.message
      );
      toast.success(
        "Thank you! We have received your request and will respond as soon as possible."
      );

      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error(
        "Please check the information again. If the problem persists, please contact us via email or phone."
      );
    }
  };

  if (loading) {
    return (
      <div id="contactPage" className="py-5">
        <div className="container">
          <h2 className="section-title mt-5">CONTACT US</h2>
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading contact information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !contactInfo) {
    return (
      <div id="contactPage" className="py-5">
        <div className="container">
          <h2 className="section-title mt-5">CONTACT US</h2>
          <div className="text-center py-5">
            <h3 className="text-danger">Error loading contact information</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="contactPage" className="py-5">
        <div className="container">
          <h2 className="section-title mt-5">CONTACT US</h2>
          <div className="contact-wrapper">
            <div className="contact-info">
              <div className="contact-details">
                <div className="contact-item">
                  {contactInfo?.bannerImage && (
                    <Image
                      src={`${BACKEND_DOMAIN}${contactInfo.bannerImage}`}
                      alt="Saigon 3 Jean Building"
                      className="contact-banner"
                      width={500}
                      height={300}
                      objectFit="cover"
                    />
                  )}
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-text">{contactInfo?.address}</div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-text">{contactInfo?.email}</div>
                </div>
                {/* <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-text">{contactInfo?.phone}</div>
                </div> */}
                {/* {contactInfo?.workingHours && (
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="contact-text">{contactInfo.workingHours}</div>
                  </div>
                )} */}
                {/* {contactInfo?.socialLinks && (
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-share-alt"></i>
                    </div>
                    <div className="contact-text">
                      <div className="social-links">
                        {contactInfo.socialLinks.facebook && (
                          <a 
                            href={contactInfo.socialLinks.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="me-2"
                          >
                            <i className="fab fa-facebook"></i>
                          </a>
                        )}
                        {contactInfo.socialLinks.linkedin && (
                          <a 
                            href={contactInfo.socialLinks.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="me-2"
                          >
                            <i className="fab fa-linkedin"></i>
                          </a>
                        )}
                        {contactInfo.socialLinks.twitter && (
                          <a 
                            href={contactInfo.socialLinks.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="me-2"
                          >
                            <i className="fab fa-twitter"></i>
                          </a>
                        )}
                        {contactInfo.socialLinks.instagram && (
                          <a 
                            href={contactInfo.socialLinks.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="me-2"
                          >
                            <i className="fab fa-instagram"></i>
                          </a>
                        )}
                        {contactInfo.socialLinks.youtube && (
                          <a 
                            href={contactInfo.socialLinks.youtube} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-youtube"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            <div className="form-section">
              <div className="form-container">
                <form id="contactForm">
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name*"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      placeholder="Company name*"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email*"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Phone*"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Subject*"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Message*"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      required
                    ></textarea>
                  </div>

                  <div className="button-group">
                    <button
                      type="submit"
                      className="submit-btn"
                      onClick={handleSubmit}
                    >
                      SUBMIT FORM
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
