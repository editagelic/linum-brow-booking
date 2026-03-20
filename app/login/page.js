'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import styles from './login.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [timer, setTimer] = useState(30 * 60)

  

  async function handleSend() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Molimo unesite valjanu e-mail adresu')
      return
    }
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/moji-termini` },
    })

    setLoading(false)

    if (error) { setError('Greška pri slanju. Pokušajte ponovo.'); return }

    setSent(true)
    startTimer()
    startCooldown()
  }

  function startTimer() {
    let secs = 30 * 60
    const interval = setInterval(() => {
      secs--
      setTimer(secs)
      if (secs <= 0) clearInterval(interval)
    }, 1000)
  }

  function startCooldown() {
    let secs = 60
    setCooldown(secs)
    const interval = setInterval(() => {
      secs--
      setCooldown(secs)
      if (secs <= 0) clearInterval(interval)
    }, 1000)
  }

  const timerDisplay = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image src="/logo-linum.png" alt="Linum Brow" width={80} height={56} className={styles.logo} priority />
        </Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>

          <div className={styles.dots}>
            <div className={`${styles.dot} ${!sent ? styles.active : styles.done}`} />
            <div className={`${styles.dot} ${sent ? styles.active : ''}`} />
          </div>

          {!sent ? (
            <>
              <div className={styles.iconWrap}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="3" stroke="#523626" strokeWidth="1.8"/>
                  <path d="M2 8l10 6 10-6" stroke="#523626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h1 className={styles.title}>Prijava</h1>
              <p className={styles.desc}>
                Unesite e-mail adresu i poslat ćemo vam{' '}
                <strong>link za prijavu</strong>. Bez lozinke.
              </p>

              <div className={styles.field}>
                <label className={styles.label}>E-mail adresa</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="vasemail@primjer.com"
                  autoComplete="email"
                  className={`${styles.input} ${error ? styles.error : ''}`}
                />
                {error && <span className={styles.fieldError}>{error}</span>}
              </div>

              <button
                onClick={handleSend}
                disabled={loading}
                className={styles.btnPrimary}
              >
                {loading ? 'Slanje...' : 'Pošalji link za prijavu'}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M8.8 18.8L15.8 11.8L8.8 4.8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              <div className={styles.divider}>
                <div className={styles.dividerLine} />
                <span className={styles.dividerText}>ili</span>
                <div className={styles.dividerLine} />
              </div>

              <Link href="/" className={styles.btnSecondary}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Rezerviraj termin
              </Link>

              <p className={styles.bottomLink}>
                Nemate račun? Napravit će se automatski<br />pri prvoj rezervaciji.
              </p>
            </>
          ) : (
            <div className={styles.sentWrap}>
              <div className={styles.mailIcon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="3" stroke="#523626" strokeWidth="1.8"/>
                  <path d="M2 8l10 6 10-6" stroke="#523626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h1 className={styles.sentTitle}>Provjerite e-mail</h1>
              <p className={styles.sentDesc}>Poslali smo link za prijavu na</p>
              <p className={styles.sentEmail}>{email}</p>
              <p className={styles.sentDesc} style={{ marginBottom: 20 }}>
                Kliknite na link u mailu i bit ćete prijavljeni.
                Link vrijedi <strong style={{ color: 'var(--text)' }}>30 minuta</strong>.
              </p>

              <div className={styles.timerBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#523626" strokeWidth="1.8"/>
                  <path d="M12 7v5l3 3" stroke="#523626" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Link ističe za <span className={styles.timerVal}>{timerDisplay}</span>
              </div>

              <p className={styles.resendRow}>
                Niste dobili mail?{' '}
                <button
                  disabled={cooldown > 0}
                  onClick={() => { startCooldown(); handleSend() }}
                  className={styles.resendBtn}
                >
                  Pošalji ponovo
                </button>
                {cooldown > 0 && <span> (pričekajte {cooldown}s)</span>}
              </p>

              <button onClick={() => setSent(false)} className={styles.backLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M15.2 18.8L8.2 11.8L15.2 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Promijeni e-mail adresu
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}