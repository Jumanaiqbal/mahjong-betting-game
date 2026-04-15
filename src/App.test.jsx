import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('assessment UI requirements', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows clear new game entry on landing', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
    expect(screen.getByText(/top scores/i)).toBeInTheDocument()
  })

  it('supports navigation, betting controls, pile counts, hand total, and history', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/your name/i), 'Jumana')
    await user.click(screen.getByRole('button', { name: /new game/i }))

    expect(screen.getByText(/draw pile/i)).toBeInTheDocument()
    expect(screen.getByText(/discard pile/i)).toBeInTheDocument()
    expect(screen.getByText(/hand total/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bet higher/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bet lower/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /exit game/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /bet higher/i }))
    await waitFor(() => {
      expect(screen.getByText(/recent 1/i)).toBeInTheDocument()
    })
  })

  it('allows exiting a running game back to landing', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/your name/i), 'Jumana')
    await user.click(screen.getByRole('button', { name: /new game/i }))
    await user.click(screen.getByRole('button', { name: /exit game/i }))

    expect(screen.getByText(/enter your name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
  })
})
