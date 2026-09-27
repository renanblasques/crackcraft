import { Power } from 'lucide-react'

import { BackupsPanel } from '../backups/BackupsPanel'
import { SettingsPanel } from '../SettingsPanel'
import { FeedbackState } from '../ui/FeedbackState'

import type { useBackups } from '../../hooks/useBackups'
import type { useRestore } from '../../hooks/useRestore'
import type { useSettings } from '../../hooks/useSettings'

import styles from './TabLayouts.module.css'

export type ServerTabProps = {
  minecraftAvailable: boolean
  settingsState: ReturnType<typeof useSettings>
  backupsState: ReturnType<typeof useBackups>
  restoreState: ReturnType<typeof useRestore>
  serverRunning: boolean
}

export default function ServerTab({
  minecraftAvailable,
  settingsState,
  backupsState,
  restoreState,
  serverRunning,
}: ServerTabProps) {
  return (
    <div className={styles.stack}>
      <div className={styles.pageHeading}>
        <span className={styles.kicker}>
          Mundo e infraestrutura
        </span>
        <h2>Configurações do servidor</h2>
        <p>
          Ajuste a experiência do jogo e proteja o
          mundo com cópias armazenadas no S3.
        </p>
      </div>

      {minecraftAvailable ? (
        <SettingsPanel
          settings={settingsState.settings}
          loading={settingsState.settingsLoading}
          saving={settingsState.settingsSaving}
          error={settingsState.settingsError}
          onRefresh={settingsState.loadSettings}
          onSave={settingsState.updateSettings}
        />
      ) : (
        <section className="panel">
          <FeedbackState
            icon={<Power size={30} />}
            title="Configurações indisponíveis"
            description="Ligue o Crackcraft para consultar ou alterar as configurações do jogo. Os backups continuam disponíveis abaixo."
          />
        </section>
      )}

      <BackupsPanel
        backups={backupsState.backups}
        backupStatus={backupsState.backupStatus}
        backupLoading={backupsState.backupLoading}
        restoreRunning={restoreState.restoreRunning}
        downloadingBackup={
          backupsState.downloadingBackup
        }
        serverRunning={serverRunning}
        onCreateBackup={backupsState.createBackup}
        onDownloadBackup={backupsState.downloadBackup}
        onRestoreBackup={
          restoreState.setRestoreToConfirm
        }
        onDeleteBackup={
          backupsState.setBackupToDelete
        }
      />
    </div>
  )
}
