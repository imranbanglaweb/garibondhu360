'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'নাম আবশ্যক';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'নাম কমপক্ষে ২ অক্ষরের হতে হবে';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'নামে শুধুমাত্র অক্ষর এবং ফাঁকা জায়গা থাকতে পারে';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'ইমেইল আবশ্যক';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'সঠিক ইমেইল ঠিকানা দিন';
    }

    // Phone validation (optional but if provided must be valid)
    if (formData.phone.trim()) {
      if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
        newErrors.phone = 'সঠিক বাংলাদেশি ফোন নম্বর দিন (০১XXXXXXXXX)';
      }
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'বিষয় আবশ্যক';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'বিষয় কমপক্ষে ৫ অক্ষরের হতে হবে';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'মেসেজ আবশ্যক';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'মেসেজ কমপক্ষে ১০ অক্ষরের হতে হবে';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('অনুগ্রহ করে সঠিক তথ্য দিন');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'মেসেজ সফলভাবে পাঠানো হয়েছে!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        if (data.errors) {
          setErrors(data.errors);
          toast.error('অনুগ্রহ করে সঠিক তথ্য দিন');
        } else {
          toast.error(data.message || 'মেসেজ পাঠাতে ব্যর্থ হয়েছে');
        }
      }
    } catch (error) {
      toast.error('কোনো সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName: string) => ({
    width: '100%',
    padding: '12px',
    border: `1px solid ${errors[fieldName] ? '#dc3545' : '#ddd'}`,
    borderRadius: '5px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  });

  return (
    <>
      <Header />
      
      <section className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1>আমাদের <span>সাথে যোগাযোগ</span></h1>
            <p className="hero-text">
              যেকোনো প্রশ্ন বা মতামতের জন্য আমাদের সাথে যোগাযোগ করুন।
            </p>
          </div>
        </div>
      </section>

      <section className="services" style={{ paddingBottom: '60px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="service-card">
            <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>ফর্ম পাঠান</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>নাম *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle('name')}
                  placeholder="আপনার নাম"
                />
                {errors.name && (
                  <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                    {errors.name}
                  </span>
                )}
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>ইমেইল *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle('email')}
                  placeholder="আপনার ইমেইল"
                />
                {errors.email && (
                  <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                    {errors.email}
                  </span>
                )}
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>ফোন (ঐচ্ছিক)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle('phone')}
                  placeholder="০১XXXXXXXXX"
                />
                {errors.phone && (
                  <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                    {errors.phone}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>বিষয় *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={inputStyle('subject')}
                  placeholder="আপনার মেসেজের বিষয়"
                />
                {errors.subject && (
                  <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                    {errors.subject}
                  </span>
                )}
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>মেসেজ *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  style={{
                    ...inputStyle('message'),
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  placeholder="আপনার মেসেজ লিখুন"
                />
                {errors.message && (
                  <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                    {errors.message}
                  </span>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'পাঠানো হচ্ছে...' : 'মেসেজ পাঠান'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
