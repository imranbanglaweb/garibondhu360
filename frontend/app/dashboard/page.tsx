'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { subscriptionAPI } from '../services/api';
import Link from 'next/link';

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
      setSubscription(subRes.data);
      setPayments(paymentsRes.data.data || []);
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
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">গা</div>
          <h2>গাড়িবন্ধু ৩৬০</h2>
        </div>
        
        <ul className="sidebar-menu">
          <li><Link href="/dashboard" className="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
            ড্যাশবোর্ড
          </Link></li>
          {(user?.role === 'admin' || user?.role === 'transport_admin') && (
            <>
              <li><Link href="/dashboard/users">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ব্যবহারকারী
              </Link></li>
              <li><Link href="/dashboard/vehicles">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17h14v-5H5zm0 0V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8"/><circle cx="17" cy="17" r="2"/><circle cx="7" cy="17" r="2"/></svg>
                গাড়ি
              </Link></li>
              <li><Link href="/dashboard/drivers">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                চালক
              </Link></li>
              <li><Link href="/dashboard/reports">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                রিপোর্ট
              </Link></li>
            </>
          )}
          <li><Link href="/dashboard/settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            সেটিংস
          </Link></li>
          <li>
            <button 
              onClick={handleLogout}
              disabled={loggingOut}
              className="logout-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {loggingOut ? 'লগআউট হচ্ছে...' : 'লগআউট'}
            </button>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>ড্যাশবোর্ড</h1>
            <p>আপনার ফ্লিট ম্যানেজমেন্ট ওভারভিউ</p>
          </div>
          
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
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}>🚗</div>
              <div className="stat-content">
                <span className="stat-label">মোট গাড়ি</span>
                <span className="stat-value">{stats.totalVehicles || 0}</span>
              </div>
              <div className="stat-trend up">↑ 12%</div>
            </div>
            <div className="stat-card premium">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%)' }}>👨</div>
              <div className="stat-content">
                <span className="stat-label">মোট চালক</span>
                <span className="stat-value">{stats.totalDrivers || 0}</span>
              </div>
              <div className="stat-trend up">↑ 8%</div>
            </div>
            <div className="stat-card premium">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>✓</div>
              <div className="stat-content">
                <span className="stat-label">সক্রিয় গাড়ি</span>
                <span className="stat-value">{stats.activeVehicles || 0}</span>
              </div>
              <div className="stat-trend up">↑ 5%</div>
            </div>
            <div className="stat-card premium">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>⏳</div>
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
              <Link href="/dashboard/settings" className="edit-btn">সম্পাদনা</Link>
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
          </div>

          {subscription && (
            <div className="dashboard-card subscription-card" style={{ background: isSubscriber ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '20px' }}>
                <h3 style={{ color: 'white' }}>সাবস্ক্রিপশন</h3>
                <span className={`status-badge ${subscription.status}`}>
                  {subscription.status === 'active' ? 'সক্রিয়' : 'মেয়াদ শেষ'}
                </span>
              </div>
              <div className="subscription-details">
                <div className="sub-plan">
                  <span className="plan-name">{subscription.package?.name || subscription.package_name || 'N/A'}</span>
                  <span className="plan-price">৳{subscription.package?.price || subscription.amount || 0}/মাস</span>
                </div>
                <div className="sub-features">
                  <div className="feature-item">
                    <span>শুরু</span>
                    <strong>{(subscription as any).started_at ? new Date((subscription as any).started_at).toLocaleDateString('bn-BD') : (subscription.start_date ? new Date(subscription.start_date).toLocaleDateString('bn-BD') : 'N/A')}</strong>
                  </div>
                  <div className="feature-item">
                    <span>গাড়ি লিমিট</span>
                    <strong>{(subscription.package?.vehicle_limit === 999999 || subscription.vehicle_limit === 999999) ? 'অসীম' : (subscription.package?.vehicle_limit || subscription.vehicle_limit || 'N/A')}</strong>
                  </div>
                  <div className="feature-item">
                    <span>চালক লিমিট</span>
                    <strong>{(subscription.package?.driver_limit === 999999 || subscription.driver_limit === 999999) ? 'অসীম' : (subscription.package?.driver_limit || subscription.driver_limit || 'N/A')}</strong>
                  </div>
                  <div className="feature-item">
                    <span>মেয়াদ শেষ</span>
                    <strong>{(subscription as any).expires_at ? new Date((subscription as any).expires_at).toLocaleDateString('bn-BD') : (subscription.end_date ? new Date(subscription.end_date).toLocaleDateString('bn-BD') : 'N/A')}</strong>
                  </div>
                </div>
              </div>
              {subscription.status !== 'active' && (
                <Link href="/pricing" className="renew-btn">নবীকরণ করুন</Link>
              )}
            </div>
          )}
        </div>

        {subscription && subscription.expires_at && (() => {
          const daysLeft = Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 7 && daysLeft > 0) {
            return (
              <div className="expiry-warning">
                <div className="warning-icon">⚠️</div>
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

        {payments.length > 0 && (
          <div className="dashboard-card payment-card">
            <div className="card-header">
              <h3>সাম্প্রতিক পেমেন্ট</h3>
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
        .dashboard { display: flex; min-height: 100vh; background: #f8fafc; }
        
        .sidebar { width: 280px; background: linear-gradient(180deg, #1E3D58 0%, #0d1f2d 100%); padding: 0; position: fixed; height: 100vh; }
        .sidebar-header { padding: 30px 25px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 15px; }
        .logo-icon { width: 45px; height: 45px; background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; }
        .sidebar-header h2 { color: white; font-size: 18px; margin: 0; font-weight: 600; }
        
        .sidebar-menu { padding: 20px 15px; }
        .sidebar-menu li { margin-bottom: 8px; }
        .sidebar-menu a, .sidebar-menu button { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: 12px; color: rgba(255,255,255,0.7); font-size: 14px; transition: all 0.3s; text-decoration: none; border: none; background: transparent; width: 100%; cursor: pointer; font-family: inherit; }
        .sidebar-menu a:hover, .sidebar-menu a.active { background: rgba(255,107,53,0.15); color: #FF6B35; }
        .sidebar-menu a.active { background: linear-gradient(135deg, #FF6B35 0%, #e55a2a 100%); color: white; }
        
        .logout-btn { color: #ff6b6b !important; }
        .logout-btn:hover { background: rgba(231, 76, 60, 0.15) !important; }
        
        .main-content { flex: 1; margin-left: 280px; padding: 30px 40px; }
        
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .header-left h1 { color: #1E3D58; font-size: 28px; margin-bottom: 5px; }
        .header-left p { color: #64748b; font-size: 14px; }
        
        .subscription-badge { display: flex; align-items: center; gap: 12px; padding: 16px 24px; border-radius: 16px; color: white; }
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
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 30px; }
        .stat-card.premium { background: white; border-radius: 20px; padding: 24px; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: all 0.3s; border: 1px solid #e2e8f0; position: relative; overflow: hidden; }
        .stat-card.premium:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
        .stat-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .stat-content { flex: 1; }
        .stat-label { display: block; color: #64748b; font-size: 13px; margin-bottom: 4px; }
        .stat-value { font-size: 28px; font-weight: 700; color: #1E3D58; }
        .stat-trend { font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
        .stat-trend.up { background: #d1fae5; color: #059669; }
        
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-bottom: 30px; }
        .dashboard-card { background: white; border-radius: 20px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .card-header h3 { color: #1E3D58; font-size: 18px; margin: 0; }
        .edit-btn, .view-all { color: #FF6B35; font-size: 14px; font-weight: 500; text-decoration: none; }
        
        .user-info { display: flex; align-items: center; gap: 20px; }
        .user-avatar-large { width: 80px; height: 80px; background: linear-gradient(135deg, #FF6B35 0%, #e55a2a 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 600; }
        .user-details h4 { color: #1E3D58; font-size: 20px; margin: 0 0 6px; }
        .user-email { color: #64748b; font-size: 14px; margin: 0 0 12px; }
        .user-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .meta-badge { background: linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .meta-item { background: #f1f5f9; color: #64748b; padding: 6px 14px; border-radius: 20px; font-size: 12px; }
        
        .subscription-card { color: white; }
        .subscription-card .card-header h3 { color: white; }
        .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background: rgba(255,255,255,0.2); }
        .subscription-details { margin-bottom: 20px; }
        .sub-plan { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .plan-name { font-size: 24px; font-weight: 700; }
        .plan-price { font-size: 16px; opacity: 0.9; }
        .sub-features { display: flex; gap: 20px; flex-wrap: wrap; }
        .feature-item { display: flex; flex-direction: column; gap: 4px; }
        .feature-item span { font-size: 12px; opacity: 0.8; }
        .feature-item strong { font-size: 16px; }
        .renew-btn { display: block; text-align: center; background: white; color: #10b981; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s; }
        .renew-btn:hover { transform: scale(1.02); }
        
        .expiry-warning { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 20px 24px; display: flex; align-items: center; gap: 16px; margin-bottom: 30px; }
        .warning-icon { font-size: 28px; }
        .warning-content { flex: 1; }
        .warning-content strong { display: block; color: #92400e; margin-bottom: 4px; }
        .warning-content span { color: #a16207; font-size: 14px; }
        .renew-link { background: #92400e; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; }
        
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
          .sidebar { width: 80px; }
          .sidebar-header h2, .sidebar-menu span { display: none; }
          .sidebar-menu a, .sidebar-menu button { justify-content: center; padding: 14px; }
          .main-content { margin-left: 80px; }
        }
        
        @media (max-width: 768px) {
          .dashboard { flex-direction: column; }
          .sidebar { width: 100%; position: static; height: auto; }
          .main-content { margin-left: 0; padding: 20px; }
          .dashboard-header { flex-direction: column; gap: 20px; }
          .non-subscriber-banner { flex-direction: column; text-align: center; }
          .stats-grid, .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}