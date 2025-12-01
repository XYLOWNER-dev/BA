'use client'

import { forwardRef, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { format, addDays, isSameDay, isAfter, startOfDay } from 'date-fns'
import { tr } from 'date-fns/locale'

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  error?: string
  label?: string
  daysToShow?: number
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ value, onChange, error, label, daysToShow = 14 }, ref) => {
    const today = startOfDay(new Date())

    // Generate available dates (today + next N days)
    const availableDates = useMemo(() => {
      const dates = []
      for (let i = 0; i < daysToShow; i++) {
        dates.push(addDays(today, i))
      }
      return dates
    }, [today, daysToShow])

    const selectedDate = value ? new Date(value) : null

    return (
      <div ref={ref} className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {availableDates.map((date) => {
            const dateString = format(date, 'yyyy-MM-dd')
            const isSelected = selectedDate && isSameDay(date, selectedDate)
            const isToday = isSameDay(date, today)

            return (
              <button
                key={dateString}
                type="button"
                onClick={() => onChange(dateString)}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-lg border-2',
                  'transition-all duration-200 min-h-[70px]',
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-lg'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50',
                  isToday && !isSelected && 'border-primary/30 bg-primary/5'
                )}
              >
                <span className="text-xs font-medium uppercase">
                  {format(date, 'EEE', { locale: tr })}
                </span>
                <span className="text-lg font-bold">
                  {format(date, 'd')}
                </span>
                <span className="text-xs">
                  {format(date, 'MMM', { locale: tr })}
                </span>
              </button>
            )
          })}
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export default DatePicker
