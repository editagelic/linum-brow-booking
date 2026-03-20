import styles from './Button.module.css'

export default function Button({
  children, onClick, type = 'button',
  variant = 'primary', disabled = false,
  className = '', fullWidth = false
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.full : ''} ${className}`}
    >
      {children}
    </button>
  )
}