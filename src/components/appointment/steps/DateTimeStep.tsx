'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Select, DatePicker, TimeSlotPicker } from '@/components/ui'
import type { Staff, Service, TimeSlot } from '@/types'
import type { WizardData } from '../AppointmentWizard'

interface DateTimeStepProps {
  staff: Staff[]
  selectedStaffId: string
  selectedDate: string
  selectedTime: string
  selectedServiceId: string
  services: Service[]
  updateData: (data: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}

export function DateTimeStep({
  staff,
  selectedStaffId,
  selectedDate,
  selectedTime,
  selectedServiceId,
  services,
  updateData,
  onNext,
  onBack,
}: DateTimeStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  // Get selected service duration
  const selectedService = services.find((s) => s.id === selectedServiceId)
  const serviceDuration = selectedService?.durationMinutes || 30

  // Fetch available time slots when staff and date change
  const fetchTimeSlots = useCallback(async () => {
    if (!selectedStaffId || !selectedDate) {
      setTimeSlots([])
      return
    }

    setIsLoadingSlots(true)

    try {
      const params = new URLSearchParams({
        staffId: selectedStaffId,
        date: selectedDate,
        duration: serviceDuration.toString(),
      })

      const response = await fetch(`/api/availability?${params}`)
      const result = await response.json()

      if (result.success) {
        setTimeSlots(result.data.slots)
        // Clear selected time if it's no longer available
        const isTimeStillAvailable = result.data.slots.some(
          (slot: TimeSlot) => slot.time === selectedTime && slot.available
        )
        if (!isTimeStillAvailable) {
          updateData({ time: '' })
        }
      } else {
        setTimeSlots([])
      }
    } catch (error) {
      console.error('Failed to fetch time slots:', error)
      setTimeSlots([])
    } finally {
      setIsLoadingSlots(false)
    }
  }, [selectedStaffId, selectedDate, serviceDuration, selectedTime, updateData])

  useEffect(() => {
    fetchTimeSlots()
  }, [fetchTimeSlots])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!selectedStaffId) {
      newErrors.staffId = 'Lütfen bir uzman seçiniz.'
    }
    if (!selectedDate) {
      newErrors.date = 'Lütfen bir tarih seçiniz.'
    }
    if (!selectedTime) {
      newErrors.time = 'Lütfen bir saat seçiniz.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onNext()
  }

  // Transform staff to select options
  const staffOptions = staff
    .filter((s) => s.isActive)
    .map((s) => ({
      value: s.id,
      label: s.name,
    }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          3. Adım | Uzman, Tarih ve Saat Seçin
        </h2>
        <p className="mt-2 text-gray-600">
          Randevunuz için uygun uzman, tarih ve saati seçiniz.
        </p>
      </div>

      <div className="space-y-6">
        {/* Staff Selection */}
        <Select
          label="Uzman / Stylist"
          name="staffId"
          value={selectedStaffId}
          onChange={(e) => {
            updateData({ staffId: e.target.value, time: '' })
            setErrors((prev) => ({ ...prev, staffId: '' }))
          }}
          options={staffOptions}
          placeholder="Uzman seçiniz"
          error={errors.staffId}
        />

        {/* Date Selection */}
        <DatePicker
          label="Tarih"
          value={selectedDate}
          onChange={(date) => {
            updateData({ date, time: '' })
            setErrors((prev) => ({ ...prev, date: '' }))
          }}
          error={errors.date}
          daysToShow={14}
        />

        {/* Time Slots */}
        <TimeSlotPicker
          label="Uygun Saatler"
          slots={timeSlots}
          value={selectedTime}
          onChange={(time) => {
            updateData({ time })
            setErrors((prev) => ({ ...prev, time: '' }))
          }}
          error={errors.time}
          isLoading={isLoadingSlots}
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

export default DateTimeStep
