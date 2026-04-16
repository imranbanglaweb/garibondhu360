'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

interface User {
  id: number;
  name: string;
  email: string;
  cell_phone: string;
  role: string;
  department: string;
  designation: string;
  created_at: string;
}

export default function UsersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, per_page: 20, total: 0, last_page: 1 });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'admin' || user?.role === 'transport_admin')) {
      fetchUsers();
    }
  }, [isAuthenticated, pagination.page, roleFilter]);

  const fetchUsers = async () => {
    setLoadingData(true);
    try {
      const params: any = { page: pagination.page, per_page: pagination.per_page };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      
      const response = await usersAPI.list(params);
      setUsers(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        last_page: response.data.last_page,
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return '#E74C3C';
      case 'transport_admin': return '#9B59B6';
      case 'department_head': return '#3498DB';
      case 'employee': return '#27AE60';
      case 'driver': return '#F39C12';
      default: return '#95A5A6';
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
          <h1>ব্যবহারকারী ব্যবস্থাপনা</h1>
          <p style={{ color: '#666' }}>সকল ব্যবহারকারীদের তালিকা</p>
        </div>

        {/* Filters */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '15px', 
          boxShadow: 'var(--shadow)',
          marginBottom: '30px'
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                placeholder="সার্চ করুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">সব ভূমিকা</option>
                <option value="admin">অ্যাডমিন</option>
                <option value="transport_admin">পরিবহন অ্যাডমিন</option>
                <option value="department_head">বিভাগীয় প্রধান</option>
                <option value="employee">কর্মচারী</option>
                <option value="driver">চালক</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px 25px' }}
            >
              সার্চ
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '15px', 
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>মোট ব্যবহারকারী: {pagination.total}</h3>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--light-gray)' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>নাম</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>ইমেইল</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>ফোন</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>ভূমিকা</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>বিভাগ</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>পদবি</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                  <td style={{ padding: '12px' }}>{user.name}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{user.cell_phone}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 12px', 
                      borderRadius: '20px',
                      backgroundColor: getRoleBadgeColor(user.role),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{user.department || '-'}</td>
                  <td style={{ padding: '12px' }}>{user.designation || '-'}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                    কোন ব্যবহারকারী পাওয়া যায়নি
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