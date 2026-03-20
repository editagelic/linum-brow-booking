import { Manrope, Montserrat } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const metadata = {
  title: 'Linum Brow — Rezerviraj termin',
  description: 'Rezervirajte termin za oblikovanje obrva',
  icons: {
    icon: [
      { url: '/logo-linum.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo-linum.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-linum.png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="hr">
      <body className={`${manrope.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  )
}