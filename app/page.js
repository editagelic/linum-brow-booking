'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDateHr, DAYS_FULL, MONTHS_HR } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Calendar from '@/components/booking/Calendar'
import TimeSlots from '@/components/booking/TimeSlots'
import BookingForm from '@/components/booking/BookingForm'
import styles from './page.module.css'

export default function Home() {
  console.log(supabase)
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [slots, setSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDateObj, setSelectedDateObj] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [loading, setLoading] = useState(false)
  const [slotId, setSlotId] = useState(null)



  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    fetchAvailableDates()
    fetchServices()
  }, [])

async function fetchAvailableDates() {
    const today = new Date().toISOString().split('T')[0]
    console.log('TODAY:', today)
    
    const { data, error } = await supabase
      .from('available_slots')
      .select('date')
      .gte('date', today)
      .eq('is_blocked', false)
    
    console.log('SLOTS DATA:', data)
    console.log('SLOTS ERROR:', error)
    
    if (data) {
      const dates = [...new Set(data.map(s => s.date))]
      console.log('AVAILABLE DATES:', dates)
      setAvailableDates(dates)
    }
  }

  async function fetchServices() {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
    if (data) { setServices(data); setSelectedService(data[0]) }
  }

  async function handleSelectDate(key, dateObj) {
    setSelectedDate(key)
    setSelectedDateObj(dateObj)
    setSelectedTime(null)
    const { data } = await supabase
      .from('available_slots')
      .select('id, time, bookings(id, status)')
      .eq('date', key)
      .eq('is_blocked', false)
      .order('time')
    if (data) {
      setSlots(data.map(s => ({
        id: s.id,
        time: s.time.slice(0, 5),
        taken: s.bookings?.some(b => b.status === 'confirmed') ?? false,
      })))
    }
  }

  function handleSelectTime(time) {
    setSelectedTime(time)
    const slot = slots.find(s => s.time === time)
    if (slot) setSlotId(slot.id)
  }

  function getDateLabel() {
    if (!selectedDateObj) return 'Odaberi datum'
    const dow = selectedDateObj.getDay()
    const dowIdx = dow === 0 ? 6 : dow - 1
    return DAYS_FULL[dowIdx] + ', ' + selectedDateObj.getDate() + '. ' +
      MONTHS_HR[selectedDateObj.getMonth()].toLowerCase() + ' ' +
      selectedDateObj.getFullYear() + '.'
  }

  async function handleSubmit(form) {
    setLoading(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId, name: form.name, phone: form.phone,
          email: form.email, note: form.note,
          service: selectedService?.name,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep(3)
    } catch (err) {
      alert(err.message || 'Greška pri rezervaciji')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setStep(1); setSelectedDate(null); setSelectedDateObj(null)
    setSelectedTime(null); setSlots([]); setSlotId(null)
  }

  return (
    <>
      <Navbar user={user} />
      <main className={styles.main}>
        <div className={styles.card}>

          {/* Dots */}
          <div className={styles.dots}>
            {[1,2,3].map(s => (
              <div key={s} className={`${styles.dot} ${s === step ? styles.active : s < step ? styles.done : ''}`} />
            ))}
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <h1 className={styles.title}>Rezerviraj termin</h1>

              {services.length > 1 && (
                <div className={styles.services}>
                  {services.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`${styles.servicePill} ${selectedService?.id === s.id ? styles.active : ''}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.boxHeader}>
                <p className={styles.boxSub}>Odaberi datum i vrijeme termina</p>
                <p className={styles.boxDate}>{getDateLabel()}</p>
              </div>

              <div className={styles.bookingBox}>
                <div className={styles.calLeft}>
                  <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    availableDates={availableDates}
                  />
                </div>
                <div className={styles.slotsRight}>
                  <TimeSlots
                    slots={slots}
                    selectedTime={selectedTime}
                    onSelectTime={handleSelectTime}
                  />
                </div>
              </div>

              <div className={styles.btnRow}>
                <button
                  className={styles.btnNext}
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                >
                  Sljedeće
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M8.8 18.8L15.8 11.8L8.8 4.8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <h1 className={styles.title}>Potvrdite termin</h1>
              <BookingForm
                dateTime={formatDateHr(selectedDate, selectedTime)}
                onBack={() => setStep(1)}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className={styles.success}>
              <div className={styles.successIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5L10 17.5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className={styles.successTitle}>Zahtjev poslan!</h1>
              <p className={styles.successSub}>
                Potvrda rezervacije poslana je na vaš e-mail. Podsjetnik ćete dobiti dan prije termina.
              </p>
              <div className={styles.successPill}>
                {formatDateHr(selectedDate, selectedTime)}
              </div>
              <button className={styles.btnNew} onClick={reset}>
                Rezerviraj novi termin
              </button>
            </div>
          )}

        </div>
      </main>
    </>
  )
}