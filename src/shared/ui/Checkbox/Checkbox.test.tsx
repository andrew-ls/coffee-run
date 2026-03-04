import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders a checkbox input', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders the label text', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
  })

  it('checkbox is checked when checked prop is true', () => {
    render(<Checkbox label="Checked" checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('checkbox is not checked when checked prop is false', () => {
    render(<Checkbox label="Unchecked" checked={false} onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('fires onChange when clicked', () => {
    const onChange = vi.fn()
    render(<Checkbox label="Toggle" onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('renders input with type checkbox', () => {
    render(<Checkbox label="Type check" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('type', 'checkbox')
  })
})
