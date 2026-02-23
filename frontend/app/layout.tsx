import type { Metadata } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'গাড়িবন্ধু ৩৬০ - ফ্লিট ম্যানেজমেন্ট সিস্টেম',
  description: 'গাড়িবন্ধু ৩৬০ - বাংলাদেশের প্রথম সম্পূর্ণ বাংলা ফ্লিট ম্যানেজমেন্ট সিস্টেম। গাড়ি, চালক, রিকুইজিশন, অনুমোদন সবকিছু এক প্ল্যাটফর্মে।',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className={hindSiliguri.className}>
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
