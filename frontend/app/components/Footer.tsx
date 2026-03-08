import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>গাড়িবন্ধু ৩৬০</h3>
          <p>বাংলাদেশের প্রথম সম্পূর্ণ বাংলা ফ্লিট ম্যানেজমেন্ট সিস্টেম। গাড়ি, চালক, রিকুইজিশন, অনুমোদন সবকিছু এক প্ল্যাটফর্মে।</p>
        </div>
        
        <div className="footer-col">
          <h3>লিংক</h3>
          <ul>
            <li><Link href="/services">সেবাসমূহ</Link></li>
            <li><Link href="/features">ফিচারসমূহ</Link></li>
            <li><Link href="/pricing">প্রাইসিং</Link></li>
            <li><Link href="/contact">যোগাযোগ</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>যোগাযোগ</h3>
          <ul>
            <li>📍 ঢাকা, বাংলাদেশ</li>
            <li>📞 01918329829</li>
            <li>✉️ info@garibondhu360.com</li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>অনুসরণ করুন</h3>
          <ul>
            <li><a href="#">ফেসবুক</a></li>
            <li><a href="#">টুইটার</a></li>
            <li><a href="#">লিংকডইন</a></li>
            <li><a href="#">ইউটিউব</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© ২০২৬ গাড়িবন্ধু ৩৬০। সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
}
