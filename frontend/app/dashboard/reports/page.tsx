'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

export default function ReportsPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const canManageUsers = user?.role === 'admin' || user?.role === 'transport_admin';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!canManageUsers) {
    return (
      <div className="dashboard">
        <Sidebar canManageUsers={false} />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>অনুমোদন প্রয়োজন</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>এই পৃষ্ঠা দেখার জন্য অ্যাডমিন অধিকার প্রয়োজন।</p>
            <Link href="/dashboard" style={{ color: '#FF6B35', marginTop: '20px', display: 'inline-block' }}>
              ড্যাশবোর্ডে ফিরে যান
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .dashboard { display: flex; min-height: 100vh; background: #f8fafc; }
        .main-content { flex: 1; margin-left: 280px; padding: 30px 40px; }
      `}</style>
      <div className="dashboard">
      <Sidebar canManageUsers={canManageUsers} />

      <main className="main-content">
        <div style={{ marginBottom: '30px' }}>
          <h1>রিপোর্ট</h1>
          <p style={{ color: '#666' }}>বিভিন্ন রিপোর্ট ডাউনলোড করুন</p>
        </div>

        {/* Date Range Filter */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '15px', 
          boxShadow: 'var(--shadow)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>তারিখ থেকে</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>তারিখ পর্যন্ত</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <button className="btn btn-primary" style={{ padding: '12px 25px' }}>
              সার্চ
            </button>
          </div>
        </div>

        {/* Report Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📋</div>
            <h3>রিকুইজিশন রিপোর্ট</h3>
            <p style={{ color: '#666', marginTop: '10px', marginBottom: '20px' }}>
              সকল রিকুইজিশনের বিস্তারিত রিপোর্ট ডাউনলোড করুন
            </p>
            <button style={{
              padding: '10px 20px',
              background: 'var(--primary-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              ডাউনলোড
            </button>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🚗</div>
            <h3>গাড়ি ব্যবহার রিপোর্ট</h3>
            <p style={{ color: '#666', marginTop: '10px', marginBottom: '20px' }}>
              গাড়ির ব্যবহার ও মাইলেজ রিপোর্ট
            </p>
            <button style={{
              padding: '10px 20px',
              background: 'var(--primary-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              ডাউনলোড
            </button>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>👨‍✈️</div>
            <h3>চালক Performance রিপোর্ট</h3>
            <p style={{ color: '#666', marginTop: '10px', marginBottom: '20px' }}>
              প্রতিটি চালকের ড্রাইভিং Performance
            </p>
            <button style={{
              padding: '10px 20px',
              background: 'var(--primary-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              ডাউনলোড
            </button>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>💰</div>
            <h3>খরচ রিপোর্ট</h3>
            <p style={{ color: '#666', marginTop: '10px', marginBottom: '20px' }}>
              জ্বালানি ও মেইনটেন্যান্স খরচের রিপোর্ট
            </p>
            <button style={{
              padding: '10px 20px',
              background: 'var(--primary-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              ডাউনলোড
            </button>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>📊</div>
            <h3>মাসিক সারসংক্ষেপ</h3>
            <p style={{ color: '#666', marginTop: '10px', marginBottom: '20px' }}>
              মাসিক ভিত্তিক সারসংক্ষেপ রিপোর্ট
            </p>
            <button style={{
              padding: '10px 20px',
              background: 'var(--primary-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              ডাউনলোড
            </button>
          </div>

          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>🏆</div>
            <h3>বার্ষিক রিপোর্ট</h3>
            <p style={{ color: '#666', marginTop: '10px', marginBottom: '20px' }}>
              পুরো বছরের কর্মক্ষমতা বিশ্লেষণ
            </p>
            <button style={{
              padding: '10px 20px',
              background: 'var(--primary-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              ডাউনলোড
            </button>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}