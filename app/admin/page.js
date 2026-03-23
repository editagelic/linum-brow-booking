'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [bookingsToday, setBookingsToday] = useState([])
  const [statsWeek, setStatsWeek] = useState(0)
  const [statsCancelled, setStatsCancelled] = useState(0)
  const [statsClients, setStatsClients] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState('pregled')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/admin/login'); return }
      setUser(data.user)
      fetchData()
    })
  }, [])

  async function fetchData() {
    const today = new Date().toISOString().split('T')[0]

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    // Termini danas
    const { data: todayBookings } = await supabase
      .from('bookings')
      .select('*, available_slots(date, time)')
      .eq('available_slots.date', today)
      .eq('status', 'confirmed')

    // Stat: termini ovaj tjedan
    const { count: weekCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString())
      .lte('created_at', weekEnd.toISOString())
      .eq('status', 'confirmed')

    // Stat: otkazani ovaj tjedan
    const { count: cancelledCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString())
      .eq('status', 'cancelled')

    // Stat: ukupno klijentica
    const { count: clientsCount } = await supabase
      .from('bookings')
      .select('email', { count: 'exact', head: true })

    if (todayBookings) setBookingsToday(todayBookings.filter(b => b.available_slots))
    setStatsWeek(weekCount || 0)
    setStatsCancelled(cancelledCount || 0)
    setStatsClients(clientsCount || 0)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 14, color: 'var(--disabled-text)' }}>
        Učitavanje...
      </div>
    )
  }

  return (
    <div className={styles.layout}>
        {/* Mobilna navigacija */}
  <div className={styles.mobileNav}>
    <div className={styles.mobileNavInner}>
      <Image src="/logo-linum.png" alt="Linum Brow" width={60} height={40} style={{ width: 'auto', height: '40px' }} />
      <div className={styles.mobileNavLinks}>
        <button
          className={`${styles.mobileNavBtn} ${activePage === 'pregled' ? styles.active : ''}`}
          onClick={() => setActivePage('pregled')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
          Pregled
        </button>
        <button
          className={`${styles.mobileNavBtn} ${activePage === 'raspored' ? styles.active : ''}`}
          onClick={() => setActivePage('raspored')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Raspored
        </button>
        <button
          className={`${styles.mobileNavBtn} ${activePage === 'klijentice' ? styles.active : ''}`}
          onClick={() => setActivePage('klijentice')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Klijentice
        </button>
        <button
          className={`${styles.mobileNavBtn}`}
          onClick={handleLogout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Odjava
        </button>
      </div>
    </div>
  </div>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <Image src="/logo-linum.png" alt="Linum Brow" width={70} height={48} style={{ width: 'auto', height: '48px' }} />
        </div>

        <nav className={styles.sidebarNav}>
          <p className={styles.navLabel}>Admin</p>
          <button
            className={`${styles.navItem} ${activePage === 'pregled' ? styles.active : ''}`}
            onClick={() => setActivePage('pregled')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
            Pregled
          </button>
          <button
            className={`${styles.navItem} ${activePage === 'raspored' ? styles.active : ''}`}
            onClick={() => setActivePage('raspored')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Raspored
          </button>
          <button
            className={`${styles.navItem} ${activePage === 'klijentice' ? styles.active : ''}`}
            onClick={() => setActivePage('klijentice')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Klijentice
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.btnLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Odjava
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className={styles.content}>

        {/* ── PREGLED ── */}
        {activePage === 'pregled' && (
          <>
            <h1 className={styles.pageTitle}>Pregled</h1>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Termini ovaj tjedan</p>
                <p className={styles.statVal}>{statsWeek}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Otkazani (7 dana)</p>
                <p className={styles.statVal}>{statsCancelled}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Ukupno rezervacija</p>
                <p className={styles.statVal}>{statsClients}</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Termini danas</p>
                <p className={styles.statVal}>{bookingsToday.length}</p>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.card}>
                <p className={styles.cardTitle}>Termini danas</p>
                {bookingsToday.length === 0 ? (
                  <p className={styles.emptyState}>Nema termina danas</p>
                ) : (
                  bookingsToday.map(b => (
                    <div key={b.id} className={styles.bookingRow}>
                      <div>
                        <p className={styles.bookingName}>{b.full_name}</p>
                        <p className={styles.bookingMeta}>
                          {b.available_slots?.time?.slice(0,5)} · {b.phone}
                        </p>
                      </div>
                      <span className={`${styles.badge} ${styles.badgeConfirmed}`}>
                        Potvrđeno
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.card}>
                <p className={styles.cardTitle}>Brze akcije</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={() => setActivePage('raspored')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', background: 'var(--white)',
                      fontFamily: 'var(--font-montserrat)', fontSize: 13, fontWeight: 600,
                      color: 'var(--text)', cursor: 'pointer', transition: 'all 0.15s',
                      width: '100%', textAlign: 'left'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Dodaj termine za sljedeći tjedan
                  </button>
                  <button
                    onClick={() => setActivePage('klijentice')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', background: 'var(--white)',
                      fontFamily: 'var(--font-montserrat)', fontSize: 13, fontWeight: 600,
                      color: 'var(--text)', cursor: 'pointer', transition: 'all 0.15s',
                      width: '100%', textAlign: 'left'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    Pregledaj klijentice
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── RASPORED ── */}
        {activePage === 'raspored' && (
          <RasporedPage />
        )}

        {/* ── KLIJENTICE ── */}
        {activePage === 'klijentice' && (
          <KlijenticePage />
        )}

      </main>
    </div>
  )
}

// ── RASPORED KOMPONENTA ──
function RasporedPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [addDate, setAddDate] = useState('')
  const [addTimes, setAddTimes] = useState([])
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [manualBooking, setManualBooking] = useState(null)
  const [manualForm, setManualForm] = useState({ name: '', phone: '', email: '', note: '', service: '' })
  const [manualSaving, setManualSaving] = useState(false)

  const predefinedTimes = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30']
  const DAYS_HR = ['Pon','Uto','Sri','Čet','Pet','Sub','Ned']
  const MONTHS_HR = ['sij','velj','ožu','tra','svi','lip','srp','kol','ruj','lis','stu','pro']

  function fmtDate(d) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const dd = String(d.getDate()).padStart(2,'0')
    return `${yyyy}-${mm}-${dd}`
  }

  function getWeekDays() {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7)
    monday.setHours(0,0,0,0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
  }

  const weekDays = getWeekDays()
  const weekStart = fmtDate(weekDays[0])
  const weekEnd = fmtDate(weekDays[6])

  function getWeekLabel() {
    const s = weekDays[0]
    const e = weekDays[6]
    return `${s.getDate()}. ${MONTHS_HR[s.getMonth()]} – ${e.getDate()}. ${MONTHS_HR[e.getMonth()]}. ${e.getFullYear()}.`
  }

  useEffect(() => { fetchSlots() }, [weekOffset])

  async function fetchSlots() {
    setLoading(true)
    const { data } = await supabase
      .from('available_slots')
      .select('*, bookings(id, status, full_name, phone, note)')
      .gte('date', weekStart)
      .lte('date', weekEnd)
      .order('time')
    if (data) setSlots(data)
    setLoading(false)
  }

  function getSlotsForDay(date) {
    const key = fmtDate(date)
    return slots.filter(s => s.date === key).sort((a,b) => a.time.localeCompare(b.time))
  }

  function toggleTime(t) {
    setAddTimes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  async function handleAddSlots() {
    if (!addDate || addTimes.length === 0) { setMsg('Odaberi datum i barem jedan termin'); return }
    setSaving(true)
    const inserts = addTimes.map(t => ({ date: addDate, time: t + ':00' }))
    const { error } = await supabase.from('available_slots').upsert(inserts, { onConflict: 'date,time' })
    setSaving(false)
    if (error) { setMsg('Greška: ' + error.message); return }
    setMsg(`Dodano ${addTimes.length} termina!`)
    setAddTimes([])
    setAddDate('')
    fetchSlots()
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleBlock(slotId, blocked) {
    await supabase.from('available_slots').update({ is_blocked: !blocked }).eq('id', slotId)
    fetchSlots()
  }

  async function handleDelete(slotId) {
    if (!confirm('Obrisati ovaj termin?')) return
    await supabase.from('available_slots').delete().eq('id', slotId)
    fetchSlots()
  }

  async function copyLastWeek() {
    const prevStart = new Date(weekDays[0])
    prevStart.setDate(prevStart.getDate() - 7)
    const prevEnd = new Date(weekDays[6])
    prevEnd.setDate(prevEnd.getDate() - 7)

    const { data: prevSlots } = await supabase
      .from('available_slots')
      .select('date, time')
      .gte('date', fmtDate(prevStart))
      .lte('date', fmtDate(prevEnd))

    if (!prevSlots?.length) { setMsg('Nema termina prošlog tjedna za kopirati'); return }

    const inserts = prevSlots.map(s => {
      const parts = s.date.split('-')
      const d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]))
      d.setDate(d.getDate() + 7)
      return { date: fmtDate(d), time: s.time }
    })

    await supabase.from('available_slots').upsert(inserts, { onConflict: 'date,time' })
    setMsg(`Kopirano ${inserts.length} termina s prošlog tjedna!`)
    fetchSlots()
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleManualBooking() {
    if (!manualForm.name || !manualForm.phone) {
      alert('Ime i telefon su obavezni')
      return
    }
    setManualSaving(true)
    const { error } = await supabase
      .from('bookings')
      .insert({
        slot_id: manualBooking.id,
        full_name: manualForm.name,
        phone: manualForm.phone,
        email: manualForm.email || 'nema@email.com',
        note: manualForm.note,
        service: manualForm.service,
        status: 'confirmed',
      })
    setManualSaving(false)
    if (error) { alert('Greška: ' + error.message); return }
    setManualBooking(null)
    setManualForm({ name: '', phone: '', email: '', note: '', service: '' })
    fetchSlots()
  }

  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 28, color: 'var(--title)', marginBottom: 24 }}>
        Raspored
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setWeekOffset(o => o - 1)} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
          ← Prethodni
        </button>
        <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 15, color: 'var(--title)' }}>
          {getWeekLabel()}
        </span>
        <button onClick={() => setWeekOffset(o => o + 1)} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
          Sljedeći →
        </button>
        <button onClick={copyLastWeek} style={{ marginLeft: 'auto', background: 'var(--primary-light)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', padding: '8px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
          Kopiraj prošli tjedan
        </button>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
          {weekDays.map((d, i) => {
            const isToday = fmtDate(d) === fmtDate(new Date())
            return (
              <div key={i} style={{
                padding: '12px 8px', textAlign: 'center',
                borderRight: i < 6 ? '1px solid var(--border)' : 'none',
                background: isToday ? 'var(--primary-light)' : 'transparent'
              }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: isToday ? 'var(--primary)' : 'var(--disabled-text)', marginBottom: 2 }}>
                  {DAYS_HR[i]}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: isToday ? 'var(--primary)' : 'var(--title)' }}>
                  {d.getDate()}.{d.getMonth()+1}.
                </p>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: 200 }}>
          {weekDays.map((d, i) => {
            const daySlots = getSlotsForDay(d)
            return (
              <div key={i} style={{
                padding: '8px 6px',
                borderRight: i < 6 ? '1px solid var(--border)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 4
              }}>
                {loading ? (
                  <p style={{ fontSize: 11, color: 'var(--disabled-text)', textAlign: 'center', padding: '8px 0' }}>...</p>
                ) : daySlots.length === 0 ? (
                  <p style={{ fontSize: 11, color: 'var(--disabled-text)', textAlign: 'center', padding: '8px 0' }}>—</p>
                ) : (
                  daySlots.map(slot => {
                    const booking = slot.bookings?.find(b => b.status === 'confirmed')
                    const bgColor = slot.is_blocked ? '#FEF0F0' : booking ? 'var(--primary-light)' : '#EAF7EF'
                    const textColor = slot.is_blocked ? '#C0392B' : booking ? 'var(--primary)' : '#2D7A4F'
                    return (
                      <div key={slot.id} style={{ background: bgColor, borderRadius: 6, padding: '4px 6px' }}
                        title={booking ? `${booking.full_name} · ${booking.phone}${booking.note ? '\nNapomena: ' + booking.note : ''}` : slot.is_blocked ? 'Blokirano' : 'Slobodno'}
                      >
                        <p style={{ fontSize: 11, fontWeight: 700, color: textColor }}>
                          {slot.time.slice(0,5)}
                        </p>
                        {booking && (
                          <p style={{ fontSize: 10, color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {booking.full_name.split(' ')[0]}
                          </p>
                        )}
                        {!booking && !slot.is_blocked && (
                          <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
                            <button
                              onClick={() => setManualBooking(slot)}
                              style={{ fontSize: 9, padding: '1px 4px', borderRadius: 3, border: 'none', background: 'rgba(0,0,0,0.1)', cursor: 'pointer', color: textColor, fontWeight: 600 }}
                            >
                              + dodaj
                            </button>
                            <button
                              onClick={() => handleBlock(slot.id, slot.is_blocked)}
                              style={{ fontSize: 9, padding: '1px 4px', borderRadius: 3, border: 'none', background: 'rgba(0,0,0,0.1)', cursor: 'pointer', color: textColor, fontWeight: 600 }}
                            >
                              ✕
                            </button>
                            <button
                              onClick={() => handleDelete(slot.id)}
                              style={{ fontSize: 9, padding: '1px 4px', borderRadius: 3, border: 'none', background: 'rgba(0,0,0,0.1)', cursor: 'pointer', color: '#d94f4f', fontWeight: 600 }}
                            >
                              🗑
                            </button>
                          </div>
                        )}
                        {!booking && slot.is_blocked && (
                          <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
                            <button
                              onClick={() => handleBlock(slot.id, slot.is_blocked)}
                              style={{ fontSize: 9, padding: '1px 4px', borderRadius: 3, border: 'none', background: 'rgba(0,0,0,0.1)', cursor: 'pointer', color: textColor, fontWeight: 600 }}
                            >
                              ↩
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--title)', marginBottom: 16 }}>Dodaj termine</p>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--title)', display: 'block', marginBottom: 6 }}>Datum</label>
          <input type="date" value={addDate} onChange={e => setAddDate(e.target.value)} min={fmtDate(new Date())}
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: 14, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', outline: 'none', width: 200 }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--title)', display: 'block', marginBottom: 10 }}>Odaberi sate</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {predefinedTimes.map(t => (
              <button key={t} onClick={() => toggleTime(t)} style={{
                padding: '7px 12px', borderRadius: 'var(--radius-sm)',
                border: `1.5px solid ${addTimes.includes(t) ? 'var(--primary)' : 'var(--border)'}`,
                background: addTimes.includes(t) ? 'var(--primary)' : 'var(--white)',
                color: addTimes.includes(t) ? 'white' : 'var(--text)',
                fontFamily: 'var(--font-montserrat)', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.12s'
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {msg && (
          <p style={{ fontSize: 13, color: msg.includes('Greška') || msg.includes('Nema') ? '#d94f4f' : '#2D7A4F', fontWeight: 600, marginBottom: 12 }}>
            {msg}
          </p>
        )}
        <button onClick={handleAddSlots} disabled={saving} style={{
          padding: '12px 28px', background: 'var(--primary)', border: 'none',
          borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-montserrat)',
          fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer'
        }}>
          {saving ? 'Dodavanje...' : 'Dodaj termine'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {[['#EAF7EF', '#2D7A4F', 'Slobodan termin'], ['var(--primary-light)', 'var(--primary)', 'Rezerviran'], ['#FEF0F0', '#C0392B', 'Blokiran']].map(([bg, color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: bg }} />
            <span style={{ fontSize: 12, color: 'var(--disabled-text)', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Manual booking modal */}
      {manualBooking && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={e => { if (e.target === e.currentTarget) setManualBooking(null) }}>
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius)',
            padding: 32, width: '100%', maxWidth: 440,
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 18, color: 'var(--title)', marginBottom: 6 }}>
              Ručno dodaj rezervaciju
            </h2>
            <p style={{ fontSize: 13, color: 'var(--disabled-text)', marginBottom: 20 }}>
              {manualBooking.date} u {manualBooking.time.slice(0,5)}
            </p>

            {[
              { label: 'Ime i prezime *', key: 'name', placeholder: 'Ana Horvat', type: 'text' },
              { label: 'Broj telefona *', key: 'phone', placeholder: '+385 91 234 5678', type: 'tel' },
              { label: 'Email (opcionalno)', key: 'email', placeholder: 'ana@email.com', type: 'email' },
              { label: 'Usluga', key: 'service', placeholder: 'Čupanje obrva', type: 'text' },
              { label: 'Napomena', key: 'note', placeholder: 'Dodatna napomena...', type: 'text' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--title)', display: 'block', marginBottom: 5 }}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={manualForm[key]}
                  onChange={e => setManualForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    fontFamily: 'var(--font-montserrat)', fontSize: 14,
                    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px', outline: 'none', width: '100%'
                  }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setManualBooking(null)}
                style={{
                  flex: 1, padding: 12, background: 'var(--white)',
                  border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-montserrat)', fontSize: 13, fontWeight: 600,
                  color: 'var(--text)', cursor: 'pointer'
                }}
              >
                Odustani
              </button>
              <button
                onClick={handleManualBooking}
                disabled={manualSaving}
                style={{
                  flex: 1, padding: 12, background: 'var(--primary)',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-montserrat)', fontSize: 13, fontWeight: 600,
                  color: 'white', cursor: 'pointer',
                  opacity: manualSaving ? 0.6 : 1
                }}
              >
                {manualSaving ? 'Spremanje...' : 'Spremi rezervaciju'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── KLIJENTICE KOMPONENTA ──
function KlijenticePage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    const { data } = await supabase
      .from('bookings')
      .select('*, available_slots(date, time)')
      .order('created_at', { ascending: false })
    if (data) setBookings(data)
    setLoading(false)
  }

  const filtered = bookings.filter(b =>
    b.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600, fontSize: 28, color: 'var(--title)', marginBottom: 28 }}>
        Klijentice
      </h1>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Pretraži po imenu ili emailu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            fontFamily: 'var(--font-montserrat)', fontSize: 14,
            border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
            padding: '10px 14px', outline: 'none', width: '100%', maxWidth: 400
          }}
        />
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: 24, fontSize: 13, color: 'var(--disabled-text)' }}>Učitavanje...</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: 24, fontSize: 13, color: 'var(--disabled-text)', textAlign: 'center' }}>Nema rezultata</p>
        ) : (
          filtered.map((b, i) => (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 24px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--title)', marginBottom: 3 }}>
                  {b.full_name}
                </p>
                <p style={{ fontSize: 12, color: 'var(--disabled-text)' }}>
                  {b.email} · {b.phone}
                </p>
                {b.note && (
                  <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 3, fontStyle: 'italic' }}>
                    Napomena: {b.note}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 12, color: 'var(--disabled-text)', marginBottom: 4 }}>
                  {b.available_slots?.date} · {b.available_slots?.time?.slice(0,5)}
                </p>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                  background: b.status === 'cancelled' ? '#FEF0F0' : 'var(--primary-light)',
                  color: b.status === 'cancelled' ? '#C0392B' : 'var(--primary)'
                }}>
                  {b.status === 'cancelled' ? 'Otkazano' : 'Potvrđeno'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}