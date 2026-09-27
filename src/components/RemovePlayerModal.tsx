import {
  Trash2,
  X,
} from 'lucide-react'

import type {
  AllowlistPlayer,
} from '../types/dashboard'

type Props = {
  player: AllowlistPlayer | null
  loading: boolean

  onClose: () => void

  onConfirm: (
    player: AllowlistPlayer,
  ) => Promise<unknown>
}

export function RemovePlayerModal({
  player,
  loading,
  onClose,
  onConfirm,
}: Props) {
  if (!player) {
    return null
  }

  const handleConfirm =
    async () => {
      try {
        await onConfirm(player)

        onClose()
      } catch {
        // O erro já é tratado
        // pelo useAllowlist.
      }
    }

  return (
    <div
      className="player-modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget &&
          !loading
        ) {
          onClose()
        }
      }}
    >
      <div
        className="player-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-player-title"
      >
        <div className="player-modal-header">
          <div className="player-modal-icon">
            <Trash2 size={18} />
          </div>

          <button
            type="button"
            className="player-modal-close"
            disabled={loading}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={17} />
          </button>
        </div>

        <div className="player-modal-content">
          <h3 id="remove-player-title">
            Remover jogador?
          </h3>

          <p>
            <strong>
              {player.name}
            </strong>{' '}
            será removido da lista de
            jogadores permitidos.
          </p>

          <span>
            Como a allowlist está sendo
            aplicada pelo servidor, esse
            jogador não poderá entrar
            novamente enquanto não for
            adicionado à lista.
          </span>
        </div>

        <div className="player-modal-actions">
          <button
            type="button"
            className="player-modal-cancel"
            disabled={loading}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="player-modal-confirm"
            disabled={loading}
            onClick={() =>
              void handleConfirm()
            }
          >
            <Trash2 size={15} />

            {loading
              ? 'Removendo...'
              : 'Remover jogador'}
          </button>
        </div>
      </div>
    </div>
  )
}