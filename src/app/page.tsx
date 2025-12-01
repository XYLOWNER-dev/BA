import { Header, Footer } from '@/components/layout'
import {
  HeroSection,
  ServicesSection,
  AboutSection,
  ContactSection,
} from '@/components/sections'
import prisma from '@/lib/prisma'

// Fetch data at build/request time
async function getPageData() {
  const [services, staff] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
    prisma.staff.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return { services, staff }
}

export default async function HomePage() {
  const { services, staff } = await getPageData()

  return (
    <>
      <Header />
      <main>
        <HeroSection services={services} staff={staff} />
        <ServicesSection services={services} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}

// Revalidate every 5 minutes
export const revalidate = 300
