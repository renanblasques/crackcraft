import type {
  HTMLAttributes,
  ReactNode,
} from 'react'

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
}

export function Badge({
  children,
  className,
  ...props
}: Props) {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  )
}
