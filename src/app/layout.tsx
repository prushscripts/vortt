import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VORTT — AI Operations for HVAC Contractors",
  description: "AI dispatch, job tracking, and contract management built for 3-15 truck HVAC shops. The smart alternative to ServiceTitan.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.svg',
    shortcut: '/favicon.svg',
  },
  manifest: "/manifest.json",
  openGraph: {
    title: 'VORTT — AI Operations for HVAC Contractors',
    description: 'AI dispatch, job tracking, and contract management built for HVAC contractors. The smart alternative to ServiceTitan.',
    url: 'https://vortt.app',
    siteName: 'VORTT',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'VORTT — AI Operations for HVAC Contractors',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VORTT — AI Operations for HVAC Contractors',
    description: 'AI dispatch, job tracking, and contract management built for HVAC contractors.',
    images: ['/opengraph-image'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VORTT",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF6B2B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrains.variable}`}>
        {children}
      </body>
    </html>
  );
}
