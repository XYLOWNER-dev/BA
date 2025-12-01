'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Input, Select } from '@/components/ui'
import { formatDate, formatShortDate, getStatusColor, getStatusText, formatPrice } from '@/lib/utils'

interface Appointment {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes: string | null
  customer: {
    fullName: string
    email: string
    phone: string
  }
  staff: {
    name: string
  }
  service: {
    name: string
    price: number
    durationMinutes: number
  }
}

interface Stats {
  totalAppointmentsThisWeek: number
  totalAppointmentsThisMonth: number
  todaysAppointments: number
  popularServices: { serviceName: string; count: number }[]
  appointmentsByStatus: { status: string; count: number }[]
  unreadMessages: number
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filters
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

    if (password === adminPassword) {
      setIsAuthenticated(true)
      setPasswordError('')
      // Store in sessionStorage
      sessionStorage.setItem('admin_auth', 'true')
    } else {
      setPasswordError('Yanlış şifre')
    }
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch appointments
      const params = new URLSearchParams()
      if (dateFilter) {
        params.append('dateFrom', dateFilter)
        params.append('dateTo', dateFilter)
      }
      if (statusFilter) {
        params.append('status', statusFilter)
      }

      const [appointmentsRes, statsRes] = await Promise.all([
        fetch(`/api/appointments?${params}`),
        fetch('/api/admin/stats'),
      ])

      const appointmentsData = await appointmentsRes.json()
      const statsData = await statsRes.json()

      if (appointmentsData.success) {
        setAppointments(appointmentsData.data)
      }
      if (statsData.success) {
        setStats(statsData.data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [dateFilter, statusFilter])

  useEffect(() => {
    // Check sessionStorage on mount
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, fetchData])

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()
      if (data.success) {
        fetchData() // Refresh data
      } else {
        alert(data.error || 'Durum güncellenirken bir hata oluştu.')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Durum güncellenirken bir hata oluştu.')
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold italic text-gray-900 mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600">Baran Atay Hair Art</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              placeholder="Admin şifresini giriniz"
              autoFocus
            />
            <Button type="submit" variant="primary" className="w-full">
              Giriş Yap
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            <a href="/" className="text-primary hover:underline">
              Ana sayfaya dön
            </a>
          </p>
        </div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl font-bold italic">
              Baran Atay Hair Art - Admin
            </h1>
            <div className="flex items-center gap-4">
              <a href="/" className="text-white/80 hover:text-white text-sm">
                Siteye Git
              </a>
              <Button
                variant="outline"
                size="sm"
                className="border-white/50 text-white hover:bg-white/10"
                onClick={() => {
                  sessionStorage.removeItem('admin_auth')
                  setIsAuthenticated(false)
                }}
              >
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-sm text-gray-500 mb-1">Bugünkü Randevular</p>
              <p className="text-3xl font-bold text-primary">
                {stats.todaysAppointments}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-sm text-gray-500 mb-1">Bu Hafta</p>
              <p className="text-3xl font-bold text-primary">
                {stats.totalAppointmentsThisWeek}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-sm text-gray-500 mb-1">Bu Ay</p>
              <p className="text-3xl font-bold text-primary">
                {stats.totalAppointmentsThisMonth}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-sm text-gray-500 mb-1">Okunmamış Mesajlar</p>
              <p className="text-3xl font-bold text-orange-500">
                {stats.unreadMessages}
              </p>
            </div>
          </div>
        )}

        {/* Popular Services */}
        {stats && stats.popularServices.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">
              Bu Ayın Popüler Hizmetleri
            </h2>
            <div className="flex flex-wrap gap-4">
              {stats.popularServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2"
                >
                  <span className="font-medium">{service.serviceName}</span>
                  <span className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded">
                    {service.count} randevu
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Section */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="font-semibold text-lg text-gray-900">Randevular</h2>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: '', label: 'Tüm Durumlar' },
                    { value: 'CONFIRMED', label: 'Onaylı' },
                    { value: 'PENDING', label: 'Beklemede' },
                    { value: 'CANCELLED', label: 'İptal' },
                    { value: 'COMPLETED', label: 'Tamamlandı' },
                  ]}
                  className="min-w-[150px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDateFilter('')
                    setStatusFilter('')
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Yükleniyor...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Randevu bulunamadı.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Tarih & Saat
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Müşteri
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Hizmet
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Uzman
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatShortDate(appointment.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.customer.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {appointment.service.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatPrice(appointment.service.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {appointment.staff.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusChange(appointment.id, e.target.value)
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="PENDING">Beklemede</option>
                          <option value="CONFIRMED">Onaylandı</option>
                          <option value="CANCELLED">İptal Et</option>
                          <option value="COMPLETED">Tamamlandı</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
