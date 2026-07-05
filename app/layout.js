'use client'

import './globals.css';
import Header from '@/components/MainHeader/Header';
import Footer from '@/components/Footer/Footer';
import FormProvider from '@/app/context/page'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <FormProvider>
          <Header/>
          {children}
          <Footer/>
        </FormProvider>
      </body>
    </html>
  );
}