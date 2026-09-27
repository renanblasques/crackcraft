import {
  useCallback,
  useState,
} from 'react'

import { apiRequest } from '../services/api'
import { useInitialLoad } from './useInitialLoad'

import type {
  PlayerStatsData,
} from '../types/dashboard'

type UsePlayerStatsOptions = {
  enabled?: boolean
}

export function usePlayerStats({
  enabled = true,
}: UsePlayerStatsOptions = {}) {
  const [
    playerStats,
    setPlayerStats,
  ] =
    useState<PlayerStatsData | null>(
      null,
    )

  const [
    playerStatsLoading,
    setPlayerStatsLoading,
  ] = useState(true)

  const [
    playerStatsError,
    setPlayerStatsError,
  ] =
    useState<string | null>(null)

  const loadPlayerStats =
    useCallback(async () => {
      if (!enabled) {
        setPlayerStatsLoading(false)
        setPlayerStatsError(null)
        return null
      }

      try {
        setPlayerStatsLoading(true)
        setPlayerStatsError(null)

        const data =
          await apiRequest<PlayerStatsData>(
            '/player-stats',
          )

        setPlayerStats(data)

        return data
      } catch (error) {
        console.error(
          'Erro ao carregar estatísticas dos jogadores:',
          error,
        )

        setPlayerStatsError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar estatísticas dos jogadores',
        )

        return null
      } finally {
        setPlayerStatsLoading(false)
      }
    }, [enabled])

  useInitialLoad(loadPlayerStats, enabled)

  return {
    playerStats,
    playerStatsLoading:
      enabled && playerStatsLoading,
    playerStatsError:
      enabled ? playerStatsError : null,
    loadPlayerStats,
  }
}
