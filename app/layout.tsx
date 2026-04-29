import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SMAN BD — Premium Leather & Lifestyle',
  description: 'Premium quality leather wallet, men clothing & watches',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
