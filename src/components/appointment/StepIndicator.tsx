'use client'

import { cn } from '@/lib/utils'

interface Step {
  number: number
  title: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
                'transition-all duration-300',
                currentStep === step.number
                  ? 'bg-primary text-white shadow-lg scale-110'
                  : currentStep > step.number
                  ? 'bg-primary/20 text-primary'
                  : 'bg-gray-100 text-gray-400'
              )}
            >
              {currentStep > step.number ? (
                <svg
                  className="w-5 h-5"
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
              ) : (
                step.number
              )}
            </div>
            <span
              className={cn(
                'mt-2 text-xs font-medium text-center hidden sm:block',
                currentStep === step.number
                  ? 'text-primary'
                  : currentStep > step.number
                  ? 'text-gray-600'
                  : 'text-gray-400'
              )}
            >
              {step.title}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-1 mx-2 rounded-full transition-all duration-300',
                currentStep > step.number ? 'bg-primary/40' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default StepIndicator
