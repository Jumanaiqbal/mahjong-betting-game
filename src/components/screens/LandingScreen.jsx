import { useState } from 'react'
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
/* eslint-enable no-unused-vars */
import { LEADERBOARD_SIZE } from '../../constants/game'

/**
 * Landing Screen - Modern Material 3 design with name input and leaderboard
 */
const LandingScreen = ({ onStart, leaderboard = [] }) => {
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState('')

  const handleStart = () => {
    if (!playerName.trim()) {
      setError('Please enter your name!')
      return
    }
    onStart(playerName)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleStart()
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
        {/* Main Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-8xl mb-4">🀄</div>
          <h1 className="font-headline text-6xl font-bold text-primary mb-2 uppercase tracking-tight">
            Mahjong
          </h1>
          <h2 className="font-headline text-5xl font-bold text-secondary mb-6 uppercase tracking-tight">
            Bet
          </h2>
          <p className="font-body text-xl text-on-surface-variant">
            Bet Higher or Lower to Win
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel rounded-2xl p-8 mb-8 shadow-2xl border border-white/5 w-full"
        >
          <div className="mb-6">
            <label className="block font-body text-sm text-on-surface-variant mb-3 uppercase tracking-widest">
              Enter Your Name
            </label>
            <input
              type="text"
              placeholder="Your name..."
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value)
                setError('')
              }}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 bg-surface-container border-2 border-outline-variant/30 rounded-lg text-on-surface font-body placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error mt-2 font-body text-sm"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            onClick={handleStart}
            className="w-full h-16 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center group relative overflow-hidden transition-all active:scale-95 shadow-[0_0_30px_rgba(89,222,155,0.3)] border border-primary/20"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="font-headline font-bold text-xl uppercase tracking-[0.2em] text-on-primary relative z-10">
              🎮 New Game
            </span>
          </button>
        </motion.div>

        {/* Leaderboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel rounded-2xl p-8 shadow-2xl border border-white/5 w-full"
        >
          <h3 className="font-headline text-2xl font-bold text-primary mb-6 uppercase tracking-wide">
            🏆 Top Scores
          </h3>

          {leaderboard.length === 0 ? (
            <p className="font-body text-center text-on-surface-variant py-4">
              No scores yet. Be the first!
            </p>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, LEADERBOARD_SIZE).map((entry, idx) => {
                const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between bg-surface-container px-4 py-3 rounded-lg border-l-4 border-primary/60"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{medals[idx]}</span>
                      <div>
                        <p className="font-headline font-bold text-on-surface">{entry.playerName}</p>
                        <p className="font-body text-sm text-on-surface-variant">{new Date(entry.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="font-headline text-xl font-bold text-primary">{entry.score}</p>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LandingScreen
