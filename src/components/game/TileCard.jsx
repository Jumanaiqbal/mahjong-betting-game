/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
/* eslint-enable no-unused-vars */
import { ANIMATION_TIMING } from '../../constants/game'

// Material Icon mapping for tiles
const TILE_ICONS = {
  'Bamboo': 'account_tree',
  'Characters': 'grid_3x3',
  'Dots': 'grid_view',
  'dragon': 'potted_plant',
  'wind': 'air',
}

// Get icon for tile
const getTileIcon = (tile) => {
  if (tile.type === 'number') {
    return TILE_ICONS[tile.suit]
  }
  if (tile.type === 'dragon') return TILE_ICONS.dragon
  if (tile.type === 'wind')   return TILE_ICONS.wind
  return 'dashboard'
}

// Get color for tile type
const getTileColor = (tile) => {
  if (tile.type === 'dragon') return 'text-tertiary'
  if (tile.type === 'wind')   return 'text-primary'
  if (tile.suit === 'Dots')   return 'text-secondary'
  return 'text-on-surface/80'
}

// Get border color for tile type
const getTileBorderColor = (tile) => {
  if (tile.type === 'dragon') return 'border-tertiary'
  if (tile.type === 'wind')   return 'border-primary'
  return 'border-outline-variant'
}

/**
 * Tile Card Component - Displays a single mahjong tile with Material Icon and value
 * Supports both large (in-hand) and small (history) versions
 */
const TileCard = ({ tile, small = false, isResult = false, result = null }) => {
  const icon = getTileIcon(tile)
  const iconColor = getTileColor(tile)
  const borderColor = getTileBorderColor(tile)

  // Large tile for hand display
  if (!small) {
    return (
      <motion.div
        className={`relative w-28 md:w-32 h-40 md:h-44 rounded-lg border ${borderColor}/30 bg-surface-bright tile-face shadow-lg flex flex-col items-center justify-between p-4`}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: ANIMATION_TIMING.TILE_FLIP }}
        whileHover={{ y: -8 }}
      >
        {/* Tile label */}
        <span className="self-start text-[10px] font-headline font-bold uppercase tracking-wider text-on-surface/60">
          {tile.type === 'dragon' ? 'Dragon' : tile.type === 'wind' ? 'Wind' : tile.suit}
        </span>

        {/* Material Icon display */}
        <span className={`material-symbols-outlined text-5xl ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>

        {/* Tile value */}
        <span className="text-primary font-headline text-xl font-bold">
          {tile.value}
        </span>
      </motion.div>
    )
  }

  // Small tile for history strip
  return (
    <motion.div
      className={`w-7 h-10 rounded border ${borderColor}/20 tile-face flex items-center justify-center`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <span className={`material-symbols-outlined text-sm ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
    </motion.div>
  )
}

export default TileCard
