import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BottomAppBar } from './BottomAppBar'

describe('BottomAppBar', () => {
  it('renders left slot content', () => {
    render(<BottomAppBar left={<button>End Run</button>} />)
    expect(screen.getByText('End Run')).toBeInTheDocument()
  })

  it('renders right slot content', () => {
    render(<BottomAppBar right={<button>Add Order</button>} />)
    expect(screen.getByText('Add Order')).toBeInTheDocument()
  })
})

