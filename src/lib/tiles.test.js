import { describe, expect, it } from 'vitest'
import { createDeck } from './tiles'

describe('tiles', () => {
  it('creates a full deck with 34 unique tile ids', () => {
    const deck = createDeck()
    const ids = deck.map((tile) => tile.id)
    const uniqueIds = new Set(ids)

    expect(deck).toHaveLength(34)
    expect(uniqueIds.size).toBe(34)
  })

  it('includes number, dragon, and wind tile categories', () => {
    const deck = createDeck()
    const numberCount = deck.filter((tile) => tile.type === 'number').length
    const dragonCount = deck.filter((tile) => tile.type === 'dragon').length
    const windCount = deck.filter((tile) => tile.type === 'wind').length

    expect(numberCount).toBe(27)
    expect(dragonCount).toBe(3)
    expect(windCount).toBe(4)
  })

  it('sets number tile values to face value and honor tiles to 5', () => {
    const deck = createDeck()
    const numberTiles = deck.filter((tile) => tile.type === 'number')
    const honorTiles = deck.filter((tile) => tile.type !== 'number')

    expect(numberTiles.every((tile) => {
      const faceValue = Number(tile.name.split(' ')[0])
      return tile.value === faceValue
    })).toBe(true)
    expect(honorTiles.every((tile) => tile.value === 5)).toBe(true)
  })
})
