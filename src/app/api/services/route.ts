import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all active services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const where = includeInactive ? {} : { isActive: true }

    const services = await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: services,
    })
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return NextResponse.json(
      { success: false, error: 'Hizmetler getirilirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// POST - Create new service (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, durationMinutes, price } = body

    if (!name || durationMinutes === undefined || price === undefined) {
      return NextResponse.json(
        { success: false, error: 'name, durationMinutes ve price alanları gereklidir.' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        durationMinutes: parseInt(durationMinutes),
        price: parseFloat(price),
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Hizmet başarıyla oluşturuldu.',
    })
  } catch (error) {
    console.error('Failed to create service:', error)
    return NextResponse.json(
      { success: false, error: 'Hizmet oluşturulurken bir hata oluştu.' },
      { status: 500 }
    )
  }
}
