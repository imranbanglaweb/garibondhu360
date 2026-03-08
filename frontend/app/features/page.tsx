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
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          🚗 যানবাহন ব্যবস্থাপনা
        </h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🚙</div>
            <h3>গাড়ির তথ্য রেকর্ড</h3>
            <p>গাড়ির সব তথ্য ডিজিটাল রেকর্ড: নম্বর প্লেট, মডেল, কোম্পানি, ক্রয় তারিখ, রেজিস্ট্রেশন</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📋</div>
            <h3>ডকুমেন্ট ম্যানেজমেন্ট</h3>
            <p>ফিটনেস, ট্যাক্স টোকেন, রেজিস্ট্রেশন, ইন্সুরেন্স — সব ডকুমেন্টের মেয়াদ ট্র্যাকিং</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🔧</div>
            <h3>সার্ভিস ও রক্ষণাবেক্ষণ</h3>
            <p>সার্ভিস হিস্টোরি, মেরামতের রেকর্ড, স্পেয়ার পার্টস ট্র্যাকিং</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">⛽</div>
            <h3>জ্বালানি ব্যবস্থাপনা</h3>
            <p>জ্বালানি খরচ রেকর্ড, মাইলেজ ট্র্যাকিং, ফুয়েল কার্ড ম্যানেজমেন্ট</p>
          </div>
        </div>
      </section>

      <section className="services" style={{ backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          🧑‍✈️ চালক ব্যবস্থাপনা
        </h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">👤</div>
            <h3>চালক প্রোফাইল</h3>
            <p>চালকের সম্পূর্ণ তথ্য: নাম, ফোন, ঠিকানা, জন্ম তারিখ, রক্তের গ্রুপ</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🪪</div>
            <h3>লাইসেন্স ম্যানেজমেন্ট</h3>
            <p>ড্রাইভিং লাইসেন্সের তথ্য, মেয়াদ ট্র্যাকিং,-auto রিমাইন্ডার</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">⭐</div>
            <h3>পারফরম্যান্স রেটিং</h3>
            <p>চালকের কাজের মূল্যায়ন, ড্রাইভিং রেকর্ড, দুর্ঘটনার ইতিহাস</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📅</div>
            <h3>ডিউটি শিডিউল</h3>
            <p>চালকের ডিউটি রোস্টার, ছুটির হিসাব, অতিরিক্ত সময় ট্র্যাকিং</p>
          </div>
        </div>
      </section>

      <section className="services">
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          📝 রিকুইজিশন সিস্টেম
        </h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📨</div>
            <h3>অনলাইন আবেদন</h3>
            <p>যেকোনো জায়গা থেকে গাড়ির জন্য আবেদন করুন, তারিখ ও সময় নির্বাচন করুন</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">✅</div>
            <h3>মাল্টি-লেভেল অ্যাপ্রুভাল</h3>
            <p>বিভাগীয় প্রধান ও পরিবহন অ্যাডমিনের দ্বি-স্তর অনুমোদন প্রক্রিয়া</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📊</div>
            <h3>রিকুইজিশন ট্র্যাকিং</h3>
            <p>আবেদনের স্ট্যাটাস দেখুন: পেন্ডিং, অনুমোদিত, প্রত্যাখ্যাত</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🗓️</div>
            <h3>ট্রিপ শিট</h3>
            <p>অনুমোদিত রিকুইজিশন থেকে স্বয়ংক্রিয় ট্রিপ শিট তৈরি</p>
          </div>
        </div>
      </section>

      <section className="services" style={{ backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          📈 রিপোর্ট ও অ্যানালিটিক্স
        </h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📉</div>
            <h3>খরচ বিশ্লেষণ</h3>
            <p>গাড়ির জ্বালানি, মেরামত, রক্ষণাবেক্ষণ — সব খরচের বিস্তারিত বিশ্লেষণ</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📊</div>
            <h3>ব্যবহার রিপোর্ট</h3>
            <p>কোন গাড়ি কতটা ব্যবহৃত হয়েছে, কোন সময়ে সবচেয়ে বেশি চাহিদা</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🎯</div>
            <h3>কাস্টম রিপোর্ট</h3>
            <p>আপনার প্রয়োজন অনুযায়ী কাস্টম রিপোর্ট তৈরি করুন</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📤</div>
            <h3>এক্সপোর্ট ফ্যাসিলিটি</h3>
            <p>রিপোর্ট Excel, PDF, CSV ফরম্যাটে ডাউনলোড করুন</p>
          </div>
        </div>
      </section>

      <section className="services">
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          ⚙️ সিস্টেম ফিচার
        </h2>
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
            <div className="service-icon">🔔</div>
            <h3>স্মার্ট নোটিফিকেশন</h3>
            <p>সার্ভিস রিমাইন্ডার, ডকুমেন্টের মেয়াদ, রিকুইজিশনের স্ট্যাটাস সব নোটিফিকেশন</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">👥</div>
            <h3>ইউজার ম্যানেজমেন্ট</h3>
            <p>রোল-ভিত্তিক অ্যাক্সেস কন্ট্রোল, এডমিন, ম্যানেজার, ইউজার</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
