import './globals.css'

export const metadata = {
  title: 'WebP Converter - Convert Images to WebP Format',
  description: 'Batch convert images (JPG, PNG, AVIF, BMP) to WebP format instantly and privately.',
  openGraph: {
    title: 'WebP.Zip - Convert to WebP',
    description: 'Convert JPG, PNG, AVIF, and BMP to WebP. Freely, easily, and securely.',
    url: 'https://webp.zip', // Replace with your actual domain
    siteName: 'WebP.Zip',
    images: [
      {
        url: '/images/social.png', // Replace with your OG image URL
        width: 1664,
        height: 936,
        alt: 'WebP Converter Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebP.Zip - Convert to WebP',
    description: 'Convert JPG, PNG, AVIF, and BMP to WebP. Freely, easily, and securely.',
    images: ['/images/social.png'], // Replace with your Twitter image URL
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Simple Analytics Script */}
        <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>

      </head>
      <body>{children}</body>
    </html>
  )
}