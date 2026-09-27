import { LogOut } from 'lucide-react'

type Props = {
  email?: string
  signOut?: () => void
}

export function Topbar({
  email,
  signOut,
}: Props) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">
          MINECRAFT JAVA
        </span>

        <h1>Crackcraft</h1>
      </div>

      <div className="user-area">
        <span>{email}</span>

        <button
          type="button"
          className="icon-button"
          onClick={signOut}
          title="Sair"
          aria-label="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}