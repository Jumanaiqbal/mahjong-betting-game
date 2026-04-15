import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LandingScreen from './LandingScreen'

describe('LandingScreen', () => {
  it('renders only top 5 leaderboard entries', () => {
    const leaderboard = [
      { playerName: 'A', score: 100, date: '2026-01-01' },
      { playerName: 'B', score: 90, date: '2026-01-01' },
      { playerName: 'C', score: 80, date: '2026-01-01' },
      { playerName: 'D', score: 70, date: '2026-01-01' },
      { playerName: 'E', score: 60, date: '2026-01-01' },
      { playerName: 'F', score: 50, date: '2026-01-01' },
    ]

    render(<LandingScreen onStart={() => {}} leaderboard={leaderboard} />)

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('E')).toBeInTheDocument()
    expect(screen.queryByText('F')).not.toBeInTheDocument()
  })
})
