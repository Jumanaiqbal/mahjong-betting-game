import { useState } from 'react'
import { createDeck } from '../lib/tiles'
import { 
  drawTiles, 
  discardHand, 
  reshuffle, 
  needsReshuffle,
  checkTileGameOver 
} from '../lib/deck'
import { 
  calculateHandTotal,
  checkBetResult,
  calculatePoints,
  calculateFinalScore,
  checkTie,
  getLeaderboard,
  saveToLeaderboard
} from '../lib/scoring'

const initialState = {
  screen: 'landing',
  drawPile: [],
  discardPile: [],
  currentHand: [],
  score: 0,
  roundsPlayed: 0,
  reshuffleCount: 0,
  history: [],
  lastResult: null,
  leaderboard: getLeaderboard(),
  playerName: '',
  tileValueMap: {}, // tiles: id -> value mapping
}

const useGameState = () => {
  const [state, setState] = useState(initialState)

  const startGame = (playerName) => {
    const deck = createDeck()
    const { drawnTiles, remaining } = drawTiles(deck, 3)
    
    // Map tile IDs to their values (for tracking dragon/wind changes)
    const tileValueMap = Object.fromEntries(
      deck.map(tile => [tile.id, tile.value])
    )

    setState({
      ...initialState,
      screen: 'playing',
      playerName: playerName,
      drawPile: remaining,
      currentHand: drawnTiles,
      discardPile: [],
      tileValueMap: tileValueMap,
      leaderboard: getLeaderboard(),
    })
  }

  const placeBet = (bet) => {
    const { 
      drawPile, 
      discardPile,
      currentHand, 
      score, 
      roundsPlayed,
      reshuffleCount,
      history,
      tileValueMap
    } = state

    // Draw new hand
    const { drawnTiles: newHand, remaining } = drawTiles(drawPile, 3)

    // Calculate hand totals
    const currentTotal = calculateHandTotal(currentHand)
    const newTotal = calculateHandTotal(newHand)

    // Check bet result
    const isTie = checkTie(currentTotal, newTotal)
    const playerWon = isTie ? false : checkBetResult(bet, currentTotal, newTotal)
    const lastResult = isTie ? 'tie' : playerWon ? 'win' : 'lose'

    // Calculate score
    const points = calculatePoints(playerWon, newHand)
    const newScore = score + points

    // Update tile values
    const newTileValueMap = { ...tileValueMap }
    currentHand.forEach(tile => {
      if (tile.type !== 'number') {
        const newValue = playerWon ? tile.value + 1 : tile.value - 1
        newTileValueMap[tile.id] = newValue
      }
    })

    // Helper: apply tileValueMap values to tiles
    const applyTileValues = (tiles) => 
      tiles.map(tile => 
        tile.type !== 'number' && tile.id in newTileValueMap 
          ? { ...tile, value: newTileValueMap[tile.id] }
          : tile
      )

    // Apply updates to collections
    const updatedNewHand = applyTileValues(newHand)
    const updatedDrawPile = applyTileValues(remaining)
    const updatedDiscardPile = applyTileValues(discardHand(discardPile, currentHand))

    // Check reshuffle needed
    let finalDrawPile = updatedDrawPile
    let finalDiscardPile = updatedDiscardPile
    let newReshuffleCount = reshuffleCount

    if (needsReshuffle(updatedDrawPile)) {
      finalDrawPile = reshuffle(updatedDiscardPile)
      finalDiscardPile = []
      newReshuffleCount = reshuffleCount + 1
    }

    // Add to history
    const newHistory = [
      ...history,
      { tiles: currentHand, value: currentTotal, result: lastResult }
    ]

    // Check game over
    const tileGameOver = checkTileGameOver([...finalDrawPile, ...updatedNewHand])
    const deckGameOver = newReshuffleCount >= 3
    const isGameOver = tileGameOver || deckGameOver

    // Update state
    setState(prev => ({
      ...prev,
      drawPile: finalDrawPile,
      discardPile: finalDiscardPile,
      currentHand: updatedNewHand,
      score: newScore,
      roundsPlayed: roundsPlayed + 1,
      reshuffleCount: newReshuffleCount,
      history: newHistory,
      lastResult: lastResult,
      screen: isGameOver ? 'gameover' : 'playing',
      tileValueMap: newTileValueMap,
    }))
  }

  const saveScore = () => {
    const { playerName, score, roundsPlayed } = state
    const finalScore = calculateFinalScore(score, roundsPlayed)
    const newLeaderboard = saveToLeaderboard(playerName, finalScore)

    setState(prev => ({
      ...prev,
      leaderboard: newLeaderboard,
      screen: 'landing',
    }))
  }

  const exitGame = () => {
    setState(prev => ({ ...prev, screen: 'landing' }))
  }

  return {
    state,
    startGame,
    placeBet,
    saveScore,
    exitGame,
  }
}

export default useGameState