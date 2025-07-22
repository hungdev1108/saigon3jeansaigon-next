"use client";

import { useState } from "react";
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

interface ContactProps {
  contactInfo: ContactInfo | null;
}

export default function Contact({ contactInfo }: ContactProps) {
  const [form, setForm] = useState<ApplicationForm>({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

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

    setSubmitting(true);
    try {
      // Placeholder for the removed contactService
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
    } finally {
      setSubmitting(false);
    }
  };

  if (!contactInfo) {
    return (
      <div id="contactPage" className="py-5">
        <div className="container">
          <h2 className="section-title mt-5">CONTACT US</h2>
          <div className="text-center py-5">
            <h3 className="text-danger">Error loading contact information</h3>
            <p>Không thể tải dữ liệu liên hệ.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="contactPage" className="py-3">
        <div className="container">
          <h2 className="section-title mt-5 pt-5">CONTACT US</h2>
          <div className="contact-wrapper">
            <div className="contact-info">
              <div className="contact-details">
                {/* Contact info - Moved to top */}
              
                
                {/* Banner image - Moved below contact info */}
                {contactInfo?.bannerImage && (
                  <div className="contact-banner-wrapper">
                    {/* BACKEND_DOMAIN được sử dụng để hiển thị URL API */}
                    <div className="api-url" style={{display: 'none'}}>{`${BACKEND_DOMAIN}/api/contact/data`}</div>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.3933362245784!2d106.92286539678953!3d10.704114100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31751974e66285bb%3A0xb82adb6375242b08!2zU8OgaSBHw7JuIDM!5e0!3m2!1svi!2s!4v1751858584832!5m2!1svi!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 12 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Saigon 3 Jean Map"
                    ></iframe>
                  </div>
                )}

<div className="contact-info-container">
                  <div className="contact-item">
                    <div className="contact-icon small">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-text">{contactInfo?.address}</div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon small">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-text">{contactInfo?.email}</div>
                  </div>
                </div>
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
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span>
                          <span className="spinner-border spinner-border-sm" role="status" style={{marginRight: 8, verticalAlign: 'middle'}}></span>
                          Đang gửi...
                        </span>
                      ) : (
                        "SUBMIT FORM"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        #contactPage {
          padding-bottom: 0 !important;
        }
        .section-title {
          padding-top: 20px;
          margin-bottom: 30px;
        }
        .contact-wrapper {
          display: flex;
          flex-direction: row;
          gap: 20px;
          margin-bottom: 20px;
        }
        .contact-info {
          flex: 1;
        }
        .form-section {
          flex: 1;
        }
        .contact-info-container {
          margin-bottom: 15px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        .contact-banner-wrapper {
          width: 100%;
          height: 400px;
          margin-bottom: 10px;
        }
        .contact-icon.small {
          font-size: 1.1rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1e4f7a10;
          border-radius: 50%;
          color: #1e4f7a;
          margin-right: 10px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .contact-text {
          font-size: 1rem;
          color: #222;
        }
        .form-group textarea {
          height: 100px;
        }
        @media (max-width: 768px) {
          .contact-wrapper {
            flex-direction: column;
          }
          .contact-banner-wrapper {
            height: 300px;
          }
        }
      `}</style>
    </>
  );
}
