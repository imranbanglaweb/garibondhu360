'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { subscriptionAPI } from '../../services/api';
import Sidebar from '../../components/Sidebar';

export default function SettingsPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const canManagePayments = user?.role === 'admin' || user?.role === 'transport_admin';

  const loadPayments = useCallback(async () => {
    setLoadingPayments(true);
    try {
      const res = await subscriptionAPI.allPayments();
      console.log('All payments response:', res);
      // Laravel paginate wraps in 'data.data.data' (response.data -> success wrapper, .data -> paginator, .data -> items)
      const paymentData = res?.data?.data?.data || res?.data?.data || [];
      console.log('Payment data:', paymentData);
      setPayments(Array.isArray(paymentData) ? paymentData : []);
    } catch (error: any) {
      console.error('Failed to load payments:', error?.response?.data || error);
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  }, []);

  useEffect(() => {
    if (canManagePayments) {
      loadPayments();
    }
  }, [canManagePayments, loadPayments]);

  const handleApprovePayment = async (paymentId: number) => {
    try {
      await subscriptionAPI.approvePayment(paymentId);
      loadPayments();
    } catch (error) {
      console.error('Failed to approve payment:', error);
    }
  };

  const handleVerifyPayment = async (paymentId: number) => {
    try {
      await subscriptionAPI.verifyPayment(paymentId, { status: 'verified' });
      loadPayments();
    } catch (error) {
      console.error('Failed to verify payment:', error);
    }
  };

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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'অ্যাডমিন';
      case 'department_head': return 'বিভাগীয় প্রধান';
      case 'transport_admin': return 'পরিবহন অ্যাডমিন';
      case 'employee': return 'কর্মচারী';
      case 'driver': return 'চালক';
      default: return role;
    }
  };

  const canManageUsers = user?.role === 'admin' || user?.role === 'transport_admin';

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar canManageUsers={canManageUsers} />
        <main className="main-content">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <p>লোড হচ্ছে...</p>
          </div>
        </main>
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
            <p style={{ color: '#666', marginTop: '10px' }}>এই পৃষ্ঠা দেখার জন্য আপনার অ্যাডমিন অধিকার প্রয়োজন।</p>
            <Link href="/dashboard" style={{ color: '#FF6B35', marginTop: '20px', display: 'inline-block' }}>
              ড্যাশবোর্ডে ফিরে যান
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar canManageUsers={canManageUsers} />

      <main className="main-content">
        <div style={{ marginBottom: '30px' }}>
          <h1>সেটিংস</h1>
          <p style={{ color: '#666' }}>আপনার অ্যাকাউন্ট সেটিংস</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid var(--light-gray)', paddingBottom: '10px' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: activeTab === 'profile' ? 'var(--primary-orange)' : 'transparent',
              color: activeTab === 'profile' ? 'white' : 'var(--dark-gray)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            প্রোফাইল
          </button>
          <button
            onClick={() => setActiveTab('account')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: activeTab === 'account' ? 'var(--primary-orange)' : 'transparent',
              color: activeTab === 'account' ? 'white' : 'var(--dark-gray)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            অ্যাকাউন্ট
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: activeTab === 'notifications' ? 'var(--primary-orange)' : 'transparent',
              color: activeTab === 'notifications' ? 'white' : 'var(--dark-gray)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            নোটিফিকেশন
          </button>
          {canManagePayments && (
            <button
              onClick={() => setActiveTab('payments')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: activeTab === 'payments' ? 'var(--primary-orange)' : 'transparent',
                color: activeTab === 'payments' ? 'white' : 'var(--dark-gray)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              পেমেন্ট ম্যানেজমেন্ট
            </button>
          )}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginBottom: '25px' }}>প্রোফাইল তথ্য</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-orange) 0%, #e55a2a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '36px',
                fontWeight: 'bold'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin: 0 }}>{user?.name}</h2>
                <p style={{ color: '#666', margin: '5px 0 0' }}>{getRoleLabel(user?.role || 'employee')}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#666' }}>নাম</label>
                <div style={{ padding: '12px 15px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>{user?.name}</div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#666' }}>ইমেইল</label>
                <div style={{ padding: '12px 15px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>{user?.email}</div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#666' }}>ফোন</label>
                <div style={{ padding: '12px 15px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>{user?.cell_phone}</div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#666' }}>বিভাগ</label>
                <div style={{ padding: '12px 15px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>{user?.department || 'N/A'}</div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#666' }}>পদবি</label>
                <div style={{ padding: '12px 15px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>{user?.designation || 'N/A'}</div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#666' }}>ভূমিকা</label>
                <div style={{ padding: '12px 15px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>{getRoleLabel(user?.role || 'employee')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginBottom: '25px' }}>অ্যাকাউন্ট সেটিংস</h3>
            
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '15px' }}>পাসवर्ड পরিবর্তন</h4>
              <div style={{ display: 'grid', gap: '15px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>বর্তমান পাসवर्ड</label>
                  <input
                    type="password"
                    placeholder="বর্তমান পাসवर्ड"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>নতুন পাসवर्ड</label>
                  <input
                    type="password"
                    placeholder="নতুন পাসवर्ड"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>নতুন পাসवर्ड নিশ্চিত করুন</label>
                  <input
                    type="password"
                    placeholder="নতুন পাসवर्ड নিশ্চিত করুন"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  style={{ padding: '12px 25px', width: 'fit-content' }}
                >
                  পাসवर्ड পরিবর্তন করুন
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--light-gray)', paddingTop: '30px' }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--accent-red)' }}>অ্যাকাউন্ট মুছে ফেলুন</h4>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                আপনার অ্যাকাউন্ট মুছে ফেললে সকল ডেটা স্থায়ীভাবে হারিয়ে যাবে। এই কাজটি ফিরিয়ে আনা যায় না।
              </p>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--accent-red)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                অ্যাকাউন্ট মুছে ফেলুন
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginBottom: '25px' }}>নোটিফিকেশন সেটিংস</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ margin: 0 }}>ইমেইল নোটিফিকেশন</h4>
                  <p style={{ color: '#666', margin: '5px 0 0', fontSize: '14px' }}>রিকুইজিশন স্ট্যাটাস পরিবর্তনে ইমেইল পান</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ margin: 0 }}>এসএমএস নোটিফিকেশন</h4>
                  <p style={{ color: '#666', margin: '5px 0 0', fontSize: '14px' }}>গুরুত্বপূর্ণ আপডেটে এসএমএস পান</p>
                </div>
                <input type="checkbox" style={{ width: '20px', height: '20px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'var(--light-gray)', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ margin: 0 }}>মার্কেটিং ইমেইল</h4>
                  <p style={{ color: '#666', margin: '5px 0 0', fontSize: '14px' }}>অফার ও প্রমোশন সম্পর্কে জানুন</p>
                </div>
                <input type="checkbox" style={{ width: '20px', height: '20px' }} />
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ marginTop: '25px', padding: '12px 25px' }}
            >
              সেটিংস সংরক্ষণ করুন
            </button>
          </div>
        )}

        {/* Payments Tab (Admin Only) */}
        {activeTab === 'payments' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginBottom: '25px' }}>পেমেন্ট ম্যানেজমেন্ট</h3>
            
            {loadingPayments ? (
              <p>লোড হচ্ছে...</p>
            ) : !Array.isArray(payments) || payments.length === 0 ? (
              <p style={{ color: '#666' }}>কোনো পেমেন্ট পাওয়া যায়নি</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--light-gray)' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>তারিখ</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>ব্যবহারকারী</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>প্যাকেজ</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>পেমেন্ট মেথড</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>ট্রানজ্যাকশন আইডি</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>টাকা</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>স্ট্যাটাস</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment: any) => (
                      <tr key={payment.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                        <td style={{ padding: '12px' }}>
                          {new Date(payment.created_at).toLocaleDateString('bn-BD')}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {payment.customer_name || payment.user?.name || 'N/A'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {payment.subscription?.package?.name || 'N/A'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {payment.payment_method?.toUpperCase()}
                        </td>
                        <td style={{ padding: '12px' }}>{payment.transaction_id}</td>
                        <td style={{ padding: '12px' }}>৳{payment.amount}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: payment.status === 'verified' ? '#27ae60' : 
                              payment.status === 'approved' ? '#3498db' : 
                              payment.status === 'rejected' ? '#e74c3c' : '#f39c12',
                            color: 'white',
                            fontSize: '12px'
                          }}>
                            {payment.status === 'verified' ? 'ভেরিফাইড' : 
                             payment.status === 'approved' ? 'অনুমোদিত' : 
                             payment.status === 'rejected' ? 'প্রত্যাখ্যাত' : 'অপেক্ষায়'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {payment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprovePayment(payment.id)}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  অনুমোদন
                                </button>
                                <button
                                  onClick={() => handleVerifyPayment(payment.id)}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                  }}
                                >
                                  ভেরিফাই
                                </button>
                              </>
                            )}
                            {payment.status === 'approved' && (
                              <button
                                onClick={() => handleVerifyPayment(payment.id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#27ae60',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                ভেরিফাই
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}