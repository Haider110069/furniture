import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppToaster } from '@/components/app-toaster'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: 'Furni - Modern Interior Design Studio',
  description: 'Crafted with excellent material. Modern furniture for your home.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <AppToaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
