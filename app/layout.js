'use client'

import './globals.css';
import Header from '@/components/MainHeader/Header';
import Footer from '@/components/Footer/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
