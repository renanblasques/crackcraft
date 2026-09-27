import {
  useCallback,
  useEffect,
  useState,
} from 'react'

export type DashboardTab =
  | 'overview'
  | 'players'
  | 'server'
  | 'console'

export const dashboardTabs: DashboardTab[] = [
  'overview',
  'players',
  'server',
  'console',
]

function isDashboardTab(
  value: string,
): value is DashboardTab {
  return dashboardTabs.includes(
    value as DashboardTab,
  )
}

function getTabFromHash(): DashboardTab {
  const value =
    window.location.hash.replace('#', '')

  return isDashboardTab(value)
    ? value
    : 'overview'
}

export function useDashboardTabs() {
  const [activeTab, setActiveTab] =
    useState<DashboardTab>(getTabFromHash)

  const [visitedTabs, setVisitedTabs] =
    useState<Set<DashboardTab>>(
      () => new Set([getTabFromHash()]),
    )

  const applyLocation = useCallback(() => {
    const tab = getTabFromHash()

    setActiveTab(tab)
    setVisitedTabs(
      (current) => {
        if (current.has(tab)) {
          return current
        }

        return new Set(current).add(tab)
      },
    )
  }, [])

  useEffect(() => {
    const hash =
      window.location.hash.replace('#', '')

    if (!isDashboardTab(hash)) {
      window.history.replaceState(
        null,
        '',
        '#overview',
      )
    }

    window.addEventListener(
      'hashchange',
      applyLocation,
    )

    return () => {
      window.removeEventListener(
        'hashchange',
        applyLocation,
      )
    }
  }, [applyLocation])

  const selectTab = useCallback(
    (tab: DashboardTab) => {
      if (tab === activeTab) {
        return
      }

      window.location.hash = tab
    },
    [activeTab],
  )

  return {
    activeTab,
    visitedTabs,
    selectTab,
  }
}
