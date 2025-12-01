import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Fetch all active staff members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const where = includeInactive ? {} : { isActive: true }

    const staff = await prisma.staff.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: staff,
    })
  } catch (error) {
    console.error('Failed to fetch staff:', error)
    return NextResponse.json(
      { success: false, error: 'Personel listesi getirilirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// POST - Create new staff member (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'name ve email alanları gereklidir.' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingStaff = await prisma.staff.findUnique({
      where: { email },
    })

    if (existingStaff) {
      return NextResponse.json(
        { success: false, error: 'Bu e-posta adresi zaten kayıtlı.' },
        { status: 409 }
      )
    }

    const staff = await prisma.staff.create({
      data: {
        name,
        email,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: staff,
      message: 'Personel başarıyla oluşturuldu.',
    })
  } catch (error) {
    console.error('Failed to create staff:', error)
    return NextResponse.json(
      { success: false, error: 'Personel oluşturulurken bir hata oluştu.' },
      { status: 500 }
    )
  }
}
