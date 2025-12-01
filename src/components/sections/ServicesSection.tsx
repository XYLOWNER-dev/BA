'use client'

import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import type { Service } from '@/types'

interface ServicesSectionProps {
  services: Service[]
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const activeServices = services.filter((s) => s.isActive)

  return (
    <section id="hizmetler" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl font-bold italic text-gray-900 mb-4"
          >
            Hizmetlerimiz
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-gray-600 text-lg leading-relaxed">
              Baran Atay Hair Art olarak, erkek kuaförlüğünde en son trendleri ve
              klasik teknikleri bir arada sunuyoruz. Premium ürünler ve uzman
              kadromuzla saç kesimi, sakal tasarımı, saç boyama ve cilt bakımı
              hizmetlerimizden yararlanabilirsiniz.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mt-4">
              Her müşterimize özel, kişiselleştirilmiş bir deneyim sunmayı
              hedefliyoruz. Modern saç tasarımı anlayışımızla tarzınızı yansıtın.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeServices.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-6 h-full border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 hover:shadow-xl">
                {/* Icon placeholder */}
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                {/* Service Name */}
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>

                {/* Description */}
                {service.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                )}

                {/* Duration & Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  {service.durationMinutes > 0 && (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {service.durationMinutes} dk
                    </span>
                  )}
                  <span className="font-bold text-primary text-lg">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Additional SEO Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Tüm hizmetlerimiz kaliteli ve profesyonel ürünlerle gerçekleştirilmektedir.
            Randevu almak için yukarıdaki "Randevu Al" butonuna tıklayabilir veya
            bizi arayabilirsiniz.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesSection
