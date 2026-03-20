'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo-linum.png" alt="Linum Brow" width={80} height={56} priority />
        </Link>

        <button
          className={styles.hamburger}
          aria-label="Meni"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? (
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M8 8L24 24" stroke="#523626" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M24 8L8 24" stroke="#523626" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M4 8H28" stroke="#523626" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M4 16H28" stroke="#523626" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M4 24H28" stroke="#523626" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}

      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <p className={styles.drawerTitle}>Linum Brow</p>
          <button className={styles.drawerClose} onClick={() => setMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M8 8L24 24" stroke="#523626" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M24 8L8 24" stroke="#523626" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.drawerLinks}>
          <Link href="/" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Rezerviraj termin
          </Link>
          <Link href="/moji-termini" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Moji termini
          </Link>
        </div>

        <div className={styles.drawerFooter}>
          <Link href="/admin" className={styles.adminLink} onClick={() => setMenuOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Admin pristup
          </Link>
        </div>
      </div>
    </>
  )
}