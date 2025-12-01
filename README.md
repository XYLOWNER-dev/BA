# Baran Atay Hair Art - Online Randevu Sistemi

Modern, SEO-optimized erkek kuaför ve saç tasarım stüdyosu için online randevu web sitesi.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM + SQLite (geliştirme) / PostgreSQL (prodüksiyon)
- **Email:** Nodemailer (SMTP)
- **Animations:** Framer Motion
- **Form Validation:** Zod + React Hook Form
- **Task Scheduling:** node-cron

## Features

- Fullscreen video background hero section
- 4-step appointment booking wizard
- Real-time availability checking
- Email notifications (confirmation & reminders)
- Admin panel with password protection
- SEO optimized with JSON-LD structured data
- Responsive design (mobile-first)
- Turkish language UI

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── public/
│   ├── videos/            # Background video
│   ├── images/            # Images and placeholders
│   └── manifest.json      # PWA manifest
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── appointments/
│   │   │   ├── availability/
│   │   │   ├── contact/
│   │   │   ├── services/
│   │   │   ├── staff/
│   │   │   └── admin/stats/
│   │   ├── admin/         # Admin panel
│   │   ├── layout.tsx     # Root layout with SEO
│   │   ├── page.tsx       # Home page
│   │   ├── sitemap.ts     # Dynamic sitemap
│   │   └── robots.ts      # Robots.txt
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Header, Footer
│   │   ├── appointment/   # Appointment wizard
│   │   └── sections/      # Page sections
│   ├── lib/
│   │   ├── prisma.ts      # Prisma client singleton
│   │   ├── utils.ts       # Utility functions
│   │   ├── email.ts       # Email service
│   │   ├── scheduler.ts   # Reminder scheduler
│   │   └── validation.ts  # Zod schemas
│   └── types/
│       └── index.ts       # TypeScript types
├── .env.example           # Environment variables template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- SMTP credentials (for email notifications)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BA
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="file:./dev.db"

# SMTP (Gmail example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Baran Atay Hair Art <noreply@baranatay.com>"

# Admin
ADMIN_PASSWORD="your-secure-password"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Baran Atay Hair Art"
NEXT_PUBLIC_SALON_PHONE="+90 555 123 4567"
NEXT_PUBLIC_SALON_EMAIL="info@baranatay.com"
NEXT_PUBLIC_SALON_ADDRESS="Barbaros Bulvarı No: 123, Beşiktaş, İstanbul"
NEXT_PUBLIC_SALON_INSTAGRAM="https://instagram.com/baranatayhairairt"

# Reminder (minutes before appointment)
REMINDER_MINUTES_BEFORE="120"
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Seed the database with initial data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

Visit http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Database Management

### View database with Prisma Studio:
```bash
npm run db:studio
```

### Create a migration (development):
```bash
npm run db:migrate
```

### Reset database:
```bash
npx prisma db push --force-reset
npm run db:seed
```

### Switch to PostgreSQL

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/baran_atay_hair_art?schema=public"
```

3. Run migrations:
```bash
npx prisma migrate dev
```

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account → Security → App passwords
   - Select "Mail" and your device
   - Copy the generated password

3. Use in `.env`:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Custom SMTP

Update the SMTP settings according to your provider:
```env
SMTP_HOST="your-smtp-server.com"
SMTP_PORT="587"
SMTP_USER="username"
SMTP_PASS="password"
```

## Reminder Scheduler

The reminder system runs automatically using node-cron. It checks for upcoming appointments and sends reminders.

### Configuration

```env
REMINDER_MINUTES_BEFORE="120"    # Send reminder 2 hours before
REMINDER_CRON_SCHEDULE="*/5 * * * *"  # Check every 5 minutes
```

### For Serverless Deployment

If deploying to Vercel or similar serverless platforms, you'll need to use:

1. **Vercel Cron Jobs** - Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "*/5 * * * *"
  }]
}
```

2. **Create the cron endpoint** at `/api/cron/reminders/route.ts`:
```typescript
import { processReminders } from '@/lib/scheduler'

export async function GET() {
  await processReminders()
  return Response.json({ success: true })
}
```

## Customization

### Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#013220',  // Change this
    // ... other shades
  }
}
```

### Fonts

Edit `src/app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');
```

Update `tailwind.config.ts`:
```typescript
fontFamily: {
  serif: ['Your Font', 'Georgia', 'serif'],
  sans: ['Your Sans Font', 'system-ui', 'sans-serif'],
}
```

### Background Video

1. Place your video in `public/videos/barber-hero.mp4`
2. Supported formats: MP4 (recommended), WebM
3. Recommended: 15-30 second loop, 1080p, compressed

### Services

Edit seed data in `prisma/seed.ts` or add via database directly.

## Admin Panel

Access at `/admin` with the password set in `ADMIN_PASSWORD`.

Features:
- View appointments by date/status
- Change appointment status
- View statistics (weekly/monthly/popular services)
- View contact form messages

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services |
| GET | `/api/staff` | List all staff |
| GET | `/api/availability?staffId=&date=` | Get available time slots |
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments` | List appointments (admin) |
| PATCH | `/api/appointments/[id]` | Update appointment status |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/admin/stats` | Get admin statistics |

## SEO

The site includes:
- Dynamic meta tags
- Open Graph / Twitter cards
- JSON-LD structured data (BarberShop schema)
- Dynamic sitemap.xml
- robots.txt
- Semantic HTML structure

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## License

This project is proprietary. All rights reserved.

---

Built with Next.js for Baran Atay Hair Art
