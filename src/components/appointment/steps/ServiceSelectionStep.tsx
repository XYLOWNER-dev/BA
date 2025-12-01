'use client'

import { useState } from 'react'
import { Button, RadioGroup } from '@/components/ui'
import type { Service } from '@/types'

interface ServiceSelectionStepProps {
  services: Service[]
  selectedServiceId: string
  onSelect: (serviceId: string) => void
  onNext: () => void
  onBack: () => void
}

export function ServiceSelectionStep({
  services,
  selectedServiceId,
  onSelect,
  onNext,
  onBack,
}: ServiceSelectionStepProps) {
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedServiceId) {
      setError('Lütfen bir hizmet seçiniz.')
      return
    }

    setError('')
    onNext()
  }

  // Transform services to radio options
  const serviceOptions = services
    .filter((service) => service.isActive)
    .map((service) => ({
      value: service.id,
      label: service.name,
      description: service.description || undefined,
      price: service.price,
      duration: service.durationMinutes,
    }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          2. Adım | Hizmet Seçin
        </h2>
        <p className="mt-2 text-gray-600">
          Almak istediğiniz hizmeti seçiniz.
        </p>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2">
        <RadioGroup
          name="service"
          options={serviceOptions}
          value={selectedServiceId}
          onChange={(value) => {
            onSelect(value)
            setError('')
          }}
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
        >
          Geri
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Devam Et
        </Button>
      </div>
    </form>
  )
}

export default ServiceSelectionStep
