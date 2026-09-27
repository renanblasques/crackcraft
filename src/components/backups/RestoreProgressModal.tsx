import { RotateCcw } from 'lucide-react'

import type {
  RestoreStatus,
} from '../../types/dashboard'

import {
  getRestoreDescription,
  getRestoreStep,
} from '../../utils/formatters'

type Props = {
  status: RestoreStatus | null
}

export function RestoreProgressModal({
  status,
}: Props) {
  if (!status?.running) {
    return null
  }

  const step =
    getRestoreStep(
      status.stage ?? null,
    )

  const percent =
    Math.round(
      (step / 8) * 100,
    )

  return (
    <div className="modal-backdrop">
      <div className="modal restore-progress-modal">
        <div className="restore-progress-icon">
          <RotateCcw
            size={28}
            className="restore-spin"
          />
        </div>

        <span className="modal-eyebrow restore">
          RESTAURAÇÃO EM ANDAMENTO
        </span>

        <h2>
          Restaurando o Crackcraft
        </h2>

        <p className="modal-description">
          Não desligue o servidor durante
          este processo.
        </p>

        <div className="restore-progress">
          <div className="restore-progress-info">
            <strong>
              {getRestoreDescription(
                status.stage ?? null,
              )}
            </strong>

            <span>
              {step > 0
                ? `${step} de 8`
                : 'Preparando...'}
            </span>
          </div>

          <div className="restore-progress-track">
            <div
              className="restore-progress-bar"
              style={{
                width: `${percent}%`,
              }}
            />
          </div>
        </div>

        <div className="restore-backup-name">
          {status.backupName}
        </div>
      </div>
    </div>
  )
}