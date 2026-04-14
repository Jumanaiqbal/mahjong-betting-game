/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
/* eslint-enable no-unused-vars */
import { useState } from 'react'
import TileCard from '../game/TileCard'
import HandHistory from '../game/HandHistory'
import BetButtons from '../game/BetButtons'
import { calculateHandTotal } from '../../lib/scoring'

/**
 * Game Screen - Modern gameplay interface matching reference design
 */
const GameScreen = ({
  state,
  onBet,
  onExit,
}) => {
  const [isBetting, setIsBetting] = useState(false)

  const handleBet = (direction) => {
    setIsBetting(true)
    onBet(direction)
    setTimeout(() => setIsBetting(false), 500)
  }

  const currentTotal = calculateHandTotal(state.currentHand)
  const targetTotal = state.previousHand ? calculateHandTotal(state.previousHand) : 0

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Bar */}
      <nav className="fixed top-0 w-full z-50 bg-surface-container-low flex justify-between items-center h-16 px-8 shadow-md border-b border-outline-variant/10">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-headline font-bold tracking-tighter text-primary uppercase">Mahjong Bet</span>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-tertiary hover:brightness-125 transition-all font-headline font-bold uppercase text-xs tracking-widest bg-tertiary-container/10 px-4 py-2 rounded-lg border border-tertiary/20 hover:border-tertiary/40"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>logout</span>
          Exit Game
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-16 pb-2 relative overflow-y-auto flex flex-col items-center flex-1">
        <div className="relative z-10 w-full max-w-6xl flex-1 flex flex-col p-4 gap-4">
          
          {/* Deck Management Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-panel p-3 rounded-lg border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-[8px] uppercase tracking-[0.15em] mb-0.5">Draw Pile</p>
                <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                  {state.drawPile.length}
                  <span className="text-xs font-normal opacity-40">/ 34</span>
                </h3>
              </div>
              <div className="w-10 h-12 bg-surface-container-highest rounded border border-outline-variant/30 flex items-center justify-center opacity-40">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>layers</span>
              </div>
            </div>

            <div className="glass-panel p-3 rounded-lg border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-[8px] uppercase tracking-[0.15em] mb-0.5">Discard Pile</p>
                <h3 className="text-lg font-headline font-bold text-on-surface-variant">
                  {state.discardPile.length}
                </h3>
              </div>
              <div className="w-10 h-12 bg-surface-container-low rounded border border-outline-variant/10 flex items-center justify-center opacity-20">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
              </div>
            </div>

            {/* Reshuffle Counter - Color Coded */}
            <div className={`glass-panel p-3 rounded-lg border border-white/5 flex items-center justify-between ${
              state.reshuffleCount === 0 ? 'border-on-surface/20' :
              state.reshuffleCount === 1 ? 'border-secondary/40' :
              state.reshuffleCount === 2 ? 'border-tertiary-container/40' :
              'border-tertiary/60'
            }`}>
              <div>
                <p className="text-on-surface-variant text-[8px] uppercase tracking-[0.15em] mb-0.5">Reshuffles</p>
                <h3 className={`text-lg font-headline font-bold ${
                  state.reshuffleCount === 0 ? 'text-on-surface' :
                  state.reshuffleCount === 1 ? 'text-secondary' :
                  state.reshuffleCount === 2 ? 'text-tertiary-container' :
                  'text-tertiary'
                }`}>
                  {state.reshuffleCount}/3
                </h3>
              </div>
              <div className={`w-10 h-12 rounded flex items-center justify-center text-lg font-bold ${
                state.reshuffleCount === 0 ? 'bg-on-surface/10 text-on-surface' :
                state.reshuffleCount === 1 ? 'bg-secondary/20 text-secondary' :
                state.reshuffleCount === 2 ? 'bg-tertiary-container/20 text-tertiary-container' :
                'bg-tertiary/30 text-tertiary'
              }`}>
                {state.reshuffleCount}
              </div>
            </div>
          </div>

          {/* Main Gameplay Area */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            
            {/* Result Banner */}
            {state.lastResult && (
              <motion.div
                className={`px-6 py-2 rounded-lg font-headline font-bold text-sm uppercase tracking-wide ${
                  state.lastResult === 'win' ? 'bg-primary/20 text-primary border border-primary/40' :
                  state.lastResult === 'lose' ? 'bg-tertiary/20 text-tertiary border border-tertiary/40' :
                  'bg-secondary/20 text-secondary border border-secondary/40'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {state.lastResult === 'win' ? '✓ Win!' : state.lastResult === 'lose' ? '✗ Loss!' : '○ Tie!'}
              </motion.div>
            )}

            {/* Active Hand Visual State - Tiles in Center */}
            <div className="relative w-full flex justify-center gap-2 flex-wrap">
              {state.currentHand && state.currentHand.map((tile, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <TileCard tile={tile} />
                </motion.div>
              ))}
            </div>

            {/* Current Hand Value Display */}
            <div className="flex items-center justify-center glass-panel px-6 py-2 rounded-full border border-white/5 jade-glow">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-headline text-on-surface-variant uppercase tracking-widest">Hand Total</span>
                <span className="text-2xl font-headline font-bold text-primary">{currentTotal}</span>
              </div>
            </div>

            {/* Betting Controls */}
            <div className="flex gap-2 w-full max-w-sm">
              <button
                onClick={() => handleBet('higher')}
                disabled={isBetting}
                className="flex-1 h-12 bg-gradient-to-br from-primary to-primary-container rounded-lg flex items-center justify-center gap-1 group relative overflow-hidden transition-all active:scale-95 shadow-[0_0_20px_rgba(89,222,155,0.2)] border border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="material-symbols-outlined text-on-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>expand_less</span>
                <span className="text-on-primary font-headline font-bold text-xs uppercase tracking-widest relative z-10">Higher</span>
              </button>
              
              <button
                onClick={() => handleBet('lower')}
                disabled={isBetting}
                className="flex-1 h-12 bg-surface-container-highest rounded-lg border border-outline-variant/10 flex items-center justify-center gap-1 group transition-all active:scale-95 hover:bg-surface-variant hover:border-outline-variant/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-on-surface/60 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>expand_more</span>
                <span className="text-on-surface font-headline font-bold text-xs uppercase tracking-widest">Lower</span>
              </button>
            </div>
          </div>

          {/* History Strip - Horizontal Scroll */}
          <div className="glass-panel p-3 rounded-2xl border border-white/5 w-full flex-shrink-0">
            <HandHistory history={state.history} />
          </div>
        </div>
      </main>
    </motion.div>
  )
}

export default GameScreen
