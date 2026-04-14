// All the tiles in the game

// Number tiles (value = face value, never changes)
const createNumberTiles = () => {
  const suits = ['Bamboo', 'Characters', 'Dots']
  const tiles = []

  suits.forEach(suit => {
    for (let number = 1; number <= 9; number++) {
      tiles.push({
        id: `${suit}-${number}`,
        name: `${number} ${suit}`,
        value: number,
        type: 'number',
        suit: suit
      })
    }
  })
  
  return tiles  // 27 tiles total
}


// Dragon tiles (value starts at 5, changes dynamically)
const createDragonTiles = () => [
  { id: 'dragon-red',   name: 'Red Dragon',   value: 5, type: 'dragon' },
  { id: 'dragon-green', name: 'Green Dragon', value: 5, type: 'dragon' },
  { id: 'dragon-white', name: 'White Dragon', value: 5, type: 'dragon' },
]

// Wind tiles (value starts at 5, changes dynamically)
const createWindTiles = () => [
  { id: 'wind-east',  name: 'East Wind',  value: 5, type: 'wind' },
  { id: 'wind-west',  name: 'West Wind',  value: 5, type: 'wind' },
  { id: 'wind-north', name: 'North Wind', value: 5, type: 'wind' },
  { id: 'wind-south', name: 'South Wind', value: 5, type: 'wind' },
]

// Create full deck — all tiles combined
// Total: 34 unique tiles (27 number + 3 dragons + 4 winds)
export const createDeck = () => {
  const deck = [
    ...createNumberTiles(),
    ...createDragonTiles(),
    ...createWindTiles(),
  ]
  return shuffleDeck(deck)
}

// Shuffle function (Fisher-Yates algorithm)
export const shuffleDeck = (deck) => {
  const shuffled = [...deck]  // copy, dont mutate original

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // swap
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}