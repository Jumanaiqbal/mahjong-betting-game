import { createDeck, shuffleDeck } from './tiles'

export const drawTiles = (drawPile, count = 3) => {
  const drawnTiles = drawPile.slice(0, count)
  const remaining = drawPile.slice(count)
  
  return {
    drawnTiles,
    remaining
  }
}

export const discardHand = (discardPile, hand) => {
  return [...discardPile, ...hand]
}

// Requirement: add a fresh deck and combine with discard before shuffling.
export const reshuffle = (discardPile) => {
  const freshDeck = createDeck()
  return shuffleDeck([...discardPile, ...freshDeck])
}

export const needsReshuffle = (drawPile) => {
  return drawPile.length === 0
}

export const updateTileValues = (tiles, hand, playerWon) => {
  return tiles.map(tile => {
    if (tile.type === 'number') return tile

    const wasInHand = hand.find(t => t.id === tile.id)
    if (!wasInHand) return tile

    const newValue = playerWon 
      ? tile.value + 1
      : tile.value - 1

    return { ...tile, value: newValue }
  })
}

export const checkTileGameOver = (tiles) => {
  return tiles.some(tile => tile.value <= 0 || tile.value >= 10)
}