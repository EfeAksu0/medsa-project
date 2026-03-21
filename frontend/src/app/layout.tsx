import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cinzel',
});

export const metadata: Metadata = {
  title: "MEDYSA - Trading Journal for the Elite",
  description: "Stop bleeding capital. Medysa provides the elite statistical arsenal you need to conquer the markets with AI-driven insights.",
  metadataBase: new URL('https://medysa.com'),
  openGraph: {
    title: "MEDYSA - Trading Journal",
    description: "Battle-tested trading journal for warriors of the market. AI-driven forensic autopsies on every trade.",
    url: 'https://medysa.com',
    siteName: 'Medysa',
    images: [
      {
        url: '/hero-dragon-breath.png',
        width: 1200,
        height: 630,
        alt: 'Medysa Trading Arena',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MEDYSA - Trading Journal",
    description: "Stop bleeding capital. Claim your edge with Medysa.",
    images: ['/hero-dragon-breath.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

import { SWRConfig } from 'swr';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.className} ${cinzel.variable} bg-gray-950 text-white`} suppressHydrationWarning={true}>
        <SWRConfig value={{
          revalidateOnFocus: false,
          dedupingInterval: 5000,
        }}>
          <AuthProvider>{children}</AuthProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
