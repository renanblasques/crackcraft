import { Trash2, X } from 'lucide-react'

import type { Backup } from '../../types/dashboard'

import {
  formatBackupDate,
  formatBytes,
} from '../../utils/formatters'

type Props = {
  backup: Backup | null
  deleting: boolean

  onClose: () => void
  onDelete: () => void | Promise<void>
}

export function DeleteBackupModal({
  backup,
  deleting,
  onClose,
  onDelete,
}: Props) {
  if (!backup) return null

  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        if (!deleting) {
          onClose()
        }
      }}
    >
      <div
        className="modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">
              EXCLUIR BACKUP
            </span>

            <h2>
              Excluir este backup?
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            disabled={deleting}
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>

        <p className="modal-description">
          Esta ação é permanente. O arquivo
          será removido do Amazon S3.
        </p>

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
            disabled={deleting}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="danger-button"
            disabled={deleting}
            onClick={() =>
              void onDelete()
            }
          >
            <Trash2 size={17} />

            {deleting
              ? 'Excluindo...'
              : 'Excluir backup'}
          </button>
        </div>
      </div>
    </div>
  )
}