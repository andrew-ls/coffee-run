import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DualPanelLayout } from './DualPanelLayout'
import { SidebarContext } from '@/contexts/SidebarContext'

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

  it('renders sidebarBottom slot content', () => {
    render(
      <SidebarContext.Provider value={{ sidebarActive: true, setSidebarActive: vi.fn() }}>
        <DualPanelLayout
          header={<div>Header</div>}
          sidebar={<div>Sidebar</div>}
          sidebarBottom={<div>Sidebar Bar</div>}
        >
          <div>Main</div>
        </DualPanelLayout>
      </SidebarContext.Provider>,
    )
    expect(screen.getByText('Sidebar Bar')).toBeInTheDocument()
  })

  it('renders mainBottom slot content', () => {
    render(
      <SidebarContext.Provider value={{ sidebarActive: true, setSidebarActive: vi.fn() }}>
        <DualPanelLayout
          header={<div>Header</div>}
          sidebar={<div>Sidebar</div>}
          mainBottom={<div>Main Bar</div>}
        >
          <div>Main</div>
        </DualPanelLayout>
      </SidebarContext.Provider>,
    )
    expect(screen.getByText('Main Bar')).toBeInTheDocument()
  })

  it('applies sidebarHidden class when sidebarActive is false', () => {
    const { container } = render(
      <SidebarContext.Provider value={{ sidebarActive: false, setSidebarActive: vi.fn() }}>
        <DualPanelLayout header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
          <div>Main</div>
        </DualPanelLayout>
      </SidebarContext.Provider>,
    )
    expect(container.querySelector('.sidebar')).toHaveClass('sidebarHidden')
  })

  it('does not apply sidebarHidden class when sidebarActive is true', () => {
    const { container } = render(
      <SidebarContext.Provider value={{ sidebarActive: true, setSidebarActive: vi.fn() }}>
        <DualPanelLayout header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
          <div>Main</div>
        </DualPanelLayout>
      </SidebarContext.Provider>,
    )
    expect(container.querySelector('.sidebar')).not.toHaveClass('sidebarHidden')
  })

  it('applies mainHidden class when sidebarActive is true', () => {
    const { container } = render(
      <SidebarContext.Provider value={{ sidebarActive: true, setSidebarActive: vi.fn() }}>
        <DualPanelLayout header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
          <div>Main</div>
        </DualPanelLayout>
      </SidebarContext.Provider>,
    )
    expect(container.querySelector('.main')).toHaveClass('mainHidden')
  })

  it('does not apply mainHidden class when sidebarActive is false', () => {
    const { container } = render(
      <SidebarContext.Provider value={{ sidebarActive: false, setSidebarActive: vi.fn() }}>
        <DualPanelLayout header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
          <div>Main</div>
        </DualPanelLayout>
      </SidebarContext.Provider>,
    )
    expect(container.querySelector('.main')).not.toHaveClass('mainHidden')
  })
})
