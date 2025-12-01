'use client'

import { motion } from 'framer-motion'

export function AboutSection() {
  return (
    <section id="hakkimizda" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image/Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-primary/10 rounded-2xl overflow-hidden relative">
              {/* Placeholder for image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-primary/60 text-sm">
                    Salon fotoğrafı eklenebilir
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="text-center">
                <span className="block text-4xl font-bold text-primary">10+</span>
                <span className="text-gray-600 text-sm">Yıllık Deneyim</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold italic text-gray-900 mb-6">
              Baran Atay Hair Art Hakkında
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Baran Atay Hair Art, İstanbul'un kalbinde modern erkek kuaförlüğünün
                yeni adresini oluşturmak amacıyla kuruldu. Kurucu Baran Atay'ın 10 yılı
                aşkın sektör deneyimi ve sanat anlayışıyla şekillenen stüdyomuz, her
                müşterisine benzersiz bir deneyim sunmayı hedefliyor.
              </p>

              <p>
                Kaliteli ürünler, modern teknikler ve hijyenik bir ortam sunmayı
                önceliğimiz olarak belirliyoruz. Her saç kesimi, her sakal tasarımı
                bizim için bir sanat eseri. Müşterilerimizin yüz hatlarına, yaşam
                tarzlarına ve kişisel tercihlerine uygun, tamamen kişiselleştirilmiş
                hizmetler sunuyoruz.
              </p>

              <p>
                Premium markalardan seçtiğimiz ürünlerle saç sağlığınızı korurken,
                deneyimli ekibimizle en son trendleri takip ediyor ve size en uygun
                tarzı öneriyoruz. Hijyen ve müşteri memnuniyeti bizim için her şeyden
                önemli.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Premium Ürünler</h4>
                  <p className="text-sm text-gray-500">Kaliteli markalar</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
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
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Randevulu Sistem</h4>
                  <p className="text-sm text-gray-500">Bekleme yok</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Modern Teknikler</h4>
                  <p className="text-sm text-gray-500">Son trendler</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Hijyen Öncelikli</h4>
                  <p className="text-sm text-gray-500">Steril ortam</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
