import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateTimeSlots, isTimeSlotAvailable, timeToMinutes } from '@/lib/utils'

// GET - Fetch available time slots for a specific date and staff
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get('staffId')
    const date = searchParams.get('date')
    const duration = parseInt(searchParams.get('duration') || '30')

    if (!staffId || !date) {
      return NextResponse.json(
        { success: false, error: 'staffId ve date parametreleri gereklidir.' },
        { status: 400 }
      )
    }

    // Get all appointments for the specified staff and date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        staffId,
        date: new Date(date),
        status: { not: 'CANCELLED' },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    })

    // Generate all possible time slots (09:00 - 21:00)
    const allSlots = generateTimeSlots(9, 21, 30)

    // Check current time for today's date
    const today = new Date()
    const selectedDate = new Date(date)
    const isToday =
      today.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]

    const currentTimeMinutes = isToday
      ? today.getHours() * 60 + today.getMinutes()
      : 0

    // Map slots with availability
    const slots = allSlots.map((time) => {
      const slotMinutes = timeToMinutes(time)

      // Check if slot is in the past (for today)
      if (isToday && slotMinutes <= currentTimeMinutes + 30) {
        return { time, available: false }
      }

      // Check if slot doesn't go past closing time
      if (slotMinutes + duration > 21 * 60) {
        return { time, available: false }
      }

      // Check if slot overlaps with existing appointments
      const available = isTimeSlotAvailable(time, duration, existingAppointments)

      return { time, available }
    })

    return NextResponse.json({
      success: true,
      data: {
        date,
        staffId,
        slots,
      },
    })
  } catch (error) {
    console.error('Failed to fetch availability:', error)
    return NextResponse.json(
      { success: false, error: 'Müsaitlik bilgisi alınırken bir hata oluştu.' },
      { status: 500 }
    )
  }
}
