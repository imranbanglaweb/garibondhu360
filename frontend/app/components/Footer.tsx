import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" style={{ 
      background: 'linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%)',
      color: '#fff',
      padding: '80px 5% 20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '50px'
      }}>
        <div style={{ gridColumn: 'span 2' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <img 
              src="/images/logo.png" 
              alt="গাড়িবন্ধু ৩৬০" 
              style={{ width: '200px', marginBottom: '20px' }} 
            />
          </Link>
          <p style={{ 
            lineHeight: '1.8', 
            opacity: 0.85, 
            maxWidth: '400px',
            fontSize: '15px'
          }}>
            বাংলাদেশের সম্পূর্ণ ট্রান্সপোর্ট ম্যানেজমেন্ট সিস্টেম। গাড়ি, চালক, জিপিএস ট্র্যাকিং, রিকুইজিশন, এআই মেইনটেন্যান্স — সবকিছু এক প্ল্যাটফর্মে।
          </p>
          <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
            <a href="#" style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>📘</a>
            <a href="#" style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>🐦</a>
            <a href="#" style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>💼</a>
            <a href="#" style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>▶️</a>
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '25px', color: '#FF6B35' }}>লিংক</h3>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2' }}>
            <li><Link href="/services" style={{ color: '#fff', opacity: 0.85, textDecoration: 'none' }}>সেবাসমূহ</Link></li>
            <li><Link href="/features" style={{ color: '#fff', opacity: 0.85, textDecoration: 'none' }}>ফিচারসমূহ</Link></li>
            <li><Link href="/pricing" style={{ color: '#fff', opacity: 0.85, textDecoration: 'none' }}>প্রাইসিং</Link></li>
            <li><Link href="/contact" style={{ color: '#fff', opacity: 0.85, textDecoration: 'none' }}>যোগাযোগ</Link></li>
            <li><Link href="/demo" style={{ color: '#fff', opacity: 0.85, textDecoration: 'none' }}>ডেমো</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '25px', color: '#FF6B35' }}>যোগাযোগ</h3>
          <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.5' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.85 }}>
              <span>📍</span> ঢাকা, বাংলাদেশ
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.85 }}>
              <span>📞</span> +880 1918329829
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.85 }}>
              <span>✉️</span> info@garibondhu360.com
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.85 }}>
              <span>🌐</span> www.garibondhu360.com
            </li>
          </ul>
        </div>
      </div>
      
      <div style={{ 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '20px',
        textAlign: 'center',
        opacity: 0.7,
        fontSize: '14px'
      }}>
        <p>© ২০২৬ গাড়িবন্ধু ৩৬০। সর্বস্বত্ব সংরক্ষিত। <span style={{ margin: '0 10px' }}>|</span> <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>গোপনীয়তা নীতি</a> <span style={{ margin: '0 10px' }}>|</span> <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>শর্তাবলী</a></p>
      </div>
    </footer>
  );
}