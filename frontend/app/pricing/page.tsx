'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/api';

interface Package {
  id: number;
  name: string;
  price: number;
  vehicle_limit: number;
  driver_limit: number;
  features: string[];
  is_active: boolean;
}

export default function Pricing() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await subscriptionAPI.packages();
      if (response.data.success && response.data.data.length > 0) {
        // Map API data to ensure all fields are present
        const pkgs = response.data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price) || 0,
          vehicle_limit: parseInt(p.vehicle_limit) || 0,
          driver_limit: parseInt(p.driver_limit) || 0,
          features: typeof p.features === 'string' ? JSON.parse(p.features || '[]') : Array.isArray(p.features) ? p.features : [],
          is_active: p.is_active ?? true
        }));
        setPackages(pkgs);
      }
      // If no data, keep default packages
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      // Keep default packages on error
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg: Package) => {
    if (pkg.name.toLowerCase() === 'enterprise') {
      router.push('/contact');
    } else {
      router.push(`/payment?package=${pkg.id}`);
    }
  };

  const getPackagePrice = (pkg: Package) => {
    if (pkg.price === 0) return 'Contact Us';
    return `৳${pkg.price.toLocaleString()}/month`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loader"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <section className="hero" style={{ padding: '60px 0', background: 'linear-gradient(135deg, #1E3D58 0%, #2a4a6a 100%)', color: 'white' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1 style={{ color: 'white' }}>আমাদের <span style={{ color: '#FF6B35' }}>প্যাকেজ</span></h1>
            <p className="hero-text" style={{ color: 'rgba(255,255,255,0.9)' }}>
              আপনার প্রয়োজন অনুযায়ী একটি প্যাকেজ নির্বাচন করুন
            </p>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="services-grid">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.id} 
              className="service-card" 
              style={{ 
                textAlign: 'center',
                border: pkg.name.toLowerCase().includes('free') ? '3px solid #27ae60' : pkg.name.toLowerCase().includes('business') ? '3px solid #FF6B35' : undefined,
                position: 'relative',
                overflow: 'visible'
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
                  ✨ 7 DAYS FREE TRIAL
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
              <div className="service-icon" style={{ fontSize: pkg.name.toLowerCase().includes('free') ? '3rem' : undefined }}>
                {pkg.name.toLowerCase().includes('free') ? '🎁' : pkg.name.toLowerCase().includes('starter') ? '🚀' : pkg.name.toLowerCase().includes('business') ? '📦' : pkg.name.toLowerCase().includes('enterprise') ? '⭐' : '👑'}
              </div>
              <h3>{pkg.name}</h3>
              <h2 style={{ color: pkg.name.toLowerCase().includes('free') ? '#27ae60' : pkg.name.toLowerCase().includes('enterprise') ? '#1E3D58' : 'var(--primary-orange)', margin: '10px 0', fontSize: pkg.name.toLowerCase().includes('free') ? '2.5rem' : undefined }}>
                {pkg.name.toLowerCase().includes('free') ? 'Free' : pkg.name.toLowerCase().includes('enterprise') ? 'Custom' : getPackagePrice(pkg)}
              </h2>
              {pkg.price === 0 && (
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  {pkg.name.toLowerCase().includes('free') ? '7 Days Free Trial' : 'Contact for Pricing'}
                </p>
              )}
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: '0' }}>
                {(pkg.features || []).map((feature, i) => (
                  <li key={i} style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => pkg.name.toLowerCase().includes('free') ? router.push('/register') : pkg.name.toLowerCase().includes('enterprise') ? router.push('/contact') : handleSelectPackage(pkg)}
                className="btn-pricing" 
                style={{ 
                  marginTop: '20px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  background: pkg.name.toLowerCase().includes('free') ? '#27ae60' : pkg.name.toLowerCase().includes('enterprise') ? '#1E3D58' : undefined
                }}
              >
                <span>{pkg.name.toLowerCase().includes('free') ? '🚀' : pkg.name.toLowerCase().includes('enterprise') ? '📞' : '🎯'}</span>
                {pkg.name.toLowerCase().includes('free') ? 'Start Free Trial' : pkg.name.toLowerCase().includes('enterprise') ? 'Contact Us' : 'Select Package'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
