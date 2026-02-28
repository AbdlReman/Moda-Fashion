"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import SectionHeading from "../SectionHeading";

const ContactSection = ({ data, reverseOrder }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (submitStatus.type === 'success') {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error message when user starts typing
    if (submitStatus.type === 'error') {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your name' });
      return;
    }
    if (!formData.email.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your email' });
      return;
    }
    if (!formData.message.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your message' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: result.message || 'Your message has been sent successfully! We will get back to you soon.' 
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          phone: '',
          message: ''
        });
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.error || 'Failed to send message. Please try again.' 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row cs_gap_y_30">
          {reverseOrder ? (
            <>
              <div className="col-lg-6">
                <div className="cs_contact_thumbnail cs_pl-40">
                  <div className="cs_teeth_shape">
                  <Image src={data.teethShapeImg} className="cs_spinner_img" alt="img" width={167} height={143}   />
                  </div>
                  <div className="cs_contact_img">
                  <Image src={data.contactImg}  alt="img" width={319} height={497}   />
                  </div>
                  <div className="cs_contact_bg_shape">
                    <div className="cs_white_bg_shape" />
                    <div className={`cs_iconbox ${data.iconBox.style}`}>
                      <div className="cs_iconbox_icon cs_center">
                      <Image src={data.iconBox.icon}  alt="img" width={62} height={62}   />
                      </div>
                      <div className="cs_iconbox_right">
                        <h3 className="cs_iconbox_title">
                          {data.iconBox.title}
                        </h3>
                        <p className="cs_iconbox_subtitle mb-0">
                          {data.iconBox.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <SectionHeading
                  SectionSubtitle={data.sectionSubtitle}
                  SectionTitle={data.SectionTitle}
                />

                <div className="cs_height_25 cs_height_lg_25" />
                
                {/* Status Message */}
                {submitStatus.message && (
                  <div 
                    className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                    style={{
                      padding: '12px 20px',
                      marginBottom: '20px',
                      borderRadius: '4px',
                      backgroundColor: submitStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                      color: submitStatus.type === 'success' ? '#155724' : '#721c24',
                      border: `1px solid ${submitStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                      fontSize: '14px'
                    }}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <form className="cs_contact_form row cs_gap_y_30" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      className="cs_form_field"
                      placeholder="Your name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      className="cs_form_field"
                      placeholder="Your email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="subject"
                      className="cs_form_field"
                      placeholder="Your Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      name="phone"
                      className="cs_form_field"
                      placeholder="Your phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-lg-12">
                    <textarea
                      rows={5}
                      name="message"
                      className="cs_form_field"
                      placeholder="Your message *"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-lg-12">
                    <button
                      type="submit"
                      className="cs_btn cs_style_1 cs_color_1"
                      disabled={isSubmitting}
                      style={{
                        opacity: isSubmitting ? 0.7 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Request'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="col-lg-6">
                <SectionHeading
                  SectionSubtitle={data.sectionSubtitle}
                  SectionTitle={data.SectionTitle}
                />

                <div className="cs_height_25 cs_height_lg_25" />
                
                {/* Status Message */}
                {submitStatus.message && (
                  <div 
                    className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-danger'}`}
                    style={{
                      padding: '12px 20px',
                      marginBottom: '20px',
                      borderRadius: '4px',
                      backgroundColor: submitStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                      color: submitStatus.type === 'success' ? '#155724' : '#721c24',
                      border: `1px solid ${submitStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                      fontSize: '14px'
                    }}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <form className="cs_contact_form row cs_gap_y_30" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      className="cs_form_field"
                      placeholder="Your name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      className="cs_form_field"
                      placeholder="Your email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="subject"
                      className="cs_form_field"
                      placeholder="Your Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="tel"
                      name="phone"
                      className="cs_form_field"
                      placeholder="Your phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-lg-12">
                    <textarea
                      rows={5}
                      name="message"
                      className="cs_form_field"
                      placeholder="Your message *"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-lg-12">
                    <button
                      type="submit"
                      className="cs_btn cs_style_1 cs_color_1"
                      disabled={isSubmitting}
                      style={{
                        opacity: isSubmitting ? 0.7 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Request'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-lg-6">
                <div className="cs_contact_thumbnail cs_pl-40">
                  <div className="cs_teeth_shape">
                  <Image src={data.teethShapeImg} className="cs_spinner_img" alt="img" width={167} height={143}   />
                  </div>
                  <div className="cs_contact_img">
                  <Image src={data.contactImg}  alt="img" width={319} height={497}   />
                  </div>
                  <div className="cs_contact_bg_shape">
                    <div className="cs_white_bg_shape" />
                    <div className={`cs_iconbox ${data.iconBox.style}`}>
                      <div className="cs_iconbox_icon cs_center">
                      <Image src={data.iconBox.icon}  alt="img" width={62} height={62}   />
                      </div>
                      <div className="cs_iconbox_right">
                        <h3 className="cs_iconbox_title">
                          {data.iconBox.title}
                        </h3>
                        <p className="cs_iconbox_subtitle mb-0">
                          {data.iconBox.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactSection;
