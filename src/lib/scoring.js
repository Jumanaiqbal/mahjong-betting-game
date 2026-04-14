// Calculate total value of a hand
export const calculateHandTotal = (hand) => {
  return hand.reduce((sum, tile) => sum + tile.value, 0)
}

// Did player win their bet?
export const checkBetResult = (bet, currentTotal, newTotal) => {
  if (bet === 'higher') return newTotal > currentTotal
  if (bet === 'lower')  return newTotal < currentTotal
  return false
}

// Calculate points earned this round
export const calculatePoints = (playerWon, newHand) => {
  if (!playerWon) return 0

  const handTotal = calculateHandTotal(newHand)
  return handTotal  // you earn points equal to hand total
}

// Calculate final score (end of game)
export const calculateFinalScore = (score, roundsPlayed, streak) => {
  const streakBonus = streak * 10     // bonus for consecutive wins
  const roundBonus = roundsPlayed * 2 // bonus for surviving longer

  return score + streakBonus + roundBonus
}

// Check if its a tie (neither higher nor lower)
export const checkTie = (currentTotal, newTotal) => {
  return currentTotal === newTotal
}

// Leaderboard helpers
export const getLeaderboard = () => {
  const saved = localStorage.getItem('mahjong-leaderboard')
  return saved ? JSON.parse(saved) : []
}

export const saveToLeaderboard = (playerName, score) => {
  const leaderboard = getLeaderboard()

  // add new score
  leaderboard.push({ playerName, score, date: new Date().toLocaleDateString() })

  // sort highest first
  leaderboard.sort((a, b) => b.score - a.score)

  // keep only top 5
  const top5 = leaderboard.slice(0, 5)

  // save back
  localStorage.setItem('mahjong-leaderboard', JSON.stringify(top5))

  return top5
}