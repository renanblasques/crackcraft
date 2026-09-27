import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { apiRequest } from '../services/api'
import { useInitialLoad } from './useInitialLoad'

import type {
  Backup,
  BackupActionResponse,
  BackupDownloadResponse,
  BackupsData,
  BackupStatus,
} from '../types/dashboard'

type UseBackupsOptions = {
  onError: (
    message: string | null,
  ) => void
  enabled?: boolean
}

export function useBackups({
  onError,
  enabled = true,
}: UseBackupsOptions) {
  const [backups, setBackups] =
    useState<Backup[]>([])

  const [
    backupStatus,
    setBackupStatus,
  ] =
    useState<BackupStatus | null>(
      null,
    )

  const [
    backupLoading,
    setBackupLoading,
  ] = useState(false)

  const [
    backupToDelete,
    setBackupToDelete,
  ] =
    useState<Backup | null>(null)

  const [
    deletingBackup,
    setDeletingBackup,
  ] = useState(false)

  const [
    downloadingBackup,
    setDownloadingBackup,
  ] =
    useState<string | null>(null)

  const loadBackups =
    useCallback(async () => {
      try {
        const data =
          await apiRequest<BackupsData>(
            '/backups',
          )

        setBackups(data.backups)
      } catch (error) {
        console.error(
          'Erro ao carregar backups:',
          error,
        )
      }
    }, [])

  const loadBackupStatus =
    useCallback(async () => {
      try {
        const data =
          await apiRequest<BackupStatus>(
            '/backups/status',
          )

        setBackupStatus(data)

        return data
      } catch (error) {
        console.error(
          'Erro ao consultar backup:',
          error,
        )

        return null
      }
    }, [])

  async function createBackup() {
    try {
      setBackupLoading(true)
      onError(null)

      const result =
        await apiRequest<BackupActionResponse>(
          '/backups',
          'POST',
        )

      if (!result.accepted) {
        throw new Error(
          result.message ??
            'Não foi possível iniciar o backup',
        )
      }

      await loadBackupStatus()
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : 'Erro ao criar backup',
      )

      setBackupLoading(false)
    }
  }

  async function downloadBackup(
    backup: Backup,
  ) {
    try {
      setDownloadingBackup(
        backup.name,
      )

      onError(null)

      const data =
        await apiRequest<BackupDownloadResponse>(
          `/backups/${encodeURIComponent(
            backup.name,
          )}/download`,
        )

      if (!data.url) {
        throw new Error(
          'URL de download não recebida',
        )
      }

      window.location.href =
        data.url
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : 'Erro ao baixar backup',
      )
    } finally {
      setDownloadingBackup(null)
    }
  }

  async function deleteBackup() {
    if (!backupToDelete) {
      return
    }

    try {
      setDeletingBackup(true)
      onError(null)

      await apiRequest(
        `/backups/${encodeURIComponent(
          backupToDelete.name,
        )}`,
        'DELETE',
      )

      setBackupToDelete(null)

      await loadBackups()
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir backup',
      )
    } finally {
      setDeletingBackup(false)
    }
  }

  const loadInitialData =
    useCallback(async () => {
      await Promise.all([
        loadBackups(),
        loadBackupStatus(),
      ])
    }, [
      loadBackups,
      loadBackupStatus,
    ])

  useInitialLoad(
    loadInitialData,
    enabled,
  )

  useEffect(() => {
    if (!backupStatus?.running) {
      return
    }

    const interval =
      window.setInterval(
        async () => {
          const current =
            await loadBackupStatus()

          if (
            current &&
            !current.running
          ) {
            setBackupLoading(false)

            if (
              current.lastSuccess
            ) {
              await loadBackups()
            }
          }
        },
        2000,
      )

    return () => {
      window.clearInterval(
        interval,
      )
    }
  }, [
    backupStatus?.running,
    loadBackupStatus,
    loadBackups,
  ])

  return {
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
  }
}
