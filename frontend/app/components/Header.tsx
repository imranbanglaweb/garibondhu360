'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    await logout();
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
              <button onClick={handleLogout} className="btn-register">লগআউট</button>
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
