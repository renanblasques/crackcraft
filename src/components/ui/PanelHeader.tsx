import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle: string
  action?: ReactNode
  className?: string
}

export function PanelHeader({
  title,
  subtitle,
  action,
  className,
}: Props) {
  return (
    <div
      className={['panel-title', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {action}
    </div>
  )
}
