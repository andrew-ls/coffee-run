import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('forwards value and onChange', () => {
    const onChange = vi.fn()
    render(<Input value="hello" onChange={onChange} readOnly />)
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })

  it('fires onChange when value changes', () => {
    const onChange = vi.fn()
    render(<Input defaultValue="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new' } })
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('forwards placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('forwards type prop', () => {
    render(<Input type="number" />)
    const input = document.querySelector('input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('forwards disabled prop', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
