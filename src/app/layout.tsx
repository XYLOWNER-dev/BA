import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Baran Atay Hair Art | Modern Erkek Kuaför & Saç Tasarım Stüdyosu',
    template: '%s | Baran Atay Hair Art',
  },
  description:
    'İstanbul Beşiktaş\'ta premium erkek kuaför deneyimi. Profesyonel saç kesimi, sakal tasarımı, fade kesim ve cilt bakımı hizmetleri. Online randevu sistemi ile hemen rezervasyon yapın.',
  keywords: [
    'erkek kuaför',
    'saç kesimi',
    'sakal tasarımı',
    'fade kesim',
    'skin fade',
    'barber',
    'saç tasarımı',
    'İstanbul kuaför',
    'Beşiktaş kuaför',
    'premium kuaför',
    'online randevu',
    'saç bakımı',
    'cilt bakımı',
  ],
  authors: [{ name: 'Baran Atay Hair Art' }],
  creator: 'Baran Atay Hair Art',
  publisher: 'Baran Atay Hair Art',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'Baran Atay Hair Art',
    title: 'Baran Atay Hair Art | Modern Erkek Kuaför & Saç Tasarım Stüdyosu',
    description:
      'İstanbul\'da premium erkek kuaför deneyimi. Profesyonel saç kesimi, sakal tasarımı ve cilt bakımı. Hemen online randevu alın!',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Baran Atay Hair Art',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baran Atay Hair Art | Modern Erkek Kuaför',
    description:
      'İstanbul\'da premium erkek kuaför deneyimi. Online randevu sistemi ile hemen rezervasyon yapın.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BarberShop',
  name: 'Baran Atay Hair Art',
  description:
    'Modern erkek kuaför ve saç tasarım stüdyosu. Premium saç kesimi, sakal tasarımı ve cilt bakımı hizmetleri.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  telephone: process.env.NEXT_PUBLIC_SALON_PHONE || '+90 555 123 4567',
  email: process.env.NEXT_PUBLIC_SALON_EMAIL || 'info@baranatay.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Barbaros Bulvarı No: 123',
    addressLocality: 'Beşiktaş',
    addressRegion: 'İstanbul',
    postalCode: '34353',
    addressCountry: 'TR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.0,
    longitude: 29.0,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  sameAs: [process.env.NEXT_PUBLIC_SALON_INSTAGRAM || 'https://instagram.com/baranatayhairairt'],
  priceRange: '₺₺',
  image: '/images/og-image.jpg',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Kuaför Hizmetleri',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Saç & Sakal Tasarım',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Saç Kesimi',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Fade & Skin Fade',
        },
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}
