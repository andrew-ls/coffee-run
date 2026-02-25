import { describe, it, expect, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { Mascot } from './Mascot'

describe('Mascot', () => {
  it('renders without crashing', () => {
    const { container } = render(<Mascot orderCount={0} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the SVG', () => {
    const { container } = render(<Mascot orderCount={0} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders message when provided', () => {
    const { getByText } = render(<Mascot orderCount={0} message="Hello there!" />)
    expect(getByText('Hello there!')).toBeInTheDocument()
  })

  it('does not render message when not provided', () => {
    const { queryByText } = render(<Mascot orderCount={0} />)
    expect(queryByText('Hello there!')).not.toBeInTheDocument()
  })

  describe('moods', () => {
    it('neutral mood at count 0 — straight mouth line', () => {
      const { container } = render(<Mascot orderCount={0} />)
      // neutral: <line> for mouth
      expect(container.querySelector('line')).toBeInTheDocument()
    })

    it('happy mood at count 1 — smile path, no "x" eyes', () => {
      const { container } = render(<Mascot orderCount={1} />)
      // happy: no text "x" eyes
      const texts = container.querySelectorAll('text')
      expect(texts).toHaveLength(0)
    })

    it('happy mood at count 4', () => {
      const { container } = render(<Mascot orderCount={4} />)
      const texts = container.querySelectorAll('text')
      expect(texts).toHaveLength(0)
    })

    it('overwhelmed mood at count 5 — "x" eyes rendered', () => {
      const { container } = render(<Mascot orderCount={5} />)
      const texts = container.querySelectorAll('text')
      // Two "x" eyes rendered as <text> elements
      expect(texts).toHaveLength(2)
    })

    it('steam is visible for neutral mood', () => {
      const { container } = render(<Mascot orderCount={0} />)
      // steam paths have opacity="0.5"
      const steamPaths = Array.from(container.querySelectorAll('path')).filter(
        (p) => p.getAttribute('opacity') === '0.5',
      )
      expect(steamPaths.length).toBeGreaterThan(0)
    })

    it('steam is hidden for overwhelmed mood', () => {
      const { container } = render(<Mascot orderCount={5} />)
      const steamPaths = Array.from(container.querySelectorAll('path')).filter(
        (p) => p.getAttribute('opacity') === '0.5',
      )
      expect(steamPaths).toHaveLength(0)
    })
  })

  describe('wobble animation', () => {
    it('adds wobble class when mood changes', () => {
      vi.useFakeTimers()
      const { container, rerender } = render(<Mascot orderCount={0} />)
      const getCupDiv = () => container.querySelector('svg')?.parentElement

      rerender(<Mascot orderCount={1} />)
      expect(getCupDiv()?.className).toContain('wobble')

      vi.useRealTimers()
    })

    it('removes wobble class after 600ms', () => {
      vi.useFakeTimers()
      const { container, rerender } = render(<Mascot orderCount={0} />)
      const getCupDiv = () => container.querySelector('svg')?.parentElement

      rerender(<Mascot orderCount={1} />)
      expect(getCupDiv()?.className).toContain('wobble')

      act(() => {
        vi.advanceTimersByTime(600)
      })
      expect(getCupDiv()?.className).not.toContain('wobble')

      vi.useRealTimers()
    })

    it('does not add wobble when mood does not change', () => {
      vi.useFakeTimers()
      const { container, rerender } = render(<Mascot orderCount={1} />)
      const getCupDiv = () => container.querySelector('svg')?.parentElement

      rerender(<Mascot orderCount={2} />)
      // count 1 and 2 are both 'happy' — same mood, no wobble
      expect(getCupDiv()?.className).not.toContain('wobble')

      vi.useRealTimers()
    })
  })
})
