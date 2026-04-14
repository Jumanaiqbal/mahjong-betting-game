/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
/* eslint-enable no-unused-vars */

/**
 * Reusable button component with multiple variants and animations
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-gradient-to-r from-win to-emerald-500 text-white hover:shadow-lg hover:shadow-win/50',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-gradient-to-r from-lose to-red-600 text-white hover:shadow-lg hover:shadow-lose/50',
    accent: 'bg-accent text-white hover:bg-purple-500',
    ghost: 'text-white border-2 border-white hover:bg-white hover:bg-opacity-10',
  }

  // Size styles
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
    xl: 'px-12 py-5 text-xl font-bold',
  }

  const baseClasses = 'rounded-lg font-inter font-semibold transition-all duration-200'
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
