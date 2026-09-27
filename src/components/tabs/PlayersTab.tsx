import { Power } from 'lucide-react'

import { AllowlistPanel } from '../AllowlistPanel'
import { OperatorsPanel } from '../OperatorsPanel'
import { PlayerStatsPanel } from '../PlayerStatsPanel'
import { FeedbackState } from '../ui/FeedbackState'

import type { useAllowlist } from '../../hooks/useAllowlist'
import type { useOperators } from '../../hooks/useOperators'
import type { usePlayerStats } from '../../hooks/usePlayerStats'

import styles from './TabLayouts.module.css'

export type PlayersTabProps = {
  minecraftAvailable: boolean
  allowlistState: ReturnType<typeof useAllowlist>
  operatorsState: ReturnType<typeof useOperators>
  playerStatsState: ReturnType<typeof usePlayerStats>
}

export default function PlayersTab({
  minecraftAvailable,
  allowlistState,
  operatorsState,
  playerStatsState,
}: PlayersTabProps) {
  return (
    <div className={styles.stack}>
      <div className={styles.pageHeading}>
        <span className={styles.kicker}>
          Comunidade
        </span>
        <h2>Jogadores e permissões</h2>
        <p>
          Organize o acesso ao mundo, os operadores
          e acompanhe as conquistas da turma.
        </p>
      </div>

      {!minecraftAvailable ? (
        <section className="panel">
          <FeedbackState
            icon={<Power size={30} />}
            title="Servidor offline"
            description="Ligue o Crackcraft para gerenciar jogadores, operadores e estatísticas."
          />
        </section>
      ) : (
        <>
          <div className={styles.twoColumns}>
            <AllowlistPanel
              allowlist={allowlistState.allowlist}
              loading={allowlistState.allowlistLoading}
              actionLoading={
                allowlistState.allowlistActionLoading
              }
              error={allowlistState.allowlistError}
              onRefresh={allowlistState.loadAllowlist}
              onAdd={allowlistState.addPlayer}
              onRemove={allowlistState.removePlayer}
            />

            <OperatorsPanel
              operators={operatorsState.operators}
              loading={operatorsState.operatorsLoading}
              actionLoading={
                operatorsState.operatorsActionLoading
              }
              error={operatorsState.operatorsError}
              onRefresh={operatorsState.loadOperators}
              onAdd={operatorsState.addOperator}
              onRemove={operatorsState.removeOperator}
            />
          </div>

          <PlayerStatsPanel
            data={playerStatsState.playerStats}
            loading={
              playerStatsState.playerStatsLoading
            }
            error={playerStatsState.playerStatsError}
            onRefresh={playerStatsState.loadPlayerStats}
          />
        </>
      )}
    </div>
  )
}
