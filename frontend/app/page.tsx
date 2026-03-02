import Header from './components/Header';
import Footer from './components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>আপনার ফ্লিট ম্যানেজমেন্ট <span>এখন ডিজিটাল করুন</span></h1>
            <p className="hero-text">
              গাড়ি, চালক, রিকুইজিশন, অনুমোদন — সবকিছু এক প্ল্যাটফর্মে। 
              গাড়িবন্ধু ৩৬০ নিয়ে আসে সম্পূর্ণ অটোমেশন।
            </p>
            <div className="hero-buttons">
              <Link href="/register" className="btn btn-primary">ফ্রি ট্রায়াল শুরু করুন</Link>
              <Link href="/demo" className="btn btn-secondary">ডেমো দেখুন</Link>
            </div>
            <p className="small-text">১৫ দিনের ফ্রি ট্রায়াল, কোন ক্রেডিট কার্ড লাগবে না</p>
          </div>
          <div className="hero-image">
            <img src="/images/dashboard-preview.svg" alt="গাড়িবন্ধু ৩৬০ ড্যাশবোর্ড" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <h3>১০০+</h3>
          <p>সন্তুষ্ট গ্রাহক</p>
        </div>
        <div className="stat-item">
          <h3>৫০০+</h3>
          <p>গাড়ি ম্যানেজ</p>
        </div>
        <div className="stat-item">
          <h3>১০০০+</h3>
          <p>চালক রেজিস্টার্ড</p>
        </div>
        <div className="stat-item">
          <h3>২৪/৭</h3>
          <p>সাপোর্ট</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2 className="section-title">আমরা যা করি</h2>
        <p className="section-subtitle">আপনার ফ্লিট ম্যানেজমেন্টের সব সমস্যার সমাধান এক জায়গায়</p>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🚗</div>
            <h3>যানবাহন ব্যবস্থাপনা</h3>
            <p>গাড়ি রেজিস্ট্রেশন, কাগজপত্র, ফিটনেস, ইন্সুরেন্স — সবকিছু ডিজিটাল রেকর্ড</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🧑‍✈️</div>
            <h3>চালক ব্যবস্থাপনা</h3>
            <p>চালকের তথ্য, লাইসেন্সের মেয়াদ, পারফরম্যান্স ট্র্যাকিং</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📝</div>
            <h3>রিকুইজিশন সিস্টেম</h3>
            <p>গাড়ি চাওয়ার আবেদন, অনুমোদন প্রক্রিয়া, ট্রিপ শিট</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">✅</div>
            <h3>মাল্টি-লেভেল অ্যাপ্রুভাল</h3>
            <p>বিভাগীয় প্রধান ও পরিবহন অ্যাডমিনের দ্বি-স্তর অনুমোদন</p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/services" className="btn btn-primary">সব সেবা দেখুন</Link>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features">
        <h2 className="section-title">শক্তিশালী ফিচারসমূহ</h2>
        <p className="section-subtitle">আপনার ব্যবসাকে এগিয়ে নিতে যা যা দরকার</p>
        
        <div className="feature-row">
          <div className="feature-text">
            <h3>📊 ড্যাশবোর্ড ওভারভিউ</h3>
            <p>এক নজরে দেখুন কতগুলো রিকুইজিশন পেন্ডিং, কতগুলো অ্যাপ্রুভড, কতগুলো গাড়ি আছে, কতজন চালক আছে। আপনার পুরো ফ্লিটের অবস্থা বুঝতে পারবেন ৫ সেকেন্ডে।</p>
            <ul>
              <li>মোট রিকুইজিশন, পেন্ডিং, অ্যাপ্রুভড এক নজরে</li>
              <li>গাড়ি ও চালকের সংখ্যা রিয়েল-টাইম আপডেট</li>
              <li>দ্রুত অ্যাকশনের জন্য কুইক বাটন</li>
            </ul>
          </div>
          <div className="feature-image">
            <img src="/images/dashboard-feature.svg" alt="ড্যাশবোর্ড ফিচার" />
          </div>
        </div>
        
        <div className="feature-row reverse">
          <div className="feature-image">
            <img src="/images/requisition-feature.svg" alt="রিকুইজিশন ফিচার" />
          </div>
          <div className="feature-text">
            <h3>📝 স্মার্ট রিকুইজিশন সিস্টেম</h3>
            <p>কর্মচারীরা সহজেই গাড়ি চাওয়ার আবেদন করতে পারে। কোথায় যাবে, কখন যাবে, কেন যাবে — সব তথ্য দিয়ে আবেদন জমা দিন।</p>
            <ul>
              <li>ট্রাভেল ডেট, ডেস্টিনেশন সহ আবেদন</li>
              <li>রিয়েল-টাইম স্ট্যাটাস ট্র্যাকিং</li>
              <li>অটোমেটিক নোটিফিকেশন</li>
            </ul>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/features" className="btn btn-primary">সব ফিচার দেখুন</Link>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="pricing">
        <h2 className="section-title">সাশ্রয়ী মূল্যে প্রিমিয়াম সেবা</h2>
        <p className="section-subtitle">আপনার প্রয়োজন অনুযায়ী প্যাকেজ সিলেক্ট করুন</p>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-header starter">
              <h3>স্টার্টার</h3>
              <p className="price">১,৫০০ <span>টাকা/মাস</span></p>
            </div>
            <div className="pricing-body">
              <ul>
                <li>✅ ১০টি গাড়ি পর্যন্ত</li>
                <li>✅ ২০জন চালক পর্যন্ত</li>
                <li>✅ বেসিক রিপোর্ট</li>
                <li>✅ ইমেইল সাপোর্ট</li>
                <li style={{ opacity: 0.5 }}>❌ অ্যাডভান্স রিপোর্ট</li>
              </ul>
              <Link href="/register" className="btn-pricing">এই প্যাকেজ নিন</Link>
            </div>
          </div>
          
          <div className="pricing-card popular">
            <div className="popular-badge">সর্বাধিক বিক্রিত</div>
            <div className="pricing-header business">
              <h3>বিজনেস</h3>
              <p className="price">৩,৫০০ <span>টাকা/মাস</span></p>
            </div>
            <div className="pricing-body">
              <ul>
                <li>✅ ৫০টি গাড়ি পর্যন্ত</li>
                <li>✅ ১০০জন চালক পর্যন্ত</li>
                <li>✅ অ্যাডভান্স রিপোর্ট</li>
                <li>✅ ফোন + ইমেইল সাপোর্ট</li>
                <li>✅ এক্সপোর্ট (পিডিএফ/এক্সেল)</li>
              </ul>
              <Link href="/register" className="btn-pricing popular-btn">এই প্যাকেজ নিন</Link>
            </div>
          </div>
          
          <div className="pricing-card">
            <div className="pricing-header enterprise">
              <h3>এন্টারপ্রাইজ</h3>
              <p className="price">আলোচনা সাপেক্ষে</p>
            </div>
            <div className="pricing-body">
              <ul>
                <li>✅ আনলিমিটেড গাড়ি</li>
                <li>✅ আনলিমিটেড চালক</li>
                <li>✅ কাস্টমাইজড রিপোর্ট</li>
                <li>✅ ২৪/৭ প্রাইওরিটি সাপোর্ট</li>
                <li>✅ অন-সাইট ট্রেনিং</li>
              </ul>
              <Link href="/contact" className="btn-pricing">যোগাযোগ করুন</Link>
            </div>
          </div>
        </div>
        
        <div className="annual-offer">
          <p>🎉 বার্ষিক প্যাকেজে ২ মাস ফ্রি! বছরভিত্তিক পেমেন্ট করলে ২ মাসের সার্ভিস ফ্রি।</p>
        </div>
      </section>

      {/* Demo Section */}
      <section className="demo">
        <h2 className="section-title">ফ্রি ট্রায়াল শুরু করুন</h2>
        <p className="section-subtitle">১৫ দিনের জন্য সম্পূর্ণ সিস্টেম ব্যবহার করুন, কোন পেমেন্ট লাগবে না</p>
        
        <div className="demo-form">
          <form action="/demo-request" method="POST">
            <div className="form-row">
              <div className="form-group">
                <input type="text" name="name" placeholder="আপনার নাম *" required />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="ইমেইল *" required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input type="tel" name="phone" placeholder="ফোন নম্বর *" required />
              </div>
              <div className="form-group">
                <input type="text" name="company" placeholder="কোম্পানির নাম *" required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <select name="vehicles" required>
                  <option value="">কতটি গাড়ি আছে? *</option>
                  <option value="1-10">১-১০টি</option>
                  <option value="11-50">১১-৫০টি</option>
                  <option value="51-100">৫১-১০০টি</option>
                  <option value="100+">১০০+</option>
                </select>
              </div>
              <div className="form-group">
                <select name="drivers" required>
                  <option value="">কতজন চালক আছে? *</option>
                  <option value="1-10">১-১০জন</option>
                  <option value="11-50">১১-৫০জন</option>
                  <option value="51-100">৫১-১০০জন</option>
                  <option value="100+">১০০+</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className="btn-demo">ফ্রি ট্রায়াল শুরু করুন</button>
          </form>
          <p className="small-text" style={{ textAlign: 'center', marginTop: '15px' }}>* ফ্রি ট্রায়ালের পর কোন চার্জ হবে না। আপনি চাইলে বন্ধ করে দিতে পারেন।</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
