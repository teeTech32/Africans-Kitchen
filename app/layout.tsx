import './globals.css';
import LayOut from '@/components/layout/LayOut';
import type { ReactNode } from 'react';
import { smtpenv } from '@/lib/inputValidationWithZod';

// Search Engine Optimization (SEO)
export const metadata = {
  metadataBase: new URL(smtpenv.NEXT_PUBLIC_BASE_URL),

  title: {
    default: "Africans' Kitchens",
    template: "%s | Africans' Kitchens",
  },

  description:
    "Discover authentic Nigerian and African recipes.",

  applicationName: "Africans' Kitchens",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "Africans' Kitchens",

    images: [
      {
        url: "/images/pattern.jpg",
        width: 1200,
        height: 630,
        alt: "Africans' Kitchens",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
  },
};

type RootProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootProps) {
  return (
    <LayOut>
      {children}
    </LayOut>
  );
}
