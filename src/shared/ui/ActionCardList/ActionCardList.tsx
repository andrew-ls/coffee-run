import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { DragBindings } from '@/shared/ui/ActionCard'
import styles from './ActionCardList.module.css'

export interface ActionCardListProps<T extends { id: string }> {
  items: T[]
  onReorder: (reordered: T[]) => void
  renderItem: (item: T, drag: DragBindings) => React.ReactNode
  renderOverlay?: (item: T) => React.ReactNode
}

interface SortableItemProps<T extends { id: string }> {
  item: T
  renderItem: (item: T, drag: DragBindings) => React.ReactNode
}

function SortableItem<T extends { id: string }>({ item, renderItem }: SortableItemProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const drag: DragBindings = {
    ref: setNodeRef,
    listeners: { ...attributes, ...listeners },
    style: { transform: CSS.Transform.toString(transform), transition: transition ?? undefined },
    isDragging,
  }

  return <>{renderItem(item, drag)}</>
}

export function ActionCardList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  renderOverlay,
}: ActionCardListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  )

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return

    const fromIndex = items.findIndex((item) => item.id === active.id)
    const toIndex = items.findIndex((item) => item.id === over.id)
    if (fromIndex !== -1 && toIndex !== -1) {
      onReorder(arrayMove(items, fromIndex, toIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={styles.list}>
          {items.map((item) => (
            <SortableItem key={item.id} item={item} renderItem={renderItem} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeItem ? (
          <div className={styles.overlay}>
            {renderOverlay
              ? renderOverlay(activeItem)
              : renderItem(activeItem, {
                  ref: () => {},
                  listeners: {},
                  style: {},
                  isDragging: false,
                })}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
