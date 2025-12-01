'use client'

import { useState } from 'react'
import { Button, Input, Select } from '@/components/ui'
import { customerFormSchema } from '@/lib/validation'
import type { WizardData } from '../AppointmentWizard'

interface CustomerInfoStepProps {
  data: WizardData
  updateData: (data: Partial<WizardData>) => void
  onNext: () => void
  onCancel: () => void
}

export function CustomerInfoStep({
  data,
  updateData,
  onNext,
  onCancel,
}: CustomerInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const result = customerFormSchema.safeParse({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      phonePrefix: data.phonePrefix,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          1. Adım | Bilgilerinizi Girin
        </h2>
        <p className="mt-2 text-gray-600">
          Randevu oluşturmak için lütfen iletişim bilgilerinizi giriniz.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Ad Soyad"
          name="fullName"
          value={data.fullName}
          onChange={(e) => updateData({ fullName: e.target.value })}
          error={errors.fullName}
          placeholder="Adınız ve soyadınız"
          autoFocus
        />

        <Input
          label="E-posta Adresi"
          name="email"
          type="email"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          error={errors.email}
          placeholder="ornek@email.com"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefon Numarası
          </label>
          <div className="flex gap-2">
            <Select
              name="phonePrefix"
              value={data.phonePrefix}
              onChange={(e) => updateData({ phonePrefix: e.target.value })}
              options={[
                { value: '+90', label: '+90 (TR)' },
                { value: '+1', label: '+1 (US)' },
                { value: '+44', label: '+44 (UK)' },
                { value: '+49', label: '+49 (DE)' },
              ]}
              className="w-32"
            />
            <div className="flex-1">
              <Input
                name="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '')
                  updateData({ phone: value })
                }}
                error={errors.phone}
                placeholder="5XX XXX XXXX"
                maxLength={10}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          İptal
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Devam Et
        </Button>
      </div>
    </form>
  )
}

export default CustomerInfoStep
