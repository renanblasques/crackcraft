import styles from './TabSkeleton.module.css'

export function TabSkeleton() {
  return (
    <div
      className={styles.skeleton}
      role="status"
      aria-label="Carregando área"
    >
      <div className={styles.heading} />
      <div className={styles.grid}>
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}
