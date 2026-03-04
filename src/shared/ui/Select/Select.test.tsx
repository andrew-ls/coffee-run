import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Select } from './Select'

describe('Select', () => {
  it('renders a select element', () => {
    render(<Select options={[]} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders string options using value as label', () => {
    render(<Select options={['Apple', 'Banana', 'Cherry']} />)
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
  })

  it('renders object options using the label field', () => {
    const options = [
      { value: 'coffee', label: 'Coffee' },
      { value: 'tea', label: 'Tea' },
    ]
    render(<Select options={options} />)
    expect(screen.getByRole('option', { name: 'Coffee' })).toHaveValue('coffee')
    expect(screen.getByRole('option', { name: 'Tea' })).toHaveValue('tea')
  })

  it('renders placeholder as first disabled option', () => {
    render(<Select options={['a']} placeholder="Pick one..." />)
    const placeholder = screen.getByRole('option', { name: 'Pick one...' })
    expect(placeholder).toBeDisabled()
  })

  it('does not render placeholder option when not provided', () => {
    render(<Select options={['a']} />)
    expect(screen.queryByRole('option', { hidden: true })).not.toBeNull()
    // Just one option
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('forwards onChange', () => {
    const onChange = vi.fn()
    render(<Select options={['x']} onChange={onChange} />)
    const select = screen.getByRole('combobox')
    select.dispatchEvent(new Event('change', { bubbles: true }))
    expect(onChange).toHaveBeenCalled()
  })

  it('forwards value prop', () => {
    render(
      <Select
        options={['Oat', 'Soy']}
        value="Oat"
        onChange={() => {}}
      />,
    )
    expect(screen.getByRole('combobox')).toHaveValue('Oat')
  })
})
