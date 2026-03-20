'use client'
import styles from './TimeSlots.module.css'

export default function TimeSlots({ slots = [], selectedTime, onSelectTime }) {
  if (!slots.length) {
    return (
      <div className={styles.grid}>
        <p className={styles.placeholder}>Odaberi datum na kalendaru</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {slots.map(({ time, taken }) => (
        <button
          key={time}
          disabled={taken}
          onClick={() => !taken && onSelectTime(time)}
          className={`${styles.slot} ${taken ? styles.taken : ''} ${selectedTime === time ? styles.selected : ''}`}
        >
          {time}
        </button>
      ))}
    </div>
  )
}