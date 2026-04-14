/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
/* eslint-enable no-unused-vars */
import TileCard from './TileCard'

/**
 * Hand History Component - Shows recent 6 past hands with tiles and values
 */
const HandHistory = ({ history = [] }) => {
  // Show only the most recent 6 hands
  const recentHistory = history.slice(-6)

  if (recentHistory.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-headline font-bold uppercase tracking-[0.3em] text-on-surface">📋 History</h4>
          <div className="flex items-center gap-4 text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Win
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span> Loss
            </div>
          </div>
        </div>
        <p className="text-on-surface-variant text-sm">No hands played yet</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm font-headline font-bold uppercase tracking-[0.3em] text-on-surface">
          📋 History (Recent {recentHistory.length}/{history.length})
        </h4>
        <div className="flex items-center gap-4 text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Win
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span> Loss
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 flex-nowrap">
        {recentHistory.map((hand, idx) => {
          const totalHandCount = history.length
          const handNumber = totalHandCount - (recentHistory.length - idx - 1)
          const isWin = hand.result === 'win'
          const isLoss = hand.result === 'lose'
          
          return (
            <motion.div
              key={idx}
              className={`flex-shrink-0 bg-surface-container-low px-3 py-2 rounded-lg flex flex-col items-center justify-center gap-1 border-l-4 min-w-fit ${
                isWin ? 'border-primary/60' : isLoss ? 'border-tertiary/40' : 'border-secondary/40'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
            >
              {/* Hand number */}
              <span className="font-headline font-bold text-on-surface/60 text-xs whitespace-nowrap">
                #{handNumber}
              </span>
              
              {/* Tiles preview - compact */}
              <div className="flex gap-1">
                {hand.tiles.map((tile, tIdx) => (
                  <TileCard key={tIdx} tile={tile} small={true} />
                ))}
              </div>

              {/* Value and Result - stacked vertical */}
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-xs font-headline font-bold text-primary">{hand.value}</p>
                <p className={`text-[9px] font-bold ${
                  isWin ? 'text-primary' : isLoss ? 'text-tertiary' : 'text-secondary'
                }`}>
                  {isWin ? '✓' : isLoss ? '✗' : '○'}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default HandHistory
