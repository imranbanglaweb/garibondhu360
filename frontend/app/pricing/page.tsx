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
  const [packages, setPackages] = useState<Package[]>([
    { id: 1, name: 'Starter', price: 1000, vehicle_limit: 2, driver_limit: 5, features: ['2 Vehicles', '5 Drivers', 'Basic Reports', 'Email Support'], is_active: true },
    { id: 2, name: 'Basic', price: 3000, vehicle_limit: 5, driver_limit: 10, features: ['5 Vehicles', '10 Drivers', 'Basic Reports', 'Email Support'], is_active: true },
    { id: 3, name: 'Pro', price: 5000, vehicle_limit: 20, driver_limit: 50, features: ['20 Vehicles', '50 Drivers', 'Advanced Reports', 'Priority Support', 'Multi-Approval'], is_active: true },
    { id: 4, name: 'Enterprise', price: 0, vehicle_limit: 999999, driver_limit: 999999, features: ['Unlimited Vehicles', 'Unlimited Drivers', 'Custom Reports', '24/7 Support', 'Dedicated Manager'], is_active: true },
  ]);
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
          features: Array.isArray(p.features) ? p.features : [],
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
      
      <section className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1>Our <span>Pricing</span></h1>
            <p className="hero-text">
              Choose a package that fits your needs.
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
                border: index === 2 ? '2px solid var(--primary-orange)' : undefined
              }}
            >
              <div className="service-icon">
                {index === 0 ? '🚀' : index === 1 ? '📦' : index === 2 ? '⭐' : '👑'}
              </div>
              <h3>{pkg.name}</h3>
              <h2 style={{ color: 'var(--primary-orange)', margin: '10px 0' }}>
                {getPackagePrice(pkg)}
              </h2>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: '0' }}>
                {pkg.features.map((feature, i) => (
                  <li key={i} style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSelectPackage(pkg)}
                className="btn-pricing" 
                style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
              >
                <span>🎯</span>
                {pkg.name.toLowerCase() === 'enterprise' ? 'Contact Us' : 'Select Package'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
