'use client'

import type { ReactNode } from 'react';
import Header from '@/components/MainHeader/Header';
import Footer from '@/components/Footer/Footer';
import FormProvider from '@/app/context/FormContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


type LayoutProps = {
  children: ReactNode
}

export default function LayOut({ children }: LayoutProps) {
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
