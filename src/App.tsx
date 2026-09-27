import {
  lazy,
  Suspense,
  useCallback,
  useState,
} from 'react'

import { Authenticator } from '@aws-amplify/ui-react'

import { useAllowlist } from './hooks/useAllowlist'
import { useBackups } from './hooks/useBackups'
import { useCost } from './hooks/useCost'
import { useDashboardTabs } from './hooks/useDashboardTabs'
import { useLogs } from './hooks/useLogs'
import { useOperators } from './hooks/useOperators'
import { usePlayerStats } from './hooks/usePlayerStats'
import { useRestore } from './hooks/useRestore'
import { useServer } from './hooks/useServer'
import { useSettings } from './hooks/useSettings'

import {
  AuthFooter,
  AuthHeader,
} from './components/AuthHeader'
import { DashboardTabs } from './components/DashboardTabs'
import { ServerHero } from './components/ServerHero'
import { TabSkeleton } from './components/TabSkeleton'
import { Topbar } from './components/Topbar'

import { DeleteBackupModal } from './components/backups/DeleteBackupModal'
import { RestoreConfirmModal } from './components/backups/RestoreConfirmModal'
import { RestoreProgressModal } from './components/backups/RestoreProgressModal'
import { RestoreResultModal } from './components/backups/RestoreResultModal'

import styles from './App.module.css'

const OverviewTab = lazy(
  () => import('./components/tabs/OverviewTab'),
)

const PlayersTab = lazy(
  () => import('./components/tabs/PlayersTab'),
)

const ServerTab = lazy(
  () => import('./components/tabs/ServerTab'),
)

const ConsoleTab = lazy(
  () => import('./components/tabs/ConsoleTab'),
)

