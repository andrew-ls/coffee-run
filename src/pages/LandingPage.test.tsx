import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LandingPage } from './LandingPage'

describe('LandingPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<LandingPage />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
