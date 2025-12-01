import { clsx, type ClassValue } from 'clsx'

// Utility function for conditional class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format price in Turkish Lira
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Format date in Turkish locale
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

// Format short date
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

// Format time in 24-hour format
export function formatTime(time: string): string {
  return time
}

// Generate time slots between opening and closing hours
export function generateTimeSlots(
  openingHour: number = 9,
  closingHour: number = 21,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = []

  for (let hour = openingHour; hour < closingHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(timeString)
    }
  }

  return slots
}

// Calculate end time based on start time and duration
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + durationMinutes
  const endHours = Math.floor(totalMinutes / 60)
  const endMinutes = totalMinutes % 60

  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
}

// Check if a time slot is available (not overlapping with existing appointments)
export function isTimeSlotAvailable(
  slotTime: string,
  slotDuration: number,
  existingAppointments: Array<{ startTime: string; endTime: string }>
): boolean {
  const slotStart = timeToMinutes(slotTime)
  const slotEnd = slotStart + slotDuration

  for (const appointment of existingAppointments) {
    const appointmentStart = timeToMinutes(appointment.startTime)
    const appointmentEnd = timeToMinutes(appointment.endTime)

    // Check for overlap
    if (slotStart < appointmentEnd && slotEnd > appointmentStart) {
      return false
    }
  }

  return true
}

// Convert time string (HH:mm) to minutes since midnight
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Get today's date in YYYY-MM-DD format
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

// Check if a date string is today or in the future
export function isDateValid(dateString: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selectedDate = new Date(dateString)
  selectedDate.setHours(0, 0, 0, 0)
  return selectedDate >= today
}

// Validate Turkish phone number
export function isValidTurkishPhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '')
  // Turkish phone numbers: 10 digits starting with 5
  return /^5\d{9}$/.test(cleaned)
}

// Validate email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Get status badge color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get status text in Turkish
export function getStatusText(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Beklemede'
    case 'CONFIRMED':
      return 'Onaylandı'
    case 'CANCELLED':
      return 'İptal Edildi'
    case 'COMPLETED':
      return 'Tamamlandı'
    default:
      return status
  }
}
