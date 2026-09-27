import { CostPanel } from '../CostPanel'
import { PlayersPanel } from '../PlayersPanel'
import { StatsGrid } from '../StatsGrid'

import type { useCost } from '../../hooks/useCost'
import type {
  MinecraftData,
  ServerStatus,
} from '../../types/dashboard'

export type OverviewTabProps = {
  status: ServerStatus | null
  minecraft: MinecraftData | null
  costState: ReturnType<typeof useCost>
}

export default function OverviewTab({
  status,
  minecraft,
  costState,
}: OverviewTabProps) {
  return (
    <>
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
          cost={costState.cost}
          loading={costState.costLoading}
          error={costState.costError}
          onRefresh={costState.refreshCost}
        />
      </section>
    </>
  )
}
