import {
  useCallback,
  useState,
} from 'react'

import { apiRequest } from '../services/api'
import { useInitialLoad } from './useInitialLoad'

import type {
  AllowlistData,
  AllowlistMutationResult,
  AllowlistPlayer,
} from '../types/dashboard'

type UseAllowlistOptions = {
  enabled?: boolean
}

export function useAllowlist({
  enabled = true,
}: UseAllowlistOptions = {}) {
  const [
    allowlist,
    setAllowlist,
  ] =
    useState<AllowlistData | null>(null)

  const [
    allowlistLoading,
    setAllowlistLoading,
  ] = useState(true)

  const [
    allowlistActionLoading,
    setAllowlistActionLoading,
  ] = useState(false)

  const [
    allowlistError,
    setAllowlistError,
  ] =
    useState<string | null>(null)

  const loadAllowlist =
    useCallback(async () => {
      if (!enabled) {
        setAllowlistLoading(false)
        setAllowlistError(null)
        return null
      }

      try {
        setAllowlistLoading(true)
        setAllowlistError(null)

        const data =
          await apiRequest<AllowlistData>(
            '/allowlist',
          )

        setAllowlist(data)

        return data
      } catch (error) {
        console.error(
          'Erro ao carregar allowlist:',
          error,
        )

        setAllowlistError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar allowlist',
        )

        return null
      } finally {
        setAllowlistLoading(false)
      }
    }, [enabled])

  const addPlayer =
    useCallback(
      async (name: string) => {
        if (!enabled) {
          return
        }

        try {
          setAllowlistActionLoading(
            true,
          )

          setAllowlistError(null)

          const result =
            await apiRequest<AllowlistMutationResult>(
              '/allowlist',
              'POST',
              {
                name:
                  name.trim(),
              },
            )

          setAllowlist(
            (current) => {
              if (!current) {
                return current
              }

              return {
                ...current,

                players:
                  result.players,

                playerCount:
                  result.playerCount,
              }
            },
          )

          return result
        } catch (error) {
          console.error(
            'Erro ao adicionar jogador:',
            error,
          )

          setAllowlistError(
            error instanceof Error
              ? error.message
              : 'Erro ao adicionar jogador',
          )

          throw error
        } finally {
          setAllowlistActionLoading(
            false,
          )
        }
      },
      [enabled],
    )

  const removePlayer =
    useCallback(
      async (
        player:
          AllowlistPlayer,
      ) => {
        if (!enabled) {
          return
        }

        try {
          setAllowlistActionLoading(
            true,
          )

          setAllowlistError(null)

          const result =
            await apiRequest<AllowlistMutationResult>(
              '/allowlist',
              'DELETE',
              {
                id:
                  player.id,

                name:
                  player.name,
              },
            )

          setAllowlist(
            (current) => {
              if (!current) {
                return current
              }

              return {
                ...current,

                players:
                  result.players,

                playerCount:
                  result.playerCount,
              }
            },
          )

          return result
        } catch (error) {
          console.error(
            'Erro ao remover jogador:',
            error,
          )

          setAllowlistError(
            error instanceof Error
              ? error.message
              : 'Erro ao remover jogador',
          )

          throw error
        } finally {
          setAllowlistActionLoading(
            false,
          )
        }
      },
      [enabled],
    )

  useInitialLoad(loadAllowlist, enabled)

  return {
    allowlist,
    allowlistLoading: enabled && allowlistLoading,
    allowlistActionLoading:
      enabled && allowlistActionLoading,
    allowlistError:
      enabled ? allowlistError : null,

    loadAllowlist,
    addPlayer,
    removePlayer,
  }
}
