import {
  ShieldMinus,
  X,
} from 'lucide-react'

import type {
  MinecraftOperator,
} from '../types/dashboard'

type Props = {
  operator: MinecraftOperator | null
  loading: boolean

  onClose: () => void

  onConfirm: (
    operator: MinecraftOperator,
  ) => Promise<unknown>
}

export function RemoveOperatorModal({
  operator,
  loading,
  onClose,
  onConfirm,
}: Props) {
  if (!operator) {
    return null
  }

  const handleConfirm =
    async () => {
      try {
        await onConfirm(operator)
        onClose()
      } catch {
        // Erro tratado pelo hook
      }
    }

  return (
    <div
      className="operator-modal-backdrop"
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
        className="operator-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-operator-title"
      >
        <div className="operator-modal-header">
          <div className="operator-modal-icon">
            <ShieldMinus size={18} />
          </div>

          <button
            type="button"
            className="operator-modal-close"
            disabled={loading}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={17} />
          </button>
        </div>

        <div className="operator-modal-content">
          <h3 id="remove-operator-title">
            Remover operador?
          </h3>

          <p>
            <strong>
              {operator.player.name}
            </strong>{' '}
            perderá as permissões de
            operador.
          </p>

          <span>
            O jogador continuará na
            allowlist, caso já esteja
            nela.
          </span>
        </div>

        <div className="operator-modal-actions">
          <button
            type="button"
            className="operator-modal-cancel"
            disabled={loading}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="operator-modal-confirm"
            disabled={loading}
            onClick={() =>
              void handleConfirm()
            }
          >
            <ShieldMinus size={15} />

            {loading
              ? 'Removendo...'
              : 'Remover OP'}
          </button>
        </div>
      </div>
    </div>
  )
}