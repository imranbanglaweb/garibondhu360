import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Pricing() {
  return (
    <>
      <Header />
      
      <section className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1>আমাদের <span>প্রাইসিং</span></h1>
            <p className="hero-text">
              আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন।
            </p>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="services-grid">
          <div className="service-card" style={{ textAlign: 'center' }}>
            <div className="service-icon">🚀</div>
            <h3>বেসিক</h3>
            <h2 style={{ color: 'var(--primary-orange)', margin: '10px 0' }}>৳৩,০০০/মাস</h2>
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: '0' }}>
              <li>✓ ৫টি গাড়ি</li>
              <li>✓ ১০ জন চালক</li>
              <li>✓ বেসিক রিপোর্ট</li>
              <li>✓ ইমেইল সাপোর্ট</li>
            </ul>
            <Link href="/register" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
              এখনই শুরু করুন
            </Link>
          </div>
          
          <div className="service-card" style={{ textAlign: 'center', border: '2px solid var(--primary-orange)' }}>
            <div className="service-icon">⭐</div>
            <h3>প্রো</h3>
            <h2 style={{ color: 'var(--primary-orange)', margin: '10px 0' }}>৫,০০০/মাস</h2>
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: '0' }}>
              <li>✓ ২০টি গাড়ি</li>
              <li>✓ ৫০ জন চালক</li>
              <li>✓ অ্যাডভান্সড রিপোর্ট</li>
              <li>✓ প্রায়োরিটি সাপোর্ট</li>
              <li>✓ মাল্টি-অ্যাপ্রুভাল</li>
            </ul>
            <Link href="/register" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
              এখনই শুরু করুন
            </Link>
          </div>
          
          <div className="service-card" style={{ textAlign: 'center' }}>
            <div className="service-icon">👑</div>
            <h3>এন্টারপ্রাইজ</h3>
            <h2 style={{ color: 'var(--primary-orange)', margin: '10px 0' }}>যোগাযোগ করুন</h2>
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: '0' }}>
              <li>✓ অসীম গাড়ি</li>
              <li>✓ অসীম চালক</li>
              <li>✓ কাস্টম রিপোর্ট</li>
              <li>✓ ২৪/৭ সাপোর্ট</li>
              <li>✓ ডেডিকেটেড ম্যানেজার</li>
            </ul>
            <Link href="/contact" className="btn btn-secondary" style={{ marginTop: '20px', display: 'inline-block' }}>
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
