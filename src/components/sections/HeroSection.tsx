'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { AppointmentWizard } from '@/components/appointment'
import type { Service, Staff } from '@/types'

interface HeroSectionProps {
  services: Service[]
  staff: Staff[]
}

export function HeroSection({ services, staff }: HeroSectionProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const handleScrollToServices = () => {
    const servicesSection = document.querySelector('#hizmetler')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="anasayfa"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/barber-hero.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Title */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold italic text-white mb-6 tracking-wide">
            Baran Atay{' '}
            <span className="text-primary-300 block md:inline">Hair Art</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Modern kuaför deneyimini, kişiye özel saç tasarımıyla buluşturan
            premium randevu sistemi. Profesyonel ekibimizle tarzınızı keşfedin.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setIsWizardOpen(true)}
                size="lg"
                className="min-w-[200px] bg-primary hover:bg-primary-600 text-white font-semibold py-4 px-8 text-lg shadow-2xl"
              >
                Randevu Al
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleScrollToServices}
                variant="outline"
                size="lg"
                className="min-w-[200px] border-white/50 text-white hover:bg-white/10 font-semibold py-4 px-8 text-lg"
              >
                Hizmetlerimizi İnceleyin
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-white/50"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Appointment Wizard Modal */}
      <AppointmentWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        services={services}
        staff={staff}
      />
    </section>
  )
}

export default HeroSection
