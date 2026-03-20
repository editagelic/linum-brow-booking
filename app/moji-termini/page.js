'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatDateHr } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Link from 'next/link'
import styles from './moji-termini.module.css'

export default function MojiTerminiPage() {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const router = useRouter()
  

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      fetchBookings(data.user.email)
    })
  }, [])

  async function fetchBookings(email) {
    const { data } = await supabase
      .from('bookings')
      .select('*, available_slots(date, time)')
      .eq('email', email)
      .order('created_at', { ascending: false })
    if (data) setBookings(data)
    setLoading(false)
  }

  async function handleCancel() {
    setCancelling(true)
    try {
      const res = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingId: cancelTarget.id,
          userEmail: user.email  // dodaj ovo
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBookings(prev => prev.map(b =>
        b.id === cancelTarget.id ? { ...b, status: 'cancelled' } : b
      ))
      setCancelTarget(null)
    } catch (err) {
      alert(err.message || 'Greška pri otkazivanju')
    } finally {
      setCancelling(false)
    }
  }

  const now = new Date()

  const upcoming = bookings.filter(b => {
    if (b.status === 'cancelled') return false
    const slotDate = new Date(b.available_slots.date + 'T' + b.available_slots.time)
    return slotDate > now
  })

  const past = bookings.filter(b => {
    if (b.status === 'cancelled') return true
    const slotDate = new Date(b.available_slots.date + 'T' + b.available_slots.time)
    return slotDate <= now
  })

  function canCancel(booking) {
    const slotDate = new Date(booking.available_slots.date + 'T' + booking.available_slots.time)
    return (slotDate - now) / 1000 / 60 / 60 >= 24
  }

  if (loading) {
    return (
      <>
        <Navbar user={null} />
        <div className={styles.loading}>Učitavanje...</div>
      </>
    )
  }

  const currentList = tab === 'upcoming' ? upcoming : past

  return (
    <>
      <Navbar user={user} />
      <main className={styles.main}>

        <h1 className={styles.title}>Moji termini</h1>
        <p className={styles.sub}>
          Prijavljeni ste kao <strong>{user?.email}</strong>
        </p>

        {/* Banner */}
        <div className={styles.banner}>
          <p className={styles.bannerText}>Želite rezervirati novi termin?</p>
          <Link href="/" className={styles.btnBook}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8"/>
              <path d="M8 2v4M16 2v4M3 10h18M12 14v4M10 16h4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Rezerviraj termin
          </Link>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'upcoming' ? styles.active : ''}`}
            onClick={() => setTab('upcoming')}
          >
            Nadolazeći
            {upcoming.length > 0 && (
              <span className={styles.tabCount}>{upcoming.length}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${tab === 'past' ? styles.active : ''}`}
            onClick={() => setTab('past')}
          >
            Prošli
          </button>
        </div>

        {/* Lista */}
        <div className={styles.list}>
          {currentList.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="#B5B5B5" strokeWidth="1.8"/>
                  <path d="M8 2v4M16 2v4M3 10h18" stroke="#B5B5B5" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <p className={styles.emptyTitle}>
                {tab === 'upcoming' ? 'Nema nadolazećih termina' : 'Nema prošlih termina'}
              </p>
              <p className={styles.emptySub}>
                {tab === 'upcoming'
                  ? 'Rezervirajte termin i vidjet ćete ga ovdje.'
                  : 'Vaša povijest termina prikazat će se ovdje.'}
              </p>
              {tab === 'upcoming' && (
                <Link href="/" className={styles.btnBook}>Rezerviraj termin</Link>
              )}
            </div>
          ) : (
            currentList.map((b, i) => (
              <div
                key={b.id}
                className={styles.bookingCard}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={styles.bookingInfo}>
                  <p className={styles.bookingDate}>
                    {formatDateHr(b.available_slots.date, b.available_slots.time.slice(0, 5))}
                  </p>
                  <p className={styles.bookingService}>
                    {b.service || 'Termin'}
                  </p>
                </div>
                <div className={styles.bookingActions}>
                  <Badge variant={
                    b.status === 'cancelled' ? 'cancelled'
                    : tab === 'upcoming' ? 'upcoming'
                    : 'default'
                  }>
                    {b.status === 'cancelled' ? 'Otkazano'
                      : tab === 'upcoming' ? 'Nadolazeći'
                      : 'Završen'}
                  </Badge>
                  {tab === 'upcoming' && b.status !== 'cancelled' && canCancel(b) && (
                    <button
                      className={styles.btnCancel}
                      onClick={() => setCancelTarget(b)}
                    >
                      Otkaži
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)}>
        <div className={styles.modalIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#d94f4f" strokeWidth="1.8"/>
            <path d="M12 8v4M12 16h.01" stroke="#d94f4f" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className={styles.modalTitle}>Otkazivanje termina</h2>
        <p className={styles.modalDesc}>Jeste li sigurni da želite otkazati termin?</p>
        {cancelTarget && (
          <p className={styles.modalDate}>
            {formatDateHr(
              cancelTarget.available_slots.date,
              cancelTarget.available_slots.time.slice(0, 5)
            )}
          </p>
        )}
        <p className={styles.modalNote}>
          Otkazivanje je moguće najkasnije{' '}
          <strong style={{ color: 'var(--text)' }}>24h prije termina</strong>.
        </p>
        <div className={styles.modalBtns}>
          <button className={styles.btnModalBack} onClick={() => setCancelTarget(null)}>
            Natrag
          </button>
          <button
            className={styles.btnModalCancel}
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Otkazivanje...' : 'Da, otkaži'}
          </button>
        </div>
      </Modal>
    </>
  )
}