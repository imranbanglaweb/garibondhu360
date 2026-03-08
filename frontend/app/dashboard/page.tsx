'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, subscriptionAPI } from '../services/api';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentRequisitions, setRecentRequisitions] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, requisitionsRes] = await Promise.all([
        dashboardAPI.stats(),
        dashboardAPI.recentRequisitions(),
      ]);
      setStats(statsRes.data);
      setRecentRequisitions(requisitionsRes.data);
      
      // Fetch subscription data
      try {
        const subRes = await subscriptionAPI.myActiveSubscription();
        setSubscription(subRes.data);
      } catch (e) {
        // User might not have subscription
        console.log('No active subscription');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoadingData(false);
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
          <li><Link href="/dashboard/requisitions">রিকুইজিশন</Link></li>
          <li><Link href="/dashboard/vehicles">গাড়ি</Link></li>
          <li><Link href="/dashboard/drivers">চালক</Link></li>
          <li><Link href="/dashboard/reports">রিপোর্ট</Link></li>
          <li><Link href="/dashboard/settings">সেটিংস</Link></li>
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
              padding: '15px 25px',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>সাবস্ক্রিপশন</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{subscription.package?.name}</div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>
                {subscription.status === 'active' ? 'সক্রিয়' : 'মেয়াদ শেষ'}
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
            <Link href="/dashboard/profile" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}>
              প্রোফাইল
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>মোট রিকুইজিশন</h4>
            <div className="value">{stats?.total_requisitions || 0}</div>
          </div>
          <div className="stat-card">
            <h4>পেন্ডিং</h4>
            <div className="value" style={{ color: 'var(--accent-yellow)' }}>{stats?.pending_requisitions || 0}</div>
          </div>
          <div className="stat-card">
            <h4>অ্যাপ্রুভড</h4>
            <div className="value" style={{ color: 'var(--secondary-green)' }}>{stats?.approved_requisitions || 0}</div>
          </div>
          <div className="stat-card">
            <h4>সম্পন্ন</h4>
            <div className="value" style={{ color: 'var(--primary-navy)' }}>{stats?.completed_requisitions || 0}</div>
          </div>
          <div className="stat-card">
            <h4>মোট গাড়ি</h4>
            <div className="value">{stats?.total_vehicles || 0}</div>
          </div>
          <div className="stat-card">
            <h4>উপলব্ধ গাড়ি</h4>
            <div className="value" style={{ color: 'var(--secondary-green)' }}>{stats?.available_vehicles || 0}</div>
          </div>
          <div className="stat-card">
            <h4>মোট চালক</h4>
            <div className="value">{stats?.total_drivers || 0}</div>
          </div>
          <div className="stat-card">
            <h4>উপলব্ধ চালক</h4>
            <div className="value" style={{ color: 'var(--secondary-green)' }}>{stats?.available_drivers || 0}</div>
          </div>
        </div>

        {/* Recent Requisitions */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow)', marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>সাম্প্রতিক রিকুইজিশন</h3>
            <Link href="/dashboard/requisitions" style={{ color: 'var(--primary-orange)' }}>সব দেখুন</Link>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--light-gray)' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>রিকুইজিশন নম্বর</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>বিভাগ</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>গন্তব্য</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>তারিখ</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {recentRequisitions.map((req: any) => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                  <td style={{ padding: '10px' }}>{req.requisition_number}</td>
                  <td style={{ padding: '10px' }}>{req.department}</td>
                  <td style={{ padding: '10px' }}>{req.destination}</td>
                  <td style={{ padding: '10px' }}>{req.travel_date}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      padding: '5px 10px', 
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(req.status),
                      color: 'white',
                      fontSize: '0.8rem'
                    }}>
                      {getStatusLabel(req.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {recentRequisitions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>কোন রিকুইজিশন নেই</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
