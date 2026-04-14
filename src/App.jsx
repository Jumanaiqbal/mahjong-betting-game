import useGameState from './hooks/useGameState'
import LandingScreen from './components/screens/LandingScreen'
import GameScreen from './components/screens/GameScreen'
import GameOverScreen from './components/screens/GameOverScreen'

function App() {
  const { state, startGame, placeBet, saveScore, exitGame } = useGameState()

  return (
    <div className="min-h-screen bg-gradient-to-b from-felt via-felt to-felt/80">
      {state.screen === 'landing' && (
        <LandingScreen
          onStart={startGame}
          leaderboard={state.leaderboard}
        />
      )}
      {state.screen === 'playing' && (
        <GameScreen
          state={state}
          onBet={placeBet}
          onExit={exitGame}
        />
      )}
      {state.screen === 'gameover' && (
        <GameOverScreen
          state={state}
          onSave={saveScore}
          onExit={exitGame}
        />
      )}
    </div>
  )
}

export default App