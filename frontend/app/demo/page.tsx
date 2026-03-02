import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Demo() {
  return (
    <>
      <Header />
      
      <section className="hero" style={{ padding: '60px 0', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-container">
          <div className="hero-content" style={{ textAlign: 'center' }}>
            <h1>ডেমো <span>দেখুন</span></h1>
            <p className="hero-text">
              গাড়িবন্ধু ৩৬০ এর ডেমো দেখতে নিচের লিংকে ক্লিক করুন।
            </p>
            <div style={{ marginTop: '40px' }}>
              <div style={{ 
                background: '#f5f5f5', 
                padding: '20px', 
                borderRadius: '10px',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                <p style={{ fontSize: '18px', color: '#666' }}>
                  📹 ডেমো ভিডিও শীঘ্রই আপলোড করা হবে
                </p>
              </div>
            </div>
            <div style={{ marginTop: '40px' }}>
              <p style={{ fontSize: '18px' }}>
                ডেমোর জন্য আমাদের সাথে যোগাযোগ করুন:
              </p>
              <p style={{ fontSize: '24px', color: 'var(--primary-orange)', marginTop: '10px' }}>
                📞 +880 1XX-XXXXXXX
              </p>
              <p style={{ fontSize: '18px', color: 'var(--primary-orange)' }}>
                ✉️ demo@garibondhu360.com
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
