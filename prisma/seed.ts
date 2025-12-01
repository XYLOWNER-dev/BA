import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create staff members
  const staff = await Promise.all([
    prisma.staff.upsert({
      where: { email: 'baran@baranatay.com' },
      update: {},
      create: {
        name: 'Baran Atay',
        email: 'baran@baranatay.com',
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { email: 'senior1@baranatay.com' },
      update: {},
      create: {
        name: 'Senior Stylist 1',
        email: 'senior1@baranatay.com',
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { email: 'senior2@baranatay.com' },
      update: {},
      create: {
        name: 'Senior Stylist 2',
        email: 'senior2@baranatay.com',
        isActive: true,
      },
    }),
  ])

  console.log(`Created ${staff.length} staff members`)

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Saç & Sakal Tasarım',
        description: 'Kişiye özel saç ve sakal tasarımı ile tarzınızı yansıtın.',
        durationMinutes: 60,
        price: 500,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Saç Kesimi',
        description: 'Modern tekniklerde profesyonel saç kesimi.',
        durationMinutes: 30,
        price: 250,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Fade & Skin Fade',
        description: 'Keskin geçişler ve kusursuz fade kesimler.',
        durationMinutes: 30,
        price: 100,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Sakal Şekillendirme',
        description: 'Yüz hatlarınıza uygun profesyonel sakal tasarımı.',
        durationMinutes: 30,
        price: 150,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Saç Boyama',
        description: 'Kaliteli ürünlerle profesyonel saç boyama hizmeti.',
        durationMinutes: 30,
        price: 400,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Saç Bakım & Maske',
        description: 'Saçlarınız için besleyici bakım ve maske uygulaması.',
        durationMinutes: 30,
        price: 200,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Fön & Styling',
        description: 'Profesyonel fön ve şekillendirme hizmeti.',
        durationMinutes: 0,
        price: 100,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Cilt Bakımı',
        description: 'Premium cilt bakım ve yüz maskesi uygulaması.',
        durationMinutes: 30,
        price: 1500,
        isActive: true,
      },
    }),
  ])

  console.log(`Created ${services.length} services`)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
