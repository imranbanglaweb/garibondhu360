'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      background: 'rgba(255,255,255,0.2)',
      zIndex: 10000,
    }}>
      <div style={{
        height: '100%',
        background: 'linear-gradient(90deg, #FF6B35, #F7931E)',
        width: `${scrollProgress * 100}%`,
        transition: 'width 0.1s ease-out',
      }} />
    </div>
  );
}
