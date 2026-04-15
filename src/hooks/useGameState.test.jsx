import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HAND_SIZE, MAX_RESHUFFLE, MAX_TILE_VALUE, MIN_TILE_VALUE } from '../constants/game'
import useGameState from './useGameState'

describe('useGameState requirements', () => {
  it('starts game with a full opening hand', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.startGame('Player One')
    })

    expect(result.current.state.screen).toBe('playing')
    expect(result.current.state.currentHand).toHaveLength(HAND_SIZE)
  })

  it('keeps hand size full while playing rounds', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.startGame('Player One')
    })

    for (let i = 0; i < 20; i += 1) {
      if (result.current.state.screen !== 'playing') break
      act(() => {
        result.current.placeBet(i % 2 === 0 ? 'higher' : 'lower')
      })
      if (result.current.state.screen === 'playing') {
        expect(result.current.state.currentHand).toHaveLength(HAND_SIZE)
      }
    }
  })

  it('eventually ends the game using a valid game-over condition', () => {
    const { result } = renderHook(() => useGameState())

    act(() => {
      result.current.startGame('Player One')
    })

    let safety = 0
    while (result.current.state.screen === 'playing' && safety < 250) {
      act(() => {
        result.current.placeBet(safety % 2 === 0 ? 'higher' : 'lower')
      })
      safety += 1
    }

    const hasTileBoundary = Object.values(result.current.state.tileValueMap).some(
      (value) => value <= MIN_TILE_VALUE || value >= MAX_TILE_VALUE
    )
    const reachedDeckLimit = result.current.state.reshuffleCount >= MAX_RESHUFFLE

    expect(result.current.state.screen).toBe('gameover')
    expect(hasTileBoundary || reachedDeckLimit).toBe(true)
  })
})
