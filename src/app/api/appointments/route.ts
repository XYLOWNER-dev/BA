import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { calculateEndTime } from '@/lib/utils'
import { sendCustomerConfirmationEmail, sendStaffNotificationEmail } from '@/lib/email'
import { appointmentSchema } from '@/lib/validation'

// GET - Fetch appointments (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const staffId = searchParams.get('staffId')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        ;(where.date as Record<string, unknown>).gte = new Date(dateFrom)
      }
      if (dateTo) {
        ;(where.date as Record<string, unknown>).lte = new Date(dateTo)
      }
    }

    if (staffId) {
      where.staffId = staffId
    }

    if (status) {
      where.status = status
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: true,
        staff: true,
        service: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })

    return NextResponse.json({
      success: true,
      data: appointments,
    })
  } catch (error) {
    console.error('Failed to fetch appointments:', error)
    return NextResponse.json(
      { success: false, error: 'Randevular getirilirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// POST - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = appointmentSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      )
    }

    const { customer, serviceId, staffId, date, time, acceptedTerms } = validation.data

    if (!acceptedTerms) {
      return NextResponse.json(
        { success: false, error: 'KVKK ve Gizlilik Sözleşmesini kabul etmelisiniz.' },
        { status: 400 }
      )
    }

    // Get service to calculate end time
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Seçilen hizmet bulunamadı.' },
        { status: 400 }
      )
    }

    // Get staff
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
    })

    if (!staff) {
      return NextResponse.json(
        { success: false, error: 'Seçilen uzman bulunamadı.' },
        { status: 400 }
      )
    }

    // Calculate end time
    const endTime = calculateEndTime(time, service.durationMinutes)

    // Check for existing appointment (double booking)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        staffId,
        date: new Date(date),
        status: { not: 'CANCELLED' },
        OR: [
          {
            // New appointment starts during an existing one
            AND: [
              { startTime: { lte: time } },
              { endTime: { gt: time } },
            ],
          },
          {
            // New appointment ends during an existing one
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            // New appointment completely covers an existing one
            AND: [
              { startTime: { gte: time } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    })

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Bu saat dilimi için zaten bir randevu mevcut.' },
        { status: 409 }
      )
    }

    // Create or find customer
    let customerRecord = await prisma.customer.findFirst({
      where: {
        email: customer.email,
      },
    })

    if (customerRecord) {
      // Update customer info
      customerRecord = await prisma.customer.update({
        where: { id: customerRecord.id },
        data: {
          fullName: customer.fullName,
          phone: `${customer.phonePrefix}${customer.phone}`,
        },
      })
    } else {
      // Create new customer
      customerRecord = await prisma.customer.create({
        data: {
          fullName: customer.fullName,
          email: customer.email,
          phone: `${customer.phonePrefix}${customer.phone}`,
        },
      })
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        customerId: customerRecord.id,
        serviceId,
        staffId,
        date: new Date(date),
        startTime: time,
        endTime,
        status: 'CONFIRMED',
      },
      include: {
        customer: true,
        staff: true,
        service: true,
      },
    })

    // Send confirmation emails
    const emailData = {
      customerName: customerRecord.fullName,
      customerEmail: customerRecord.email,
      customerPhone: customerRecord.phone,
      serviceName: service.name,
      staffName: staff.name,
      date: new Date(date),
      startTime: time,
      endTime,
      price: service.price,
    }

    // Send emails asynchronously (don't block response)
    Promise.all([
      sendCustomerConfirmationEmail(emailData),
      sendStaffNotificationEmail(emailData, staff.email),
    ]).catch((err) => console.error('Email sending failed:', err))

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Randevunuz başarıyla oluşturuldu.',
    })
  } catch (error) {
    console.error('Failed to create appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Randevu oluşturulurken bir hata oluştu.' },
      { status: 500 }
    )
  }
}
