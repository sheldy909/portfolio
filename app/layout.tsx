import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'Portfolio',
  description: 'My portfolio website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          backgroundColor: '#333',
          padding: '1rem',
          position: 'sticky',
          top: '0',
          zIndex: '100'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Portfolio
            </Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/portfolio" style={{ color: 'white', textDecoration: 'none' }}>
                Portfolio
              </Link>
              <Link href="/archive" style={{ color: 'white', textDecoration: 'none' }}>
                Archive
              </Link>
              <Link href="/useful" style={{ color: 'white', textDecoration: 'none' }}>
                Useful
              </Link>
              <Link href="/admin" style={{ color: 'white', textDecoration: 'none' }}>
                Admin
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <footer style={{
          backgroundColor: '#333',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <p>&copy; 2024 Portfolio. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}