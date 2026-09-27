import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { apiRequest } from '../services/api'
import { useInitialLoad } from './useInitialLoad'

import type {
  MinecraftData,
  ServerStatus,
} from '../types/dashboard'

type UseServerOptions = {
  onError: (
    message: string | null,
  ) => void
}

export function useServer({
  onError,
}: UseServerOptions) {
  const [status, setStatus] =
    useState<ServerStatus | null>(null)

  const [minecraft, setMinecraft] =
    useState<MinecraftData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false)

  const loadStatus =
    useCallback(async () => {
      try {
        const data =
          await apiRequest<ServerStatus>(
            '/status',
          )

        setStatus(data)
        onError(null)

        return data
      } catch (error) {
        onError(
          error instanceof Error
            ? error.message
            : 'Erro ao consultar o servidor',
        )

        return null
      } finally {
        setLoading(false)
      }
    }, [onError])

  const loadMinecraft =
    useCallback(async () => {
      try {
        const data =
          await apiRequest<MinecraftData>(
            '/minecraft',
          )

        setMinecraft(data)
      } catch {
        setMinecraft(null)
      }
    }, [])

  const refreshAll =
    useCallback(async () => {
      const currentStatus = await loadStatus()

      if (
        currentStatus?.ec2State === 'running' &&
        currentStatus.minecraftOnline
      ) {
        await loadMinecraft()
        return
      }

      setMinecraft(null)
    }, [
      loadStatus,
      loadMinecraft,
    ])

  const runAction =
    useCallback(
      async (
        path: '/start' | '/stop',
      ) => {
        try {
          setActionLoading(true)
          onError(null)

          await apiRequest(
            path,
            'POST',
          )

          /*
           * Atualiza imediatamente para
           * capturar pending/stopping.
           */
          await refreshAll()
        } catch (error) {
          onError(
            error instanceof Error
              ? error.message
              : 'Erro ao controlar servidor',
          )
        } finally {
          setActionLoading(false)
        }
      },
      [
        onError,
        refreshAll,
      ],
    )

  /*
   * Sincronização inicial +
   * atualização periódica.
   */
  useInitialLoad(refreshAll)

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        void refreshAll()
      }, 10_000)

    return () => {
      window.clearInterval(
        interval,
      )
    }
  }, [refreshAll])

  return {
    status,
    minecraft,

    loading,
    actionLoading,

    refreshAll,
    runAction,
  }
}
