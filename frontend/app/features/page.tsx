import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Features() {
  const features = [
    {
      category: '🔐 Authentication & User Management',
      items: [
        'User registration and login',
        'Role-based access control (Admin, Employee, Driver, Department Head, etc.)',
        'Permission management',
        'User profiles and password management',
        'Employee management with organizational hierarchy'
      ]
    },
    {
      category: '📊 Dashboard & Home',
      items: [
        'Main dashboard with overview statistics',
        'Recent documents and activities',
        'Pending approvals notifications',
        'AJAX-powered data loading'
      ]
    },
    {
      category: '🏢 Organization Structure',
      items: [
        'Multi-company support',
        'Units, departments, and locations management',
        'Department heads assignment',
        'Employee hierarchy and reporting'
      ]
    },
    {
      category: '🚗 Vehicle & Transport Management',
      items: [
        'Vehicle CRUD operations',
        'Vehicle types management',
        'Vendor management for vehicles',
        'Vehicle details and specifications',
        'Vehicle utilization tracking'
      ]
    },
    {
      category: '🧑‍✈️ Driver Management',
      items: [
        'Driver CRUD operations',
        'Driver documents management',
        'License type management',
        'Driver performance tracking',
        'Driver availability management',
        'Driver scheduling and assignments'
      ]
    },
    {
      category: '🛰️ GPS Tracking System',
      items: [
        'Live vehicle tracking',
        'Trip tracking and history',
        'GPS device management',
        'Mobile GPS integration',
        'Trip monitoring and analytics'
      ]
    },
    {
      category: '⛽ Trip Sheets & Fuel Management',
      items: [
        'Trip sheet creation and management',
        'Active/completed trip tracking',
        'Fuel log entry by drivers',
        'Fuel consumption history',
        'Monthly fuel summaries',
        'Vehicle fuel efficiency reports'
      ]
    },
    {
      category: '📝 Requisition System',
      items: [
        'Vehicle requisition creation',
        'Maintenance requisition management',
        'Multi-level approval workflow',
        'Department head approvals',
        'Transport department approvals',
        'Status tracking and notifications'
      ]
    },
    {
      category: '🔧 Maintenance Management',
      items: [
        'Maintenance requests and scheduling',
        'Maintenance types and categories',
        'Maintenance vendor management',
        'Maintenance history tracking',
        'Maintenance approval workflows',
        'Scheduled maintenance tracking'
      ]
    },
    {
      category: '✅ Approvals Module',
      items: [
        'Department-level approvals',
        'Transport approvals with vehicle/driver assignment',
        'Maintenance approvals',
        'Approval history and tracking'
      ]
    },
    {
      category: '📈 Reporting & Analytics',
      items: [
        'Requisition reports (all, own, department)',
        'Trip and fuel consumption reports',
        'Vehicle utilization reports',
        'Driver performance reports',
        'Maintenance reports (all, own, department)',
        'Export capabilities (Excel, PDF)'
      ]
    },
    {
      category: '🤖 AI-Powered Features',
      items: [
        'AI-generated maintenance recommendations',
        'Vehicle condition analysis using OpenAI',
        'Predictive maintenance alerts',
        'Alert management and completion tracking',
        'Customizable alert types (oil change, tire replacement, brake service, battery, filter, transmission, suspension, etc.)',
        'AI-powered fleet analysis reports',
        'Automated report generation',
        'Maintenance analysis reports',
        'Custom report types with AI insights'
      ]
    },
    {
      category: '📧 Communication & Notifications',
      items: [
        'Email templates management',
        'Automated email notifications',
        'Push notification support',
        'Notification settings',
        'Email log history',
        'Push subscriber management',
        'Real-time push notifications',
        'Web push integration',
        'Push test functionality'
      ]
    },
    {
      category: '⚙️ Administration & Configuration',
      items: [
        'System settings management',
        'Language and localization',
        'Translation management',
        'Logo and branding configuration',
        'Cache management',
        'Dynamic menu system',
        'Permission-based menu visibility',
        'Menu reordering and management'
      ]
    },
    {
      category: '💳 Subscriptions & Payments',
      items: [
        'Subscription plan management',
        'Manual payment processing',
        'Invoice generation',
        'Payment approval workflow',
        'Subscription expiration handling'
      ]
    },
    {
      category: '🔌 API Endpoints',
      items: [
        'AJAX data endpoints for tables',
        'API for GPS data',
        'Push notification APIs',
        'AI feature stats APIs'
      ]
    },
    {
      category: '🛡️ Security & Compliance',
      items: [
        'CSRF protection',
        'Authentication middleware',
        'Permission-based access',
        'Input validation',
        'Error handling and logging'
      ]
    },
    {
      category: '⚡ Performance & Scalability',
      items: [
        'Database query optimization',
        'Caching support',
        'Background job processing',
        'Rate limiting considerations'
      ]
    }
  ];

  return (
    <>
      <Header />
      
      <section className="hero" style={{ padding: '60px 0' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1>আমাদের <span>সকল ফিচার</span></h1>
            <p className="hero-text">
              গাড়িবন্ধু ৩৬০ এর সমস্ত আধুনিক ফিচার সম্পর্কে জানুন।
            </p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {features.map((section, index) => (
          <div key={index} style={{ marginBottom: '50px' }}>
            <h2 style={{ 
              color: '#1a1a1a', 
              marginBottom: '25px', 
              paddingBottom: '15px',
              borderBottom: '3px solid #ff6b35',
              fontSize: '24px'
            }}>
              {section.category}
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '20px' 
            }}>
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    border: '1px solid #eee',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px' 
                  }}>
                    <span style={{ 
                      color: '#ff6b35', 
                      fontSize: '18px',
                      marginTop: '2px'
                    }}>✓</span>
                    <span style={{ 
                      color: '#444', 
                      lineHeight: '1.6',
                      fontSize: '15px'
                    }}>{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ 
          textAlign: 'center', 
          marginTop: '60px',
          padding: '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          color: '#fff'
        }}>
          <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>🚀 এখনই শুরু করুন</h2>
          <p style={{ fontSize: '18px', marginBottom: '25px', opacity: 0.9 }}>
            আমাদের সব ফিচার ১৫ দিনের ফ্রি ট্রায়ালে ব্যবহার করুন
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/register" 
              style={{
                background: '#fff',
                color: '#667eea',
                padding: '14px 30px',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              ফ্রি ট্রায়াল শুরু করুন
            </Link>
            <Link 
              href="/contact" 
              style={{
                background: 'transparent',
                color: '#fff',
                padding: '14px 30px',
                borderRadius: '8px',
                fontWeight: '600',
                border: '2px solid #fff',
                textDecoration: 'none'
              }}
            >
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}