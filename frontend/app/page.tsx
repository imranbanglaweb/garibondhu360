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
  features?: string[];
}

interface Stats {
  totalUsers: number;
  totalVehicles: number;
  totalDrivers: number;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
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
        // Get all 4 packages for home page
        const pkgs = data.data.slice(0, 4).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price) || 0,
          vehicle_limit: parseInt(p.vehicle_limit) || 0,
          driver_limit: parseInt(p.driver_limit) || 0,
          features: typeof p.features === 'string' ? JSON.parse(p.features || '[]') : Array.isArray(p.features) ? p.features : []
        }));
        setPackages(pkgs);
        console.log('Packages updated:', pkgs);
      } else {
        console.log('No packages from API, keeping defaults');
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setPackagesLoading(false);
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
            <div style={{ 
              display: 'inline-block', 
              background: 'rgba(255,107,53,0.15)', 
              padding: '8px 20px', 
              borderRadius: '50px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FF6B35'
            }}>
              🚀 AI-Powered Transport Management
            </div>
            <h1>আপনার ট্রান্সপোর্ট ম্যানেজমেন্ট <span>এখন স্মার্ট</span></h1>
            <p className="hero-text">
              গাড়ি, চালক, জিপিএস ট্র্যাকিং, রিকুইজিশন, মেইনটেন্যান্স ও এআই — সবকিছু এক প্ল্যাটফর্মে। 
              গাড়িবন্ধু ৩৬০ দিয়ে আপনার পরিবহন ব্যবস্থাপনা হোক সম্পূর্ণ অটোমেটেড।
            </p>
            <div className="hero-buttons">
              <Link href="/register" className="btn btn-primary">ফ্রি ট্রায়াল শুরু করুন</Link>
              <Link href="/demo" className="btn btn-secondary">ডেমো দেখুন</Link>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span style={{ color: '#4CAF50' }}>✓</span> রিয়েল-টাইম জিপিএস
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span style={{ color: '#4CAF50' }}>✓</span> এআই প্রিডিক্টিভ মেইনটেন্যান্স
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span style={{ color: '#4CAF50' }}>✓</span> স্মার্ট অ্যাপ্রুভাল ওয়ার্কফ্লো
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/smart-dashboard.png" alt="গাড়িবন্ধু ৩৬০ ড্যাশবোর্ড" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '60px 5%', 
        background: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        marginTop: '-30px',
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '20px'
      }}>
        <div className="stats" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          background: 'transparent',
          padding: 0
        }}>
          <div className="stat-item" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px 20px',
            borderRadius: '15px',
            color: '#fff'
          }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{stats.totalUsers}+</h3>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>সন্তুষ্ট গ্রাহক</p>
          </div>
          <div className="stat-item" style={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '30px 20px',
            borderRadius: '15px',
            color: '#fff'
          }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{stats.totalVehicles}+</h3>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>গাড়ি ম্যানেজ</p>
          </div>
          <div className="stat-item" style={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '30px 20px',
            borderRadius: '15px',
            color: '#fff'
          }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{stats.totalDrivers}+</h3>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>চালক রেজিস্টার্ড</p>
          </div>
          <div className="stat-item" style={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            padding: '30px 20px',
            borderRadius: '15px',
            color: '#fff'
          }}>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>২৪/৭</h3>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>সাপোর্ট</p>
          </div>
        </div>
      </section>

      {/* Process/How It Works Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%)', 
        padding: '100px 5%',
        color: '#fff'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '15px', 
          fontSize: '2.5rem',
          color: '#fff'
        }}>কিভাবে কাজ করে?</h2>
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '50px', 
          color: 'rgba(255,255,255,0.8)',
          fontSize: '1.1rem'
        }}>গাড়িবন্ধু ৩৬০ ব্যবহারের সহজ পদ্ধতি — মাত্র ৪ ধাপে শুরু করুন</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '40px 30px', 
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '20px',
              background: '#FF6B35',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>📝</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>১. রেজিস্ট্রেশন</h3>
            <p style={{ opacity: 0.8, fontSize: '14px', lineHeight: '1.6' }}>আমাদের ওয়েবসাইটে গিয়ে নিজের অ্যাকাউন্ট তৈরি করুন। শুধুমাত্র আপনার নাম, ইমেইল ও ফোন নম্বর লাগবে।</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '40px 30px', 
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '20px',
              background: '#FF6B35',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>📦</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>২. প্যাকেজ নির্বাচন</h3>
            <p style={{ opacity: 0.8, fontSize: '14px', lineHeight: '1.6' }}>আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন। স্টার্টার, বেসিক বা প্রো — যেকোনোটি নিতে পারেন।</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '40px 30px', 
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '20px',
              background: '#FF6B35',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>💳</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>৩. পেমেন্ট</h3>
            <p style={{ opacity: 0.8, fontSize: '14px', lineHeight: '1.6' }}>bKash, Rocket বা Nagad যেকোনো মাধ্যমে পেমেন্ট করুন। ট্রানজেকশন আইডি দিন।</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '40px 30px', 
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '20px',
              background: '#FF6B35',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>🚀</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>৪. ব্যবহার শুরু</h3>
            <p style={{ opacity: 0.8, fontSize: '14px', lineHeight: '1.6' }}>পেমেন্ট যাচাই হলে আপনার সাবস্ক্রিপশন সক্রিয় হবে। তারপর সিস্টেম ব্যবহার করুন।</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" style={{ background: '#f8f9fa', padding: '100px 5%' }}>
        <h2 className="section-title">আমরা যা করি</h2>
        <p className="section-subtitle">আপনার ট্রান্সপোর্ট ম্যানেজমেন্টের সব সমস্যার সমাধান এক জায়গায়</p>
        
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
            <div className="service-icon">🛰️</div>
            <h3>জিপিএস ট্র্যাকিং</h3>
            <p>রিয়েল-টাইম লোকেশন, ট্রিপ হিস্টরি, গতানুগতিক বিশ্লেষণ</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">📝</div>
            <h3>রিকুইজিশন সিস্টেম</h3>
            <p>গাড়ি চাওয়ার আবেদন, অনুমোদন প্রক্রিয়া, ট্রিপ শিট</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🤖</div>
            <h3>এআই মেইনটেন্যান্স</h3>
            <p>প্রিডিক্টিভ অ্যালার্ট, ভেহিক্যাল কন্ডিশন বিশ্লেষণ, স্মার্ট রিপোর্ট</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">⛽</div>
            <h3>জ্বালানি ব্যবস্থাপনা</h3>
            <p>ফুয়েল লগ, খরচ বিশ্লেষণ, ভেহিক্যাল ইফিসিয়েন্সি রিপোর্ট</p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link href="/services" className="btn btn-primary">সব সেবা দেখুন</Link>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features" style={{ padding: '100px 5%', background: '#fff' }}>
        <h2 className="section-title">শক্তিশালী ফিচারসমূহ</h2>
        <p className="section-subtitle">আপনার ট্রান্সপোর্ট ব্যবস্থাপনাকে এগিয়ে নিতে সবকিছু এক ড্যাশবোর্ডে</p>
        
        <div className="feature-row">
          <div className="feature-text">
            <h3>📊 স্মার্ট ড্যাশবোর্ড</h3>
            <p>এক নজরে দেখুন আপনার সমস্ত গাড়ি, চালক ও রিকুইজিশনের অবস্থা। রিয়েল-টাইম আপডেট ও তাৎক্ষণিক অ্যাকশনের সুবিধা।</p>
            <ul style={{ color: '#555', lineHeight: '2' }}>
              <li>✓ মোট রিকুইজিশন, পেন্ডিং, অ্যাপ্রুভড এক নজরে</li>
              <li>✓ গাড়ি ও চালকের সংখ্যা রিয়েল-টাইম আপডেট</li>
              <li>✓ এআই-জেনারেটেড মেইনটেন্যান্স অ্যালার্ট</li>
            </ul>
          </div>
          <div className="feature-image">
            <img src="/images/dashboard.png" alt="ড্যাশবোর্ড ফিচার" />
          </div>
        </div>
        
        <div className="feature-row reverse">
          <div className="feature-image">
            <img src="/images/create-requisition.png" alt="রিকুইজিশন ফিচার" />
          </div>
          <div className="feature-text">
            <h3>📝 অটোমেটেড রিকুইজিশন ওয়ার্কফ্লো</h3>
            <p>গাড়ি চাওয়ার আবেদন থেকে শুরু করে অনুমোদন, ভাড়া, রিটার্ন — সব প্রক্রিয়া স্বয়ংক্রিয়। মাল্টি-লেভেল অ্যাপ্রুভাল সিস্টেম।</p>
            <ul style={{ color: '#555', lineHeight: '2' }}>
              <li>✓ অনলাইন আবেদন ও রিয়েল-টাইম স্ট্যাটাস ট্র্যাকিং</li>
              <li>✓ বিভাগীয় প্রধান ও ট্রান্সপোর্ট অ্যাডমিন অ্যাপ্রুভাল</li>
              <li>✓ অটোমেটিক নোটিফিকেশন ও ইমেইল</li>
            </ul>
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-text">
            <h3>🤖 এআই-পাওয়ার্ড ফিচার</h3>
            <p>OpenAI-এর সাহায্যে প্রিডিক্টিভ মেইনটেন্যান্স, ভেহিক্যাল কন্ডিশন বিশ্লেষণ এবং স্মার্ট রিপোর্ট জেনারেশন।</p>
            <ul style={{ color: '#555', lineHeight: '2' }}>
              <li>✓ তেল, টায়ার, ব্রেক, ব্যাটারি — সব ধরনের অ্যালার্ট</li>
              <li>✓ ভেহিক্যাল হেলথ স্কোর ও রিকমেন্ডেশন</li>
              <li>✓ এআই জেনারেটেড ফ্লিট বিশ্লেষণ রিপোর্ট</li>
            </ul>
          </div>
          <div className="feature-image">
            <img src="/images/ai-sadhboard.png" alt="AI ফিচার" />
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link href="/features" className="btn btn-primary">সব ফিচার দেখুন</Link>
        </div>
      </section>

      {/* Pricing Preview Section - Dynamic */}
      {packages.length > 0 && (
        <section className="pricing" style={{ padding: '100px 5%' }}>
          <h2 className="section-title">সাশ্রয়ী মূল্যে প্রিমিয়াম সেবা</h2>
          <p className="section-subtitle">আপনার প্রয়োজন অনুযায়ী প্যাকেজ সিলেক্ট করুন</p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '30px', 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}>
            {packagesLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="loader"></div>
              </div>
            ) : packages.length === 0 ? null : packages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                style={{ 
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '30px',
                  textAlign: 'center',
                  border: pkg.name.toLowerCase().includes('free') ? '3px solid #27ae60' : pkg.name.toLowerCase().includes('business') ? '3px solid #FF6B35' : '1px solid #eee',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  position: 'relative',
                  transition: 'transform 0.3s ease'
                }}
              >
                {pkg.name.toLowerCase().includes('free') && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#27ae60',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 10px rgba(39, 174, 96, 0.3)'
                  }}>
                    ✨ BEST VALUE
                  </div>
                )}
                {pkg.name.toLowerCase().includes('business') && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#FF6B35',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)'
                  }}>
                    ⭐ MOST POPULAR
                  </div>
                )}
                {pkg.name.toLowerCase().includes('enterprise') && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1E3D58',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 10px rgba(30, 61, 88, 0.3)'
                  }}>
                    💼 CUSTOM PRICING
                  </div>
                )}
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                  {pkg.name.toLowerCase().includes('free') ? '🎁' : pkg.name.toLowerCase().includes('starter') ? '🚀' : pkg.name.toLowerCase().includes('business') ? '📦' : pkg.name.toLowerCase().includes('enterprise') ? '⭐' : '👑'}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#1E3D58' }}>{pkg.name}</h3>
                <div style={{ 
                  fontSize: pkg.name.toLowerCase().includes('free') ? '2.5rem' : '2rem', 
                  color: pkg.name.toLowerCase().includes('free') ? '#27ae60' : pkg.name.toLowerCase().includes('enterprise') ? '#1E3D58' : '#FF6B35', 
                  fontWeight: 'bold',
                  marginBottom: pkg.name.toLowerCase().includes('free') ? '5px' : '0'
                }}>
                  {pkg.name.toLowerCase().includes('free') ? 'Free' : pkg.name.toLowerCase().includes('enterprise') ? 'Custom' : `৳${pkg.price.toLocaleString()}`}
                </div>
                {pkg.name.toLowerCase().includes('free') && (
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>7 Days Free Trial</p>
                )}
                {pkg.name.toLowerCase().includes('enterprise') && (
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>Contact for Pricing</p>
                )}
                {!pkg.name.toLowerCase().includes('enterprise') && (
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>টাকা/মাস</p>
                )}
                <ul style={{ textAlign: 'left', listStyle: 'none', padding: '0', margin: '20px 0' }}>
                  {(pkg.features || []).map((feature, i) => (
                    <li key={i} style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#555' }}>
                      <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={pkg.name.toLowerCase().includes('enterprise') ? '/contact' : `/payment?package=${pkg.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 25px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    background: pkg.name.toLowerCase().includes('free') ? '#27ae60' : pkg.name.toLowerCase().includes('business') ? '#FF6B35' : '#1E3D58',
                    color: '#fff',
                    fontWeight: '600',
                    marginTop: '10px'
                  }}
                >
                  {pkg.name.toLowerCase().includes('enterprise') ? '📞 Contact Us' : `🎯 এই প্যাকেজ নিন`}
                </Link>
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
