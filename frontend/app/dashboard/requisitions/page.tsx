'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { requisitionsAPI, subscriptionAPI } from '../../services/api';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

interface Requisition {
  id: number;
  requisition_number: string;
  destination: string;
  travel_date: string;
  return_date: string;
  status: string;
  department: string;
  purpose: string;
  created_at: string;
}

export default function RequisitionsPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, per_page: 15, total: 0, last_page: 1 });
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequisitions();
      fetchSubscription();
    }
  }, [isAuthenticated, pagination.page, statusFilter]);

  const fetchSubscription = async () => {
    try {
      const subRes = await subscriptionAPI.myActiveSubscription();
      setSubscription(subRes.data);
    } catch (e) {
      console.log('No active subscription');
    }
  };

  const fetchRequisitions = async () => {
    setLoadingData(true);
    try {
      const params: any = { page: pagination.page, per_page: pagination.per_page };
      if (statusFilter) params.status = statusFilter;
      
      const response = await requisitionsAPI.list(params);
      setRequisitions(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        last_page: response.data.last_page,
      }));
    } catch (error) {
      console.error('Failed to fetch requisitions:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'var(--secondary-green)';
      case 'pending': return 'var(--accent-yellow)';
      case 'rejected': return 'var(--accent-red)';
      case 'completed': return 'var(--primary-navy)';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'অ্যাপ্রুভড';
      case 'pending': return 'পেন্ডিং';
      case 'rejected': return 'রিজেক্টেড';
      case 'completed': return 'সম্পন্ন';
      default: return status;
    }
  };

  const canManageUsers = user?.role === 'admin' || user?.role === 'transport_admin';
  const canApprove = user?.role === 'admin' || user?.role === 'transport_admin' || user?.role === 'department_head';

  const handleApprove = async (id: number) => {
    try {
      await requisitionsAPI.update(id, { status: 'approved' });
      fetchRequisitions();
    } catch (error) {
      console.error('Failed to approve requisition:', error);
    }
  };

  if (loading || loadingData) {
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

  return (
    <div className="dashboard">
      <Sidebar canManageUsers={canManageUsers} />

      <main className="main-content">
        {/* Subscription Notice */}
        {subscription && (
          <div style={{
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            padding: '15px 20px',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>আপনার প্যাকেজ: <strong>{subscription.package?.name}</strong></div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>
                মেয়াদ: {subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </div>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              গাড়ি লিমিট: {subscription.package?.vehicle_limit === 999999 ? 'অসীম' : subscription.package?.vehicle_limit} | চালক লিমিট: {subscription.package?.driver_limit === 999999 ? 'অসীম' : subscription.package?.driver_limit}
            </div>
          </div>
        )}

        {/* No Subscription Notice */}
        {!subscription && (
          <div style={{
            background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
            padding: '15px 20px',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>আপনার কোন সাবস্ক্রিপশন নেই!</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>রিকুইজিশন তৈরি করতে প্যাকেজ কিনুন</div>
            </div>
            <Link href="/pricing" style={{
              background: 'white',
              color: '#fd7e14',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              প্যাকেজ কিনুন
            </Link>
          </div>
        )}

        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1>রিকুইজিশন</h1>
            <p style={{ color: '#666' }}>আপনার সকল রিকুইজিশনের তালিকা</p>
          </div>
          {subscription && (
            <Link href="/dashboard/requisitions/new" style={{
              background: 'linear-gradient(135deg, var(--primary-orange) 0%, #e55a2a 100%)',
              padding: '12px 25px',
              borderRadius: '10px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              + নতুন রিকুইজিশন
            </Link>
          )}
        </div>

        {/* Filters */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '15px', 
          boxShadow: 'var(--shadow)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ minWidth: '150px' }}>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">সব স্ট্যাটাস</option>
                <option value="pending">পেন্ডিং</option>
                <option value="approved">অ্যাপ্রুভড</option>
                <option value="rejected">রিজেক্টেড</option>
                <option value="completed">সম্পন্ন</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ color: '#666' }}>মোট: {pagination.total}টি রিকুইজিশন</span>
            </div>
          </div>
        </div>

        {/* Requisitions Table */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px', 
          boxShadow: 'var(--shadow)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--light-gray)' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>নম্বর</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>বিভাগ</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>গন্তব্য</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>তারিখ</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>স্ট্যাটাস</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{req.requisition_number}</td>
                  <td style={{ padding: '12px' }}>{req.department}</td>
                  <td style={{ padding: '12px' }}>{req.destination}</td>
                  <td style={{ padding: '12px' }}>{req.travel_date}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 12px', 
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(req.status),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getStatusLabel(req.status)}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Link href={`/dashboard/requisitions/${req.id}`} style={{ color: 'var(--primary-orange)', marginRight: '10px' }}>
                      দেখুন
                    </Link>
                    {canApprove && req.status === 'pending' && (
                      <button 
                        onClick={() => handleApprove(req.id)}
                        style={{ color: 'var(--secondary-green)', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}
                      >
                        অনুমোদন
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requisitions.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                    কোন রিকুইজিশন পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn btn-secondary"
                style={{ padding: '8px 15px' }}
              >
                আগে
              </button>
              <span style={{ padding: '8px 15px' }}>
                পৃষ্ঠা {pagination.page} / {pagination.last_page}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.last_page}
                className="btn btn-secondary"
                style={{ padding: '8px 15px' }}
              >
                পরে
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}