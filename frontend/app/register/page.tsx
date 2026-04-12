'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cell_phone: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

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

    // Phone validation
    if (!formData.cell_phone.trim()) {
      newErrors.cell_phone = 'ফোন নম্বর আবশ্যক';
    } else if (!/^01[3-9]\d{8}$/.test(formData.cell_phone)) {
      newErrors.cell_phone = 'সঠিক বাংলাদেশি ফোন নম্বর দিন (০১XXXXXXXXX)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'পাসওয়ার্ড আবশ্যক';
    } else if (formData.password.length < 6) {
      newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'পাসওয়ার্ডে একটি অক্ষর এবং একটি সংখ্যা থাকতে হবে';
    }

    // Confirm password validation
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'পাসওয়ার্ড নিশ্চিত করুন';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'পাসওয়ার্ড মিলেনি';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await register(formData);
      toast.success('রেজিস্ট্রেশন সফল হয়েছে!');
      router.push('/dashboard');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error('অনুগ্রহ করে সঠিক তথ্য দিন');
      } else {
        toast.error(error.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
      }
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)', padding: '50px 0' }}>
      <div className="auth-container">
        <h2>রেজিস্টার</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>নাম *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle('name')}
              placeholder="আপনার নাম লিখুন"
            />
            {errors.name && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.name}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label>ইমেইল *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle('email')}
              placeholder="আপনার ইমেইল লিখুন"
            />
            {errors.email && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label>ফোন *</label>
            <input
              type="tel"
              name="cell_phone"
              value={formData.cell_phone}
              onChange={handleChange}
              style={inputStyle('cell_phone')}
              placeholder="০১XXXXXXXXX"
            />
            {errors.cell_phone && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.cell_phone}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label>পাসওয়ার্ড *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle('password')}
              placeholder="পাসওয়ার্ড লিখুন"
            />
            {errors.password && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.password}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label>কনফার্ম পাসওয়ার্ড *</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              style={inputStyle('password_confirmation')}
              placeholder="পাসওয়ার্ড আবার লিখুন"
            />
            {errors.password_confirmation && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.password_confirmation}
              </span>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'রেজিস্টার হচ্ছে...' : 'রেজিস্টার'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          ইতিমধ্যে অ্যাকাউন্ট আছে? <Link href="/login" style={{ color: 'var(--primary-orange)' }}>লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
}
