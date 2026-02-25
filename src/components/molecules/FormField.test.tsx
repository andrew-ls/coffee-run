import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from './FormField'

describe('FormField', () => {
  it('renders the label text', () => {
    render(
      <FormField label="Your name">
        <input />
      </FormField>,
    )
    expect(screen.getByText('Your name')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <FormField label="Field">
        <input data-testid="child-input" />
      </FormField>,
    )
    expect(screen.getByTestId('child-input')).toBeInTheDocument()
  })

  it('renders both label and child together', () => {
    const { container } = render(
      <FormField label="Email">
        <input type="email" />
      </FormField>,
    )
    expect(container.querySelector('span')?.textContent).toBe('Email')
    expect(container.querySelector('input')).toBeInTheDocument()
  })
})
