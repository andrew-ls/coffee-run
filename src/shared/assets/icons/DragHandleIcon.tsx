import type { SVGProps } from 'react'

export function DragHandleIcon({ width = 14, height = 20, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width={width} height={height} viewBox="0 0 14 20" fill="currentColor" {...props}>
      <circle cx="4" cy="4" r="2" />
      <circle cx="10" cy="4" r="2" />
      <circle cx="4" cy="10" r="2" />
      <circle cx="10" cy="10" r="2" />
      <circle cx="4" cy="16" r="2" />
      <circle cx="10" cy="16" r="2" />
    </svg>
  )
}
