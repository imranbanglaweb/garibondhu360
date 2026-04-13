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
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                maxWidth: '800px',
                margin: '0 auto',
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src="https://www.youtube.com/embed/ICgS0FpfFq8"
                  title="Fleet Management System Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <div style={{ marginTop: '40px' }}>
              <p style={{ fontSize: '18px' }}>
                ডেমোর জন্য আমাদের সাথে যোগাযোগ করুন:
              </p>
              <p style={{ fontSize: '24px', color: 'var(--primary-orange)', marginTop: '10px' }}>
📞 +880 1918329829
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
