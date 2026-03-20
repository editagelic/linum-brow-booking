import styles from './Input.module.css'

export default function Input({
  label, id, type = 'text', placeholder,
  value, onChange, error, required = false,
  autoComplete, className = ''
}) {
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.req}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`${styles.input} ${error ? styles.error : ''} ${className}`}
      />
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  )
}