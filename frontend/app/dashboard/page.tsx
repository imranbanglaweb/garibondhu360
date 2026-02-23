'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentRequisitions, setRecentRequisitions] = useState<any[]>([]);
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
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoadingData(false);
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
        <div style={{ marginBottom: '30px' }}>
          <h1>স্বাগতম, {user?.name}!</h1>
          <p style={{ color: '#666' }}>আপনার ফ্লিট ম্যানেজমেন্ট ড্যাশবোর্ড</p>
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
        </div>

        {/* Recent Requisitions */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: 'var(--shadow)' }}>
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
                      backgroundColor: req.status === 'approved' ? 'var(--secondary-green)' : 
                                     req.status === 'pending' ? 'var(--accent-yellow)' : 
                                     req.status === 'rejected' ? 'var(--accent-red)' : 'gray',
                      color: 'white',
                      fontSize: '0.8rem'
                    }}>
                      {req.status === 'approved' ? 'অ্যাপ্রুভড' : 
                       req.status === 'pending' ? 'পেন্ডিং' : 
                       req.status === 'rejected' ? 'রিজেক্টেড' : req.status}
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
