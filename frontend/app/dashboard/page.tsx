'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { subscriptionAPI } from '../services/api';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';

interface Payment {
  id: number;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
  subscription?: {
    package?: {
      name: string;
      price: number;
      vehicle_limit: number;
      driver_limit: number;
    };
  };
  package_name?: string;
}

interface DashboardStats {
  totalVehicles?: number;
  totalDrivers?: number;
  activeVehicles?: number;
  pendingRequests?: number;
  totalRequisitions?: number;
  completedTrips?: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchDashboardData();
    }
  }, [loading, isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [subRes, paymentsRes, statsRes] = await Promise.all([
        subscriptionAPI.myActiveSubscription(),
        subscriptionAPI.myPayments(),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.ok ? r.json() : { data: {} }).catch(() => ({ data: {} }))
      ]);
      setSubscription(subRes.data?.data || subRes.data || null);
      const paymentsData = paymentsRes?.data?.data || paymentsRes?.data || [];
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      setStats(statsRes.data || {});
    } catch (e: any) {
      if (e.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
    } finally {
      setLoadingData(false);
    }
  };

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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'অ্যাডমিন';
      case 'department_head': return 'বিভাগীয় প্রধান';
      case 'transport_admin': return 'পরিবহন অ্যাডমিন';
      default: return 'কর্মচারী';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', text: '#10b981' };
      case 'expired': return { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', text: '#f59e0b' };
      default: return { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', text: '#ef4444' };
    }
  };

  const canManageUsers = user?.role === 'admin' || user?.role === 'transport_admin';
  const isSubscriber = subscription && subscription.status === 'active';

  const getDaysRemaining = () => {
    if (!subscription?.expires_at) return 0;
    return Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getProgressPercent = () => {
    if (!subscription?.started_at || !subscription?.expires_at) return 0;
    const start = new Date(subscription.started_at).getTime();
    const end = new Date(subscription.expires_at).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  if (loading || loadingData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid #FF6B35',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'white', fontSize: '16px' }}>লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar canManageUsers={canManageUsers} />

      <main className="main-content">
        <div className="dashboard-header">
          <div className="header-left">
            <div className="welcome-badge">স্বাগতম 👋</div>
            <h1>{user?.name}</h1>
            <p>আপনার ফ্লিট ম্যানেজমেন্ট ড্যাশবোর্ড</p>
          </div>
          
          <div className="header-actions">
            {subscription && (
              <div className="subscription-badge" style={{ background: getStatusColor(subscription.status).bg }}>
                <span className="badge-icon">👑</span>
                <div className="badge-info">
                  <span className="badge-label">প্যাকেজ</span>
                  <span className="badge-value">{subscription.package?.name}</span>
                </div>
                <span className={`status-dot ${subscription.status}`}></span>
              </div>
            )}
          </div>
        </div>

        {!isSubscriber && (
          <div className="non-subscriber-banner">
            <div className="banner-icon">⚠️</div>
            <div className="banner-content">
              <h3>সাবস্ক্রিপশন প্রয়োজন</h3>
              <p>সকল ফিচার ব্যবহার করতে আপনার সাবস্ক্রিপশন সক্রিয় করুন। এখনই প্যাকেজ কিনুন এবং সব সুবিধা পান!</p>
            </div>
            <Link href="/pricing" className="banner-cta">
              সাবস্ক্রিপশন নিন
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        )}

        {canManageUsers && (
          <div className="stats-grid">
            <div className="stat-card premium">
              <div className="stat-card-glow" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, transparent 100%)' }}></div>
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 17h14v-5H5zm0 0V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8"/><circle cx="17" cy="17" r="2"/><circle cx="7" cy="17" r="2"/></svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">মোট গাড়ি</span>
                <span className="stat-value">{stats.totalVehicles || 0}</span>
              </div>
              <div className="stat-trend up">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6"/></svg>
                12%
              </div>
            </div>
            
            <div className="stat-card premium">
              <div className="stat-card-glow" style={{ background: 'linear-gradient(135deg, rgba(30,61,88,0.15) 0%, transparent 100%)' }}></div>
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">মোট চালক</span>
                <span className="stat-value">{stats.totalDrivers || 0}</span>
              </div>
              <div className="stat-trend up">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6"/></svg>
                8%
              </div>
            </div>
            
            <div className="stat-card premium">
              <div className="stat-card-glow" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, transparent 100%)' }}></div>
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">সক্রিয় গাড়ি</span>
                <span className="stat-value">{stats.activeVehicles || 0}</span>
              </div>
              <div className="stat-trend up">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 15l-6-6-6 6"/></svg>
                5%
              </div>
            </div>
            
            <div className="stat-card premium">
              <div className="stat-card-glow" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, transparent 100%)' }}></div>
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">পেন্ডিং রিকোয়েস্ট</span>
                <span className="stat-value">{stats.pendingRequests || 0}</span>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-card user-card">
            <div className="card-header">
              <h3>প্রোফাইল তথ্য</h3>
              <Link href="/dashboard/settings" className="edit-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                সম্পাদনা
              </Link>
            </div>
            <div className="user-info">
              <div className="user-avatar-large">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h4>{user?.name}</h4>
                <p className="user-email">{user?.email}</p>
                <div className="user-meta">
                  <span className="meta-badge">{getRoleLabel(user?.role || 'employee')}</span>
                  {user?.department && <span className="meta-item">{user.department}</span>}
                  {user?.designation && <span className="meta-item">{user.designation}</span>}
                </div>
              </div>
            </div>
            <div className="user-stats">
              <div className="user-stat-item">
                <span className="stat-number">{payments.length}</span>
                <span className="stat-label">মোট পেমেন্ট</span>
              </div>
              <div className="user-stat-item">
                <span className="stat-number">{isSubscriber ? '✓' : '✗'}</span>
                <span className="stat-label">সাবস্ক্রিপশন</span>
              </div>
            </div>
          </div>

          {subscription && (
            <div className="dashboard-card subscription-card" style={{ background: isSubscriber ? 'linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '20px' }}>
                <h3 style={{ color: 'white' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/></svg>
                  সাবস্ক্রিপশন
                </h3>
                <span className={`status-badge ${subscription.status}`}>
                  {subscription.status === 'active' ? 'সক্রিয়' : 'মেয়াদ শেষ'}
                </span>
              </div>
              <div className="subscription-details">
                <div className="sub-plan">
                  <span className="plan-name">{subscription.package?.name || subscription.package_name || 'N/A'}</span>
                  <span className="plan-price">৳{subscription.package?.price || subscription.amount || 0}<small>/মাস</small></span>
                </div>
                
                {isSubscriber && (
                  <div className="subscription-progress">
                    <div className="progress-header">
                      <span>মেয়াদ উপযুক্ত</span>
                      <span>{getDaysRemaining()} দিন বাকি</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${getProgressPercent()}%` }}></div>
                    </div>
                  </div>
                )}
                
                <div className="sub-features">
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17h14v-5H5zm0 0V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8"/><circle cx="17" cy="17" r="2"/><circle cx="7" cy="17" r="2"/></svg>
                    <div>
                      <span>গাড়ি লিমিট</span>
                      <strong>{(subscription.package?.vehicle_limit === 999999 || subscription.vehicle_limit === 999999) ? 'অসীম' : (subscription.package?.vehicle_limit || subscription.vehicle_limit || 'N/A')}</strong>
                    </div>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <div>
                      <span>চালক লিমিট</span>
                      <strong>{(subscription.package?.driver_limit === 999999 || subscription.driver_limit === 999999) ? 'অসীম' : (subscription.package?.driver_limit || subscription.driver_limit || 'N/A')}</strong>
                    </div>
                  </div>
                  <div className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <div>
                      <span>মেয়াদ শেষ</span>
                      <strong>{(subscription as any).expires_at ? new Date((subscription as any).expires_at).toLocaleDateString('bn-BD') : (subscription.end_date ? new Date(subscription.end_date).toLocaleDateString('bn-BD') : 'N/A')}</strong>
                    </div>
                  </div>
                </div>
              </div>
              {subscription.status !== 'active' && (
                <Link href="/pricing" className="renew-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  নবীকরণ করুন
                </Link>
              )}
            </div>
          )}
        </div>

        {subscription && subscription.expires_at && (() => {
          const daysLeft = Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 7 && daysLeft > 0) {
            return (
              <div className="expiry-warning">
                <div className="warning-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div className="warning-content">
                  <strong>সাবস্ক্রিপশন মেয়াদ শেষ হচ্ছে!</strong>
                  <span>আরো {daysLeft} দিন পরে আপনার সাবস্ক্রিপশন শেষ হয়ে যাবে।</span>
                </div>
                <Link href="/pricing" className="renew-link">নবীকরণ</Link>
              </div>
            );
          }
          return null;
        })()}

        <div className="quick-actions">
          <h3>দ্রুত অ্যাকশন</h3>
          <div className="action-buttons">
            <Link href="/dashboard/requisitions" className="action-btn">
              <span className="action-icon" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #e55a2a 100%)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
              </span>
              <span className="action-text">নতুন রিকোয়েস্ট</span>
            </Link>
            <Link href="/dashboard/settings" className="action-btn">
              <span className="action-icon" style={{ background: 'linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </span>
              <span className="action-text">সেটিংস</span>
            </Link>
            {canManageUsers && (
              <Link href="/dashboard/reports" className="action-btn">
                <span className="action-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                </span>
                <span className="action-text">রিপোর্ট</span>
              </Link>
            )}
            <Link href="/payment" className="action-btn">
              <span className="action-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </span>
              <span className="action-text">পেমেন্ট</span>
            </Link>
          </div>
        </div>

        {payments.length > 0 && (
          <div className="dashboard-card payment-card">
            <div className="card-header">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                সাম্প্রতিক পেমেন্ট
              </h3>
              <Link href="/dashboard/payments" className="view-all">সব দেখুন →</Link>
            </div>
            <div className="payment-table">
              <table>
                <thead>
                  <tr>
                    <th>তারিখ</th>
                    <th>প্যাকেজ</th>
                    <th>পদ্ধতি</th>
                    <th>ট্রানজ্যাকশন</th>
                    <th>টাকা</th>
                    <th>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 5).map((payment: Payment) => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.created_at).toLocaleDateString('bn-BD')}</td>
                      <td>{(payment as any).subscription?.package?.name || (payment as any).package_name || subscription?.package?.name || 'N/A'}</td>
                      <td><span className="method-badge">{payment.payment_method}</span></td>
                      <td><code>{payment.transaction_id.substring(0, 20)}...</code></td>
                      <td><strong>৳{payment.amount}</strong></td>
                      <td>
                        <span className={`status-pill ${payment.status}`}>
                          {payment.status === 'verified' ? '✓ যাচাই' : payment.status === 'pending' ? '⏳ পেন্ডিং' : '✗ প্রত্যাখ্যান'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .dashboard { display: flex; min-height: 100vh; background: linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%); }
        .main-content { flex: 1; margin-left: 280px; padding: 32px 40px; }
        
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
        .welcome-badge { display: inline-block; background: linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.05) 100%); color: #FF6B35; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
        .header-left h1 { color: #1E3D58; font-size: 32px; margin-bottom: 6px; font-weight: 700; }
        .header-left p { color: #64748b; font-size: 14px; }
        
        .subscription-badge { display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-radius: 16px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .badge-icon { font-size: 24px; }
        .badge-info { display: flex; flex-direction: column; }
        .badge-label { font-size: 11px; opacity: 0.8; text-transform: uppercase; }
        .badge-value { font-size: 16px; font-weight: 600; }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; background: white; }
        .status-dot.active { background: #10b981; box-shadow: 0 0 10px #10b981; }
        
        .non-subscriber-banner { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 20px; padding: 25px 30px; display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
        .banner-icon { font-size: 40px; }
        .banner-content { flex: 1; }
        .banner-content h3 { color: #92400e; margin: 0 0 8px; font-size: 18px; }
        .banner-content p { color: #a16207; margin: 0; font-size: 14px; }
        .banner-cta { display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s; }
        .banner-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(245,158,11,0.4); }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .stat-card.premium { background: white; border-radius: 20px; padding: 24px; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: all 0.3s; border: 1px solid #e2e8f0; position: relative; overflow: hidden; }
        .stat-card.premium:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
        .stat-card-glow { position: absolute; top: 0; right: 0; width: 100px; height: 100px; border-radius: 50%; filter: blur(40px); }
        .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-content { flex: 1; }
        .stat-label { display: block; color: #64748b; font-size: 13px; margin-bottom: 4px; }
        .stat-value { font-size: 28px; font-weight: 700; color: #1E3D58; }
        .stat-trend { font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 4px; }
        .stat-trend.up { background: #d1fae5; color: #059669; }
        
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .dashboard-card { background: white; border-radius: 20px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .card-header h3 { color: #1E3D58; font-size: 18px; margin: 0; display: flex; align-items: center; }
        .edit-btn, .view-all { color: #FF6B35; font-size: 14px; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 6px; }
        
        .user-info { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
        .user-avatar-large { width: 72px; height: 72px; background: linear-gradient(135deg, #FF6B35 0%, #e55a2a 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: 600; }
        .user-details h4 { color: #1E3D58; font-size: 20px; margin: 0 0 6px; }
        .user-email { color: #64748b; font-size: 14px; margin: 0 0 12px; }
        .user-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .meta-badge { background: linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .meta-item { background: #f1f5f9; color: #64748b; padding: 6px 14px; border-radius: 20px; font-size: 12px; }
        
        .user-stats { display: flex; gap: 20px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
        .user-stat-item { display: flex; flex-direction: column; gap: 4px; }
        .user-stat-item .stat-number { font-size: 24px; font-weight: 700; color: #1E3D58; }
        .user-stat-item .stat-label { font-size: 12px; color: #64748b; }
        
        .subscription-card { color: white; position: relative; overflow: hidden; }
        .subscription-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); }
        .subscription-card .card-header h3 { color: white; }
        .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background: rgba(255,255,255,0.2); }
        .subscription-details { margin-bottom: 20px; position: relative; z-index: 1; }
        .sub-plan { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .plan-name { font-size: 24px; font-weight: 700; }
        .plan-price { font-size: 18px; opacity: 0.9; }
        .plan-price small { font-size: 12px; opacity: 0.7; }
        
        .subscription-progress { margin-bottom: 20px; }
        .progress-header { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px; opacity: 0.8; }
        .progress-bar { height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #10b981 0%, #34d399 100%); border-radius: 3px; transition: width 0.3s; }
        
        .sub-features { display: flex; gap: 16px; flex-wrap: wrap; }
        .feature-item { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.1); padding: 12px 16px; border-radius: 12px; flex: 1; min-width: 120px; }
        .feature-item svg { opacity: 0.8; }
        .feature-item div { display: flex; flex-direction: column; }
        .feature-item span { font-size: 11px; opacity: 0.7; }
        .feature-item strong { font-size: 14px; }
        
        .renew-btn { display: flex; align-items: center; justify-content: center; gap: 8px; background: white; color: #1E3D58; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s; }
        .renew-btn:hover { transform: scale(1.02); }
        
        .expiry-warning { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 20px 24px; display: flex; align-items: center; gap: 16px; margin-bottom: 30px; }
        .warning-icon { color: #92400e; }
        .warning-content { flex: 1; }
        .warning-content strong { display: block; color: #92400e; margin-bottom: 4px; }
        .warning-content span { color: #a16207; font-size: 14px; }
        .renew-link { background: #92400e; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; }
        
        .quick-actions { margin-bottom: 32px; }
        .quick-actions h3 { color: #1E3D58; font-size: 18px; margin-bottom: 16px; }
        .action-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
        .action-btn { display: flex; align-items: center; gap: 12px; background: white; padding: 16px 20px; border-radius: 16px; text-decoration: none; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; transition: all 0.3s; }
        .action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .action-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .action-text { color: #1E3D58; font-weight: 600; font-size: 14px; }
        
        .payment-card { overflow: hidden; }
        .payment-table { overflow-x: auto; }
        .payment-table table { width: 100%; border-collapse: collapse; }
        .payment-table th { text-align: left; padding: 14px 16px; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 600; border-bottom: 2px solid #f1f5f9; }
        .payment-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; color: #1E3D58; font-size: 14px; }
        .payment-table tr:hover { background: #f8fafc; }
        .method-badge { background: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-size: 12px; text-transform: uppercase; }
        .status-pill { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .status-pill.verified { background: #d1fae5; color: #059669; }
        .status-pill.pending { background: #fef3c7; color: #d97706; }
        .status-pill.rejected { background: #fee2e2; color: #dc2626; }
        
        @media (max-width: 1200px) {
          .main-content { margin-left: 80px; width: calc(100% - 80px); padding: 24px 20px; }
        }
        
        @media (max-width: 768px) {
          .dashboard { flex-direction: column; }
          .main-content { margin-left: 0; width: 100%; padding: 20px; }
          .dashboard-header { flex-direction: column; gap: 20px; }
          .non-subscriber-banner { flex-direction: column; text-align: center; }
          .stats-grid, .dashboard-grid { grid-template-columns: 1fr; }
          .action-buttons { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}