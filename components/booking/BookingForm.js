'use client'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import styles from './BookingForm.module.css'

export default function BookingForm({ dateTime, onBack, onSubmit, loading }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' })
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())  errs.name  = 'Molimo unesite ime i prezime'
    if (!form.phone.trim()) errs.phone = 'Molimo unesite broj telefona'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Molimo unesite valjanu e-mail adresu'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  return (
    <div>
      <div className={styles.datePill}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="3" stroke="#523626" strokeWidth="1.8"/>
          <path d="M8 2v4M16 2v4M3 10h18" stroke="#523626" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        {dateTime}
      </div>

      <div className={styles.grid}>
        <div className={styles.full}>
          <Input label="Ime i prezime" id="name" required
            placeholder="Unesite vaše ime i prezime"
            value={form.name} onChange={e => set('name', e.target.value)}
            error={errors.name} autoComplete="name" />
        </div>
        <Input label="Broj telefona" id="phone" type="tel" required
          placeholder="+385 91 234 5678"
          value={form.phone} onChange={e => set('phone', e.target.value)}
          error={errors.phone} autoComplete="tel" />
        <Input label="E-mail" id="email" type="email" required
          placeholder="vasemail@primjer.com"
          value={form.email} onChange={e => set('email', e.target.value)}
          error={errors.email} autoComplete="email" />
        <div className={`${styles.full} ${styles.textareaField}`}>
          <label className={styles.textareaLabel}>
            Napomena <span className={styles.textareaOptional}>(opcionalno)</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Npr. alergija na henu, prva posjeta..."
            value={form.note}
            onChange={e => set('note', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.magicNote}>
        Unosom e-maila dobit ćete potvrdu rezervacije i podsjetnik dan prije termina.
        Možete otkazati do 24h unaprijed putem linka u mailu.
      </div>

      <div className={styles.btnRow}>
        <Button variant="secondary" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15.2 18.8L8.2 11.8L15.2 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Natrag
        </Button>
        <Button onClick={() => { if (validate()) onSubmit(form) }} disabled={loading}>
          {loading ? 'Slanje...' : 'Zakaži termin'}
          {!loading && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8.8 18.8L15.8 11.8L8.8 4.8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </Button>
      </div>
    </div>
  )
}