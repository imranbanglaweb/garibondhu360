import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/images/logo.png" alt="গাড়িবন্ধু ৩৬০ লোগো" />
          <div>
            <h1>গাড়িবন্ধু ৩৬০</h1>
            <p className="tagline">গাড়ির সব খবর, বন্ধুর মতো</p>
          </div>
        </div>
        
        <nav className="nav-menu">
          <Link href="/">হোম</Link>
          <Link href="/services">সেবাসমূহ</Link>
          <Link href="/features">ফিচার</Link>
          <Link href="/pricing">প্রাইসিং</Link>
          <Link href="/contact">যোগাযোগ</Link>
          
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="btn-login">ড্যাশবোর্ড</Link>
              <button onClick={logout} className="btn-register">লগআউট</button>
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
