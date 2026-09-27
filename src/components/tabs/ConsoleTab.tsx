import { Power } from 'lucide-react'

import { LogsPanel } from '../LogsPanel'
import { FeedbackState } from '../ui/FeedbackState'

import type { useLogs } from '../../hooks/useLogs'

import styles from './TabLayouts.module.css'

export type ConsoleTabProps = {
  minecraftAvailable: boolean
  logsState: ReturnType<typeof useLogs>
}

export default function ConsoleTab({
  minecraftAvailable,
  logsState,
}: ConsoleTabProps) {
  return (
    <div className={styles.stack}>
      <div className={styles.pageHeading}>
        <span className={styles.kicker}>
          Diagnóstico
        </span>
        <h2>Console do Crackcraft</h2>
        <p>
          Consulte os eventos mais recentes do
          servidor e filtre avisos ou erros.
        </p>
      </div>

      {minecraftAvailable ? (
        <LogsPanel
          logs={logsState.logs}
          loading={logsState.logsLoading}
          error={logsState.logsError}
          lineLimit={logsState.lineLimit}
          onRefresh={logsState.loadLogs}
          onLineLimitChange={
            logsState.changeLineLimit
          }
        />
      ) : (
        <section className="panel">
          <FeedbackState
            icon={<Power size={30} />}
            title="Console indisponível"
            description="Ligue o Crackcraft para consultar os logs do servidor."
          />
        </section>
      )}
    </div>
  )
}
