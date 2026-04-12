'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>লোড হচ্ছে...</p>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'ইমেইল আবশ্যক';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'সঠিক ইমেইল ঠিকানা দিন';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'পাসওয়ার্ড আবশ্যক';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('অনুগ্রহ করে সঠিক তথ্য দিন');
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      await login(email, password);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('টোকেন সংরক্ষণ হয়নি');
        setLoading(false);
        return;
      }
      
      toast.success('লগইন সফল হয়েছে!');
      router.push('/dashboard');
    } catch (error: any) {
      if (!error.response) {
        setErrors({ email: 'সার্ভারে সংযোগ করতে ব্যর্থ। অনুগ্রহ পরে চেষ্টা করুন।' });
      } else if (error.response?.status === 401) {
        setErrors({ email: 'ইমেইল বা পাসওয়ার্ড সঠিক নয়' });
        toast.error('ইমেইল বা পাসওয়ার্ড সঠিক নয়');
      } else {
        toast.error(error.response?.data?.message || 'লগইন ব্যর্থ হয়েছে');
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)' }}>
      <div className="auth-container">
        <h2>লগইন</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ইমেইল *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
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
            <label>পাসওয়ার্ড *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              style={inputStyle('password')}
              placeholder="আপনার পাসওয়ার্ড লিখুন"
            />
            {errors.password && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.password}
              </span>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'লোড হচ্ছে...' : 'লগইন'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          অ্যাকাউন্ট নেই? <Link href="/register" style={{ color: 'var(--primary-orange)' }}>রেজিস্টার করুন</Link>
        </p>
      </div>
    </div>
  );
}
