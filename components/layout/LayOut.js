'use client'

import Header from '@/components/MainHeader/Header';
import Footer from '@/components/Footer/Footer';
import FormProvider from '@/app/context/page'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function LayOut({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <ToastContainer/>
        <FormProvider>
          <Header/>
          {children}
          <Footer/>
        </FormProvider>
      </body>
    </html>
  );
}
