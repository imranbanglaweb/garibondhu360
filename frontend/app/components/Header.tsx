'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'হোম' },
    { href: '/services', label: 'সেবাসমূহ' },
    { href: '/features', label: 'ফিচার' },
    { href: '/pricing', label: 'প্রাইসিং' },
    { href: '/contact', label: 'যোগাযোগ' },
    { href: '/demo', label: 'ডেমো' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    await logout();
    router.push('/');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'অ্যাডমিন';
      case 'department_head': return 'বিভাগীয় প্রধান';
      case 'transport_admin': return 'পরিবহন অ্যাডমিন';
      default: return 'কর্মচারী';
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link href="/">
            <img src="/images/logo.png" alt="গাড়িবন্ধু ৩৬০" />
          </Link>
        </div>
        
        {/* Mobile Menu Icon */}
        <button 
          className={`mobile-menu-icon ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={isActive(link.href) ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="btn-login">ড্যাশবোর্ড</Link>
              
              {/* User Profile Dropdown */}
              <div className="user-profile-dropdown" ref={profileDropdownRef}>
                <button 
                  className="profile-trigger"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  type="button"
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user?.name}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: '5px', transition: 'transform 0.2s' }}>
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {profileDropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <div className="profile-dropdown-header">
                      <div className="profile-info">
                        <p className="profile-name">{user?.name}</p>
                        <p className="profile-email">{user?.email}</p>
                        <p className="profile-role">{getRoleLabel(user?.role || 'employee')}</p>
                      </div>
                    </div>
                    <div className="profile-dropdown-links">
                      <Link href="/dashboard/settings" onClick={() => setProfileDropdownOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        সেটিংস
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setProfileDropdownOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        সেটিংস
                      </Link>
                      <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
                      <button onClick={handleLogout} className="logout-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        লগআউট
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-login">লগইন</Link>
              <Link href="/register" className="btn-register">রেজিস্টার</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
