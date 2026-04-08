import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { getCurrentUserContext } from '@/utils/auth/server';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bozlak Çalışma Platformu',
  description:
    'Neşet Ertaş tavrı saz çalışanlar için sanatçı odaklı türkü ve çalışma listesi platformu.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await getCurrentUserContext();

  return (
    <html lang="tr">
      <body className={`${inter.variable} ${cormorant.variable}`}>
        <Navbar authMode={auth.mode} />
        {children}
      </body>
    </html>
  );
}
