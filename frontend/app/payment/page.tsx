'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { subscriptionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Package {
  id: number;
  name: string;
  name_bn: string;
  price: number;
  vehicle_limit: number;
  driver_limit: number;
  features: string[];
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const packageId = searchParams.get('package');
  
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    transaction_id: '',
    sender_number: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/payment%3Fpackage=' + packageId);
    }
  }, [authLoading, isAuthenticated, router, packageId]);

  useEffect(() => {
    if (packageId && isAuthenticated) {
      fetchPackage();
    }
  }, [packageId, isAuthenticated]);

  const fetchPackage = async () => {
    try {
      const response = await subscriptionAPI.package(parseInt(packageId!));
      setPackageData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch package:', err);
      setError('Package information loading failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !formData.transaction_id || !formData.sender_number || !packageData) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // First create subscription with customer info
      const subscribeResponse = await subscriptionAPI.subscribe({
        package_id: packageData.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
      });
      
      const subscriptionId = subscribeResponse.data.data.subscription.id;

      // Then submit payment
      await subscriptionAPI.submitPayment({
        subscription_id: subscriptionId,
        payment_method: selectedMethod,
        transaction_id: formData.transaction_id,
        sender_number: formData.sender_number,
        amount: packageData.price,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Payment method info
  const paymentMethods = [
    {
      id: 'bkash',
      name: 'bKash',
      number: '017XXXXXXXX',
      icon: '💰',
      color: '#E6007E',
    },
    {
      id: 'rocket',
      name: 'Rocket',
      number: '017XXXXXXXX',
      icon: '🚀',
      color: '#6D2077',
    },
    {
      id: 'nagad',
      name: 'Nagad',
      number: '017XXXXXXXX',
      icon: '📱',
      color: '#F37021',
    },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loader"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Header />
        <section className="hero" style={{ padding: '60px 0' }}>
          <div className="hero-container">
            <div className="hero-content" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
              <h1>Payment <span>Successful</span></h1>
              <p className="hero-text" style={{ maxWidth: '600px', margin: '0 auto 30px' }}>
                Your payment has been submitted successfully. Our team will verify and activate your subscription shortly.
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
                <a href="/" className="btn btn-secondary">Home Page</a>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (!packageData) {
    return (
      <>
        <Header />
        <section className="hero" style={{ padding: '60px 0' }}>
          <div className="hero-container">
            <div className="hero-content" style={{ textAlign: 'center' }}>
              <h1>Package <span>Not Found</span></h1>
              <a href="/pricing" className="btn btn-primary" style={{ marginTop: '20px' }}>
                Go to Pricing
              </a>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <section className="hero" style={{ padding: '40px 0' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1>Make <span>Payment</span></h1>
            <p className="hero-text">
              Make manual payment for your selected package
            </p>
          </div>
        </div>
      </section>

      <section className="services">
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          {/* Package Summary */}
          <div className="service-card" style={{ marginBottom: '30px', border: '2px solid var(--primary-orange)' }}>
            <h3 style={{ marginBottom: '15px' }}>Selected Package</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h2 style={{ color: 'var(--primary-orange)', margin: '5px 0' }}>{packageData.name}</h2>
                <p>Vehicles: {packageData.vehicle_limit === 999999 ? 'Unlimited' : packageData.vehicle_limit} | Drivers: {packageData.driver_limit === 999999 ? 'Unlimited' : packageData.driver_limit}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ color: 'var(--primary-orange)', margin: '5px 0' }}>৳{packageData.price}/month</h2>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="service-card" style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Payment Instructions</h3>
            <ol style={{ paddingLeft: '20px', lineHeight: '2' }}>
              <li>Open any mobile banking app below</li>
              <li>Click on Send Money option</li>
              <li>Send money to the number provided below</li>
              <li>Fill in the Transaction ID and Sender Number in the form below</li>
              <li>Click Submit button</li>
            </ol>
          </div>

          {/* Payment Methods */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Select Payment Method</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`service-card ${selectedMethod === method.id ? 'selected' : ''}`}
                  style={{ 
                    cursor: 'pointer', 
                    border: selectedMethod === method.id ? `3px solid ${method.color}` : '2px solid transparent',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{method.icon}</div>
                  <h4 style={{ color: method.color }}>{method.name}</h4>
                  <p style={{ fontSize: '14px', margin: '10px 0' }}>{method.number}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          {selectedMethod && (
            <div className="service-card">
              <h3 style={{ marginBottom: '20px' }}>Payment Information</h3>
              
              {error && (
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#fee2e2', 
                  color: '#dc2626', 
                  borderRadius: '8px', 
                  marginBottom: '20px' 
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Customer Information */}
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '15px', color: '#0369a1' }}>Customer Information</h4>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      placeholder="Enter your email address"
                      required
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      placeholder="Enter your phone number"
                      required
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    value={formData.transaction_id}
                    onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                    placeholder="Enter your transaction ID"
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #ddd', 
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Sender Number *
                  </label>
                  <input
                    type="text"
                    value={formData.sender_number}
                    onChange={(e) => setFormData({ ...formData, sender_number: e.target.value })}
                    placeholder="Number used to send money"
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #ddd', 
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Amount (৳)
                  </label>
                  <input
                    type="number"
                    value={packageData.price}
                    readOnly
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #ddd', 
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: '#f5f5f5'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ 
                    width: '100%', 
                    padding: '15px',
                    fontSize: '18px',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Submitting Payment...' : 'Submit Payment'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="loading-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loader"></div>
        </div>
        <Footer />
      </>
    }>
      <PaymentContent />
    </Suspense>
  );
}
