import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { appointmentUpdateSchema } from '@/lib/validation'

// GET - Fetch single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        staff: true,
        service: true,
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Randevu bulunamadı.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    console.error('Failed to fetch appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Randevu getirilirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// PATCH - Update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate input
    const validation = appointmentUpdateSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      )
    }

    const { status, notes } = validation.data

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Randevu bulunamadı.' },
        { status: 404 }
      )
    }

    // Update appointment
    const updateData: Record<string, unknown> = { status }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        staff: true,
        service: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Randevu durumu güncellendi.',
    })
  } catch (error) {
    console.error('Failed to update appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Randevu güncellenirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// DELETE - Cancel/Delete appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Randevu bulunamadı.' },
        { status: 404 }
      )
    }

    // Soft delete by changing status to CANCELLED
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Randevu iptal edildi.',
    })
  } catch (error) {
    console.error('Failed to delete appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Randevu iptal edilirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}
