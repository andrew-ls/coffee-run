import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { PageTransition } from './PageTransition'

describe('PageTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders children without animation class on initial mount', () => {
    const { container } = render(
      <PageTransition contentKey="landing" direction="forward">
        <div>Landing</div>
      </PageTransition>,
    )
    expect(container.textContent).toContain('Landing')
    const pages = container.querySelectorAll('.page')
    expect(pages).toHaveLength(1)
    expect(pages[0].className).not.toContain('enterForward')
    expect(pages[0].className).not.toContain('enterBack')
  })

  it('renders both exiting and entering content while transitioning', () => {
    const { rerender, container } = render(
      <PageTransition contentKey="landing" direction="forward">
        <div>Landing</div>
      </PageTransition>,
    )

    rerender(
      <PageTransition contentKey="add" direction="forward">
        <div>Add</div>
      </PageTransition>,
    )

    expect(container.textContent).toContain('Landing')
    expect(container.textContent).toContain('Add')
  })

  it('applies enterForward and exitForward classes on forward transition', () => {
    const { rerender, container } = render(
      <PageTransition contentKey="landing" direction="forward">
        <div>Landing</div>
      </PageTransition>,
    )

    rerender(
      <PageTransition contentKey="add" direction="forward">
        <div>Add</div>
      </PageTransition>,
    )

    const pages = container.querySelectorAll('.page')
    expect(pages[0].className).toContain('exitForward')
    expect(pages[1].className).toContain('enterForward')
  })

  it('applies enterBack and exitBack classes on back transition', () => {
    const { rerender, container } = render(
      <PageTransition contentKey="add" direction="forward">
        <div>Add</div>
      </PageTransition>,
    )

    rerender(
      <PageTransition contentKey="landing" direction="back">
        <div>Landing</div>
      </PageTransition>,
    )

    const pages = container.querySelectorAll('.page')
    expect(pages[0].className).toContain('exitBack')
    expect(pages[1].className).toContain('enterBack')
  })

  it('removes exiting content after 250ms', () => {
    const { rerender, container } = render(
      <PageTransition contentKey="landing" direction="forward">
        <div>Landing</div>
      </PageTransition>,
    )

    rerender(
      <PageTransition contentKey="add" direction="forward">
        <div>Add</div>
      </PageTransition>,
    )

    expect(container.textContent).toContain('Landing')
    expect(container.textContent).toContain('Add')

    act(() => {
      vi.advanceTimersByTime(250)
    })

    expect(container.textContent).not.toContain('Landing')
    expect(container.textContent).toContain('Add')
  })

  it('does not remove entering content before 250ms elapses', () => {
    const { rerender, container } = render(
      <PageTransition contentKey="landing" direction="forward">
        <div>Landing</div>
      </PageTransition>,
    )

    rerender(
      <PageTransition contentKey="add" direction="forward">
        <div>Add</div>
      </PageTransition>,
    )

    act(() => {
      vi.advanceTimersByTime(249)
    })

    expect(container.textContent).toContain('Landing')
    expect(container.textContent).toContain('Add')
  })

  it('replaces exiting content on rapid successive navigation', () => {
    const { rerender, container } = render(
      <PageTransition contentKey="landing" direction="forward">
        <div>Landing</div>
      </PageTransition>,
    )

    rerender(
      <PageTransition contentKey="add" direction="forward">
        <div>Add</div>
      </PageTransition>,
    )

    rerender(
      <PageTransition contentKey="form" direction="forward">
        <div>Form</div>
      </PageTransition>,
    )

    expect(container.textContent).toContain('Add')
    expect(container.textContent).toContain('Form')
    expect(container.textContent).not.toContain('Landing')

    act(() => {
      vi.advanceTimersByTime(250)
    })

    expect(container.textContent).not.toContain('Add')
    expect(container.textContent).toContain('Form')
  })
})
