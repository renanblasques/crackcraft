import {
  RotateCcw,
  X,
} from 'lucide-react'

import type { Backup } from '../../types/dashboard'

import {
  formatBackupDate,
  formatBytes,
} from '../../utils/formatters'

type Props = {
  backup: Backup | null
  starting: boolean
  restoreRunning: boolean

  onClose: () => void
  onRestore: () => void | Promise<void>
}

export function RestoreConfirmModal({
  backup,
  starting,
  restoreRunning,
  onClose,
  onRestore,
}: Props) {
  if (!backup || restoreRunning) {
    return null
  }

  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        if (!starting) {
          onClose()
        }
      }}
    >
      <div
        className="modal restore-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow restore">
              RESTAURAR MUNDO
            </span>

            <h2>
              Restaurar este backup?
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            disabled={starting}
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>

        <p className="modal-description">
          O Minecraft ficará indisponível
          durante alguns segundos. Um backup
          de segurança do mundo atual será
          criado automaticamente antes da
          restauração.
        </p>

        <div className="restore-warning">
          <RotateCcw size={20} />

          <span>
            O mundo será substituído pelo
            estado salvo neste backup.
          </span>
        </div>

        <div className="backup-delete-info">
          <strong>
            {formatBackupDate(
              backup.lastModified,
            )}
          </strong>

          <span>
            {formatBytes(backup.size)}
          </span>

          <small>
            {backup.name}
          </small>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            disabled={starting}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="restore-button"
            disabled={starting}
            onClick={() =>
              void onRestore()
            }
          >
            <RotateCcw size={17} />

            {starting
              ? 'Iniciando...'
              : 'Restaurar mundo'}
          </button>
        </div>
      </div>
    </div>
  )
}