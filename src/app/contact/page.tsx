"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { ContactService } from '@/services/contact.service';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
export default function ContactPage() {
    const [contactInfo, setcontactInfo] = useState<contactInfo | null>(null);
    const [form, setForm] = useState<ApplicationForm>({ 
        name: "",
        email: "",
        phone: "",
        company:"",
        subject:"",
        message:""
    });
    
    interface contactInfo {
        bannerImage: string,
        address: string,
        email: string,
        phone: string,
        workingHours: string,
        mapEmbedUrl: string,
        socialLinks: object
    }

    interface ApplicationForm {
        name: string;
        email: string;
        phone: string;
        company: string;
        subject: string;
        message: string;
    }


    useEffect(() => {
        ContactService.LoadContactInfo().then((res) => {
            setcontactInfo(res.data);
        }).catch((error) => {
            console.error("Failed to load contact information:", error);
        });
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
            await ContactService.createSubmission(form.name, form.company, form.email, form.phone, form.subject, form.message);
            toast.success("Thank you! We have received your request and will respond as soon as possible.");
            
            // Reset form
            setForm({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
        } catch (error) {
            toast.error("Please check the information again. If the problem persists, please contact us via email or phone.");
        }
    };

    return (
        <>
            <Header/>
            <div id="contactPage" className="py-5">
                <div className="container">
                    <h2 className="section-title mt-5">CONTACT US</h2>
                    <div className="contact-wrapper">
                        <div className="contact-info">
                            <div className="contact-details">
                                <div className="contact-item">
                                    <img
                                        src={contactInfo?.bannerImage}
                                        alt="Saigon 3 Jean Building"
                                        className="contact-banner"
                                    />
                                </div>
                                <div className="contact-item">
                                    <div className="contact-icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="contact-text">
                                        {contactInfo?.address}
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-icon">
                                    <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="contact-text">{contactInfo?.email}</div>
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
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
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
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <textarea
                                            id="message"
                                            name="message"
                                            placeholder="Message*"
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="button-group">
                                        <button type="submit" className="submit-btn" onClick={handleSubmit}>SUBMIT FORM</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}