function Dashboard({
  signOut,
  email,
}: {
  signOut?: () => void
  email?: string
}) {
  const [error, setError] =
    useState<string | null>(null)

  const {
    activeTab,
    visitedTabs,
    selectTab,
  } = useDashboardTabs()

  const overviewEnabled =
    visitedTabs.has('overview')
  const playersEnabled =
    visitedTabs.has('players')
  const serverEnabled =
    visitedTabs.has('server')
  const consoleEnabled =
    visitedTabs.has('console')

  const serverState = useServer({
    onError: setError,
  })

  const minecraftAvailable =
    serverState.status?.ec2State === 'running' &&
    serverState.status.minecraftOnline

  const backupsState = useBackups({
    onError: setError,
    enabled: serverEnabled,
  })

  const { refreshAll } = serverState
  const { loadBackups } = backupsState

  const handleRestoreFinished =
    useCallback(async () => {
      await Promise.all([
        refreshAll(),
        loadBackups(),
      ])
    }, [
      refreshAll,
      loadBackups,
    ])

  const restoreState = useRestore({
    onError: setError,
    onFinished: handleRestoreFinished,
  })

  const costState = useCost({
    enabled: overviewEnabled,
  })

  const allowlistState = useAllowlist({
    enabled: playersEnabled && minecraftAvailable,
  })

  const operatorsState = useOperators({
    enabled: playersEnabled && minecraftAvailable,
  })

  const settingsState = useSettings({
    enabled: serverEnabled && minecraftAvailable,
  })

  const logsState = useLogs({
    enabled: consoleEnabled && minecraftAvailable,
  })

  const playerStatsState = usePlayerStats({
    enabled: playersEnabled && minecraftAvailable,
  })

  return (
    <div className={styles.shell}>
      <Topbar email={email} signOut={signOut} />

      <DashboardTabs
        activeTab={activeTab}
        onChange={selectTab}
      />

      <main className={styles.main}>
        {error && (
          <div
            className={styles.errorBanner}
            role="alert"
          >
            {error}
          </div>
        )}

        <ServerHero
          status={serverState.status}
          loading={serverState.loading}
          actionLoading={serverState.actionLoading}
          restoreRunning={restoreState.restoreRunning}
          onAction={serverState.runAction}
          onRefresh={serverState.refreshAll}
          onError={setError}
        />

        <div className={styles.panels}>
          {visitedTabs.has('overview') && (
            <section
              id="panel-overview"
              className={styles.tabPanel}
              role="tabpanel"
              aria-labelledby="tab-overview"
              hidden={activeTab !== 'overview'}
            >
              <Suspense fallback={<TabSkeleton />}>
                <OverviewTab
                  status={serverState.status}
                  minecraft={serverState.minecraft}
                  costState={costState}
                />
              </Suspense>
            </section>
          )}

          {visitedTabs.has('players') && (
            <section
              id="panel-players"
              className={styles.tabPanel}
              role="tabpanel"
              aria-labelledby="tab-players"
              hidden={activeTab !== 'players'}
            >
              <Suspense fallback={<TabSkeleton />}>
                <PlayersTab
                  minecraftAvailable={minecraftAvailable}
                  allowlistState={allowlistState}
                  operatorsState={operatorsState}
                  playerStatsState={playerStatsState}
                />
              </Suspense>
            </section>
          )}

          {visitedTabs.has('server') && (
            <section
              id="panel-server"
              className={styles.tabPanel}
              role="tabpanel"
              aria-labelledby="tab-server"
              hidden={activeTab !== 'server'}
            >
              <Suspense fallback={<TabSkeleton />}>
                <ServerTab
                  minecraftAvailable={minecraftAvailable}
                  settingsState={settingsState}
                  backupsState={backupsState}
                  restoreState={restoreState}
                  serverRunning={
                    serverState.status?.ec2State ===
                    'running'
                  }
                />
              </Suspense>
            </section>
          )}

          {visitedTabs.has('console') && (
            <section
              id="panel-console"
              className={styles.tabPanel}
              role="tabpanel"
              aria-labelledby="tab-console"
              hidden={activeTab !== 'console'}
            >
              <Suspense fallback={<TabSkeleton />}>
                <ConsoleTab
                  minecraftAvailable={minecraftAvailable}
                  logsState={logsState}
                />
              </Suspense>
            </section>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <span>
          <strong>Crackcraft</strong> · Painel privado
          para Minecraft: Java Edition
        </span>
        <span>
          Projeto não oficial, não associado à Mojang
          ou Microsoft.
        </span>
      </footer>

      <DeleteBackupModal
        backup={backupsState.backupToDelete}
        deleting={backupsState.deletingBackup}
        onClose={() =>
          backupsState.setBackupToDelete(null)
        }
        onDelete={backupsState.deleteBackup}
      />

      <RestoreConfirmModal
        backup={restoreState.restoreToConfirm}
        starting={restoreState.restoreStarting}
        restoreRunning={restoreState.restoreRunning}
        onClose={() =>
          restoreState.setRestoreToConfirm(null)
        }
        onRestore={restoreState.restoreBackup}
      />

      <RestoreProgressModal
        status={restoreState.restoreStatus}
      />

      <RestoreResultModal
        open={restoreState.restoreFinishedOpen}
        status={restoreState.restoreStatus}
        onClose={() =>
          restoreState.setRestoreFinishedOpen(false)
        }
      />
    </div>
  )
}

function App() {
  return (
    <Authenticator
      loginMechanisms={['email']}
      hideSignUp
      components={{
        Header: AuthHeader,
        Footer: AuthFooter,
      }}
      formFields={{
        signIn: {
          username: {
            label: 'E-mail',
            placeholder: 'voce@exemplo.com',
          },
          password: {
            label: 'Senha',
            placeholder: 'Digite sua senha',
          },
        },
      }}
    >
      {({ signOut, user }) => (
        <Dashboard
          signOut={signOut}
          email={user?.signInDetails?.loginId}
        />
      )}
    </Authenticator>
  )
}

export default App
