import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DualPanelLayout } from './DualPanelLayout'

describe('DualPanelLayout', () => {
  it('renders the header', () => {
    render(
      <DualPanelLayout sidebarActive={true} header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('renders the sidebar', () => {
    render(
      <DualPanelLayout sidebarActive={true} header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
  })

  it('renders the main panel children', () => {
    render(
      <DualPanelLayout sidebarActive={true} header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main content</div>
      </DualPanelLayout>,
    )
    expect(screen.getByText('Main content')).toBeInTheDocument()
  })

  it('renders null children without crashing', () => {
    const { container } = render(
      <DualPanelLayout sidebarActive={true} header={null} sidebar={<div>Sidebar</div>}>
        {null}
      </DualPanelLayout>,
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders sidebarBottom slot content', () => {
    render(
      <DualPanelLayout
        sidebarActive={true}
        header={<div>Header</div>}
        sidebar={<div>Sidebar</div>}
        sidebarBottom={<div>Sidebar Bar</div>}
      >
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(screen.getByText('Sidebar Bar')).toBeInTheDocument()
  })

  it('renders mainBottom slot content', () => {
    render(
      <DualPanelLayout
        sidebarActive={true}
        header={<div>Header</div>}
        sidebar={<div>Sidebar</div>}
        mainBottom={<div>Main Bar</div>}
      >
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(screen.getByText('Main Bar')).toBeInTheDocument()
  })

  it('hides the sidebar when sidebarActive is false', () => {
    const { getByText } = render(
      <DualPanelLayout sidebarActive={false} header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(getByText('Sidebar').closest('[data-hidden]')).toHaveAttribute('data-hidden', 'true')
  })

  it('does not hide the sidebar when sidebarActive is true', () => {
    const { getByText } = render(
      <DualPanelLayout sidebarActive={true} header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(getByText('Sidebar').closest('[data-hidden]')).toBeNull()
  })

  it('hides the main panel when sidebarActive is true', () => {
    const { getByText } = render(
      <DualPanelLayout sidebarActive={true} header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(getByText('Main').closest('[data-hidden]')).toHaveAttribute('data-hidden', 'true')
  })

  it('does not hide the main panel when sidebarActive is false', () => {
    const { getByText } = render(
      <DualPanelLayout sidebarActive={false} header={<div>Header</div>} sidebar={<div>Sidebar</div>}>
        <div>Main</div>
      </DualPanelLayout>,
    )
    expect(getByText('Main').closest('[data-hidden]')).toBeNull()
  })
})
