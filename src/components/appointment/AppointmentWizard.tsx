'use client'

import { useState, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { StepIndicator } from './StepIndicator'
import { CustomerInfoStep } from './steps/CustomerInfoStep'
import { ServiceSelectionStep } from './steps/ServiceSelectionStep'
import { DateTimeStep } from './steps/DateTimeStep'
import { ConfirmationStep } from './steps/ConfirmationStep'
import { SuccessStep } from './steps/SuccessStep'
import type { Service, Staff } from '@/types'

interface AppointmentWizardProps {
  isOpen: boolean
  onClose: () => void
  services: Service[]
  staff: Staff[]
}

export interface WizardData {
  // Step 1: Customer Info
  fullName: string
  email: string
  phone: string
  phonePrefix: string
  // Step 2: Service
  serviceId: string
  // Step 3: Date/Time/Staff
  staffId: string
  date: string
  time: string
  // Step 4: Confirmation
  acceptedTerms: boolean
}

const initialData: WizardData = {
  fullName: '',
  email: '',
  phone: '',
  phonePrefix: '+90',
  serviceId: '',
  staffId: '',
  date: '',
  time: '',
  acceptedTerms: false,
}

const steps = [
  { number: 1, title: 'Bilgilerinizi Girin' },
  { number: 2, title: 'Hizmet Seçin' },
  { number: 3, title: 'Tarih ve Saat' },
  { number: 4, title: 'Onay' },
]

export function AppointmentWizard({
  isOpen,
  onClose,
  services,
  staff,
}: AppointmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [appointmentDetails, setAppointmentDetails] = useState<{
    date: string
    time: string
    service: string
    staff: string
  } | null>(null)

  const updateData = useCallback((data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }))
  }, [])

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wizardData),
      })

      const result = await response.json()

      if (result.success) {
        const selectedService = services.find((s) => s.id === wizardData.serviceId)
        const selectedStaff = staff.find((s) => s.id === wizardData.staffId)

        setAppointmentDetails({
          date: wizardData.date,
          time: wizardData.time,
          service: selectedService?.name || '',
          staff: selectedStaff?.name || '',
        })
        setIsSuccess(true)
      } else {
        alert(result.error || 'Randevu oluşturulurken bir hata oluştu.')
      }
    } catch (error) {
      console.error('Failed to create appointment:', error)
      alert('Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // Reset wizard state
    setCurrentStep(1)
    setWizardData(initialData)
    setIsSuccess(false)
    setAppointmentDetails(null)
    onClose()
  }

  const handleCancel = () => {
    if (
      currentStep === 1 ||
      window.confirm('Randevu işlemini iptal etmek istediğinizden emin misiniz?')
    ) {
      handleClose()
    }
  }

  // Get selected service and staff for summary
  const selectedService = services.find((s) => s.id === wizardData.serviceId)
  const selectedStaff = staff.find((s) => s.id === wizardData.staffId)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-2xl"
      showCloseButton={!isSubmitting}
    >
      <div className="p-6 md:p-8">
        {isSuccess && appointmentDetails ? (
          <SuccessStep details={appointmentDetails} onClose={handleClose} />
        ) : (
          <>
            {/* Step Indicator */}
            <StepIndicator steps={steps} currentStep={currentStep} />

            {/* Step Content */}
            <div className="mt-8">
              {currentStep === 1 && (
                <CustomerInfoStep
                  data={wizardData}
                  updateData={updateData}
                  onNext={handleNext}
                  onCancel={handleCancel}
                />
              )}

              {currentStep === 2 && (
                <ServiceSelectionStep
                  services={services}
                  selectedServiceId={wizardData.serviceId}
                  onSelect={(serviceId) => updateData({ serviceId })}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 3 && (
                <DateTimeStep
                  staff={staff}
                  selectedStaffId={wizardData.staffId}
                  selectedDate={wizardData.date}
                  selectedTime={wizardData.time}
                  selectedServiceId={wizardData.serviceId}
                  services={services}
                  updateData={updateData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 4 && (
                <ConfirmationStep
                  data={wizardData}
                  selectedService={selectedService}
                  selectedStaff={selectedStaff}
                  updateData={updateData}
                  onSubmit={handleSubmit}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default AppointmentWizard
