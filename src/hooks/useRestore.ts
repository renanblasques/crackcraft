import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { apiRequest } from '../services/api'

import type {
  Backup,
  RestoreStatus,
} from '../types/dashboard'

type UseRestoreOptions = {
  onError: (
    message: string | null,
  ) => void

  onFinished: () =>
    void | Promise<void>
}

export function useRestore({
  onError,
  onFinished,
}: UseRestoreOptions) {
  const [
    restoreToConfirm,
    setRestoreToConfirm,
  ] =
    useState<Backup | null>(null)

  const [
    restoreStatus,
    setRestoreStatus,
  ] =
    useState<RestoreStatus | null>(
      null,
    )

  const [
    restoreStarting,
    setRestoreStarting,
  ] = useState(false)

  const [
    restoreFinishedOpen,
    setRestoreFinishedOpen,
  ] = useState(false)

  const loadRestoreStatus =
    useCallback(async () => {
      try {
        const data =
          (await apiRequest(
            '/restore/status',
          )) as RestoreStatus

        setRestoreStatus(data)

        return data
      } catch (error) {
        console.error(
          'Erro ao consultar restauração:',
          error,
        )

        return null
      }
    }, [])

  const restoreBackup =
    useCallback(async () => {
      if (!restoreToConfirm) {
        return
      }

      try {
        setRestoreStarting(true)
        onError(null)

        const data =
          await apiRequest(
            `/backups/${encodeURIComponent(
              restoreToConfirm.name,
            )}/restore`,
            'POST',
          )

        if (!data.accepted) {
          throw new Error(
            data.message ??
              'Não foi possível iniciar a restauração',
          )
        }

        setRestoreToConfirm(null)

        await loadRestoreStatus()
      } catch (error) {
        onError(
          error instanceof Error
            ? error.message
            : 'Erro ao iniciar restauração',
        )
      } finally {
        setRestoreStarting(false)
      }
    }, [
      restoreToConfirm,
      loadRestoreStatus,
      onError,
    ])

  useEffect(() => {
    if (!restoreStatus?.running) {
      return
    }

    const interval =
      window.setInterval(
        async () => {
          const current =
            await loadRestoreStatus()

          if (
            current &&
            !current.running
          ) {
            window.clearInterval(
              interval,
            )

            await onFinished()

            setRestoreFinishedOpen(
              true,
            )
          }
        },
        1500,
      )

    return () => {
      window.clearInterval(
        interval,
      )
    }
  }, [
    restoreStatus?.running,
    loadRestoreStatus,
    onFinished,
  ])

  const restoreRunning =
    restoreStatus?.running === true

  return {
    restoreToConfirm,
    setRestoreToConfirm,

    restoreStatus,
    restoreStarting,

    restoreFinishedOpen,
    setRestoreFinishedOpen,

    restoreRunning,

    loadRestoreStatus,
    restoreBackup,
  }
}