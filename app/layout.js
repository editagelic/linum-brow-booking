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
    icon: '/images/logo-linum.png',
    apple: '/images/logo-linum.png',
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