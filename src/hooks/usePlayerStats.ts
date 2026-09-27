import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { apiRequest } from '../services/api'

import type {
  PlayerStatsData,
} from '../types/dashboard'

export function usePlayerStats() {
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
    }, [])

  useEffect(() => {
    void loadPlayerStats()
  }, [loadPlayerStats])

  return {
    playerStats,
    playerStatsLoading,
    playerStatsError,
    loadPlayerStats,
  }
}