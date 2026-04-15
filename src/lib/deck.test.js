import { describe, expect, it } from 'vitest'
import {
  checkTileGameOver,
  discardHand,
  drawTiles,
  needsReshuffle,
  reshuffle,
  updateTileValues,
} from './deck'
import { createDeck } from './tiles'

describe('deck helpers', () => {
  it('drawTiles draws requested count and returns remaining pile', () => {
    const deck = createDeck()
    const { drawnTiles, remaining } = drawTiles(deck, 3)

    expect(drawnTiles).toHaveLength(3)
    expect(remaining).toHaveLength(deck.length - 3)
  })

  it('discardHand appends hand cards to discard pile', () => {
    const discardPile = [{ id: 'old-1' }]
    const hand = [{ id: 'new-1' }, { id: 'new-2' }]
    const nextDiscard = discardHand(discardPile, hand)

    expect(nextDiscard.map((tile) => tile.id)).toEqual(['old-1', 'new-1', 'new-2'])
  })

  it('needsReshuffle returns true only for empty draw pile', () => {
    expect(needsReshuffle([])).toBe(true)
    expect(needsReshuffle([{ id: 'tile-1' }])).toBe(false)
  })

  it('reshuffle combines discard pile with a fresh deck', () => {
    const discardPile = [{ id: 'custom-1', type: 'number', value: 1 }]
    const nextDrawPile = reshuffle(discardPile)
    const hasDiscardCard = nextDrawPile.some((tile) => tile.id === 'custom-1')

    expect(nextDrawPile).toHaveLength(35)
    expect(hasDiscardCard).toBe(true)
  })

  it('updateTileValues only updates honor tiles that were in hand', () => {
    const tiles = [
      { id: 'dragon-red', type: 'dragon', value: 5 },
      { id: 'wind-east', type: 'wind', value: 5 },
      { id: 'Bamboo-1', type: 'number', value: 1 },
    ]
    const hand = [{ id: 'dragon-red', type: 'dragon', value: 5 }]

    const wonRound = updateTileValues(tiles, hand, true)
    const lostRound = updateTileValues(tiles, hand, false)

    expect(wonRound.find((tile) => tile.id === 'dragon-red')?.value).toBe(6)
    expect(lostRound.find((tile) => tile.id === 'dragon-red')?.value).toBe(4)
    expect(wonRound.find((tile) => tile.id === 'wind-east')?.value).toBe(5)
    expect(wonRound.find((tile) => tile.id === 'Bamboo-1')?.value).toBe(1)
  })

  it('checkTileGameOver detects tile values at 0 or 10', () => {
    expect(checkTileGameOver([{ value: 1 }, { value: 0 }])).toBe(true)
    expect(checkTileGameOver([{ value: 9 }, { value: 10 }])).toBe(true)
    expect(checkTileGameOver([{ value: 1 }, { value: 9 }])).toBe(false)
  })
})
