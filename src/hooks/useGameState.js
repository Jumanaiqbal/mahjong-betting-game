import { useState } from 'react'
import { createDeck } from '../lib/tiles'
import { 
  drawTiles, 
  discardHand, 
  reshuffle, 
  needsReshuffle,
  updateTileValues,
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
  streak: 0,
  history: [],
  lastResult: null,
  leaderboard: getLeaderboard(),
  playerName: '',
}

const useGameState = () => {
  const [state, setState] = useState(initialState)

  // ─── START GAME ────────────────────────────────────
  const startGame = (playerName) => {
    const deck = createDeck()
    const { drawnTiles, remaining } = drawTiles(deck, 3)

    setState({
      ...initialState,
      screen: 'playing',
      playerName: playerName,
      drawPile: remaining,      // 31 tiles
      currentHand: drawnTiles,  // 3 tiles
      discardPile: [],          // empty
      leaderboard: getLeaderboard(),
    })
  }

  // ─── PLACE BET ─────────────────────────────────────
  const placeBet = (bet) => {
    const { 
      drawPile, 
      discardPile,
      currentHand, 
      score, 
      roundsPlayed,
      reshuffleCount,
      streak,
      history 
    } = state

    // 1. draw new hand
    const { drawnTiles: newHand, remaining } = drawTiles(drawPile, 3)

    // 2. calculate totals
    const currentTotal = calculateHandTotal(currentHand)
    const newTotal = calculateHandTotal(newHand)

    // 3. check result
    const isTie = checkTie(currentTotal, newTotal)
    const playerWon = isTie ? false : checkBetResult(bet, currentTotal, newTotal)
    const lastResult = isTie ? 'tie' : playerWon ? 'win' : 'lose'

    // 4. calculate new score
    const points = calculatePoints(playerWon, newHand)
    const newScore = score + points

    // 5. update streak
    const newStreak = playerWon ? streak + 1 : 0

    // 6. update tile values in remaining draw pile + discard
    const updatedDraw = updateTileValues(remaining, newHand, playerWon)
    const updatedDiscard = updateTileValues(
      discardHand(discardPile, currentHand),  // old hand → discard
      newHand,
      playerWon
    )

    // 7. check reshuffle
    let finalDrawPile = updatedDraw
    let finalDiscardPile = updatedDiscard   // ← track discard separately
    let newReshuffleCount = reshuffleCount

    if (needsReshuffle(updatedDraw)) {
      finalDrawPile = reshuffle(updatedDiscard)  // discard → draw pile
      finalDiscardPile = []                       // ← clear discard!
      newReshuffleCount = reshuffleCount + 1
    }

    // 8. add current hand to history
    const newHistory = [
      ...history,
      { tiles: currentHand, value: currentTotal, result: lastResult }
    ]

    // 9. check game over
    const tileGameOver = checkTileGameOver([...finalDrawPile, ...newHand])
    const deckGameOver = newReshuffleCount >= 3
    const isGameOver = tileGameOver || deckGameOver

    // 10. update state!
    setState(prev => ({
      ...prev,
      drawPile: finalDrawPile,
      discardPile: finalDiscardPile,         // ← use this now!
      currentHand: newHand,
      score: newScore,
      roundsPlayed: roundsPlayed + 1,
      reshuffleCount: newReshuffleCount,
      streak: newStreak,
      history: newHistory,
      lastResult: lastResult,
      screen: isGameOver ? 'gameover' : 'playing',
    }))
  }

  // ─── SAVE SCORE ────────────────────────────────────
  const saveScore = () => {
    const { playerName, score, roundsPlayed, streak } = state
    const finalScore = calculateFinalScore(score, roundsPlayed, streak)
    const newLeaderboard = saveToLeaderboard(playerName, finalScore)

    setState(prev => ({
      ...prev,
      leaderboard: newLeaderboard,
      screen: 'landing',
    }))
  }

  // ─── EXIT ──────────────────────────────────────────
  const exitGame = () => {
    setState(prev => ({ ...prev, screen: 'landing' }))
  }

  // ─── RETURN ────────────────────────────────────────
  return {
    state,
    startGame,
    placeBet,
    saveScore,
    exitGame,
  }
}

export default useGameState