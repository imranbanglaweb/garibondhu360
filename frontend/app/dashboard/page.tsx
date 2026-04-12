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
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Only redirect if auth check is complete AND not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    // Fetch data when user is authenticated and auth check is complete
    if (!loading && isAuthenticated) {
      fetchDashboardData();
    }
  }, [loading, isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [subRes, paymentsRes] = await Promise.all([
        subscriptionAPI.myActiveSubscription(),
        subscriptionAPI.myPayments(),
      ]);
      setSubscription(subRes.data);
      setPayments(paymentsRes.data.data || []);
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

  const canManageUsers = user?.role === 'admin' || user?.role === 'transport_admin';

  if (loading || loadingData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2 style={{ color: 'white' }}>গাড়িবন্ধু ৩৬০</h2>
          <p style={{ opacity: 0.8, marginTop: '5px' }}>ড্যাশবোর্ড</p>
        </div>
        
        <ul className="sidebar-menu">
          <li><Link href="/dashboard" className="active">ড্যাশবোর্ড</Link></li>
          {(user?.role === 'admin' || user?.role === 'transport_admin') && (
            <>
              <li><Link href="/dashboard/users">ব্যবহারকারী</Link></li>
              <li><Link href="/dashboard/vehicles">গাড়ি</Link></li>
              <li><Link href="/dashboard/drivers">চালক</Link></li>
              <li><Link href="/dashboard/reports">রিপোর্ট</Link></li>
            </>
          )}
          <li><Link href="/dashboard/settings">সেটিংস</Link></li>
          <li>
            <button 
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                background: 'rgba(231, 76, 60, 0.2)',
                color: '#ff6b6b',
                border: 'none',
                cursor: loggingOut ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                opacity: loggingOut ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
            >
              {loggingOut ? 'লগআউট হচ্ছে...' : 'লগআউট'}
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Header */}
        <div style={{ 
          marginBottom: '30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1>স্বাগতম, {user?.name}!</h1>
            <p style={{ color: '#666' }}>আপনার ফ্লিট ম্যানেজমেন্ট ড্যাশবোর্ড</p>
          </div>
          
          {/* Subscription Status Card */}
          {subscription ? (
            <div style={{
              background: subscription.status === 'active' 
                ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
                : 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
              padding: '20px 30px',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>আপনার প্যাকেজ</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '5px' }}>{subscription.package?.name}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                মেয়াদ: {subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                গাড়ি: {subscription.package?.vehicle_limit === 999999 ? 'অসীম' : subscription.package?.vehicle_limit} | চালক: {subscription.package?.driver_limit === 999999 ? 'অসীম' : subscription.package?.driver_limit}
              </div>
            </div>
          ) : (
            <Link href="/pricing" style={{
              background: 'linear-gradient(135deg, var(--primary-orange) 0%, #e55a2a 100%)',
              padding: '12px 20px',
              borderRadius: '10px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              সাবস্ক্রিপশন নিন
            </Link>
          )}
        </div>

        {/* User Info Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-navy) 0%, #2a4a6a 100%)',
          padding: '25px',
          borderRadius: '15px',
          color: 'white',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{user?.name}</h3>
              <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '14px' }}>{user?.email}</p>
              <p style={{ margin: '3px 0 0', opacity: 0.7, fontSize: '12px' }}>
                {getRoleLabel(user?.role || 'employee')} | {user?.department || 'N/A'} | {user?.designation || 'N/A'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/dashboard/settings" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}>
              সেটিংস
            </Link>
          </div>
        </div>

        {/* Subscription Details Card */}
        {subscription ? (
          <div style={{ 
            background: subscription.status === 'active' 
              ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
              : 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>আপনার সাবস্ক্রিপশন</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>{subscription.package?.name}</div>
                <div style={{ fontSize: '16px', opacity: 0.9 }}>
                  মেয়াদ: {subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.85, marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  গাড়ি লিমিট: {subscription.package?.vehicle_limit === 999999 ? 'অসীম' : subscription.package?.vehicle_limit} | চালক লিমিট: {subscription.package?.driver_limit === 999999 ? 'অসীম' : subscription.package?.driver_limit}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  padding: '8px 16px', 
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.2)',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px'
                }}>
                  {subscription.status === 'active' ? '✅ সক্রিয়' : '⏳ মেয়াদ শেষ'}
                </div>
                {subscription.status !== 'active' && (
                  <Link href="/pricing" style={{
                    display: 'block',
                    background: 'white',
                    color: '#fd7e14',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    নবীকরণ করুন
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ 
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>⚠️ কোন সাবস্ক্রিপশন নেই</div>
                <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>আপনার সাবস্ক্রিপশন করুন</div>
                <div style={{ fontSize: '14px', opacity: 0.85 }}>
                  সকল সুবিধা পেতে প্যাকেজ কিনুন
                </div>
              </div>
              <Link href="/pricing" style={{
                background: 'white',
                color: '#dc3545',
                padding: '12px 25px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                প্যাকেজ কিনুন
              </Link>
            </div>
          </div>
        )}

        {/* Expiration Warning */}
        {subscription && subscription.expires_at && (() => {
          const daysLeft = Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 7 && daysLeft > 0) {
            return (
              <div style={{ 
                background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
                padding: '20px',
                borderRadius: '12px',
                color: '#333',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{ fontSize: '24px' }}>⚠️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>সাবস্ক্রিপশন মেয়াদ শেষ হচ্ছে!</div>
                  <div style={{ fontSize: '14px' }}>আরো {daysLeft} দিন পরে আপনার সাবস্ক্রিপশন শেষ হয়ে যাবে। নবীকরণ করুন।</div>
                </div>
                <Link href="/pricing" style={{
                  background: '#333',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  নবীকরণ
                </Link>
              </div>
            );
          }
          return null;
        })()}

        {/* Payment History */}
        {payments.length > 0 && (
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow)', marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>পেমেন্ট ইতিহাস</h3>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--light-gray)' }}>
                  <th style={{ textAlign: 'left', padding: '10px' }}>তারিখ</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>প্যাকেজ</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>পদ্ধতি</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>ট্রানজ্যাকশন আইডি</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>টাকা</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 5).map((payment: Payment) => (
                  <tr key={payment.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                    <td style={{ padding: '10px' }}>{new Date(payment.created_at).toLocaleDateString('bn-BD')}</td>
                    <td style={{ padding: '10px' }}>{subscription?.package?.name || 'N/A'}</td>
                    <td style={{ padding: '10px', textTransform: 'uppercase' }}>{payment.payment_method}</td>
                    <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>{payment.transaction_id}</td>
                    <td style={{ padding: '10px' }}>৳{payment.amount}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ 
                        padding: '5px 10px', 
                        borderRadius: '20px',
                        backgroundColor: payment.status === 'verified' ? 'var(--secondary-green)' : payment.status === 'pending' ? 'var(--accent-yellow)' : 'var(--accent-red)',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {payment.status === 'verified' ? '✅ যাচাইকৃত' : payment.status === 'pending' ? '⏳ পেন্ডিং' : '❌ প্রত্যাখ্যান'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
