import {
  useCallback,
  useState,
} from 'react'

import { apiRequest } from '../services/api'
import { useInitialLoad } from './useInitialLoad'

import type {
  LogLineLimit,
  MinecraftLogs,
} from '../types/dashboard'

type UseLogsOptions = {
  enabled?: boolean
}

export function useLogs({
  enabled = true,
}: UseLogsOptions = {}) {
  const [
    logs,
    setLogs,
  ] =
    useState<MinecraftLogs | null>(null)

  const [
    logsLoading,
    setLogsLoading,
  ] = useState(true)

  const [
    logsError,
    setLogsError,
  ] =
    useState<string | null>(null)

  const [
    lineLimit,
    setLineLimit,
  ] =
    useState<LogLineLimit>(100)

  const loadLogs =
    useCallback(
      async (
        limit:
          LogLineLimit =
            lineLimit,
      ) => {
        if (!enabled) {
          setLogsLoading(false)
          setLogsError(null)
          return null
        }

        try {
          setLogsLoading(true)
          setLogsError(null)

          const data =
            await apiRequest<MinecraftLogs>(
              `/logs?lines=${limit}`,
            )

          setLogs(data)

          return data
        } catch (error) {
          console.error(
            'Erro ao carregar logs:',
            error,
          )

          setLogsError(
            error instanceof Error
              ? error.message
              : 'Erro ao carregar logs',
          )

          return null
        } finally {
          setLogsLoading(false)
        }
      },
      [enabled, lineLimit],
    )

  useInitialLoad(loadLogs, enabled)

  const changeLineLimit =
    useCallback(
      (
        limit:
          LogLineLimit,
      ) => {
        setLineLimit(limit)
      },
      [],
    )

  return {
    logs,
    logsLoading: enabled && logsLoading,
    logsError: enabled ? logsError : null,
    lineLimit,

    loadLogs,
    changeLineLimit,
  }
}
