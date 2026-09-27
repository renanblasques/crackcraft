import {
  useCallback,
  useState,
} from 'react'

import { apiRequest } from '../services/api'
import { useInitialLoad } from './useInitialLoad'

import type {
  MinecraftOperator,
  OperatorsData,
  OperatorsMutationResult,
} from '../types/dashboard'

type UseOperatorsOptions = {
  enabled?: boolean
}

export function useOperators({
  enabled = true,
}: UseOperatorsOptions = {}) {
  const [
    operators,
    setOperators,
  ] =
    useState<OperatorsData | null>(null)

  const [
    operatorsLoading,
    setOperatorsLoading,
  ] = useState(true)

  const [
    operatorsActionLoading,
    setOperatorsActionLoading,
  ] = useState(false)

  const [
    operatorsError,
    setOperatorsError,
  ] =
    useState<string | null>(null)

  const loadOperators =
    useCallback(async () => {
      if (!enabled) {
        setOperatorsLoading(false)
        setOperatorsError(null)
        return null
      }

      try {
        setOperatorsLoading(true)
        setOperatorsError(null)

        const data =
          await apiRequest<OperatorsData>(
            '/operators',
          )

        setOperators(data)

        return data
      } catch (error) {
        console.error(
          'Erro ao carregar operadores:',
          error,
        )

        setOperatorsError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar operadores',
        )

        return null
      } finally {
        setOperatorsLoading(false)
      }
    }, [enabled])

  const addOperator =
    useCallback(
      async (
        name: string,
        permissionLevel = 4,
        bypassesPlayerLimit = false,
      ) => {
        if (!enabled) {
          return
        }

        try {
          setOperatorsActionLoading(
            true,
          )

          setOperatorsError(null)

          const result =
            await apiRequest<OperatorsMutationResult>(
              '/operators',
              'POST',
              {
                name:
                  name.trim(),

                permissionLevel,

                bypassesPlayerLimit,
              },
            )

          setOperators(
            (current) => {
              if (!current) {
                return current
              }

              return {
                ...current,

                operators:
                  result.operators,

                operatorCount:
                  result.operatorCount,
              }
            },
          )

          return result
        } catch (error) {
          console.error(
            'Erro ao adicionar operador:',
            error,
          )

          setOperatorsError(
            error instanceof Error
              ? error.message
              : 'Erro ao adicionar operador',
          )

          throw error
        } finally {
          setOperatorsActionLoading(
            false,
          )
        }
      },
      [enabled],
    )

  const removeOperator =
    useCallback(
      async (
        operator:
          MinecraftOperator,
      ) => {
        if (!enabled) {
          return
        }

        try {
          setOperatorsActionLoading(
            true,
          )

          setOperatorsError(null)

          const result =
            await apiRequest<OperatorsMutationResult>(
              '/operators',
              'DELETE',
              {
                id:
                  operator.player.id,

                name:
                  operator.player.name,
              },
            )

          setOperators(
            (current) => {
              if (!current) {
                return current
              }

              return {
                ...current,

                operators:
                  result.operators,

                operatorCount:
                  result.operatorCount,
              }
            },
          )

          return result
        } catch (error) {
          console.error(
            'Erro ao remover operador:',
            error,
          )

          setOperatorsError(
            error instanceof Error
              ? error.message
              : 'Erro ao remover operador',
          )

          throw error
        } finally {
          setOperatorsActionLoading(
            false,
          )
        }
      },
      [enabled],
    )

  useInitialLoad(loadOperators, enabled)

  return {
    operators,
    operatorsLoading: enabled && operatorsLoading,
    operatorsActionLoading:
      enabled && operatorsActionLoading,
    operatorsError:
      enabled ? operatorsError : null,

    loadOperators,
    addOperator,
    removeOperator,
  }
}
