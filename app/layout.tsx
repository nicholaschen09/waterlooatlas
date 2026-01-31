import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'uwatlas - University of Waterloo',
  description: 'Interactive campus map for University of Waterloo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
