import {
  Download,
  HardDrive,
  RotateCcw,
  Trash2,
} from 'lucide-react'

import type {
  Backup,
  BackupStatus,
} from '../../types/dashboard'

import {
  formatBackupDate,
  formatBytes,
} from '../../utils/formatters'

import { Button } from '../ui/Button'
import { FeedbackState } from '../ui/FeedbackState'
import { PanelHeader } from '../ui/PanelHeader'

type Props = {
  backups: Backup[]
  backupStatus: BackupStatus | null
  backupLoading: boolean
  restoreRunning: boolean
  downloadingBackup: string | null
  serverRunning: boolean

  onCreateBackup: () => void | Promise<void>
  onDownloadBackup: (
    backup: Backup,
  ) => void | Promise<void>

  onRestoreBackup: (
    backup: Backup,
  ) => void

  onDeleteBackup: (
    backup: Backup,
  ) => void
}

export function BackupsPanel({
  backups,
  backupStatus,
  backupLoading,
  restoreRunning,
  downloadingBackup,
  serverRunning,
  onCreateBackup,
  onDownloadBackup,
  onRestoreBackup,
  onDeleteBackup,
}: Props) {
  return (
    <section className="panel backups-panel">
      <PanelHeader
        className="backups-header"
        title="Backups"
        subtitle="Cópias automáticas do mundo armazenadas no Amazon S3"
        action={
          <Button
            onClick={() => void onCreateBackup()}
            disabled={
              backupLoading ||
              backupStatus?.running ||
              restoreRunning ||
              !serverRunning
            }
          >
            <HardDrive size={17} />
            {backupStatus?.running || backupLoading
              ? 'Criando backup...'
              : 'Fazer backup agora'}
          </Button>
        }
      />

      {backups.length > 0 ? (
        <div className="backup-list">
          {backups
            .slice(0, 8)
            .map((backup) => (
              <div
                className="backup-row"
                key={backup.key}
              >
                <div className="backup-icon">
                  <HardDrive
                    size={18}
                  />
                </div>

                <div className="backup-info">
                  <strong>
                    {formatBackupDate(
                      backup.lastModified,
                    )}
                  </strong>

                  <span>
                    {formatBytes(
                      backup.size,
                    )}
                  </span>
                </div>

                <div className="backup-actions">
                  <button
                    type="button"
                    className="backup-action-button"
                    title="Baixar backup"
                    disabled={
                      downloadingBackup ===
                        backup.name ||
                      restoreRunning
                    }
                    onClick={() =>
                      void onDownloadBackup(
                        backup,
                      )
                    }
                  >
                    <Download
                      size={16}
                    />

                    {downloadingBackup ===
                    backup.name
                      ? 'Baixando...'
                      : 'Baixar'}
                  </button>

                  <button
                    type="button"
                    className="backup-action-button restore"
                    title="Restaurar backup"
                    disabled={
                      restoreRunning ||
                      backupStatus?.running
                    }
                    onClick={() =>
                      onRestoreBackup(
                        backup,
                      )
                    }
                  >
                    <RotateCcw
                      size={16}
                    />

                    Restaurar
                  </button>

                  <button
                    type="button"
                    className="backup-action-button delete"
                    title="Excluir backup"
                    disabled={
                      restoreRunning
                    }
                    onClick={() =>
                      onDeleteBackup(
                        backup,
                      )
                    }
                  >
                    <Trash2
                      size={16}
                    />

                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <FeedbackState
          icon={<HardDrive size={32} />}
          title="Nenhum backup encontrado"
          description="Os backups aparecerão aqui assim que forem criados."
        />
      )}

      {backupStatus?.lastError && (
        <div className="backup-error">
          Último backup falhou:{' '}
          {backupStatus.lastError}
        </div>
      )}
    </section>
  )
}
