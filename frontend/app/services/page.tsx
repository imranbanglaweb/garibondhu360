import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Services() {
  return (
    <>
      <Header />
      
      <section className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1>আমাদের <span>সেবাসমূহ</span></h1>
            <p className="hero-text">
              গাড়িবন্ধু ৩৬০ আপনার ফ্লিট ম্যানেজমেন্টের জন্য বিস্তৃত সেবা প্রদান করে।
            </p>
          </div>
        </div>
      </section>

      <section className="services">
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          🏢 কর্পোরেট সেবা
        </h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🏢</div>
            <h3>ফ্লিট ম্যানেজমেন্ট সলিউশন</h3>
            <p>প্রতিষ্ঠানের সম্পূর্ণ গাড়ির পার্ক একটি প্ল্যাটফর্মে পরিচালনা করুন</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🔄</div>
            <h3>অটোমেশন সার্ভিস</h3>
            <p>রিকুইজিশন থেকে ট্রিপ শিট — সব প্রক্রিয়া স্বয়ংক্রিয়</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📊</div>
            <h3>বিশ্লেষণ সেবা</h3>
            <p>আপনার ফ্লিটের কার্যকারিতা বিশ্লেষণ করে প্রতিবেদন প্রদান</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">💼</div>
            <h3>কনসালট্যান্সি</h3>
            <p>ফ্লিট অপ্টিমাইজেশন ও কস্ট রিডাকশন পরামর্শ</p>
          </div>
        </div>
      </section>

      <section className="services" style={{ backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          🔧 প্রযুক্তিগত সহায়তা
        </h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🖥️</div>
            <h3>ওয়েব অ্যাপ্লিকেশন</h3>
            <p>আধুনিক ওয়েব অ্যাপ্লিকেশন যেকোনো ব্রাউজারে ব্যবহারযোগ্য</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">☁️</div>
            <h3>ক্লাউড হোস্টিং</h3>
            <p>নিরাপদ ও দ্রুত ক্লাউড সার্ভারে আপনার ডাটা সংরক্ষিত</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🔐</div>
            <h3>ডাটা সিকিউরিটি</h3>
            <p>এনক্রিপশন প্রযুক্তি দিয়ে আপনার গোপনীয়তা রক্ষা</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🔄</div>
            <h3>রেগুলার আপডেট</h3>
            <p>নতুন ফিচার ও সিকিউরিটি প্যাচ নিয়মিত আপডেট</p>
          </div>
        </div>
      </section>

      <section className="services">
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          👥 গ্রাহক সেবা
        </h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📞</div>
            <h3>২৪/৭ সাপোর্ট</h3>
            <p>যেকোনো সমস্যায় আমাদের টিম সবসময় প্রস্তুত</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📚</div>
            <h3>ট্রেনিং সেশন</h3>
            <p>সিস্টেম ব্যবহারের উপর বিস্তৃত প্রশিক্ষণ প্রদান</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📝</div>
            <h3>ডকুমেন্টেশন</h3>
            <p>বিস্তারিত ইউজার ম্যানুয়াল ও ভিডিও টিউটোরিয়াল</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">⚡</div>
            <h3>দ্রুত রেসপন্স</h3>
            <p>আপনার যেকোনো প্রশ্নের দ্রুত উত্তর</p>
          </div>
        </div>
      </section>

      <section className="services" style={{ backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          💰 মূল্য নির্ধারণ
        </h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🎁</div>
            <h3>ফ্রি ট্রায়াল</h3>
            <p>১৪ দিনের সম্পূর্ণ ফ্রি ট্রায়াল — কোনো ক্রেডিট কার্ড নেই</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">💵</div>
            <h3>সাশ্রয়ী মূল্য</h3>
            <p>প্রতিষ্ঠানের আকার অনুযায়ী কম মূল্যে সেবা</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🆓</div>
            <h3>ফ্রি সেটআপ</h3>
            <p>কোনো অতিরিক্ত খরচ ছাড়াই বিনামূল্যে সেটআপ সহায়তা</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">↩️</div>
            <h3>মানি-ব্যাক গ্যারান্টি</h3>
            <p>৩০ দিনের মধ্যে ফেরতের সুযোগ</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
