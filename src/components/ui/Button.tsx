import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type Variant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'restore'

const variantClasses: Record<Variant, string> = {
  primary: 'primary-button',
  secondary: 'secondary-button',
  danger: 'danger-button',
  restore: 'restore-button',
}

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    children: ReactNode
  }

export function Button({
  variant = 'secondary',
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={[
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
