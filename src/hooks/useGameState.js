import { useState } from 'react'
import { createDeck } from '../lib/tiles'
import { HAND_SIZE, MAX_RESHUFFLE, MIN_TILE_VALUE, MAX_TILE_VALUE } from '../constants/game'
import { 
  drawTiles, 
  discardHand, 
  reshuffle, 
  needsReshuffle
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
  tileValueMap: {},
}

const useGameState = () => {
  const [state, setState] = useState(initialState)

  const startGame = (playerName) => {
    const deck = createDeck()
    const { drawnTiles, remaining } = drawTiles(deck, HAND_SIZE)
    
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

    // Ensure hand stays full even if pile empties mid-draw.
    let workingDrawPile = [...drawPile]
    let workingDiscardPile = [...discardPile]
    let newReshuffleCount = reshuffleCount
    const newHand = []

    while (newHand.length < HAND_SIZE) {
      const missingTiles = HAND_SIZE - newHand.length
      const { drawnTiles, remaining } = drawTiles(workingDrawPile, missingTiles)
      newHand.push(...drawnTiles)
      workingDrawPile = remaining

      if (newHand.length < HAND_SIZE) {
        if (!needsReshuffle(workingDrawPile)) {
          break
        }

        workingDrawPile = reshuffle(workingDiscardPile)
        workingDiscardPile = []
        newReshuffleCount += 1
      }
    }

    const currentTotal = calculateHandTotal(currentHand)
    const newTotal = calculateHandTotal(newHand)

    const isTie = checkTie(currentTotal, newTotal)
    const playerWon = isTie ? false : checkBetResult(bet, currentTotal, newTotal)
    const lastResult = isTie ? 'tie' : playerWon ? 'win' : 'lose'

    const points = calculatePoints(playerWon, newHand)
    const newScore = score + points

    const newTileValueMap = { ...tileValueMap }
    currentHand.forEach(tile => {
      if (tile.type !== 'number' && !isTie) {
        const newValue = playerWon ? tile.value + 1 : tile.value - 1
        newTileValueMap[tile.id] = newValue
      }
    })

    const applyTileValues = (tiles) => 
      tiles.map(tile => 
        tile.type !== 'number' && tile.id in newTileValueMap 
          ? { ...tile, value: newTileValueMap[tile.id] }
          : tile
      )

    const updatedNewHand = applyTileValues(newHand)
    const updatedDrawPile = applyTileValues(workingDrawPile)
    const updatedDiscardPile = applyTileValues(discardHand(workingDiscardPile, currentHand))

    let finalDrawPile = updatedDrawPile
    let finalDiscardPile = updatedDiscardPile

    if (needsReshuffle(updatedDrawPile)) {
      finalDrawPile = reshuffle(updatedDiscardPile)
      finalDiscardPile = []
      newReshuffleCount += 1
    }

    const newHistory = [
      ...history,
      { tiles: currentHand, value: currentTotal, result: lastResult }
    ]

    const tileGameOver = Object.values(newTileValueMap).some(
      (value) => value <= MIN_TILE_VALUE || value >= MAX_TILE_VALUE
    )
    const deckGameOver = newReshuffleCount >= MAX_RESHUFFLE
    const isGameOver = tileGameOver || deckGameOver

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