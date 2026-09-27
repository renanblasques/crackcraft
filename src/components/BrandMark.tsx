import styles from './BrandMark.module.css'

type Props = {
  compact?: boolean
}

export function BrandMark({
  compact = false,
}: Props) {
  return (
    <div
      className={styles.brand}
      aria-label="Crackcraft"
    >
      <span
        className={styles.block}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </span>

      <span className={styles.copy}>
        {!compact && (
          <small>Painel do servidor</small>
        )}

        <strong>Crackcraft</strong>
      </span>
    </div>
  )
}
