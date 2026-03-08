'use client';

import Header from './components/Header';
import Footer from './components/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { subscriptionAPI } from './services/api';

interface Package {
  id: number;
  name: string;
  price: number;
  vehicle_limit: number;
  driver_limit: number;
}

interface Stats {
  totalUsers: number;
  totalVehicles: number;
  totalDrivers: number;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([
    { id: 1, name: 'Starter', price: 1000, vehicle_limit: 2, driver_limit: 5 },
    { id: 2, name: 'Basic', price: 3000, vehicle_limit: 5, driver_limit: 10 },
    { id: 3, name: 'Pro', price: 5000, vehicle_limit: 20, driver_limit: 50 },
  ]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 150, totalVehicles: 500, totalDrivers: 1000 });

  useEffect(() => {
    fetchPackages();
    fetchStats();
  }, []);

  const fetchPackages = async () => {
    try {
      console.log('Fetching packages from API...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/packages`);
      const data = await response.json();
      console.log('Packages response:', data);
      
      if (data.success && data.data && data.data.length > 0) {
        // Get first 3 packages
        const pkgs = data.data.slice(0, 3).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price) || 0,
          vehicle_limit: parseInt(p.vehicle_limit) || 0,
          driver_limit: parseInt(p.driver_limit) || 0
        }));
        setPackages(pkgs);
        console.log('Packages updated:', pkgs);
      } else {
        console.log('No packages from API, keeping defaults');
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      // Keep default packages
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/public-stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({ totalUsers: 150, totalVehicles: 500, totalDrivers: 1000 });
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      vehicles: (form.elements.namedItem('vehicles') as HTMLSelectElement).value,
      drivers: (form.elements.namedItem('drivers') as HTMLSelectElement).value,
    };

    try {
      const response = await fetch('http://localhost:8000/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'আপনার অনুরোধ গ্রহণ করা হয়েছে!');
        form.reset();
      } else {
        toast.error(data.message || 'কোনো সমস্যা হয়েছে');
      }
    } catch (error) {
      toast.error('কোনো সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

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
            <p className="small-text">৫ দিনের ফ্রি ট্রায়াল, কোন ক্রেডিট কার্ড লাগবে না</p>
          </div>
          <div className="hero-image">
            <img src="/images/dashboard-preview.svg" alt="গাড়িবন্ধু ৩৬০ ড্যাশবোর্ড" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <h3>{stats.totalUsers}+</h3>
          <p>সন্তুষ্ট গ্রাহক</p>
        </div>
        <div className="stat-item">
          <h3>{stats.totalVehicles}+</h3>
          <p>গাড়ি ম্যানেজ</p>
        </div>
        <div className="stat-item">
          <h3>{stats.totalDrivers}+</h3>
          <p>চালক রেজিস্টার্ড</p>
        </div>
        <div className="stat-item">
          <h3>২৪/৭</h3>
          <p>সাপোর্ট</p>
        </div>
      </section>

      {/* Process/How It Works Section */}
      <section className="services" style={{ background: '#f8f9fa' }}>
        <h2 className="section-title">কিভাবে কাজ করে?</h2>
        <p className="section-subtitle">গাড়িবন্ধু ৩৬০ ব্যবহারের সহজ পদ্ধতি</p>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📝</div>
            <h3>১. রেজিস্ট্রেশন</h3>
            <p>আমাদের ওয়েবসাইটে গিয়ে নিজের অ্যাকাউন্ট তৈরি করুন। শুধুমাত্র আপনার নাম, ইমেইল ও ফোন নম্বর লাগবে।</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📦</div>
            <h3>২. প্যাকেজ নির্বাচন</h3>
            <p>আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন। স্টার্টার, বেসিক বা প্রো — যেকোনোটি নিতে পারেন।</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">💳</div>
            <h3>৩. পেমেন্ট</h3>
            <p>bKash, Rocket বা Nagad যেকোনো মাধ্যমে পেমেন্ট করুন। ট্রানজেকশন আইডি দিন।</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🚀</div>
            <h3>৪. ব্যবহার শুরু</h3>
            <p>পেমেন্ট যাচাই হলে আপনার সাবস্ক্রিপশন সক্রিয় হবে। তারপর সিস্টেম ব্যবহার করুন।</p>
          </div>
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
              <li>দ্রুত অ্যাকশনের জন্য কাটনুইক ব</li>
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

      {/* Pricing Preview Section - Dynamic */}
      {packages.length > 0 && (
        <section className="pricing">
          <h2 className="section-title">সাশ্রয়ী মূল্যে প্রিমিয়াম সেবা</h2>
          <p className="section-subtitle">আপনার প্রয়োজন অনুযায়ী প্যাকেজ সিলেক্ট করুন</p>
          
          <div className="pricing-grid">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className={`pricing-card ${index === 1 ? 'popular' : ''}`}
              >
                {index === 1 && <div className="popular-badge">সর্বাধিক বিক্রিত</div>}
                <div className={`pricing-header ${index === 0 ? 'starter' : index === 1 ? 'business' : 'enterprise'}`}>
                  <h3>{pkg.name}</h3>
                  <p className="price">
                    {pkg.price > 0 ? (
                      <>৳{pkg.price.toLocaleString()} <span>টাকা/মাস</span></>
                    ) : (
                      'আলোচনা সাপেক্ষে'
                    )}
                  </p>
                </div>
                <div className="pricing-body">
                  <ul className="premium-features">
                    <li><span className="check-icon">✓</span> {pkg.vehicle_limit >= 999999 ? 'আনলিমিটেড গাড়ি' : `${pkg.vehicle_limit}টি গাড়ি পর্যন্ত`}</li>
                    <li><span className="check-icon">✓</span> {pkg.driver_limit >= 999999 ? 'আনলিমিটেড চালক' : `${pkg.driver_limit}জন চালক পর্যন্ত`}</li>
                    {index === 0 && (
                      <>
                        <li><span className="check-icon">✓</span> বেসিক রিপোর্ট</li>
                        <li className="no"><span className="cross-icon">✗</span> অ্যাডভান্স রিপোর্ট</li>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <li><span className="check-icon">✓</span> অ্যাডভান্স রিপোর্ট</li>
                        <li><span className="check-icon">✓</span> ফোন + ইমেইল সাপোর্ট</li>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <li><span className="check-icon">✓</span> কাস্টমাইজড রিপোর্ট</li>
                        <li><span className="check-icon">✓</span> ২৪/৭ প্রাইওরিটি সাপোর্ট</li>
                      </>
                    )}
                  </ul>
                  {pkg.price > 0 ? (
                    <Link href={`/payment?package=${pkg.id}`} className={`btn-pricing ${index === 1 ? 'popular-btn' : ''}`}>
                      <span className="btn-icon">🎯</span> এই প্যাকেজ নিন
                    </Link>
                  ) : (
                    <Link href="/contact" className="btn-pricing">
                      <span className="btn-icon">📞</span> যোগাযোগ করুন
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="annual-offer">
            <p>🎉 বার্ষিক প্যাকেজে ২ মাস ফ্রি! বছরভিত্তিক পেমেন্ট করলে ২ মাসের সার্ভিস ফ্রি।</p>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/pricing" className="btn btn-secondary">সব প্যাকেজ দেখুন</Link>
          </div>
        </section>
      )}

      {/* Demo Request Form */}
      <section className="demo">
        <h2 className="section-title">ফ্রি ট্রায়াল শুরু করুন</h2>
        <p className="section-subtitle">১৫ দিনের জন্য সম্পূর্ণ সিস্টেম ব্যবহার করুন, কোন পেমেন্ট লাগবে না</p>
        
        <div className="demo-form">
          <form onSubmit={handleDemoSubmit}>
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
            
            <button type="submit" disabled={loading} className="btn-demo">
              {loading ? 'পাঠানো হচ্ছে...' : 'ফ্রি ট্রায়াল শুরু করুন'}
            </button>
          </form>
          <p className="small-text" style={{ textAlign: 'center', marginTop: '15px' }}>* ফ্রি ট্রায়ালের পর কোন চার্জ হবে না। আপনি চাইলে বন্ধ করে দিতে পারেন।</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
