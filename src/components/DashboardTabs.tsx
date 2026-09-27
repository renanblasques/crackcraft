import {
  BarChart3,
  ServerCog,
  TerminalSquare,
  Users,
} from 'lucide-react'

import {
  useRef,
  type KeyboardEvent,
} from 'react'

import type {
  DashboardTab,
} from '../hooks/useDashboardTabs'

import styles from './DashboardTabs.module.css'

const items: Array<{
  id: DashboardTab
  label: string
  icon: typeof BarChart3
}> = [
  {
    id: 'overview',
    label: 'Visão geral',
    icon: BarChart3,
  },
  {
    id: 'players',
    label: 'Jogadores',
    icon: Users,
  },
  {
    id: 'server',
    label: 'Servidor',
    icon: ServerCog,
  },
  {
    id: 'console',
    label: 'Console',
    icon: TerminalSquare,
  },
]

type Props = {
  activeTab: DashboardTab
  onChange: (tab: DashboardTab) => void
}

export function DashboardTabs({
  activeTab,
  onChange,
}: Props) {
  const tabRefs =
    useRef<Array<HTMLButtonElement | null>>(
      [],
    )

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % items.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex =
        (index - 1 + items.length) %
        items.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = items.length - 1
    }

    if (nextIndex === null) {
      return
    }

    event.preventDefault()

    const nextTab = items[nextIndex]
    onChange(nextTab.id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <nav
      className={styles.wrapper}
      aria-label="Áreas do painel"
    >
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Navegação do painel"
      >
        {items.map((item, index) => {
          const Icon = item.icon
          const active = item.id === activeTab

          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              id={`tab-${item.id}`}
              className={
                active
                  ? styles.active
                  : styles.tab
              }
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${item.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(item.id)}
              onKeyDown={(event) =>
                handleKeyDown(event, index)
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
