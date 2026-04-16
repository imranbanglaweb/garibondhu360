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
    padding: '14px 16px',
    border: `2px solid ${errors[fieldName] ? '#dc3545' : '#e0e0e0'}`,
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s',
    background: '#fafafa',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '20px' }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.98)', 
        borderRadius: '20px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        padding: '50px 40px',
        maxWidth: '420px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <img 
            src="/images/logo.png" 
            alt="গাড়িবন্ধু ৩৬০" 
            style={{ width: '120px', marginBottom: '15px' }}
          />
          <h2 style={{ margin: 0, color: '#1a1a2e', fontSize: '28px', fontWeight: '700' }}>গাড়িবন্ধু ৩৬০</h2>
          <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>স্মার্ট ট্রান্সপোর্ট ম্যানেজমেন্ট সিস্টেম</p>
        </div>
        
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
          
          <button type="submit" style={{ 
            width: '100%', 
            padding: '14px', 
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s'
          }} disabled={loading}>
            {loading ? 'লোড হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
          অ্যাকাউন্ট নেই? <Link href="/register" style={{ color: '#ff6b35', fontWeight: '600' }}>রেজিস্টার করুন</Link>
        </p>
        
        <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
            © ২০২৬ গাড়িবন্ধু ৩৬০। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </div>
  );
}
