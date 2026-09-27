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

export function useOperators() {
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
    }, [])

  const addOperator =
    useCallback(
      async (
        name: string,
        permissionLevel = 4,
        bypassesPlayerLimit = false,
      ) => {
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
      [],
    )

  const removeOperator =
    useCallback(
      async (
        operator:
          MinecraftOperator,
      ) => {
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
      [],
    )

  useInitialLoad(loadOperators)

  return {
    operators,
    operatorsLoading,
    operatorsActionLoading,
    operatorsError,

    loadOperators,
    addOperator,
    removeOperator,
  }
}
