/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
/* eslint-enable no-unused-vars */
import { useState, useEffect } from 'react'

/**
 * Game Over Screen - Modern Material design with score animation
 */
const GameOverScreen = ({ state, onSave, onExit }) => {
  const [displayScore, setDisplayScore] = useState(0)
  const [showStats, setShowStats] = useState(false)

  // Animate score counting up
  useEffect(() => {
    let interval
    if (displayScore < state.score) {
      interval = setInterval(() => {
        setDisplayScore(prev => {
          const next = prev + Math.ceil((state.score - prev) / 10)
          return next > state.score ? state.score : next
        })
      }, 30)
    }
    return () => clearInterval(interval)
  }, [state.score, displayScore])

  // Show stats when score animation completes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (displayScore >= state.score) {
      setShowStats(true)
    }
  }, [displayScore, state.score])
  /* eslint-enable react-hooks/set-state-in-effect */

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
        {/* Game Over Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-headline text-7xl font-bold text-primary mb-4 uppercase tracking-tight">
            Game Over!
          </h1>
          <p className="font-body text-2xl text-on-surface-variant">
            Well played, <span className="text-secondary font-bold">{state.playerName}</span>!
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel border border-white/5 rounded-2xl p-12 mb-8 shadow-2xl text-center w-full"
        >
          <p className="font-body text-on-surface-variant text-lg mb-4 uppercase tracking-widest">Final Score</p>
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="font-headline text-8xl font-bold text-primary mb-4">
              {displayScore}
            </p>
          </motion.div>

          {/* Stats - fade in after score */}
          {showStats && (
            <motion.div
              className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-outline-variant/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <p className="font-body text-sm text-on-surface-variant mb-2 uppercase tracking-widest">Rounds Played</p>
                <motion.p
                  className="font-headline text-4xl font-bold text-primary"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {state.roundsPlayed}
                </motion.p>
              </div>

              <div>
                <p className="font-body text-sm text-on-surface-variant mb-2 uppercase tracking-widest">Reshuffles Used</p>
                <motion.p
                  className="font-headline text-4xl font-bold text-tertiary"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {state.reshuffleCount}
                </motion.p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        {showStats && (
          <motion.div
            className="flex gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={onSave}
              className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container rounded-xl font-headline font-bold uppercase text-on-primary shadow-[0_0_30px_rgba(89,222,155,0.3)] border border-primary/20 hover:brightness-110 transition-all active:scale-95"
            >
              🏆 Save Score
            </button>

            <button
              onClick={onExit}
              className="px-8 py-4 bg-surface-container-highest rounded-xl font-headline font-bold uppercase text-on-surface border border-outline-variant/20 hover:bg-surface-variant transition-all active:scale-95"
            >
              🏠 Exit
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default GameOverScreen
