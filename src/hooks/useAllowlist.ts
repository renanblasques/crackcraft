import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { apiRequest } from '../services/api'

import type {
  AllowlistData,
  AllowlistMutationResult,
  AllowlistPlayer,
} from '../types/dashboard'

export function useAllowlist() {
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
    }, [])

  const addPlayer =
    useCallback(
      async (name: string) => {
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
      [],
    )

  const removePlayer =
    useCallback(
      async (
        player:
          AllowlistPlayer,
      ) => {
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
      [],
    )

  useEffect(() => {
    void loadAllowlist()
  }, [loadAllowlist])

  return {
    allowlist,
    allowlistLoading,
    allowlistActionLoading,
    allowlistError,

    loadAllowlist,
    addPlayer,
    removePlayer,
  }
}