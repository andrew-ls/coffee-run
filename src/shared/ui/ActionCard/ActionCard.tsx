import { useRef, type ReactNode } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import { DragHandle } from '@/shared/ui/DragHandle'
import type { Action } from './Action'
import { useSwipe } from './useSwipe'
import styles from './ActionCard.module.css'

export interface DragBindings {
  ref: (node: HTMLElement | null) => void
  listeners: React.HTMLAttributes<HTMLElement>
  style: React.CSSProperties
  isDragging: boolean
}

interface ActionCardProps {
  actions: Action[]
  drag?: DragBindings
  entering?: boolean
  className?: string
  children: ReactNode
}

export function ActionCard({ actions, drag, entering, className, children }: ActionCardProps) {
  const destructiveActions = actions.filter((a) => a.destructive)
  const nonDestructiveActions = actions.filter((a) => !a.destructive)

  const leftZoneRef = useRef<HTMLDivElement>(null)
  const rightZoneRef = useRef<HTMLDivElement>(null)

  const { swipeStyle, swipeDirection, touchHandlers } = useSwipe({
    enableRightSwipe: nonDestructiveActions.length > 0,
    snapLeftRef: leftZoneRef,
    snapRightRef: rightZoneRef,
  })

  const isDragging = drag?.isDragging ?? false

  const cardClasses = [
    styles.card,
    isDragging ? styles.dragging : '',
    entering ? styles.entering : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={drag?.ref} style={drag?.style} className={styles.wrapper}>
      {nonDestructiveActions.length > 0 && (
        <div
          ref={rightZoneRef}
          className={styles.rightZone}
          style={{ zIndex: swipeDirection === 'right' ? 1 : 0 }}
        >
          <div className={styles.zoneContent}>
            {nonDestructiveActions.map((action) => (
              <button key={action.name} className={styles.zoneButton} onClick={action.callback}>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {destructiveActions.length > 0 && (
        <div
          ref={leftZoneRef}
          className={styles.leftZone}
          style={{ zIndex: swipeDirection === 'left' ? 1 : 0 }}
        >
          <div className={styles.zoneContent}>
            {destructiveActions.map((action) => (
              <button key={action.name} className={styles.zoneButton} onClick={action.callback}>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={cardClasses} style={swipeStyle} {...touchHandlers}>
        {drag && <DragHandle {...drag.listeners} />}
        <div className={styles.content}>{children}</div>
        {actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action) => (
              <IconButton
                key={action.name}
                label={action.name}
                variant={action.color}
                onClick={action.callback}
              >
                <action.icon aria-hidden="true" />
              </IconButton>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
