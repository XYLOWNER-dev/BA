'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || props.name

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className={cn(
            'flex items-start gap-3 cursor-pointer group',
            props.disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={cn(
                'w-5 h-5 rounded border-2 border-gray-300 text-primary',
                'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'transition-all duration-200 cursor-pointer',
                'checked:bg-primary checked:border-primary',
                error && 'border-red-500',
                className
              )}
              {...props}
            />
          </div>
          {label && (
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              {label}
            </span>
          )}
        </label>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
