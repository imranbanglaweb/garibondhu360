'use client';

import { useLoading } from '../context/LoadingContext';

export default function Preloader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      transition: 'opacity 0.3s ease-out',
    }}>
      <div style={{ textAlign: 'center' }}>
        {/* Logo */}
        <img 
          src="/images/logo-white.svg" 
          alt="গাড়িবন্ধু ৩৬০" 
          style={{ 
            width: '200px',
            marginBottom: '30px',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
          }}
        />
        
        {/* Spinner */}
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto',
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        
        <p style={{ 
          color: 'white', 
          marginTop: '25px', 
          fontSize: '18px',
          fontWeight: 500
        }}>
          লোড হচ্ছে...
        </p>
      </div>
    </div>
  );
}
