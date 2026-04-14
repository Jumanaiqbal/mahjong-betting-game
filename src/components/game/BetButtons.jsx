/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
/* eslint-enable no-unused-vars */
import Button from '../ui/Button'

/**
 * Bet Buttons Component - Higher/Lower bet selection
 * Displays two large bet buttons with clear visual feedback
 */
const BetButtons = ({ onBet, disabled = false }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <motion.div
      className="flex gap-4 justify-center items-center py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={buttonVariants}>
        <Button
          onClick={() => onBet('higher')}
          variant="primary"
          size="xl"
          disabled={disabled}
          className="gap-2 flex items-center"
        >
          <span>⬆️</span>
          <span>BET HIGHER</span>
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants}>
        <Button
          onClick={() => onBet('lower')}
          variant="danger"
          size="xl"
          disabled={disabled}
          className="gap-2 flex items-center"
        >
          <span>⬇️</span>
          <span>BET LOWER</span>
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default BetButtons
