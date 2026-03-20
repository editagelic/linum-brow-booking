'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './admin-login.module.css'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) {
      setError('Molimo unesite email i lozinku')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError('Pogrešan email ili lozinka')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Image src="/logo-linum.png" alt="Linum Brow" width={80} height={56} style={{ width: 'auto', height: '56px' }} />
        </div>

        <div className={styles.iconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#523626" strokeWidth="1.8"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#523626" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className={styles.title}>Admin prijava</h1>
        <p className={styles.desc}>Pristup rezerviran samo za administratora.</p>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="admin@email.com"
            autoComplete="email"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Lozinka</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            autoComplete="current-password"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={styles.btnLogin}
        >
          {loading ? 'Prijava...' : 'Prijavi se'}
        </button>

        <a href="/" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15.2 18.8L8.2 11.8L15.2 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Natrag na stranicu
        </a>
      </div>
    </div>
  )
}