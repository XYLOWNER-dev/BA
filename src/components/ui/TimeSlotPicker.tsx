'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TimeSlot {
  time: string
  available: boolean
}

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  value?: string
  onChange: (time: string) => void
  error?: string
  label?: string
  isLoading?: boolean
}

export const TimeSlotPicker = forwardRef<HTMLDivElement, TimeSlotPickerProps>(
  ({ slots, value, onChange, error, label, isLoading }, ref) => {
    if (isLoading) {
      return (
        <div ref={ref} className="w-full">
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
          )}
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-500">Uygun saatler yükleniyor...</span>
          </div>
        </div>
      )
    }

    if (slots.length === 0) {
      return (
        <div ref={ref} className="w-full">
          {label && (
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
          )}
          <div className="text-center py-8 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 text-gray-300"
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
            <p>Lütfen önce tarih ve uzman seçiniz.</p>
          </div>
        </div>
      )
    }

    const availableSlots = slots.filter((slot) => slot.available)

    return (
      <div ref={ref} className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        {availableSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            <p>Bu tarih ve uzman için müsait saat bulunmamaktadır.</p>
            <p className="text-sm mt-1">Lütfen farklı bir tarih veya uzman seçiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                onClick={() => slot.available && onChange(slot.time)}
                disabled={!slot.available}
                className={cn(
                  'py-3 px-2 rounded-lg border-2 text-sm font-medium',
                  'transition-all duration-200',
                  value === slot.time
                    ? 'border-primary bg-primary text-white shadow-lg'
                    : slot.available
                    ? 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 text-gray-700'
                    : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

TimeSlotPicker.displayName = 'TimeSlotPicker'

export default TimeSlotPicker
