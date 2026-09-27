import {
  useCallback,
  useState,
} from 'react'

import { apiRequest } from '../services/api'
import { useInitialLoad } from './useInitialLoad'

import type {
  CostData,
} from '../types/dashboard'

export function useCost() {
  const [cost, setCost] =
    useState<CostData | null>(null)

  const [
    costLoading,
    setCostLoading,
  ] = useState(true)

  const [
    costError,
    setCostError,
  ] =
    useState<string | null>(null)

  const loadCost =
    useCallback(async () => {
      try {
        setCostLoading(true)
        setCostError(null)

        const data =
          await apiRequest<CostData>(
            '/cost',
          )

        setCost(data)

        return data
      } catch (error) {
        console.error(
          'Erro ao carregar custos:',
          error,
        )

        setCostError(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar custos',
        )

        return null
      } finally {
        setCostLoading(false)
      }
    }, [])

  useInitialLoad(loadCost)

  return {
    cost,
    costLoading,
    costError,
    refreshCost: loadCost,
  }
}
