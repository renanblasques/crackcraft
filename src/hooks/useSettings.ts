import {
  useCallback,
  useState,
} from 'react'

import { apiRequest } from '../services/api'
import { useInitialLoad } from './useInitialLoad'

import type {
  ServerSettings,
  UpdateServerSettingsResponse,
} from '../types/dashboard'

type UseSettingsOptions = {
  enabled?: boolean
}

export function useSettings({
  enabled = true,
}: UseSettingsOptions = {}) {
  const [
    settings,
    setSettings,
  ] =
    useState<ServerSettings | null>(null)

  const [
    settingsLoading,
    setSettingsLoading,
  ] = useState(true)

  const [
    settingsSaving,
    setSettingsSaving,
  ] = useState(false)

  const [
    settingsError,
    setSettingsError,
  ] =
    useState<string | null>(null)

  const loadSettings =
    useCallback(async () => {
      if (!enabled) {
        setSettingsLoading(false)
        setSettingsError(null)
        return null
      }

      try {
        setSettingsLoading(true)
        setSettingsError(null)

        const data =
          await apiRequest<ServerSettings>(
            '/settings',
          )

        setSettings(data)

        return data
      } catch (error) {
        console.error(
          'Erro ao carregar configurações:',
          error,
        )

        setSettingsError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar configurações',
        )

        return null
      } finally {
        setSettingsLoading(false)
      }
    }, [enabled])

  const updateSettings =
    useCallback(
      async (
        changes:
          Partial<ServerSettings>,
      ) => {
        if (!enabled) {
          return
        }

        try {
          setSettingsSaving(true)
          setSettingsError(null)

          const result =
            await apiRequest<UpdateServerSettingsResponse>(
              '/settings',
              'POST',
              changes,
            )

          setSettings(
            result.settings,
          )

          return result
        } catch (error) {
          console.error(
            'Erro ao salvar configurações:',
            error,
          )

          setSettingsError(
            error instanceof Error
              ? error.message
              : 'Erro ao salvar configurações',
          )

          throw error
        } finally {
          setSettingsSaving(false)
        }
      },
      [enabled],
    )

  useInitialLoad(loadSettings, enabled)

  return {
    settings,
    settingsLoading: enabled && settingsLoading,
    settingsSaving: enabled && settingsSaving,
    settingsError:
      enabled ? settingsError : null,

    loadSettings,
    updateSettings,
  }
}
