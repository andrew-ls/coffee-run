import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DualPanelLayout } from './DualPanelLayout'

describe('DualPanelLayout', () => {
  it('renders the header', () => {
    render(
      <DualPanelLayout header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('renders the sidebar', () => {
    render(
      <DualPanelLayout header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
  })

  it('renders the main panel children', () => {
    render(
      <DualPanelLayout header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main content</div>
      </DualPanelLayout>,
    )
    expect(screen.getByText('Main content')).toBeInTheDocument()
  })

  it('renders null children without crashing', () => {
    const { container } = render(
      <DualPanelLayout header={null} sidebar={<div>Sidebar</div>}>
        {null}
      </DualPanelLayout>,
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
