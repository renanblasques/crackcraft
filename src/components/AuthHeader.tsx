import { BrandMark } from './BrandMark'

import styles from './AuthHeader.module.css'

export function AuthHeader() {
  return (
    <div
      className={`${styles.header} auth-brand-header`}
    >
      <BrandMark />

      <div className={styles.copy}>
        <span>Acesso à base</span>
        <p>
          Entre para administrar o servidor dos seus
          amigos.
        </p>
      </div>
    </div>
  )
}

export function AuthFooter() {
  return (
    <p className={`${styles.notice} auth-notice`}>
      Projeto pessoal e não oficial. Não associado à
      Mojang ou Microsoft.
    </p>
  )
}
