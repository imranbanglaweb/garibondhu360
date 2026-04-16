'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  canManageUsers?: boolean;
  children?: React.ReactNode;
}

export default function Sidebar({ canManageUsers = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (path: string) => pathname === path;

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

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <img src="/images/logo.png" alt="গাড়িবন্ধু ৩৬০" style={{ width: '55px', height: '55px' }} />
          </div>
          <div className="brand-info">
            <h2>গাড়িবন্ধু ৩৬০</h2>
            <p>ট্রান্সপোর্ট ম্যানেজমেন্ট</p>
          </div>
        </div>
        
        <div className="menu-section">
          <span className="menu-label">মূল মেনু</span>
          <ul className="sidebar-menu">
            <li>
              <Link href="/dashboard" className={`menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
                <span className="icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                </span>
                <span className="menu-text">ড্যাশবোর্ড</span>
                <span className="active-indicator"></span>
              </Link>
            </li>
            {canManageUsers && (
              <li>
                <Link href="/dashboard/users" className={`menu-item ${isActive('/dashboard/users') ? 'active' : ''}`}>
                  <span className="icon-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </span>
                  <span className="menu-text">ব্যবহারকারী</span>
                  <span className="active-indicator"></span>
                </Link>
              </li>
            )}
            <li>
              <Link href="/payment" className={`menu-item ${isActive('/payment') ? 'active' : ''}`}>
                <span className="icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </span>
                <span className="menu-text">পেমেন্ট</span>
                <span className="active-indicator"></span>
              </Link>
            </li>
            <li>
              <Link href="/pricing" className={`menu-item ${isActive('/pricing') ? 'active' : ''}`}>
                <span className="icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/></svg>
                </span>
                <span className="menu-text">সাবস্ক্রিপশন</span>
                <span className="active-indicator"></span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="menu-section">
          <span className="menu-label">সেটিংস</span>
          <ul className="sidebar-menu">
            <li>
              <Link href="/dashboard/settings" className={`menu-item ${isActive('/dashboard/settings') ? 'active' : ''}`}>
                <span className="icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </span>
                <span className="menu-text">সেটিংস</span>
                <span className="active-indicator"></span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <button 
            onClick={handleLogout} 
            className="logout-btn"
            disabled={loggingOut}
          >
            <span className="icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </span>
            <span className="menu-text">{loggingOut ? 'যদি...' : 'লগআউট'}</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        .sidebar { 
          width: 280px; 
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%); 
          padding: 0; 
          position: fixed; 
          height: 100vh; 
          box-shadow: 4px 0 20px rgba(0,0,0,0.08); 
          z-index: 100; 
          overflow-y: auto;
          border-right: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
        }
        
        .sidebar-header { 
          padding: 28px 24px; 
          border-bottom: 1px solid #E2E8F0; 
          display: flex; 
          align-items: center; 
          gap: 14px;
          background: linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%);
          flex-shrink: 0;
        }
        
        .logo-wrapper {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .logo-wrapper img {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }
        
        .brand-info h2 { 
          color: white; 
          font-size: 18px; 
          margin: 0; 
          font-weight: 700; 
          letter-spacing: -0.5px;
        }
        
        .brand-info p { 
          color: rgba(255,255,255,0.8); 
          font-size: 11px; 
          margin: 4px 0 0; 
        }
        
        .menu-section {
          padding: 16px 16px 8px;
        }
        
        .menu-label {
          display: block;
          color: #94A3B8;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          padding-left: 12px;
        }
        
        .sidebar-menu { 
          padding: 0; 
        }
        
        .sidebar-menu li { 
          margin-bottom: 6px; 
        }
        
        .menu-item { 
          display: flex; 
          align-items: center; 
          gap: 14px; 
          padding: 14px 16px; 
          border-radius: 12px; 
          color: #64748B; 
          font-size: 14px; 
          font-weight: 500; 
          transition: all 0.25s ease; 
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }
        
        .menu-item:hover { 
          background: linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,107,53,0.04) 100%); 
          color: #FF6B35;
          transform: translateX(4px);
        }
        
        .menu-item.active { 
          background: linear-gradient(135deg, #FF6B35 0%, #e55a2a 100%); 
          color: white;
          box-shadow: 0 4px 15px rgba(255,107,53,0.35);
        }
        
        .menu-item.active .icon-wrapper {
          background: rgba(255,255,255,0.2);
        }
        
        .icon-wrapper {
          width: 40px;
          height: 40px;
          background: #F1F5F9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        
        .menu-item:hover .icon-wrapper {
          background: rgba(255,107,53,0.15);
          color: #FF6B35;
        }
        
        .menu-text {
          flex: 1;
        }
        
        .active-indicator {
          width: 6px;
          height: 6px;
          background: #FF6B35;
          border-radius: 50%;
          opacity: 0;
          transition: all 0.25s ease;
        }
        
        .menu-item.active .active-indicator {
          opacity: 1;
          background: white;
          box-shadow: 0 0 8px rgba(255,255,255,0.5);
        }
        
        .sidebar-footer {
          margin-top: auto;
          padding: 16px;
          border-top: 1px solid #E2E8F0;
        }
        
        .logout-btn {
          display: flex; 
          align-items: center; 
          gap: 14px; 
          padding: 14px 16px; 
          border-radius: 12px; 
          color: #dc2626; 
          font-size: 14px; 
          font-weight: 500; 
          transition: all 0.25s ease; 
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          background: linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(220,38,38,0.04) 100%);
        }
        
        .logout-btn:hover { 
          background: linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(220,38,38,0.08) 100%); 
          transform: translateX(4px);
        }
        
        .logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      
      <style jsx global>{`
        @media (max-width: 1200px) {
          .sidebar { width: 80px !important; }
          .sidebar .brand-info,
          .sidebar .menu-label,
          .sidebar .menu-text { display: none !important; }
          .sidebar .menu-item,
          .sidebar .logout-btn { justify-content: center; padding: 14px; }
          .sidebar .sidebar-header { justify-content: center; padding: 20px; }
          .sidebar .logo-wrapper { width: 44px; height: 44px; }
          .sidebar .logo-wrapper img { width: 32px; height: 32px; }
        }
      `}</style>
    </>
  );
}