import './globals.css'
import {Hanken_Grotesk} from 'next/font/google'

const hankenGrotesk = Hanken_Grotesk({
  variable: '--font-hanken-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${hankenGrotesk.className}`}>
      <body>{children}</body>
    </html>
  )
}
