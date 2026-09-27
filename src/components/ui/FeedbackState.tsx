import type { ReactNode } from 'react'

type Props = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function FeedbackState({
  icon,
  title,
  description,
  action,
  className = 'empty-state',
}: Props) {
  return (
    <div className={className}>
      {icon}
      <strong>{title}</strong>
      {description && <span>{description}</span>}
      {action}
    </div>
  )
}
