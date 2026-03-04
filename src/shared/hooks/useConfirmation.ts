import { useState, useCallback } from 'react'

interface UseConfirmationReturn {
  pendingId: string | null
  request: (id: string) => void
  confirm: () => void
  cancel: () => void
}

export function useConfirmation(onConfirm: (id: string) => void): UseConfirmationReturn {
  const [pendingId, setPendingId] = useState<string | null>(null)

  const request = useCallback((id: string) => {
    setPendingId(id)
  }, [])

  const confirm = useCallback(() => {
    if (pendingId !== null) {
      onConfirm(pendingId)
      setPendingId(null)
    }
  }, [pendingId, onConfirm])

  const cancel = useCallback(() => {
    setPendingId(null)
  }, [])

  return { pendingId, request, confirm, cancel }
}
