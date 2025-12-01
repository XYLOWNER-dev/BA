import nodemailer from 'nodemailer'
import { formatDate, formatTime } from './utils'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Types for email data
interface AppointmentEmailData {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceName: string
  staffName: string
  date: Date | string
  startTime: string
  endTime: string
  price: number
}

interface ContactEmailData {
  fullName: string
  phone: string
  message: string
}

// Salon information from environment
const salonInfo = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Baran Atay Hair Art',
  phone: process.env.NEXT_PUBLIC_SALON_PHONE || '+90 555 123 4567',
  email: process.env.NEXT_PUBLIC_SALON_EMAIL || 'info@baranatay.com',
  address: process.env.NEXT_PUBLIC_SALON_ADDRESS || 'Barbaros Bulvarı No: 123, Beşiktaş, İstanbul',
  instagram: process.env.NEXT_PUBLIC_SALON_INSTAGRAM || 'https://instagram.com/baranatayhairairt',
}

// Send confirmation email to customer
export async function sendCustomerConfirmationEmail(data: AppointmentEmailData): Promise<boolean> {
  const formattedDate = formatDate(data.date)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #013220; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-family: Georgia, serif; font-style: italic; font-weight: bold; }
        .content { padding: 30px; background-color: #f9f9f9; }
        .appointment-card { background: white; border-radius: 10px; padding: 25px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .appointment-card h2 { color: #013220; margin-top: 0; }
        .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; width: 150px; color: #666; }
        .detail-value { color: #333; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .footer a { color: #013220; }
        .highlight { background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${salonInfo.name}</h1>
          <p>Randevunuz Onaylandı</p>
        </div>
        <div class="content">
          <p>Sayın <strong>${data.customerName}</strong>,</p>
          <p>Randevunuz başarıyla oluşturulmuştur. Detayları aşağıda bulabilirsiniz:</p>

          <div class="appointment-card">
            <h2>Randevu Detayları</h2>
            <div class="detail-row">
              <span class="detail-label">Hizmet:</span>
              <span class="detail-value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Uzman:</span>
              <span class="detail-value">${data.staffName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tarih:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Saat:</span>
              <span class="detail-value">${formatTime(data.startTime)} - ${formatTime(data.endTime)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Ücret:</span>
              <span class="detail-value">${data.price} TL</span>
            </div>
          </div>

          <div class="highlight">
            <strong>Önemli:</strong> Randevunuza 5 dakika erken gelmenizi rica ederiz. İptal veya değişiklik için en az 2 saat öncesinden bizimle iletişime geçiniz.
          </div>

          <div class="appointment-card">
            <h2>İletişim & Konum</h2>
            <p><strong>Adres:</strong> ${salonInfo.address}</p>
            <p><strong>Telefon:</strong> ${salonInfo.phone}</p>
            <p><strong>Instagram:</strong> <a href="${salonInfo.instagram}">@baranatayhairairt</a></p>
          </div>
        </div>
        <div class="footer">
          <p>Bu e-posta ${salonInfo.name} tarafından otomatik olarak gönderilmiştir.</p>
          <p>&copy; ${new Date().getFullYear()} ${salonInfo.name}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"${salonInfo.name}" <noreply@baranatay.com>`,
      to: data.customerEmail,
      subject: `${salonInfo.name} | Randevunuz Onaylandı`,
      html: htmlContent,
    })
    console.log(`Confirmation email sent to customer: ${data.customerEmail}`)
    return true
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error)
    return false
  }
}

// Send notification email to staff/barber
export async function sendStaffNotificationEmail(
  data: AppointmentEmailData,
  staffEmail: string
): Promise<boolean> {
  const formattedDate = formatDate(data.date)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #013220; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-family: Georgia, serif; font-style: italic; font-weight: bold; }
        .content { padding: 30px; background-color: #f9f9f9; }
        .appointment-card { background: white; border-radius: 10px; padding: 25px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .appointment-card h2 { color: #013220; margin-top: 0; }
        .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #666; }
        .detail-value { color: #333; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .new-badge { background-color: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Yeni Randevu</h1>
          <p>${salonInfo.name}</p>
        </div>
        <div class="content">
          <span class="new-badge">YENİ</span>
          <p>Yeni bir randevu oluşturuldu. Detaylar:</p>

          <div class="appointment-card">
            <h2>Müşteri Bilgileri</h2>
            <div class="detail-row">
              <span class="detail-label">Ad Soyad:</span>
              <span class="detail-value">${data.customerName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Telefon:</span>
              <span class="detail-value">${data.customerPhone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">E-posta:</span>
              <span class="detail-value">${data.customerEmail}</span>
            </div>
          </div>

          <div class="appointment-card">
            <h2>Randevu Detayları</h2>
            <div class="detail-row">
              <span class="detail-label">Hizmet:</span>
              <span class="detail-value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tarih:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Saat:</span>
              <span class="detail-value">${formatTime(data.startTime)} - ${formatTime(data.endTime)}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${salonInfo.name}</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"${salonInfo.name}" <noreply@baranatay.com>`,
      to: staffEmail,
      subject: `Yeni Randevu | ${salonInfo.name}`,
      html: htmlContent,
    })
    console.log(`Notification email sent to staff: ${staffEmail}`)
    return true
  } catch (error) {
    console.error('Failed to send staff notification email:', error)
    return false
  }
}

// Send reminder email to customer
export async function sendCustomerReminderEmail(data: AppointmentEmailData): Promise<boolean> {
  const formattedDate = formatDate(data.date)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #013220; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-family: Georgia, serif; font-style: italic; font-weight: bold; }
        .content { padding: 30px; background-color: #f9f9f9; }
        .reminder-box { background: linear-gradient(135deg, #013220 0%, #1a5a3a 100%); color: white; border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center; }
        .reminder-box h2 { margin: 0 0 10px 0; }
        .appointment-card { background: white; border-radius: 10px; padding: 25px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #666; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${salonInfo.name}</h1>
          <p>Randevu Hatırlatması</p>
        </div>
        <div class="content">
          <div class="reminder-box">
            <h2>Randevunuz 2 Saat Sonra!</h2>
            <p>Lütfen zamanında geliniz.</p>
          </div>

          <p>Sayın <strong>${data.customerName}</strong>,</p>
          <p>Bugünkü randevunuzu hatırlatmak isteriz:</p>

          <div class="appointment-card">
            <div class="detail-row">
              <span class="detail-label">Hizmet:</span> ${data.serviceName}
            </div>
            <div class="detail-row">
              <span class="detail-label">Uzman:</span> ${data.staffName}
            </div>
            <div class="detail-row">
              <span class="detail-label">Tarih:</span> ${formattedDate}
            </div>
            <div class="detail-row">
              <span class="detail-label">Saat:</span> ${formatTime(data.startTime)}
            </div>
            <div class="detail-row">
              <span class="detail-label">Adres:</span> ${salonInfo.address}
            </div>
          </div>

          <p><strong>Not:</strong> Herhangi bir sorunuz varsa ${salonInfo.phone} numaralı telefondan bize ulaşabilirsiniz.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${salonInfo.name}</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"${salonInfo.name}" <noreply@baranatay.com>`,
      to: data.customerEmail,
      subject: `Hatırlatma: Randevunuz 2 Saat Sonra | ${salonInfo.name}`,
      html: htmlContent,
    })
    console.log(`Reminder email sent to customer: ${data.customerEmail}`)
    return true
  } catch (error) {
    console.error('Failed to send customer reminder email:', error)
    return false
  }
}

// Send reminder email to staff
export async function sendStaffReminderEmail(
  data: AppointmentEmailData,
  staffEmail: string
): Promise<boolean> {
  const formattedDate = formatDate(data.date)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ff9800; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; background-color: #fff3e0; border-radius: 0 0 10px 10px; }
        .detail-row { padding: 8px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Yaklaşan Randevu - 2 Saat Sonra</h2>
        </div>
        <div class="content">
          <p><strong>Müşteri:</strong> ${data.customerName}</p>
          <p><strong>Telefon:</strong> ${data.customerPhone}</p>
          <p><strong>Hizmet:</strong> ${data.serviceName}</p>
          <p><strong>Saat:</strong> ${formatTime(data.startTime)} - ${formatTime(data.endTime)}</p>
          <p><strong>Tarih:</strong> ${formattedDate}</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"${salonInfo.name}" <noreply@baranatay.com>`,
      to: staffEmail,
      subject: `Yaklaşan Randevu: ${data.customerName} - ${formatTime(data.startTime)}`,
      html: htmlContent,
    })
    console.log(`Reminder email sent to staff: ${staffEmail}`)
    return true
  } catch (error) {
    console.error('Failed to send staff reminder email:', error)
    return false
  }
}

// Send contact form email
export async function sendContactFormEmail(data: ContactEmailData): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #013220; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #013220; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Yeni İletişim Formu Mesajı</h2>
        </div>
        <div class="content">
          <p><strong>Gönderen:</strong> ${data.fullName}</p>
          <p><strong>Telefon:</strong> ${data.phone}</p>
          <div class="message-box">
            <p><strong>Mesaj:</strong></p>
            <p>${data.message}</p>
          </div>
          <p><em>Bu mesaj ${new Date().toLocaleString('tr-TR')} tarihinde web sitesi iletişim formu üzerinden gönderilmiştir.</em></p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"${salonInfo.name}" <noreply@baranatay.com>`,
      to: salonInfo.email,
      subject: `İletişim Formu: ${data.fullName}`,
      html: htmlContent,
      replyTo: data.phone, // Using phone since we don't collect email in contact form
    })
    console.log('Contact form email sent successfully')
    return true
  } catch (error) {
    console.error('Failed to send contact form email:', error)
    return false
  }
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log('Email configuration verified successfully')
    return true
  } catch (error) {
    console.error('Email configuration verification failed:', error)
    return false
  }
}
