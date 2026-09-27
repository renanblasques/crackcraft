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

export function useLogs() {
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
      [lineLimit],
    )

  useInitialLoad(loadLogs)

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
    logsLoading,
    logsError,
    lineLimit,

    loadLogs,
    changeLineLimit,
  }
}
