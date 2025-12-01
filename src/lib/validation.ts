import { z } from 'zod'

// Customer form validation schema
export const customerFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır')
    .max(100, 'Ad soyad en fazla 100 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Ad soyad sadece harf içerebilir'),
  email: z
    .string()
    .email('Geçerli bir e-posta adresi giriniz'),
  phone: z
    .string()
    .regex(/^5\d{9}$/, 'Geçerli bir telefon numarası giriniz (5XX XXX XXXX)'),
  phonePrefix: z.string().default('+90'),
})

// Service selection schema
export const serviceSelectionSchema = z.object({
  serviceId: z.string().min(1, 'Lütfen bir hizmet seçiniz'),
})

// Date and time selection schema
export const dateTimeSelectionSchema = z.object({
  staffId: z.string().min(1, 'Lütfen bir uzman seçiniz'),
  date: z.string().min(1, 'Lütfen bir tarih seçiniz'),
  time: z.string().min(1, 'Lütfen bir saat seçiniz'),
})

// Confirmation schema
export const confirmationSchema = z.object({
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: 'KVKK ve Gizlilik Sözleşmesini kabul etmelisiniz' }),
  }),
})

// Complete appointment schema
export const appointmentSchema = z.object({
  customer: customerFormSchema,
  serviceId: z.string().min(1, 'Lütfen bir hizmet seçiniz'),
  staffId: z.string().min(1, 'Lütfen bir uzman seçiniz'),
  date: z.string().min(1, 'Lütfen bir tarih seçiniz'),
  time: z.string().min(1, 'Lütfen bir saat seçiniz'),
  acceptedTerms: z.literal(true),
})

// Contact form schema
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır')
    .max(100, 'Ad soyad en fazla 100 karakter olabilir'),
  phone: z
    .string()
    .regex(/^5\d{9}$/, 'Geçerli bir telefon numarası giriniz (5XX XXX XXXX)'),
  message: z
    .string()
    .min(10, 'Mesajınız en az 10 karakter olmalıdır')
    .max(1000, 'Mesajınız en fazla 1000 karakter olabilir'),
})

// Admin login schema
export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Şifre gereklidir'),
})

// Admin appointment update schema
export const appointmentUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  notes: z.string().optional(),
})

// Admin manual appointment schema
export const manualAppointmentSchema = z.object({
  customerName: z.string().min(2, 'Müşteri adı gereklidir'),
  customerEmail: z.string().email('Geçerli e-posta gereklidir'),
  customerPhone: z.string().min(10, 'Telefon numarası gereklidir'),
  serviceId: z.string().min(1, 'Hizmet seçiniz'),
  staffId: z.string().min(1, 'Uzman seçiniz'),
  date: z.string().min(1, 'Tarih seçiniz'),
  time: z.string().min(1, 'Saat seçiniz'),
  notes: z.string().optional(),
})

// Type exports
export type CustomerFormData = z.infer<typeof customerFormSchema>
export type ServiceSelectionData = z.infer<typeof serviceSelectionSchema>
export type DateTimeSelectionData = z.infer<typeof dateTimeSelectionSchema>
export type ConfirmationData = z.infer<typeof confirmationSchema>
export type AppointmentData = z.infer<typeof appointmentSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type AdminLoginData = z.infer<typeof adminLoginSchema>
export type AppointmentUpdateData = z.infer<typeof appointmentUpdateSchema>
export type ManualAppointmentData = z.infer<typeof manualAppointmentSchema>
