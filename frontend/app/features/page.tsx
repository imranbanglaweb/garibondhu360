import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Features() {
  return (
    <>
      <Header />
      
      <section className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1>আমাদের <span>ফিচারসমূহ</span></h1>
            <p className="hero-text">
              গাড়িবন্ধু ৩৬০ এর সমস্ত আধুনিক ফিচার সম্পর্কে জানুন।
            </p>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📱</div>
            <h3>মোবাইল ফ্রেন্ডলি</h3>
            <p>যেকোনো মোবাইল ডিভাইস থেকে সহজে অ্যাক্সেস করুন</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🔒</div>
            <h3>নিরাপত্তা</h3>
            <p>ডাটা এনক্রিপশন এবং সুরক্ষিত লগইন সিস্টেম</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">⚡</div>
            <h3>দ্রুত পারফরম্যান্স</h3>
            <p>অপ্টিমাইজড কোড দিয়ে তৈরি, দ্রুত লোড টাইম</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>বাংলা ভাষা সাপোর্ট</h3>
            <p>সম্পূর্ণ বাংলা ইন্টারফেস, বাংলাদেশের জন্য ডিজাইন</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📈</div>
            <h3>রিয়েল-টাইম আপডেট</h3>
            <p>সবসময় লাইভ ডাটা, তাৎক্ষণিক আপডেট</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🎯</div>
            <h3>কাস্টমাইজড রিপোর্ট</h3>
            <p>আপনার প্রয়োজন অনুযায়ী কাস্টম রিপোর্ট তৈরি করুন</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
