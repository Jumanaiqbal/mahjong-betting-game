import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GameOverScreen from './GameOverScreen'

describe('GameOverScreen', () => {
  it('shows final score summary and actions', () => {
    vi.useFakeTimers()
    const state = {
      score: 42,
      playerName: 'Jumana',
      roundsPlayed: 8,
      reshuffleCount: 2,
    }

    render(<GameOverScreen state={state} onSave={() => {}} onExit={() => {}} />)

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByText(/game over/i)).toBeInTheDocument()
    expect(screen.getByText(/final score/i)).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save score/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /exit/i })).toBeInTheDocument()

    vi.useRealTimers()
  })
})
