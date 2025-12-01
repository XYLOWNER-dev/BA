'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'

interface SuccessStepProps {
  details: {
    date: string
    time: string
    service: string
    staff: string
  }
  onClose: () => void
}

export function SuccessStep({ details, onClose }: SuccessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-8"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
      >
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      {/* Success Message */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Randevunuz Alındı!
      </h2>
      <p className="text-gray-600 mb-8">
        Randevu onayı e-posta adresinize gönderilmiştir.
      </p>

      {/* Appointment Details */}
      <div className="bg-primary/5 rounded-xl p-6 mb-8 text-left max-w-sm mx-auto">
        <h3 className="font-semibold text-gray-900 mb-4 text-center">
          Randevu Detayları
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Hizmet:</span>
            <span className="font-medium text-gray-900">{details.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Uzman:</span>
            <span className="font-medium text-gray-900">{details.staff}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tarih:</span>
            <span className="font-medium text-gray-900">
              {formatDate(details.date)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Saat:</span>
            <span className="font-medium text-gray-900">{details.time}</span>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="text-sm text-yellow-800 font-medium">Önemli Hatırlatma</p>
            <p className="text-sm text-yellow-700 mt-1">
              Lütfen randevunuza 5 dakika erken geliniz. İptal veya değişiklik için
              en az 2 saat öncesinden bizimle iletişime geçiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <Button onClick={onClose} variant="primary" size="lg">
        Tamam
      </Button>
    </motion.div>
  )
}

export default SuccessStep
