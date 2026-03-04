export type PillColor = { background: string; text: string }

export const ASPECT_COLORS = {
  iced: { background: '#E3F2FD', text: '#1565C0' },
  variant: { background: '#EDE7F6', text: '#4527A0' },
  milk: { background: '#FFF8E1', text: '#F57F17' },
  sweetener: { background: '#FCE4EC', text: '#AD1457' },
} as const

export type AspectCategory = keyof typeof ASPECT_COLORS
