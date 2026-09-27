import { RotateCcw } from 'lucide-react'

import type {
  RestoreStatus,
} from '../../types/dashboard'

type Props = {
  open: boolean
  status: RestoreStatus | null

  onClose: () => void
}

export function RestoreResultModal({
  open,
  status,
  onClose,
}: Props) {
  if (
    !open ||
    !status ||
    status.running
  ) {
    return null
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal restore-result-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div
          className={
            status.lastSuccess
              ? 'restore-result-icon success'
              : 'restore-result-icon error'
          }
        >
          <RotateCcw size={25} />
        </div>

        <h2>
          {status.lastSuccess
            ? 'Restauração concluída'
            : 'Falha na restauração'}
        </h2>

        <p className="modal-description">
          {status.lastSuccess
            ? 'O mundo foi restaurado e o Minecraft voltou a ficar online.'
            : status.lastError ??
              'Não foi possível concluir a restauração.'}
        </p>

        {status.backupName && (
          <div className="restore-backup-name">
            {status.backupName}
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="primary-button"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}