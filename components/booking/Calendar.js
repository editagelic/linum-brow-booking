'use client'
import { useState } from 'react'
import { MONTHS_HR, DAYS_SHORT, fmtKey } from '@/lib/utils'
import styles from './Calendar.module.css'

export default function Calendar({ selectedDate, onSelectDate, availableDates = [] }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDow = new Date(viewYear, viewMonth, 1).getDay()
  const offset = firstDow === 0 ? 6 : firstDow - 1
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div>
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15.2 18.8L8.2 11.8L15.2 4.8" stroke="#523626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={styles.month}>{MONTHS_HR[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className={styles.navBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M8.8 18.8L15.8 11.8L8.8 4.8" stroke="#523626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.grid}>
        {DAYS_SHORT.map(d => (
          <div key={d} className={styles.dayName}>{d}</div>
        ))}

        {Array.from({ length: offset }).map((_, i) => (
          <div key={`e-${i}`} className={styles.empty} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(viewYear, viewMonth, day)
          const key = fmtKey(date)
          const isPast = date < today
          const isSelected = selectedDate === key
          const isToday = fmtKey(date) === fmtKey(today)
          const hasSlots = availableDates.includes(key)

          const cls = [
            styles.day,
            isPast || !hasSlots ? styles.past : '',
            isSelected ? styles.selected : '',
            isToday && !isSelected ? styles.today : '',
          ].join(' ')

          return (
            <button
              key={key}
              disabled={isPast || !hasSlots}
              onClick={() => onSelectDate(key, date)}
              className={cls}
            >
              {day}
              {hasSlots && !isPast && !isSelected && (
                <span className={styles.dot} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}