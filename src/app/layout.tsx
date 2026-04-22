import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'AdFlow Pro | Sponsored Ads Marketplace',
  description: 'Manage and discover high-quality sponsored advertisements with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0, background: 'var(--background)', color: 'var(--foreground)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="mesh-bg" />
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 68px)', position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: 500,
          color: '#64748b',
          background: 'transparent',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>ADFLOW PRO</div>
          © {new Date().getFullYear()} AdFlow Pro. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
