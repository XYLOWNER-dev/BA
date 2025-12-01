// Type definitions for Baran Atay Hair Art appointment system

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Customer {
  id: string
  fullName: string
  email: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export interface Staff {
  id: string
  name: string
  email: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  price: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  customerId: string
  staffId: string
  serviceId: string
  date: Date
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes: string | null
  reminderSent: boolean
  createdAt: Date
  updatedAt: Date
  customer?: Customer
  staff?: Staff
  service?: Service
}

export interface ContactMessage {
  id: string
  fullName: string
  phone: string
  message: string
  isRead: boolean
  createdAt: Date
}

// Form types for the appointment wizard
export interface CustomerFormData {
  fullName: string
  email: string
  phone: string
  phonePrefix: string
}

export interface AppointmentFormData {
  customer: CustomerFormData
  serviceId: string
  staffId: string
  date: string
  time: string
  acceptedTerms: boolean
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface AvailabilityResponse {
  date: string
  staffId: string
  slots: TimeSlot[]
}

// Admin statistics
export interface AdminStats {
  totalAppointmentsThisWeek: number
  totalAppointmentsThisMonth: number
  popularServices: {
    serviceId: string
    serviceName: string
    count: number
  }[]
  appointmentsByStatus: {
    status: AppointmentStatus
    count: number
  }[]
}
