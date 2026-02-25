import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SinglePanelLayout } from './SinglePanelLayout'

describe('SinglePanelLayout', () => {
  it('renders children', () => {
    render(
      <SinglePanelLayout header={null}>
        <div>Main content</div>
      </SinglePanelLayout>,
    )
    expect(screen.getByText('Main content')).toBeInTheDocument()
  })

  it('renders header when provided', () => {
    render(
      <SinglePanelLayout header={<header>My Header</header>}>
        <div>Content</div>
      </SinglePanelLayout>,
    )
    expect(screen.getByText('My Header')).toBeInTheDocument()
  })

  it('renders without header when null', () => {
    const { container } = render(
      <SinglePanelLayout header={null}>
        <div>Content</div>
      </SinglePanelLayout>,
    )
    expect(container.querySelector('header')).not.toBeInTheDocument()
  })

  it('wraps children in a main element', () => {
    const { container } = render(
      <SinglePanelLayout header={null}>
        <div>Content</div>
      </SinglePanelLayout>,
    )
    expect(container.querySelector('main')).toBeInTheDocument()
  })
})
