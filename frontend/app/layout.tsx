import './globals.css'
import { Inter } from 'next/font/google'
import { NavBar } from '@/components/NavBar'
import { authService } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Genuin',
  description: 'Human-only professional network',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Load user on app start
  if (typeof window !== 'undefined') {
    authService.loadUser()
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <NavBar />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}