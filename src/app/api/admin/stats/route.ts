import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

// GET - Fetch admin statistics
export async function GET() {
  try {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Total appointments this week
    const weeklyAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
        status: { not: 'CANCELLED' },
      },
    })

    // Total appointments this month
    const monthlyAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
        status: { not: 'CANCELLED' },
      },
    })

    // Appointments by status
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    })

    // Popular services (this month)
    const popularServicesRaw = await prisma.appointment.groupBy({
      by: ['serviceId'],
      _count: {
        serviceId: true,
      },
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
        status: { not: 'CANCELLED' },
      },
      orderBy: {
        _count: {
          serviceId: 'desc',
        },
      },
      take: 5,
    })

    // Get service names
    const serviceIds = popularServicesRaw.map((s) => s.serviceId)
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
    })

    const popularServices = popularServicesRaw.map((item) => {
      const service = services.find((s) => s.id === item.serviceId)
      return {
        serviceId: item.serviceId,
        serviceName: service?.name || 'Bilinmeyen',
        count: item._count.serviceId,
      }
    })

    // Today's appointments
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const todaysAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
        status: { not: 'CANCELLED' },
      },
    })

    // Unread messages
    const unreadMessages = await prisma.contactMessage.count({
      where: { isRead: false },
    })

    return NextResponse.json({
      success: true,
      data: {
        totalAppointmentsThisWeek: weeklyAppointments,
        totalAppointmentsThisMonth: monthlyAppointments,
        todaysAppointments,
        popularServices,
        appointmentsByStatus: appointmentsByStatus.map((item) => ({
          status: item.status,
          count: item._count.status,
        })),
        unreadMessages,
      },
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { success: false, error: 'İstatistikler getirilirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}
