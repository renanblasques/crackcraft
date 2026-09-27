import { useCallback, useEffect, useState } from 'react'
import { Authenticator } from '@aws-amplify/ui-react'

import { useBackups } from './hooks/useBackups'
import { useRestore } from './hooks/useRestore'
import { useServer } from './hooks/useServer'
import { useCost } from './hooks/useCost'
import { useAllowlist } from './hooks/useAllowlist'
import { useOperators } from './hooks/useOperators'
import { useSettings } from './hooks/useSettings'
import { useLogs } from './hooks/useLogs'
import { usePlayerStats } from './hooks/usePlayerStats'

import { Topbar } from './components/Topbar'
import { StatsGrid } from './components/StatsGrid'
import { ServerHero } from './components/ServerHero'
import { PlayersPanel } from './components/PlayersPanel'
import { CostPanel } from './components/CostPanel'
import { BackupsPanel } from './components/backups/BackupsPanel'
import { AllowlistPanel } from './components/AllowlistPanel'
import { OperatorsPanel } from './components/OperatorsPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { LogsPanel } from './components/LogsPanel'
import { PlayerStatsPanel } from './components/PlayerStatsPanel'

import { DeleteBackupModal } from './components/backups/DeleteBackupModal'
import { RestoreConfirmModal } from './components/backups/RestoreConfirmModal'
import { RestoreProgressModal } from './components/backups/RestoreProgressModal'
import { RestoreResultModal } from './components/backups/RestoreResultModal'

import './App.css'

function Dashboard({
  signOut,
  email,
}: {
  signOut?: () => void
  email?: string
}) {
  const [error, setError] = useState<string | null>(null)

  const {
    status,
    minecraft,
    loading,
    actionLoading,
    refreshAll,
    runAction,
  } = useServer({
    onError: setError,
  })

  const {
    backups,
    backupStatus,
    backupLoading,

    backupToDelete,
    setBackupToDelete,

    deletingBackup,
    downloadingBackup,

    loadBackups,
    loadBackupStatus,

    createBackup,
    downloadBackup,
    deleteBackup,
  } = useBackups({
    onError: setError,
  })

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

  const {
    restoreToConfirm,
    setRestoreToConfirm,

    restoreStatus,
    restoreStarting,

    restoreFinishedOpen,
    setRestoreFinishedOpen,

    restoreRunning,

    loadRestoreStatus,
    restoreBackup,
  } = useRestore({
    onError: setError,
    onFinished:
      handleRestoreFinished,
  })

  const {
    cost,
    costLoading,
    costError,
    refreshCost,
  } = useCost()

  const {
    allowlist,
    allowlistLoading,
    allowlistActionLoading,
    allowlistError,
    loadAllowlist,
    addPlayer,
    removePlayer,
  } = useAllowlist()

  const {
    operators,
    operatorsLoading,
    operatorsActionLoading,
    operatorsError,
    loadOperators,
    addOperator,
    removeOperator,
  } = useOperators()

  const {
    settings,
    settingsLoading,
    settingsSaving,
    settingsError,
    loadSettings,
    updateSettings,
  } = useSettings()

  const {
    logs,
    logsLoading,
    logsError,
    lineLimit,
    loadLogs,
    changeLineLimit,
  } = useLogs()

  const {
    playerStats,
    playerStatsLoading,
    playerStatsError,
    loadPlayerStats,
  } = usePlayerStats()

  useEffect(() => {
    void loadBackups()
    void loadBackupStatus()
    void loadRestoreStatus()
  }, [
    loadBackups,
    loadBackupStatus,
    loadRestoreStatus,
  ])

  return (
    <div className="app-shell">
      <Topbar
        email={email}
        signOut={signOut}
      />

      <main className="dashboard">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <ServerHero
          status={status}
          loading={loading}
          actionLoading={actionLoading}
          restoreRunning={restoreRunning}
          onAction={runAction}
          onRefresh={refreshAll}
          onError={setError}
        />

        <StatsGrid
          status={status}
          minecraft={minecraft}
        />

        <section className="content-grid">
          <PlayersPanel
            status={status}
            minecraft={minecraft}
          />
            
          <CostPanel
            cost={cost}
            loading={costLoading}
            error={costError}
            onRefresh={refreshCost}
          />
        </section>

        <AllowlistPanel
          allowlist={allowlist}
          loading={allowlistLoading}
          actionLoading={allowlistActionLoading}
          error={allowlistError}
          onRefresh={loadAllowlist}
          onAdd={addPlayer}
          onRemove={removePlayer}
        />

        <OperatorsPanel
          operators={operators}
          loading={operatorsLoading}
          actionLoading={operatorsActionLoading}
          error={operatorsError}
          onRefresh={loadOperators}
          onAdd={addOperator}
          onRemove={removeOperator}
        />

        <SettingsPanel
          settings={settings}
          loading={settingsLoading}
          saving={settingsSaving}
          error={settingsError}
          onRefresh={loadSettings}
          onSave={updateSettings}
        />

        <BackupsPanel
          backups={backups}
          backupStatus={backupStatus}
          backupLoading={backupLoading}
          restoreRunning={restoreRunning}
          downloadingBackup={downloadingBackup}
          serverRunning={
            status?.ec2State === 'running'
          }
          onCreateBackup={createBackup}
          onDownloadBackup={downloadBackup}
          onRestoreBackup={
            setRestoreToConfirm
          }
          onDeleteBackup={
            setBackupToDelete
          }
        />
      </main>

      <DeleteBackupModal
        backup={backupToDelete}
        deleting={deletingBackup}
        onClose={() =>
          setBackupToDelete(null)
        }
        onDelete={deleteBackup}
      />

      <RestoreConfirmModal
        backup={restoreToConfirm}
        starting={restoreStarting}
        restoreRunning={restoreRunning}
        onClose={() =>
          setRestoreToConfirm(null)
        }
        onRestore={restoreBackup}
      />

      <RestoreProgressModal
        status={restoreStatus}
      />

      <RestoreResultModal
        open={restoreFinishedOpen}
        status={restoreStatus}
        onClose={() =>
          setRestoreFinishedOpen(false)
        }
      />

      <PlayerStatsPanel
        data={playerStats}
        loading={playerStatsLoading}
        error={playerStatsError}
        onRefresh={loadPlayerStats}
      />

      <LogsPanel
        logs={logs}
        loading={logsLoading}
        error={logsError}
        lineLimit={lineLimit}
        onRefresh={loadLogs}
        onLineLimitChange={changeLineLimit}
      /> 

    </div>
  )
}

function App() {
  return (
    <Authenticator
      loginMechanisms={['email']}
      hideSignUp
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
