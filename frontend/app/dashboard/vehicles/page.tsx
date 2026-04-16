'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { vehiclesAPI } from '../../services/api';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

interface Vehicle {
  id: number;
  name: string;
  registration_number: string;
  type: string;
  model: string;
  capacity: number;
  status: string;
  created_at: string;
}

export default function VehiclesPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, per_page: 15, total: 0, last_page: 1 });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'transport_admin')) {
      fetchVehicles();
    } else if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user?.role, pagination.page, statusFilter]);

  const fetchVehicles = async () => {
    setLoadingData(true);
    try {
      const params: any = { page: pagination.page, per_page: pagination.per_page };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      
      const response = await vehiclesAPI.list(params);
      setVehicles(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        last_page: response.data.last_page,
      }));
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
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
      case 'available': return 'var(--secondary-green)';
      case 'in_use': return 'var(--accent-yellow)';
      case 'maintenance': return 'var(--accent-red)';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'উপলব্ধ';
      case 'in_use': return 'ব্যবহৃত';
      case 'maintenance': return 'মেইনটেন্যান্স';
      default: return status;
    }
  };

  const canManageUsers = user?.role === 'admin' || user?.role === 'transport_admin';

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

  if (!canManageUsers) {
    return (
      <div className="dashboard">
        <Sidebar canManageUsers={false} />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>অনুমোদন প্রয়োজন</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>এই পৃষ্ঠা দেখার জন্য অ্যাডমিন অধিকার প্রয়োজন।</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar canManageUsers={canManageUsers} />

      <main className="main-content">
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1>গাড়ি ব্যবস্থাপনা</h1>
            <p style={{ color: '#666' }}>সকল গাড়ির তালিকা</p>
          </div>
          <button style={{
            background: 'linear-gradient(135deg, var(--primary-orange) 0%, #e55a2a 100%)',
            padding: '12px 25px',
            borderRadius: '10px',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            + নতুন গাড়ি
          </button>
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
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                placeholder="সার্চ করুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchVehicles()}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
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
                <option value="available">উপলব্ধ</option>
                <option value="in_use">ব্যবহৃত</option>
                <option value="maintenance">মেইনটেন্যান্স</option>
              </select>
            </div>
            <button onClick={fetchVehicles} className="btn btn-primary" style={{ padding: '12px 25px' }}>
              সার্চ
            </button>
            <span style={{ color: '#666', marginLeft: 'auto' }}>মোট: {pagination.total}টি গাড়ি</span>
          </div>
        </div>

        {/* Vehicles Table */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px', 
          boxShadow: 'var(--shadow)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--light-gray)' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>নাম</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>রেজিস্ট্রেশন নম্বর</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>ধরন</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>মডেল</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>ধারণক্ষমতা</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{vehicle.name}</td>
                  <td style={{ padding: '12px' }}>{vehicle.registration_number}</td>
                  <td style={{ padding: '12px' }}>{vehicle.type}</td>
                  <td style={{ padding: '12px' }}>{vehicle.model}</td>
                  <td style={{ padding: '12px' }}>{vehicle.capacity}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 12px', 
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(vehicle.status),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getStatusLabel(vehicle.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                    কোন গাড়ি পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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