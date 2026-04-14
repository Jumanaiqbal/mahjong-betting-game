import { shuffleDeck } from './tiles'

// Draw X tiles from the top of the pile
export const drawTiles = (drawPile, count = 3) => {
  const drawnTiles = drawPile.slice(0, count)   // take from top
  const remaining = drawPile.slice(count)        // rest of pile
  
  return {
    drawnTiles,   // tiles player gets
    remaining     // updated draw pile
  }
}

// Move hand to discard pile
export const discardHand = (discardPile, hand) => {
  return [...discardPile, ...hand]  // add hand to discard
}

// Reshuffle when draw pile is empty
// just shuffle discard pile back — same cards, new order!
export const reshuffle = (discardPile) => {
  return shuffleDeck([...discardPile])
}

// Check if draw pile needs reshuffling
export const needsReshuffle = (drawPile) => {
  return drawPile.length === 0
}

// Update tile values after win or loss
// only dragons and winds change value!
export const updateTileValues = (tiles, hand, playerWon) => {
  return tiles.map(tile => {
    // number tiles never change
    if (tile.type === 'number') return tile

    // was this tile in the hand?
    const wasInHand = hand.find(t => t.id === tile.id)
    if (!wasInHand) return tile  // not in hand, dont change

    // dragon/wind in hand → update value
    const newValue = playerWon 
      ? tile.value + 1   // win → increase
      : tile.value - 1   // lose → decrease

    return { ...tile, value: newValue }
  })
}

// Check if any tile hit 0 or 10 (game over condition)
export const checkTileGameOver = (tiles) => {
  return tiles.some(tile => tile.value <= 0 || tile.value >= 10)
}