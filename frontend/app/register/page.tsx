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
    phone: '',
    password: '',
    password_confirmation: '',
    department: '',
    designation: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await register(formData);
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)', padding: '50px 0' }}>
      <div className="auth-container">
        <h2>রেজিস্টার</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>নাম</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="আপনার নাম লিখুন"
            />
          </div>
          
          <div className="form-group">
            <label>ইমেইল</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="আপনার ইমেইল লিখুন"
            />
          </div>
          
          <div className="form-group">
            <label>ফোন</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="আপনার ফোন নম্বর লিখুন"
            />
          </div>
          
          <div className="form-group">
            <label>বিভাগ</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="আপনার বিভাগ লিখুন"
            />
          </div>
          
          <div className="form-group">
            <label>পদবি</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="আপনার পদবি লিখুন"
            />
          </div>
          
          <div className="form-group">
            <label>পাসওয়ার্ড</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="পাসওয়ার্ড লিখুন"
            />
          </div>
          
          <div className="form-group">
            <label>কনফার্ম পাসওয়ার্ড</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
              placeholder="পাসওয়ার্ড আবার লিখুন"
            />
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
