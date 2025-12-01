import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendContactFormEmail } from '@/lib/email'
import { contactFormSchema } from '@/lib/validation'

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = contactFormSchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      )
    }

    const { fullName, phone, message } = validation.data

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        fullName,
        phone: `+90${phone}`,
        message,
      },
    })

    // Send email notification (async, don't block response)
    sendContactFormEmail({ fullName, phone: `+90${phone}`, message }).catch((err) =>
      console.error('Failed to send contact email:', err)
    )

    return NextResponse.json({
      success: true,
      data: contactMessage,
      message: 'Mesajınız başarıyla gönderildi.',
    })
  } catch (error) {
    console.error('Failed to submit contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Mesaj gönderilirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// GET - Fetch contact messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const where = unreadOnly ? { isRead: false } : {}

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: messages,
    })
  } catch (error) {
    console.error('Failed to fetch contact messages:', error)
    return NextResponse.json(
      { success: false, error: 'Mesajlar getirilirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}
