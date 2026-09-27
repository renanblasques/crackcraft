import { LogOut } from 'lucide-react'

import { BrandMark } from './BrandMark'

import styles from './Topbar.module.css'

type Props = {
  email?: string
  signOut?: () => void
}

export function Topbar({
  email,
  signOut,
}: Props) {
  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <BrandMark />

        <div className={styles.userArea}>
          <div className={styles.userCopy}>
            <small>Sessão ativa</small>
            <span>{email}</span>
          </div>

          <button
            type="button"
            className={styles.logout}
            onClick={signOut}
            title="Sair"
            aria-label="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
