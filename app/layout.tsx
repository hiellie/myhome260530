import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteNav } from '@/components/layout/SiteNav'
import { SessionProvider } from '@/components/SessionProvider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'RAGWATSON | AI 서비스 개발 교육',
  description: 'RAGWATSON은 실무 중심 AI 서비스 개발 교육을 제공합니다. RAG, Multi-Agent, FastAPI 기반 엔터프라이즈 AI 역량을 키웁니다.',
  generator: 'RAGWATSON',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <SessionProvider>
          <SiteNav />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </SessionProvider>
      </body>
    </html>
  )
}
