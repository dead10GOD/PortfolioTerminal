import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sankalp',
  description: 'Created by Sankalp',
  generator: 'Sankalp',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
