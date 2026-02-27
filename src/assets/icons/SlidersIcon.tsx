import type { SVGProps } from 'react'

export function SlidersIcon({ width = 16, height = 16, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      {...props}
    >
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="12" x2="14" y2="12" />
      <circle cx="10" cy="4" r="2" stroke="currentColor" fill="var(--color-bg-card)" />
      <circle cx="5" cy="8" r="2" stroke="currentColor" fill="var(--color-bg-card)" />
      <circle cx="11" cy="12" r="2" stroke="currentColor" fill="var(--color-bg-card)" />
    </svg>
  )
}
