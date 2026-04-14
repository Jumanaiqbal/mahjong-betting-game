/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
/* eslint-enable no-unused-vars */

/**
 * Deck Pile Component - Visual representation of draw and discard piles
 * Shows stacked cards for draw pile and top card for discard pile
 */
const DeckPile = ({ drawCount = 0, discardPile = [], discardCount = 0 }) => {
  // Get top card from discard pile for display
  const topCard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null

  // Render stacked draw pile cards
  const renderDrawStack = () => {
    const stackSize = Math.min(3, Math.max(1, Math.ceil(drawCount / 12)))
    return Array.from({ length: stackSize }).map((_, idx) => (
      <motion.div
        key={idx}
        className="absolute w-16 h-24 bg-gradient-to-br from-card to-blue-900 border-2 border-accent rounded-lg shadow-lg"
        style={{
          right: idx * 4,
          top: idx * 4,
          zIndex: idx,
        }}
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 2,
          delay: idx * 0.2,
          repeat: Infinity,
        }}
      >
        {/* Card pattern */}
        <div className="absolute inset-0 flex items-center justify-center text-accent/30 text-2xl opacity-50">
          🀫
        </div>
      </motion.div>
    ))
  }

  return (
    <div className="flex justify-between items-end gap-8 px-4">
      {/* Draw Pile */}
      <div className="flex flex-col items-center">
        {/* Stacked cards */}
        <div className="relative w-20 h-28 mb-2">
          {renderDrawStack()}
        </div>
        
        {/* Card count */}
        <motion.div
          className="text-center"
          key={drawCount}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-inter text-sm text-accent font-bold">{drawCount}</p>
          <p className="text-inter text-xs text-gray-400">Draw</p>
        </motion.div>
      </div>

      {/* Discard Pile */}
      <div className="flex flex-col items-center">
        {topCard ? (
          <motion.div
            className="w-20 h-28 mb-2 rounded-lg bg-card border-4 border-white shadow-lg flex items-center justify-center text-4xl"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.3 }}
          >
            {topCard.id === 'dragon-red' && '🀄'}
            {topCard.id === 'dragon-green' && '🀅'}
            {topCard.id === 'dragon-white' && '🀆'}
            {topCard.id === 'wind-east' && '🀀'}
            {topCard.id === 'wind-west' && '🀁'}
            {topCard.id === 'wind-north' && '🀂'}
            {topCard.id === 'wind-south' && '🀃'}
            {topCard.type === 'number' && (
              <>
                {topCard.suit === 'Bamboo' && ['🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘'][topCard.value - 1]}
                {topCard.suit === 'Characters' && ['🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏'][topCard.value - 1]}
                {topCard.suit === 'Dots' && ['🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡'][topCard.value - 1]}
              </>
            )}
          </motion.div>
        ) : (
          <div className="w-20 h-28 mb-2 rounded-lg bg-card/50 border-4 border-dashed border-gray-600 flex items-center justify-center">
            <span className="text-2xl text-gray-600">-</span>
          </div>
        )}

        {/* Card count */}
        <motion.div
          className="text-center"
          key={discardCount}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-inter text-sm text-accent font-bold">{discardCount}</p>
          <p className="text-inter text-xs text-gray-400">Discard</p>
        </motion.div>
      </div>
    </div>
  )
}

export default DeckPile
