'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-gray)' }}>
      <div className="auth-container">
        <h2>লগইন</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="আপনার ইমেইল লিখুন"
            />
          </div>
          
          <div className="form-group">
            <label>পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="আপনার পাসওয়ার্ড লিখুন"
            />
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
