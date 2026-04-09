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
    { id: 0, name: 'Free Trial', price: 0, vehicle_limit: 5, driver_limit: 4, features: ['Fuel & Maintenance Management', 'Basic Reports', 'Vehicle Tracking', 'Driver Management', 'Requisition System', 'Up to 5 Vehicles', '4 Users'], is_active: true },
    { id: 1, name: 'Starter', price: 1999, vehicle_limit: 5, driver_limit: 4, features: ['Requisition Manage', 'Trip Manage', 'GPS Tracker', 'Email & Notification Support', 'Multi Language Support', 'Fuel & Maintenance', 'Basic Reports', 'Vehicle Tracking', 'Driver Management', 'Up to 5 Vehicles', '4 Users'], is_active: true },
    { id: 2, name: 'Business', price: 5000, vehicle_limit: 25, driver_limit: 10, features: ['Advanced Reports', 'Priority Support', 'Fuel & Maintenance', 'API Access', 'GPS Tracking', 'Trip Sheets', 'Maintenance Alerts', 'Up to 25 Vehicles', '10 Users'], is_active: true },
    { id: 3, name: 'Enterprise', price: 0, vehicle_limit: 999999, driver_limit: 999999, features: ['Unlimited Vehicles', 'Unlimited Users', 'Unlimited Drivers', 'API & Integrations', 'Dedicated Account Manager', 'Custom Development', '24/7 Priority Support'], is_active: true },
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
                border: index === 0 ? '3px solid #27ae60' : index === 2 ? '3px solid #FF6B35' : undefined,
                position: 'relative',
                overflow: 'visible'
              }}
            >
              {index === 0 && (
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
              {index === 2 && (
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
              {index === 3 && (
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
              <div className="service-icon" style={{ fontSize: index === 0 ? '3rem' : undefined }}>
                {index === 0 ? '🎁' : index === 1 ? '🚀' : index === 2 ? '📦' : index === 3 ? '⭐' : '👑'}
              </div>
              <h3>{pkg.name}</h3>
              <h2 style={{ color: index === 0 ? '#27ae60' : index === 3 ? '#1E3D58' : 'var(--primary-orange)', margin: '10px 0', fontSize: index === 0 ? '2.5rem' : undefined }}>
                {index === 0 ? 'Free' : index === 3 ? 'Custom' : getPackagePrice(pkg)}
              </h2>
              {index === 0 && (
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>7 Days Free Trial</p>
              )}
              {index === 3 && (
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Contact for Pricing</p>
              )}
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: '0' }}>
                {pkg.features.map((feature, i) => (
                  <li key={i} style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => pkg.id === 0 ? router.push('/register') : pkg.id === 3 ? router.push('/contact') : handleSelectPackage(pkg)}
                className="btn-pricing" 
                style={{ 
                  marginTop: '20px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  background: index === 0 ? '#27ae60' : index === 3 ? '#1E3D58' : undefined
                }}
              >
                <span>{index === 0 ? '🚀' : index === 3 ? '📞' : '🎯'}</span>
                {pkg.id === 0 ? 'Start Free Trial' : pkg.id === 3 ? 'Contact Us' : 'Select Package'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
