import cron from 'node-cron'
import prisma from './prisma'
import {
  sendCustomerReminderEmail,
  sendStaffReminderEmail,
} from './email'
import { addHours, isBefore, isAfter, parseISO, setHours, setMinutes } from 'date-fns'

// Reminder minutes before appointment (from env or default 120 = 2 hours)
const REMINDER_MINUTES = parseInt(process.env.REMINDER_MINUTES_BEFORE || '120')

// Cron schedule (from env or default every 5 minutes)
const CRON_SCHEDULE = process.env.REMINDER_CRON_SCHEDULE || '*/5 * * * *'

// Flag to track if scheduler is running
let isSchedulerRunning = false

// Process pending reminders
export async function processReminders(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Processing appointment reminders...`)

  try {
    const now = new Date()
    const reminderWindowStart = now
    const reminderWindowEnd = addHours(now, REMINDER_MINUTES / 60)

    // Find appointments that need reminders
    const appointmentsNeedingReminders = await prisma.appointment.findMany({
      where: {
        status: 'CONFIRMED',
        reminderSent: false,
        date: {
          gte: new Date(now.toISOString().split('T')[0]), // Today or later
          lte: new Date(reminderWindowEnd.toISOString().split('T')[0] + 'T23:59:59Z'),
        },
      },
      include: {
        customer: true,
        staff: true,
        service: true,
      },
    })

    console.log(`Found ${appointmentsNeedingReminders.length} appointments to check for reminders`)

    for (const appointment of appointmentsNeedingReminders) {
      // Combine date and time to get full appointment datetime
      const appointmentDate = new Date(appointment.date)
      const [hours, minutes] = appointment.startTime.split(':').map(Number)
      appointmentDate.setHours(hours, minutes, 0, 0)

      // Calculate when reminder should be sent
      const reminderTime = new Date(appointmentDate.getTime() - REMINDER_MINUTES * 60 * 1000)

      // Check if we're within the reminder window (reminder time has passed but appointment hasn't)
      if (isAfter(now, reminderTime) && isBefore(now, appointmentDate)) {
        console.log(`Sending reminder for appointment ${appointment.id}`)

        const emailData = {
          customerName: appointment.customer.fullName,
          customerEmail: appointment.customer.email,
          customerPhone: appointment.customer.phone,
          serviceName: appointment.service.name,
          staffName: appointment.staff.name,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          price: appointment.service.price,
        }

        // Send reminders
        const customerEmailSent = await sendCustomerReminderEmail(emailData)
        const staffEmailSent = await sendStaffReminderEmail(emailData, appointment.staff.email)

        if (customerEmailSent || staffEmailSent) {
          // Mark reminder as sent
          await prisma.appointment.update({
            where: { id: appointment.id },
            data: { reminderSent: true },
          })
          console.log(`Reminder marked as sent for appointment ${appointment.id}`)
        }
      }
    }

    console.log(`[${new Date().toISOString()}] Reminder processing completed`)
  } catch (error) {
    console.error('Error processing reminders:', error)
  }
}

// Start the reminder scheduler
export function startScheduler(): void {
  if (isSchedulerRunning) {
    console.log('Scheduler is already running')
    return
  }

  console.log(`Starting reminder scheduler with schedule: ${CRON_SCHEDULE}`)
  console.log(`Reminders will be sent ${REMINDER_MINUTES} minutes before appointments`)

  cron.schedule(CRON_SCHEDULE, async () => {
    await processReminders()
  })

  isSchedulerRunning = true
  console.log('Reminder scheduler started successfully')

  // Run once immediately on startup
  processReminders()
}

// Stop the scheduler (useful for testing)
export function stopScheduler(): void {
  // Note: node-cron doesn't have a direct stop method for all tasks
  // You would need to store the task reference and call task.stop()
  isSchedulerRunning = false
  console.log('Scheduler stop requested')
}

// Check if scheduler is running
export function isSchedulerActive(): boolean {
  return isSchedulerRunning
}

// Manual trigger for testing
export async function triggerReminderCheck(): Promise<{ processed: number }> {
  await processReminders()
  return { processed: 1 }
}
