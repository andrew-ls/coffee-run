import type { SVGProps } from 'react'

export function UndoIcon({ width = 16, height = 16, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 6H10C12.2 6 14 7.8 14 10C14 12.2 12.2 14 10 14H6" />
      <path d="M5 3L2 6L5 9" />
    </svg>
  )
}
