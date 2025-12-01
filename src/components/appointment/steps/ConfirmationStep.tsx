'use client'

import { useState } from 'react'
import { Button, Checkbox } from '@/components/ui'
import { formatDate, formatPrice } from '@/lib/utils'
import type { Service, Staff } from '@/types'
import type { WizardData } from '../AppointmentWizard'

interface ConfirmationStepProps {
  data: WizardData
  selectedService?: Service
  selectedStaff?: Staff
  updateData: (data: Partial<WizardData>) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function ConfirmationStep({
  data,
  selectedService,
  selectedStaff,
  updateData,
  onSubmit,
  onBack,
  isSubmitting,
}: ConfirmationStepProps) {
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!data.acceptedTerms) {
      setError('KVKK ve Gizlilik Sözleşmesini kabul etmelisiniz.')
      return
    }

    setError('')
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          4. Adım | Randevu Özeti & Onay
        </h2>
        <p className="mt-2 text-gray-600">
          Lütfen randevu bilgilerinizi kontrol ediniz.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        {/* Customer Info */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Müşteri Bilgileri
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Ad Soyad:</span>{' '}
              <span className="font-medium">{data.fullName}</span>
            </div>
            <div>
              <span className="text-gray-500">E-posta:</span>{' '}
              <span className="font-medium">{data.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Telefon:</span>{' '}
              <span className="font-medium">
                {data.phonePrefix} {data.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Service Info */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
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
                d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Hizmet Bilgileri
          </h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Hizmet:</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Süre:</span>
              <span className="font-medium">
                {selectedService?.durationMinutes} dakika
              </span>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Randevu Detayları
          </h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Uzman:</span>
              <span className="font-medium">{selectedStaff?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tarih:</span>
              <span className="font-medium">{formatDate(data.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Saat:</span>
              <span className="font-medium">{data.time}</span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-semibold text-gray-900">Toplam Ücret:</span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(selectedService?.price || 0)}
          </span>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="bg-primary/5 rounded-xl p-4">
        <Checkbox
          name="acceptedTerms"
          checked={data.acceptedTerms}
          onChange={(e) => {
            updateData({ acceptedTerms: e.target.checked })
            setError('')
          }}
          label={
            <span>
              <a
                href="#"
                className="text-primary underline hover:no-underline"
                onClick={(e) => e.preventDefault()}
              >
                KVKK Aydınlatma Metni
              </a>{' '}
              ve{' '}
              <a
                href="#"
                className="text-primary underline hover:no-underline"
                onClick={(e) => e.preventDefault()}
              >
                Gizlilik Sözleşmesi
              </a>
              'ni okudum ve kabul ediyorum.
            </span>
          }
          error={error}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isSubmitting}
        >
          Geri
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isSubmitting}
        >
          Randevuyu Onayla
        </Button>
      </div>
    </form>
  )
}

export default ConfirmationStep
