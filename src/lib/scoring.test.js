import { beforeEach, describe, expect, it } from 'vitest'
import {
  calculateFinalScore,
  calculateHandTotal,
  calculatePoints,
  checkBetResult,
  checkTie,
  getLeaderboard,
  saveToLeaderboard,
} from './scoring'

const createStorageMock = () => {
  const store = {}
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value)
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key])
    },
  }
}

describe('scoring helpers', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createStorageMock(),
      configurable: true,
    })
  })

  it('calculateHandTotal sums tile values', () => {
    const hand = [{ value: 2 }, { value: 5 }, { value: 8 }]
    expect(calculateHandTotal(hand)).toBe(15)
  })

  it('checkBetResult validates higher/lower outcomes', () => {
    expect(checkBetResult('higher', 10, 12)).toBe(true)
    expect(checkBetResult('higher', 10, 8)).toBe(false)
    expect(checkBetResult('lower', 10, 8)).toBe(true)
    expect(checkBetResult('lower', 10, 12)).toBe(false)
  })

  it('calculatePoints awards hand total only for wins', () => {
    const hand = [{ value: 3 }, { value: 4 }, { value: 5 }]
    expect(calculatePoints(true, hand)).toBe(12)
    expect(calculatePoints(false, hand)).toBe(0)
  })

  it('checkTie returns true for equal totals', () => {
    expect(checkTie(12, 12)).toBe(true)
    expect(checkTie(12, 13)).toBe(false)
  })

  it('calculateFinalScore adds round bonus', () => {
    expect(calculateFinalScore(40, 5)).toBe(50)
  })

  it('saveToLeaderboard stores sorted top 5 scores', () => {
    saveToLeaderboard('A', 30)
    saveToLeaderboard('B', 10)
    saveToLeaderboard('C', 50)
    saveToLeaderboard('D', 40)
    saveToLeaderboard('E', 20)
    const leaderboard = saveToLeaderboard('F', 60)

    expect(leaderboard).toHaveLength(5)
    expect(leaderboard.map((entry) => entry.playerName)).toEqual(['F', 'C', 'D', 'A', 'E'])
    expect(getLeaderboard()).toHaveLength(5)
  })
})
