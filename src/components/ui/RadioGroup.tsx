'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  description?: string
  price?: number
  duration?: number
  disabled?: boolean
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  error?: string
  className?: string
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, options, value, onChange, error, className }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-3', className)}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer',
              'transition-all duration-200',
              value === option.value
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-5 h-5 border-2 border-gray-300 text-primary',
                  'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'transition-all duration-200 cursor-pointer'
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'font-medium',
                    value === option.value ? 'text-primary' : 'text-gray-900'
                  )}
                >
                  {option.label}
                </span>
                {option.price !== undefined && (
                  <span className="text-sm font-semibold text-primary whitespace-nowrap">
                    {option.price} TL
                  </span>
                )}
              </div>
              {(option.description || option.duration !== undefined) && (
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  {option.duration !== undefined && option.duration > 0 && (
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                      {option.duration} dk
                    </span>
                  )}
                  {option.description && (
                    <span className="truncate">{option.description}</span>
                  )}
                </div>
              )}
            </div>
          </label>
        ))}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

export default RadioGroup
