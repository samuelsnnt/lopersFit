'use client'

import { useTheme } from '@/components/providers/ThemeProvider'

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  className = ''
}) {
  const { isDarkMode } = useTheme()

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-md hover:shadow-lg border-0'
      case 'secondary':
        return isDarkMode 
          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500 border border-slate-600' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500 border border-slate-200'
      case 'outline':
        return isDarkMode
          ? 'border-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 focus:ring-slate-500 bg-transparent'
          : 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-500 bg-transparent'
      default:
        return ''
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        py-3 px-6 rounded-xl font-semibold text-base
        focus:ring-2 focus:ring-offset-2 focus:outline-none
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        group whitespace-nowrap
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </button>
  )
}